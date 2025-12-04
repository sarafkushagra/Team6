import React, { useEffect, useState, useRef } from "react";
import { auth, db } from "../firebase";
import {
  query,
  collection,
  where,
  onSnapshot,
  doc,
  updateDoc
} from "firebase/firestore";

export default function ActiveTripPage() {
  const [activeDonation, setActiveDonation] = useState(null);
  const [userLoc, setUserLoc] = useState(null);
  const [insideGeofence, setInsideGeofence] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const watchIdRef = useRef(null);
  const unsubscribeRef = useRef(null);

  const GEOFENCE_METERS = 80;
  const SPEED = 30;

  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        setActiveDonation(null);
        setLoading(false);
        return;
      }
      const q = query(
        collection(db, "donations"),
        where("status", "==", "CLAIMED"),
        where("claimedBy", "==", user.uid)
      );

      if (unsubscribeRef.current) unsubscribeRef.current();

      unsubscribeRef.current = onSnapshot(
        q,
        (snap) => {
          let found = null;
          snap.forEach((s) => {
            const d = { id: s.id, ...s.data() };
            found = d;
          });
          setActiveDonation(found);
          setLoading(false);
        },
        (err) => {
          setError("Could not load active trip.");
          setLoading(false);
        }
      );
    });

    return () => {
      unsubAuth();
      if (unsubscribeRef.current) unsubscribeRef.current();
    };
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) return setError("Location unavailable.");

    const success = (pos) => {
      setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    };
    const err = () => setError("Location access denied.");

    const id = navigator.geolocation.watchPosition(success, err, {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 10000
    });

    watchIdRef.current = id;

    return () => {
      if (watchIdRef.current !== null && navigator.geolocation.clearWatch)
        navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, []);

  useEffect(() => {
    if (!userLoc || !activeDonation || !activeDonation.donorLocation) {
      setInsideGeofence(false);
      return;
    }
    const dist = distanceMeters(
      userLoc.lat,
      userLoc.lng,
      activeDonation.donorLocation.lat,
      activeDonation.donorLocation.lng
    );
    setInsideGeofence(dist <= GEOFENCE_METERS);
  }, [userLoc, activeDonation]);

  const openNav = (lat, lng) => {
    if (!lat || !lng) return alert("Coordinates missing");
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`,
      "_blank"
    );
  };

  const eta = (fromLat, fromLng, toLat, toLng) => {
    if (!fromLat || !toLat) return null;
    const km = distanceKm(fromLat, fromLng, toLat, toLng);
    const hours = km / SPEED;
    return Math.max(1, Math.round(hours * 60));
  };

  const abortClaim = async () => {
    if (!activeDonation) return;
    if (!window.confirm("Cancel this claim?")) return;
    try {
      const dref = doc(db, "donations", activeDonation.id);
      await updateDoc(dref, {
        status: "ACTIVE",
        claimedBy: null,
        claimedAt: null,
        claimExpires: null
      });
      alert("Claim cancelled.");
    } catch (err) {
      alert("Failed to cancel claim.");
    }
  };

  const gotoOtp = () => {
    if (!activeDonation) return;
    window.location.href = `/otp-pickup?donationId=${activeDonation.id}`;
  };

  const gotoDistribution = () => {
    if (!activeDonation?.distributionCenter) return;
    openNav(
      activeDonation.distributionCenter.lat,
      activeDonation.distributionCenter.lng
    );
  };

  if (loading) return <div style={wrap}>Loading active trip…</div>;
  if (error) return <div style={wrapError}>{error}</div>;
  if (!activeDonation)
    return <div style={wrap}>No active trip. Claim a donation first.</div>;

  const distToDonor =
    userLoc &&
    activeDonation.donorLocation &&
    distanceMeters(
      userLoc.lat,
      userLoc.lng,
      activeDonation.donorLocation.lat,
      activeDonation.donorLocation.lng
    );

  const etaToDonor =
    userLoc &&
    activeDonation.donorLocation &&
    eta(
      userLoc.lat,
      userLoc.lng,
      activeDonation.donorLocation.lat,
      activeDonation.donorLocation.lng
    );

  const etaDist =
    userLoc &&
    activeDonation.distributionCenter &&
    eta(
      userLoc.lat,
      userLoc.lng,
      activeDonation.distributionCenter.lat,
      activeDonation.distributionCenter.lng
    );

  return (
    <div style={container}>
      <div style={card}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3>Active Trip</h3>
          <div style={badge}>{activeDonation.status}</div>
        </div>

        <div style={{ marginTop: 10, fontWeight: 700 }}>
          {activeDonation.foodType}{" "}
          {activeDonation.quantityKg ? `• ${activeDonation.quantityKg}kg` : ""}
        </div>

        <div style={{ color: "#555", marginTop: 6 }}>
          Donor: {activeDonation.donorName}
        </div>

        <div style={{ color: "#666", marginTop: 6 }}>
          {activeDonation.donorLocation?.address}
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button
            style={btn}
            onClick={() =>
              openNav(
                activeDonation.donorLocation.lat,
                activeDonation.donorLocation.lng
              )
            }
          >
            Navigate to Donor
          </button>

          <button
            style={{ ...btn, background: insideGeofence ? "#16a34a" : "#2563eb" }}
            onClick={gotoOtp}
          >
            {insideGeofence ? "Reached — Verify OTP" : "Verify OTP"}
          </button>

          <button style={{ ...btn, background: "#ef4444" }} onClick={abortClaim}>
            Abort
          </button>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <div style={infoBox}>
            <div style={{ fontSize: 12, color: "#666" }}>Distance</div>
            <div style={{ fontWeight: 700 }}>
              {distToDonor != null ? formatDistance(distToDonor) : "--"}
            </div>
          </div>

          <div style={infoBox}>
            <div style={{ fontSize: 12, color: "#666" }}>ETA</div>
            <div style={{ fontWeight: 700 }}>
              {etaToDonor != null ? `${etaToDonor} min` : "--"}
            </div>
          </div>

          <div style={infoBox}>
            <div style={{ fontSize: 12, color: "#666" }}>Geofence</div>
            <div style={{ fontWeight: 700 }}>
              {insideGeofence ? "Inside" : "Outside"}
            </div>
          </div>
        </div>

        {activeDonation.distributionCenter && (
          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 13, color: "#666" }}>Distribution center:</div>
            <div style={{ fontWeight: 700 }}>
              {activeDonation.distributionCenter.address}
            </div>
            <button
              style={{ ...btn, background: "#0ea5e9", marginTop: 8 }}
              onClick={gotoDistribution}
            >
              Navigate to Distribution
            </button>
            <div style={{ fontSize: 13, color: "#444", marginTop: 6 }}>
              {etaDist ? `${etaDist} min approx` : ""}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function distanceMeters(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lat2) return null;
  const R = 6371e3;
  const p1 = (lat1 * Math.PI) / 180;
  const p2 = (lat2 * Math.PI) / 180;
  const dp = ((lat2 - lat1) * Math.PI) / 180;
  const dl = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dp / 2) ** 2 +
    Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function distanceKm(lat1, lon1, lat2, lon2) {
  const m = distanceMeters(lat1, lon1, lat2, lon2);
  return m == null ? null : m / 1000;
}

function formatDistance(m) {
  if (m == null) return "--";
  if (m < 1000) return `${Math.round(m)} m`;
  return `${(m / 1000).toFixed(2)} km`;
}

const container = {
  maxWidth: 520,
  margin: "14px auto",
  fontFamily: "system-ui",
  padding: 8
};
const card = {
  background: "#fff",
  padding: 14,
  borderRadius: 12,
  boxShadow: "0 8px 24px rgba(0,0,0,0.08)"
};
const badge = {
  background: "#fde68a",
  color: "#92400e",
  padding: "6px 8px",
  borderRadius: 8,
  fontWeight: 700,
  fontSize: 12
};
const btn = {
  padding: "8px 12px",
  borderRadius: 8,
  border: "none",
  background: "#2563eb",
  color: "#fff",
  cursor: "pointer"
};
const infoBox = {
  minWidth: 110,
  background: "#f3f4f6",
  padding: 8,
  borderRadius: 8,
  textAlign: "center"
};
const wrap = {
  maxWidth: 520,
  margin: "24px auto",
  fontFamily: "system-ui",
  padding: 12,
  color: "#444"
};
const wrapError = { ...wrap, color: "#b91c1c" };
