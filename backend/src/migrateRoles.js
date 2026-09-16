const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {}

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { ROLES, normalizeRole } = require('./constants/roles');

async function migrate() {
  try {
    console.log('Connecting to MongoDB for role migration...');
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB.');

    const users = await mongoose.connection.collection('users').find({}).toArray();
    console.log(`Found ${users.length} users to migrate.`);

    for (const u of users) {
      let finalRole;
      const upper = String(u.role || '').toUpperCase().trim();

      if (u.email === 'abhigangamolla@gmail.com') {
        finalRole = ROLES.SUPER_ADMIN;
      } else if (upper === 'SUPER_ADMIN' || upper === 'SUPERADMIN') {
        finalRole = ROLES.SUPER_ADMIN;
      } else if (upper === 'ADMIN') {
        finalRole = ROLES.ADMIN;
      } else if (upper === 'RECEPTIONIST') {
        finalRole = ROLES.RECEPTIONIST;
      } else if (upper === 'TRAINER') {
        finalRole = ROLES.TRAINER;
      } else {
        finalRole = ROLES.CUSTOMER;
      }

      await mongoose.connection.collection('users').updateOne(
        { _id: u._id },
        {
          $set: {
            role: finalRole,
            activities: u.activities && u.activities.length > 0 ? u.activities : ['GYM'],
            branchId: u.branchId || 'main_branch',
            isActive: u.isActive !== undefined ? u.isActive : true,
          },
        }
      );
    }

    const currentRoles = await mongoose.connection.collection('users').distinct('role');
    console.log('Distinct roles after migration:', currentRoles);

    const sample = await mongoose.connection
      .collection('users')
      .find({}, { projection: { email: 1, role: 1, activities: 1 } })
      .toArray();
    console.log('Migrated users summary:');
    console.table(sample);

    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
