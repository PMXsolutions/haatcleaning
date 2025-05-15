import { Button } from '@/components/shared/button';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrors('Please enter a valid email.');
      return;
    }

    if (password.length < 6) {
      setErrors('Password must be at least 6 characters.');
      return;
    }

    // Handle login logic here
    // console.log('Logging in with:', { email, password });
  };

  return (
    <div className="h-[80vh] flex items-center justify-center bg-gold px-4">
      <div className="w-[430px] bg-white rounded-2xl shadow-lg pt-8 px-6 pb-6">
        <h2 className="text-gold text-3xl font-semibold text-center font-heading mb-6">Login</h2>

        {errors && (
          <p className="text-red-600 text-sm text-center mb-4">{errors}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 font-text">
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border-b-2 border-gray-300 outline-none focus:border-[#8A7C3D] placeholder-gray-400"
          />
          <input
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border-b-2 border-gray-300 outline-none focus:border-[#8A7C3D] placeholder-gray-400"
          />

          {/* <div className="text-right">
            <a href="#" className="text-yellow-600 hover:underline text-sm">
              Forgot Password?
            </a>
          </div> */}

          <Button
            label="Login"
            variant="primary"
            className="w-full p-3 mt-4 bg-gold text-white rounded-full text-lg font-medium hover:opacity-90 transition"
          />

          {/* sign up link */}
          <div className="text-center mt-4">
            <p className="text-primary text-sm font-text">
              Don't have an account?{" "}
              <Link to="/signUp" className="text-gold hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>

          {/* <button
            type="submit"
            className="w-full p-3 bg-gold text-white rounded-full text-lg font-medium hover:opacity-90 transition"
          >
            Login
          </button> */}
        </form>
      </div>
    </div>
  );
};

export default Login;
