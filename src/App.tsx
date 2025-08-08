import './App.css';
import { Navbar } from '@/components/shared/navbar';
import { Footer } from '@/components/shared/footer';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from '@/pages/index';
import { BookingPage } from '@/pages/booking';
import Login from '@/pages/Login';
import SignUp from '@/pages/signUp';
import ForgotPassword from '@/pages/forgot-password';
import CreateNewPassword from '@/pages/create-password';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import DashboardHome from '@/components/dashboard/DashboardHome';
import ServiceAreas from '@/components/dashboard/ServiceAreas';
import ServiceFrequencies from '@/components/dashboard/ServiceFrequencies';
import ServiceTypes from '@/components/dashboard/ServiceTypes';
import ServiceOptions from '@/components/dashboard/ServiceOptions';
import ContactUsPage from '@/pages/contactUs';
import { ResidentialServicePage } from '@/pages/services/residential';
import { AirBnBServicePage } from '@/pages/services/airbnb';
import { CommercialServicePage } from '@/pages/services/commercial';
// import { AuthProvider } from '@/components/shared/AuthProvider';

function AppContent() {
  const location = useLocation();
  const isAuthPage =
    location.pathname === '/login' ||
    location.pathname === '/signup' ||
    location.pathname === '/forgot-password' ||
    location.pathname === '/create-password' ||
    location.pathname.startsWith('/dashboard');

  return (
    <div className="bg-primary w-full 2xl:max-w-[1900px] mx-auto">
      {!isAuthPage && <Navbar />}
      <main className="">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard/*" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="service-areas" element={<ServiceAreas />} />
            <Route path="service-types" element={<ServiceTypes />} />
            <Route path="service-options" element={<ServiceOptions />} />
            <Route path="service-frequency" element={<ServiceFrequencies />} />
          </Route>
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/contactUs" element={<ContactUsPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/create-password" element={<CreateNewPassword />} />
          <Route path="/services/residential" element={<ResidentialServicePage />} />
          <Route path="/services/commercial" element={<CommercialServicePage />} />
          <Route path="/services/airbnb" element={<AirBnBServicePage />} />
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
    </Router>
    // <AuthProvider>
    // </AuthProvider>
  );
}

export default App;
