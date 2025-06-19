import { Link } from 'react-router-dom'
import { Button } from '@/components/shared/button'
import { ImageGallery } from '@/components/shared/ImageGallery'
import { ServicesSection } from '@/components/shared/servicesSection'
// import { CleaningServicesHero } from '@/components/shared/cleaningStat'
import { Testimonials } from '@/components/shared/clientTestimonial'
import FAQ from '@/components/shared/faq'
import { About } from '@/components/shared/about'
// import { Pricing } from '@/components/shared/pricing'
// import ContactUs from '@/components/shared/contact'


const Home: React.FC = () => {
  return (
    <main className="w-full overflow-hidden" id="home">

      {/* hero content */}
      <section className='relative w-full max-h-[700px] overflow-hidden mt-6 mx-auto'>
        <div className="absolute inset-0">
          <img 
            src="/images/hero-bg.png" 
            alt="Cleaning Service" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-white/5"></div>
        </div>
        
        {/* Content Container */}
        <div className="relative h-full grid lg:grid-cols-2 text-black px-6 gap-6 max-w-7xl mx-auto">
          {/* Left Container */}
          <div className="flex flex-col justify-center z-10 py-6 lg:py-0">
            <div className="max-w-xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-heading leading-tight">
                Quality cleaning, tailored to your needs.
              </h1>
              <p className="text-lg md:text-xl mb-8 text-gray-700 leading-relaxed font-text">
                Expert cleaning services for homes and businesses. Fast, reliable, and tailored to your needs.
              </p>
            
              <div className='flex flex-col sm:flex-row gap-4'>
                <Link to='/booking'>
                  <Button 
                    label="Book Now" 
                    variant="primary" 
                  />
                </Link>

                <Link to='/login'>
                  <Button 
                    label="Login" 
                    variant="outline" 
                  />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Image  */}
          <div className="items-center justify-center z-10 hidden lg:flex">
            <img
              src="/images/hero-team-image.png"
              alt="Professional cleaning team in green uniforms"
              className="object-cover"
            />
          </div>
        </div>
      </section>

       {/* services */}
      <section id="services" className='w-full mx-auto'>
        <ServicesSection />
      </section>

      {/* About Section */}
      <section id="about" className="py-4 lg:py-16">
        <div className='max-w-7xl mx-auto px-4 sm:px-6'>
          <div className='grid lg:grid-cols-2 gap-4 items-center md:w-[70%] lg:w-full text-center lg:text-left mx-auto  mb-10 lg:mb-0'>
            {/* left content */}
            <div className='space-y-6 text-primary'>
              <div className=" w-[70%] md:w-full mx-auto">
                <p className="md:text-[14px] lg:text-sm uppercase text-gold font-body">
                  Affordable cleaning solutions
                </p>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6 font-heading">
                  High-Quality and Friendly Services at Fair Prices
                </h2>
                <p className="mb-4 text-gray-600 font-body">
                  We provide comprehensive cleaning services tailored to your needs. From residential cleaning services.
                </p>
                {/* <p className="mb-4 text-gray-600 font-body">
                  We believe in the value of a spotless environment and the peace of mind it brings. Our team is trained, trustworthy, and fully committed to delivering high-quality results, every time. From one-time deep cleans to scheduled maintenance, we’ve got the tools and expertise to handle it all.
                </p> */}
              </div>

              <div className='pt-4 '>
                <Link to='/booking'>
                  <Button 
                    label="Book Now" 
                    variant="primary" 
                    className='mx-auto'
                  />
                </Link>
              </div>
            </div>

            <div className='flex-1 flex justify-center mx-auto lg:justify-end w-[80%] md:w-full pt-6 lg:pt-0'>
              <ImageGallery images={["/images/Cleaning-2.png", "/images/Cleaning-1.png"]} />
            </div>
          </div>
        </div>
      </section>

      {/* about */}
      <section className='w-full mx-auto'>
        <About />
      </section>

      {/* <section className='w-full sm:max-w-[85%] mx-auto p-4 sm:p-0'>
        <CleaningServicesHero />
      </section> */}

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

      {/* <section id="pricing" className='w-full sm:max-w-[85%] mx-auto'>
        <Pricing />
      </section> */}

      {/* <section id="contact" className='w-full mx-auto'>
        <ContactUs />
      </section> */}

      
    </main>
  );
};

export default Home;