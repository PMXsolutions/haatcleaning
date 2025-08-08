import { useState, useEffect, useCallback } from 'react'
import { apiService } from '@/api/services'
import type { ServiceArea, ServiceType, ServiceFrequency, ServiceOption } from '@/api/types'
import { fallbackServiceTypes, fallbackServiceFrequencies, fallbackServiceOptions } from '@/lib/fallbackData'

// Hook for postal code validation
export const usePostalCodeValidation = () => {
  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<{ isValid: boolean; areaName?: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const validatePostalCode = useCallback(async (postalCode: string) => {
    if (!postalCode.trim()) {
      setValidationResult(null)
      setError(null)
      return
    }

    setIsValidating(true)
    setError(null)

    try {
      const result = await apiService.validatePostalCode(postalCode)
      setValidationResult(result)
      if (!result.isValid) {
        setError('Postal code not in service area')
      }
    } catch (err) {
      setError('Failed to validate postal code')
      setValidationResult({ isValid: false })
      console.error(err)
    } finally {
      setIsValidating(false)
    }
  }, [])

  return { 
    validatePostalCode, 
    isValidating, 
    isValid: validationResult?.isValid || false,
    areaName: validationResult?.areaName,
    error 
  }
}

// Hook for service types
export const useServiceTypes = () => {
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>(fallbackServiceTypes)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usingFallback, setUsingFallback] = useState(true)

  const fetchServiceTypes = useCallback(async () => {
    try {
      setLoading(true)
      const types = await apiService.getAllServiceTypes()
      setServiceTypes(types)
      setUsingFallback(false)
      setError(null)
    } catch (err) {
      console.error('Failed to fetch service types, using fallback data:', err)
      setServiceTypes(fallbackServiceTypes)
      setUsingFallback(true)
      setError('Using offline data - some features may be limited')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchServiceTypes()
  }, [fetchServiceTypes])

  return { serviceTypes, loading, error, usingFallback, refetch: fetchServiceTypes }
}

// Hook for service frequencies
export const useServiceFrequencies = () => {
  const [serviceFrequencies, setServiceFrequencies] = useState<ServiceFrequency[]>(fallbackServiceFrequencies)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usingFallback, setUsingFallback] = useState(true)

  const fetchServiceFrequencies = useCallback(async () => {
    try {
      setLoading(true)
      const frequencies = await apiService.getAllServiceFrequencies()
      setServiceFrequencies(frequencies)
      setUsingFallback(false)
      setError(null)
    } catch (err) {
      console.error('Failed to fetch service frequencies, using fallback data:', err)
      setServiceFrequencies(fallbackServiceFrequencies)
      setUsingFallback(true)
      setError('Using offline data - some features may be limited')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchServiceFrequencies()
  }, [fetchServiceFrequencies])

  return { serviceFrequencies, loading, error, usingFallback, refetch: fetchServiceFrequencies }
}

// Hook for service areas
export const useServiceAreas = () => {
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchServiceAreas = async () => {
      try {
        setLoading(true)
        const areas = await apiService.getAllServiceAreas()
        setServiceAreas(areas)
      } catch (err) {
        setError('Failed to fetch service areas')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchServiceAreas()
  }, [])

  return { serviceAreas, loading, error }
}

// Service options hook with service type filtering
export const useServiceOptions = (serviceTypeId?: string) => {
  const [serviceOptions, setServiceOptions] = useState<ServiceOption[]>(fallbackServiceOptions)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usingFallback, setUsingFallback] = useState(true)

  const fetchServiceOptions = useCallback(async () => {
    try {
      setLoading(true)
      const options = await apiService.getAllServiceOptions()
      setServiceOptions(options)
      setUsingFallback(false)
      setError(null)
    } catch (err) {
      console.error('Failed to fetch service options, using fallback data:', err)
      setServiceOptions(fallbackServiceOptions)
      setUsingFallback(true)
      setError('Using offline data - some features may be limited')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchServiceOptions()
  }, [fetchServiceOptions])

  // Filter service options by service type if provided
  const filteredServiceOptions = serviceTypeId 
    ? serviceOptions.filter(option => option.serviceTypeId === serviceTypeId)
    : serviceOptions

  return { 
    serviceOptions: filteredServiceOptions, 
    allServiceOptions: serviceOptions,
    loading, 
    error, 
    usingFallback,
    refetch: fetchServiceOptions 
  }
}