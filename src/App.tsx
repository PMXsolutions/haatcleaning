import './App.css';
import { Navbar } from '@/components/shared/navbar';
import { Footer } from '@/components/shared/footer';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from '@/pages/index';
import { BookingPage } from '@/pages/booking';
import Login from '@/pages/Login';
import OtpVerification from '@/pages/verify-otp';
import SignUp from '@/pages/signUp';
import ForgotPassword from '@/pages/forgot-password';
import CreateNewPassword from '@/pages/create-password';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import DashboardHome from '@/components/dashboard/DashboardHome';
import ServiceAreas from '@/components/dashboard/ServiceAreas';
import ServiceFrequencies from '@/components/dashboard/ServiceFrequencies';
import ServiceTypes from '@/components/dashboard/ServiceTypes';
import ServiceOptions from '@/components/dashboard/ServiceOptions';
import PaymentManagement from '@/components/dashboard/paymentMgt';
import BankDetails from '@/components/dashboard/BankDetails';
import Cleaners from '@/components/dashboard/Cleaners';
import Bookings from '@/components/dashboard/Bookings';
import ContactUsPage from '@/pages/contactUs';
import { ResidentialServicePage } from '@/pages/services/residential';
import { AirBnBServicePage } from '@/pages/services/airbnb';
import { CommercialServicePage } from '@/pages/services/commercial';
import AuthWrapper from '@/components/shared/AuthWrapper';
import CleanerLayout from "@/components/layouts/CleanerLayout"
import CleanerBookings from "@/components/Cleaner/CleanerBookings"
import { Toaster } from 'react-hot-toast';

function AppContent() {
  const location = useLocation();
  const isAuthPage =
    location.pathname === '/login' ||
    location.pathname === '/signup' ||
    location.pathname === '/verify-otp' ||
    location.pathname === '/forgot-password' ||
    location.pathname === '/create-password' ||
    location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/cleaner');

  return (
    <div className="bg-primary w-full 2xl:max-w-[1900px] mx-auto">
      {!isAuthPage && <Navbar />}
      <main className="">
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Protected Dashboard Routes */}
          <Route 
            path="/dashboard/*" 
            element={
              <AuthWrapper mode="protected">
                <DashboardLayout />
              </AuthWrapper>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="service-areas" element={<ServiceAreas />} />
            <Route path="service-types" element={<ServiceTypes />} />
            <Route path="service-options" element={<ServiceOptions />} />
            <Route path="service-frequency" element={<ServiceFrequencies />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="cleaners" element={<Cleaners />} />
            <Route path="paymentMgt" element={<PaymentManagement />} />
            <Route path="bankDetails" element={<BankDetails />} />
          </Route>

          <Route
            path="/Cleaner/*"
            element={
              <AuthWrapper mode="protected">
                <CleanerLayout />
              </AuthWrapper>
            }
          >
            <Route index element={<CleanerBookings />} />
          </Route>

          {/* Public Routes */}
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/contactUs" element={<ContactUsPage />} />
          <Route path="/services/residential" element={<ResidentialServicePage />} />
          <Route path="/services/commercial" element={<CommercialServicePage />} />
          <Route path="/services/airbnb" element={<AirBnBServicePage />} />

          {/* Auth Routes - Redirect if already authenticated */}
          <Route 
            path="/login" 
            element={
              <AuthWrapper mode="auth">
                <Login />
              </AuthWrapper>
            } 
          />
          <Route 
            path="/verify-otp" 
            element={
              <AuthWrapper mode="auth">
                <OtpVerification />
              </AuthWrapper>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <AuthWrapper mode="auth">
                <SignUp />
              </AuthWrapper>
            } 
          />
          <Route 
            path="/forgot-password" 
            element={
              <AuthWrapper mode="auth">
                <ForgotPassword />
              </AuthWrapper>
            } 
          />
          <Route 
            path="/create-password" 
            element={
              <AuthWrapper mode="auth">
                <CreateNewPassword />
              </AuthWrapper>
            } 
          />
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
      <Toaster />
    </Router>
  );
}

export default App;