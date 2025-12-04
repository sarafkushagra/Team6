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

  // close when clicking overlay (but not when clicking inside modal); prevent close during loading
  const onOverlayClick = (e) => {
    if (loading) return;
    if (e.target === e.currentTarget) onClose && onClose();
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

        {error && (
          <div className="mt-4 p-3 rounded-md bg-red-50 border border-red-100 text-red-700 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 p-3 rounded-md bg-green-50 border border-green-100 text-green-800 text-sm">
            {success}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="text-xs text-green-700/90">Pickup window</div>
            <div className="mt-1 text-xl font-mono text-green-900">{formatTime(countdown)}</div>
            <div className="mt-2 text-xs text-slate-600">Bring a valid ID. Share OTP with donor only at pickup.</div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <button
              onClick={confirmClaim}
              disabled={loading}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm text-white font-medium transition ${loading ? "opacity-60 cursor-not-allowed" : "bg-gradient-to-br from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"}`}
            >
              {loading ? (
                <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="3" strokeOpacity="0.25" />
                  <path d="M22 12a10 10 0 00-10-10" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M5 12h14" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                  <path d="M12 5v14" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
              <span>{loading ? "Claiming..." : "Confirm & Claim"}</span>
            </button>

            <button
              onClick={onClose}
              disabled={loading}
              className="px-3 py-2 rounded-lg bg-white border border-green-200 text-green-800 text-sm hover:bg-green-50 disabled:opacity-60"
            >
              Cancel
            </button>
          </div>
        </div>

        <div className="mt-4 text-xs text-slate-500">By claiming you agree to pick up within the time window and follow donor instructions.</div>

        {/* loading overlay to prevent accidental interactions */}
        {loading && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-2xl">
            <div className="flex items-center gap-2 text-sm text-green-900">
              <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#064e3b" strokeWidth="3" strokeOpacity="0.25" />
                <path d="M22 12a10 10 0 00-10-10" stroke="#064e3b" strokeWidth="3" strokeLinecap="round" />
              </svg>
              Processing…
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
