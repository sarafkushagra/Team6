const express = require('express');
const { getDonations, createDonation, claimDonation, verifyPickup, markDistributed } = require('../controllers/donationController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

const router = express.Router();

router.get('/', getDonations);
router.post('/', auth, role('donor'), createDonation);
router.post('/:id/claim', auth, role('volunteer'), claimDonation);
router.post('/:id/verify', auth, role('donor'), verifyPickup);
router.post('/:id/distribute', auth, role('volunteer'), markDistributed);

module.exports = router;