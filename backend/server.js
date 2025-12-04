const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mock Database
let donations = [
  {
    id: 1,
    donorName: "Tasty Bites Restaurant",
    foodType: "Veg Biryani",
    quantity: "5kg",
    expiryTime: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
    location: "Connaught Place, Delhi",
    status: "available", // available, claimed, picked_up, distributed
    imageUrl: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&auto=format&fit=crop&q=60",
    claimedBy: null
  },
  {
    id: 2,
    donorName: "Wedding Caterers",
    foodType: "Mixed Curry & Rice",
    quantity: "15kg",
    expiryTime: new Date(Date.now() + 7200000).toISOString(), // 2 hours from now
    location: "Saket, Delhi",
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500&auto=format&fit=crop&q=60",
    claimedBy: null
  }
];

// Routes
app.get('/api/donations', (req, res) => {
  res.json(donations);
});

app.post('/api/donations', (req, res) => {
  const { donorName, foodType, quantity, expiryTime, location, imageUrl } = req.body;
  const newDonation = {
    id: donations.length + 1,
    donorName,
    foodType,
    quantity,
    expiryTime,
    location,
    status: "available",
    imageUrl: imageUrl || "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=500&auto=format&fit=crop&q=60",
    claimedBy: null
  };
  donations.push(newDonation);
  res.status(201).json(newDonation);
});

app.post('/api/donations/:id/claim', (req, res) => {
  const { id } = req.params;
  const { volunteerId } = req.body;
  
  const donation = donations.find(d => d.id == id);
  if (!donation) return res.status(404).json({ message: "Donation not found" });
  if (donation.status !== "available") return res.status(400).json({ message: "Donation already claimed" });

  donation.status = "claimed";
  donation.claimedBy = volunteerId || "Volunteer";
  res.json({ message: "Donation claimed successfully", donation });
});

app.post('/api/donations/:id/verify', (req, res) => {
    const { id } = req.params;
    const { otp } = req.body; // Mock OTP check
    
    const donation = donations.find(d => d.id == id);
    if (!donation) return res.status(404).json({ message: "Donation not found" });

    // In a real app, we'd verify OTP here. For prototype, we accept any OTP > 3 digits
    if (!otp || otp.length < 4) return res.status(400).json({ message: "Invalid OTP" });

    donation.status = "distributed";
    res.json({ message: "Donation distributed successfully", donation });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
