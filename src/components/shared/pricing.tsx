import PricingCard from '@/components/shared/pricingCard';
import { GiFamilyHouse, GiHouse } from "react-icons/gi";
import { PiBuildingApartmentFill } from "react-icons/pi";

export const Pricing = () => {
  const pricingPlans = [
    {
      title: 'BASIC',
      price: '$100 USD',
      description: 'Perfect for small homes and apartments with basic cleaning needs',
      icon: <GiHouse className="w-20 h-20 text-gold" />,
      features: [
        'Up to 1500 sqft',
        '4 hours of cleaning',
        'Up to 2 cleaning tasks'
      ],
      highlighted: false
    },
    {
      title: 'STANDARD',
      price: '$149 USD',
      description: 'Ideal for medium-sized homes requiring regular maintenance',
      icon: <GiFamilyHouse className="w-20 h-20 text-gold" />,
      features: [
        'Up to 2500 sqft',
        '6 hours of cleaning',
        'Up to 4 cleaning tasks'
      ],
      highlighted: false
    },
    {
      title: 'DELUXE',
      price: '$299 USD',
      description: 'Comprehensive cleaning for larger homes and special occasions',
      icon: <PiBuildingApartmentFill className="w-24 h-24 text-gold" />,
      features: [
        'Up to 3500 sqft',
        '12 hours of cleaning',
        'Up to 10 cleaning tasks'
      ],
      highlighted: true
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 pt-16">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary font-heading mb-4">Pricing Plans</h2>
        <p className="text-lg text-primary font-text max-w-2xl mx-auto">
          Choose the perfect cleaning package for your home or business needs
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 ">
        {pricingPlans.map((plan, index) => (
          <PricingCard key={index} {...plan} />
        ))}
      </div>
    </div>
  );
};
