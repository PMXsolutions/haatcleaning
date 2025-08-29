import axiosInstance from './axiosConfig'
import type {
  LoginRequest,
  LoginResponse
} from '@/types/auth'
import type {
  // User,
  Cleaner,
  OtpRequest,
  CreateCleanerRequest,
  BookingRecord,
  CreateBookingRequest,
  ServiceArea,
  CreateServiceAreaRequest,
  ServiceAreaApiResponse,
  ServiceType,
  ServiceFrequency,
  ServiceOption,
  BankDetails,
  CreateBankDetailsRequest,
  ApiResponse
} from '@/api/types';

class ApiService {
  // Authentication endpoints
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await axiosInstance.post<LoginResponse>('/Account/auth_login', credentials);
    return response.data;
  }

  async verifyOtp(otpData: OtpRequest): Promise<ApiResponse<null>> {
    const response = await axiosInstance.post<ApiResponse<null>>('/Account/post_otp', otpData);
    return response.data;
  }

  async addUser(userData: CreateCleanerRequest, userId?: string): Promise<ApiResponse<null>> {
    const url = userId ? `/Account/add_user?userId=${userId}` : '/Account/add_user';
    const response = await axiosInstance.post<ApiResponse<null>>(url, userData);
    return response.data;
  }

  async editUser(cleanerId: string, userData: Partial<CreateCleanerRequest>, adminUserId: string): Promise<ApiResponse<null>> {
    const response = await axiosInstance.post<ApiResponse<null>>(
      `/Account/user_edit/${cleanerId}?userId=${adminUserId}`, 
      userData
    );
    return response.data;
  }

  async deleteUser(cleanerId: string, adminUserId: string): Promise<ApiResponse<null>> {
    const response = await axiosInstance.post<ApiResponse<null>>(
      `/Account/delete_user?id=${cleanerId}&userId=${adminUserId}`
    );
    return response.data;
  }

  // Service Areas API
  async getAllServiceAreas(): Promise<ServiceArea[]> {
    try {
      const response = await axiosInstance.get<ServiceArea[]>('/ServiceAreas/get_all');
      return response.data;
    } catch (error) {
      console.error('Error fetching service areas:', error);
      // Fallback data 
      return [
        {
          serviceAreaId: '1',
          areaName: 'Downtown',
          postalCode: '12345',
        },
        {
          serviceAreaId: '2',
          areaName: 'Uptown',
          postalCode: '54321',
        }
      ];
    }
  }

  async addServiceArea(data: CreateServiceAreaRequest): Promise<ServiceAreaApiResponse> {
    try {
      const response = await axiosInstance.post<ServiceAreaApiResponse>('/ServiceAreas/add', data)
      return response.data
    } catch (error) {
      console.error('Error adding service area:', error)
      throw error
    }
  }

  async updateServiceArea(data: ServiceArea): Promise<ServiceAreaApiResponse> {
    try {
      const response = await axiosInstance.post<ServiceAreaApiResponse>(`/ServiceAreas/edit/${data.serviceAreaId}`, data)
      return response.data
    } catch (error) {
      console.error('Error updating service area:', error)
      throw error
    }
  }

  async deleteServiceArea(id: string): Promise<ServiceAreaApiResponse> {
    try {
      const response = await axiosInstance.post<ServiceAreaApiResponse>(`/ServiceAreas/delete/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting service area:', error)
      throw error
    }
  }

  async validatePostalCode(postalCode: string): Promise<{ isValid: boolean; areaName?: string }> {
    try {
      const serviceAreas = await this.getAllServiceAreas()
      console.log('Service areas:', serviceAreas) 
      console.log('Validating postal code:', postalCode) 
      
      const matchedArea = serviceAreas.find(area => 
        area.postalCode === postalCode.trim()
      )
      
      return {
        isValid: !!matchedArea,
        areaName: matchedArea?.areaName
      }
    } catch (error) {
      console.error('Error validating postal code:', error)
      return { isValid: false }
    }
  }

  // Service Types API
  async getAllServiceTypes(): Promise<ServiceType[]> {
    try {
      const response = await axiosInstance.get<ServiceType[]>('/ServiceTypes/get_all');
      return response.data;
    } catch (error) {
      console.error('Error fetching service types:', error);
      // Fallback data
      return [
        {
          serviceTypeId: '1',
          name: 'Residential Cleaning',
          description: 'Complete home cleaning service',
          price: 150,
        },
        {
          serviceTypeId: '2',
          name: 'Commercial Cleaning',
          description: 'Office and commercial space cleaning',
          price: 200,
        },
        {
          serviceTypeId: '3',
          name: 'AirBnB Cleaning',
          description: 'Quick turnaround cleaning for short-term rentals',
          price: 100,
        }
      ];
    }
  }

  async addServiceType(data: Omit<ServiceType, 'serviceTypeId'>): Promise<ServiceAreaApiResponse> {
    try {
      const response = await axiosInstance.post<ServiceAreaApiResponse>(
        '/ServiceTypes/add', 
        data
      )
      return response.data
    } catch (error) {
      console.error('Error adding service type:', error)
      throw error
    }
  }

  async updateServiceType(data: ServiceType): Promise<ServiceAreaApiResponse> {
    try {
      const response = await axiosInstance.post<ServiceAreaApiResponse>(`/ServiceTypes/edit/${data.serviceTypeId}`, data)
      return response.data
    } catch (error) {
      console.error('Error updating service type:', error)
      throw error
    }
  }

  async deleteServiceType(serviceTypeId: string): Promise<ServiceAreaApiResponse> {
    try {
      const response = await axiosInstance.post<ServiceAreaApiResponse>(
        `/ServiceTypes/delete/${serviceTypeId}`
      )
      return response.data
    } catch (error) {
      console.error('Error deleting service type:', error)
      throw error
    }
  }

  async getServiceTypeById(id: string): Promise<ServiceType | null> {
    try {
      const serviceTypes = await this.getAllServiceTypes()
      return serviceTypes.find(type => type.serviceTypeId === id) || null
    } catch (error) {
      console.error('Error fetching service type:', error)
      return null
    }
  }

  // Service Frequencies API
  async getAllServiceFrequencies(): Promise<ServiceFrequency[]> {
    try {
      const response = await axiosInstance.get<ServiceFrequency[]>('/ServiceFrequencies/get_all');
      return response.data;
    } catch (error) {
      console.error('Error fetching service frequencies:', error);
      // Fallback data
      return [
        {
          serviceFrequencyId: '1',
          frequency: 'One-time',
          discountPercentage: 0,
        },
        {
          serviceFrequencyId: '2',
          frequency: 'Weekly',
          discountPercentage: 15,
        },
        {
          serviceFrequencyId: '3',
          frequency: 'Bi-weekly',
          discountPercentage: 10,
        },
        {
          serviceFrequencyId: '4',
          frequency: 'Monthly',
          discountPercentage: 5,
        }
      ];
    }
  }

  async addServiceFrequency(data: Omit<ServiceFrequency, 'serviceFrequencyId'>): Promise<ServiceAreaApiResponse> {
    try {
      const response = await axiosInstance.post<ServiceAreaApiResponse>('/ServiceFrequencies/add', data)
      return response.data
    } catch (error) {
      console.error('Error adding service frequency:', error)
      throw error
    }
  }

  async updateServiceFrequency(data: ServiceFrequency): Promise<ServiceAreaApiResponse> {
    try {
      const response = await axiosInstance.post<ServiceAreaApiResponse>(`/ServiceFrequencies/edit/${data.serviceFrequencyId}`, data)
      return response.data
    } catch (error) {
      console.error('Error updating service frequency:', error)
      throw error
    }
  }

  async deleteServiceFrequency(serviceFrequencyId: string): Promise<ServiceAreaApiResponse> {
    try {
      const response = await axiosInstance.post<ServiceAreaApiResponse>(`/ServiceFrequencies/delete/${serviceFrequencyId}`)
      return response.data
    } catch (error) {
      console.error('Error deleting service frequency:', error)
      throw error
    }
  }

  async getServiceFrequencyById(id: string): Promise<ServiceFrequency | null> {
    try {
      const serviceFrequencies = await this.getAllServiceFrequencies()
      return serviceFrequencies.find(frequency => frequency.serviceFrequencyId === id) || null
    } catch (error) {
      console.error('Error fetching service frequency:', error)
      return null
    }
  }

  // Service Options API
  async getAllServiceOptions(serviceTypeId?: string): Promise<ServiceOption[]> {
    try {
      const url = serviceTypeId 
        ? `/ServiceOptions/get_all?serviceTypeId=${serviceTypeId}`
        : '/ServiceOptions/get_all';
      const response = await axiosInstance.get<ServiceOption[]>(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching service options:', error);
      // Fallback data
      return [
        {
          serviceOptionId: '1',
          serviceTypeId: serviceTypeId || '1',
          optionName: 'Deep Cleaning',
          pricePerUnit: 50,
        },
        {
          serviceOptionId: '2',
          serviceTypeId: serviceTypeId || '1',
          optionName: 'Window Cleaning',
          pricePerUnit: 25,
        },
        {
          serviceOptionId: '3',
          serviceTypeId: serviceTypeId || '1',
          optionName: 'Carpet Cleaning',
          pricePerUnit: 75,
        }
      ];
    }
  }

  async addServiceOption(data: Omit<ServiceOption, 'serviceOptionId'>): Promise<ServiceAreaApiResponse> {
    try {
      const response = await axiosInstance.post<ServiceAreaApiResponse>('/ServiceOptions/add', data)
      return response.data
    } catch (error) {
      console.error('Error adding service option:', error)
      throw error
    }
  }

  async updateServiceOption(data: ServiceOption): Promise<ServiceAreaApiResponse> {
    try {
      const response = await axiosInstance.post<ServiceAreaApiResponse>(`/ServiceOptions/edit/${data.serviceOptionId}`, data)
      return response.data
    } catch (error) {
      console.error('Error updating service option:', error)
      throw error
    }
  }

  async deleteServiceOption(serviceOptionId: string): Promise<ServiceAreaApiResponse> {
    try {
      const response = await axiosInstance.post<ServiceAreaApiResponse>(`/ServiceOptions/delete/${serviceOptionId}`)
      return response.data
    } catch (error) {
      console.error('Error deleting service option:', error)
      throw error
    }
  }

  async getServiceOptionById(id: string): Promise<ServiceOption | null> {
    try {
      const serviceOptions = await this.getAllServiceOptions()
      return serviceOptions.find(option => option.serviceOptionId === id) || null
    } catch (error) {
      console.error('Error fetching service option:', error)
      return null
    }
  }

  // Bookings API
  async getAllBookings(): Promise<BookingRecord[]> {
    try {
      const response = await axiosInstance.get<BookingRecord[]>('/Bookings/get_all');
      return response.data;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  }

  async getBookingDetails(id: string): Promise<BookingRecord> {
  try {
    const response = await axiosInstance.get<BookingRecord>(`/Bookings/details/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching booking details:', error);
    throw error;
  }
}

  async createBooking(data: CreateBookingRequest): Promise<unknown> {
    try {
      const response = await axiosInstance.post('/Bookings/book', data, {
      headers: { 'Content-Type': 'application/json' }
    });
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  async assignBooking(userId: string, bookingId: string): Promise<unknown> {
    try {
      const response = await axiosInstance.get(`/Bookings/assign_booking?userId=${userId}&bookingId=${bookingId}`);
      return response.data;
    } catch (error) {
      console.error('Error assigning booking:', error);
      throw error;
    }
  }

  async getAllAssignedBookings(): Promise<BookingRecord[]> {
    try {
      const response = await axiosInstance.get<BookingRecord[]>('/Bookings/get_all_assigned_booking');
      return response.data;
    } catch (error) {
      console.error('Error fetching assigned bookings:', error);
      throw error;
    }
  }

  async getCleanerAssignedBookings(userId: string): Promise<BookingRecord[]> {
    try {
      const response = await axiosInstance.get<BookingRecord[]>(`/Bookings/get_cleaner_assigned_booking?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching cleaner-specific assigned bookings:', error);
      throw error;
    }
  }

  async markBookingAsPaid(bookingId: string, proofOfPayment: File): Promise<ApiResponse<null>> {
    const formData = new FormData();
    formData.append('proofOfPayment', proofOfPayment);

    const response = await axiosInstance.post<ApiResponse<null>>(
      `/Bookings/mark_as_paid?bookingId=${bookingId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  // async markBookingAsPaid(bookingId: string, proofOfPayment?: File | null): Promise<ApiResponse<null>> {
  //   const url = `/Bookings/mark_as_paid?bookingId=${encodeURIComponent(bookingId)}`
  //   if (proofOfPayment) {
  //     const fd = new FormData()
  //     fd.append('file', proofOfPayment)
  //     const response = await axiosInstance.post<ApiResponse<null>>(url, fd, {
  //       headers: { 'Content-Type': 'multipart/form-data' }
  //     })
  //     return response.data
  //   } else {
  //     const response = await axiosInstance.post<ApiResponse<null>>(url)
  //     return response.data
  //   }
  // }

  // Cleaners API
  async getAllCleaners(): Promise<Cleaner[]> {
    try {
      const res = await axiosInstance.get<Cleaner[]>('/Account/get_all_users', {
        params: { role: 'Cleaner' },
      });
      return res.data;
    } catch (error) {
      console.error('Error fetching cleaners:', error);
      throw error;
    }
  }

  // Bank Details API
  async getAllBankDetails(): Promise<BankDetails[]> {
    try {
      const response = await axiosInstance.get<BankDetails[]>('/BankDetails/get_all');
      return response.data;
    } catch (error) {
      console.error('Error fetching bank details:', error);
      throw error;
    }
  }

  async getBankDetailsById(id: string): Promise<BankDetails> {
    try {
      const response = await axiosInstance.get<BankDetails>(`/BankDetails/details/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching bank details:', error);
      throw error;
    }
  }

  async addBankDetails(data: CreateBankDetailsRequest): Promise<ServiceAreaApiResponse> {
    try {
      const response = await axiosInstance.post<ServiceAreaApiResponse>('/BankDetails/add_bank', data);
      return response.data;
    } catch (error) {
      console.error('Error adding bank details:', error);
      throw error;
    }
  }

  async updateBankDetails(id: string, data: BankDetails): Promise<ServiceAreaApiResponse> {
    try {
      const response = await axiosInstance.post<ServiceAreaApiResponse>(`/BankDetails/edit/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating bank details:', error);
      throw error;
    }
  }

  async deleteBankDetails(id: string): Promise<ServiceAreaApiResponse> {
    try {
      const response = await axiosInstance.post<ServiceAreaApiResponse>(`/BankDetails/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting bank details:', error);
      throw error;
    }
  }

}

// Export singleton instance
export const apiService = new ApiService()
export default apiService