"use client"

import React from "react";
import { BookingData } from "@/types";
import { useServiceTypes, useServiceFrequencies, useServiceOptions } from "@/hooks/useApi";
import { CheckCircle, Calendar, MapPin, User, Mail, Phone, Home } from "lucide-react";

interface Props {
  bookingData: BookingData;
  onStartNewBooking: () => void;
}

export const Step4Confirmation: React.FC<Props> = ({ bookingData, onStartNewBooking }) => {
  const { serviceTypes } = useServiceTypes();
  const { serviceFrequencies } = useServiceFrequencies();
  const { allServiceOptions } = useServiceOptions();

  // Helper functions to get display names
  const getServiceTypeName = () => {
    const serviceType = serviceTypes.find(s => s.serviceTypeId === bookingData.serviceType);
    return serviceType ? serviceType.name : "Unknown Service";
  };

  const getFrequencyName = () => {
    const frequency = serviceFrequencies.find(f => f.serviceFrequencyId === bookingData.frequency);
    return frequency ? frequency.frequency : "Unknown Frequency";
  };

  const getOptionName = (id: string) => {
    const option = allServiceOptions.find(o => o.serviceOptionId === id);
    return option ? option.optionName : "Unknown Option";
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return "Not selected";
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-green-700 mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600">
          Thank you for your booking. We'll send you a confirmation email shortly.
        </p>
      </div>

      {/* Booking Details Card */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="bg-[#8A7C3D] text-white px-6 py-4">
          <h3 className="text-lg font-semibold">Booking Summary</h3>
        </div>

        <div className="p-6 space-y-6">
          {/* Service Details */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 border-b border-gray-200 pb-2">Service Details</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <Home className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Service Type</p>
                  <p className="text-sm text-gray-600">{getServiceTypeName()}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Frequency</p>
                  <p className="text-sm text-gray-600">{getFrequencyName()}</p>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Scheduled Date & Time</p>
                <p className="text-sm text-gray-600">{formatDate(bookingData.selectedDate)}</p>
              </div>
            </div>

            {/* Property Information */}
            {/* <div className="flex items-start space-x-3">
              <Home className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Property</p>
                <p className="text-sm text-gray-600">
                  {bookingData.propertyInfo.bedrooms} bedroom{bookingData.propertyInfo.bedrooms !== 1 ? 's' : ''}, {' '}
                  {bookingData.propertyInfo.bathrooms} bathroom{bookingData.propertyInfo.bathrooms !== 1 ? 's' : ''}
                </p>
              </div>
            </div> */}
          </div>

          {/* Customer Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 border-b border-gray-200 pb-2">Customer Information</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Name</p>
                  <p className="text-sm text-gray-600">
                    {bookingData.contactDetails.firstName} {bookingData.contactDetails.lastName}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Phone</p>
                  <p className="text-sm text-gray-600">{bookingData.contactDetails.phone}</p>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Email</p>
                <p className="text-sm text-gray-600">{bookingData.contactDetails.email}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Service Address</p>
                <p className="text-sm text-gray-600">
                  {bookingData.addressDetails.street}<br />
                  {bookingData.addressDetails.city}, {bookingData.addressDetails.zipCode}
                </p>
              </div>
            </div>
          </div>

          {/* Selected Extras */}
          {bookingData.selectedExtras && bookingData.selectedExtras.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 border-b border-gray-200 pb-2">Additional Services</h4>
              <div className="space-y-2">
                {bookingData.selectedExtras.map((extra, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                    <span className="text-sm text-gray-900">
                      {extra.id === "other" ? "Other Service" : getOptionName(extra.id)}
                    </span>
                    <span className="text-sm text-gray-600">
                      Quantity: {extra.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Special Instructions */}
          {/* {bookingData.specialInstructions && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 border-b border-gray-200 pb-2">Special Instructions</h4>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                {bookingData.specialInstructions}
              </p>
            </div>
          )} */}

          {/* Total Price */}
          {bookingData.totalPrice && (
            <div className="space-y-4">
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total Price</span>
                  <span className="text-2xl font-bold text-[#8A7C3D]">
                    ${bookingData.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h4 className="font-semibold text-blue-900 mb-2">What's Next?</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• You'll receive a confirmation email within the next few minutes</li>
          <li>• We'll contact you 24 hours before your appointment to confirm</li>
          <li>• If you need to reschedule, please call us at least 24 hours in advance</li>
        </ul>
      </div>

      {/* Actions */}
      <div className="text-center space-y-4">
        <button
          onClick={onStartNewBooking}
          className="bg-[#8A7C3D] text-white px-8 py-3 rounded-md font-medium hover:bg-[#6B5A2E] transition-colors"
        >
          Book Another Service
        </button>
        
        <div className="text-sm text-gray-600">
          Need help? Contact us at{" "}
          <a href="tel:+1234567890" className="text-[#8A7C3D] hover:underline">
            (123) 456-7890
          </a>{" "}
          or{" "}
          <a href="mailto:support@cleaningservice.com" className="text-[#8A7C3D] hover:underline">
            support@cleaningservice.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default Step4Confirmation;