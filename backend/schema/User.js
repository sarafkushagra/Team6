const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  password: { type: String },
  role: { type: String, enum: ['donor', 'volunteer', 'admin', 'ngo'], required: true },
  phone: { type: String, required: true, unique: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }
  },
  ngoId: { type: mongoose.Schema.Types.ObjectId, ref: 'NGO' },
  photoURL: { type: String },
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

userSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', userSchema);