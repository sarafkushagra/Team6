import { useState } from "react";

export default function CreateDonation() {
  const [foodType, setFoodType] = useState("");
  const [qty, setQty] = useState("");
  const [bestBefore, setBestBefore] = useState("");

  return (
    <div className="page">
      <h2>Create Donation</h2>

      <label>Food Type</label>
      <input placeholder="e.g. Veg Rice" value={foodType} onChange={(e) => setFoodType(e.target.value)} />

      <label>Quantity (kg)</label>
      <input type="number" value={qty} onChange={(e) => setQty(e.target.value)} />

      <label>Best Before (Hours)</label>
      <input type="number" value={bestBefore} onChange={(e) => setBestBefore(e.target.value)} />

      <button className="btn" onClick={() => alert("Posted!")}>
        Submit Donation
      </button>
    </div>
  );
}
