import {  FaKey,
  FaArrowRight,
  FaCheck,
  FaClock,
  FaShieldAlt,
  FaStar,
  FaCamera,
  FaMobile, } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Button } from '@/components/shared/button'

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface ServiceData {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  detailedFeatures: string[];
  benefits: string[];
  features: Feature[];
}

export const AirBnBServicePage: React.FC = () => {
  const serviceData: ServiceData = {
    icon: <FaKey className="text-6xl text-white" />,
    title: 'AirBnB Cleaning',
    subtitle: 'Short-Term Rental Cleaning Specialists',
    description: 'Maximize your rental income with our specialized AirBnB turnover cleaning services. We ensure every guest arrives to a spotless, welcoming space that earns you 5-star reviews and repeat bookings.',
    detailedFeatures: [
      'Complete turnover between guests (2-4 hours)',
      'Fresh bed linens and towel replacement',
      'Kitchen restocking and sanitization',
      'Bathroom deep cleaning and amenity refill',
      'Living area reset and decoration arrangement',
      'Floor cleaning and carpet spot treatment',
      'Trash removal and fresh bag placement',
      'Final walkthrough and damage reporting',
      'Welcome amenities setup',
      'Quality photos for listing updates',
    ],
    benefits: [
      'Guaranteed 4-hour turnaround',
      'Same-day booking available',
      'Damage and maintenance reporting',
      'Inventory management services',
      'Photo documentation provided',
      'Backup team availability',
      'Host communication app integration',
      'Guest review protection',
    ],
    features: [
      {
        title: 'Lightning-Fast Turnovers',
        description: 'Same-day cleaning between checkout and check-in',
        icon: <FaClock className="text-4xl text-gold" />,
      },
      {
        title: 'Quality Documentation',
        description: 'Before/after photos and damage reports',
        icon: <FaCamera className="text-4xl text-gold" />,
      },
      {
        title: 'Mobile App Integration',
        description: 'Real-time updates and scheduling via app',
        icon: <FaMobile className="text-4xl text-gold" />,
      },
      {
        title: '5-Star Guarantee',
        description: 'Guest-ready standards every single time',
        icon: <FaStar className="text-4xl text-gold" />,
      },
    ],
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

      {/* Key Features */}
      <div className="bg-white py-16 text-primary">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Why Hosts Choose Us</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 align-items-center">
            {serviceData.features.map((feature, index) => (
              <div key={index} className="p-6 place-items-center text-center">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="font-bold mb-3">{feature.title}</h3>
                <p className="">{feature.description}</p>
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
          <h2 className="text-3xl font-bold font-heading text-primary mb-6">Our Turnover Process</h2>
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
            <h2 className="text-3xl font-bold font-heading text-primary mb-6">Host Benefits</h2>
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
            <h3 className="font-bold mb-2">Fully Insured</h3>
            <p className="">Your home is protected with comprehensive insurance coverage</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <FaClock className="text-4xl text-gold mx-auto mb-4" />
            <h3 className="font-bold mb-2">Flexible Scheduling</h3>
            <p className="">Weekly, bi-weekly, monthly, or one-time cleaning options</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <FaStar className="text-4xl text-gold mx-auto mb-4" />
            <h3 className="font-bold mb-2">24/7 Support</h3>
            <p className="">Customer service available whenever you need us</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gold rounded-xl text-white p-12 text-center">
          <h2 className="text-3xl font-bold font-heading mb-4">Ready to Get Started?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl font-text mx-auto">
            Join hundreds of successful hosts who trust us with their property turnovers. Get started today!
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
            First clean 50% off  • Same-day emergency service • Host dashboard included
          </p>
        </div>
      </div>
    </div>
  );
};