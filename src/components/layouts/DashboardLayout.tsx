import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, Link, useLocation, Outlet } from 'react-router-dom';
import { 
  FiHome, 
  FiMapPin, 
  FiSettings, 
  FiGrid, 
  FiClock, 
  FiCalendar, 
  FiUsers, 
  FiDollarSign,
  FiHelpCircle,
  FiUserPlus,
  // FiSearch,
  FiBell,
  FiLogOut,
  FiMenu,
  FiX
} from 'react-icons/fi';

const DashboardLayout: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const sidebarItems = [
    { icon: FiHome, label: 'Dashboard', path: '/dashboard' },
    { icon: FiMapPin, label: 'Service Areas', path: '/dashboard/service-areas' },
    { icon: FiGrid, label: 'Service Types', path: '/dashboard/service-types' },
    { icon: FiSettings, label: 'Service Options', path: '/dashboard/service-options' },
    { icon: FiClock, label: 'Service Frequency', path: '/dashboard/service-frequency' },
    { icon: FiCalendar, label: 'Bookings', path: '/dashboard/bookings' },
    { icon: FiUsers, label: 'Cleaners', path: '/dashboard/cleaners' },
    { icon: FiDollarSign, label: 'Payments', path: '/dashboard/payments' },
  ];

  const bottomSidebarItems = [
    { icon: FiSettings, label: 'Settings', path: '/dashboard/settings' },
    { icon: FiHelpCircle, label: 'Help Center', path: '/dashboard/help' },
    { icon: FiUserPlus, label: 'Refer family & friends', path: '/dashboard/referrals' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <Link to="/">
            <img 
              src="/images/logo.png" 
              alt="HAAT Cleaning Services" 
              className="w-32 h-12 cursor-pointer"
            />
          </Link>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {sidebarItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={index}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)} // Close mobile sidebar on navigation
                className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-gray-100 text-gray-900 font-medium' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Navigation */}
        <div className="px-4 py-6 border-t border-gray-200 space-y-2">
          {bottomSidebarItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={index}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)} // Close mobile sidebar on navigation
                className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-gray-100 text-gray-900 font-medium' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm flex">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email}
              </p>
            </div>
            <button
              onClick={logout}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
              title="Logout"
            >
              <FiLogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between lg:justify-end">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-gray-600 hover:text-gray-800 lg:hidden"
            >
              {isSidebarOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>

            {/* <div className="flex-1 max-w-lg mx-4 lg:mx-0">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search here..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                />
              </div>
            </div> */}
            
            <div className="flex items-center gap-4">
              {/* Notification Icon */}
              <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <FiBell className="w-6 h-6" />
                {/* <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span> */}
              </button>
              
              <div className="w-10 h-10 bg-red-500 rounded-full lg:flex lg:items-center lg:justify-center hidden">
                <span className="text-white font-medium text-lg">
                  {user?.firstName?.charAt(0)}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content - This is where child routes will render */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;