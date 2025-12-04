// src/pages/OTPPickupPage.jsx
import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Expected: donation doc contains `otp` (demo) or server should verify OTP.
// After successful OTP verify, update status -> PICKED_UP and create pickupProof array with photo urls.

export default function OTPPickupPage({ donationId }) {
  const [donation, setDonation] = useState(null);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!donationId) return;
    (async () => {
      const snap = await getDoc(doc(db, "donations", donationId));
      if (snap.exists()) setDonation({ id: snap.id, ...snap.data() });
    })();
  }, [donationId]);

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const verifyAndPickup = async () => {
    if (!donation) return alert("Donation missing");
    if (!otp.trim()) return alert("Enter OTP from donor");
    setLoading(true);
    try {
      // DEMO verify: compare with donation. In prod call backend API.
      if (!donation.otp) throw new Error("OTP not set for this donation (demo)");
      if (otp.trim() !== donation.otp.toString().trim()) throw new Error("Incorrect OTP");

      // upload photo if provided
      let photoURL = null;
      if (file) {
        const storageRef = ref(storage, `pickupProof/${donation.id}/${Date.now()}-${file.name}`);
        const snap = await uploadBytes(storageRef, file);
        photoURL = await getDownloadURL(snap.ref);
      }

      // update doc
      const dRef = doc(db, "donations", donation.id);
      await updateDoc(dRef, {
        status: "PICKED_UP",
        pickedUpAt: new Date().toISOString(),
        pickupBy: auth.currentUser.uid,
        pickupProof: photoURL ? [photoURL] : []
      });

      alert("Pickup confirmed. Now deliver to distribution center and mark Distributed.");
      window.location.href = `/distribution?donationId=${donation.id}`;
    } catch (err) {
      console.error(err);
      alert("Pickup failed: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  if (!donation) return <div style={{padding:12}}>Loading donation...</div>;

  return (
    <div style={{maxWidth:420, margin:"12px auto", fontFamily:"system-ui"}}>
      <div style={{background:"#fff", padding:12, borderRadius:10, boxShadow:"0 6px 18px rgba(0,0,0,0.06)"}}>
        <h3>OTP Pickup</h3>
        <div style={{fontSize:14, marginBottom:8}}>Enter OTP given by donor to verify handover.</div>
        <input placeholder="6-digit OTP" value={otp} onChange={(e)=>setOtp(e.target.value)} style={inputStyle} />
        <div style={{marginTop:8}}>
          <label style={{fontSize:13}}>Take a quick photo (optional but recommended)</label>
          <input type="file" accept="image/*" onChange={onFileChange} style={{marginTop:6}} />
          {preview && <img src={preview} alt="preview" style={{width:120, height:120, objectFit:"cover", borderRadius:8, marginTop:8}} />}
        </div>
        <div style={{marginTop:10, display:"flex", gap:8}}>
          <button onClick={verifyAndPickup} style={btn} disabled={loading}>{loading ? "Verifying..." : "Verify & Pickup"}</button>
        </div>
      </div>
    </div>
  );
}

const inputStyle = { width:"100%", padding:"10px 12px", borderRadius:8, border:"1px solid #ddd" };
const btn = { padding:"8px 12px", borderRadius:8, background:"#2563eb", color:"#fff", border:"none", cursor:"pointer" };
