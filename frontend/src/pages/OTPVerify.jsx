import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OTPVerify() {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock OTP verification
    if (otp === '1234') {
      alert('OTP verified! Proceed to pickup.');
      navigate('/pickup/1');
    } else {
      alert('Invalid OTP');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl mb-4">Verify OTP</h2>
        <p className="mb-4">Enter the OTP sent to the donor: 1234</p>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          required
          className="w-full p-2 mb-4 border"
        />
        <button type="submit" className="w-full bg-green-500 text-white p-2">Verify</button>
      </form>
    </div>
  );
}
