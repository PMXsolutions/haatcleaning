import React from 'react';
import { Link } from 'react-router-dom'
import { Button } from '@/components/shared/button'
import CleaningImages from '@/components/CleaningImages';
import ServiceSection from '@/components/ServiceSection';




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
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4">
              Quality cleaning, tailored to your needs.
            </h1>
            <p className="text-2xl mb-2 font-bold max-w-xl mx-auto">Expert cleaning services for homes and businesses. Fast, reliable, and tailored to your needs.</p>
            
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

      {/* SERVICES SECTION */}

      <section className="w-full py-16 px-6 md:px-20 bg-white grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Left Images */}
          
          <section className='w-full py-16 px-6 md:px-20 bg-white grid grid-cols-1 md:grid-cols-2 gap-10 items-center'>
            <CleaningImages />
          </section>

          {/* Right Content */}
          <div>
            <p className="text-sm uppercase tracking-widest text-gray-500 mb-2">
              About Shift <span className="text-orange-500 font-semibold">Group</span>
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Residential Cleaning Services
            </h2>
            <p className="text-gray-700 mb-4">
              In a professional context it often happens that private or corporate clients        order a publication to be made and presented with the actual content still not        being ready.
            </p>
            <p className="text-gray-700 mb-6">
              On the other hand, we denounce with righteous indignation and dislike men who         are so beguiled and demoralized by the charms of pleasure of the moment.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 mb-6">
              <div>
                <p className="text-2xl font-bold">53k</p>
                <p className="text-sm text-gray-600">Layout Done</p>
              </div>
              <div>
                <p className="text-2xl font-bold">10k</p>
                <p className="text-sm text-gray-600">Projects Done</p>
              </div>
              <div>
                <p className="text-2xl font-bold">150</p>
                <p className="text-sm text-gray-600">Get Awards</p>
              </div>
            </div>

            <Button 
              label="LEARN MORE" 
              variant="primary" 
              onClick={() => console.log('Learn more clicked')} 
            />
          </div>
        </section>

        <section>
          <ServiceSection />
        </section>

      
    </main>
  );
};

export default Home;