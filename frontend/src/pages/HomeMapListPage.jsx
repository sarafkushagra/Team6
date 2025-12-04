// src/pages/HomeMapListPage.jsx
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";

const styles = {
  container: { maxWidth: 800, margin: "8px auto", fontFamily: "system-ui, Roboto, Arial" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  card: { background: "#fff", padding: 12, borderRadius: 10, boxShadow: "0 6px 18px rgba(0,0,0,0.06)", marginBottom: 10 },
  bottomSheet: { marginTop: 20, background: "#fff", borderRadius: 10, padding: 10, boxShadow: "0 -2px 10px rgba(0,0,0,0.1)" },
  btn: { padding: "8px 12px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" },
  small: { fontSize: 13, color: "#555" },
  radiusSelect: { padding: 8, borderRadius: 8, border: "1px solid #ddd" }
};

// Fix missing icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png"
});

function Recenter({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) map.setView([lat, lng], 13);
  }, [lat, lng, map]);
  return null;
}

export default function HomeMapListPage() {
  const [userLoc, setUserLoc] = useState({ lat: 28.6139, lng: 77.2090 }); // Default Delhi
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState(null);
  const navigate = useNavigate();

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/donations');
      const data = await res.json();

      const mapped = data.map(d => ({
        ...d,
        lat: d.location?.coordinates?.[1] || 28.6,
        lng: d.location?.coordinates?.[0] || 77.2,
        timeLeftSec: d.bestBefore ? Math.max(0, Math.floor((new Date(d.bestBefore).getTime() - Date.now()) / 1000)) : null,
        donorName: d.donor?.name || 'Unknown Donor'
      }));
      setDonations(mapped);
    } catch (err) {
      console.error("Fetch donations failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => console.warn("loc err", err)
      );
    }
    fetchDonations();
  }, []);

  const claimDonation = async (donationId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please login as volunteer first");
      return;
    }

    setClaimingId(donationId);
    try {
      const res = await fetch(`http://localhost:5000/api/donations/${donationId}/claim`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();

      if (res.ok) {
        alert(`Claimed! OTP: ${data.otp}. Go to pickup.`);
        navigate(`/active-trip?donationId=${donationId}`);
      } else {
        alert("Claim failed: " + data.message);
      }
    } catch (err) {
      console.error("claim failed", err);
      alert("Claim failed");
    } finally {
      setClaimingId(null);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Nearby Donations</h2>
        <button onClick={fetchDonations} style={{ ...styles.btn, background: "#16a34a" }}>Refresh</button>
      </div>

      <div style={{ height: 400, borderRadius: 10, overflow: "hidden", marginBottom: 8 }}>
        <MapContainer center={[userLoc.lat, userLoc.lng]} zoom={13} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Recenter lat={userLoc.lat} lng={userLoc.lng} />
          <Marker position={[userLoc.lat, userLoc.lng]}>
            <Popup>You are here</Popup>
          </Marker>

          {donations.filter(d => d.status === 'available').map((d) => (
            <Marker key={d._id} position={[d.lat, d.lng]}>
              <Popup>
                <div>
                  <strong>{d.donorName}</strong>
                  <div>{d.foodType} — {d.quantity}</div>
                  <button
                    className="mt-2 px-3 py-1 bg-blue-600 text-white rounded"
                    onClick={() => claimDonation(d._id)}
                    disabled={claimingId === d._id}
                  >
                    {claimingId === d._id ? "Claiming..." : "Claim"}
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div style={styles.bottomSheet}>
        <h3>Available List</h3>
        {donations.filter(d => d.status === 'available').map((d) => (
          <div key={d._id} style={{ marginBottom: 10, padding: 10, borderBottom: "1px solid #eee" }}>
            <div style={{ fontWeight: "bold" }}>{d.foodType}</div>
            <div style={{ fontSize: 14, color: "#666" }}>{d.donorName} • {d.quantity}</div>
            <div style={{ fontSize: 13, color: "#888" }}>{d.address}</div>
            <button
              onClick={() => claimDonation(d._id)}
              style={{ ...styles.btn, marginTop: 8 }}
              disabled={claimingId === d._id}
            >
              Claim Donation
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
