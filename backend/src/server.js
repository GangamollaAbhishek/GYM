const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const dns = require('dns');

// Set DNS servers to Google DNS to resolve MongoDB SRV records on Windows networks if needed
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  console.log('Using default DNS settings');
}

// Load environment variables from local backend/.env and root .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URL || process.env.MONGO_URI || process.env.MONGO_UTL;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
const connectDB = async () => {
  try {
    if (!MONGO_URI) {
      console.warn('⚠️ Warning: MongoDB connection URL not found in environment variables.');
      return;
    }
    console.log(`Connecting to MongoDB...`);
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`🍃 MongoDB Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
  }
};


// Connect to MongoDB
connectDB();

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;
  res.status(200).json({
    status: 'success',
    message: 'GYM Backend API is up and running!',
    database: dbConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Sample Members route boilerplate
app.get('/api/members', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: [
      { id: 1, name: 'Alex Vance', plan: 'Premium Elite', status: 'Active', expiryDate: '2026-12-31' },
      { id: 2, name: 'Sophia Chen', plan: 'Standard Fit', status: 'Active', expiryDate: '2026-09-15' },
      { id: 3, name: 'Marcus Brody', plan: 'VIP Access', status: 'Active', expiryDate: '2026-11-01' }
    ]
  });
});

// Sample Workouts route boilerplate
app.get('/api/workouts', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: [
      { id: 1, title: 'Hypertrophy Upper Body', category: 'Strength', duration: '60 mins', caloriesBurned: 450 },
      { id: 2, title: 'High-Intensity Cardio Blast', category: 'Cardio', duration: '45 mins', caloriesBurned: 520 },
      { id: 3, title: 'Core Stability & Mobility', category: 'Flexibility', duration: '30 mins', caloriesBurned: 220 }
    ]
  });
});

// Start Server
const server = app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`🏋️ GYM Backend API Server Running `);
  console.log(`🚀 Port: ${PORT}`);
  console.log(`🍃 Database Status: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Connecting...'}`);
  console.log(`🌐 Health Endpoint: http://localhost:${PORT}/api/health`);
  console.log(`=================================`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use by another process. Please close any previous server instance or change PORT in .env.`);
  } else {
    console.error(`❌ Server error:`, err);
  }
});


