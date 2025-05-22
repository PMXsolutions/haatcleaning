"use client"

import type React from "react"
import { useMemo } from "react"
import type { BookingData } from "@/types"
import { getAvailableExtras } from "@/services/bookingService"

interface AmountSummaryProps {
  bookingData: BookingData
}

export const AmountSummary: React.FC<AmountSummaryProps> = ({ bookingData }) => {
  const availableExtras = useMemo(() => getAvailableExtras(), [])

  // Calculate base price based on property size and service type
  const basePrice = useMemo(() => {
    const { bedrooms, bathrooms } = bookingData.propertyInfo

    // Different base pricing based on service type
    let baseRate = 100 // Default base rate
    let bedroomRate = 25
    let bathroomRate = 35

    switch (bookingData.serviceType) {
      case "commercial":
        baseRate = 150 // Higher base rate for commercial
        bedroomRate = 30 // "Offices" cost more
        bathroomRate = 45 // Commercial bathrooms cost more
        break
      case "airbnb":
        baseRate = 120 // Higher base rate for Airbnb
        bedroomRate = 30 // Airbnb bedrooms need more attention
        bathroomRate = 40 // Airbnb bathrooms need more attention
        break
      case "residential":
      default:
        // Use default rates
        break
    }

    return baseRate + bedrooms * bedroomRate + bathrooms * bathroomRate
  }, [bookingData.propertyInfo, bookingData.serviceType])

  // Calculate frequency discount
  const frequencyMultiplier = useMemo(() => {
    switch (bookingData.frequency) {
      case "weekly":
        return 0.85 // 15% discount
      case "bi-weekly":
        return 0.9 // 10% discount
      case "monthly":
        return 0.95 // 5% discount
      default:
        return 1 // No discount for one-time
    }
  }, [bookingData.frequency])

  // Calculate extras total
  const extrasTotal = useMemo(() => {
    return bookingData.selectedExtras.reduce((total, SelectedExtra) => {
      const extraService = availableExtras.find((extra) => extra.id === SelectedExtra.id)
      if (!extraService) return total

      return total + extraService.price * SelectedExtra.quantity
    }, 0)
  }, [bookingData.selectedExtras, availableExtras])

  // Calculate subtotal
  const subtotal = basePrice * frequencyMultiplier

  // Calculate tax (assuming 8%)
  // const tax = (subtotal + extrasTotal) * 0.08

  // Calculate total
  // const total = subtotal + extrasTotal + tax
  const total = subtotal + extrasTotal

  return (
    <div className="bg-white p-6 rounded-lg shadow-md sticky top-4">
      <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>

      <div className="text-sm text-gray-600 mb-4">
        <p className="capitalize">{bookingData.serviceType} Cleaning</p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <span>Base Price:</span>
          <span>${basePrice.toFixed(2)}</span>
        </div>

        {frequencyMultiplier !== 1 && (
          <div className="flex justify-between text-green-600">
            <span>Frequency Discount:</span>
            <span>-${(basePrice * (1 - frequencyMultiplier)).toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        {extrasTotal > 0 && (
          <div>
            <div className="flex justify-between font-medium">
              <span>Extra Services:</span>
              <span>${extrasTotal.toFixed(2)}</span>
            </div>

            {/* List selected extras */}
            <div className="ml-4 text-sm text-gray-600 mt-1">
              {bookingData.selectedExtras.map((selectedExtra) => {
                const extraService = availableExtras.find((extra) => extra.id === selectedExtra.id)
                if (!extraService) return null

                return (
                  <div key={selectedExtra.id} className="flex justify-between">
                    <span>
                      {extraService.name}
                      {selectedExtra.quantity > 1 ? ` (x${selectedExtra.quantity})` : ""}:
                    </span>
                    <span>${(extraService.price * selectedExtra.quantity).toFixed(2)}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
        {/* <div className="flex justify-between">
          <span>Tax (8%):</span>
          <span>${tax.toFixed(2)}</span>
        </div> */}

        <div className="border-t pt-4 flex justify-between font-bold">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-500">
        <p>* Prices may vary based on the condition of your property.</p>
        {/* <p>* Final price will be confirmed after inspection.</p> */}
      </div>
    </div>
  )
}
