import { FaHome, FaArrowRight, FaCheck, FaPhone, FaClock, FaShieldAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Button } from '@/components/shared/button'

interface ServiceData {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  detailedFeatures: string[];
  benefits: string[];
}

export const ResidentialServicePage: React.FC = () => {
  const serviceData: ServiceData = {
    icon: <FaHome className="text-6xl text-white" />,
    title: 'Residential Cleaning',
    subtitle: 'Professional Home Cleaning Services',
    description: 'Transform your home into a spotless sanctuary with our comprehensive residential cleaning services. Our experienced team uses eco-friendly products and proven techniques to ensure every corner of your home is thoroughly cleaned and sanitized.',
    detailedFeatures: [
      'Kitchen deep cleaning (appliances, countertops, cabinets)',
      'Bathroom sanitization and descaling',
      'Bedroom and living area dusting and vacuuming',
      'Floor mopping and carpet cleaning',
      'Window cleaning (interior)',
      'Baseboards and light fixture cleaning',
      'Trash removal and fresh linens',
      'Custom cleaning checklists available'
    ],
    benefits: [
      'Bonded and insured staff',
      'Flexible scheduling options',
      'Satisfaction guarantee',
      'Same cleaning team for consistency',
      'Free estimates and consultations',
      'Emergency cleaning services',
      '24/7 customer support'
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
            <h3 className="font-bold mb-2">Fully Insured</h3>
            <p className="">Your home is protected with comprehensive insurance coverage</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <FaClock className="text-4xl text-gold mx-auto mb-4" />
            <h3 className="font-bold mb-2">Flexible Scheduling</h3>
            <p className="">Weekly, bi-weekly, monthly, or one-time cleaning options</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <FaPhone className="text-4xl text-gold mx-auto mb-4" />
            <h3 className="font-bold mb-2">24/7 Support</h3>
            <p className="">Customer service available whenever you need us</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gold rounded-xl text-white p-12 text-center">
          <h2 className="text-3xl font-bold font-heading mb-4">Ready to Get Started?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl font-text mx-auto">
            Book your residential cleaning service today and experience the difference professional cleaning makes.
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
            Free estimates • Same-day quotes • Satisfaction guaranteed
          </p>
        </div>
      </div>
    </div>
  );
};