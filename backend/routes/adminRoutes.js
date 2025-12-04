const express = require('express');
const { getAnalytics, reportSpoiled } = require('../controllers/adminController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

const router = express.Router();

router.get('/analytics', auth, role('admin'), getAnalytics);
router.post('/donations/:id/spoiled', auth, role('admin'), reportSpoiled);

module.exports = router;