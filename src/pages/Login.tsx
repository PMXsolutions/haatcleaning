import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FormLayout from "@/components/shared/form-layout"
import GoogleSignInButton from "@/components/shared/google-button"
import FormInput from "@/components/shared/form-input"

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: { [key: string]: string } = {}

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Handle login logic
    // console.log('Logging in with:', { email, password });

  };
  
  const handleGoogleSignIn = () => {
    // Handle Google sign-in logic
    console.log("Google sign-in clicked")
  }

  return (
    <FormLayout>
      <div className="bg-white rounded-xl p-8 w-full font-body">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-8">Login</h2>

        <div className="space-y-6">
          <GoogleSignInButton onClick={handleGoogleSignIn} />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">OR</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              label="Email Address"
              required
            />

            <FormInput
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              label="Password"
              required
            />

            <div className="pt-2">
              <button
                type="submit"
                className="w-full px-6 py-2 font-medium transition-all duration-300 border border-color cursor-pointer rounded-lg flex items-center justify-center gap-2 bg-gold hover:bg-white text-white hover:text-gold"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>

      </div>

      <div className="mt-6 text-center">
        <div className="bg-white rounded-full px-8 py-3 w-fit mx-auto">
          <span className="text-gray-600 text-sm">
            {"Don't have an account? "}
            <Link to="/signup" className="text-gold hover:underline font-medium">
              Sign up
            </Link>
          </span>
        </div>
      </div>
    </FormLayout>
  );
};

export default Login;
