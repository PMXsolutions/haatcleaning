import { FaHome, FaBuilding, FaKey, FaCheck } from "react-icons/fa";
import { Button } from '@/components/shared/button'
import { useNavigate } from "react-router-dom";
// import { on } from "events";


interface Service {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
}

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  onLearnMore: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description, features, onLearnMore }) => {
  return (
    <div className="bg-white rounded-lg p-8 flex flex-col text-primary font-text">
      <div className="mb-6">
        <div className="text-6xl mb-4">{icon}</div>
        <h3 className="text-2xl font-bold mb-4">{title}</h3>
        <p className=" leading-relaxed">{description}</p>
      </div>
      
      <div className="flex-grow">
        <h4 className="font-semibold mb-3">Key Features:</h4>
        <ul className="space-y-2 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <FaCheck className="text-gold mt-1 mr-2 flex-shrink-0" />
              <span className="text-primary">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="flex justify-center sm:mt-8">
        <Button 
          label="Learn More" 
          variant="primary" 
          onClick={onLearnMore}
        />
        </div>
    </div>
  );
};


export const ServicesSection: React.FC = () => {
  const navigate = useNavigate();

  const services: Service[] = [
    {
      id: 'residential',
      icon: <FaHome className="text-6xl text-gold" />,
      title: 'Residential Cleaning',
      description: 'Complete home cleaning services tailored to your family\'s needs. From regular maintenance to deep cleaning, we keep your home spotless and healthy.',
      features: [
        'Regular weekly/bi-weekly cleaning',
        'Deep cleaning services',
        'Move-in/move-out cleaning',
        'Post-construction cleanup',
        'Eco-friendly products available'
      ]
    },
    {
      id: 'commercial',
      icon: <FaBuilding className="text-6xl text-gold" />,
      title: 'Commercial Cleaning',
      description: 'Professional cleaning services for offices, retail spaces, and commercial buildings. Maintain a clean, professional environment for your employees and customers.',
      features: [
        'Office and workspace cleaning',
        'Retail and restaurant cleaning',
        'Medical facility sanitization',
        'Post-construction cleanup',
        'Flexible scheduling options'
      ]
    },
    {
      id: 'airbnb',
      icon: <FaKey className="text-6xl text-gold" />,
      title: 'AirBnB Cleaning',
      description: 'Specialized turnover cleaning for short-term rentals. Fast, thorough, and reliable service to ensure your guests always arrive to a pristine property.',
      features: [
        'Quick turnover cleaning',
        'Guest-ready preparation',
        'Linen and towel service',
        'Inventory restocking',
        '24/7 emergency support'
      ]
    }
  ];

  const handleLearnMore = (serviceId: string) => {
    navigate(`/services/${serviceId}`);
  };

  return (
    <div className="">
      <div className="bg-secondary mx-auto px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-primary mb-4">
            Our Professional<br />
            Cleaning Services
          </h1>
          <p className="font-text text-primary max-w-xl mx-auto">
            Choose from our specialized cleaning services designed to meet your specific needs.
            Professional, reliable, and satisfaction guaranteed.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <ServiceCard 
              key={service.id}
              icon={service.icon}
              title={service.title}
              description={service.description}
              features={service.features}
              onLearnMore={() => handleLearnMore(service.id)}
            />
          ))}
        </div>

      </div>
    </div>
  );
};