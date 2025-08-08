import type React from "react"
import type { BookingData, Size } from "@/types"
import type { ServiceOption } from "@/api/types"
import { AlertCircle } from "lucide-react"
import { useServiceTypes, useServiceFrequencies } from "@/hooks/useApi"
import {
  calculateSubtotal,
  calculateTax,
  // calculateGrandTotal,
  formatCurrency,
  formatFrequency,
} from "@/lib/utils"

interface BookingSummaryProps {
  bookingData: BookingData
  postalCode: string
  serviceOptions: ServiceOption[]
}

export const BookingSummary: React.FC<BookingSummaryProps> = ({ bookingData, postalCode, serviceOptions }) => {
  const { serviceTypes } = useServiceTypes()
  const { serviceFrequencies } = useServiceFrequencies()

  // Find the selected service type
  const selectedServiceType = serviceTypes.find(type => type.serviceTypeId === bookingData.serviceType)
  const basePrice = selectedServiceType?.price || 0

  // Find the selected frequency
  const selectedFrequency = serviceFrequencies.find(freq =>
    freq.serviceFrequencyId === bookingData.frequency // Match by serviceFrequencyId
  )

  // Calculate the frequency discount
  const frequencyDiscount = selectedFrequency && basePrice
    ? (basePrice * selectedFrequency.discountPercentage) / 100
    : 0

  // Ensure valid serviceType and frequency before calculating totals
  // const isValidBookingData = selectedServiceType && selectedFrequency
  const isValidBookingData = !!selectedServiceType 

  // const subtotal = isValidBookingData 
  //   ? calculateSubtotal(bookingData, serviceTypes, serviceFrequencies, serviceOptions) 
  //   : 0

  // const tax = calculateTax(subtotal)
  // const grandTotal = calculateGrandTotal(bookingData, 0.1, serviceTypes, serviceFrequencies, serviceOptions)

  // Calculate the subtotal from the utility function
  const initialSubtotal = isValidBookingData 
    ? calculateSubtotal(bookingData, serviceTypes, serviceFrequencies, serviceOptions) 
    : 0

   // CORRECTED: Apply the frequency discount to the subtotal
  const subtotal = initialSubtotal - frequencyDiscount
  
   // Calculate tax and grand total based on the new discounted subtotal
  const tax = calculateTax(subtotal)
  const grandTotal = subtotal + tax

  // Get extra price and name for display
  const getExtraPrice = (extra: { id: string; quantity: number }) => {
    if (extra.id === "other") return 0
    const matched = serviceOptions.find(opt => opt.serviceOptionId === extra.id)
    return matched ? matched.pricePerUnit * extra.quantity : 0
  }

  const getExtraDisplayName = (extra: { id: string; quantity: number; size?: Size; customText?: string }) => {
    const fallback = extra.id.charAt(0).toUpperCase() + extra.id.slice(1)
    if (extra.id === "other" && extra.customText) {
      return `Other: ${extra.customText.substring(0, 30)}${extra.customText.length > 30 ? '...' : ''}`
    }
    const option = serviceOptions.find(opt => opt.serviceOptionId === extra.id)
    return option?.optionName || fallback
  }

  // Check if we're using fallback data (only for specific case)
  const isUsingFallbackData = serviceTypes.length === 3 && serviceTypes[0].serviceTypeId === 'residential'

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-4">
      <h2 className="text-xl font-medium text-gray-900 mb-6">Booking summary</h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-900">Zip code</h3>
          <p className="text-sm text-gray-600">{postalCode || "Enter postal code"}</p>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Service type</h3>
            <p className="text-sm text-gray-600">
              {selectedServiceType?.name || "Select service type"}
            </p>
          </div>
          <span className="font-medium">{formatCurrency(basePrice)}</span>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900">Frequency</h3>
          <p className="text-sm text-gray-600">
            {selectedFrequency ? selectedFrequency.frequency : formatFrequency(bookingData.frequency)}
            {selectedFrequency && selectedFrequency.discountPercentage > 0 && (
              <span className="text-green-600 ml-2">
                ({selectedFrequency.discountPercentage}% discount)
              </span>
            )}
          </p>
        </div>

        {frequencyDiscount > 0 && (
          <div className="flex justify-between items-center text-green-600">
            <span className="text-sm">Frequency Discount</span>
            <span className="font-medium">-${frequencyDiscount.toFixed(2)}</span>
          </div>
        )}

        {bookingData.selectedExtras.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Add-ons</h3>
            <div className="space-y-1">
              {bookingData.selectedExtras.map((extra, index) => {
                const price = getExtraPrice(extra)
                const displayName = getExtraDisplayName(extra)
                return (
                  <div key={`${extra.id}-${index}`} className="flex justify-between text-sm">
                    <div className="text-gray-600">
                      <div>{displayName}</div>
                      {extra.quantity > 1 && (
                        <span className="text-xs text-gray-500">Quantity: {extra.quantity}</span>
                      )}
                    </div>
                    <span className="font-medium">
                      {price > 0 ? `$${price.toFixed(2)}` : 'Free'}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="border-t pt-4 space-y-2">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Total</h3>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-600">Sub total</span>
              <span>{subtotal > 0 ? `$${subtotal.toFixed(2)}` : "$0.00"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax (10%)</span>
              <span>{tax > 0 ? `$${tax.toFixed(2)}` : "$0.00"}</span>
            </div>
            <div className="flex justify-between font-medium text-lg mt-2">
              <span>Grand Total</span>
              <span>{grandTotal > 0 ? `$${grandTotal.toFixed(2)}` : "$0.00"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fallback Notice */}
      {isUsingFallbackData && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <p className="text-xs text-amber-700">
              Displaying standard rates. Final pricing may vary.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
