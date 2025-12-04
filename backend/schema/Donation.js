const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  foodType: { type: String, required: true },
  quantity: { type: String, required: true },
  bestBefore: { type: Date, required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } 
  },
  address: { type: String },
  imageUrl: { type: String },
  status: { type: String, enum: ['available', 'claimed', 'picked_up', 'distributed'], default: 'available' },
  claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  otp: { type: String }, 
  pickupTime: { type: Date },
  distributionTime: { type: Date },
  proofPhotos: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

donationSchema.index({ location: '2dsphere' });
donationSchema.index({ bestBefore: 1 });

module.exports = mongoose.model('Donation', donationSchema);