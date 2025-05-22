import { BookingData, BookingRecord, ExtraService } from '@/types';
import axiosInstance from "@/lib/axios"

// Response type for booking submission
// interface BookingResponse {
//   success: boolean
//   bookingId?: string
//   message?: string
// }

// --- MOCK DATA ---
const mockBookedDays = [
	new Date(2025, 5, 10), // June 10, 2025 (Months are 0-indexed)
	new Date(2025, 5, 15),
	new Date(2025, 5, 16),
];

let mockAdminBookedDays = [...mockBookedDays]; // Admin modifiable list

const mockExistingBookings: BookingRecord[] = [
	{
		id: 'bk_123',
		serviceType: 'residential',
		propertyInfo: { bedrooms: 2, bathrooms: 1 },
		frequency: 'one-time',
		selectedDate: new Date(2025, 5, 10),
		selectedExtras: [{ id: 'fridge', quantity: 1 }],
		contactDetails: { firstName: 'John', lastName: 'Doe', email: 'john@example.com', phone: '123456789' },
		addressDetails: { street: '123 Main St', city: 'Anytown', zipCode: '10001' },
		bookingTimestamp: Date.now() - 86400000, // Yesterday
		paymentStatus: 'pending',
		specialInstructions: 'Please be careful with the plants.',
	},
];

// API/MOCK TOGGLE 
const USE_REAL_API = false // Set to true when backend is ready


// --- Booking Page Functions ---

// fetching unavailable dates
export const fetchUnavailableDates = async (): Promise<Date[]> => {
  if (USE_REAL_API) {
    try {
      // Use axios instead of fetch
      const response = await axiosInstance.get("/api/booking/unavailable-dates")
      // Convert string dates to Date objects
      return response.data.dates.map((dateStr: string) => new Date(dateStr))
    } catch (error) {
      console.error("Error fetching unavailable dates:", error)
      return [] // Return empty array on error
    }
  } else {
    // Use your existing mock implementation
    console.log("API Call (Mock): fetchUnavailableDates")
    await new Promise((resolve) => setTimeout(resolve, 300))
    
    // Make sure we return Date objects and not strings
    return mockAdminBookedDays.map(date => 
      date instanceof Date ? date : new Date(date)
    );
	}
};

// Simulates submitting a booking
export const submitBooking = async (bookingData: BookingData): Promise<{ success: boolean; bookingId?: string; message?: string }> => {
	console.log('API Call (Mock): submitBooking', bookingData);
	await new Promise(resolve => setTimeout(resolve, 500));
    
	if (USE_REAL_API) {
		try {
			const response = await axiosInstance.post("/api/booking/submit", bookingData)
			return {
				success: true,
				bookingId: response.data.bookingId,
				message: response.data.message,
			}
    } catch (error: unknown) {
      let message = "Failed to submit booking";
      if (error && typeof error === "object" && "response" in error && error.response && typeof error.response === "object" && "data" in error.response && error.response.data && typeof error.response.data === "object" && "message" in error.response.data) {
        message = (error.response.data as { message?: string }).message || message;
      }
      return {
        success: false,
        message,
      }
    }
  } else {
    // existing mock implementation
    console.log("API Call (Mock): submitBooking", bookingData)
    await new Promise((resolve) => setTimeout(resolve, 500))

    try {
      // existing mock implementation...
      const newBookingId = `bk_${Date.now()}`

      const newRecord: BookingRecord = {
        ...bookingData,
        id: newBookingId,
        bookingTimestamp: Date.now(),
        paymentStatus: "pending",
      }
        
			// Ensure the selected date is a Date object
			if (bookingData.selectedDate) {
				// Add the date to unavailable dates
				if (!mockAdminBookedDays.some(d => 
					d.getFullYear() === bookingData.selectedDate?.getFullYear() &&
					d.getMonth() === bookingData.selectedDate?.getMonth() &&
					d.getDate() === bookingData.selectedDate?.getDate()
				)) {
					mockAdminBookedDays.push(new Date(bookingData.selectedDate));
				}
			}
        
			// add the booking to our mock database
			mockExistingBookings.push(newRecord);
			
			console.log('Booking added successfully', newRecord);
			console.log('Current bookings:', mockExistingBookings);
			
			return { success: true, bookingId: newBookingId };
    } catch (error) {
			console.error('Error submitting booking:', error);
			return { success: false, message: 'An error occurred while processing your booking.' };
    }
	}
};

// --- Admin Dashboard Functions ---

// fetching all bookings for the admin
export const fetchAdminBookings = async (): Promise<BookingRecord[]> => {
	if (USE_REAL_API) {
    try {
      const response = await axiosInstance.get("/api/admin/bookings")
      // Ensure all dates are proper Date objects
      return response.data.bookings.map((booking: BookingRecord) => ({
        ...booking,
        selectedDate: booking.selectedDate ? new Date(booking.selectedDate) : undefined,
      }))
    } catch (error) {
      console.error("Error fetching admin bookings:", error)
      return [] // Return empty array on error
    }
  } else {
    // Use your existing mock implementation
    console.log("API Call (Mock): fetchAdminBookings")
    await new Promise((resolve) => setTimeout(resolve, 300))

    console.log("Returning bookings:", mockExistingBookings)

		// Ensure all dates are proper Date objects before returning
		return mockExistingBookings.map(booking => ({
			...booking,
			selectedDate: booking.selectedDate instanceof Date 
				? booking.selectedDate 
				: booking.selectedDate 
					? new Date(booking.selectedDate) 
					: undefined
		}));
	}
};

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
    // existing mock implementation
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
      // Convert Date objects to ISO strings for API
      const dateStrings = dates.map((date) => date.toISOString())
      await axiosInstance.post("/api/admin/blocked-dates", { dates: dateStrings })
      return { success: true }
    } catch (error) {
      console.error("Error updating blocked dates:", error)
      return { success: false }
    }
  } else {
    // existing mock implementation
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
    // Use your existing mock implementation
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
	let total = 50; // Base price
	if (!bookingData.propertyInfo || !bookingData.frequency || !bookingData.selectedExtras) {
		return total; 
	}

	// Add price based on bedrooms/bathrooms
	total += bookingData.propertyInfo.bedrooms * 20;
	total += bookingData.propertyInfo.bathrooms * 15;

	// Add extra services cost
	const availableExtras = getAvailableExtras(); // Get definitions
	bookingData.selectedExtras.forEach(selected => {
		const definition = availableExtras.find(e => e.id === selected.id);
		if (definition) {
			total += definition.price * selected.quantity;
		}
	});

	// Apply frequency discount
	let discountMultiplier = 1;
	switch (bookingData.frequency) {
		case 'weekly': discountMultiplier = 0.85; break; // 15% off
		case 'bi-weekly': discountMultiplier = 0.90; break; // 10% off
		case 'monthly': discountMultiplier = 0.95; break; // 5% off
		case 'one-time':
		default: discountMultiplier = 1; break;
	}

	return Math.round(total * discountMultiplier * 100) / 100; // Apply discount and round
};

// Define available extra services (move to CMS/backend later)
export const getAvailableExtras = (): ExtraService[] => [
	{ id: 'fridge', name: 'Inside Fridge', price: 25, hasQuantity: false, icon: '🧊', description: 'Clean inside the refrigerator' },
	{ id: 'oven', name: 'Inside Oven', price: 30, hasQuantity: false, icon: '🔥', description: 'Clean inside the oven' },
	{ id: 'windows', name: 'Inside Windows', price: 5, hasQuantity: true, icon: '🪟', description: 'Clean interior windows (per window)' },
	{ id: 'laundry', name: 'Laundry', price: 20, hasQuantity: true, icon: '🧺', description: 'Wash and dry one load of laundry' },
];