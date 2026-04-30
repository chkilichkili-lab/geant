const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Accident = require('../models/Accident');
const PDFDocument = require('pdfkit');

// @route   GET api/accidents
// @desc    Get all accidents
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const accidents = await Accident.find().populate('employe', ['nom', 'prenom', 'departement']).sort({ dateAccident: -1 });
    res.json(accidents);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/accidents
// @desc    Add new accident
// @access  Private
router.post('/', auth, async (req, res) => {
  const { employe, dateAccident, lieu, description, gravite } = req.body;

  try {
    const newAccident = new Accident({
      employe,
      dateAccident,
      lieu,
      description,
      gravite
    });

    const accident = await newAccident.save();
    res.json(accident);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/accidents/:id
// @desc    Update accident status
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { statut } = req.body;

  try {
    let accident = await Accident.findById(req.params.id);

    if (!accident) return res.status(404).json({ msg: 'Accident not found' });

    accident = await Accident.findByIdAndUpdate(
      req.params.id,
      { $set: { statut } },
      { new: true }
    );

    res.json(accident);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/accidents/report/:id
// @desc    Generate PDF report for an accident
// @access  Private
router.get('/report/:id', auth, async (req, res) => {
  try {
    const accident = await Accident.findById(req.params.id).populate('employe');
    if (!accident) return res.status(404).json({ msg: 'Accident not found' });

    const doc = new PDFDocument();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=rapport_accident_${accident._id}.pdf`);
    
    doc.pipe(res);

    doc.fontSize(20).text('Rapport d\'Accident de Travail - Géant Tunisie', { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(14).text(`Dossier N°: ${accident._id}`);
    doc.text(`Statut: ${accident.statut}`);
    doc.moveDown();

    doc.fontSize(16).text('Détails de l\'employé', { underline: true });
    doc.fontSize(12).text(`Nom: ${accident.employe.nom} ${accident.employe.prenom}`);
    doc.text(`Département: ${accident.employe.departement}`);
    doc.text(`Poste: ${accident.employe.poste}`);
    doc.moveDown();

    doc.fontSize(16).text('Détails de l\'accident', { underline: true });
    doc.fontSize(12).text(`Date: ${new Date(accident.dateAccident).toLocaleDateString()}`);
    doc.text(`Lieu: ${accident.lieu}`);
    doc.text(`Gravité: ${accident.gravite}`);
    doc.moveDown();
    doc.text('Description:');
    doc.text(accident.description, { width: 410, align: 'justify' });

    doc.end();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
