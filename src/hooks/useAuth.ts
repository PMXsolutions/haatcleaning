import { useEffect } from 'react';
import useAuthStore from '@/stores/useAuthStore';

export const useAuth = () => {
  const store = useAuthStore();
  const checkAuth = useAuthStore(state => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return store;
};