import { useState, useEffect } from 'react';
import { BookingRecord } from '@/types';
import { fetchAdminBookings, updatePaymentStatus, updateBlockedDates, freeUpDate, fetchUnavailableDates } from '@/services/bookingService';
import { BookingList } from '@/components/admin/BookingList';
import { AdminCalendarControl } from '@/components/admin/AdminCalendar';
import { Button } from '@/components/shared/button'

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Function to refresh data
  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Load bookings and unavailable dates on component mount or refresh
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Load bookings
        const bookingsData = await fetchAdminBookings();

       // Fetch local bookings from localStorage
        const localData = JSON.parse(localStorage.getItem('localBookings') || '[]');

        const allBookings = [...bookingsData, ...localData];

        // Ensure all date fields are proper Date objects
        const processedBookings = allBookings.map(booking => ({
          ...booking,
          selectedDate: booking.selectedDate ? new Date(booking.selectedDate) : undefined,
          bookingTimestamp: booking.bookingTimestamp ? 
            (typeof booking.bookingTimestamp === 'number' ? booking.bookingTimestamp : new Date(booking.bookingTimestamp).getTime()) 
            : Date.now()
        }));
        
        setBookings(processedBookings);
        
        // Load unavailable dates
        const blockedDates = await fetchUnavailableDates();
        
        // Ensure all unavailable dates are proper Date objects
        const processedDates = blockedDates.map(date => new Date(date));
        setUnavailableDates(processedDates);
      } catch (err) {
        console.error('Failed to load admin data:', err);
        setError('Failed to load data. Please refresh to try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [refreshTrigger]); // Dependency on refreshTrigger to enable manual refresh

  // Handler for confirming payment
  const handleConfirmPayment = async (bookingId: string) => {
    try {
      const result = await updatePaymentStatus(bookingId, 'confirmed');
      if (result.success) {
        // Update our local state with the new status
        setBookings(bookings.map(booking => 
          booking.id === bookingId 
            ? { ...booking, paymentStatus: 'confirmed' } 
            : booking
        ));
      }
    } catch (err) {
      console.error('Payment confirmation failed:', err);
      setError('Failed to confirm payment. Please try again.');
    }
  };

  // Handler for blocking dates
  const handleBlockDates = async (dates: Date[]) => {
    try {
      const result = await updateBlockedDates(dates);
      if (result.success) {
        setUnavailableDates(dates);
      }
    } catch (err) {
      console.error('Failed to block dates:', err);
      setError('Failed to update calendar. Please try again.');
    }
  };

  // Handler for freeing a date
  const handleFreeDate = async (date: Date) => {
    try {
      const result = await freeUpDate(date);
      if (result.success) {
        // Remove the freed date from our local state
        setUnavailableDates(unavailableDates.filter(
          d => d.toDateString() !== date.toDateString()
        ));
      }
    } catch (err) {
      console.error('Failed to free date:', err);
      setError('Failed to update calendar. Please try again.');
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading admin dashboard...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl md:text-6xl font-bold m-4 font-heading">Admin Dashboard</h1>
        <Button 
          label="Refresh Data" 
          variant="primary" 
          onClick={refreshData}
        />
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* <h2 className="text-xl font-semibold mb-4">Booking Management</h2> */}
          <BookingList 
            bookings={bookings} 
            onConfirmPayment={handleConfirmPayment} 
          />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Calendar Management</h2>
          <AdminCalendarControl 
            unavailableDates={unavailableDates}
            bookings={bookings} // Pass bookings to the calendar component
            onBlockDates={handleBlockDates}
            onFreeDate={handleFreeDate}
          />
        </div>
      </div>
      
      {/* Debug Information - Can be removed in production */}
      {/* <div className="mt-8 p-4 bg-gray-100 rounded text-sm">
        <h3 className="font-semibold mb-2">Debug Information</h3>
        <p className="mb-2">Total Bookings: {bookings.length}</p>
        <p className="mb-2">Blocked Dates: {unavailableDates.length}</p>
        <details>
          <summary className="cursor-pointer text-blue-600">Show Raw Booking Data</summary>
          <pre className="mt-2 overflow-auto max-h-60 p-2 bg-gray-200 rounded">
            {JSON.stringify(bookings, null, 2)}
          </pre>
        </details>
      </div> */}
    </div>
  );
}