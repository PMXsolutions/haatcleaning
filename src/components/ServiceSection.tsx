import React from 'react';
import { Button } from '@/components/shared/button';

type ServiceItem = {
  icon: string;
  title: string;
  description: string;
};

type ServiceSectionProps = {
  services?: ServiceItem[];
  title?: string;
  subtitle?: string;
  buttonText?: string;
};

const ServiceSection: React.FC<ServiceSectionProps> = ({
  services = [
    {
      icon: "/icons/carpet-cleaning.svg",
      title: "Carpet Cleaning",
      description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem"
    },
    {
      icon: "/icons/bed-cleaning.svg",
      title: "Bed Room Cleaning",
      description: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit"
    },
    {
      icon: "/icons/sofa-cleaning.svg",
      title: "Sofa Cleaning",
      description: "But I must explain to you how all this mistaken idea of denouncing pleasure"
    },
    {
      icon: "/icons/toilet-cleaning.svg",
      title: "Toilet Cleaning",
      description: "The standard chunk of Lorem Ipsum used since the 1500s"
    }
  ],
  title = "What We Offer Services",
  subtitle = "SERVICES NOW",
  buttonText = "VIEW ALL SERVICES"
}) => {
  return (
    <section className="w-full py-16 px-6 md:px-20 bg-white">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-sm uppercase tracking-widest text-gray-500 mb-2">
          {subtitle}
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          {title}
        </h2>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {services.map((service, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition duration-300 flex flex-col items-center text-center">
            <img 
              src={service.icon}
              alt={service.title}
              className="w-16 h-16 mb-4"
              style={{
                filter:
                  "invert(60%) sepia(75%) saturate(1000%) hue-rotate(360deg) brightness(100%) contrast(100%)"
              }}
            />
            <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
            <p className="text-gray-600 text-sm">{service.description}</p>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <div className="flex justify-center mt-10">
        <Button 
          label={buttonText}
          variant="primary"
          onClick={() => console.log('View all services clicked')}
        />
      </div>
    </section>
  );
};

export default ServiceSection;

    