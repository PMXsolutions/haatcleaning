import type { ServiceType, ServiceFrequency, ServiceOption } from '@/api/types'

// Fallback data for when API is unavailable
export const fallbackServiceTypes: ServiceType[] = [
  {
    serviceTypeId: "residential-fallback",
    name: "Residential Cleaning",
    description: "Professional home cleaning service",
    price: 120
  },
  {
    serviceTypeId: "commercial-fallback", 
    name: "Commercial Cleaning",
    description: "Office and business cleaning",
    price: 200
  },
  {
    serviceTypeId: "airbnb-fallback",
    name: "Airbnb Cleaning",
    description: "Turnover cleaning for short-term rentals",
    price: 150
  }
]

export const fallbackServiceFrequencies: ServiceFrequency[] = [
  {
    serviceFrequencyId: "one-time-fallback",
    frequency: "One Time",
    discountPercentage: 0
  },
  {
    serviceFrequencyId: "weekly-fallback",
    frequency: "Weekly",
    discountPercentage: 15
  },
  {
    serviceFrequencyId: "monthly-fallback",
    frequency: "Monthly",
    discountPercentage: 10
  }
]

export const fallbackServiceOptions: ServiceOption[] = [
  {
    serviceOptionId: "bedroom-residential-fallback",
    optionName: "Extra Bedroom",
    serviceTypeId: "residential-fallback",
    pricePerUnit: 20
  },
  {
    serviceOptionId: "bathroom-residential-fallback", 
    optionName: "Extra Bathroom",
    serviceTypeId: "residential-fallback",
    pricePerUnit: 25
  },
  {
    serviceOptionId: "window-residential-fallback",
    optionName: "Window Washing",
    serviceTypeId: "residential-fallback",
    pricePerUnit: 15
  },
  {
    serviceOptionId: "oven-residential-fallback",
    optionName: "Oven Deep Clean",
    serviceTypeId: "residential-fallback", 
    pricePerUnit: 30
  },
  {
    serviceOptionId: "fridge-residential-fallback",
    optionName: "Refrigerator Clean",
    serviceTypeId: "residential-fallback",
    pricePerUnit: 25
  },
  {
    serviceOptionId: "conference-commercial-fallback",
    optionName: "Conference Room",
    serviceTypeId: "commercial-fallback",
    pricePerUnit: 40
  },
  {
    serviceOptionId: "window-commercial-fallback",
    optionName: "Window Washing",
    serviceTypeId: "commercial-fallback",
    pricePerUnit: 20
  },
  {
    serviceOptionId: "carpet-commercial-fallback",
    optionName: "Carpet Cleaning",
    serviceTypeId: "commercial-fallback",
    pricePerUnit: 35
  },
  {
    serviceOptionId: "laundry-airbnb-fallback",
    optionName: "Laundry Service",
    serviceTypeId: "airbnb-fallback",
    pricePerUnit: 20
  },
  {
    serviceOptionId: "restocking-airbnb-fallback",
    optionName: "Amenity Restocking",
    serviceTypeId: "airbnb-fallback",
    pricePerUnit: 15
  },
  {
    serviceOptionId: "deep-clean-airbnb-fallback",
    optionName: "Deep Clean",
    serviceTypeId: "airbnb-fallback",
    pricePerUnit: 50
  }
]