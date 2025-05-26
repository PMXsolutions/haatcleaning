import { FaCalendarAlt, FaDollarSign } from "react-icons/fa";
import { FiAlertTriangle } from "react-icons/fi";
import { FaRegCircleXmark } from "react-icons/fa6";
import { BookingRecord } from '@/types';

interface DashboardOverviewProps {
  bookings: BookingRecord[];
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ bookings }) => {
  // metrics
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thisWeek = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));
  
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(b => b.paymentStatus === 'confirmed').length;
  const pendingBookings = bookings.filter(b => b.paymentStatus === 'pending').length;
  // const upcomingBookings = bookings.filter(b => 
  //   b.selectedDate && new Date(b.selectedDate) >= today
  // ).length;
  
  const newBookingsThisWeek = bookings.filter(b => 
    new Date(b.bookingTimestamp) >= thisWeek
  ).length;
  
  // Calculate revenue (assuming base price calculation)
  const totalRevenue = bookings
    .filter(b => b.paymentStatus === 'confirmed')
    .reduce((sum, booking) => {
      const basePrice = (booking.propertyInfo.bedrooms * 25) + (booking.propertyInfo.bathrooms * 15);
      const extrasPrice = booking.selectedExtras?.reduce((extraSum, extra) => {
        return extraSum + (extra.quantity * 20); // Assuming $20 per extra service
      }, 0) || 0;
      return sum + basePrice + extrasPrice;
    }, 0);

  const metrics = [
    {
      title: 'Total Bookings',
      value: totalBookings,
      change: `+${newBookingsThisWeek}`,
      changeLabel: 'this week',
      icon: FaCalendarAlt,
      color: 'blue'
    },
    {
      title: 'Confirmed Bookings',
      value: confirmedBookings,
      change: `${Math.round((confirmedBookings / totalBookings) * 100)}%`,
      changeLabel: 'of total',
      icon: FaRegCircleXmark,
      color: 'green'
    },
    {
      title: 'Pending Payments',
      value: pendingBookings,
      change: pendingBookings > 0 ? 'Needs attention' : 'All clear',
      changeLabel: '',
      icon: FiAlertTriangle,
      color: pendingBookings > 0 ? 'red' : 'green'
    },
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      // change: 'YTD',
      changeLabel: '',
      icon: FaDollarSign,
      color: 'green'
    }
  ];

  const recentBookings = bookings
    .sort((a, b) => new Date(b.bookingTimestamp).getTime() - new Date(a.bookingTimestamp).getTime())
    .slice(0, 5);

  const upcomingBookingsData = bookings
    .filter(b => b.selectedDate && new Date(b.selectedDate) >= today)
    .sort((a, b) => new Date(a.selectedDate!).getTime() - new Date(b.selectedDate!).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-lg shadow border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-primary">{metric.title}</p>
                  <p className="text-2xl font-bold text-primary">{metric.value}</p>
                  <p className="text-sm text-primary">
                    <span className={`font-medium ${
                      metric.color === 'green' ? 'text-green-600' : 
                      metric.color === 'red' ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      {metric.change}
                    </span>
                    {metric.changeLabel && ` ${metric.changeLabel}`}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${
                  metric.color === 'green' ? 'bg-green-100' :
                  metric.color === 'red' ? 'bg-red-100' : 'bg-blue-100'
                }`}>
                  <Icon className={`h-6 w-6 ${
                    metric.color === 'green' ? 'text-green-600' :
                    metric.color === 'red' ? 'text-red-600' : 'text-blue-600'
                  }`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h3>
          <div className="space-y-3">
            {recentBookings.length > 0 ? recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium text-gray-900">
                    {booking.contactDetails.firstName} {booking.contactDetails.lastName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {booking.selectedDate ? new Date(booking.selectedDate).toLocaleDateString() : 'Date TBD'}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  booking.paymentStatus === 'confirmed' ? 'bg-green-100 text-green-800' :
                  booking.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {booking.paymentStatus || 'Unknown'}
                </span>
              </div>
            )) : (
              <p className="text-gray-500 text-center py-4">No recent bookings</p>
            )}
          </div>
        </div>

        {/* Upcoming Bookings */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Bookings</h3>
          <div className="space-y-3">
            {upcomingBookingsData.length > 0 ? upcomingBookingsData.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium text-gray-900">
                    {booking.contactDetails.firstName} {booking.contactDetails.lastName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(booking.selectedDate!).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {booking.propertyInfo.bedrooms}BR/{booking.propertyInfo.bathrooms}BA
                  </p>
                  <p className="text-xs text-gray-500">{booking.frequency}</p>
                </div>
              </div>
            )) : (
              <p className="text-gray-500 text-center py-4">No upcoming bookings</p>
            )}
          </div>
        </div>
      </div>

      {/* Issues that need attention */}
      {pendingBookings > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <FiAlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
            <h3 className="text-sm font-medium text-yellow-800">
              Attention Required
            </h3>
          </div>
          <p className="text-sm text-yellow-700 mt-1">
            You have {pendingBookings} booking{pendingBookings !== 1 ? 's' : ''} with pending payments that need review.
          </p>
        </div>
      )}
    </div>
  );
};