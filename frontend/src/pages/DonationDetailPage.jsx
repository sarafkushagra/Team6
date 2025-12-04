// src/pages/DonationDetailPage.jsx
import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import ClaimModal from "../components/ClaimModal";

// Expected donation doc fields:
// donorName, donorPhone, donorLocation: {lat,lng,address}, imageUrl, foodType, quantityKg, bestBefore, status

function timeLeftStr(bestBefore) {
  if (!bestBefore) return "—";
  const sec = Math.max(0, Math.floor((new Date(bestBefore).getTime() - Date.now())/1000));
  if (sec <= 0) return "Expired";
  if (sec < 60) return `${sec}s left`;
  if (sec < 3600) return `${Math.floor(sec/60)}m left`;
  return `${Math.floor(sec/3600)}h ${Math.floor((sec%3600)/60)}m`;
}

export default function DonationDetailPage({ donationId }) {
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showClaim, setShowClaim] = useState(false);

  useEffect(() => {
    if (!donationId) return;
    let active = true;
    (async () => {
      setLoading(true);
      const ref = doc(db, "donations", donationId);
      const snap = await getDoc(ref);
      if (!active) return;
      if (!snap.exists()) {
        setDonation(null);
      } else {
        setDonation({ id: snap.id, ...snap.data() });
      }
      setLoading(false);
    })();
    return ()=> (active = false);
  }, [donationId]);

  const openMaps = (lat, lng) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, "_blank");
  };

  if (loading) return <div style={{padding:12}}>Loading...</div>;
  if (!donation) return <div style={{padding:12}}>Donation not found</div>;

  return (
    <div style={{maxWidth:420, margin:"12px auto", fontFamily:"system-ui"}}>
      <div style={{background:"#fff", padding:14, borderRadius:10, boxShadow:"0 6px 18px rgba(0,0,0,0.06)"}}>
        {donation.imageUrl && <img src={donation.imageUrl} alt="food" style={{width:"100%", height:220, objectFit:"cover", borderRadius:8}} />}
        <h2 style={{marginTop:10}}>{donation.foodType || "Food"} {donation.quantityKg ? `• ${donation.quantityKg}kg` : ""}</h2>
        <div style={{color:"#444"}}>Donor: {donation.donorName || "—"}</div>
        <div style={{marginTop:8, color:"#222", fontWeight:700}}>Time left: {timeLeftStr(donation.bestBefore)}</div>
        <div style={{marginTop:8, color:"#555"}}>{donation.donorLocation?.address || "Address not provided"}</div>

        <div style={{display:"flex", gap:8, marginTop:12}}>
          <button onClick={() => openMaps(donation.donorLocation?.lat, donation.donorLocation?.lng)} style={btnStyle}>Navigate</button>
          <a href={`tel:${donation.donorPhone || ""}`} style={{textDecoration:"none"}}><button style={btnStyle}>Call</button></a>
          <button onClick={() => setShowClaim(true)} style={{...btnStyle, background:"#2563eb", color:"#fff"}} disabled={donation.status !== "ACTIVE"}>
            {donation.status === "ACTIVE" ? "Claim" : donation.status}
          </button>
        </div>

        <div style={{marginTop:10, fontSize:13, color:"#666"}}>Status: {donation.status}</div>
        <div style={{marginTop:8}}>
          <small style={{color:"#888"}}>Report suspicious / spoiled food using the report option in the list.</small>
        </div>
      </div>

      {showClaim && <ClaimModal donationId={donation.id} onClose={() => { setShowClaim(false); window.location.reload(); }} />}
    </div>
  );
}

const btnStyle = { padding:"8px 10px", borderRadius:8, border:"1px solid #ddd", background:"#f3f4f6", cursor:"pointer" };
