"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  FiSearch,
  FiFilter,
  FiEye,
  // FiCheck,
  FiDollarSign,
  FiChevronUp,
  FiChevronDown,
  FiDownload,
  // FiClock,
} from "react-icons/fi"
import { apiService } from "@/api/services"
import type { BookingRecord } from "@/api/types"
import { Modal } from "@/components/shared/Modal"
import { Button } from "@/components/shared/button"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import toast from "react-hot-toast"

const ITEMS_PER_PAGE = 10

interface PaymentRecord extends BookingRecord {
  paymentStatus: "pending" | "paid" | "approved" | "rejected"
  paymentMethod: "card" | "cash" | "transfer"
  receiptUrl?: string
  processedAt?: string
}

const PaymentManagement: React.FC = () => {
  const [payments, setPayments] = useState<PaymentRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [sortField, setSortField] = useState<keyof PaymentRecord>("serviceDate")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [currentPage, setCurrentPage] = useState(1)

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null)
  // const [isProcessing, setIsProcessing] = useState(false)

  const fetchPayments = async () => {
    try {
      setLoading(true)
      // Get all bookings and filter for those with payment status
      const bookings = await apiService.getAllBookings()

      // Transform bookings to payment records
      const paymentRecords: PaymentRecord[] = bookings
        .filter((booking) => booking.status === "completed" || booking.status === "paid")
        .map((booking) => ({
          ...booking,
          paymentStatus: booking.status === "paid" ? "paid" : "pending",
          paymentMethod: "transfer" as const, // Default to transfer based on user requirements
          processedAt: booking.status === "paid" ? booking.updatedAt : undefined,
        }))

      setPayments(paymentRecords)
    } catch (error) {
      console.error("Error fetching payments:", error)
      toast.error("Failed to fetch payment records")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "paid":
        return "bg-green-100 text-green-800"
      case "approved":
        return "bg-blue-100 text-blue-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // const handleApprovePayment = async (paymentId: string) => {
  //   setIsProcessing(true)
  //   try {
  //     await apiService.markBookingAsPaid(paymentId)
  //     toast.success("Payment approved successfully!")
  //     await fetchPayments()
  //   } catch (error) {
  //     console.error("Error approving payment:", error)
  //     toast.error("Failed to approve payment")
  //   } finally {
  //     setIsProcessing(false)
  //   }
  // }

  // const handleApprovePayment = async (_paymentId: string) => {
  //   setIsProcessing(true)
  //   try {
  //     // No admin-approval endpoint provided. Keep UI and notify.
  //     // toast.info("Admin approval will be wired once the API is provided.")
  //     // toast.info("Admin incoming")
  //   } finally {
  //     setIsProcessing(false)
  //   }
  // }

  const filteredPayments = payments
    .filter((payment) => {
      const q = searchTerm.toLowerCase()
      const matchesSearch =
        payment.customerName.toLowerCase().includes(q) ||
        payment.bookingId.toLowerCase().includes(q) ||
        payment.customerEmail.toLowerCase().includes(q)

      const matchesFilter = filterStatus === "all" || payment.paymentStatus === filterStatus

      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      if (sortField === "serviceDate") {
        const ad = new Date(a.serviceDate).getTime()
        const bd = new Date(b.serviceDate).getTime()
        return sortDirection === "asc" ? ad - bd : bd - ad
      }

      const av = (a[sortField] as unknown as string) ?? ""
      const bv = (b[sortField] as unknown as string) ?? ""
      return sortDirection === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av))
    })

  const paginatedPayments = filteredPayments.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(filteredPayments.length / ITEMS_PER_PAGE))
    if (currentPage > totalPages) setCurrentPage(totalPages)
  }, [filteredPayments.length, currentPage])

  const handleSort = (field: keyof PaymentRecord) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const SortIcon = ({ field }: { field: keyof PaymentRecord }) => {
    if (sortField !== field) {
      return <FiChevronUp className="w-4 h-4 text-gray-400" />
    }
    return sortDirection === "asc" ? (
      <FiChevronUp className="w-4 h-4 text-gray-600" />
    ) : (
      <FiChevronDown className="w-4 h-4 text-gray-600" />
    )
  }

  // const getPaymentStats = () => {
  //   const total = payments.length
  //   const pending = payments.filter((p) => p.paymentStatus === "pending").length
  //   const paid = payments.filter((p) => p.paymentStatus === "paid").length
  //   const totalAmount = payments.reduce((sum, p) => sum + p.totalPrice, 0)
  //   const paidAmount = payments.filter((p) => p.paymentStatus === "paid").reduce((sum, p) => sum + p.totalPrice, 0)

  //   return { total, pending, paid, totalAmount, paidAmount }
  // }

  // const stats = getPaymentStats()

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>
          <p className="text-gray-600 mt-1">
            Track and approve customer payments with full visibility by date, method, and status.
          </p>
        </div>

        {/* Stats Cards */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiDollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Payments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FiClock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FiCheck className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{stats.paid}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <FiDollarSign className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div> */}

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Filter */}
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[140px] h-9 text-md">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <FiFilter className="w-4 h-4" />
                <span className="hidden sm:inline">Filter</span>
              </button>
            </div>
          </div>
        </div>

        {/* Payment Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableCell>
                    <button
                      onClick={() => handleSort("bookingId")}
                      className="flex items-center gap-2 text-sm font-medium text-gray-900"
                    >
                      Payment ID
                      <SortIcon field="bookingId" />
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
                  <TableCell className="hidden md:table-cell text-sm font-medium text-gray-900">
                    Amount Paid ($)
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm font-medium text-gray-900">Method</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <button
                      onClick={() => handleSort("serviceDate")}
                      className="flex items-center gap-2 text-sm font-medium text-gray-900"
                    >
                      Date Paid
                      <SortIcon field="serviceDate" />
                    </button>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleSort("paymentStatus")}
                      className="flex items-center gap-2 text-sm font-medium text-gray-900"
                    >
                      Status
                      <SortIcon field="paymentStatus" />
                    </button>
                  </TableCell>
                  <TableCell className="text-sm font-medium text-gray-900 text-right">Actions</TableCell>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      Loading payments...
                    </TableCell>
                  </TableRow>
                ) : paginatedPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      No payment records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedPayments.map((payment) => (
                    <TableRow key={payment.bookingId} className="hover:bg-gray-50">
                      <TableCell className="p-4 text-sm font-medium text-gray-900">{payment.bookingId}</TableCell>
                      <TableCell className="p-4">
                        <div className="text-sm font-medium text-gray-900">{payment.customerName}</div>
                        <div className="text-sm text-gray-500">{payment.customerEmail}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell p-4 text-sm font-medium text-gray-900">
                        ${payment.totalPrice.toFixed(2)}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell p-4 text-sm text-gray-700">
                        <div className="flex items-center gap-1">
                          <FiDollarSign className="w-4 h-4 text-gray-400" />
                          {payment.paymentMethod.charAt(0).toUpperCase() + payment.paymentMethod.slice(1)}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell p-4 text-sm text-gray-900">
                        {payment.processedAt
                          ? new Date(payment.processedAt).toLocaleDateString()
                          : new Date(payment.serviceDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="p-4">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payment.paymentStatus)}`}
                        >
                          {payment.paymentStatus.charAt(0).toUpperCase() + payment.paymentStatus.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="p-4 text-right">
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => {
                              setSelectedPayment(payment)
                              setIsDetailModalOpen(true)
                            }}
                            className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200"
                          >
                            <FiEye className="w-3 h-3 mr-1" /> View
                          </button>
                          {/* {payment.paymentStatus === "pending" && (
                            <button
                              onClick={() => handleApprovePayment(payment.bookingId)}
                              disabled={isProcessing}
                              className="inline-flex items-center px-3 py-1 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
                            >
                              <FiCheck className="w-3 h-3 mr-1" /> Approve
                            </button>
                          )} */}
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
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            />
            <span className="text-sm text-gray-600">
              Page {currentPage} of {Math.max(1, Math.ceil(filteredPayments.length / ITEMS_PER_PAGE))}
            </span>
            <Button
              label="Next"
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage * ITEMS_PER_PAGE >= filteredPayments.length}
            />
          </div>
        </div>
      </div>

      {/* Payment Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false)
          setSelectedPayment(null)
        }}
        title="Payment Details"
        size="lg"
      >
        {selectedPayment && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Payment Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment ID:</span>
                    <span className="font-medium">{selectedPayment.bookingId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium text-lg text-green-600">${selectedPayment.totalPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Method:</span>
                    <span className="font-medium">{selectedPayment.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedPayment.paymentStatus)}`}
                    >
                      {selectedPayment.paymentStatus}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date Paid:</span>
                    <span className="font-medium">
                      {selectedPayment.processedAt
                        ? new Date(selectedPayment.processedAt).toLocaleDateString()
                        : new Date(selectedPayment.serviceDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Customer Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{selectedPayment.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{selectedPayment.customerEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{selectedPayment.customerPhone || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Date:</span>
                    <span className="font-medium">{new Date(selectedPayment.serviceDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {selectedPayment.receiptUrl && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Payment Receipt</h4>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FiDownload className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-700">Receipt available for download</span>
                  <Button
                    label="Download"
                    onClick={() => window.open(selectedPayment.receiptUrl, "_blank")}
                    className="ml-auto text-sm"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3 justify-end pt-4 border-t">
              {selectedPayment.paymentStatus === "pending" && (
                <>
                  <Button
                    label="Reject"
                    onClick={() => {
                      // Handle rejection logic here
                      // toast.info("Rejection functionality to be implemented")
                    }}
                    className="bg-red-600 text-white hover:bg-red-700"
                  />
                  <Button
                    label="Approve"
                    variant="primary"
                    onClick={() => {
                      // handleApprovePayment(selectedPayment.bookingId)
                      setIsDetailModalOpen(false)
                    }}
                    // disabled={isProcessing}
                  />
                </>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default PaymentManagement
