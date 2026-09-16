const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const dns = require('dns');

// Set DNS servers to Google DNS to resolve MongoDB SRV records on Windows networks if needed
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  console.log('Using default DNS settings');
}

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const User = require('./models/User');

const { ROLES, ACTIVITIES } = require('./constants/roles');

const MONGO_URI = process.env.MONGO_URL || process.env.MONGO_URI || process.env.MONGO_UTL;

const adminData = {
  name: 'Super Admin Abhishek',
  email: 'abhinani@gmail.com',
  password: 'Abhinani@4154',
  phone: '+91 9876543210',
  role: ROLES.SUPER_ADMIN,
  activities: [ACTIVITIES.GYM, ACTIVITIES.YOGA, ACTIVITIES.ZUMBA, ACTIVITIES.BASKETBALL, ACTIVITIES.BADMINTON, ACTIVITIES.SWIMMING],
  branchId: 'all_branches',
};

const seedAdmin = async () => {
  try {
    if (!MONGO_URI) {
      console.error('❌ Error: MONGO_URL environment variable is missing.');
      process.exit(1);
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('🍃 Connected to MongoDB successfully!');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: adminData.email.toLowerCase() });

    if (existingAdmin) {
      console.log(`ℹ️ Super Admin user (${adminData.email}) already exists. Updating credentials...`);
      existingAdmin.name = adminData.name;
      existingAdmin.password = adminData.password;
      existingAdmin.role = ROLES.SUPER_ADMIN;
      existingAdmin.activities = adminData.activities;
      existingAdmin.branchId = adminData.branchId;
      await existingAdmin.save();
      console.log('✅ Super Admin user updated successfully!');
    } else {
      console.log('🚀 Creating new Super Admin User...');
      const newAdmin = new User(adminData);
      await newAdmin.save();
      console.log('✅ Super Admin user created successfully!');
    }

    console.log('=============================================');
    console.log('👑 SUPER ADMIN CREDENTIALS SEEDED:');
    console.log(`👤 Name:     ${adminData.name}`);
    console.log(`📧 Email:    ${adminData.email}`);
    console.log(`🔑 Password: ${adminData.password}`);
    console.log(`🛡️ Role:     ${adminData.role}`);
    console.log('=============================================');

    await mongoose.disconnect();
    console.log('👋 Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeder Error:', error);
    process.exit(1);
  }
};

seedAdmin();
