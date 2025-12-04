const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mock Database
let users = [
  { id: 1, email: "donor@test.com", password: "123", role: "donor", name: "Tasty Bites" },
  { id: 2, email: "vol@test.com", password: "123", role: "volunteer", name: "John Doe" },
  { id: 3, email: "admin@test.com", password: "123", role: "admin", name: "Admin" }
];

let donations = [
  {
    _id: "1",
    donorName: "Tasty Bites Restaurant",
    foodType: "Veg Biryani",
    quantity: "5kg",
    bestBefore: new Date(Date.now() + 3600000).toISOString(),
    location: { coordinates: [77.2090, 28.6139] }, // lng, lat
    address: "Connaught Place, Delhi",
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&auto=format&fit=crop&q=60",
    claimedBy: null,
    otp: "1234"
  },
  {
    _id: "2",
    donorName: "Wedding Caterers",
    foodType: "Mixed Curry & Rice",
    quantity: "15kg",
    bestBefore: new Date(Date.now() + 7200000).toISOString(),
    location: { coordinates: [77.2217, 28.5244] },
    address: "Saket, Delhi",
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500&auto=format&fit=crop&q=60",
    claimedBy: null,
    otp: "5678"
  }
];

// Auth Routes
app.post('/api/users/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    res.json({
      token: "mock-jwt-token-" + user.id,
      user: { id: user.id, role: user.role, name: user.name }
    });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

app.post('/api/users/register', (req, res) => {
  const { email, password, role, name } = req.body;
  const newUser = { id: users.length + 1, email, password, role, name };
  users.push(newUser);
  res.json({
    token: "mock-jwt-token-" + newUser.id,
    user: { id: newUser.id, role: newUser.role, name: newUser.name }
  });
});

// Donation Routes
app.get('/api/donations', (req, res) => {
  // In a real app, use lat/lng/radius to filter
  res.json(donations);
});

app.post('/api/donations', (req, res) => {
  const { foodType, quantity, bestBefore, location, address, imageUrl } = req.body;
  const newDonation = {
    _id: (donations.length + 1).toString(),
    donorName: "My Restaurant", // Should come from auth token in real app
    foodType,
    quantity,
    bestBefore,
    location,
    address,
    status: "available",
    imageUrl: imageUrl || "https://placehold.co/600x400?text=Food+Image",
    claimedBy: null,
    otp: Math.floor(1000 + Math.random() * 9000).toString()
  };
  donations.push(newDonation);
  res.status(201).json(newDonation);
});

app.post('/api/donations/:id/claim', (req, res) => {
  const { id } = req.params;
  const donation = donations.find(d => d._id == id);
  if (!donation) return res.status(404).json({ message: "Donation not found" });
  if (donation.status !== "available") return res.status(400).json({ message: "Donation already claimed" });

  donation.status = "claimed";
  donation.claimedBy = "Volunteer"; // Should come from auth
  res.json({ message: "Donation claimed", otp: donation.otp, donation });
});

app.post('/api/donations/:id/verify', (req, res) => {
  const { id } = req.params;
  const { otp } = req.body;

  const donation = donations.find(d => d._id == id);
  if (!donation) return res.status(404).json({ message: "Donation not found" });

  if (donation.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

  donation.status = "distributed"; // or picked_up
  res.json({ message: "Verified successfully", donation });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
