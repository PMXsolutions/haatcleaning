import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import Cookies from 'js-cookie'
import axiosInstance from '@/api/axiosConfig'
import type { User, LoginResponse, LoginRequest } from '@/types/auth'

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  
  // Actions
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>
  logout: () => void
  setLoading: (loading: boolean) => void
  checkAuth: () => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isLoading: true,
        isAuthenticated: false,

        login: async (email: string, password: string, rememberMe: boolean) => {
          try {
            set({ isLoading: true })
            
            const loginData: LoginRequest = { email, password, rememberMe }
            const response = await axiosInstance.post<LoginResponse>('/Account/auth_login', loginData)
            const data = response.data
            
            if (data.response?.status === 'Success' && data.userProfile) {
              const userData = data.userProfile
              
              // Store auth token in secure cookie
              const cookieOptions = {
                expires: rememberMe ? 30 : 1, // 30 days if remember me, 1 day otherwise
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict' as const,
                httpOnly: false // We need access from JS for API calls
              }
              
              Cookies.set('authToken', userData.token, cookieOptions)
              Cookies.set('tokenExpiration', userData.tokenExpiration, cookieOptions)
              
              set({ 
                user: userData, 
                isAuthenticated: true, 
                isLoading: false 
              })
            } else {
              throw new Error(data.response?.message || 'Login failed')
            }
          } catch (error) {
            set({ isLoading: false })
            throw error
          }
        },

        logout: () => {
          // Clear cookies
          Cookies.remove('authToken')
          Cookies.remove('tokenExpiration')
          
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false 
          })
        },

        setLoading: (loading: boolean) => set({ isLoading: loading }),

        // checkAuth: () => {
        //   const token = Cookies.get('authToken')
        //   const expiration = Cookies.get('tokenExpiration')
          
        //   if (token && expiration) {
        //     const expirationDate = new Date(expiration)
            
        //     if (expirationDate > new Date()) {
        //       // Token is still valid, but we need to verify with server or restore user data
        //       const storedUser = get().user
        //       if (storedUser) {
        //         set({ isAuthenticated: true })
        //       }
        //     } else {
        //       // Token expired
        //       get().logout()
        //     }
        //   } else {
        //     set({ isAuthenticated: false })
        //   }
          
        //   set({ isLoading: false })
        // },

        checkAuth: () => {
          const currentState = get()
          const token = Cookies.get('authToken')
          const expiration = Cookies.get('tokenExpiration')
          
          if (token && expiration) {
            const expirationDate = new Date(expiration)
            
            if (expirationDate > new Date()) {
              const storedUser = currentState.user
              if (storedUser && !currentState.isAuthenticated) {
                set({ isAuthenticated: true, isLoading: false })
              }
            } else {
              // Token expired
              if (currentState.isAuthenticated) {
                currentState.logout()
              }
            }
          } else {
            if (currentState.isAuthenticated) {
              set({ isAuthenticated: false, isLoading: false })
            }
          }
          
          // Only set loading to false if it's currently true
          if (currentState.isLoading) {
            set({ isLoading: false })
          }
        },

        clearAuth: () => {
          get().logout()
        }
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({ 
          user: state.user 
        }),
      }
    ),
    { name: 'auth-store' }
  )
)