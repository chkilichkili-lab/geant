const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const testConnection = async () => {
  try {
    console.log('Attempting to connect with Google DNS...');
    await mongoose.connect(process.env.DB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ Success! Connection established.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed again:', err.message);
    process.exit(1);
  }
};

testConnection();
