import { BookingData, BookingRecord, ExtraService } from '../types';

// --- MOCK DATA ---
const mockBookedDays = [
    new Date(2025, 5, 10), // June 10, 2025 (Months are 0-indexed)
    new Date(2025, 5, 15),
    new Date(2025, 5, 16),
];

let mockAdminBookedDays = [...mockBookedDays]; // Admin modifiable list

const mockExistingBookings: BookingRecord[] = [
    // Add some sample booking records for the admin dashboard
    {
        id: 'bk_123',
        propertyInfo: { bedrooms: 2, bathrooms: 1 },
        frequency: 'one-time',
        selectedDate: new Date(2025, 5, 10),
        selectedExtras: [{ id: 'fridge', quantity: 1 }],
        contactDetails: { firstName: 'John', lastName: 'Doe', email: 'john@example.com', phone: '123456789' },
        addressDetails: { street: '123 Main St', city: 'Anytown', zipCode: '10001' },
        bookingTimestamp: Date.now() - 86400000, // Yesterday
        paymentStatus: 'pending',
    },
    // Add more mock bookings if needed
];
// --- END MOCK DATA ---

// --- Booking Page Functions ---

// Simulates fetching unavailable dates
export const fetchUnavailableDates = async (): Promise<Date[]> => {
    console.log('API Call (Mock): fetchUnavailableDates');
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    // In future, replace this with:
    // const response = await fetch('/api/booking/unavailable-dates');
    // const data = await response.json();
    // return data.map(dateStr => new Date(dateStr));
    
    // Make sure we return Date objects and not strings
    return mockAdminBookedDays.map(date => 
        date instanceof Date ? date : new Date(date)
    );
};

// Simulates submitting a booking
export const submitBooking = async (bookingData: BookingData): Promise<{ success: boolean; bookingId?: string; message?: string }> => {
    console.log('API Call (Mock): submitBooking', bookingData);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
        // Generate a unique booking ID
        const newBookingId = `bk_${Date.now()}`;
        
        // Create a full booking record
        const newRecord: BookingRecord = {
            ...bookingData,
            id: newBookingId,
            bookingTimestamp: Date.now(),
            paymentStatus: 'pending', // Payment step comes next
        };
        
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
        
        // Add the booking to our mock database
        mockExistingBookings.push(newRecord);
        
        console.log('Booking added successfully', newRecord);
        console.log('Current bookings:', mockExistingBookings);
        
        return { success: true, bookingId: newBookingId };
    } catch (error) {
        console.error('Error submitting booking:', error);
        return { success: false, message: 'An error occurred while processing your booking.' };
    }
};

// --- Admin Dashboard Functions ---

// Simulates fetching all bookings for the admin
export const fetchAdminBookings = async (): Promise<BookingRecord[]> => {
    console.log('API Call (Mock): fetchAdminBookings');
    await new Promise(resolve => setTimeout(resolve, 300));
    // In future, fetch from '/api/admin/bookings'
    
    console.log('Returning bookings:', mockExistingBookings);
    
    // Ensure all dates are proper Date objects before returning
    return mockExistingBookings.map(booking => ({
        ...booking,
        selectedDate: booking.selectedDate instanceof Date 
            ? booking.selectedDate 
            : booking.selectedDate ? new Date(booking.selectedDate) : undefined
    }));
};

// Simulates updating the payment status
export const updatePaymentStatus = async (bookingId: string, status: 'confirmed' | 'pending' | 'failed'): Promise<{ success: boolean }> => {
    console.log('API Call (Mock): updatePaymentStatus', bookingId, status);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const bookingIndex = mockExistingBookings.findIndex(b => b.id === bookingId);
    if (bookingIndex !== -1) {
        mockExistingBookings[bookingIndex].paymentStatus = status;
        console.log(`Updated payment status for booking ${bookingId} to ${status}`);
        return { success: true };
    }
    console.log(`Booking ${bookingId} not found`);
    return { success: false };
};

// Simulates updating available/booked dates by admin
export const updateBlockedDates = async (dates: Date[]): Promise<{ success: boolean }> => {
    console.log('API Call (Mock): updateBlockedDates', dates);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Ensure all dates are proper Date objects
    mockAdminBookedDays = dates.map(date => 
        date instanceof Date ? date : new Date(date)
    );
    
    console.log('Updated blocked dates:', mockAdminBookedDays);
    return { success: true };
};

// Add functions to free up dates etc. as needed
export const freeUpDate = async (dateToFree: Date): Promise<{ success: boolean }> => {
    console.log('API Call (Mock): freeUpDate', dateToFree);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const initialCount = mockAdminBookedDays.length;
    mockAdminBookedDays = mockAdminBookedDays.filter(
        d => d.toDateString() !== dateToFree.toDateString()
    );
    
    const success = mockAdminBookedDays.length < initialCount;
    console.log(`Freed up date ${dateToFree.toDateString()}: ${success ? 'Success' : 'Not found'}`);
    
    return { success };
}

// --- Pricing Logic (Keep separate or move to backend eventually) ---

export const calculateTotal = (bookingData: Partial<BookingData>): number => {
    let total = 50; // Base price
    if (!bookingData.propertyInfo || !bookingData.frequency || !bookingData.selectedExtras) {
        return total; // Not enough info yet
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
    // Add more...
];