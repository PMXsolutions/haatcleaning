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

export interface ApiResponse<T> {
  data: T
  success?: boolean
  message?: string
}