import { useAuthStore } from '@/stores/authStore'
import { useEffect } from 'react'
// import { shallow } from 'zustand/shallow'

export const useAuth = () => {
  const checkAuth = useAuthStore(state => state.checkAuth)
  const store = useAuthStore()
  
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return store
}