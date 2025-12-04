// src/pages/OTPPickupPage.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function OTPPickupPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [donationId, setDonationId] = useState(null);

  useEffect(() => {
    // Try to get ID from query params or location state
    const params = new URLSearchParams(location.search);
    const id = params.get("donationId");
    if (id) setDonationId(id);
  }, [location]);

  const verifyAndPickup = async () => {
    if (!donationId) return alert("Donation ID missing");
    if (!otp.trim()) return alert("Enter OTP from donor");
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/donations/${donationId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp })
      });
      const data = await res.json();

      if (res.ok) {
        alert("Pickup confirmed! Please deliver to the distribution center.");
        navigate(`/distribution?donationId=${donationId}`);
      } else {
        alert(data.message || "Verification failed");
      }
    } catch (err) {
      console.error(err);
      alert("Pickup failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "12px auto", fontFamily: "system-ui" }}>
      <div style={{ background: "#fff", padding: 12, borderRadius: 10, boxShadow: "0 6px 18px rgba(0,0,0,0.06)" }}>
        <h3>OTP Pickup</h3>
        <div style={{ fontSize: 14, marginBottom: 8 }}>Enter OTP given by donor to verify handover.</div>
        <input
          placeholder="4-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          style={inputStyle}
        />
        <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
          <button onClick={verifyAndPickup} style={btn} disabled={loading}>
            {loading ? "Verifying..." : "Verify & Pickup"}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputStyle = { width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd" };
const btn = { padding: "8px 12px", borderRadius: 8, background: "#2563eb", color: "#fff", border: "none", cursor: "pointer" };
