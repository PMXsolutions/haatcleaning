// Login.tsx - Fixed version with proper role handling
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import FormLayout from "@/components/shared/form-layout";
import FormInput from "@/components/shared/form-input";

// Define role constants to avoid magic strings
const ROLES = {
  CLEANER: 'Cleaner',
  GLOBAL_ADMIN: 'GlobalAdmin',
  // ADMIN: 'Admin',
  // Add other roles as needed
} as const;

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <FormLayout>
        <div className="bg-white rounded-xl p-8 w-full font-body flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto mb-4"></div>
            <p className="text-gray-600">Checking authentication...</p>
          </div>
        </div>
      </FormLayout>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    const newErrors: { [key: string]: string } = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const userData = await login(email, password, rememberMe);
      
      // Handle role-based navigation
      switch (userData.role) {
        case ROLES.CLEANER:
          navigate('/cleaner');
          break;
        case ROLES.GLOBAL_ADMIN:
        // case ROLES.ADMIN:
          navigate('/dashboard');
          break;
        default:
          // Default to dashboard for unknown roles
          console.warn(`Unknown role: ${userData.role}`);
          navigate('/dashboard');
          break;
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Type guard to check if error has axios response structure
      const isAxiosError = (err: unknown): err is {
        response?: {
          data?: {
            message?: string;
            user?: unknown;
          };
          status?: number;
        };
      } => {
        return typeof err === 'object' && err !== null && 'response' in err;
      };

      if (isAxiosError(error)) {
        const { response } = error;
        
        // Check if the error is about unverified email
        if (response?.data?.message?.includes('verify') || 
            response?.data?.message?.includes('OTP') ||
            response?.status === 403) {
          // Redirect to OTP verification page
          navigate('/verify-otp', { 
            state: { 
              email,
              userData: response?.data?.user 
            } 
          });
        } else {
          setErrors({ 
            general: response?.data?.message || 'Invalid email or password. Please try again.' 
          });
        }
      } else {
        // Handle non-axios errors
        setErrors({ 
          general: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.' 
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormLayout>
      <div className="bg-white rounded-xl p-8 w-full font-body">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-8">Login</h2>

        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="on">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {errors.general}
              </div>
            )}

            <FormInput
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              label="Email Address"
              required
              autoComplete="email"
              name="email"
              id="email"
            />

            <FormInput
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              label="Password"
              required
              autoComplete="current-password"
              name="password"
              id="password"
            />

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-gold focus:ring-gold border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-gold hover:text-gold/80 transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-2 font-medium transition-all duration-300 border border-color cursor-pointer rounded-lg flex items-center justify-center gap-2 bg-gold hover:bg-white text-white hover:text-gold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* <div className="mt-6 text-center">
        <div className="bg-white rounded-full px-8 py-3 w-fit mx-auto">
          <span className="text-gray-600 text-sm">
            {"Don't have an account? "}
            <Link to="/signup" className="text-gold hover:underline font-medium">
              Sign up
            </Link>
          </span>
        </div>
      </div> */}
    </FormLayout>
  );
};

export default Login;