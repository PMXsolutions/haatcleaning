import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { User, LoginResponse, LoginRequest } from "@/types/auth";
import storageUtil from "@/lib/storage";
import axiosInstance from '@/api/axiosConfig';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  checkAuth: () => void;
  clearAuth: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: true,

      login: async (email: string, password: string, rememberMe: boolean) => {
        try {
          set({ isLoading: true });

          const loginData: LoginRequest = { email, password, rememberMe };
          const response = await axiosInstance.post<LoginResponse>('/Account/auth_login', loginData);
          const data = response.data;

          if (data.response?.status === 'Success' && data.userProfile) {
            const userData = data.userProfile;

            // Store auth token and expiration
            storageUtil.setItem('authToken', userData.token);
            storageUtil.setItem('tokenExpiration', userData.tokenExpiration);

            set({
              isAuthenticated: true,
              user: userData,
              token: userData.token,
              isLoading: false
            });
          } else {
            throw new Error(data.response?.message || 'Login failed');
          }
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        // Clear storage
        storageUtil.removeItem('authToken');
        storageUtil.removeItem('tokenExpiration');
        storageUtil.removeItem('auth-storage');

        set({
          isAuthenticated: false,
          user: null,
          token: null,
          isLoading: false
        });
      },

      setLoading: (loading: boolean) => set({ isLoading: loading }),

      checkAuth: () => {
        const currentState = get();
        const token = storageUtil.getItem('authToken');
        const expiration = storageUtil.getItem('tokenExpiration');

        if (token && expiration) {
          const expirationDate = new Date(expiration);

          if (expirationDate > new Date()) {
            // Token is valid, restore authentication state
            const storedUser = currentState.user;
            if (storedUser) {
              set({ 
                isAuthenticated: true, 
                token: token,
                isLoading: false 
              });
            } else {
              // User data not in persisted state, but token exists - logout to be safe
              get().logout();
            }
          } else {
            // Token expired
            get().logout();
          }
        } else {
          // No token found, ensure user is logged out
          set({ 
            isAuthenticated: false, 
            user: null, 
            token: null, 
            isLoading: false 
          });
        }
      },

      clearAuth: () => {
        get().logout();
      }
    }),
    {
      name: "auth-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => storageUtil),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);

export default useAuthStore;