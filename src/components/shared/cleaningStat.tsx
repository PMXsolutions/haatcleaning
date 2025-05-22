// import { useState, useEffect,  } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/shared/button'
// import { StatBox } from '@/components/shared/statBox'
// import { FaSprayCanSparkles, FaUsers, FaFaceSmile } from "react-icons/fa6";

export const CleaningServicesHero = () => {

  return (
    <div className="w-full py-18">
      <div className="mx-auto">
        <div className="max-w-3xl text-center mb-12 mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-primary mb-4">
            Our cleaning services have no comparison
          </h1>
          <p className="font-text text-primary max-w-xl mx-auto">
            Professional cleaning solutions tailored to your needs. We bring sparkle and shine to homes and businesses throughout the area.
          </p>
        </div>

        <div className="relative mb-12">
          <div className="rounded-lg overflow-hidden shadow-lg hidden sm:block">
            <img 
              src="/images/11246.jpg" 
              alt="Professional cleaning service" 
              className="w-full aspect-[16/9] object-cover rounded-xl"
            />
          </div>
          
          {/* <div className="relative sm:absolute sm:bottom-4 sm:translate-y-1/2 sm:w-full">
            <div className="flex flex-col sm:flex-row justify-center gap-4 px-14">
            {stats.map((stat, index) => (
                <StatBox 
                  key={index}
                  icon={stat.icon}
                  value={stat.value}
                  label={stat.label}
                  animationDuration={stat.animationDuration}
                  valueSuffix="+"
                />
              ))}
            </div>
          </div> */}
        </div>
        
        <div className="flex justify-center sm:mt-8">
          <Link to='/booking'>
            <Button 
              label="Book Now" 
              variant="primary" 
            />
          </Link>
        </div>
      </div>
    </div>
  );
};
