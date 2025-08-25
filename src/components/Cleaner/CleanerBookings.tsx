"use client"

import React, { useState, useEffect, useMemo } from "react"
import { apiService } from "@/api/services"
import type { BookingRecord } from "@/api/types"
import { useAuth } from "@/hooks/useAuth"
import toast from "react-hot-toast"

import { Modal } from "@/components/shared/Modal"
import { Button } from "@/components/shared/button"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

import {
  FiSearch,
  FiFilter,
  FiChevronUp,
  FiChevronDown,
  FiCreditCard,
  FiCopy
} from "react-icons/fi"
import { Calendar, Clock, MapPin, DollarSign, Upload, CheckCircle } from "lucide-react"

const ITEMS_PER_PAGE = 10

type SortField = "serviceDate" | "customerName" | "totalPrice" | "status"

export default function CleanerBookings() {
  const [bookings, setBookings] = useState<BookingRecord[]>([])
  const [loading, setLoading] = useState(true)

  // UI state (to mirror ServiceAreas patterns)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "completed" | "pending">("all")
  const [sortField, setSortField] = useState<SortField>("serviceDate")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [currentPage, setCurrentPage] = useState(1)

  // Payment modal state
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null)
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [processingPayment, setProcessingPayment] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)

  const { user } = useAuth()

  // Mock HAAT account details (same from your version)
  const haatAccountDetails = {
    accountName: "HAAT Cleaning Services Ltd",
    bankName: "First Bank of Nigeria",
    accountNumber: "1234567890",
    sortCode: "011-234-567",
  }

  const fetchAssignedBookings = async () => {
    try {
      setLoading(true)
      const data = await apiService.getAllAssignedBookings()
      const myBookings = data.filter(b => b.assignedCleanerId === user?.userId)
      setBookings(myBookings)
    } catch (error) {
      console.error("Error fetching bookings:", error)
      toast.error("Failed to fetch your assigned bookings")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAssignedBookings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <FiChevronUp className="w-4 h-4 text-gray-400" />
    return sortDirection === "asc" ? (
      <FiChevronUp className="w-4 h-4 text-gray-600" />
    ) : (
      <FiChevronDown className="w-4 h-4 text-gray-600" />
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "assigned":
        return <Badge variant="default" className="bg-blue-500">Assigned</Badge>
      case "paid":
        return <Badge variant="default" className="bg-green-500">Paid</Badge>
      case "completed":
        return <Badge variant="default" className="bg-emerald-500">Completed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const filteredSorted = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    let list = bookings.filter(b => {
      const matchesSearch =
        !term ||
        b.bookingId?.toString().toLowerCase().includes(term) ||
        b.customerName?.toLowerCase().includes(term) ||
        b.customerEmail?.toLowerCase().includes(term) ||
        b.customerPhone?.toLowerCase().includes(term) ||
        b.customerAddress?.toLowerCase().includes(term)

      const matchesStatus = !statusFilter || b.status?.toLowerCase() === statusFilter

      return matchesSearch && matchesStatus
    })

    list = list.sort((a, b) => {
      let aVal: string | number = ""
      let bVal: string | number = ""
      switch (sortField) {
        case "serviceDate":
          aVal = new Date(a.serviceDate).getTime()
          bVal = new Date(b.serviceDate).getTime()
          break
        case "customerName":
          aVal = (a.customerName || "").toLowerCase()
          bVal = (b.customerName || "").toLowerCase()
          break
        case "totalPrice":
          aVal = Number(a.totalPrice) || 0
          bVal = Number(b.totalPrice) || 0
          break
        case "status":
          aVal = (a.status || "").toLowerCase()
          bVal = (b.status || "").toLowerCase()
          break
      }
      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1
      return 0
    })

    return list
  }, [bookings, searchTerm, statusFilter, sortField, sortDirection])

  const paginated = filteredSorted.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
  const totalPages = Math.max(1, Math.ceil(filteredSorted.length / ITEMS_PER_PAGE))

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setProofFile(file)
  }

  const handleProcessPayment = async () => {
    if (!selectedBooking || !proofFile) {
      toast.error("Please select a proof of payment file")
      return
    }

    try {
      setProcessingPayment(true)
      await apiService.markBookingAsPaid(selectedBooking.bookingId, proofFile)
      toast.success("Payment processed successfully")
      await fetchAssignedBookings()
      setSelectedBooking(null)
      setProofFile(null)
      setIsPaymentModalOpen(false)
    } catch (error) {
      console.error("Error processing payment:", error)
      toast.error("Failed to process payment")
    } finally {
      setProcessingPayment(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard!")
  }

  return (
    <div className="p-4 md:p-6 font-body">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-heading">My Assigned Bookings</h1>
            <p className="text-gray-600 mt-1">View and manage bookings assigned to you.</p>
          </div>
          <div className="text-sm text-gray-500">Total: {bookings.length} bookings</div>
        </div>

        {/* Controls (search + filter) */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-4 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search bookings (ID, name, email, phone, address)..."
                value={searchTerm}
                onChange={(e) => { setCurrentPage(1); setSearchTerm(e.target.value) }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
            <div className="flex items-center gap-2">
              <FiFilter className="w-4 h-4 text-gray-500" />
              <Select
                value={statusFilter}
                onValueChange={(val) => {
                  setCurrentPage(1)
                  setStatusFilter(val as typeof statusFilter)
                }}
              >
                <SelectTrigger className="w-[200px] border-gray-300 focus:ring-2 focus:ring-gold">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">All Statuses</SelectItem>
                  {/* <SelectItem value="assigned">Assigned</SelectItem> */}
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableCell>
                    <button
                      onClick={() => handleSort("serviceDate")}
                      className="flex items-center gap-2 text-sm font-medium text-gray-900"
                    >
                      Date / Time
                      <SortIcon field="serviceDate" />
                    </button>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleSort("customerName")}
                      className="flex items-center gap-2 text-sm font-medium text-gray-900"
                    >
                      Customer
                      <SortIcon field="customerName" />
                    </button>
                  </TableCell>
                  <TableCell className="text-sm font-medium text-gray-900">Address</TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleSort("status")}
                      className="flex items-center gap-2 text-sm font-medium text-gray-900"
                    >
                      Status
                      <SortIcon field="status" />
                    </button>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleSort("totalPrice")}
                      className="flex items-center gap-2 text-sm font-medium text-gray-900"
                    >
                      Amount
                      <SortIcon field="totalPrice" />
                    </button>
                  </TableCell>
                  <TableCell className="text-center text-sm font-medium text-gray-900">Actions</TableCell>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      Loading your bookings...
                    </TableCell>
                  </TableRow>
                ) : paginated.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="px-6 py-8">
                      <div className="flex flex-col items-center justify-center text-center text-gray-500">
                        <Calendar className="h-12 w-12 text-gray-400 mb-3" />
                        <p>No bookings found.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((b) => (
                    <TableRow key={b.bookingId} className="hover:bg-gray-50">
                      <TableCell className="p-3 text-sm text-gray-700">
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900">
                              {new Date(b.serviceDate).toLocaleDateString()}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {new Date(b.serviceDate).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="p-3 text-sm text-gray-700">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">{b.customerName}</span>
                          <span className="text-xs text-gray-500">{b.customerEmail}</span>
                          <span className="text-xs text-gray-500">{b.customerPhone}</span>
                        </div>
                      </TableCell>
                      <TableCell className="p-3 text-sm text-gray-700">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-gray-400" />
                          {b.customerAddress}
                        </span>
                      </TableCell>
                      <TableCell className="p-3 text-sm">{getStatusBadge(b.status)}</TableCell>
                      <TableCell className="p-3 text-sm font-semibold text-gray-900">
                        ${Number(b.totalPrice || 0).toFixed(2)}
                      </TableCell>
                      <TableCell className="p-3">
                        <div className="flex items-center justify-center">
                          {b.status?.toLowerCase() === "assigned" ? (
                            <Button
                              label="Process Payment"
                              variant="primary"
                              icon={<FiCreditCard />}
                              onClick={() => {
                                setSelectedBooking(b)
                                setIsPaymentModalOpen(true)
                              }}
                            />
                          ) : (
                            <span className="text-xs text-gray-500">—</span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="p-4 flex items-center justify-between border-t border-gray-200">
            <Button
              label="Previous"
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            />
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              label="Next"
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            />
          </div>
        </div>
      </div>

      {/* Payment Processing Modal */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false)
          setSelectedBooking(null)
          setProofFile(null)
        }}
        title="Process Payment"
        size="lg"
      >
        {selectedBooking && (
          <div className="space-y-6">
            {/* Booking Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Booking Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Booking ID:</span>
                  <span className="ml-2 font-medium">{selectedBooking.bookingId}</span>
                </div>
                <div>
                  <span className="text-gray-600">Amount:</span>
                  <span className="ml-2 font-medium text-green-600">
                    ${Number(selectedBooking.totalPrice || 0).toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Customer:</span>
                  <span className="ml-2 font-medium">{selectedBooking.customerName}</span>
                </div>
                <div>
                  <span className="text-gray-600">Service Date:</span>
                  <span className="ml-2 font-medium">
                    {new Date(selectedBooking.serviceDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* HAAT Account Details */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-3 flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                HAAT Account Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-blue-800">Account Name:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{haatAccountDetails.accountName}</span>
                    <button
                      onClick={() => copyToClipboard(haatAccountDetails.accountName)}
                      className="p-1 hover:bg-blue-200 rounded"
                      title="Copy"
                    >
                      <FiCopy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-800">Bank Name:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{haatAccountDetails.bankName}</span>
                    <button
                      onClick={() => copyToClipboard(haatAccountDetails.bankName)}
                      className="p-1 hover:bg-blue-200 rounded"
                      title="Copy"
                    >
                      <FiCopy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-800">Account Number:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium font-mono">{haatAccountDetails.accountNumber}</span>
                    <button
                      onClick={() => copyToClipboard(haatAccountDetails.accountNumber)}
                      className="p-1 hover:bg-blue-200 rounded"
                      title="Copy"
                    >
                      <FiCopy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-800">Sort Code:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium font-mono">{haatAccountDetails.sortCode}</span>
                    <button
                      onClick={() => copyToClipboard(haatAccountDetails.sortCode)}
                      className="p-1 hover:bg-blue-200 rounded"
                      title="Copy"
                    >
                      <FiCopy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-3">
              <Label htmlFor="payment-receipt">Upload Payment Receipt</Label>
              <Input
                id="payment-receipt"
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              {proofFile && (
                <p className="text-sm text-green-600 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  File selected: {proofFile.name}
                </p>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                label="Cancel"
                variant="outline"
                onClick={() => {
                  setIsPaymentModalOpen(false)
                  setSelectedBooking(null)
                  setProofFile(null)
                }}
                className="flex-1"
              />
              <Button
                label={processingPayment ? "Processing..." : "Mark as Paid"}
                variant="primary"
                onClick={handleProcessPayment}
                disabled={!proofFile || processingPayment}
                icon={processingPayment ? <Upload className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                className="flex-1"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
