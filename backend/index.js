const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const compression = require('compression');
const dotenv = require('dotenv');
const dns = require('dns');

// Force use of Google DNS to resolve MongoDB Atlas SRV records
// This fixes "querySrv ECONNREFUSED" errors caused by restrictive ISP DNS
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(compression());
app.use(express.json());

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    console.log('✅ Connected to MongoDB Atlas successfully');
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:');
    console.error('Error name:', err.name);
    console.error('Error message:', err.message);
    if (err.message.includes('IP')) {
      console.error('TIP: Check if your current IP address is whitelisted in MongoDB Atlas.');
    }
  }
};

connectDB();

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/employees', require('./src/routes/employees'));
app.use('/api/accidents', require('./src/routes/accidents'));
app.use('/api/certificates', require('./src/routes/certificates'));
app.use('/api/dashboard', require('./src/routes/dashboard'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
