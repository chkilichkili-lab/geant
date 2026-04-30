const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const testConnection = async () => {
  console.log('Attempting to connect to MongoDB...');
  console.log('URI:', process.env.DB_URI.replace(/:([^:@]+)@/, ':****@')); // Hide password
  
  try {
    await mongoose.connect(process.env.DB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('SUCCESS: Connected to MongoDB Atlas!');
    process.exit(0);
  } catch (err) {
    console.error('FAILURE: Could not connect to MongoDB.');
    console.error('Error:', err.message);
    process.exit(1);
  }
};

testConnection();
