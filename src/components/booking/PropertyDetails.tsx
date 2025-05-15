import React from 'react';
import { PropertyInfo } from '@/types';

interface PropertyDetailsProps {
  value: PropertyInfo;
  onChange: (value: PropertyInfo) => void;
}

export const PropertyDetails: React.FC<PropertyDetailsProps> = ({ value, onChange }) => {

  const handleBedroomsChange = (increment: number) => {
    const newValue = Math.max(1, value.bedrooms + increment); // Ensure at least 1 bedroom
    onChange({ ...value, bedrooms: newValue });
  };

  const handleBathroomsChange = (increment: number) => {
    const newValue = Math.max(1, value.bathrooms + increment); // Ensure at least 1 bathroom
    onChange({ ...value, bathrooms: newValue });
  };

  // Common button styling
  const buttonClass = "px-3 py-1 border bg-gold hover:bg-white hover:border-color cursor-pointer transition-colors rounded disabled:opacity-50 disabled:cursor-not-allowed";
  const valueClass = "px-4 font-semibold text-md";

  return (
    <section className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Property Details</h3>
      <div className="space-y-4">
        {/* Bedrooms */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Bedrooms</label>
          <div className="flex items-center border border-gray-300 rounded">
            <button
              type="button"
              onClick={() => handleBedroomsChange(-1)}
              disabled={value.bedrooms <= 1}
              className={`${buttonClass} rounded-l`}
              aria-label="Decrease bedrooms"
            >
              -
            </button>
            <span className={valueClass} aria-live="polite">{value.bedrooms}</span>
            <button
              type="button"
              onClick={() => handleBedroomsChange(1)}
              className={`${buttonClass} rounded-r`}
              aria-label="Increase bedrooms"
            >
              +
            </button>
          </div>
        </div>

        {/* Bathrooms */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Bathrooms</label>
          <div className="flex items-center border border-gray-300 rounded">
            <button
              type="button"
              onClick={() => handleBathroomsChange(-1)}
              disabled={value.bathrooms <= 1}
              className={`${buttonClass} rounded-l`}
              aria-label="Decrease bathrooms"
            >
              -
            </button>
            <span className={valueClass} aria-live="polite">{value.bathrooms}</span>
            <button
              type="button"
              onClick={() => handleBathroomsChange(1)}
              className={`${buttonClass} rounded-r`}
              aria-label="Increase bathrooms"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};