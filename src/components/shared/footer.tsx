// import { RxLinkedinLogo, RxTwitterLogo, RxVideo, RxInstagramLogo } from "react-icons/rx";
import { useState } from "react"
import { Button } from "@/components/shared/button"

// interface SocialLink {
//   name: React.ReactNode;
//   url: string;
// }

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("")

  // const socialLinks: SocialLink[] = [
  //   { name: <RxLinkedinLogo />, url: '#' },
  //   { name: <RxTwitterLogo />, url: '#' },
  //   { name: <RxVideo />, url: '#' },
  //   { name: <RxInstagramLogo />, url: '#' },
  // ];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter signup
    console.log("Newsletter signup:", email)
    setEmail("")
  }

  return (
    <footer className="border-t border-color mt-4 bg-black text-white font-body">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Logo and Tagline */}
          <div>
            <img 
                src="/images/logo.png" 
                alt="Cleaning Service" 
                className="w-20 h-8 lg:w-32 lg:h-12"
            />
            <p className="mt-6 text-sm ">
              Stay updated with our latest cleaning tips, service updates, and helpful articles on maintaining a
              spotless home.
            </p>
          </div>

          {/* Middle - Company Links */}
          <div className="space-y-4 text-center">
            <h3 className="font-semibold text-lg">Company</h3>
            <nav className="flex flex-col space-y-3">
              <a href="#about" className="text-gray-300 hover:text-white transition-colors text-sm">
                About Us
              </a>
              <a href="#services" className="text-gray-300 hover:text-white transition-colors text-sm">
                Services
              </a>
              <a href="#team" className="text-gray-300 hover:text-white transition-colors text-sm">
                Our Team
              </a>
            </nav>
          </div>

          {/* Right - Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Newsletter</h3>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Goes Here"
                className="w-full px-4 py-2 border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                required
              />
              <Button
                label="Send"
                variant="primary"
                className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold px-6 py-2"
              />
            </form>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-gray-600 text-center">
          © {new Date().getFullYear()} HAAT Cleaning Service. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};
