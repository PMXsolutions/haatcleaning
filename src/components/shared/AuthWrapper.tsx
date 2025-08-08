import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface AuthWrapperProps {
  children: React.ReactNode;
  mode: "auth" | "protected"; // auth: login/signup pages, protected: dashboard pages
  redirectTo?: string; // custom redirect path
}

export default function AuthWrapper({ 
  children, 
  mode, 
  redirectTo 
}: AuthWrapperProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (mode === "auth" && isAuthenticated) {
        // User is authenticated, redirect away from auth pages
        navigate(redirectTo || '/dashboard', { replace: true });
      } else if (mode === "protected" && !isAuthenticated) {
        // User is not authenticated, redirect to login
        navigate(redirectTo || '/login', { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, mode, navigate, redirectTo]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render children until auth check is complete
  if (mode === "auth" && isAuthenticated) {
    return null; // Will redirect, so don't render anything
  }

  if (mode === "protected" && !isAuthenticated) {
    return null; // Will redirect, so don't render anything
  }

  return <>{children}</>;
}