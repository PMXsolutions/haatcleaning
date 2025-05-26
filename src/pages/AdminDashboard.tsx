import { useState, useEffect } from 'react';
import { BookingRecord } from '@/types';
import { fetchAdminBookings, updatePaymentStatus, updateBlockedDates, freeUpDate, fetchUnavailableDates } from '@/services/bookingService';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { DashboardOverview } from '@/components/admin/DashboardOverview';
import { BookingFilters } from '@/components/admin/BookingFilters';
import { BookingList } from '@/components/admin/BookingList';
import { AdminCalendarControl } from '@/components/admin/AdminCalendar';
import { Button } from '@/components/shared/button';

export default function UpdatedAdminDashboard() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<BookingRecord[]>([]);
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  // type SectionKey = 'dashboard' | 'bookings' | 'calendar' | 'revenue' | 'payments' | 'feedback' | 'cleaners' | 'settings';
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    dateRange: '',
    location: ''
  });

  // Function to refresh data
  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
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
        // const localData = JSON.parse(JSON.parse(JSON.stringify([])) || '[]');
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
  }, [refreshTrigger]);

  // Filter bookings based on current filters
  useEffect(() => {
    let filtered = [...bookings];

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(booking =>
        booking.contactDetails.firstName.toLowerCase().includes(searchTerm) ||
        booking.contactDetails.lastName.toLowerCase().includes(searchTerm) ||
        booking.contactDetails.email.toLowerCase().includes(searchTerm) ||
        booking.id.toLowerCase().includes(searchTerm)
      );
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(booking => booking.paymentStatus === filters.status);
    }

    // Date range filter
    if (filters.dateRange) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(booking => {
        if (!booking.selectedDate) return false;
        const bookingDate = new Date(booking.selectedDate);
        
        switch (filters.dateRange) {
          case 'today':
            return bookingDate.toDateString() === today.toDateString();
          case 'tomorrow':
            { const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            return bookingDate.toDateString() === tomorrow.toDateString(); }
          case 'this-week':
            { const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - today.getDay());
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            return bookingDate >= weekStart && bookingDate <= weekEnd; }
          case 'next-week':
            { const nextWeekStart = new Date(today);
            nextWeekStart.setDate(today.getDate() + (7 - today.getDay()));
            const nextWeekEnd = new Date(nextWeekStart);
            nextWeekEnd.setDate(nextWeekStart.getDate() + 6);
            return bookingDate >= nextWeekStart && bookingDate <= nextWeekEnd; }
          case 'this-month':
            return bookingDate.getMonth() === today.getMonth() && 
              bookingDate.getFullYear() === today.getFullYear();
          case 'next-month':
            { const nextMonth = new Date(today);
            nextMonth.setMonth(today.getMonth() + 1);
            return bookingDate.getMonth() === nextMonth.getMonth() && 
              bookingDate.getFullYear() === nextMonth.getFullYear(); }
          case 'past':
            return bookingDate < today;
          default:
            return true;
        }
      });
    }

    // Location filter
    if (filters.location) {
      const locationTerm = filters.location.toLowerCase();
      filtered = filtered.filter(booking =>
        booking.addressDetails.city.toLowerCase().includes(locationTerm) ||
        booking.addressDetails.zipCode.toLowerCase().includes(locationTerm)
      );
    }

    setFilteredBookings(filtered);
  }, [bookings, filters]);

  // Calculate booking statistics
  const bookingStats = {
    totalBookings: bookings.length,
    pendingBookings: bookings.filter(b => b.paymentStatus === 'pending').length,
    confirmedBookings: bookings.filter(b => b.paymentStatus === 'confirmed').length,
    totalRevenue: bookings
      .filter(b => b.paymentStatus === 'confirmed')
      .reduce((sum, booking) => {
        const basePrice = (booking.propertyInfo.bedrooms * 25) + (booking.propertyInfo.bathrooms * 15);
        const extrasPrice = booking.selectedExtras?.reduce((extraSum, extra) => {
          return extraSum + (extra.quantity * 20);
        }, 0) || 0;
        return sum + basePrice + extrasPrice;
      }, 0),
    pendingPayments: bookings.filter(b => b.paymentStatus === 'pending').length
  };

  // Handler for confirming payment
  const handleConfirmPayment = async (bookingId: string) => {
    try {
      const result = await updatePaymentStatus(bookingId, 'confirmed');
      if (result.success) {
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

  // Handler for canceling booking
  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      return;
    }
    
    try {
      // Here you would implement the actual cancel booking logic
      // For now, we'll just update the status locally
      setBookings(bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, paymentStatus: 'failed' } 
          : booking
      ));
    } catch (err) {
      console.error('Booking cancellation failed:', err);
      setError('Failed to cancel booking. Please try again.');
    }
  };

  // Handler for modifying booking
  const handleModifyBooking = async (bookingId: string, updates: Partial<BookingRecord>) => {
    try {
      // Here you would implement the actual modify booking logic
      // For now, we'll just update locally
      setBookings(bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, ...updates } 
          : booking
      ));
    } catch (err) {
      console.error('Booking modification failed:', err);
      setError('Failed to modify booking. Please try again.');
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
        setUnavailableDates(unavailableDates.filter(
          d => d.toDateString() !== date.toDateString()
        ));
      }
    } catch (err) {
      console.error('Failed to free date:', err);
      setError('Failed to update calendar. Please try again.');
    }
  };

  const getSectionTitle = () => {
    const titles: Record<string, string> = {
      dashboard: 'Dashboard Overview',
      bookings: 'Booking Management',
      calendar: 'Calendar Control',
      revenue: 'Revenue Analytics',
      payments: 'Pending Payments',
      feedback: 'Customer Feedback',
      cleaners: 'Cleaner Management',
      settings: 'Settings'
    };
    return titles[activeSection] || 'Dashboard Overview';
  };

  // Render content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardOverview bookings={bookings} />;
      
      case 'bookings':
        return (
          <div className="space-y-6">
            <BookingFilters filters={filters} onFilterChange={setFilters} />
            <BookingList 
              bookings={filteredBookings}
              onConfirmPayment={handleConfirmPayment}
              onCancelBooking={handleCancelBooking}
              onModifyBooking={handleModifyBooking}
            />
          </div>
        );
      
      case 'calendar':
        return (
          <AdminCalendarControl 
            unavailableDates={unavailableDates}
            bookings={bookings}
            onBlockDates={handleBlockDates}
            onFreeDate={handleFreeDate}
          />
        );
      
      case 'revenue':
        return (
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-semibold mb-4">Revenue Analytics</h3>
            <p className="text-gray-600">Revenue analytics features coming soon...</p>
          </div>
        );
      
      case 'payments':
        { const pendingPaymentBookings = bookings.filter(b => b.paymentStatus === 'pending');
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow border">
              <h3 className="text-lg font-semibold mb-4">Pending Payments</h3>
              {pendingPaymentBookings.length > 0 ? (
                <BookingList 
                  bookings={pendingPaymentBookings}
                  onConfirmPayment={handleConfirmPayment}
                />
              ) : (
                <p className="text-gray-600">No pending payments at this time.</p>
              )}
            </div>
          </div>
        ); }
      
      case 'feedback':
        return (
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-semibold mb-4">Customer Feedback</h3>
            <p className="text-gray-600">Customer feedback system coming soon...</p>
          </div>
        );
      
      case 'cleaners':
        return (
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-semibold mb-4">Cleaner Management</h3>
            <p className="text-gray-600">Cleaner management features coming soon...</p>
          </div>
        );
      
      case 'settings':
        return (
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-semibold mb-4">Settings</h3>
            <p className="text-gray-600">System settings coming soon...</p>
          </div>
        );
      
      default:
        return <DashboardOverview bookings={bookings} />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-color mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 
        transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 transition-transform duration-300 ease-in-out
      `}>
        <AdminSidebar 
          activeSection={activeSection}
          onSectionChange={(section) => {
            setActiveSection(section);
            setIsSidebarOpen(false);
          }}
          bookingStats={bookingStats}
        />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden font-text text-primary min-w-0">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center min-w-0 flex-1">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="mr-3 lg:hidden p-2 rounded-md hover:bg-gray-100"
            >
              <svg 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              </svg>
            </button>

            <div className="min-w-0 flex-1">
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 truncate">
                {getSectionTitle()}
              </h1>
              <p className="text-xs lg:text-sm text-gray-600 mt-1 hidden sm:block">
                Manage your cleaning service business efficiently
              </p>
            </div>

            <div className="ml-4 flex-shrink-0">
              <Button 
                label="Refresh Data" 
                variant="primary" 
                onClick={refreshData}
              />
            </div>
          </div>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-100 text-red-700 rounded-lg border border-red-200">
            {error}
            <button 
              onClick={() => setError(null)}
              className="ml-2 text-red-800 hover:text-red-900"
            >
              ×
            </button>
          </div>
        )}
        
        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}