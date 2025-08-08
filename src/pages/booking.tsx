"use client"

import { useState, useCallback } from "react"
import type { BookingData, ContactDetails, AddressDetails } from "@/types"
import { StepIndicator } from "@/components/booking/step-indicator"
import { Step1ServiceSelection } from "@/components/booking/step1-service-selection"
import { Step2AddOns } from "@/components/booking/step2-add-ons"
import { Step3Billing } from "@/components/booking/step3-billing"
import { BookingSummary } from "@/components/booking/booking-summary"
import { calculateGrandTotal } from "@/lib/utils"
import { apiService } from "@/api/services"
import { useServiceTypes, useServiceFrequencies, useServiceOptions } from "@/hooks/useApi"
import { Calendar, Lock } from "lucide-react"

type BookingFormErrors = Partial<Record<keyof ContactDetails | keyof AddressDetails | "selectedDate" | "form", string>>

const initialBookingData: BookingData = {
  serviceType: "", // Start with empty string instead of hardcoded value
  propertyInfo: { bedrooms: 1, bathrooms: 1 },
  frequency: "", // Start with empty string
  selectedDate: undefined,
  selectedExtras: [],
  contactDetails: { firstName: "", lastName: "", email: "", phone: "" },
  addressDetails: { street: "", city: "", zipCode: "" },
  specialInstructions: "",
}

export const BookingPage = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [bookingData, setBookingData] = useState<BookingData>(initialBookingData)
  const [errors, setErrors] = useState<BookingFormErrors>({})
  const [postalCode, setPostalCode] = useState("")

  const { serviceTypes } = useServiceTypes()
  const { serviceFrequencies } = useServiceFrequencies()
  const { allServiceOptions } = useServiceOptions() // Get all service options for calculations

  const validateAndProceedStep1 = async (): Promise<boolean> => {
    if (!postalCode.trim()) {
      setErrors({ form: "Please enter a postal code" })
      return false
    }

    try {
      setErrors({})
      const result = await apiService.validatePostalCode(postalCode)
      if (!result.isValid) {
        setErrors({ form: "Please enter a valid postal code in our service area" })
        return false
      }

      if (!bookingData.serviceType) {
        setErrors({ form: "Please select a service type" })
        return false
      }

      if (!bookingData.frequency) {
        setErrors({ form: "Please select a frequency" })
        return false
      }

      if (!bookingData.selectedDate) {
        setErrors({ form: "Please select a date and time" })
        return false
      }

      return true
    } catch (error) {
      console.error("Postal code validation failed:", error)
      setErrors({ form: "Failed to validate postal code. Please try again." })
      return false
    }
  }

  const validateStep3 = (): BookingFormErrors => {
    const newErrors: BookingFormErrors = {}
    const { contactDetails, addressDetails } = bookingData

    if (!contactDetails.firstName.trim()) newErrors.firstName = "First name is required"
    if (!contactDetails.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!contactDetails.email.trim()) {
      newErrors.email = "Email address is required"
    } else if (!/\S+@\S+\.\S+/.test(contactDetails.email)) {
      newErrors.email = "Please enter a valid email address"
    }
    if (!contactDetails.phone.trim()) newErrors.phone = "Mobile number is required"
    if (!addressDetails.street.trim()) newErrors.street = "Street address is required"
    if (!addressDetails.city.trim()) newErrors.city = "City is required"
    if (!addressDetails.zipCode.trim()) newErrors.zipCode = "Zip code is required"

    return newErrors
  }

  const handleNext = async () => {
    if (currentStep === 1) {
      const isValid = await validateAndProceedStep1()
      if (isValid) setCurrentStep(2)
    } else if (currentStep === 2) {
      setCurrentStep(3)
    } else if (currentStep === 3) {
      const errors = validateStep3()
      if (Object.keys(errors).length > 0) {
        setErrors(errors)
        return
      }
      // handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setErrors({})
    }
  }

  const updateBookingData = useCallback((updates: Partial<BookingData>) => {
    setBookingData((prev) => ({ ...prev, ...updates }))
  }, [])

  const getButtonText = () => {
    const total = calculateGrandTotal(bookingData, 0.1, serviceTypes, serviceFrequencies, allServiceOptions)
    return currentStep < 3 ? "Next" : `Pay $${total.toFixed(2)}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StepIndicator currentStep={currentStep} />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <Step1ServiceSelection
                bookingData={bookingData}
                postalCode={postalCode}
                onPostalCodeChange={setPostalCode}
                onBookingDataChange={updateBookingData}
                errors={errors}
              />
            )}

            {currentStep === 2 && (
              <Step2AddOns
                selectedExtras={bookingData.selectedExtras}
                onExtrasChange={(selectedExtras) => updateBookingData({ selectedExtras })}
                selectedServiceTypeId={bookingData.serviceType}
              />
            )}

            {currentStep === 3 && (
              <Step3Billing
                bookingData={bookingData}
                onBookingDataChange={updateBookingData}
                errors={errors}
                total={calculateGrandTotal(bookingData, 0.1, serviceTypes, serviceFrequencies, allServiceOptions)}
              />
            )}

            {errors.form && (
              <div className="mt-4 bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-md">
                {errors.form}
              </div>
            )}

            <div className="mt-8 flex gap-4">
              {currentStep > 1 && (
                <button
                  onClick={handlePrevious}
                  className="flex-1 bg-[#8A7C3D] text-white py-3 px-6 rounded-md font-medium hover:scale-105 transition-transform"
                >
                  Previous
                </button>
              )}
              {currentStep < 3 && (
                <button
                  onClick={handleNext}
                  className="flex-1 bg-[#8A7C3D] text-white py-3 px-6 rounded-md font-medium hover:scale-105 transition-transform"
                >
                  {getButtonText()}
                </button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {currentStep !== 3 ? (
              <BookingSummary
                bookingData={bookingData}
                postalCode={postalCode}
                serviceOptions={allServiceOptions}
              />
            ) : (
              <div className="space-y-6 bg-white p-4 rounded-lg border border-gray-200">
                <h2 className="text-xl font-medium text-gray-900 mb-4">Payment Information</h2>

                {/* Discount code */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Apply Discount</h3>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Enter Coupon Code"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8A7C3D]"
                    />
                    <button className="px-4 py-2 bg-[#8A7C3D] text-white rounded-md hover:bg-[#6B5A2E] transition-colors">
                      Apply
                    </button>
                  </div>
                </div>

                {/* Payment method */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Pay With</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="radio" name="payment" defaultChecked className="mr-2 text-[#8A7C3D] focus:ring-[#8A7C3D]" />
                      <span className="text-sm">Debit or Credit Card</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="payment" className="mr-2 text-[#8A7C3D] focus:ring-[#8A7C3D]" />
                      <span className="text-sm">Pay Cash on Service</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="payment" className="mr-2 text-[#8A7C3D] focus:ring-[#8A7C3D]" />
                      <span className="text-sm">Bank Transfer</span>
                    </label>
                  </div>
                </div>

                {/* Card info */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Card Details</h3>
                  <div className="space-y-4">
                    <input type="text" placeholder="Cardholder Name" className="w-full px-3 py-2 border rounded-md" />
                    <input type="text" placeholder="1234 5678 9012 3456" className="w-full px-3 py-2 border rounded-md" />

                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <input type="text" placeholder="MM/YYYY" className="w-full px-3 py-2 border rounded-md" />
                        <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                      </div>
                      <div className="relative">
                        <input type="text" placeholder="123" className="w-full px-3 py-2 border rounded-md" />
                        <Lock className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Total Summary */}
                <div className="pt-2 border-t space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Sub Total</span>
                    <span>
                      ${((calculateGrandTotal(bookingData, 0.1, serviceTypes, serviceFrequencies, allServiceOptions) * 10) / 11).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (10%)</span>
                    <span>
                      ${((calculateGrandTotal(bookingData, 0.1, serviceTypes, serviceFrequencies, allServiceOptions) * 0.1) / 1.1).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between font-medium text-lg border-t pt-2 mt-2">
                    <span>Total</span>
                    <span className="text-[#8A7C3D]">
                      ${calculateGrandTotal(bookingData, 0.1, serviceTypes, serviceFrequencies, allServiceOptions).toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleNext}
                  className="w-full bg-[#8A7C3D] text-white py-3 px-6 rounded-md font-medium hover:scale-105 transition-transform"
                >
                  {getButtonText()}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}