import React from 'react';
import { Link } from 'react-router-dom'
import { Button } from '@/components/shared/button'
import { ImageGallery } from '@/components/shared/ImageGallery'
import { ServicesSection } from '@/components/shared/servicesSection'
import { CleaningServicesHero } from '@/components/shared/cleaningStat'
import { Testimonials } from '@/components/shared/clientTestimonial'
import FAQ from '@/components/shared/faq'
import { About } from '@/components/shared/about'
import { Pricing } from '@/components/shared/pricing'
import ContactUs from '@/components/shared/contact'


const Home: React.FC = () => {
  return (
    <main className="w-full overflow-hidden" id="home">

      {/* hero content */}
      <section className='relative w-full h-[80vh] overflow-hidden rounded-3xl mt-6'>
        <div className="absolute inset-0">
          <img 
            src="/images/hero-bg.jpg" 
            alt="Cleaning Service" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
        
        {/* Content Container */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 font-heading">
              Quality cleaning, tailored to your needs.
            </h1>
            <p className="text-2xl mb-2 font-bold max-w-xl mx-auto font-text">Expert cleaning services for homes and businesses. Fast, reliable, and tailored to your needs.</p>
            
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

      {/* About Section */}
      <section id="about" className="flex flex-col md:flex-row justify-center gap-10 py-12 space-y-8 md:space-y-0 md:space-x-12 max-w-[80%] my-4 mx-auto">
        <div className='flex-1 flex justify-center md:my-auto lg:my-0'>
          <ImageGallery images={["/images/cleaning1.jpg", "/images/cleaning2.jpg"]} />
        </div>

        <div className="flex flex-1 flex-col justify-center py-4 text-primary">
          <p className="md:text-[14px] lg:text-sm uppercase text-gold font-text pt-2">
            About HAAT Cleaning Services
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4 font-heading">
            Residential Cleaning Services
          </h2>
          <p className="mb-4">
            In a professional context it often happens that private or corporate
            clients order a publication to be made and presented with the actual
            content still not being ready.
          </p>
          <p className="mb-6">
            On the other hand, we denounce with righteous indignation and dislike
            men who are so beguiled and demoralized by the charms of pleasure of
            the moment.
          </p>
          <div className="flex space-x-8 mb-6">
            <div>
              <p className="text-xl font-bold">53k</p>
              <p className="text-sm">Layout Done</p>
            </div>
            <div>
              <p className="text-xl font-bold">10k</p>
              <p className="text-sm">Projects Done</p>
            </div>
            <div>
              <p className="text-xl font-bold">150</p>
              <p className="text-sm">Got Awards</p>
            </div>
          </div>
          {/* <Link to='/about'>
            <Button 
              label="Learn More" 
              variant="primary" 
            />
          </Link> */}
        </div>

      </section>

      {/* about */}
      <section className='w-full sm:max-w-[85%] mx-auto'>
        <About />
      </section>

      {/* services */}
      <section id="services" className='w-full mx-auto'>
        <ServicesSection />
      </section>

      <section className='w-full sm:max-w-[85%] mx-auto p-4 sm:p-0'>
        <CleaningServicesHero />
      </section>

      <section className='w-full sm:max-w-[85%] mx-auto'>
        <Testimonials />
      </section>

      {/* faq section */}
      <section className="flex flex-col md:flex-row justify-center gap-10 py-12 space-y-8 md:space-y-0 md:space-x-12 max-w-[80%] my-4 mx-auto">
        <div className='flex-1 flex justify-center md:my-auto lg:my-0'>
          <ImageGallery images={["/images/cleaning1.jpg", "/images/cleaning2.jpg"]} />
        </div>

        <div className="flex flex-1 flex-col justify-center py-4 text-primary">
          <p className="md:text-[14px] lg:text-sm uppercase text-gold font-text pt-2">
            FAQ
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4 font-heading">
            Get answers to common questions about us.
          </h2>
          <FAQ />
        </div>
      </section>

      <section id="pricing" className='w-full sm:max-w-[85%] mx-auto'>
        <Pricing />
      </section>

      <section id="contact" className='w-full mx-auto'>
        <ContactUs />
      </section>

      
    </main>
  );
};

export default Home;