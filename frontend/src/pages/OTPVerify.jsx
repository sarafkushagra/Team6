import { useState } from "react";

export default function OTPVerify() {
  const [otp, setOtp] = useState("");

  return (
    <div className="page">
      <h2>Verify OTP</h2>
      <input
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      <button className="btn" onClick={() => alert("OTP Verified")}>
        Verify
      </button>
    </div>
  );
}
