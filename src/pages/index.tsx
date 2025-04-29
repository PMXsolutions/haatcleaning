import React from 'react';
import { Button } from '@/components/shared/button'

const Home: React.FC = () => {
  return (
    <main className="w-full overflow-hidden">

      {/* hero content */}
      <section className='relative w-full h-screen'>
        <div className="absolute inset-0 bg-black/30">
          <img 
            src="/cleaning-background.jpg" 
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
            
            <Button 
              label="BOOK NOW" 
              variant="primary" 
              onClick={() => console.log('Sign up clicked')}
            />
          </div>
        </div>
      </section>
      
      
    </main>
  );
};

export default Home;