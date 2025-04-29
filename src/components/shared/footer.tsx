import { RxLinkedinLogo, RxTwitterLogo, RxVideo, RxInstagramLogo } from "react-icons/rx";

interface SocialLink {
  name: React.ReactNode;
  url: string;
}

export const Footer: React.FC = () => {
  const socialLinks: SocialLink[] = [
    { name: <RxLinkedinLogo />, url: '#' },
    { name: <RxTwitterLogo />, url: '#' },
    { name: <RxVideo />, url: '#' },
    { name: <RxInstagramLogo />, url: '#' },
  ];

  return (
    <footer className="border-t border-color mt-4 font-text">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-8 md:py-12 text-primary">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:justify-items-center text-center">
          {/* Logo and Tagline */}
          <div>
            <h2 className="flex justify-center text-lg font-semibold">
              <span className="inline-block">◎</span>HAAT
            </h2>
            <p className="mt-2 text-sm ">
              Cleaning services at its peak. 
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-medium mb-3">Contact :</h3>
            <p className="text-sm  mb-1">info@example.com</p>
            <p className="text-sm ">+1 555-123-7777</p>
          </div>

          {/* Address */}
          <div>
            <h3 className="font-medium mb-3">Address :</h3>
            <p className="text-sm ">
              123 Ocean Avenue, Bay View,<br /> The World
            </p>
          </div>
          
          {/* Social Links */}
          <div className="flex flex-col">
            <h3 className="font-medium mb-3">Social :</h3>
            <div className="flex gap-2 justify-center items-center">
              {socialLinks.map((link, index) => (
                <a 
                  key={index}
                  href={link.url}
                  className="text-sm"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Copyright */}
      <div className="bg-black text-white py-4 text-xs text-center">
        <div className="container mx-auto px-4">
          © {new Date().getFullYear()} HAAT Cleaning Service. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};
