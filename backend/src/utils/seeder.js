const User = require('../models/User');
const { ROLES, ACTIVITIES } = require('../constants/roles');

const autoSeedAdmin = async () => {
  try {
    // 1. Seed Primary Super Admin User (Super Admin Abhishek - Platform Administrator)
    const superAdminEmail = 'abhinani@gmail.com';
    const existingSuperAdmin = await User.findOne({ email: superAdminEmail });
    if (!existingSuperAdmin) {
      console.log('🌱 Seeding initial Super Admin User (abhinani@gmail.com)...');
      const superAdmin = new User({
        name: 'Super Admin Abhishek',
        email: superAdminEmail,
        password: 'Abhinani@4154',
        phone: '+91 9876543210',
        role: ROLES.SUPER_ADMIN,
        activities: [ACTIVITIES.GYM, ACTIVITIES.YOGA, ACTIVITIES.ZUMBA, ACTIVITIES.BASKETBALL, ACTIVITIES.BADMINTON, ACTIVITIES.SWIMMING],
        branchId: 'all_branches',
      });
      await superAdmin.save();
      console.log('👑 Super Admin user (abhinani@gmail.com) seeded in database!');
    } else {
      existingSuperAdmin.role = ROLES.SUPER_ADMIN;
      existingSuperAdmin.name = 'Super Admin Abhishek';
      existingSuperAdmin.password = 'Abhinani@4154';
      if (!existingSuperAdmin.activities || existingSuperAdmin.activities.length === 0) {
        existingSuperAdmin.activities = [ACTIVITIES.GYM, ACTIVITIES.YOGA, ACTIVITIES.ZUMBA, ACTIVITIES.BASKETBALL, ACTIVITIES.BADMINTON, ACTIVITIES.SWIMMING];
      }
      await existingSuperAdmin.save();
      console.log('👑 Super Admin user (abhinani@gmail.com) verified in database.');
    }

    // 2. Seed Dedicated Gym Admin (Gym Operations Admin)
    const gymAdminEmail = 'gymadmin@titangym.com';
    const existingGymAdmin = await User.findOne({ email: gymAdminEmail });
    if (!existingGymAdmin) {
      console.log('🌱 Seeding dedicated Gym Admin (gymadmin@titangym.com)...');
      const gymAdmin = new User({
        name: 'Gym Admin Vikram',
        email: gymAdminEmail,
        password: 'Abhinani@4154',
        phone: '+91 9876543219',
        role: ROLES.ADMIN,
        activities: [ACTIVITIES.GYM],
        branchId: 'main_branch',
      });
      await gymAdmin.save();
      console.log('🏢 Gym Admin user (gymadmin@titangym.com) seeded in database!');
    } else {
      existingGymAdmin.role = ROLES.ADMIN;
      existingGymAdmin.password = 'Abhinani@4154';
      await existingGymAdmin.save();
      console.log('🏢 Gym Admin user (gymadmin@titangym.com) verified in database.');
    }

    // 3. Update abhigangamolla@gmail.com to ADMIN role if existing so it doesn't conflict with Super Admin
    const oldAdmin = await User.findOne({ email: 'abhigangamolla@gmail.com' });
    if (oldAdmin) {
      oldAdmin.role = ROLES.ADMIN;
      oldAdmin.name = 'Abhishek (Gym Admin)';
      await oldAdmin.save();
    }

    // 4. Seed Master Coach Jayanth if not existing
    const trainerEmail = 'jayanth@titangym.com';
    const existingTrainer = await User.findOne({ email: trainerEmail });
    if (!existingTrainer) {
      const coach = new User({
        name: 'Coach Jayanth',
        email: trainerEmail,
        password: 'Abhinani@4154',
        phone: '+91 9876543211',
        role: ROLES.TRAINER,
        activities: [ACTIVITIES.GYM],
        branchId: 'main_branch',
        shift: '06:00 AM - 02:00 PM',
        specialization: 'Master IFBB Pro Strength Coach',
        assignedRoom: 'Main Olympic Arena',
        workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        experience: '8+ Years Elite Coaching',
        bio: 'Certified strength, biomechanics and performance specialist.',
        rating: '5.0',
      });
      await coach.save();
      console.log('💪 Master Coach Jayanth seeded in database!');
    }

    // 3. Seed Front Desk Receptionist if not existing
    const receptionEmail = 'receptionist@titangym.com';
    const existingReceptionist = await User.findOne({ email: receptionEmail });
    if (!existingReceptionist) {
      const rec = new User({
        name: 'Priya Sharma',
        email: receptionEmail,
        password: 'Abhinani@4154',
        phone: '+91 9876543212',
        role: ROLES.RECEPTIONIST,
        activities: [ACTIVITIES.GYM],
        branchId: 'main_branch',
        shift: 'Morning (06:00 AM - 02:00 PM)',
        assignedRoom: 'Gate Terminal Alpha-1',
        workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      });
      await rec.save();
      console.log('🛎️ Front Desk Receptionist seeded in database!');
    }

    // 4. Seed VIP Customer / Athlete if not existing
    const custEmail = 'customer@titangym.com';
    const existingCust = await User.findOne({ email: custEmail });
    if (!existingCust) {
      const cust = new User({
        name: 'Alex Mercer',
        email: custEmail,
        password: 'Abhinani@4154',
        phone: '+91 9876543213',
        role: ROLES.CUSTOMER,
        activities: [ACTIVITIES.GYM],
        branchId: 'main_branch',
        membershipPlan: 'PRO MEMBERSHIP',
        membershipStatus: 'Active',
        membershipStartDate: new Date().toISOString().slice(0, 10),
        membershipExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        amountPaid: 2499,
        assignedTrainerName: 'Coach Jayanth',
      });
      await cust.save();
      console.log('⚡ VIP Athlete Alex Mercer seeded in database!');
    }
  } catch (err) {
    console.error('⚠️ Auto-seed admin error:', err.message);
  }
};

module.exports = {
  autoSeedAdmin,
};
