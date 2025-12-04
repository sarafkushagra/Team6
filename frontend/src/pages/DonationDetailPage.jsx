import React from 'react';
import { useParams, Link } from 'react-router-dom';

export default function DonationDetailPage() {
  const { id } = useParams();
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Donation Details</h2>
      <p>ID: {id}</p>
      <Link to={`/claim/${id}`} className="mt-4 inline-block px-6 py-2 bg-emerald-600 text-white rounded-lg">
        Claim This Donation
      </Link>
    </div>
  );
}
