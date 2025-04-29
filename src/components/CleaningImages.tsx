import React from 'react';

const CleaningImages: React.FC = () => {
  return (
    <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px]">
    {/* Large back image */}
    <img
      src="images/cleaning1.jpg"
      alt="Cleaning"
      className="absolute top-0 left-0 w-3/4 md:w-[400px] lg:w-[500px] h-auto object-cover shadow-xl"
    />

    {/* Smaller overlapping front image */}
    <img
      src="images/cleaning2.jpg"
      alt="Supplies"
      className="absolute bottom-0 left-32 md:left-64 w-1/2 md:w-[300px] lg:w-[360px] h-auto object-cover shadow-2xl border-4 border-white"
    />
  </div>
  );
};

export default CleaningImages;
