import React from 'react';
import { Link } from 'react-router-dom';

export default function DonationPosted() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 text-4xl">
        ✅
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Donation Posted!</h2>
      <p className="text-gray-500 mb-8">Volunteers nearby have been notified.</p>
      <Link to="/donor" className="px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold">
        Back to Dashboard
      </Link>
    </div>
  );
}
