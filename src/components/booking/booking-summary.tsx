import type React from "react"
import type { BookingData, Size } from "@/types"
import type { ServiceOption } from "@/api/types"
import { useServiceTypes, useServiceFrequencies } from "@/hooks/useApi"
import {
  calculateSubtotal,
  calculateTax,
  calculateGrandTotal,
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

  const selectedServiceType = serviceTypes.find(type => type.serviceTypeId === bookingData.serviceType)
  const basePrice = selectedServiceType?.price || 0

  const selectedFrequency = serviceFrequencies.find(freq =>
    freq.frequency.toLowerCase().replace(/\s+/g, '-') === bookingData.frequency
  )

  const frequencyDiscount = selectedFrequency && basePrice
    ? (basePrice * selectedFrequency.discountPercentage) / 100
    : 0

  const subtotal = calculateSubtotal(bookingData, serviceTypes, serviceFrequencies, serviceOptions)
  const tax = calculateTax(subtotal)
  const grandTotal = calculateGrandTotal(bookingData, 0.1, serviceTypes, serviceFrequencies, serviceOptions)

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
            {selectedFrequency?.frequency || formatFrequency(bookingData.frequency)}
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
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium text-lg mt-2">
              <span>Grand Total</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
