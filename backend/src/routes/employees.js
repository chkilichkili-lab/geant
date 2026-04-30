const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Employee = require('../models/Employee');

// @route   GET api/employees
// @desc    Get all employees
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const employees = await Employee.find().sort({ date: -1 });
    res.json(employees);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/employees
// @desc    Add new employee
// @access  Private
router.post('/', auth, async (req, res) => {
  const { nom, prenom, departement, poste, email, telephone } = req.body;

  try {
    const newEmployee = new Employee({
      nom,
      prenom,
      departement,
      poste,
      email,
      telephone,
      dateEmbauche: new Date()
    });

    const employee = await newEmployee.save();
    res.json(employee);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: err.message || 'Server Error' });
  }
});

// @route   PUT api/employees/:id
// @desc    Update employee
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { nom, prenom, departement, poste, email, telephone } = req.body;

  // Build employee object
  const employeeFields = {};
  if (nom) employeeFields.nom = nom;
  if (prenom) employeeFields.prenom = prenom;
  if (departement) employeeFields.departement = departement;
  if (poste) employeeFields.poste = poste;
  if (email) employeeFields.email = email;
  if (telephone) employeeFields.telephone = telephone;

  try {
    let employee = await Employee.findById(req.params.id);

    if (!employee) return res.status(404).json({ msg: 'Employee not found' });

    employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { $set: employeeFields },
      { new: true }
    );

    res.json(employee);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/employees/:id
// @desc    Delete employee
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let employee = await Employee.findById(req.params.id);

    if (!employee) return res.status(404).json({ msg: 'Employee not found' });

    await Employee.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Employee removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
