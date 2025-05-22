// Common app types

// Property Info
export interface PropertyInfo {
  bedrooms: number;
  bathrooms: number;
}

// Service type options
export type ServiceType = "residential" | "commercial" | "airbnb"


// Frequency Options
export type Frequency = 'one-time' | 'weekly' | 'bi-weekly' | 'monthly';

// Contact Information
export interface ContactDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

// Address Details
export interface AddressDetails {
  street: string;
  city: string;
  zipCode: string;
}

// Additional Services
export interface ExtraService {
  id: string;
  name: string;
  price: number;
  hasQuantity: boolean;
  icon: string;
  description: string;
}

export interface SelectedExtra {
  id: string;
  quantity: number;
}

// Combined Booking Data
export interface BookingData {
  serviceType: ServiceType
  propertyInfo: PropertyInfo;
  frequency: Frequency;
  selectedDate: Date | undefined;
  selectedExtras: SelectedExtra[];
  contactDetails: ContactDetails;
  addressDetails: AddressDetails;
  specialInstructions: string;
}

// Complete Booking Record (with ID, timestamp, etc.)
export interface BookingRecord extends BookingData {
  id: string;
  bookingTimestamp: number;
  paymentStatus?: 'confirmed' | 'pending' | 'failed';
}

// API Response Types
export interface BookingResponse {
  success: boolean;
  bookingId?: string;
  message?: string;
}

export interface PaymentStatusUpdateResponse {
  success: boolean;
  message?: string;
}

export interface CalendarUpdateResponse {
  success: boolean;
  message?: string;
}