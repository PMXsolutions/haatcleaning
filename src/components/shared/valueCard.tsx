import React from 'react';

type ValueCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

export const ValueCard = ({ icon, title, description }: ValueCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center font-text">
      <div className="text-gold mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-primary mb-2">{title}</h3>
      <p className="text-sm text-primary">{description}</p>
    </div>
  );
};