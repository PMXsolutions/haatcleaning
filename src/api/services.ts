import axiosInstance from './axiosConfig'
import type { ServiceArea, ServiceType, ServiceFrequency, ServiceOption } from './types'

class ApiService {
  // Service Areas API
  async getAllServiceAreas(): Promise<ServiceArea[]> {
    try {
      const response = await axiosInstance.get<ServiceArea[]>('/ServiceAreas/get_all')
      return response.data
    } catch (error) {
      console.error('Error fetching service areas:', error)
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
      const response = await axiosInstance.get<ServiceType[]>('/ServiceTypes/get_all')
      return response.data
    } catch (error) {
      console.error('Error fetching service types:', error)
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

  async getAllServiceFrequencies(): Promise<ServiceFrequency[]> {
    try {
      const response = await axiosInstance.get<ServiceFrequency[]>('/ServiceFrequencies/get_all')
      return response.data
    } catch (error) {
      console.error('Error fetching service frequencies:', error)
      throw error
    }
  }

  // Service Options API
  async getAllServiceOptions(): Promise<ServiceOption[]> {
    try {
      const response = await axiosInstance.get<ServiceOption[]>('/ServiceOptions/get_all')
      return response.data
    } catch (error) {
      console.error('Error fetching service options:', error)
      throw error
    }
  }

  // Add more endpoints as needed
  // async createBooking(bookingData: any): Promise<any> {
  //   try {
  //     const response = await axiosInstance.post('/bookings', bookingData)
  //     return response.data
  //   } catch (error) {
  //     console.error('Error creating booking:', error)
  //     throw error
  //   }
  // }

  // Extra services endpoint (if exists)
  // async getExtraServices(): Promise<any[]> {
  //   try {
  //     const response = await axiosInstance.get('/ExtraServices/get_all')
  //     return response.data
  //   } catch (error) {
  //     console.error('Error fetching extra services:', error)
  //     throw error
  //   }
  // }
}

// Export singleton instance
export const apiService = new ApiService()
export default apiService