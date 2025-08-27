"use client"

import React, { useState, useEffect, useMemo } from "react"
import { apiService } from "@/api/services"
import type { BankDetails, CleanerAssignment } from "@/api/types"
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
  FiCopy,
  FiEye
} from "react-icons/fi"
import { Calendar, Clock, MapPin, DollarSign, Upload, CheckCircle } from "lucide-react"

const ITEMS_PER_PAGE = 10

type SortField = "serviceDate" | "customerName" | "totalPrice" | "status"

/** Shape returned by /api/Bookings/details/{id} per your example payload */
interface BookingDetails {
  bookingId: string
  serviceAreaId: string
  serviceArea: {
    serviceAreaId: string
    areaName: string
    postalCode: string
    dateCreated: string
    userCreated: string | null
    dateModified: string
    userModified: string | null
  } | null
  serviceTypeId: string
  serviceType: {
    serviceTypeId: string
    name: string
    description: string
    price: number
    dateCreated: string
    userCreated: string | null
    dateModified: string
    userModified: string | null
  } | null
  serviceFrequencyId: string
  serviceFrequency: {
    serviceFrequencyId: string
    frequency: string
    discountPercentage: number
    dateCreated: string
    userCreated: string | null
    dateModified: string
    userModified: string | null
  } | null
  serviceDate: string
  serviceTime: string
  status: string
  isPaid: boolean
  proofOfPayment: string | null
  totalPrice: number
  details: string | null
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  customerCity: string
  serviceDetails: Array<{
    serviceOptionId: string
    quantity: number
  }> | null
  dateCreated: string
  userCreated: string | null
  dateModified: string
  userModified: string | null
}

const CleanerBookings: React.FC = () => {
  const [assignments, setAssignments] = useState<CleanerAssignment[]>([])
  const [loading, setLoading] = useState(true)

  // UI state
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "completed" | "pending" | "assigned">("all")
  const [sortField, setSortField] = useState<SortField>("serviceDate")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [currentPage, setCurrentPage] = useState(1)

  // Payment modal state
  const [selectedAssignment, setSelectedAssignment] = useState<CleanerAssignment | null>(null)
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [processingPayment, setProcessingPayment] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null)

  // Details modal state
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [details, setDetails] = useState<BookingDetails | null>(null)

  const { user } = useAuth()

  const fetchCleanerData = async () => {
    if (!user?.userId) {
      toast.error("Could not verify your identity. Please try logging in again.")
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      const [assignmentData, bankDetailsData] = await Promise.all([
        apiService.getCleanerAssignedBookings(user.userId) as unknown as Promise<CleanerAssignment[]>,
        apiService.getAllBankDetails(),
      ])

      setAssignments(Array.isArray(assignmentData) ? assignmentData : [])
      if (Array.isArray(bankDetailsData) && bankDetailsData.length > 0) {
        setBankDetails(bankDetailsData[0])
      } else {
        setBankDetails(null)
      }
    } catch (error) {
      console.error("Error fetching cleaner data:", error)
      toast.error("Failed to fetch your assigned bookings.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.userId) {
      void fetchCleanerData()
    }
    const onPaid = () => void fetchCleanerData()
    window.addEventListener("booking:paid", onPaid as EventListener)
    return () => {
      window.removeEventListener("booking:paid", onPaid as EventListener)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.userId])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
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

  const normalizedStatus = (s: string): "pending" | "assigned" | "paid" | "completed" | string => {
    const v = (s || "").toLowerCase()
    if (v === "confirmed") return "assigned"
    return v
  }

  const getStatusBadge = (status: string) => {
    const s = normalizedStatus(status)
    switch (s) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "assigned":
        return <Badge variant="default" className="bg-blue-500">Assigned</Badge>
      case "paid":
        return <Badge variant="default" className="bg-green-500">Paid</Badge>
      case "completed":
        return <Badge variant="default" className="bg-emerald-500">Completed</Badge>
      default:
        return <Badge variant="outline">{status || "Unknown"}</Badge>
    }
  }

  const filteredSorted = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    let list = (Array.isArray(assignments) ? assignments : []).filter((a) => {
      const b = a.booking
      const matchesSearch =
        !term ||
        a.bookingAssignmentId.toLowerCase().includes(term) ||
        b.bookingId.toLowerCase().includes(term) ||
        (b.customerName || "").toLowerCase().includes(term) ||
        (b.customerEmail || "").toLowerCase().includes(term) ||
        (b.customerPhone || "").toLowerCase().includes(term) ||
        (b.customerAddress || "").toLowerCase().includes(term)

      const s = normalizedStatus(b.status)
      const matchesStatus = statusFilter === "all" ? true : s === statusFilter
      return matchesSearch && matchesStatus
    })

    list = list.sort((x, y) => {
      const a = x.booking
      const b = y.booking
      let va: string | number = ""
      let vb: string | number = ""
      switch (sortField) {
        case "serviceDate":
          va = a.serviceDate ? new Date(a.serviceDate).getTime() : 0
          vb = b.serviceDate ? new Date(b.serviceDate).getTime() : 0
          break
        case "customerName":
          va = (a.customerName || "").toLowerCase()
          vb = (b.customerName || "").toLowerCase()
          break
        case "totalPrice":
          va = Number(a.totalPrice || 0)
          vb = Number(b.totalPrice || 0)
          break
        case "status":
          va = normalizedStatus(a.status)
          vb = normalizedStatus(b.status)
          break
      }
      if (va < vb) return sortDirection === "asc" ? -1 : 1
      if (va > vb) return sortDirection === "asc" ? 1 : -1
      return 0
    })

    return list
  }, [assignments, searchTerm, statusFilter, sortField, sortDirection])

  const paginated = filteredSorted.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
  const totalPages = Math.max(1, Math.ceil(filteredSorted.length / ITEMS_PER_PAGE))

  const handleProcessPayment = async () => {
    if (!selectedAssignment) {
      toast.error("No booking selected")
      return
    }
    if (!proofFile) {
      toast.error("Please select a proof of payment file")
      return
    }

    try {
      setProcessingPayment(true)
      await apiService.markBookingAsPaid(selectedAssignment.booking.bookingId, proofFile)
      toast.success("Payment processed successfully! Status is now 'Paid'.")

      setAssignments((prev) =>
        prev.map((a) =>
          a.booking.bookingId === selectedAssignment.booking.bookingId
            ? { ...a, booking: { ...a.booking, status: "Paid", isPaid: true } }
            : a
        )
      )

      setSelectedAssignment(null)
      setProofFile(null)
      setIsPaymentModalOpen(false)

      window.dispatchEvent(new Event("booking:paid"))
    } catch (error) {
      console.error("Error processing payment:", error)
      toast.error("Failed to process payment")
    } finally {
      setProcessingPayment(false)
    }
  }

  const copyToClipboard = (text?: string | null) => {
    if (!text) return
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard!")
  }

  const openDetails = async (bookingId: string) => {
    try {
      setIsDetailsModalOpen(true)
      setDetailsLoading(true)
      const data = await apiService.getBookingDetails(bookingId) as unknown as BookingDetails
      setDetails(data)
    } catch (e) {
      console.error(e)
      toast.error("Failed to load booking details")
      setDetails(null)
    } finally {
      setDetailsLoading(false)
    }
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
          <div className="text-sm text-gray-500">Total: {assignments.length} bookings</div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-4 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search bookings (ID, name, email, phone, address)..."
                value={searchTerm}
                onChange={(e) => {
                  setCurrentPage(1)
                  setSearchTerm(e.target.value)
                }}
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
                  <SelectItem value="assigned">Assigned</SelectItem>
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
                  paginated.map((a) => {
                    const b = a.booking
                    const humanStatus = normalizedStatus(b.status)
                    return (
                      <TableRow key={a.bookingAssignmentId} className="hover:bg-gray-50">
                        <TableCell className="p-3 text-sm text-gray-700">
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-900">
                                {b.serviceDate ? new Date(b.serviceDate).toLocaleDateString() : "N/A"}
                              </span>
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {b.serviceDate ? new Date(b.serviceDate).toLocaleTimeString() : "N/A"}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="p-3 text-sm text-gray-700">
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900">{b.customerName || "-"}</span>
                            <span className="text-xs text-gray-500">{b.customerEmail || "-"}</span>
                            <span className="text-xs text-gray-500">{b.customerPhone || "-"}</span>
                          </div>
                        </TableCell>
                        <TableCell className="p-3 text-sm text-gray-700">
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-gray-400" />
                            {b.customerAddress || "-"}
                          </span>
                        </TableCell>
                        <TableCell className="p-3 text-sm">{getStatusBadge(b.status)}</TableCell>
                        <TableCell className="p-3 text-sm font-semibold text-gray-900">
                          ${Number(b.totalPrice ?? 0).toFixed(2)}
                        </TableCell>
                        <TableCell className="p-3">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Button
                              label="View"
                              variant="outline"
                              icon={<FiEye />}
                              onClick={() => openDetails(a.booking.bookingId)}
                            />
                            {["assigned", "confirmed"].includes(humanStatus) ? (
                              <Button
                                label="Process Payment"
                                variant="primary"
                                icon={<FiCreditCard />}
                                onClick={() => {
                                  setSelectedAssignment(a)
                                  setIsPaymentModalOpen(true)
                                }}
                              />
                            ) : (
                              <span className="text-xs text-gray-500">{" "}</span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="p-4 flex items-center justify-between border-t border-gray-200">
            <Button
              label="Previous"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            />
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              label="Next"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            />
          </div>
        </div>
      </div>

      {/* Booking Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false)
          setDetails(null)
        }}
        title="Booking Details"
        size="lg"
      >
        {detailsLoading ? (
          <div className="py-6 text-sm text-gray-600">Loading details…</div>
        ) : details ? (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p><strong>Booking ID:</strong> {details.bookingId}</p>
                <p><strong>Status:</strong> {normalizedStatus(details.status)}</p>
                <p><strong>Total Price:</strong> ${Number(details.totalPrice ?? 0).toFixed(2)}</p>
              </div>
              <div>
                <p><strong>Service Date:</strong> {details.serviceDate ? new Date(details.serviceDate).toLocaleString() : "N/A"}</p>
                <p><strong>Service Time:</strong> {details.serviceTime || "N/A"}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p><strong>Customer:</strong> {details.customerName}</p>
                <p><strong>Email:</strong> {details.customerEmail}</p>
                <p><strong>Phone:</strong> {details.customerPhone}</p>
              </div>
              <div>
                <p><strong>Address:</strong> {details.customerAddress}</p>
                <p><strong>City:</strong> {details.customerCity}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <p className="font-medium">Service Type</p>
                <p className="text-gray-700">{details.serviceType?.name || "—"}</p>
              </div>
              <div>
                <p className="font-medium">Frequency</p>
                <p className="text-gray-700">{details.serviceFrequency?.frequency || "—"}</p>
              </div>
              <div>
                <p className="font-medium">Area</p>
                <p className="text-gray-700">
                  {details.serviceArea?.areaName || "—"}
                  {details.serviceArea?.postalCode ? ` (${details.serviceArea.postalCode})` : ""}
                </p>
              </div>
            </div>

            {details.details && (
              <div className="bg-gray-50 rounded p-3">
                <p className="font-medium">Additional Details</p>
                <p className="text-gray-700">{details.details}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="py-6 text-sm text-gray-600">No details found.</div>
        )}
      </Modal>

      {/* Payment Processing Modal */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false)
          setSelectedAssignment(null)
          setProofFile(null)
        }}
        title="Process Payment"
        size="lg"
      >
        {selectedAssignment && (
          <div className="space-y-6">
            {/* Booking Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Booking Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Booking ID:</span>
                  <span className="ml-2 font-medium">{selectedAssignment.booking.bookingId}</span>
                </div>
                <div>
                  <span className="text-gray-600">Amount:</span>
                  <span className="ml-2 font-medium text-green-600">
                    ${Number(selectedAssignment.booking.totalPrice ?? 0).toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Customer:</span>
                  <span className="ml-2 font-medium">{selectedAssignment.booking.customerName || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-600">Service Date:</span>
                  <span className="ml-2 font-medium">
                    {selectedAssignment.booking.serviceDate
                      ? new Date(selectedAssignment.booking.serviceDate).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Bank Details (kept here for payment flow) */}
            {bankDetails && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-3 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Bank Details for Payment
                </h3>
                <div className="space-y-2 text-sm">
                  <BankRow label="Account Name" value={bankDetails.accountName} onCopy={copyToClipboard} />
                  <BankRow label="Bank Name" value={bankDetails.bankName} onCopy={copyToClipboard} />
                  <BankRow label="Account Number" value={bankDetails.accountNumber} onCopy={copyToClipboard} mono />
                  {bankDetails.sortCode ? (
                    <BankRow label="Sort Code" value={bankDetails.sortCode} onCopy={copyToClipboard} mono />
                  ) : null}
                </div>
              </div>
            )}

            {/* File Upload */}
            <div className="space-y-3">
              <Label htmlFor="payment-receipt">Upload Payment Receipt</Label>
              <Input
                id="payment-receipt"
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setProofFile(e.target.files?.[0] ?? null)}
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
                  setSelectedAssignment(null)
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

/**  helper for bank rows */
function BankRow({
  label,
  value,
  onCopy,
  mono,
}: {
  label: string
  value: string
  onCopy: (text: string) => void
  mono?: boolean
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-blue-800">{label}:</span>
      <div className="flex items-center gap-2">
        <span className={`font-medium ${mono ? "font-mono" : ""}`}>{value || "-"}</span>
        {!!value && (
          <button onClick={() => onCopy(value)} className="p-1 hover:bg-blue-200 rounded" title="Copy">
            <FiCopy className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}

export default CleanerBookings
