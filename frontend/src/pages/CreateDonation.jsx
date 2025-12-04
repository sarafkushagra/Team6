import { useState, useEffect } from "react";
import { apiRequest } from "../api";

export default function CreateDonation() {
  const [foodType, setFoodType] = useState("");
  const [qty, setQty] = useState("");
  const [bestBefore, setBestBefore] = useState("");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            type: 'Point',
            coordinates: [pos.coords.longitude, pos.coords.latitude]
          });
        },
        (err) => console.warn(err)
      );
    }
  }, []);

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!token) return alert("Please login first");
    if (!location) return alert("Location not detected yet. Please allow location access.");

    setLoading(true);
    try {
      // Calculate bestBefore date
      const bestBeforeDate = new Date();
      bestBeforeDate.setHours(bestBeforeDate.getHours() + parseInt(bestBefore));

      const payload = {
        foodType,
        quantity: qty,
        bestBefore: bestBeforeDate,
        location,
        address,
        imageUrl: "https://placehold.co/600x400?text=Food+Image" // Placeholder for now
      };

      await apiRequest('/donations', 'POST', payload, token);
      alert("Donation Posted Successfully!");
      // Reset or redirect
      setFoodType("");
      setQty("");
      setBestBefore("");
      setAddress("");
    } catch (err) {
      console.error(err);
      alert("Failed to post: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{ maxWidth: 420, margin: "0 auto", padding: 16 }}>
      <h2>Create Donation</h2>

      <label style={{ display: "block", marginTop: 10 }}>Food Type</label>
      <input
        style={{ width: "100%", padding: 8, marginTop: 4 }}
        placeholder="e.g. Veg Rice"
        value={foodType}
        onChange={(e) => setFoodType(e.target.value)}
      />

      <label style={{ display: "block", marginTop: 10 }}>Quantity (kg)</label>
      <input
        style={{ width: "100%", padding: 8, marginTop: 4 }}
        type="number"
        value={qty}
        onChange={(e) => setQty(e.target.value)}
      />

      <label style={{ display: "block", marginTop: 10 }}>Best Before (Hours from now)</label>
      <input
        style={{ width: "100%", padding: 8, marginTop: 4 }}
        type="number"
        value={bestBefore}
        onChange={(e) => setBestBefore(e.target.value)}
      />

      <label style={{ display: "block", marginTop: 10 }}>Pickup Address</label>
      <input
        style={{ width: "100%", padding: 8, marginTop: 4 }}
        placeholder="e.g. Flat 101, Building A"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <div style={{ marginTop: 10, fontSize: 13, color: "#666" }}>
        Location: {location ? "Detected ✅" : "Detecting... ⏳"}
      </div>

      <button
        className="btn"
        onClick={handleSubmit}
        disabled={loading}
        style={{ marginTop: 20, width: "100%", padding: 10, background: "#2563eb", color: "#fff", border: "none", borderRadius: 8 }}
      >
        {loading ? "Posting..." : "Submit Donation"}
      </button>
    </div>
  );
}
