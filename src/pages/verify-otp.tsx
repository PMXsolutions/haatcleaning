import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import FormLayout from "@/components/shared/form-layout";
import { Button } from '@/components/shared/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { apiService } from '@/api/services';
import toast from 'react-hot-toast';

const OtpVerification: React.FC = () => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const email = location.state?.email;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Email not found. Please go back to login.');
      navigate('/login');
      return;
    }

    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      await apiService.verifyOtp({ email, otp });
      toast.success('Email verified successfully!');
      
      // After successful OTP verification, redirect based on role
      const userData = location.state?.userData;
      if (userData?.role === 'Cleaner') {
        navigate('/cleaner');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('OTP verification error:', error);
      toast.error(error?.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) {
    return (
      <FormLayout>
        <div className="bg-white rounded-xl p-8 w-full font-body text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Invalid Access</h2>
          <p className="text-gray-600 mb-6">Please log in first to access this page.</p>
          <Button
            label="Back to Login"
            onClick={() => navigate('/login')}
            variant="primary"
            className="w-full"
          />
        </div>
      </FormLayout>
    );
  }

  return (
    <FormLayout>
      <div className="bg-white rounded-xl p-8 w-full font-body">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-2">
          Verify Your Email
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Enter the 6-digit code sent to <strong>{email}</strong>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button
            type="submit"
            label={isLoading ? "Verifying..." : "Verify OTP"}
            variant="primary"
            disabled={isLoading || otp.length !== 6}
            className="w-full"
          />
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-gold hover:underline text-sm"
          >
            Back to Login
          </button>
        </div>
      </div>
    </FormLayout>
  );
};

export default OtpVerification;