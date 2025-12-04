// src/components/ClaimModal.jsx
import React, { useState } from "react";
import { doc, runTransaction } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function ClaimModal({ donationId, onClose }) {
  const [loading, setLoading] = useState(false);

  const confirmClaim = async () => {
    const user = auth.currentUser;
    if (!user) return alert("Login required");
    if (!window.confirm("Confirm claim? You will have limited time to pickup.")) return;
    setLoading(true);
    try {
      const donationRef = doc(db, "donations", donationId);
      await runTransaction(db, async (t) => {
        const ds = await t.get(donationRef);
        if (!ds.exists()) throw new Error("Donation removed");
        const data = ds.data();
        if (data.status !== "ACTIVE") throw new Error("Already claimed / not active");
        // set as claimed, store claimedBy & claimExpires
        const claimExpires = new Date(Date.now() + (30 * 60 * 1000)).toISOString(); // 30 min window
        t.update(donationRef, {
          status: "CLAIMED",
          claimedBy: user.uid,
          claimedAt: new Date().toISOString(),
          claimExpires
        });
      });
      alert("Claim successful — go pickup!");
      onClose && onClose();
    } catch (err) {
      console.error("Claim error", err);
      alert("Claim failed: " + (err.message || err));
      setLoading(false);
    }
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <h3>Confirm Claim</h3>
        <p>You will have 30 minutes to reach the donor. OTP will be used at pickup for verification.</p>
        <div style={{display:"flex", gap:8, marginTop:12}}>
          <button onClick={confirmClaim} style={{padding:"8px 10px", background:"#2563eb", color:"#fff", borderRadius:8}} disabled={loading}>
            {loading ? "Claiming..." : "Confirm & Claim"}
          </button>
          <button onClick={onClose} style={{padding:"8px 10px"}}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

const overlay = { position:"fixed", left:0, top:0, right:0, bottom:0, background:"rgba(0,0,0,0.4)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:999 };
const modal = { background:"#fff", padding:16, borderRadius:8, width:360, boxShadow:"0 8px 28px rgba(0,0,0,0.2)" };
