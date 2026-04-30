const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  departement: { type: String, required: true },
  poste: { type: String, required: true },
  dateEmbauche: { type: Date },
  email: { type: String },
  telephone: { type: String }
}, { timestamps: true });

EmployeeSchema.index({ nom: 1 });
EmployeeSchema.index({ prenom: 1 });
EmployeeSchema.index({ departement: 1 });

module.exports = mongoose.model('Employee', EmployeeSchema);
