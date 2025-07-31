import './App.css'
import { Navbar } from '@/components/shared/navbar'
import { Footer } from '@/components/shared/footer'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/index';
import { BookingPage } from './pages/booking';
import Login from './pages/Login';
import SignUp from './pages/signUp';
import ForgotPassword from './pages/forgot-password';
import CreateNewPassword from './pages/create-password';
// import AdminDashboard from './pages/AdminDashboard';
import ContactUsPage from './pages/contactUs'
import { ResidentialServicePage } from './pages/services/residential';
import { AirBnBServicePage } from './pages/services/airbnb';
import { CommercialServicePage } from './pages/services/commercial';
// import About from './pages/about'

function AppContent() {
  const location = useLocation()
  // console.log("Current pathname:", location.pathname)
  const isAuthPage = 
    location.pathname === "/login" || 
    location.pathname === "/signup" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/create-password"

  return (
    <div className="bg-primary w-full 2xl:max-w-[1900px] mx-auto">
      {/* <Navbar /> */}
      {!isAuthPage && <Navbar />}
      <main className="">
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/admin" element={<AdminDashboard />} /> */}
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/contactUs" element={<ContactUsPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/create-password" element={<CreateNewPassword />} />
          <Route path="/services/residential" element={<ResidentialServicePage />} />
          <Route path="/services/commercial" element={<CommercialServicePage />} />
          <Route path="/services/airbnb" element={<AirBnBServicePage />} />
        </Routes>
      </main>
      {/* <Footer /> */}
      {!isAuthPage && <Footer />}
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
