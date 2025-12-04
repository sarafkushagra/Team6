const NGO = require('../schema/NGO');

exports.createNGO = async (req, res) => {
  try {
    const ngo = new NGO(req.body);
    await ngo.save();
    res.status(201).json(ngo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifyNGO = async (req, res) => {
  try {
    const ngo = await NGO.findByIdAndUpdate(req.params.id, { verified: true }, { new: true });
    res.json(ngo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getNGOs = async (req, res) => {
  try {
    const ngos = await NGO.find();
    res.json(ngos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};