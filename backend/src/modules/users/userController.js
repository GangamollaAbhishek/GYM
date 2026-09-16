const mongoose = require('mongoose');
const User = require('../../models/User');
const Attendance = require('../../models/Attendance');
const { sendWelcomeCredentialsEmail, sendStaffCredentialsEmail } = require('../../utils/mailer');
const { ROLES, normalizeRole } = require('../../constants/roles');

// GET /api/users - Fetch all registered users (Protected: Super Admin, Admin, Receptionist, Trainer)
const getAllUsers = async (req, res) => {
  try {
    const rawUsers = await User.find().select('-password').lean().exec();

    const formattedUsers = rawUsers.map((u, idx) => ({
      id: String(u._id),
      displayId: `USR-${101 + idx}`,
      name: u.name,
      email: u.email,
      phone: u.phone || 'N/A',
      role: normalizeRole(u.role),
      avatar: u.avatar || `https://images.unsplash.com/photo-${1534528741775 + (idx % 8) * 50}?auto=format&fit=crop&w=300&q=80`,
      status: u.membershipStatus || (u.membershipPlan && u.membershipPlan !== 'No Active Plan' ? 'Active' : 'No Membership'),
      membershipPlan: u.membershipPlan || 'No Active Plan',
      membershipDuration: u.membershipDuration || '',
      membershipStatus: u.membershipStatus || (u.membershipPlan && u.membershipPlan !== 'No Active Plan' ? 'Active' : 'No Membership'),
      membershipStartDate: u.membershipStartDate || '',
      membershipExpiry: u.membershipExpiry || 'N/A',
      amountPaid: u.amountPaid || 0,
      paymentMethod: u.paymentMethod || '',
      assignedTrainer: u.assignedTrainer ? String(u.assignedTrainer) : null,
      assignedTrainerName: u.assignedTrainerName || '',
      height: u.height || '178 cm',
      weight: u.weight || '76 kg',
      bodyFat: u.bodyFat || '14.2%',
      bloodGroup: u.bloodGroup || 'O+',
      workoutPlan: u.workoutPlan || {
        split: 'Push-Pull-Legs (Hypertrophy)',
        frequency: '5 Days / Week',
        intensity: 'High Intensity RPE 8-9',
        cardioProtocol: '20 Mins Incline Treadmill Post-Lift',
        customNotes: 'Focus on explosive concentric cadence and 3s eccentric squats.',
        updatedAt: 'Recently updated by Coach',
      },
      dietPlan: u.dietPlan || {
        dailyCalories: '2,800 kcal',
        protein: '180g (2.2g/kg)',
        carbs: '320g',
        fats: '65g',
        waterIntake: '4.0 Liters Daily',
        mealProtocol: '4 Meals + 1 Pre-Workout Meal + 1 Post-Workout Whey Shake',
        supplements: ['Hydrolyzed Whey Isolate', 'Creatine Creapure 5g', 'BCAA Electrolytes', 'Multivitamin + Omega 3'],
        updatedAt: 'Recently updated by Coach',
      },
      trainerNotes: u.trainerNotes && u.trainerNotes.length > 0 ? u.trainerNotes : [
        {
          note: 'Great form progression on compound squats. Recommend moving working sets up by 5kg next week.',
          date: '28 Aug 2026',
          author: 'Master Coach',
        },
      ],
      progress: u.progress || {
        currentWeight: u.weight || '76 kg',
        targetWeight: '80 kg Lean Mass',
        bodyFat: u.bodyFat || '14.2%',
        benchPressPR: '110 kg',
        squatPR: '150 kg',
        deadliftPR: '190 kg',
        weeklyAttendanceScore: '96%',
        lastAuditDate: '30 Aug 2026',
      },
      chatMessages: u.chatMessages || [],
      shift: u.shift || '06:00 AM - 02:00 PM',
      spec: u.specialization || 'Master Coach & Conditioning',
      assignedRoom: u.assignedRoom || 'Main Strength & Conditioning Arena',
      workingDays: u.workingDays && u.workingDays.length > 0 ? u.workingDays : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      createdAt: u.createdAt,
    }));

    res.status(200).json({
      status: 'success',
      count: formattedUsers.length,
      data: formattedUsers,
    });
  } catch (error) {
    console.error('Fetch users error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch users' });
  }
};

// GET /api/users/:id - Fetch individual user profile & coaching telemetry
const getUserById = async (req, res) => {
  try {
    const userDoc = await User.findById(req.params.id).select('-password').lean().exec();
    if (!userDoc) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    const orConditions = [
      { userId: userDoc._id },
      { customerId: String(userDoc._id) },
    ];
    if (userDoc.email) orConditions.push({ email: userDoc.email });
    if (userDoc.phone && userDoc.phone !== 'N/A') orConditions.push({ phone: userDoc.phone });
    if (userDoc.name) orConditions.push({ name: new RegExp(`^${userDoc.name.trim()}$`, 'i') });

    const attendanceDocs = await Attendance.find({ $or: orConditions })
      .sort({ createdAt: -1 })
      .limit(200)
      .lean()
      .exec();

    const formattedAttendance = attendanceDocs.map((l) => ({
      id: l.logId || `LOG-${String(l._id).slice(-4)}`,
      _id: l._id,
      logId: l.logId || `LOG-${String(l._id).slice(-4)}`,
      customerId: l.customerId,
      userId: l.userId,
      name: l.name,
      email: l.email,
      phone: l.phone,
      plan: l.plan || userDoc.membershipPlan || 'Active Pass',
      gate: l.terminal || 'Turnstile Gate Alpha-1',
      terminal: l.terminal || 'Turnstile Gate Alpha-1',
      in: l.timeIn,
      timeIn: l.timeIn,
      out: l.timeOut || '--',
      timeOut: l.timeOut || '--',
      date: l.date || (l.createdAt ? new Date(l.createdAt).toISOString().slice(0, 10) : ''),
      status: l.status || 'Active Inside',
      duration: l.status === 'Checked Out' ? '1h 15m' : l.status === 'Inactive' ? 'Session Ended' : 'Active In Arena',
      verification: l.verification || '✓ Verified Turnstile Pass',
      createdAt: l.createdAt,
    }));

    res.status(200).json({
      status: 'success',
      data: {
        ...userDoc,
        id: String(userDoc._id),
        attendanceLogs: formattedAttendance,
      },
    });
  } catch (error) {
    console.error('Fetch user details error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch user details' });
  }
};

// POST /api/users - Create new user from Admin panel or Receptionist onboarding
const createUser = async (req, res) => {
  try {
    const { name, email, phone, role, password, plan, duration, amount, paymentMethod } = req.body;
    if (!name || !email) {
      return res.status(400).json({ status: 'error', message: 'Name and email are required' });
    }

    const lowerEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: lowerEmail });
    if (existing) {
      return res.status(400).json({ status: 'error', message: 'User with this email already exists' });
    }

    let membershipPlan = 'No Active Plan';
    let membershipStatus = 'No Membership';
    let membershipDuration = '';
    let membershipStartDate = '';
    let membershipExpiry = 'N/A';
    let amountPaid = 0;

    // If onboarded with an actual membership plan
    if (plan && plan !== 'No Active Plan') {
      membershipPlan = plan;
      membershipStatus = 'Active';
      membershipDuration = duration || 'Monthly';
      membershipStartDate = new Date().toISOString().split('T')[0];

      const expDate = new Date();
      if (membershipDuration === 'Monthly') expDate.setMonth(expDate.getMonth() + 1);
      else if (membershipDuration === 'Quarterly') expDate.setMonth(expDate.getMonth() + 3);
      else if (membershipDuration === 'Half-Yearly') expDate.setMonth(expDate.getMonth() + 6);
      else if (membershipDuration === 'Annual') expDate.setFullYear(expDate.getFullYear() + 1);
      else expDate.setMonth(expDate.getMonth() + 1);

      membershipExpiry = expDate.toISOString().split('T')[0];
      amountPaid = Number(amount) || 0;
    }

    // Determine requested role using standard enum
    let requestedRole = normalizeRole(role || 'CUSTOMER');
    const callerRole = req.user ? normalizeRole(req.user.role) : null;

    // Security: Only SUPER_ADMIN can create/assign SUPER_ADMIN or ADMIN roles.
    // RECEPTIONIST can only create CUSTOMER.
    if (requestedRole === ROLES.SUPER_ADMIN && callerRole !== ROLES.SUPER_ADMIN) {
      return res.status(403).json({ status: 'error', message: 'Only SUPER_ADMIN can create or elevate users to SUPER_ADMIN.' });
    }
    if (requestedRole === ROLES.ADMIN && callerRole !== ROLES.SUPER_ADMIN) {
      return res.status(403).json({ status: 'error', message: 'Only SUPER_ADMIN can assign ADMIN role.' });
    }
    if (callerRole === ROLES.RECEPTIONIST && requestedRole !== ROLES.CUSTOMER) {
      requestedRole = ROLES.CUSTOMER;
    }

    const isStaff = requestedRole === ROLES.TRAINER || requestedRole === ROLES.RECEPTIONIST || requestedRole === ROLES.ADMIN || requestedRole === ROLES.SUPER_ADMIN;

    // Generate secure temporary password if not provided or if standard placeholder was passed
    let assignedPassword;
    if (password && password.trim() && !password.includes('@123')) {
      assignedPassword = password.trim();
    } else {
      const randomCode = Math.floor(1000 + Math.random() * 9000);
      if (requestedRole === ROLES.TRAINER) {
        assignedPassword = `PamsCoach@${randomCode}`;
      } else if (requestedRole === ROLES.RECEPTIONIST) {
        assignedPassword = `PamsDesk@${randomCode}`;
      } else if (requestedRole === ROLES.ADMIN) {
        assignedPassword = `PamsAdmin@${randomCode}`;
      } else if (requestedRole === ROLES.SUPER_ADMIN) {
        assignedPassword = `PamsSuper@${randomCode}`;
      } else {
        assignedPassword = `PamsPass@${randomCode}`;
      }
    }

    const newUser = new User({
      name: name.trim(),
      email: lowerEmail,
      phone: (phone || '').trim(),
      role: requestedRole,
      activities: req.body.activities && req.body.activities.length > 0 ? req.body.activities : ['GYM'],
      branchId: req.body.branchId || 'main_branch',
      password: assignedPassword,
      membershipPlan,
      membershipStatus,
      membershipDuration,
      membershipStartDate,
      membershipExpiry,
      amountPaid,
      paymentMethod: paymentMethod || '',
    });

    await newUser.save();

    // Dispatch credentials email
    let emailStatus = { success: false };
    try {
      if (isStaff) {
        emailStatus = await sendStaffCredentialsEmail({
          to: newUser.email,
          name: newUser.name,
          email: newUser.email,
          password: assignedPassword,
          role: newUser.role,
          shift: req.body.shift,
          assignedRoom: req.body.room || req.body.assignedRoom,
        });
      } else {
        emailStatus = await sendWelcomeCredentialsEmail({
          to: newUser.email,
          name: newUser.name,
          email: newUser.email,
          password: assignedPassword,
          plan: newUser.membershipPlan,
          duration: newUser.membershipDuration,
          membershipExpiry: newUser.membershipExpiry,
          amountPaid: newUser.amountPaid,
          paymentMethod: newUser.paymentMethod,
        });
      }
    } catch (mailErr) {
      console.error('Failed to dispatch credentials email:', mailErr.message);
    }

    res.status(201).json({
      status: 'success',
      message: emailStatus?.success
        ? `${isStaff ? 'Staff account' : 'User'} created successfully and temporary login credentials sent to ${newUser.email}!`
        : `${isStaff ? 'Staff account' : 'User'} created successfully!`,
      emailSent: emailStatus?.success || false,
      temporaryPassword: assignedPassword,
      data: {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        membershipPlan: newUser.membershipPlan,
        membershipStatus: newUser.membershipStatus,
        membershipExpiry: newUser.membershipExpiry,
        status: newUser.membershipStatus,
      },
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// PUT /api/users/:id - Update user profile details
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const isSelf = req.user && req.user._id && req.user._id.toString() === id;
    const callerRole = req.user ? normalizeRole(req.user.role) : null;
    const isSuperAdmin = callerRole === ROLES.SUPER_ADMIN;
    const isAdmin = callerRole === ROLES.SUPER_ADMIN || callerRole === ROLES.ADMIN;

    const {
      name,
      email,
      phone,
      avatar,
      dob,
      gender,
      address,
      height,
      weight,
      bodyFat,
      bloodGroup,
      specialization,
      shift,
      status,
      role,
      activities,
      branchId,
      ...otherFields
    } = req.body;

    const updateFields = { ...otherFields };
    delete updateFields.password;

    if (name) updateFields.name = name;
    if (email) updateFields.email = email.toLowerCase().trim();
    if (phone !== undefined) updateFields.phone = phone;
    if (avatar !== undefined) updateFields.avatar = avatar;
    if (dob !== undefined) updateFields.dob = dob;
    if (gender !== undefined) updateFields.gender = gender;
    if (address !== undefined) updateFields.address = address;
    if (height !== undefined) updateFields.height = height;
    if (weight !== undefined) updateFields.weight = weight;
    if (bodyFat !== undefined) updateFields.bodyFat = bodyFat;
    if (bloodGroup !== undefined) updateFields.bloodGroup = bloodGroup;

    // Only Admin/Super Admin can update operational fields
    if (isAdmin) {
      if (specialization) updateFields.specialization = specialization;
      if (shift) updateFields.shift = shift;
      if (status) updateFields.membershipStatus = status;
      if (activities && Array.isArray(activities)) updateFields.activities = activities;
      if (branchId) updateFields.branchId = branchId;
    }

    // Role changes are strictly protected:
    // Only SUPER_ADMIN can assign/modify roles to SUPER_ADMIN or ADMIN.
    // ADMIN can only manage RECEPTIONIST, TRAINER, CUSTOMER.
    if (role && isAdmin) {
      const targetRole = normalizeRole(role);
      if (targetRole === ROLES.SUPER_ADMIN && !isSuperAdmin) {
        return res.status(403).json({ status: 'error', message: 'Only SUPER_ADMIN can assign the SUPER_ADMIN role.' });
      }
      if (targetRole === ROLES.ADMIN && !isSuperAdmin) {
        return res.status(403).json({ status: 'error', message: 'Only SUPER_ADMIN can assign the ADMIN role.' });
      }
      updateFields.role = targetRole;
    }

    const updated = await User.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    ).select('-password');

    if (!updated) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    res.status(200).json({
      status: 'success',
      message: 'User updated successfully',
      data: updated,
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Failed to update user' });
  }
};

// DELETE /api/users/:id - Delete a user from MongoDB (Protected: Admin only)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting own account
    if (req.user && req.user._id && req.user._id.toString() === id) {
      return res.status(400).json({ status: 'error', message: 'You cannot delete your own admin account.' });
    }

    await User.findByIdAndDelete(id);
    res.status(200).json({
      status: 'success',
      message: 'User deleted successfully from database',
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
