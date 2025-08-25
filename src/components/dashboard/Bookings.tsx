import React, { useState, useEffect, useMemo } from 'react';
import { 
  FiSearch, 
  FiEye,
  FiChevronUp,
  FiChevronDown
} from 'react-icons/fi';
import { apiService } from '@/api/services';
import type { BookingRecord, ServiceOption, ServiceFrequency, Cleaner } from '@/api/types';
import { Modal } from '@/components/shared/Modal';
import { Button } from '@/components/shared/button';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table'; 
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from 'react-hot-toast';

const ITEMS_PER_PAGE = 10;
type StatusFilter = 'all' | BookingRecord['status'];

// pretty-print `details` whether it's a string or an object/array/other
function renderDetails(details: unknown) {
  if (details == null) return null;

  if (typeof details === 'string') {
    return <p className="text-sm text-gray-600 whitespace-pre-wrap">{details}</p>;
  }

  if (Array.isArray(details)) {
    return (
      <pre className="text-sm text-gray-600 bg-gray-50 p-3 rounded border border-gray-200 overflow-x-auto">
        {JSON.stringify(details, null, 2)}
      </pre>
    );
  }

  if (typeof details === 'object') {
    const entries = Object.entries(details as Record<string, unknown>);
    if (entries.length === 0) return null;
    return (
      <div className="text-sm text-gray-600 space-y-1">
        {entries.map(([k, v]) => (
          <div key={k}>
            <span className="font-medium">{k}:</span>{' '}
            {typeof v === 'string' ? v : JSON.stringify(v)}
          </div>
        ))}
      </div>
    );
  }

  return <p className="text-sm text-gray-600">{String(details)}</p>;
}

const Bookings: React.FC = () => {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [frequencies, setFrequencies] = useState<ServiceFrequency[]>([]);
  const [serviceOptions, setServiceOptions] = useState<ServiceOption[]>([]);
  const [cleaners, setCleaners] = useState<Cleaner[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<StatusFilter>('all');
  const [sortField, setSortField] = useState<keyof BookingRecord>('serviceDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedForAssign, setSelectedForAssign] = useState<BookingRecord | null>(null);
  const [selectedCleanerId, setSelectedCleanerId] = useState<string>("");

  // Fetch bookings, options, cleaners
  const fetchAll = async () => {
    try {
      setLoading(true);
      const [b, so, cln, frq] = await Promise.all([
        apiService.getAllBookings(),
        apiService.getAllServiceOptions(),
        apiService.getAllCleaners(),
        apiService.getAllServiceFrequencies()
      ]);
      setBookings(b);
      setServiceOptions(so);
      setCleaners(cln);
      setFrequencies(frq);
    } catch (error) {
      toast.error("Failed to fetch bookings");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // Map of options by id
  const optionMap = useMemo(() => {
    const map: Record<string, ServiceOption> = {};
    serviceOptions.forEach(o => { map[o.serviceOptionId] = o; });
    return map;
  }, [serviceOptions]);

  // Options summary text
  const optionsSummary = (rec: BookingRecord) => {
    if (!rec.serviceDetails || rec.serviceDetails.length === 0) return "—";
    return rec.serviceDetails
      .map(d => `${optionMap[d.serviceOptionId]?.optionName ?? "Option"} ×${d.quantity}`)
      .join(", ");
  };

  // Filter + sort
  const filteredBookings = bookings
    .filter(b => {
      const q = searchTerm.trim().toLowerCase();

      // Search by NAME, ADDRESS, CITY, SERVICE AREA (requested)
      const matchesSearch = [
        b.customerName,
        b.customerAddress,
        b.customerCity,
        b.serviceArea?.areaName
      ].some(val => (val ?? '').toLowerCase().includes(q));

      const matchesFilter = filterStatus === 'all' || b.status === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortField === 'serviceDate') {
        const ad = new Date(a.serviceDate).getTime();
        const bd = new Date(b.serviceDate).getTime();
        return sortDirection === 'asc' ? ad - bd : bd - ad;
      }
      const av = String((a[sortField] as unknown) ?? '');
      const bv = String((b[sortField] as unknown) ?? '');
      return sortDirection === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });

  const frequencyMap = useMemo(() => {
    const m: Record<string, ServiceFrequency> = {};
    frequencies.forEach(f => { m[f.serviceFrequencyId] = f; });
    return m;
  }, [frequencies]);

  const frequencyLabel = (rec: BookingRecord) =>
  rec.frequency?.frequency
  ?? (rec.serviceFrequencyId ? frequencyMap[rec.serviceFrequencyId]?.frequency : undefined)
  ?? "—";

  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  );

  // Keep current page in range
  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(filteredBookings.length / ITEMS_PER_PAGE));
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [filteredBookings.length, currentPage]);

  const handleSort = (field: keyof BookingRecord) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }: { field: keyof BookingRecord }) => {
    if (sortField !== field) return <FiChevronUp className="w-4 h-4 text-gray-400" />;
    return sortDirection === 'asc'
      ? <FiChevronUp className="w-4 h-4 text-gray-600" />
      : <FiChevronDown className="w-4 h-4 text-gray-600" />;
  };

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 font-heading">Bookings</h1>
          <p className="text-gray-600 mt-1 font-body">
            Manage and monitor all customer bookings with real-time status updates and cleaner assignments.
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, address, city, or service area..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A7C3D]"
                />
              </div>

              {/* Filter */}
              <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as StatusFilter)}>
                <SelectTrigger className="w-[140px] h-9 text-md">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 font-body">
          <div className="">
            <Table className="w-full overflow-hidden">
              <TableHeader>
                <TableRow>
                  <TableCell>
                    <button
                      onClick={() => handleSort('bookingId')}
                      className="flex items-center gap-2 text-sm text-gray-900"
                    >
                      Booking ID
                      <SortIcon field="bookingId" />
                    </button>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <button
                      onClick={() => handleSort('customerName')}
                      className="flex items-center gap-2 text-sm text-gray-900"
                    >
                      Customer
                      <SortIcon field="customerName" />
                    </button>
                  </TableCell>
                  <TableCell className="hidden">Contact</TableCell>
                  <TableCell className="hidden">Address</TableCell>
                  <TableCell className="hidden md:table-cell">Service Area</TableCell>
                  <TableCell className="hidden">Service Type</TableCell>
                  <TableCell className="hidden">Frequency</TableCell>
                  <TableCell className="hidden">Options Summary</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <button
                      onClick={() => handleSort('serviceDate')}
                      className="flex items-center gap-2 text-sm text-gray-900"
                    >
                      Date/Time
                      <SortIcon field="serviceDate" />
                    </button>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleSort('status')}
                      className="flex items-center gap-2 text-sm text-gray-900"
                    >
                      Status
                      <SortIcon field="status" />
                    </button>
                  </TableCell>
                  <TableCell className="text-right">Actions</TableCell>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={11} className="px-6 py-8 text-center text-gray-500">Loading...</TableCell>
                  </TableRow>
                ) : paginatedBookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="px-6 py-8 text-center text-gray-500">No bookings found.</TableCell>
                  </TableRow>
                ) : (
                  paginatedBookings.map((b) => (
                    <TableRow key={b.bookingId} className="hover:bg-gray-50">
                      <TableCell className="p-2 text-sm font-medium text-gray-900">{b.bookingId}</TableCell>
                      <TableCell className="hidden md:table-cell p-2">
                        <div className="text-sm font-medium text-gray-900">{b.customerName}</div>
                        <div className="text-sm text-gray-500">{b.customerEmail}</div>
                      </TableCell>
                      <TableCell className="hidden p-2 text-sm text-gray-700">
                        <div>{b.customerPhone || "—"}</div>
                        <div className="text-gray-500">{b.customerEmail}</div>
                      </TableCell>
                      <TableCell className="hidden p-2 text-sm text-gray-700">
                        <div>{b.customerAddress || "-"}</div>
                        <div className="text-gray-500">{b.customerCity || "-"}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell p-2 text-sm text-gray-700">
                        {b.serviceArea?.areaName || "-"}
                      </TableCell>
                      {/* ServiceType uses `name`, not `typeName` */}
                      <TableCell className="hidden p-2 text-sm text-gray-700">
                        {b.serviceType?.name || "-"}
                      </TableCell>
                      <TableCell className="hidden p-2 text-sm text-gray-700">{frequencyLabel(b)}</TableCell>
                      <TableCell className="hidden p-2 text-sm text-gray-700">{optionsSummary(b) || "-"}</TableCell>
                      <TableCell className="hidden sm:table-cell p-2 text-sm text-gray-900">
                        {new Date(b.serviceDate).toLocaleDateString()}{" "}
                        {new Date(b.serviceDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </TableCell>
                      <TableCell className="p-2">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                          {b.status.charAt(0).toUpperCase() + b.status.slice(1).replace("-", " ")}
                        </span>
                      </TableCell>
                      <TableCell className="p-2 text-right flex flex-col gap-2">
                        <button
                          onClick={() => { setSelectedBooking(b); setIsDetailModalOpen(true); }}
                          className="inline-flex items-center justify-center px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200"
                        >
                          <FiEye className="w-3 h-3 mr-1" /> View
                        </button>
                        <button
                          onClick={() => { setSelectedForAssign(b); setIsAssignModalOpen(true); setSelectedCleanerId(""); }}
                          className="inline-flex items-center justify-center px-3 py-1 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                        >
                          {b.assignedCleanerId ? "Reassign" : "Assign"}
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="p-4 flex items-center justify-between border-t border-gray-200">
            <Button
              label="Previous"
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            />
            <span className="text-sm text-gray-600">
              Page {currentPage} of {Math.max(1, Math.ceil(filteredBookings.length / ITEMS_PER_PAGE))}
            </span>
            <Button
              label="Next"
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={currentPage * ITEMS_PER_PAGE >= filteredBookings.length}
            />
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedBooking(null);
        }}
        title="Booking Details"
      >
        {selectedBooking && (
          <div className="space-y-6 font-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Customer Information</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">Name:</span> {selectedBooking.customerName}</p>
                  <p><span className="font-medium">Email:</span> {selectedBooking.customerEmail}</p>
                  <p><span className="font-medium">Phone:</span> {selectedBooking.customerPhone || '—'}</p>
                  <p><span className="font-medium">Address:</span> {selectedBooking.customerAddress || '—'}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Service Details</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">Service Type:</span> {selectedBooking.serviceType?.name || '-'}</p>
                  <p><span className="font-medium">Area:</span> {selectedBooking.serviceArea?.areaName || '-'}</p>
                  <p><span className="font-medium">Frequency:</span> {frequencyLabel(selectedBooking)}</p>
                  <p><span className="font-medium">Date:</span> {new Date(selectedBooking.serviceDate).toLocaleDateString()}</p>
                  <p><span className="font-medium">Total Price:</span> ${selectedBooking.totalPrice}</p>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            {(() => {
              const detailsUnknown = (selectedBooking as unknown as { details?: unknown }).details;
              const rendered = renderDetails(detailsUnknown);
              if (!rendered) return null;
              return (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Additional Details</h4>
                  {rendered}
                </div>
              );
            })()}
          </div>
        )}
      </Modal>

      {/* Assign/Reassign Modal */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => { setIsAssignModalOpen(false); setSelectedForAssign(null); setSelectedCleanerId(""); }}
        title="Assign Cleaner"
      >
        {selectedForAssign && (
          <div className="space-y-4 font-body">
            <div className="text-sm text-gray-700">
              Booking <span className="font-medium">{selectedForAssign.bookingId}</span>
            </div>
            <div>
              <Select value={selectedCleanerId} onValueChange={setSelectedCleanerId}>
                <SelectTrigger className="w-full h-9">
                  <SelectValue placeholder="Select a cleaner" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {cleaners.map((c) => (
                    <SelectItem key={c.userId || c.id} value={c.userId || c.id}>
                      {c.firstName} {c.lastName} — {c.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                label="Cancel"
                onClick={() => { setIsAssignModalOpen(false); setSelectedForAssign(null); setSelectedCleanerId(""); }}
              />
              <Button
                label="Assign"
                variant="primary"
                disabled={!selectedCleanerId}
                onClick={async () => {
                  try {
                    if (!selectedCleanerId || !selectedForAssign) return;
                    await apiService.assignBooking(selectedCleanerId, selectedForAssign.bookingId);
                    toast.success("Booking assigned successfully");
                    setIsAssignModalOpen(false);
                    setSelectedForAssign(null);
                    setSelectedCleanerId("");
                    await fetchAll();
                  } catch (e) {
                    console.error(e);
                    toast.error("Failed to assign booking");
                  }
                }}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Bookings;
