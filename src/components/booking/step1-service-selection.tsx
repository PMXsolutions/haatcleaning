"use client"

import React, { useEffect } from "react"
import type { BookingData, ServiceType, Frequency } from "@/types"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { usePostalCodeValidation, useServiceTypes, useServiceFrequencies } from "@/hooks/useApi"

interface Step1Props {
  bookingData: BookingData
  postalCode: string
  onPostalCodeChange: (code: string) => void
  onBookingDataChange: (updates: Partial<BookingData>) => void
  errors: Record<string, string>
}

export const Step1ServiceSelection: React.FC<Step1Props> = ({
  bookingData,
  postalCode,
  onPostalCodeChange,
  onBookingDataChange,
}) => {
  // API hooks
  const { validatePostalCode, isValidating, isValid, areaName, error: postalError } = usePostalCodeValidation()
  const { serviceTypes: apiServiceTypes, loading: serviceTypesLoading, error: serviceTypesError } = useServiceTypes()
  const { serviceFrequencies: apiServiceFrequencies, loading: frequenciesLoading, error: frequenciesError } = useServiceFrequencies()

  // Use API service types directly - no mapping needed
  const serviceTypes = apiServiceTypes || []
  
  // Map API service frequencies to the format expected by the UI
  const frequencies = apiServiceFrequencies.map(freq => ({
    id: freq.frequency.toLowerCase().replace(/\s+/g, '-') as Frequency,
    title: freq.frequency,
    discountPercentage: freq.discountPercentage,
    serviceFrequencyId: freq.serviceFrequencyId
  }))

  // Debounced postal code validation
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (postalCode.trim()) {
        validatePostalCode(postalCode)
      }
    }, 500) // 500ms debounce

    return () => clearTimeout(timeoutId)
  }, [postalCode, validatePostalCode])

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split("T")[0]

  // Format the selected date for display
  const formatSelectedDate = () => {
    if (!bookingData.selectedDate) return null
    const date = new Date(bookingData.selectedDate)
    return {
      date: date.toISOString().split("T")[0],
      time: date.toTimeString().slice(0, 5),
    }
  }

  const handleDateChange = (dateStr: string) => {
    if (!dateStr) {
      onBookingDataChange({ selectedDate: undefined })
      return
    }

    // If we have an existing time, preserve it
    const existingTime = bookingData.selectedDate
      ? new Date(bookingData.selectedDate).toTimeString().slice(0, 5)
      : "10:00"

    const [hours, minutes] = existingTime.split(":")
    const newDate = new Date(dateStr)
    newDate.setHours(Number.parseInt(hours), Number.parseInt(minutes))

    onBookingDataChange({ selectedDate: newDate })
  }

  const handleTimeChange = (timeStr: string) => {
    if (!timeStr) return

    // If we don't have a date, use today
    const dateStr = bookingData.selectedDate 
      ? new Date(bookingData.selectedDate).toISOString().split("T")[0] 
      : today

    const [hours, minutes] = timeStr.split(":")
    const newDate = new Date(dateStr)
    newDate.setHours(Number.parseInt(hours), Number.parseInt(minutes))

    onBookingDataChange({ selectedDate: newDate })
  }

  const selectedDateTime = formatSelectedDate()

  // Postal code validation status
  const getPostalCodeStatus = () => {
    if (!postalCode.trim()) return null
    if (isValidating) return "validating"
    if (isValid) return "valid"
    if (!isValid || postalError) return "invalid"
    return null
  }

  const postalCodeStatus = getPostalCodeStatus()
  
  // Determine if other options should be disabled
  const shouldDisableOptions = !postalCode.trim() || postalCodeStatus === "invalid" || postalCodeStatus === "validating"

  return (
    <div className="space-y-8">
      {/* Postal Code with Validation */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Postal code
        </label>
        <div className="relative">
          <input
            type="text"
            value={postalCode}
            onChange={(e) => onPostalCodeChange(e.target.value)}
            className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#8A7C3D] ${
              postalCodeStatus === "valid"
                ? "border-green-300 bg-green-50"
                : postalCodeStatus === "invalid"
                ? "border-red-300 bg-red-50"
                : "border-gray-300"
            }`}
            placeholder="Enter postal code"
          />
          
          {/* Validation Icon */}
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {postalCodeStatus === "validating" && (
              <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
            )}
            {postalCodeStatus === "valid" && (
              <CheckCircle className="h-4 w-4 text-green-500" />
            )}
            {postalCodeStatus === "invalid" && (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
          </div>
        </div>
        
        {/* Validation Message */}
        {postalCodeStatus === "invalid" && (
          <p className="mt-1 text-sm text-red-600">
            {postalError || "Postal code is not in our service area"}
          </p>
        )}
        {postalCodeStatus === "valid" && (
          <p className="mt-1 text-sm text-green-600">
            Great! We service {areaName || "this area"}.
          </p>
        )}
      </div>

      {/* Service Type */}
      <div className={shouldDisableOptions ? "opacity-50 pointer-events-none" : ""}>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Service type</h3>
        <p className="text-sm text-gray-600 mb-4">
          {shouldDisableOptions 
            ? "Please enter a valid postal code to select service type" 
            : "Select the type of property you need cleaned"
          }
        </p>
        
        {serviceTypesError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">Failed to load service types. Please refresh the page.</p>
          </div>
        )}

        {serviceTypesLoading && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-600">Loading service types...</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {serviceTypes.map((service) => {
            return (
              <button
                key={service.serviceTypeId}
                onClick={() => onBookingDataChange({ serviceType: service.serviceTypeId as ServiceType })}
                disabled={serviceTypesLoading || shouldDisableOptions}
                className={`p-6 border-2 rounded-lg text-center transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  bookingData.serviceType === service.serviceTypeId
                    ? "border-[#8A7C3D] bg-[#F5F3F0]"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <h4 className="font-medium text-gray-900 mb-2">{service.name}</h4>
                <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                <p className="font-semibold text-gray-900">${service.price}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Frequency */}
      <div className={shouldDisableOptions ? "opacity-50 pointer-events-none" : ""}>
        <h3 className="text-lg font-medium text-gray-900 mb-2">How often</h3>
        <p className="text-sm text-gray-600 mb-4">
          {shouldDisableOptions 
            ? "Please enter a valid postal code to select frequency" 
            : "Select cleaning frequency"
          }
        </p>
        
        {frequenciesError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">Failed to load service frequencies. Please refresh the page.</p>
          </div>
        )}

        {frequenciesLoading && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-600">Loading service frequencies...</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {frequencies.map((freq) => (
            <button
              key={freq.id}
              onClick={() => onBookingDataChange({ frequency: freq.id })}
              disabled={frequenciesLoading || shouldDisableOptions}
              className={`p-4 border-2 cursor-pointer rounded-lg text-center transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                bookingData.frequency === freq.id
                  ? "border-[#8A7C3D] bg-[#F5F3F0]"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="space-y-2">
                <span className="font-medium text-gray-900 block">{freq.title}</span>
                {freq.discountPercentage > 0 && (
                  <span className="text-sm text-green-600">
                    {freq.discountPercentage}% discount
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Date and Time */}
      <div className={shouldDisableOptions ? "opacity-50 pointer-events-none" : ""}>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Set Preferred Date and Time for your appointment
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          {shouldDisableOptions 
            ? "Please enter a valid postal code to set appointment" 
            : "Choose your preferred date and time"
          }
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Date Input */}
          <div>
            <label htmlFor="appointment-date" className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              id="appointment-date"
              min={today}
              value={selectedDateTime?.date || ""}
              onChange={(e) => handleDateChange(e.target.value)}
              disabled={shouldDisableOptions}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8A7C3D] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Time Input */}
          <div>
            <label htmlFor="appointment-time" className="block text-sm font-medium text-gray-700 mb-2">
              Time
            </label>
            <input
              type="time"
              id="appointment-time"
              value={selectedDateTime?.time || "10:00"}
              onChange={(e) => handleTimeChange(e.target.value)}
              disabled={shouldDisableOptions}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8A7C3D] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* Selected Date/Time Display */}
        {bookingData.selectedDate && !shouldDisableOptions && (
          <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Selected appointment:</span>{" "}
              {bookingData.selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              at{" "}
              {bookingData.selectedDate.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}