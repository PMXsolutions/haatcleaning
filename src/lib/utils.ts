import type { BookingData, SelectedExtra } from "@/types"
import type { ServiceType, ServiceFrequency, ServiceOption } from "@/api/types"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Utility for Tailwind class merging
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Extras total from live options
export const getExtrasTotalFromOptions = (
  selectedExtras: SelectedExtra[] = [],
  serviceOptions: ServiceOption[] = []
): number => {
  return selectedExtras.reduce((total, extra) => {
    if (extra.id === "other") return total
    const option = serviceOptions.find(opt => opt.serviceOptionId === extra.id)
    return total + (option ? option.pricePerUnit * extra.quantity : 0)
  }, 0)
}

// Base price (hardcoded fallback)
export const getBasePrice = (serviceType?: string): number => {
  switch (serviceType) {
    case "commercial": return 150
    case "airbnb": return 120
    case "residential":
    default: return 100
  }
}

// Base price from API
export const getBasePriceFromAPI = (
  serviceType?: string,
  serviceTypes: ServiceType[] = []
): number => {
  if (!serviceType || serviceTypes.length === 0) return getBasePrice(serviceType)
  const matched = serviceTypes.find(st => st.serviceTypeId === serviceType)
  return matched?.price || getBasePrice(serviceType)
}

// Frequency discount from API
export const getFrequencyDiscountFromAPI = (
  serviceType?: string,
  frequency?: string,
  serviceTypes: ServiceType[] = [],
  serviceFrequencies: ServiceFrequency[] = []
): number => {
  if (!serviceType || !frequency || serviceTypes.length === 0 || serviceFrequencies.length === 0) {
    return 0
  }
  const basePrice = getBasePriceFromAPI(serviceType, serviceTypes)
  const matched = serviceFrequencies.find(f =>
    f.frequency.toLowerCase().replace(/\s+/g, "-") === frequency
  )
  return matched ? (basePrice * matched.discountPercentage) / 100 : 0
}

// Subtotal = base - discount + extras
export const calculateSubtotal = (
  bookingData: Partial<BookingData>,
  serviceTypes: ServiceType[] = [],
  serviceFrequencies: ServiceFrequency[] = [],
  serviceOptions: ServiceOption[] = []
): number => {
  const base = getBasePriceFromAPI(bookingData.serviceType, serviceTypes)
  const discount = getFrequencyDiscountFromAPI(bookingData.serviceType, bookingData.frequency, serviceTypes, serviceFrequencies)
  const extras = getExtrasTotalFromOptions(bookingData.selectedExtras || [], serviceOptions)
  return base - discount + extras
}

// Tax
export const calculateTax = (subtotal: number, taxRate = 0.1): number => subtotal * taxRate

// Grand total = subtotal + tax
export const calculateGrandTotal = (
  bookingData: Partial<BookingData>,
  taxRate = 0.1,
  serviceTypes: ServiceType[] = [],
  serviceFrequencies: ServiceFrequency[] = [],
  serviceOptions: ServiceOption[] = []
): number => {
  const subtotal = calculateSubtotal(bookingData, serviceTypes, serviceFrequencies, serviceOptions)
  const tax = calculateTax(subtotal, taxRate)
  return subtotal + tax
}

// Format currency
export const formatCurrency = (amount: number, currency = "USD"): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount)
}

// Format frequency for display
export const formatFrequency = (frequency?: string): string => {
  if (!frequency) return "Select frequency"
  return frequency.charAt(0).toUpperCase() + frequency.slice(1).replace(/-/g, ' ')
}

// Format date/time
export const formatDate = (date: Date): string => new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" }).format(date)
export const formatTime = (date: Date): string => new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", hour12: true }).format(date)

// String utils
// export const capitalize = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1)
// export const formatFrequency = (frequency: string): string => {
//   switch (frequency) {
//     case "one-time":
//     case "one-off": return "One Time"
//     case "bi-weekly": return "Bi-Weekly"
//     default: return capitalize(frequency)
//   }
// }
