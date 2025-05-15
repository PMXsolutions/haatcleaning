import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Keep this import as it's in your original code
import { RxActivityLog, RxCross1 } from "react-icons/rx";

import { Button } from '@/components/shared/button';

interface NavLink {
  name: string;
  path: string;
  sectionId?: string;
  isExternal?: boolean;
}

const navLinks: NavLink[] = [
  { name: 'Home', path: '/', sectionId: 'home' }, // Using path for page navigation and sectionId for scrolling
  { name: 'About', path: '/#about', sectionId: 'about' },
  { name: 'Services', path: '/#services', sectionId: 'services' },
  { name: 'Pricing', path: '/#pricing', sectionId: 'pricing' },
  { name: 'Contact Us', path: '/#contact', sectionId: 'contact' },
  // { name: 'Admin', path: '/admin' },
];

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const toggleMenu = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Function to handle navigation or scrolling when link is clicked
  const handleNavigation = (link: NavLink) => {
    const { path, sectionId } = link;
    const isCurrentPage = window.location.pathname === '/' || window.location.pathname === '';
    
    // Close menu if open
    if (isMenuOpen) setIsMenuOpen(false);
    
    // Case 1: We're on the home page and need to scroll to a section
    if (isCurrentPage && sectionId) {
      const element = document.getElementById(sectionId);
      
      if (element) {
        // Scroll smoothly to the element
        element.scrollIntoView({ behavior: 'smooth' });
        
        // Update URL with hash without causing a page jump
        window.history.pushState({}, '', path);
        
        // Set active section based on path
        setActiveSection(path);
      }
      return;
    }
    
    // Case 2: We need to navigate to the home page and then scroll to a section
    if (!isCurrentPage && path.includes('#')) {
      // Store the target section in sessionStorage to retrieve after page navigation
      if (sectionId) {
        sessionStorage.setItem('scrollToSection', sectionId);
      }
      
      // Navigate to the home page
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

  // Function to check which section is currently in view and handle initial section scrolling
  useEffect(() => {
    const handleScroll = (): void => {
      const scrollPosition = window.scrollY + 100; // Offset for navbar height
      
      // Check if we're at the top for home section
      if (scrollPosition < 200) {
        setActiveSection('/');
        return;
      }
      
      // Check each section to see if it's in view
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
    <header className="bg-primary w-full sticky top-0 z-40 border-b border-color">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 font-text">
        <div className="flex h-16 items-center justify-between">
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
              <svg className="h-8" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M0.41 10.3847C1.14777 7.4194 2.85643 4.7861 5.2639 2.90424C7.6714 1.02234 10.6393 0 13.695 0C16.7507 0 19.7186 1.02234 22.1261 2.90424C24.5336 4.7861 26.2422 7.4194 26.98 10.3847H25.78C23.7557 10.3549 21.7729 10.9599 20.11 12.1147C20.014 12.1842 19.9138 12.2477 19.81 12.3047H19.67C19.5662 12.2477 19.466 12.1842 19.37 12.1147C17.6924 10.9866 15.7166 10.3841 13.695 10.3841C11.6734 10.3841 9.6976 10.9866 8.02 12.1147C7.924 12.1842 7.8238 12.2477 7.72 12.3047H7.58C7.4762 12.2477 7.376 12.1842 7.28 12.1147C5.6171 10.9599 3.6343 10.3549 1.61 10.3847H0.41ZM23.62 16.6547C24.236 16.175 24.9995 15.924 25.78 15.9447H27.39V12.7347H25.78C24.4052 12.7181 23.0619 13.146 21.95 13.9547C21.3243 14.416 20.5674 14.6649 19.79 14.6649C19.0126 14.6649 18.2557 14.416 17.63 13.9547C16.4899 13.1611 15.1341 12.7356 13.745 12.7356C12.3559 12.7356 11.0001 13.1611 9.86 13.9547C9.2343 14.416 8.4774 14.6649 7.7 14.6649C6.9226 14.6649 6.1657 14.416 5.54 13.9547C4.4144 13.1356 3.0518 12.7072 1.66 12.7347H0V15.9447H1.61C2.39051 15.924 3.154 16.175 3.77 16.6547C4.908 17.4489 6.2623 17.8747 7.65 17.8747C9.0377 17.8747 10.392 17.4489 11.53 16.6547C12.1468 16.1765 12.9097 15.9257 13.69 15.9447C14.4708 15.9223 15.2348 16.1735 15.85 16.6547C16.9901 17.4484 18.3459 17.8738 19.735 17.8738C21.1241 17.8738 22.4799 17.4484 23.62 16.6547ZM23.62 22.3947C24.236 21.915 24.9995 21.664 25.78 21.6847H27.39V18.4747H25.78C24.4052 18.4581 23.0619 18.886 21.95 19.6947C21.3243 20.156 20.5674 20.4049 19.79 20.4049C19.0126 20.4049 18.2557 20.156 17.63 19.6947C16.4899 18.9011 15.1341 18.4757 13.745 18.4757C12.3559 18.4757 11.0001 18.9011 9.86 19.6947C9.2343 20.156 8.4774 20.4049 7.7 20.4049C6.9226 20.4049 6.1657 20.156 5.54 19.6947C4.4144 18.8757 3.0518 18.4472 1.66 18.4747H0V21.6847H1.61C2.39051 21.664 3.154 21.915 3.77 22.3947C4.908 23.1889 6.2623 23.6147 7.65 23.6147C9.0377 23.6147 10.392 23.1889 11.53 22.3947C12.1468 21.9165 12.9097 21.6657 13.69 21.6847C14.4708 21.6623 15.2348 21.9135 15.85 22.3947C16.9901 23.1884 18.3459 23.6138 19.735 23.6138C21.1241 23.6138 22.4799 23.1884 23.62 22.3947Z"
                  fill="currentColor"
                />
              </svg>
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
            <div className="sm:flex sm:gap-4">
              <Link to="/booking" className="hidden md:flex">
                <Button 
                  label="Book Now" 
                  variant="primary" 
                />
              </Link>

              <Link to="/login" className="hidden md:flex">
                <Button 
                  label="Login" 
                  variant="outline" 
                />
              </Link>
            </div>

            <div className="block md:hidden">
              <button
                onClick={toggleMenu}
                className="rounded- text-2xl p-2 text-gold transition"
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
            className="p-2 text-gold hover:text-white transition"
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
    </header>
  );
};