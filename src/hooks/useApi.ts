import { useState, useEffect, useCallback } from 'react'
import { apiService } from '@/api/services'
import type { ServiceArea, ServiceType, ServiceFrequency, ServiceOption } from '@/api/types'

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
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchServiceTypes = useCallback(async () => {
    try {
      setLoading(true)
      const types = await apiService.getAllServiceTypes()
      setServiceTypes(types)
    } catch (err) {
      setError('Failed to fetch service types')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchServiceTypes()
  }, [fetchServiceTypes])

  return { serviceTypes, loading, error, refetch: fetchServiceTypes }
}

// Hook for service frequencies
export const useServiceFrequencies = () => {
  const [serviceFrequencies, setServiceFrequencies] = useState<ServiceFrequency[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchServiceFrequencies = useCallback(async () => {
    try {
      setLoading(true)
      const frequencies = await apiService.getAllServiceFrequencies()
      setServiceFrequencies(frequencies)
    } catch (err) {
      setError('Failed to fetch service frequencies')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchServiceFrequencies()
  }, [fetchServiceFrequencies])

  return { serviceFrequencies, loading, error, refetch: fetchServiceFrequencies }
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

// Service options hook
export const useServiceOptions = () => {
  const [serviceOptions, setServiceOptions] = useState<ServiceOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchServiceOptions = useCallback(async () => {
    try {
      setLoading(true)
      const options = await apiService.getAllServiceOptions()
      setServiceOptions(options)
    } catch (err) {
      console.error('Failed to fetch service options:', err)
      setError('Failed to fetch service options')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchServiceOptions()
  }, [fetchServiceOptions])

  return { serviceOptions, loading, error, refetch: fetchServiceOptions }
}