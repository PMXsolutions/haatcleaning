import React from 'react';
import { BookingData } from '@/types';
import { calculateTotal } from '@/services/bookingService';

interface AmountSummaryProps {
  bookingData: Partial<BookingData>; // Use partial as not all data might be filled yet
  // Add breakdown details if needed
}

export const AmountSummary: React.FC<AmountSummaryProps> = ({ bookingData }) => {
  const totalAmount = calculateTotal(bookingData);

  const formatCurrency = (amount: number) => {
    // Basic currency formatting, consider using Intl.NumberFormat for better localization
    return `$${amount.toFixed(2)}`;
  };

  return (
    <div className="sticky top-5 p-5 border border-gray-300 rounded-lg shadow-md bg-white">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Booking Summary</h3>

      {/* Optional: Add a breakdown here */}
      {/* <div className="text-sm text-gray-600 mb-3 space-y-1">
        <p>Base Service: $XXX</p>
        <p>Extra Services: $YYY</p>
        <p>Frequency Discount: -$ZZZ</p>
      </div> */}

      <div className="border-t border-gray-200 pt-3 mt-3">
        <p className="flex justify-between items-center text-lg font-semibold">
          <span>Estimated Total:</span>
          <span className="text-gold">{formatCurrency(totalAmount)}</span>
        </p>
      </div>

      <p className="text-xs text-gray-500 mt-4">
        Final price may vary based on the condition of the property. Payment is processed after service completion.
      </p>
    </div>
  );
};