import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';

export default function DistributionPage() {
  const [searchParams] = useSearchParams();
  const donationId = searchParams.get('donationId');

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Distribution</h2>
      <p className="mb-6 text-gray-600">Donation ID: {donationId}</p>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
        <h3 className="font-semibold text-lg mb-2">Upload Proof</h3>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4">
          <p className="text-gray-500">Tap to take photo of distribution</p>
        </div>
        <Link to="/volunteer" className="block w-full py-3 bg-emerald-600 text-white rounded-xl font-bold">
          Complete & Finish
        </Link>
      </div>
    </div>
  );
}
