const Donation = require('../schema/Donation');
const User = require('../schema/User');
const otpGenerator = require('otp-generator');

exports.getDonations = async (req, res) => {
  try {
    const { lat, lng, radius = 5 } = req.query; // in km
    let query = {};
    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: radius * 1000 // meters
        }
      };
    }
    const donations = await Donation.find(query).populate('donor', 'name').populate('claimedBy', 'name');
    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createDonation = async (req, res) => {
  try {
    const { foodType, quantity, bestBefore, location, address, imageUrl } = req.body;
    const donation = new Donation({
      donor: req.user.id,
      foodType,
      quantity,
      bestBefore,
      location,
      address,
      imageUrl
    });
    await donation.save();
    res.status(201).json(donation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.claimDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation || donation.status !== 'available') {
      return res.status(400).json({ message: 'Donation not available' });
    }
    const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
    donation.status = 'claimed';
    donation.claimedBy = req.user.id;
    donation.otp = otp;
    await donation.save();
    res.json({ message: 'Donation claimed', otp });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifyPickup = async (req, res) => {
  try {
    const { otp } = req.body;
    const donation = await Donation.findById(req.params.id);
    if (!donation || donation.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    donation.status = 'picked_up';
    donation.pickupTime = new Date();
    await donation.save();
    res.json({ message: 'Pickup verified' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.markDistributed = async (req, res) => {
  try {
    const { proofPhotos } = req.body;
    const donation = await Donation.findById(req.params.id);
    if (!donation || donation.claimedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    donation.status = 'distributed';
    donation.distributionTime = new Date();
    donation.proofPhotos = proofPhotos;
    await donation.save();
    res.json({ message: 'Distributed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};