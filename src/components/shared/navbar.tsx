import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RxActivityLog, RxCross1 } from "react-icons/rx";
import { FiUser, FiLogOut, FiBell, FiChevronDown } from "react-icons/fi";
import { useAuth } from '@/hooks/useAuth';

import { Button } from '@/components/shared/button';

interface NavLink {
  name: string;
  path: string;
  sectionId?: string;
  isExternal?: boolean;
}

const navLinks: NavLink[] = [
  { name: 'Home', path: '/', sectionId: 'home' },
  { name: 'About Us', path: '/#about', sectionId: 'about' },
  { name: 'Services', path: '/#services', sectionId: 'services' },
  { name: 'Contact', path: '/#contact', sectionId: 'contact' },
];

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Function to handle navigation or scrolling when link is clicked
  const handleNavigation = (link: NavLink) => {
    const { path, sectionId } = link;
    const isCurrentPage = window.location.pathname === '/' || window.location.pathname === '';
    
    if (isMenuOpen) setIsMenuOpen(false);
    
    // Case 1: We're on the home page and need to scroll to a section
    if (isCurrentPage && sectionId) {
      const element = document.getElementById(sectionId);
      
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        
        window.history.pushState({}, '', path);
        
        setActiveSection(path);
      }
      return;
    }
    
    // Case 2: We need to navigate to the home page and then scroll to a section
    if (!isCurrentPage && path.includes('#')) {
      if (sectionId) {
        sessionStorage.setItem('scrollToSection', sectionId);
      }
      
      window.location.href = path;
      return;
    }
    
    // Case 3: Simple page navigation with no section scrolling
    if (path !== window.location.pathname) {
      window.location.href = path;
      return;
    }
    
    // Case 4: Home page navigation from home (scroll to top)
    if (path === '/' && isCurrentPage) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveSection(path);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileDropdownOpen(false);
  };

  const handleDashboard = () => {
    navigate('/dashboard');
    setIsProfileDropdownOpen(false);
  };

  // Function to check which section is currently in view and handle initial section scrolling
  useEffect(() => {
    const handleScroll = (): void => {
      const scrollPosition = window.scrollY + 100;
      
      if (scrollPosition < 200) {
        setActiveSection('/');
        return;
      }
      
      navLinks.forEach(({ path, sectionId }) => {
        if (sectionId) {
          const element = document.getElementById(sectionId);
          
          if (element) {
            const { offsetTop, offsetHeight } = element;
            if (
              scrollPosition >= offsetTop && 
              scrollPosition < offsetTop + offsetHeight
            ) {
              setActiveSection(path);
            }
          }
        }
      });
    };

    // Check if we should scroll to a section on page load
    const checkForHashAndScroll = () => {
      // First, check URL hash
      const hash = window.location.hash;
      if (hash) {
        const sectionId = hash.substring(1);
        const element = document.getElementById(sectionId);
        
        if (element) {
          // Use a small timeout to ensure the page is fully loaded
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
            setActiveSection(`/#${sectionId}`);
          }, 100);
        }
        return;
      }
      
      // Then check sessionStorage (for cross-page navigation)
      const storedSection = sessionStorage.getItem('scrollToSection');
      if (storedSection) {
        const element = document.getElementById(storedSection);
        
        if (element) {
          // Use a small timeout to ensure the page is fully loaded
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
            setActiveSection(`/#${storedSection}`);
            // Clear the stored section after use
            sessionStorage.removeItem('scrollToSection');
          }, 100);
        }
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Check for hash or stored section on initial load
    checkForHashAndScroll();
    
    // Check active section on initial load
    handleScroll();
    
    // Clean up
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  

  return (
    <header className="bg-primary w-full sticky top-0 z-40">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 font-text py-2">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="md:flex md:items-center md:gap-12">
            <a 
              className="block text-gold" 
              href="/"
              onClick={(e) => {
                e.preventDefault();
                handleNavigation({ name: 'Home', path: '/', sectionId: 'home' });
              }}
            >
              <span className="sr-only">Home</span>
              <img 
                src="/images/logo.png" 
                alt="Cleaning Service" 
                className="w-20 h-8 lg:w-32 lg:h-12"
              />
            </a>
          </div>

          <div className="hidden md:block">
            <nav aria-label="Global">
              <ul className="flex items-center gap-6 text-[16px]">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <a 
                      className={`transition hover:text-gold cursor-pointer ${activeSection === link.path ? 'text-gold font-bold' : 'text-primary'}`}
                      href={link.path}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigation(link);
                      }}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Desktop Buttons */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-4">
                <Link to="/booking">
                  <Button 
                    label="Book Now" 
                    variant="primary" 
                  />
                </Link>

                {/* Notification Icon */}
                <button className="relative p-1 text-gray-600 hover:text-gray-800 transition-colors">
                  <FiBell className="w-5 h-5" />
                  {/* <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span> */}
                </button>
                
                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center">
                      <FiUser className="text-white text-sm" />
                    </div>
                    <span className="text-primary font-medium">{user?.firstName}</span>
                    <FiChevronDown className="w-4 h-4 text-gray-500" />
                  </button>
                  
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <button
                        onClick={handleDashboard}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Dashboard
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
                      >
                        <FiLogOut className="text-sm" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="sm:flex sm:gap-4">
                <Link to="/login" className="hidden md:flex">
                  <Button 
                    label="Login" 
                    variant="outline" 
                  />
                </Link>

                <Link to="/booking" className="hidden md:flex">
                  <Button 
                    label="Book Now" 
                    variant="primary" 
                  />
                </Link>
              </div>
            )}

            <div className="block md:hidden">
              <button
                onClick={toggleMenu}
                className="rounded- text-2xl p-2 text-gold transition cursor-pointer"
                aria-expanded={isMenuOpen}
                aria-label="Toggle menu"
              >
                <RxActivityLog />
              </button>
            </div>
          </div>
        </div>
      </div>
  
      {/* Mobile Menu */}
      <div 
        className={`fixed top-0 right-0 h-full w-[70%] bg-primary z-50 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={toggleMenu}
            className="p-2 text-gold cursor-pointer transition"
            aria-label="Close menu"
          >
            <RxCross1 />
          </button>
        </div>
        <nav className="px-4 py-3 font-text">
          <ul className="space-y-6 text-center">
            {navLinks.map((link) => (
              <li key={link.path}>
                <a 
                  className={`transition hover:text-gold cursor-pointer ${activeSection === link.path ? 'text-gold font-bold' : 'text-primary'}`}
                  href={link.path}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation(link);
                  }}
                >
                  {link.name}
                </a>
              </li>
            ))}
            {isAuthenticated ? (
              <li className="flex flex-col gap-3 pt-6">
                <Link 
                  to="/booking" 
                  className="w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button 
                    label="Book Now" 
                    variant="primary"
                  />
                </Link>
                <button
                  onClick={handleDashboard}
                  className="w-full"
                >
                  <Button 
                    label="Dashboard" 
                    variant="outline"
                  />
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full"
                >
                  <Button 
                    label="Logout" 
                    variant="outline"
                  />
                </button>
              </li>
            ) : (
              <li className="flex flex-col gap-3 pt-6">
                <Link 
                  to="/login" 
                  className="w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button 
                    label="Login" 
                    variant="outline"
                  />
                </Link>
                <Link 
                  to="/booking" 
                  className="w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button 
                    label="Book Now" 
                    variant="primary"
                  />
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
      
      {/* Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={toggleMenu}
        ></div>
      )}
      
      {/* Profile Dropdown Overlay */}
      {isProfileDropdownOpen && (
        <div 
          className="fixed inset-0 z-30"
          onClick={() => setIsProfileDropdownOpen(false)}
        ></div>
      )}
    </header>
  );
};