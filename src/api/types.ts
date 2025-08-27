export interface ServiceArea {
  serviceAreaId: string
  postalCode: string
  areaName: string
}

export interface ServiceType {
  serviceTypeId: string
  name: string
  description: string
  price: number
}

export interface ServiceFrequency {
  serviceFrequencyId: string
  frequency: string
  discountPercentage: number
}

export interface ServiceOption {
  serviceOptionId: string
  optionName: string
  serviceTypeId: string
  pricePerUnit: number
}

export interface CreateServiceAreaRequest {
  areaName: string;
  postalCode: string;
}

export interface ServiceAreaApiResponse {
  status: string;
  message: string;
}

export interface ServiceDetail {
  serviceOptionId: string;
  quantity: number;
}

export interface CreateBookingRequest {
  serviceAreaId: string;
  serviceTypeId: string;
  serviceFrequencyId: string;
  serviceDate: string;
  totalPrice: number;
  details: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  serviceDetails: ServiceDetail[];
}

export interface BookingRecord {
  bookingId: string
  serviceAreaId: string
  serviceTypeId: string
  serviceFrequencyId: string
  serviceDate: string
  totalPrice: number
  status: "pending" | "assigned" | "paid"
  customerName: string
  customerEmail: string
  customerPhone?: string
  customerAddress?: string
  customerCity?: string
  details?: string
  assignedCleanerId?: string
  createdAt: string
  updatedAt?: string
  receiptUrl?: string
  serviceArea?: ServiceArea
  serviceType?: ServiceType
  frequency?: ServiceFrequency
  serviceDetails?: BookingServiceDetail[]
}

export interface BookingServiceDetail {
  serviceOptionId: string
  quantity: number
}

// export interface BookingDetail extends BookingRecord {
//   serviceAreaName: string;
//   serviceTypeName: string;
//   frequencyName: string;
//   assignedCleanerName?: string;
// }

export interface BookingDetail extends BookingRecord {
  serviceOptions: ServiceOption[]
  assignedCleaner?: Cleaner
}

export interface Cleaner {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  status: 'available' | 'occupied' | 'inactive';
  currentBookings?: string[];
  completedJobs?: number;
  role?: string;
}

export interface CreateCleanerRequest {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword?: string;
  role?: 'Cleaner';
}

export interface Payment {
  paymentId: string;
  bookingId: string;
  customerName: string;
  amount: number;
  method: 'Card' | 'PayPal' | 'Cash';
  status: 'pending' | 'paid' | 'failed';
  datePaid: string;
  transactionId?: string;
}

export interface AssignmentRequest {
  bookingId: string;
  cleanerId: string;
}

export interface OtpRequest {
  email: string;
  otp: string;
}

export interface ApiResponse<T> {
  data: T
  success?: boolean
  message?: string
}

// Bank
export interface BankDetails {
  bankDetailsId: string
  bankName: string
  accountNumber: string
  accountName: string
  bsb: string
  sortCode: string
}

export interface CreateBankDetailsRequest {
  bankName: string
  accountNumber: string
  accountName: string
  bsb: string
  sortCode: string
}

export interface AssignmentUser {
  userId: string
  firstName: string
  lastName: string
  fullName: string
  email: string
  phoneNumber: string
  role: string
}

export interface AssignmentBooking {
  bookingId: string
  serviceAreaId: string
  serviceTypeId: string
  serviceFrequencyId: string
  serviceDate: string
  serviceTime: string
  status: string
  isPaid: boolean
  proofOfPayment: string | null
  totalPrice: number
  details: string | null
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  customerCity: string
  dateCreated: string
  dateModified: string
  serviceArea?: { areaName?: string } | null
  serviceType?: { name?: string } | null
  serviceFrequency?: { frequency?: string } | null
  serviceDetails?: Array<{
    serviceOptionId: string
    quantity: number
  }> | null
}

export interface CleanerAssignment {
  bookingAssignmentId: string
  bookingId: string
  dateCreated: string
  dateModified: string
  user: AssignmentUser
  booking: AssignmentBooking
}
