const express = require('express');
const { createNGO, verifyNGO, getNGOs } = require('../controllers/ngoController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

const router = express.Router();

router.post('/', createNGO);
router.get('/', getNGOs);
router.put('/:id/verify', auth, role('admin'), verifyNGO);

module.exports = router;