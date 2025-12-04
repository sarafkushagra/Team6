import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ClaimModal() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleConfirm = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/donations/${id}/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();

      if (res.ok) {
        // Navigate to active trip with the ID
        navigate(`/active-trip?donationId=${id}`);
      } else {
        alert("Claim failed: " + data.message);
      }
    } catch (err) {
      console.error("claim failed", err);
      alert("Claim failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-xl max-w-sm w-full shadow-2xl">
        <h3 className="text-xl font-bold mb-4">Confirm Claim?</h3>
        <p className="mb-6 text-gray-600">Are you sure you want to claim this donation? You must pick it up within 1 hour.</p>
        <div className="flex gap-4">
          <button onClick={() => navigate(-1)} className="flex-1 py-3 bg-gray-100 rounded-xl font-semibold hover:bg-gray-200">Cancel</button>
          <button onClick={handleConfirm} className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700">Confirm</button>
        </div>
      </div>
    </div>
  );
}
