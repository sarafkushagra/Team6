const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  role: { type: String, enum: ['donor', 'volunteer', 'admin'], required: true },
  phone: { type: String },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } 
  },
  ngoId: { type: mongoose.Schema.Types.ObjectId, ref: 'NGO' }, 
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

userSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', userSchema);