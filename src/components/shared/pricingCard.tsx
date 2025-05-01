import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/shared/button';
import { FaCheckSquare } from "react-icons/fa";

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  highlighted: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  description,
  icon,
  features,
  highlighted
}) => {
  return (
    <div 
      className={`rounded-lg overflow-hidden border transition-all h-full flex flex-col ${
        highlighted 
          ? 'border-color shadow-lg transform scale-105' 
          : 'border-gray-300'
      }`}
    >
      <div className="p-8 flex-grow">
        <div className="flex justify-center mb-6">
          {icon}
        </div>
        
        <h3 className="text-lg font-semibold text-gold font-text mb-2">
          {title}
        </h3>
        
        <div className="mb-4">
          <span className="text-3xl font-bold text-primary font-heading">{price}</span>
        </div>
        
        <p className="text-primary font-text mb-8">
          {description}
        </p>
        
        <div className="pt-6 mb-6 font-text">
          <h4 className="font-medium text-gray-900 mb-4">What's included?</h4>
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start place-items-center">
                <span className="mr-2 mt-1 bg-muted p-1 rounded-full text-gold">
                  <FaCheckSquare className="w-3 h-3" />
                </span>
                <span className="text-primary font-text">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="px-6 pb-6 mt-auto mx-auto">
        <Link to='/'>
          <Button 
            label="Book Now" 
            variant={highlighted
              ? "primary" 
              : "outline"
            }
          />
        </Link>
      </div>
    </div>
  );
};

export default PricingCard;