import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

export default function ActiveTripPage() {
  const [searchParams] = useSearchParams();
  const donationId = searchParams.get('donationId');

  return (
    <div className="p-6 text-center max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Navigating to Pickup...</h2>
      <div className="h-64 bg-gray-200 rounded-xl mb-6 flex items-center justify-center relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&auto=format&fit=crop&q=60"
          alt="Map"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-white/90 px-4 py-2 rounded-full shadow-lg font-bold text-blue-600 animate-pulse">
            Driving... 🚗
          </span>
        </div>
      </div>
      <p className="text-gray-600 mb-6">You are on your way to the donor.</p>
      <Link
        to={`/otp-pickup?donationId=${donationId}`}
        className="block w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
      >
        Arrived at Location
      </Link>
    </div>
  );
}
