"use client"

import type React from "react"
// import { useEffect } from "react"
import type { BookingData } from "@/types"

interface Step3Props {
  bookingData: BookingData
  onBookingDataChange: (updates: Partial<BookingData>) => void
  errors: {
    firstName?: string
    lastName?: string
    street?: string
    city?: string
    zipCode?: string
    phone?: string
    email?: string
    [key: string]: string | undefined
  }
  total: number
  onClearError?: (field: string) => void
}

export const Step3Billing: React.FC<Step3Props> = ({ 
  bookingData, 
  onBookingDataChange, 
  errors,
  onClearError 
}) => {
  const handleContactChange = (field: string, value: string) => {
    // Clear error when user starts typing
    if (onClearError && errors[field]) {
      onClearError(field)
    }
    
    onBookingDataChange({
      contactDetails: {
        ...bookingData.contactDetails,
        [field]: value,
      },
    })
  }

  const handleAddressChange = (field: string, value: string) => {
    // Clear error when user starts typing
    if (onClearError && errors[field]) {
      onClearError(field)
    }
    
    onBookingDataChange({
      addressDetails: {
        ...bookingData.addressDetails,
        [field]: value,
      },
    })
  }

  return (
    <div className="grid gap-8">
      {/* Contact Information */}
      <div>
        <h2 className="text-xl font-medium text-gray-900 mb-6">Contact Information</h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={bookingData.contactDetails.firstName}
                onChange={(e) => handleContactChange("firstName", e.target.value)}
                placeholder="Enter first name"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#8A7C3D] transition-colors ${
                  errors.firstName ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
              />
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={bookingData.contactDetails.lastName}
                onChange={(e) => handleContactChange("lastName", e.target.value)}
                placeholder="Enter last name"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#8A7C3D] transition-colors ${
                  errors.lastName ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
              />
              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={bookingData.addressDetails.street}
              onChange={(e) => handleAddressChange("street", e.target.value)}
              placeholder="Enter street address"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#8A7C3D] transition-colors ${
                errors.street ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
            />
            {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City/Town <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={bookingData.addressDetails.city}
                onChange={(e) => handleAddressChange("city", e.target.value)}
                placeholder="Enter city"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#8A7C3D] transition-colors ${
                  errors.city ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
              />
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Zip Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={bookingData.addressDetails.zipCode}
                onChange={(e) => handleAddressChange("zipCode", e.target.value)}
                placeholder="Enter zip code"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#8A7C3D] transition-colors ${
                  errors.zipCode ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
              />
              {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={bookingData.contactDetails.phone}
                onChange={(e) => handleContactChange("phone", e.target.value)}
                placeholder="Enter phone number"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#8A7C3D] transition-colors ${
                  errors.phone ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={bookingData.contactDetails.email}
                onChange={(e) => handleContactChange("email", e.target.value)}
                placeholder="Enter email address"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#8A7C3D] transition-colors ${
                  errors.email ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}