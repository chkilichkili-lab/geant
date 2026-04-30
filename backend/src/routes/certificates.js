const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Certificate = require('../models/Certificate');

// @route   GET api/certificates/:accidentId
// @desc    Get all certificates for an accident
// @access  Private
router.get('/:accidentId', auth, async (req, res) => {
  try {
    const certificates = await Certificate.find({ accident: req.params.accidentId }).sort({ dateEmission: -1 });
    res.json(certificates);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/certificates
// @desc    Add a new certificate
// @access  Private
router.post('/', auth, async (req, res) => {
  const { accident, type, dateDebut, dateFin, description } = req.body;

  try {
    const newCertificate = new Certificate({
      accident,
      type,
      dateDebut,
      dateFin,
      description
    });

    const certificate = await newCertificate.save();
    res.json(certificate);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/certificates/:id
// @desc    Delete a certificate
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) return res.status(404).json({ msg: 'Certificate not found' });

    await Certificate.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Certificate removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
