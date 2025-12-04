const Donation = require('../schema/Donation');
const User = require('../schema/User');

exports.getAnalytics = async (req, res) => {
  try {
    const totalDonations = await Donation.countDocuments();
    const distributed = await Donation.countDocuments({ status: 'distributed' });
    const totalQuantity = await Donation.aggregate([
      { $match: { status: 'distributed' } },
      { $group: { _id: null, total: { $sum: { $toDouble: '$quantity' } } } } // assuming quantity is string like '5kg', but for simplicity
    ]);
    // For simplicity, just count
    res.json({
      totalDonations,
      distributed,
      impact: `${distributed} meals distributed`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.reportSpoiled = async (req, res) => {
  try {
    const donation = await Donation.findByIdAndUpdate(req.params.id, { status: 'spoiled' });
    res.json({ message: 'Reported as spoiled' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};