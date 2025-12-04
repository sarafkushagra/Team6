import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

export default function CreateDonation() {
  const [foodType, setFoodType] = useState("");
  const [qty, setQty] = useState("");
  const [bestBefore, setBestBefore] = useState("");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    if (!token) {
      alert('Please login');
      return;
    }
    if (!location) {
      alert('Location not detected. Please allow location access.');
      return;
    }
    const expiry = new Date(Date.now() + parseInt(bestBefore) * 3600000);
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          foodType,
          quantity: qty + 'kg',
          bestBefore: expiry,
          location,
          address: address || 'Current location',
          imageUrl: "https://placehold.co/600x400?text=Food+Image"
        })
      });
      if (res.ok) {
        alert('Donation posted successfully!');
        navigate('/donor');
      } else {
        alert('Failed to post');
      }
    } catch (error) {
      console.error(error);
      alert('Error posting donation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Create Donation</h2>

      <label className="block mt-3 text-sm font-medium text-gray-700">Food Type</label>
      <input
        className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        placeholder="e.g. Veg Rice"
        value={foodType}
        onChange={(e) => setFoodType(e.target.value)}
      />

      <label className="block mt-3 text-sm font-medium text-gray-700">Quantity (kg)</label>
      <input
        className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        type="number"
        value={qty}
        onChange={(e) => setQty(e.target.value)}
      />

      <label className="block mt-3 text-sm font-medium text-gray-700">Best Before (Hours from now)</label>
      <input
        className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        type="number"
        value={bestBefore}
        onChange={(e) => setBestBefore(e.target.value)}
      />

      <label className="block mt-3 text-sm font-medium text-gray-700">Pickup Address</label>
      <input
        className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        placeholder="e.g. Flat 101, Building A"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <div className="mt-2 text-sm text-gray-500">
        Location: {location ? "Detected ✅" : "Detecting... ⏳"}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full mt-6 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-semibold"
      >
        {loading ? "Posting..." : "Submit Donation"}
      </button>
    </div>
  );
}

