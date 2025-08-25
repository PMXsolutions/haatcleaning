export interface ServiceArea {
  serviceAreaId: string
  postalCode: string
  city: string
  state: string
  isActive: boolean
}

export interface ApiServiceType {
  serviceTypeId: string
  name: string
  description: string
  price: number
}

export interface ApiResponse<T> {
  data: T
  success?: boolean
  message?: string
}

// Property Info
export interface PropertyInfo {
  bedrooms: number;
  bathrooms: number;
}

// Service type options
export type ServiceType = "residential" | "commercial" | "airbnb"


// Frequency Options
export type Frequency = 'one-time' | 'weekly' | 'monthly';

// Size options for services
export type Size = "SM" | "MD" | "BG"

// Size pricing structure
export interface SizePrice {
  SM: number;
  MD: number;
  BG: number;
}

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
// export interface ExtraService {
//   id: string;
//   name: string;
//   price: number;
//   prices?: SizePrice; 
//   hasQuantity: boolean;
//   icon: string;
//   description: string;
// }

export interface SelectedExtra {
  id: string;
  quantity: number;
  name?: string
  size?: Size; 
  customText?: string;
}

// Combined Booking Data
export interface BookingData {
  serviceType: string
  // propertyInfo: PropertyInfo;
  frequency: string;
  selectedDate: Date | undefined;
  selectedExtras: SelectedExtra[];
  contactDetails: ContactDetails;
  addressDetails: AddressDetails;
  // specialInstructions?: string;
  totalPrice?: number
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