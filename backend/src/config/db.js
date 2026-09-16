const mongoose = require('mongoose');
const dns = require('dns');

// Set DNS servers to Google DNS to resolve MongoDB SRV records on Windows networks if needed
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  console.log('Using default DNS settings');
}

const MONGO_URI = process.env.MONGO_URL || process.env.MONGO_URI || process.env.MONGO_UTL;

const connectDB = async (postConnectCallback) => {
  try {
    if (!MONGO_URI) {
      console.warn('⚠️ Warning: MongoDB connection URL not found in environment variables.');
      return;
    }
    console.log('Connecting to MongoDB...');
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`🍃 MongoDB Connected Successfully: ${conn.connection.host}`);
    if (typeof postConnectCallback === 'function') {
      await postConnectCallback();
    }
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
  }
};

module.exports = connectDB;
