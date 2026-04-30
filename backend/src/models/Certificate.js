const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema({
  accident: { type: mongoose.Schema.Types.ObjectId, ref: 'Accident', required: true },
  type: { 
    type: String, 
    enum: ['Initial', 'Prolongation', 'Final', 'Reprise'], 
    required: true 
  },
  dateDebut: { type: Date, required: true },
  dateFin: { type: Date }, // Peut être nul pour un certificat de reprise
  description: { type: String },
  dateEmission: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Certificate', CertificateSchema);
