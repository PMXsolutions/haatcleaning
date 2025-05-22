import { FaBuilding, FaArrowRight, FaCheck, FaClock, FaShieldAlt, FaUsers, FaLeaf } from "react-icons/fa";

import { Link } from "react-router-dom";
import { Button } from '@/components/shared/button'

interface Industry {
  name: string;
  icon: string;
}

interface ServiceData {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  detailedFeatures: string[];
  benefits: string[];
  industries: Industry[];
}

export const CommercialServicePage: React.FC = () => {
  const serviceData: ServiceData = {
    icon: <FaBuilding className="text-6xl text-white" />,
    title: 'Commercial Cleaning',
    subtitle: 'Professional Business Cleaning Solutions',
    description: 'Maintain a pristine, professional environment that impresses clients and keeps employees healthy and productive. Our commercial cleaning services are tailored to meet the unique needs of your business.',
    detailedFeatures: [
      'Daily office cleaning and maintenance',
      'Restroom sanitization and restocking',
      'Break room and kitchen cleaning',
      'Floor care (mopping, vacuuming, polishing)',
      'Window and glass surface cleaning',
      'Trash removal and recycling',
      'Dusting and disinfection of workstations',
      'Conference room setup and cleaning',
      'Lobby and reception area maintenance',
      'Specialized medical facility cleaning'
    ],
    benefits: [
      'Licensed and bonded professionals',
      'Customizable service packages',
      'Green cleaning options available',
      'After-hours service available',
      'Quality control inspections',
      'Competitive commercial rates',
      'Emergency response services',
      'Detailed service reporting'
    ],
    industries: [
      { name: 'Corporate Offices', icon: '🏢' },
      { name: 'Medical Facilities', icon: '🏥' },
      { name: 'Retail Stores', icon: '🛍️' },
      { name: 'Restaurants', icon: '🍽️' },
      { name: 'Schools', icon: '🎓' },
      { name: 'Warehouses', icon: '📦' }
    ]
  };

  const handleBackToServices = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gold text-white">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <button
            onClick={handleBackToServices}
            className="mb-6 flex items-center text-white/90 hover:text-white font-medium transition-colors"
          >
            <FaArrowRight className="mr-2 rotate-180" />
            Back to All Services
          </button>
          
          <div className="flex items-center mb-6 font-text">
            <span className="mr-6">{serviceData.icon}</span>
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-2">{serviceData.title}</h1>
              <p className="text-xl">{serviceData.subtitle}</p>
            </div>
          </div>
          
          <p className="text-lg max-w-4xl leading-relaxed">
            {serviceData.description}
          </p>
        </div>
      </div>

      {/* Industries We Serve */}
      <div className="bg-white py-16 text-primary">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Industries We Serve</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {serviceData.industries.map((industry, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-3">{industry.icon}</div>
                <h3 className="font-semibold">{industry.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Services & Benefits Grid */}
        <div className="grid md:grid-cols-2 gap-12 mb-16 font-text">
          <div>
          <h2 className="text-3xl font-bold font-heading text-primary mb-6">Our Services Include</h2>
            <ul className="space-y-4">
              {serviceData.detailedFeatures.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <FaCheck className="text-gold mt-1 mr-3 flex-shrink-0" />
                  <span className="">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h2 className="text-3xl font-bold font-heading text-primary mb-6">Why Choose Us</h2>
            <ul className="space-y-4">
              {serviceData.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <FaCheck className="text-gold mt-1 mr-3 flex-shrink-0" />
                  <span className="">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="grid sm:grid-cols-3 gap-8 mb-16 text-primary">
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <FaShieldAlt className="text-4xl text-gold mx-auto mb-4" />
            <h3 className="font-bold mb-2">Fully Licensed</h3>
            <p className="">Bonded and insured for your protection</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <FaClock className="text-4xl text-gold mx-auto mb-4" />
            <h3 className="font-bold mb-2">Flexible Hours</h3>
            <p className="">After-hours and weekend service available</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <FaUsers className="text-4xl text-gold mx-auto mb-4" />
            <h3 className="font-bold mb-2">Trained Staff</h3>
            <p className="">Professional, background-checked employees</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <FaLeaf className="text-4xl text-gold mx-auto mb-4" />
            <h3 className="font-bold mb-2">Eco-Friendly</h3>
            <p className="">Green cleaning products available</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gold rounded-xl text-white p-12 text-center">
          <h2 className="text-3xl font-bold font-heading mb-4">Ready to Enhance Your Business Environment?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl font-text mx-auto">
            Get a custom quote for your commercial cleaning needs. We'll work with your schedule and budget.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/booking">
              <Button 
                label="Book Now" 
                variant="outline" 
                // onClick={onLearnMore}
              />
            </Link>
          </div>
          
          <p className="text-sm mt-6">
            Free site evaluation • Customized cleaning plans • 24/7 emergency service
          </p>
        </div>
      </div>
    </div>
  );
};