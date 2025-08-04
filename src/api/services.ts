import axiosInstance from './axiosConfig'
import type { ServiceArea, ServiceType, ServiceFrequency, ServiceOption, CreateServiceAreaRequest, ServiceAreaApiResponse } from '@/api/types'

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
      const response = await axiosInstance.get<ServiceType[]>('/ServiceTypes/get_all')
      return response.data
    } catch (error) {
      console.error('Error fetching service types:', error)
      throw error
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

}

// Export singleton instance
export const apiService = new ApiService()
export default apiService