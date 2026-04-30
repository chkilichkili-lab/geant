const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Accident = require('../models/Accident');

// @route   GET api/dashboard
// @desc    Get dashboard statistics
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const stats = await Accident.aggregate([
      {
        $facet: {
          total: [{ $count: "count" }],
          enCours: [{ $match: { statut: 'En cours' } }, { $count: "count" }],
          clotures: [{ $match: { statut: 'Clôturé' } }, { $count: "count" }],
          enAttente: [{ $match: { statut: 'En attente' } }, { $count: "count" }]
        }
      },
      {
        $project: {
          totalAccidents: { $ifNull: [{ $arrayElemAt: ["$total.count", 0] }, 0] },
          dossiersEnCours: { $ifNull: [{ $arrayElemAt: ["$enCours.count", 0] }, 0] },
          dossiersClotures: { $ifNull: [{ $arrayElemAt: ["$clotures.count", 0] }, 0] },
          dossiersEnAttente: { $ifNull: [{ $arrayElemAt: ["$enAttente.count", 0] }, 0] }
        }
      }
    ]);

    res.json(stats[0] || {
      totalAccidents: 0,
      dossiersEnCours: 0,
      dossiersClotures: 0,
      dossiersEnAttente: 0
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
