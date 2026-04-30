const mongoose = require('mongoose');
const User = require('../src/models/User');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const checkUser = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log('Connected to MongoDB');

    const user = await User.findOne({ username: 'admin' });
    if (user) {
      console.log('User found:', user.username);
      console.log('Role:', user.role);
      console.log('Hashed Password:', user.password);
    } else {
      console.log('User "admin" NOT found');
    }
    process.exit();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

checkUser();
