import type { BookingData, BookingRecord, ExtraService } from "@/types"
import axiosInstance from "@/lib/axios"

// Response type for booking submission
interface BookingResponse {
  success: boolean
  bookingId?: string
  message?: string
}

// --- MOCK DATA ---
const mockBookedDays = [
  new Date(2025, 5, 10), // June 10, 2025 (Months are 0-indexed)
  new Date(2025, 5, 15),
  new Date(2025, 5, 16),
]

let mockAdminBookedDays = [...mockBookedDays] // Admin modifiable list

const mockExistingBookings: BookingRecord[] = [
  {
    id: "bk_123",
    serviceType: "residential",
    propertyInfo: { bedrooms: 2, bathrooms: 1 },
    frequency: "one-time",
    selectedDate: new Date(2025, 5, 10),
    selectedExtras: [{ id: "bathroom", quantity: 1 }],
    contactDetails: { firstName: "John", lastName: "Doe", email: "john@example.com", phone: "123456789" },
    addressDetails: { street: "123 Main St", city: "Anytown", zipCode: "10001" },
    bookingTimestamp: Date.now() - 86400000, // Yesterday
    paymentStatus: "pending",
    specialInstructions: "Please be careful with the plants.",
  },
]

// API/MOCK TOGGLE
const USE_REAL_API = false // Set to true when backend is ready

// --- Booking Page Functions ---

// fetching unavailable dates
export const fetchUnavailableDates = async (): Promise<Date[]> => {
  if (USE_REAL_API) {
    try {
      const response = await axiosInstance.get("/api/booking/unavailable-dates")
      return response.data.dates.map((dateStr: string) => new Date(dateStr))
    } catch (error) {
      console.error("Error fetching unavailable dates:", error)
      return []
    }
  } else {
    console.log("API Call (Mock): fetchUnavailableDates")
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockAdminBookedDays.map((date) => (date instanceof Date ? date : new Date(date)))
  }
}

// Simulates submitting a booking
export const submitBooking = async (bookingData: BookingData): Promise<BookingResponse> => {
  if (USE_REAL_API) {
    try {
      const response = await axiosInstance.post("/api/booking/submit", bookingData)
      return {
        success: true,
        bookingId: response.data.bookingId,
        message: response.data.message,
      }
    } catch (error: unknown) {
      let message = "Failed to submit booking"
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data
      ) {
        message = (error.response.data as { message?: string }).message || message
      }
      return {
        success: false,
        message,
      }
    }
  } else {
    console.log("API Call (Mock): submitBooking", bookingData)
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate payment processing

    try {
      const newBookingId = `bk_${Date.now()}`
      const newRecord: BookingRecord = {
        ...bookingData,
        id: newBookingId,
        bookingTimestamp: Date.now(),
        paymentStatus: "confirmed", // Simulate successful payment
      }

      // Add the date to unavailable dates
      if (bookingData.selectedDate) {
        if (
          !mockAdminBookedDays.some(
            (d) =>
              d.getFullYear() === bookingData.selectedDate?.getFullYear() &&
              d.getMonth() === bookingData.selectedDate?.getMonth() &&
              d.getDate() === bookingData.selectedDate?.getDate(),
          )
        ) {
          mockAdminBookedDays.push(new Date(bookingData.selectedDate))
        }
      }

      mockExistingBookings.push(newRecord)

      console.log("Booking added successfully", newRecord)
      console.log("Current bookings:", mockExistingBookings)

      return {
        success: true,
        bookingId: newBookingId,
        message: "Your booking has been confirmed! You will receive a confirmation email shortly.",
      }
    } catch (error) {
      console.error("Error submitting booking:", error)
      return {
        success: false,
        message: "An error occurred while processing your booking. Please try again.",
      }
    }
  }
}

// --- Admin Dashboard Functions ---

// fetching all bookings for the admin
export const fetchAdminBookings = async (): Promise<BookingRecord[]> => {
  if (USE_REAL_API) {
    try {
      const response = await axiosInstance.get("/api/admin/bookings")
      return response.data.bookings.map((booking: BookingRecord) => ({
        ...booking,
        selectedDate: booking.selectedDate ? new Date(booking.selectedDate) : undefined,
      }))
    } catch (error) {
      console.error("Error fetching admin bookings:", error)
      return []
    }
  } else {
    console.log("API Call (Mock): fetchAdminBookings")
    await new Promise((resolve) => setTimeout(resolve, 300))
    console.log("Returning bookings:", mockExistingBookings)
    return mockExistingBookings.map((booking) => ({
      ...booking,
      selectedDate:
        booking.selectedDate instanceof Date
          ? booking.selectedDate
          : booking.selectedDate
            ? new Date(booking.selectedDate)
            : undefined,
    }))
  }
}

// Simulates updating the payment status
export const updatePaymentStatus = async (
  bookingId: string,
  status: "confirmed" | "pending" | "failed",
): Promise<{ success: boolean }> => {
  if (USE_REAL_API) {
    try {
      await axiosInstance.put(`/api/admin/bookings/${bookingId}/payment-status`, { status })
      return { success: true }
    } catch (error) {
      console.error("Error updating payment status:", error)
      return { success: false }
    }
  } else {
    console.log("API Call (Mock): updatePaymentStatus", bookingId, status)
    await new Promise((resolve) => setTimeout(resolve, 300))
    const bookingIndex = mockExistingBookings.findIndex((b) => b.id === bookingId)
    if (bookingIndex !== -1) {
      mockExistingBookings[bookingIndex].paymentStatus = status
      console.log(`Updated payment status for booking ${bookingId} to ${status}`)
      return { success: true }
    }
    console.log(`Booking ${bookingId} not found`)
    return { success: false }
  }
}

// Simulates updating available/booked dates by admin
export const updateBlockedDates = async (dates: Date[]): Promise<{ success: boolean }> => {
  if (USE_REAL_API) {
    try {
      const dateStrings = dates.map((date) => date.toISOString())
      await axiosInstance.post("/api/admin/blocked-dates", { dates: dateStrings })
      return { success: true }
    } catch (error) {
      console.error("Error updating blocked dates:", error)
      return { success: false }
    }
  } else {
    console.log("API Call (Mock): updateBlockedDates", dates)
    await new Promise((resolve) => setTimeout(resolve, 300))
    mockAdminBookedDays = dates.map((date) => (date instanceof Date ? date : new Date(date)))
    console.log("Updated blocked dates:", mockAdminBookedDays)
    return { success: true }
  }
}

// free up dates as needed
export const freeUpDate = async (dateToFree: Date): Promise<{ success: boolean }> => {
  if (USE_REAL_API) {
    try {
      await axiosInstance.delete(`/api/admin/blocked-dates`, {
        data: { date: dateToFree.toISOString() },
      })
      return { success: true }
    } catch (error) {
      console.error("Error freeing up date:", error)
      return { success: false }
    }
  } else {
    console.log("API Call (Mock): freeUpDate", dateToFree)
    await new Promise((resolve) => setTimeout(resolve, 300))
    const initialCount = mockAdminBookedDays.length
    mockAdminBookedDays = mockAdminBookedDays.filter((d) => d.toDateString() !== dateToFree.toDateString())
    const success = mockAdminBookedDays.length < initialCount
    console.log(`Freed up date ${dateToFree.toDateString()}: ${success ? "Success" : "Not found"}`)
    return { success }
  }
}

// --- Pricing Logic ---
export const calculateTotal = (bookingData: Partial<BookingData>): number => {
  let total = 100 // Base price to match the UI

  if (!bookingData.propertyInfo || !bookingData.frequency || !bookingData.selectedExtras) {
    return total
  }

  // Service type pricing
  switch (bookingData.serviceType) {
    case "commercial":
      total = 150
      break
    case "airbnb":
      total = 120
      break
    case "residential":
    default:
      total = 100
      break
  }

  // Add price based on bedrooms/bathrooms
  total += (bookingData.propertyInfo.bedrooms - 1) * 25 // First bedroom included
  total += (bookingData.propertyInfo.bathrooms - 1) * 35 // First bathroom included

  // Add extra services cost
  const availableExtras = getAvailableExtras()
  bookingData.selectedExtras.forEach((selected) => {
    const definition = availableExtras.find((e) => e.id === selected.id)
    if (definition) {
      total += definition.price * selected.quantity
    }
  })

  // Apply frequency discount
  let discountMultiplier = 1
  switch (bookingData.frequency) {
    case "weekly":
      discountMultiplier = 0.85
      break // 15% off
    // case "bi-weekly":
    //   discountMultiplier = 0.9
    //   break // 10% off
    case "monthly":
      discountMultiplier = 0.95
      break // 5% off
    case "one-time":
    default:
      discountMultiplier = 1
      break
  }

  return Math.round(total * discountMultiplier * 100) / 100
}

// Define available extra services to match the new UI
export const getAvailableExtras = (): ExtraService[] => [
  {
    id: "bathroom",
    name: "Bathroom",
    price: 13.99,
    hasQuantity: true,
    icon: "🚿",
    description: "Additional bathroom cleaning service",
  },
  {
    id: "kitchen",
    name: "Kitchen",
    price: 13.99,
    hasQuantity: true,
    icon: "🍳",
    description: "Deep kitchen cleaning including appliances",
  },
  {
    id: "window",
    name: "Window Washing",
    price: 13.99,
    hasQuantity: true,
    icon: "🪟",
    description: "Interior and exterior window cleaning",
  },
  {
    id: "gutter",
    name: "Gutter Cleaning",
    price: 13.99,
    hasQuantity: true,
    icon: "🏠",
    description: "Gutter cleaning and debris removal",
  },
  {
    id: "store",
    name: "Store",
    price: 13.99,
    hasQuantity: true,
    icon: "🏪",
    description: "Commercial store cleaning service",
  },
  {
    id: "other",
    name: "Other Service Not Listed",
    price: 0,
    hasQuantity: false,
    icon: "❓",
    description: "Custom service - price to be determined",
  },
]

// Validate postal code (basic validation)
export const validatePostalCode = async (postalCode: string): Promise<{ valid: boolean; message?: string }> => {
  if (USE_REAL_API) {
    try {
      const response = await axiosInstance.post("/api/validate-postal-code", { postalCode })
      return response.data
    } catch (error) {
      console.error("Error validating postal code:", error)
      return { valid: false, message: "Unable to validate postal code" }
    }
  } else {
    // Mock validation
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Simple validation - accept most formats
    const isValid = /^[A-Za-z0-9\s-]{3,10}$/.test(postalCode.trim())

    return {
      valid: isValid,
      message: isValid ? "Service available in your area" : "Please enter a valid postal code",
    }
  }
}
