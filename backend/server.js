const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/foodDonation')
.then(() => console.log('MongoDB connected')).catch(err => console.log(err));

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
