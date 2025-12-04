// src/pages/HomeMapListPage.jsx
import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { auth, db } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  runTransaction,
  updateDoc
} from "firebase/firestore";

const styles = {
  container: { maxWidth: 420, margin: "8px auto", fontFamily: "system-ui, Roboto, Arial" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  card: { background: "#fff", padding: 12, borderRadius: 10, boxShadow: "0 6px 18px rgba(0,0,0,0.06)", marginBottom: 10 },
  bottomSheet: { position: "fixed", left: 0, right: 0, bottom: 0, maxWidth: 420, margin: "0 auto", padding: 8 },
  listContainer: { maxHeight: 320, overflowY: "auto" },
  btn: { padding: "8px 12px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" },
  small: { fontSize: 13, color: "#555" },
  radiusSelect: { padding: 8, borderRadius: 8, border: "1px solid #ddd" }
};

// small custom marker (fix missing icon issue)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png"
});

// helper: haversine distance (km)
function distanceKm(lat1, lon1, lat2, lon2) {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return Infinity;
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// small map-centering component when coords available
function Recenter({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) map.setView([lat, lng], 14);
  }, [lat, lng, map]);
  return null;
}

export default function HomeMapListPage() {
  const [userLoc, setUserLoc] = useState({ lat: null, lng: null });
  const [donations, setDonations] = useState([]); // all active donations from Firestore
  const [radiusKm, setRadiusKm] = useState(5);
  const [available, setAvailable] = useState(true);
  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState(null);
  const unsubRef = useRef(null);

  useEffect(() => {
    // get current user location (browser)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => {
          console.warn("loc err", err);
          // fallback: no location; user can still use map
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }

    // listen to active donations
    const q = query(collection(db, "donations"), where("status", "==", "ACTIVE"));
    const unsub = onSnapshot(q, (snap) => {
      const arr = [];
      snap.forEach((docSnap) => {
        const d = { id: docSnap.id, ...docSnap.data() };
        // ensure lat/lng numbers if nested as location
        if (d.donorLocation && d.donorLocation.lat && d.donorLocation.lng) {
          d.lat = d.donorLocation.lat;
          d.lng = d.donorLocation.lng;
        }
        arr.push(d);
      });
      setDonations(arr);
      setLoading(false);
    }, (err) => {
      console.error("donations snapshot err", err);
      setLoading(false);
    });
    unsubRef.current = unsub;
    return () => unsub && unsub();
  }, []);

  // derived: donations within radius sorted by distance & time-left
  const nearby = donations
    .map((d) => {
      const dist = distanceKm(userLoc.lat, userLoc.lng, d.lat, d.lng);
      const timeLeftSec = d.bestBefore ? Math.max(0, Math.floor((new Date(d.bestBefore).getTime() - Date.now()) / 1000)) : null;
      return { ...d, distanceKm: dist, timeLeftSec };
    })
    .filter((d) => d.distanceKm <= radiusKm)
    .filter((d) => !filterText || (d.foodType || "").toLowerCase().includes(filterText.toLowerCase()))
    .sort((a, b) => {
      // prioritize by timeLeft ascending then distance
      const ta = a.timeLeftSec ?? 9999999;
      const tb = b.timeLeftSec ?? 9999999;
      if (ta !== tb) return ta - tb;
      return a.distanceKm - b.distanceKm;
    });

  // claim donation via Firestore transaction to avoid race
  const claimDonation = async (donationId) => {
    const user = auth.currentUser;
    if (!user) return alert("Login first (OTP onboarding)");
    setClaimingId(donationId);
    try {
      const donationRef = doc(db, "donations", donationId);
      await runTransaction(db, async (t) => {
        const docSnap = await t.get(donationRef);
        if (!docSnap.exists()) throw new Error("Donation not found");
        const data = docSnap.data();
        if (data.status !== "ACTIVE") throw new Error("Already claimed or not active");
        // lock it
        t.update(donationRef, {
          status: "CLAIMED",
          claimedBy: user.uid,
          claimedAt: new Date().toISOString()
        });
      });
      alert("Claimed successfully! Check your Active trips.");
    } catch (err) {
      console.error("claim failed", err);
      alert("Claim failed: " + (err.message || err));
    } finally {
      setClaimingId(null);
    }
  };

  const openInMaps = (lat, lng) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, "_blank");
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Nearby Donations</h2>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <label style={styles.small}>Radius</label>
          <select
            value={radiusKm}
            onChange={(e) => setRadiusKm(parseInt(e.target.value))}
            style={styles.radiusSelect}
          >
            <option value={2}>2 km</option>
            <option value={5}>5 km</option>
            <option value={10}>10 km</option>
            <option value={20}>20 km</option>
          </select>
          <button
            onClick={() => setAvailable(!available)}
            style={{ ...styles.btn, background: available ? "#16a34a" : "#ef4444" }}
            title="Toggle availability"
          >
            {available ? "Available" : "Away"}
          </button>
        </div>
      </div>

      <div style={{ height: 380, borderRadius: 10, overflow: "hidden", marginBottom: 8 }}>
        <MapContainer center={[userLoc.lat || 20, userLoc.lng || 77]} zoom={13} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {userLoc.lat && userLoc.lng && <Recenter lat={userLoc.lat} lng={userLoc.lng} />}
          {userLoc.lat && userLoc.lng && (
            <Marker position={[userLoc.lat, userLoc.lng]}>
              <Popup>You are here</Popup>
            </Marker>
          )}

          {nearby.map((d) => (
            <Marker key={d.id} position={[d.lat, d.lng]}>
              <Popup>
                <div style={{ minWidth: 220 }}>
                  <strong>{d.donorName || "Donor"}</strong>
                  <div style={{ fontSize: 13 }}>{d.address || d.donorLocation?.address || ""}</div>
                  <div style={{ marginTop: 6 }}>
                    <div style={{ fontSize: 13 }}>{d.foodType} — {d.quantityKg ? `${d.quantityKg} kg` : ""}</div>
                    <div style={{ fontSize: 12, color: "#444" }}>{d.timeLeftSec != null ? `${Math.floor(d.timeLeftSec/60)}m left` : ""}</div>
                  </div>
                  <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                    <button className="btn" style={{ padding: "6px 8px" }} onClick={() => openInMaps(d.lat, d.lng)}>Navigate</button>
                    <button className="btn" style={{ padding: "6px 8px" }} onClick={() => claimDonation(d.id)} disabled={claimingId === d.id}>
                      {claimingId === d.id ? "Claiming..." : "Claim"}
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div style={styles.card}>
        <input
          placeholder="Filter by food type..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          style={styles.input}
        />
        <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={styles.small}>{nearby.length} donations within {radiusKm} km</div>
          <div style={styles.small}>{loading ? "Loading..." : ""}</div>
        </div>
      </div>

      {/* bottom sheet list */}
      <div style={styles.bottomSheet}>
        <div style={{ ...styles.card }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <strong>Donations nearby</strong>
            <span style={{ fontSize: 13, color: "#666" }}>{available ? "Alerts ON" : "Alerts OFF"}</span>
          </div>

          <div style={styles.listContainer}>
            {nearby.length === 0 && <div style={styles.small}>No active donations within the selected radius.</div>}
            {nearby.map((d) => (
              <div key={d.id} style={{ marginBottom: 8, borderBottom: "1px solid #f0f0f0", paddingBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{d.donorName || "Donor"}</div>
                    <div style={{ fontSize: 13, color: "#444" }}>{d.foodType} • {d.quantityKg ? `${d.quantityKg} kg` : ""}</div>
                    <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                      {d.distanceKm !== Infinity ? `${d.distanceKm.toFixed(2)} km` : "--"} • {d.timeLeftSec != null ? `${Math.max(0, Math.floor(d.timeLeftSec/60))}m left` : "—"}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
                    <button
                      onClick={() => openInMaps(d.lat, d.lng)}
                      style={{ ...styles.btn, padding: "6px 8px", background: "#0ea5e9" }}
                    >
                      Navigate
                    </button>
                    <button
                      onClick={() => claimDonation(d.id)}
                      style={{ ...styles.btn, padding: "6px 8px" }}
                      disabled={claimingId === d.id}
                    >
                      {claimingId === d.id ? "Claiming..." : "Claim"}
                    </button>
                  </div>
                </div>
                <div style={{ marginTop: 6 }}>
                  <div style={{ fontSize: 12, color: "#666" }}>{d.address || d.donorLocation?.address || ""}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
