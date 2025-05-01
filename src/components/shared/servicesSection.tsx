import React from 'react';
// import { Link } from 'react-router-dom'
// import { Button } from '@/components/shared/button'
import { ServiceCard } from '@/components/shared/serviceCard';

export const ServicesSection: React.FC = () => {
  const services = [
    {
      icon: 'floor' as const,
      title: 'Floor cleaning',
      description: 'Professional floor maintenance for all surfaces. Our deep cleaning process removes dirt, stains, and buildup while protecting your floors for lasting beauty and durability.',
    },
    {
      icon: 'dusting' as const,
      title: 'Dusting cleaning',
      description: 'Comprehensive dusting services that reach every corner. We eliminate allergens and dust from high shelves, ceiling fans, blinds, and other hard-to-reach surfaces.',

    },
    {
      icon: 'appliance' as const,
      title: 'Appliance cleaning',
      description: 'Detailed appliance cleaning that extends the life of your investments. Our technicians thoroughly clean interiors and exteriors for optimal performance and hygiene.',
    },
    {
      icon: 'window' as const,
      title: 'Window cleaning',
      description: 'Professional streak-free window cleaning for crystal clear views. We use specialized tools and solutions to remove dirt, water spots, and grime from all window types.',
    },
    {
      icon: 'vacuum' as const,
      title: 'Vacuum cleaning',
      description: 'Thorough vacuum cleaning for all floor surfaces. Our high-powered equipment removes dirt, dust, pet hair, and allergens from carpets, rugs, and hard floors.',
    },
    {
      icon: 'laundry' as const,
      title: 'Laundry services',
      description: 'Comprehensive laundry services including washing, drying, folding, and ironing. We use premium detergents and handle all fabrics with care for optimal results.',
    },
    {
      icon: 'mirror' as const,
      title: 'Cleaning mirrors',
      description: 'Specialized mirror cleaning for a spotless, streak-free finish. Our techniques and solutions ensure your mirrors shine brilliantly without smudges or residue.',
    },
    {
      icon: 'kitchen' as const,
      title: 'Kitchen cleaning',
      description: 'Deep kitchen cleaning that sanitizes and degreases all surfaces. We tackle countertops, appliances, cabinets, sinks, and floors for a hygienically clean cooking space.',
    },
    {
      icon: 'fireplace' as const,
      title: 'Cleaning fireplaces',
      description: 'Expert fireplace cleaning and maintenance. We remove soot, creosote, and debris to improve safety, efficiency, and appearance of your fireplace and chimney.',
    },
    {
      icon: 'closet' as const,
      title: 'Organizing closets',
      description: 'Professional closet organization and cleaning services. We sort, declutter, and arrange your belongings for maximum space efficiency and accessibility.',
    },
    {
      icon: 'bathroom' as const,
      title: 'Bathroom cleaning',
      description: 'Comprehensive bathroom sanitizing and cleaning. We eliminate soap scum, mildew, and bacteria from all surfaces, leaving your bathroom fresh and hygienic.',
    },
    {
      icon: 'garage' as const,
      title: 'Cleaning garages',
      description: 'Thorough garage cleaning and organization. We sweep, power wash, and organize to transform your cluttered garage into a clean, functional space.',
    },
    {
      icon: 'exterior' as const,
      title: 'Cleaning exteriors',
      description: 'Professional exterior cleaning for homes and buildings. Our services include pressure washing, siding cleaning, and removal of dirt, algae, and mildew.',
    },
    {
      icon: 'bed' as const,
      title: 'Cleaning bed linens',
      description: 'Comprehensive bed linen cleaning and changing services. We wash, dry, and replace sheets, pillowcases, and duvet covers for fresh, comfortable bedding.',
    },
    {
      icon: 'furniture' as const,
      title: 'Cleaning tables and chairs',
      description: 'Specialized furniture cleaning for all materials. We remove stains, dust, and grime while protecting the finish and extending the life of your tables and chairs.',
    },
    {
      icon: 'carpet' as const,
      title: 'Carpet cleaning',
      description: 'Deep carpet cleaning that removes embedded dirt and stains. Our hot water extraction method penetrates fibers to lift grime while minimizing drying time.',
    },
    {
      icon: 'ceiling' as const,
      title: 'Cleaning ceiling',
      description: 'Professional ceiling cleaning for all types. We remove dust, cobwebs, and stains from flat, textured, and vaulted ceilings without damaging the surface.',
    },
    {
      icon: 'cobweb' as const,
      title: 'Removing cobwebs',
      description: 'Thorough cobweb removal from all corners and high areas. We use specialized tools to safely eliminate spider webs from ceilings, light fixtures, and hard-to-reach areas.',
    },
  
  ];

  return (
    <div className="bg-gold px-6 py-16 rounded-xl">
      <div className="w-full mx-auto">
        <div className="flex flex-col justify-center sm:flex-row sm:justify-between items-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center mx-auto">
            Take a look at our<br />
            professional services
          </h2>
          {/* <Link to='/' className='hidden md:block'>
            <Button 
              label="Browse All Services" 
              variant="outline" 
            />
          </Link> */}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard 
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
            />
          ))}
        </div>

        {/* <Link to='/' className='block md:hidden text-center mt-8'>
            <Button 
              label="Browse All Services" 
              variant="outline" 
            />
          </Link> */}
      </div>
    </div>
  );
};

