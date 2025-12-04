const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/foodDonation')
.then(async () => {
  console.log('MongoDB connected');
  // Seed admin
  const User = require('./schema/User');
  const adminExists = await User.findOne({ role: 'admin' });
  if (!adminExists) {
    const bcrypt = require('bcryptjs');
    const hashed = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: hashed,
      role: 'admin',
      location: { type: 'Point', coordinates: [77.2, 28.6] }
    });
    console.log('Admin user created: admin@example.com / admin123');
  }
}).catch(err => console.log(err));

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/donations', require('./routes/donationRoutes'));
app.use('/api/ngos', require('./routes/ngoRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
