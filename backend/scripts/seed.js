const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../src/models/User');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Check if admin already exists
    const adminExists = await User.findOne({ username: 'admin' });
    if (adminExists) {
      console.log('Admin user already exists.');
      process.exit();
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const admin = new User({
      username: 'admin',
      password: hashedPassword,
      role: 'Admin'
    });

    await admin.save();
    console.log('Admin user created successfully!');
    console.log('Username: admin');
    console.log('Password: admin123');
    
    process.exit();
  } catch (err) {
    console.error('Error seeding database:', err.message);
    process.exit(1);
  }
};

seedAdmin();
