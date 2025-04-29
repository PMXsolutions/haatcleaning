import React from 'react';
import { Link } from 'react-router-dom'
import { Button } from '@/components/shared/button'

const Home: React.FC = () => {
  return (
    <main className="w-full overflow-hidden">

      {/* hero content */}
      <section className='relative w-full h-[80vh] overflow-hidden rounded-3xl'>
        <div className="absolute inset-0">
          <img 
            src="/images/hero-bg.jpg" 
            alt="Cleaning Service" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Content Container */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8">
              Quality cleaning, tailored to your needs
            </h1>
            <p className="text-sm uppercase tracking-wider mb-2">COMMITTED TO TOP QUALITY SERVICE</p>
            
            <div className='flex justify-center gap-4 mt-4'>
              <Link to='/'>
                <Button 
                  label="Book Now" 
                  variant="primary" 
                />
              </Link>

              <Link to='/'>
                <Button 
                  label="Check Our Services" 
                  variant="outline" 
                />
              </Link>

            </div>
          </div>
        </div>
      </section>
      
      
    </main>
  );
};

export default Home;