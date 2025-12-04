// src/pages/HomeMapListPage.jsx
import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { apiRequest } from "../api";

const styles = {
  container: { maxWidth: 420, margin: "8px auto", fontFamily: "system-ui, Roboto, Arial" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  card: { background: "#fff", padding: 12, borderRadius: 10, boxShadow: "0 6px 18px rgba(0,0,0,0.06)", marginBottom: 10 },
  bottomSheet: { position: "fixed", left: 0, right: 0, bottom: 0, maxWidth: 420, margin: "0 auto", padding: 8, zIndex: 1000 },
  listContainer: { maxHeight: 320, overflowY: "auto", background: "#fff", borderRadius: 10, padding: 10, boxShadow: "0 -2px 10px rgba(0,0,0,0.1)" },
  btn: { padding: "8px 12px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" },
  small: { fontSize: 13, color: "#555" },
  radiusSelect: { padding: 8, borderRadius: 8, border: "1px solid #ddd" }
};

// small custom marker (fix missing icon issue)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png"
});

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
  const [donations, setDonations] = useState([]);
  const [radiusKm, setRadiusKm] = useState(5);
  const [available, setAvailable] = useState(true);
  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState(null);

  const fetchDonations = async (lat, lng, rad) => {
    try {
      setLoading(true);
      const data = await apiRequest(`/donations?lat=${lat}&lng=${lng}&radius=${rad}`);
      // Transform for UI if needed, but backend returns standard format
      // Backend returns: { location: { coordinates: [lng, lat] }, ... }
      const mapped = data.map(d => ({
        ...d,
        lat: d.location.coordinates[1],
        lng: d.location.coordinates[0],
        donorName: d.donor?.name || "Donor",
        quantityKg: d.quantity, // assuming string or number
        timeLeftSec: d.bestBefore ? Math.max(0, Math.floor((new Date(d.bestBefore).getTime() - Date.now()) / 1000)) : null
      }));
      setDonations(mapped);
    } catch (err) {
      console.error("Fetch donations failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // get current user location (browser)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLoc(loc);
          fetchDonations(loc.lat, loc.lng, radiusKm);
        },
        (err) => {
          console.warn("loc err", err);
          // fallback or default?
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, []); // run once on mount

  useEffect(() => {
    if (userLoc.lat) {
      fetchDonations(userLoc.lat, userLoc.lng, radiusKm);
    }
  }, [radiusKm]);

  // claim donation
  const claimDonation = async (donationId) => {
    const token = localStorage.getItem('token');
    if (!token) return alert("Login first");

    setClaimingId(donationId);
    try {
      const res = await apiRequest(`/donations/${donationId}/claim`, 'POST', {}, token);
      alert(`Claimed! OTP: ${res.otp}. Share this with donor upon pickup.`);
      // Refresh list
      fetchDonations(userLoc.lat, userLoc.lng, radiusKm);
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

  const filtered = donations.filter(d => !filterText || (d.foodType || "").toLowerCase().includes(filterText.toLowerCase()));

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
            onClick={() => fetchDonations(userLoc.lat, userLoc.lng, radiusKm)}
            style={{ ...styles.btn, background: "#16a34a" }}
            title="Refresh"
          >
            Refresh
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

          {filtered.map((d) => (
            <Marker key={d._id} position={[d.lat, d.lng]}>
              <Popup>
                <div style={{ minWidth: 220 }}>
                  <strong>{d.donorName}</strong>
                  <div style={{ fontSize: 13 }}>{d.address}</div>
                  <div style={{ marginTop: 6 }}>
                    <div style={{ fontSize: 13 }}>{d.foodType} — {d.quantityKg}</div>
                    <div style={{ fontSize: 12, color: "#444" }}>{d.timeLeftSec != null ? `${Math.floor(d.timeLeftSec / 60)}m left` : ""}</div>
                  </div>
                  <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                    <button className="btn" style={{ padding: "6px 8px" }} onClick={() => openInMaps(d.lat, d.lng)}>Navigate</button>
                    <button className="btn" style={{ padding: "6px 8px" }} onClick={() => claimDonation(d._id)} disabled={claimingId === d._id}>
                      {claimingId === d._id ? "Claiming..." : "Claim"}
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
          style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #ddd" }}
        />
        <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={styles.small}>{filtered.length} donations within {radiusKm} km</div>
          <div style={styles.small}>{loading ? "Loading..." : ""}</div>
        </div>
      </div>

      {/* bottom sheet list */}
      <div style={styles.bottomSheet}>
        <div style={styles.listContainer}>
          {filtered.length === 0 && <div style={styles.small}>No active donations found.</div>}
          {filtered.map((d) => (
            <div key={d._id} style={{ marginBottom: 8, borderBottom: "1px solid #f0f0f0", paddingBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{d.donorName}</div>
                  <div style={{ fontSize: 13, color: "#444" }}>{d.foodType} • {d.quantityKg}</div>
                  <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                    {d.timeLeftSec != null ? `${Math.max(0, Math.floor(d.timeLeftSec / 60))}m left` : "—"}
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
                    onClick={() => claimDonation(d._id)}
                    style={{ ...styles.btn, padding: "6px 8px" }}
                    disabled={claimingId === d._id}
                  >
                    {claimingId === d._id ? "Claiming..." : "Claim"}
                  </button>
                </div>
              </div>
              <div style={{ marginTop: 6 }}>
                <div style={{ fontSize: 12, color: "#666" }}>{d.address}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
