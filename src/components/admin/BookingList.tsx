import React, { useState } from 'react';
import { BookingRecord } from '@/types';
import { getAvailableExtras } from '@/services/bookingService';

interface BookingListProps {
  bookings: BookingRecord[];
  onConfirmPayment: (bookingId: string) => Promise<void>;
}

export const BookingList: React.FC<BookingListProps> = ({ bookings, onConfirmPayment }) => {
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);
  const availableExtras = getAvailableExtras();

  const toggleDetails = (bookingId: string) => {
    setExpandedBooking(expandedBooking === bookingId ? null : bookingId);
  };

  if (bookings.length === 0) {
    return <p className="text-primary">No bookings found.</p>;
  }

  // Helper function to format date
  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Not set';
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 text-left">Booking ID</th>
            <th className="py-3 px-4 text-left">Client</th>
            <th className="py-3 px-4 text-left">Date</th>
            <th className="py-3 px-4 text-left">Payment</th>
            <th className="py-3 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {bookings.map((booking) => (
            <React.Fragment key={booking.id}>
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-4">{booking.id}</td>
                <td className="py-3 px-4">
                  {booking.contactDetails.firstName} {booking.contactDetails.lastName}
                </td>
                <td className="py-3 px-4">
                  {formatDate(booking.selectedDate)}
                </td>
                <td className="py-3 px-4">
                  <span 
                    className={`px-2 py-1 rounded text-xs font-semibold 
                      ${booking.paymentStatus === 'confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : booking.paymentStatus === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-red-100 text-red-800'}`}
                  >
                    {booking.paymentStatus || 'Unknown'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleDetails(booking.id)}
                      className="text-gold"
                    >
                      {expandedBooking === booking.id ? 'Hide Details' : 'View Details'}
                    </button>
                    {booking.paymentStatus !== 'confirmed' && (
                      <button
                        onClick={() => onConfirmPayment(booking.id)}
                        className="text-green-600 hover:text-green-800 ml-2"
                      >
                        Confirm Payment
                      </button>
                    )}
                  </div>
                </td>
              </tr>
              {expandedBooking === booking.id && (
                <tr>
                  <td colSpan={5} className="py-4 px-6 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-700 mb-2">Property Details</h3>
                        <p>Bedrooms: {booking.propertyInfo.bedrooms}</p>
                        <p>Bathrooms: {booking.propertyInfo.bathrooms}</p>
                        <p>Frequency: {booking.frequency}</p>
                        <p>Booking Date: {new Date(booking.bookingTimestamp).toLocaleString()}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-700 mb-2">Contact Information</h3>
                        <p>Name: {booking.contactDetails.firstName} {booking.contactDetails.lastName}</p>
                        <p>Email: {booking.contactDetails.email}</p>
                        <p>Phone: {booking.contactDetails.phone}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-700 mb-2">Address</h3>
                        <p>Street: {booking.addressDetails.street}</p>
                        <p>City: {booking.addressDetails.city}</p>
                        <p>ZIP: {booking.addressDetails.zipCode}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-700 mb-2">Additional Services</h3>
                        {booking.selectedExtras && booking.selectedExtras.length > 0 ? (
                          <ul className="list-disc pl-5">
                            {booking.selectedExtras.map((extra, index) => {
                              const extraInfo = availableExtras.find(e => e.id === extra.id);
                              return (
                                <li key={index}>
                                  {extraInfo?.name || extra.id} {extra.quantity > 1 ? `(${extra.quantity})` : ''} - 
                                  ${extraInfo ? extraInfo.price * extra.quantity : '?'}
                                </li>
                              );
                            })}
                          </ul>
                        ) : (
                          <p>No additional services selected</p>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};