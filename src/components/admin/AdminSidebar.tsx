import { FaCalendarAlt, FaUsers, FaDollarSign, FaStar, FaHome } from "react-icons/fa";
import { FiAlertCircle } from "react-icons/fi";
import { IoMdSettings } from "react-icons/io";

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  bookingStats: {
    totalBookings: number;
    pendingBookings: number;
    confirmedBookings: number;
    totalRevenue: number;
    pendingPayments: number;
  };
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeSection,
  onSectionChange,
  bookingStats
}) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: FaHome,
      badge: null
    },
    {
      id: 'bookings',
      label: 'Booking Management',
      icon: FaCalendarAlt,
      badge: bookingStats.pendingBookings > 0 ? bookingStats.pendingBookings : null
    },
    {
      id: 'calendar',
      label: 'Calendar Control',
      icon: FaCalendarAlt,
      badge: null
    },
    {
      id: 'revenue',
      label: 'Revenue Analytics',
      icon: FaDollarSign,
      badge: null
    },
    {
      id: 'payments',
      label: 'Pending Payments',
      icon: FiAlertCircle,
      badge: bookingStats.pendingPayments > 0 ? bookingStats.pendingPayments : null
    },
    {
      id: 'feedback',
      label: 'Customer Feedback',
      icon: FaStar,
      badge: null
    },
    {
      id: 'cleaners',
      label: 'Cleaner Management',
      icon: FaUsers,
      badge: null
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: IoMdSettings,
      badge: null
    }
  ];

  return (
    <div className="w-64 bg-white shadow-lg h-full border-r border-gray-200 text-primary">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold">Admin Panel</h2>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center justify-between px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
                isActive ? 'bg-blue-50 border-r-2 border-color text-gold' : 'text-gray-700'
              }`}
            >
              <div className="flex items-center">
                <Icon className={`h-5 w-5 mr-3 ${isActive ? 'text-gold' : 'text-gray-500'}`} />
                <span className={`font-medium ${isActive ? 'text-gold' : 'text-gray-700'}`}>
                  {item.label}
                </span>
              </div>
              
              {item.badge && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
      
      {/* Quick Stats */}
      <div className="mt-8 px-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Quick Stats
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Bookings</span>
            <span className="font-semibold text-gray-800">{bookingStats.totalBookings}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Confirmed</span>
            <span className="font-semibold text-green-600">{bookingStats.confirmedBookings}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Pending</span>
            <span className="font-semibold text-yellow-600">{bookingStats.pendingBookings}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Revenue</span>
            <span className="font-semibold text-gray-800">${bookingStats.totalRevenue.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};