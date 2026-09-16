const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const connectDB = require('./config/db');
const { autoSeedAdmin } = require('./utils/seeder');

// Import Feature & Module Routers
const authRoutes = require('./modules/auth/authRoutes');
const userRoutes = require('./modules/users/userRoutes');
const { gymRoutes } = require('./modules/fitness/gym');
const paymentRoutes = require('./modules/payments/paymentRoutes');
const cmsRoutes = require('./modules/cms/cmsRoutes');
const feedbackRoutes = require('./modules/feedbacks/feedbackRoutes');
const ticketRoutes = require('./modules/tickets/ticketRoutes');
const enquiryRoutes = require('./modules/enquiries/enquiryRoutes');
const uploadRoutes = require('./modules/upload/uploadRoutes');

const app = express();
const PORT = process.env.PORT || 5050;

// Global Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;
  res.status(200).json({
    status: 'success',
    message: 'GYM Backend API is up and running!',
    database: dbConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Mount Platform & Module Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api', gymRoutes);
app.use('/users', gymRoutes); // Legacy non-prefixed alias (/users/:id/shift)
app.use('/api/payments', paymentRoutes);
app.use('/api/cms', cmsRoutes);
app.use('/api/feedbacks', feedbackRoutes);
app.use('/feedbacks', feedbackRoutes); // Legacy non-prefixed alias (/feedbacks/trainer/:id, /feedbacks/:id/reply)
app.use('/api/tickets', ticketRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/', uploadRoutes);

// Connect to Database & Bootstrap Auto-seeder
connectDB(autoSeedAdmin);

// Start HTTP Server
const server = app.listen(PORT, () => {
  console.log('=================================');
  console.log('🏋️ GYM Backend API Server Running');
  console.log(`🚀 Port: ${PORT}`);
  console.log(`🍃 Database Status: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Connecting...'}`);
  console.log(`🌐 Health Endpoint: http://localhost:${PORT}/api/health`);
  console.log('=================================');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use by another process.`);
  } else {
    console.error('❌ Server error:', err);
  }
});

module.exports = app;
