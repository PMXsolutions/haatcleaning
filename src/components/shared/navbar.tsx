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
  { name: 'About Us', path: '/#about', sectionId: 'about' },
  { name: 'Services', path: '/#services', sectionId: 'services' },
  // { name: 'Pricing', path: '/#pricing', sectionId: 'pricing' },
  { name: 'Contact', path: '/contactUs' },
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
    <header className="bg-primary w-full sticky top-0 z-40">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 font-text py-2">
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