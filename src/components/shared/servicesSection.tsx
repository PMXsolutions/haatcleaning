import { FaHome, FaBuilding, FaKey, FaArrowRight } from "react-icons/fa";
import { Button } from '@/components/shared/button'
import { useNavigate } from "react-router-dom";
// import { on } from "events";

interface Service {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  image: string
}

interface ServiceCardProps {
  title: string;
  description: string;
  features: string[];
  image: string
  onLearnMore: () => void;
  // onBookNow: () => void
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, features, image, onLearnMore }) => {
  return (
    <div className="flex flex-col text-primary font-text">
      {/* Service Image */}
      <div className="">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover rounded-xl" 
        />
      </div>

      {/* card content */}
      <div className="p-2 flex flex-col flex-grow">
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-gray-600 leading-relaxed mb-4">{description}</p>

        <div className="mb-6 flex-grow">
          <h4 className="font-medium mb-3 text-gray-900">Key Features:</h4>
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start text-sm">
                <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-600">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto">
          <Button 
            label="Learn More" 
            variant="primary" 
            onClick={onLearnMore}
            icon={<FaArrowRight className="text-sm" />}
          />
        </div>
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
      image: "/images/Residential.png",
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
      image: "/images/Commercial.png",
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
      image: "/images/Airbnb.png",
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
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="">
          {/* Text Content */}
          <div className="flex flex-col md:flex-row justify-between ">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 font-heading max-w-md leading-12">Our Professional Cleaning Services</h2>
            <div className="text-gray-700 leading-relaxed max-w-md font-body">
              <h4 className="font-bold text-lg text-primary mb-2">Services</h4>
              <p className="">
                Choose from our specialized cleaning services designed to meet your specific needs. Professional,
                reliable, and satisfaction guaranteed.
              </p>
            </div>
          </div>
        </div>

        <hr  className="my-8"/>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <ServiceCard 
              key={service.id}
              title={service.title}
              description={service.description}
              image={service.image}
              features={service.features}
              onLearnMore={() => handleLearnMore(service.id)}
            />
          ))}
        </div>

      </div>
    </div>
  );
};