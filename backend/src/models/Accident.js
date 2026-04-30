const mongoose = require('mongoose');

const AccidentSchema = new mongoose.Schema({
  employe: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  dateAccident: { type: Date, required: true },
  lieu: { type: String, required: true },
  description: { type: String, required: true },
  gravite: { type: String, enum: ['Faible', 'Moyenne', 'Grave', 'Critique'], required: true },
  statut: { type: String, enum: ['En cours', 'Clôturé', 'En attente'], default: 'En cours' },
  certificatMedical: { type: String } // Path to the uploaded file, or just a text description for now
}, { timestamps: true });

AccidentSchema.index({ employe: 1 });
AccidentSchema.index({ dateAccident: -1 });
AccidentSchema.index({ statut: 1 });

module.exports = mongoose.model('Accident', AccidentSchema);
