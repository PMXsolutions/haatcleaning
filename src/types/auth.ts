
export interface User {
  userId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  role: string;
  token: string;
  tokenExpiration: string;
}

export interface LoginResponse {
  response: {
    status: string;
    message: string;
  };
  userProfile: User;
  claims: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}