// src/pages/ActiveTripPage.jsx
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { query, collection, where, onSnapshot } from "firebase/firestore";

// expects donation doc claimedBy=user.uid and status = "CLAIMED"
// donation should have donorLocation {lat,lng,address} and distributionCenter {lat,lng,address} (optional)

export default function ActiveTripPage() {
  const [activeDonation, setActiveDonation] = useState(null);
  const [userLoc, setUserLoc] = useState(null);
  const [nearbyCheck, setNearbyCheck] = useState(false);

  useEffect(() => {
    // subscribe to claimed donation for current user
    const unsub = onSnapshot(query(collection(db, "donations"), where("status", "==", "CLAIMED")), (snap) => {
      const u = auth.currentUser;
      if (!u) return setActiveDonation(null);
      let found = null;
      snap.forEach((s) => {
        const d = { id: s.id, ...s.data() };
        if (d.claimedBy === u.uid) found = d;
      });
      setActiveDonation(found);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    // get user location periodically
    let id;
    const getPos = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (p) => setUserLoc({ lat: p.coords.latitude, lng: p.coords.longitude }),
          (err) => console.warn("loc err", err),
          { enableHighAccuracy: true }
        );
      }
    };
    getPos();
    id = setInterval(getPos, 8000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!userLoc || !activeDonation || !activeDonation.donorLocation) { setNearbyCheck(false); return; }
    const dist = distanceKm(userLoc.lat, userLoc.lng, activeDonation.donorLocation.lat, activeDonation.donorLocation.lng);
    setNearbyCheck(dist <= 0.08); // ~80m geofence
  }, [userLoc, activeDonation]);

  const openNav = (lat, lng) => window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank");

  const gotoOtp = () => {
    // navigate to OTP pickup page in your app (router) — here we just open OTP component route assuming router handles it
    window.location.href = `/otp-pickup?donationId=${activeDonation.id}`;
  };

  if (!activeDonation) return <div style={{padding:12}}>No active trip. Claim a donation first.</div>;

  return (
    <div style={{maxWidth:420, margin:"12px auto", fontFamily:"system-ui"}}>
      <div style={{background:"#fff", padding:12, borderRadius:10, boxShadow:"0 6px 18px rgba(0,0,0,0.06)"}}>
        <h3>Active Trip</h3>
        <div style={{fontWeight:700}}>{activeDonation.foodType} • {activeDonation.quantityKg ? `${activeDonation.quantityKg}kg`:""}</div>
        <div style={{color:"#555"}}>Donor: {activeDonation.donorName}</div>
        <div style={{marginTop:8}}>{activeDonation.donorLocation?.address}</div>

        <div style={{display:"flex", gap:8, marginTop:12}}>
          <button onClick={() => openNav(activeDonation.donorLocation.lat, activeDonation.donorLocation.lng)} style={btn}>Navigate to Donor</button>
          <button onClick={() => gotoOtp()} style={{...btn, background: nearbyCheck ? "#16a34a" : "#2563eb"}}>
            {nearbyCheck ? "Reached — Verify OTP" : "Mark Reached / Verify OTP"}
          </button>
        </div>

        {activeDonation.distributionCenter && (
          <div style={{marginTop:12}}>
            <div style={{fontSize:13, color:"#666"}}>After pickup, deliver to:</div>
            <div style={{fontWeight:600}}>{activeDonation.distributionCenter.address}</div>
            <div style={{marginTop:6}}>
              <button onClick={() => openNav(activeDonation.distributionCenter.lat, activeDonation.distributionCenter.lng)} style={btn}>Navigate to Distribution</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// small haversine
function distanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lat2) return Infinity;
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI)/180;
  const dLon = ((lon2 - lon1) * Math.PI)/180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  const c = 2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R*c;
}

const btn = { padding:"8px 10px", borderRadius:8, border:"none", background:"#2563eb", color:"#fff", cursor:"pointer" };
