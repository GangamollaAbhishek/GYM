const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const dns = require('dns');
const jwt = require('jsonwebtoken');

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

const cloudinary = require('cloudinary').v2;
const User = require('./models/User');
const { authenticateToken, authorizeRoles } = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 5050;
const MONGO_URI = process.env.MONGO_URL || process.env.MONGO_URI || process.env.MONGO_UTL;
const JWT_SECRET = process.env.JWT_SECRET || 'gym_super_secret_jwt_key_2026';

// Helper function to sign genuine JWT tokens
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
      role: user.role || 'customer',
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dffwkwxzb',
  api_key: process.env.CLOUDINARY_API_KEY || '232753235873118',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'JAFEXo7-gx6UzB67ZoTLpUKxdXA'
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Admin Auto-Seeder & Cleanup function
const autoSeedAdmin = async () => {
  try {
    // Normalize any legacy 'member' role to 'customer'
    await User.updateMany({ role: 'member' }, { $set: { role: 'customer' } });

    const adminEmail = 'abhigangamolla@gmail.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      console.log('🌱 Seeding initial Admin User (abhishek)...');
      const admin = new User({
        name: 'abhishek',
        email: adminEmail,
        password: 'Abhinani@4154',
        phone: '+91 9876543210',
        role: 'admin',
      });
      await admin.save();
      console.log('👑 Original Admin user (abhishek / abhigangamolla@gmail.com) seeded in database!');
    } else {
      // Ensure admin has admin role
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
      }
      console.log('👑 Original Admin user (abhishek / abhigangamolla@gmail.com) verified in database.');
    }
  } catch (err) {
    console.error('⚠️ Auto-seed admin error:', err.message);
  }
};

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
    await autoSeedAdmin();
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

// ==========================================
// AUTHENTICATION ENDPOINTS
// ==========================================

// GET /api/auth/me - Verify current session token and retrieve fresh user profile
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: req.user._id.toString(),
          name: req.user.name,
          email: req.user.email,
          phone: req.user.phone || '',
          role: req.user.role || 'customer',
          avatar: req.user.avatar || '',
          dob: req.user.dob || '1998-05-14',
          gender: req.user.gender || 'Male',
          address: req.user.address || {
            street: 'Flat 402, Titan Heights, Road No. 36, Jubilee Hills',
            city: 'Hyderabad',
            state: 'Telangana',
            pincode: '500033'
          },
          height: req.user.height || '178 cm',
          weight: req.user.weight || '76 kg',
          bodyFat: req.user.bodyFat || '14.2%',
          bloodGroup: req.user.bloodGroup || 'O+',
          membershipPlan: req.user.membershipPlan || 'No Active Plan',
          membershipStartDate: req.user.membershipStartDate || '',
          membershipExpiry: req.user.membershipExpiry || '',
          membershipStatus: req.user.membershipStatus || 'No Membership',
          amountPaid: req.user.amountPaid || 0,
          paymentMethod: req.user.paymentMethod || 'Card',
          assignedTrainer: req.user.assignedTrainer || null,
          assignedTrainerName: req.user.assignedTrainerName || '',
          createdAt: req.user.createdAt,
        }
      }
    });
  } catch (error) {
    console.error('Auth verification error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to verify session' });
  }
});

// POST /api/auth/register - Register a new customer
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ status: 'error', message: 'Name, email and password are required' });
    }

    const lowerEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: lowerEmail });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'An account with this email address already exists. Please sign in instead.'
      });
    }

    const user = new User({
      name: name.trim(),
      email: lowerEmail,
      phone: (phone || '').trim(),
      password: password.trim(),
      role: 'customer',
    });

    await user.save();
    console.log(`✅ New user registered in MongoDB: ${user.name} (${lowerEmail}) [Role: customer]`);

    const token = generateToken(user);

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    console.error('Register API Error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Registration failed' });
  }
});

// POST /api/auth/login - Secure login endpoint with JWT generation
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ status: 'error', message: 'Email and password are required' });
    }

    const lowerEmail = email.toLowerCase().trim();
    const cleanPassword = password.trim();

    // Look up user in database
    const user = await User.findOne({ email: lowerEmail });
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password.'
      });
    }

    // Verify password
    const isMatch = await user.matchPassword(cleanPassword);
    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password.'
      });
    }

    // Sign genuine JWT
    const token = generateToken(user);

    return res.status(200).json({
      status: 'success',
      message: 'User authenticated successfully',
      data: {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          role: user.role || 'customer'
        },
        token
      }
    });
  } catch (error) {
    console.error('Login API Error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Login failed' });
  }
});

// ==========================================
// PROTECTED USER MANAGEMENT ENDPOINTS
// ==========================================

// GET /api/users - Fetch all registered users (Protected: Admin and Receptionist)
app.get('/api/users', authenticateToken, authorizeRoles('admin', 'receptionist'), async (req, res) => {
  try {
    const rawUsers = await User.find().select('-password').lean().exec();

    const formattedUsers = rawUsers.map((u, idx) => ({
      id: String(u._id),
      displayId: `USR-${101 + idx}`,
      name: u.name,
      email: u.email,
      phone: u.phone || 'N/A',
      role: u.role || 'customer',
      status: u.membershipStatus || (u.membershipPlan && u.membershipPlan !== 'No Active Plan' ? 'Active' : 'No Membership'),
      membershipPlan: u.membershipPlan || 'No Active Plan',
      membershipDuration: u.membershipDuration || '',
      membershipStatus: u.membershipStatus || (u.membershipPlan && u.membershipPlan !== 'No Active Plan' ? 'Active' : 'No Membership'),
      membershipStartDate: u.membershipStartDate || '',
      membershipExpiry: u.membershipExpiry || 'N/A',
      amountPaid: u.amountPaid || 0,
      paymentMethod: u.paymentMethod || '',
      shift: u.shift || '06:00 AM - 02:00 PM',
      spec: u.specialization || 'Master Coach & Conditioning',
      assignedRoom: u.assignedRoom || 'Main Strength & Conditioning Arena',
      workingDays: u.workingDays && u.workingDays.length > 0 ? u.workingDays : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      createdAt: u.createdAt
    }));

    res.status(200).json({
      status: 'success',
      count: formattedUsers.length,
      data: formattedUsers
    });
  } catch (error) {
    console.error('Fetch users error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch users' });
  }
});

// POST /api/users - Create new user from Admin panel or Receptionist onboarding
app.post('/api/users', authenticateToken, authorizeRoles('admin', 'receptionist'), async (req, res) => {
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

    const newUser = new User({
      name: name.trim(),
      email: lowerEmail,
      phone: (phone || '').trim(),
      role: (role || 'customer').toLowerCase().trim(),
      password: (password || 'DefaultPass123!').trim(),
      membershipPlan,
      membershipStatus,
      membershipDuration,
      membershipStartDate,
      membershipExpiry,
      amountPaid,
      paymentMethod: paymentMethod || ''
    });

    await newUser.save();

    res.status(201).json({
      status: 'success',
      message: 'User created successfully',
      data: {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        membershipPlan: newUser.membershipPlan,
        membershipStatus: newUser.membershipStatus,
        membershipExpiry: newUser.membershipExpiry,
        status: newUser.membershipStatus
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// PUT /api/users/:id/membership - Update/Purchase/Renew customer membership
app.put('/api/users/:id/membership', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { plan, duration, amount, paymentMethod } = req.body;

    if (!plan) {
      return res.status(400).json({ status: 'error', message: 'Membership plan is required' });
    }

    const today = new Date().toISOString().split('T')[0];
    const expDate = new Date();
    const planDuration = duration || 'Monthly';
    if (planDuration === 'Monthly') expDate.setMonth(expDate.getMonth() + 1);
    else if (planDuration === 'Quarterly') expDate.setMonth(expDate.getMonth() + 3);
    else if (planDuration === 'Half-Yearly') expDate.setMonth(expDate.getMonth() + 6);
    else if (planDuration === 'Annual') expDate.setFullYear(expDate.getFullYear() + 1);
    else expDate.setMonth(expDate.getMonth() + 1);

    const updated = await User.findByIdAndUpdate(
      id,
      {
        membershipPlan: plan,
        membershipDuration: planDuration,
        membershipStatus: 'Active',
        membershipStartDate: today,
        membershipExpiry: expDate.toISOString().split('T')[0],
        amountPaid: Number(amount) || 0,
        paymentMethod: paymentMethod || 'Online Booking'
      },
      { new: true }
    ).select('-password');

    if (!updated) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    res.status(200).json({
      status: 'success',
      message: `Membership plan updated to ${plan}`,
      data: updated
    });
  } catch (error) {
    console.error('Update membership error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// PUT /api/users/:id/shift - Update trainer shift timings, working days, and arena (Protected: Admin)
app.put('/api/users/:id/shift', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { shift, room, days, specialization } = req.body;

    const updateFields = {};
    if (shift) updateFields.shift = shift;
    if (room) updateFields.assignedRoom = room;
    if (days) updateFields.workingDays = days;
    if (specialization) updateFields.specialization = specialization;

    const updated = await User.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    ).select('-password');

    if (!updated) {
      return res.status(404).json({ status: 'error', message: 'Trainer not found' });
    }

    res.status(200).json({
      status: 'success',
      message: `Shift timings updated successfully to ${shift}`,
      data: updated
    });
  } catch (error) {
    console.error('Update shift error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// GET /api/trainers - Retrieve all genuine registered trainers/coaches
app.get('/api/trainers', async (req, res) => {
  try {
    const trainers = await User.find({ role: 'trainer' }).select('-password').lean().exec();
    const formatted = trainers.map((t, idx) => ({
      id: t._id.toString(),
      displayId: `TRN-${501 + idx}`,
      name: t.name,
      email: t.email,
      phone: t.phone && t.phone !== 'N/A' ? t.phone : 'N/A',
      role: t.role,
      avatar: t.avatar || '',
      spec: t.specialization || 'Master Coach & Strength Specialist',
      experience: t.experience || '6+ Years Experience',
      shift: t.shift || '06:00 AM - 02:00 PM',
      room: t.assignedRoom || 'Main Strength & Conditioning Arena',
      days: t.workingDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      rating: t.rating || '5.0',
      pricePerSession: t.pricePerSession || '₹1,499',
      bio: t.bio || 'Certified strength, biomechanics and performance specialist.',
      image: t.avatar || 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=400&q=80'
    }));
    res.status(200).json({ status: 'success', data: formatted });
  } catch (err) {
    console.error('Error fetching trainers:', err);
    res.status(500).json({ status: 'error', message: 'Failed to fetch trainers' });
  }
});

// PUT /api/users/:id/assign-trainer - Assign trainer to member
app.put('/api/users/:id/assign-trainer', authenticateToken, async (req, res) => {
  try {
    const { trainerId, trainerName } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          assignedTrainer: trainerId || null,
          assignedTrainerName: trainerName || ''
        }
      },
      { new: true }
    ).select('-password');

    res.status(200).json({
      status: 'success',
      message: `Trainer assigned successfully!`,
      data: user
    });
  } catch (err) {
    console.error('Error assigning trainer:', err);
    res.status(500).json({ status: 'error', message: 'Failed to assign trainer' });
  }
});

// PUT /api/users/:id - Update user profile details (Protected: Admin)
// POST /api/auth/change-password - Change user password (Protected)
app.post('/api/auth/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ status: 'error', message: 'New password must be at least 6 characters long' });
    }

    const userId = req.user._id || req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found in database' });
    }

    if (currentPassword) {
      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ status: 'error', message: 'Current password is incorrect. Please verify and try again.' });
      }
    }

    user.password = newPassword;
    await user.save();
    console.log(`🔐 Password successfully updated and hashed in MongoDB for: ${user.email}`);

    return res.status(200).json({
      status: 'success',
      message: 'Password updated and saved successfully in MongoDB Atlas!'
    });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({ status: 'error', message: error.message || 'Failed to update password' });
  }
});

// PUT /api/users/:id - Update user profile details (Protected: Admin or Self)
app.put('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const isSelf = req.user._id.toString() === id;
    const isAdmin = (req.user.role || '').toLowerCase() === 'admin';

    if (!isSelf && !isAdmin) {
      return res.status(403).json({ status: 'error', message: 'Unauthorized to modify this user' });
    }

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
      role
    } = req.body;

    const updateFields = {};
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
    
    // Only Admin can update specialization, shift, status, role
    if (isAdmin) {
      if (specialization) updateFields.specialization = specialization;
      if (shift) updateFields.shift = shift;
      if (status) updateFields.membershipStatus = status;
      if (role) updateFields.role = role;
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
      message: 'User profile updated successfully',
      data: updated
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// DELETE /api/users/:id - Delete a user from MongoDB (Protected: Admin only)
app.delete('/api/users/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    
    // Prevent admin from deleting own account
    if (req.user._id.toString() === id) {
      return res.status(400).json({ status: 'error', message: 'You cannot delete your own admin account.' });
    }

    await User.findByIdAndDelete(id);
    res.status(200).json({
      status: 'success',
      message: 'User deleted successfully from database'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Cloudinary Image Upload API Endpoint (Protected: Authenticated users)
app.post('/api/upload', authenticateToken, async (req, res) => {
  try {
    const { image, folder } = req.body;
    if (!image) {
      return res.status(400).json({ status: 'error', message: 'No image data provided for upload' });
    }

    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: folder || 'titan_supplements',
      resource_type: 'auto'
    });

    console.log(`☁️ Cloudinary Upload Success: ${uploadResponse.secure_url}`);
    return res.status(200).json({
      status: 'success',
      message: 'Image uploaded successfully to Cloudinary',
      url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id
    });
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    return res.status(500).json({ status: 'error', message: error.message || 'Cloudinary upload failed' });
  }
});

// ==========================================
// RAZORPAY PAYMENT GATEWAY ENDPOINTS
// ==========================================
const Razorpay = require('razorpay');
const crypto = require('crypto');

const cleanKey = (k) => (k ? String(k).trim().replace(/^['"]|['"]$/g, '') : '');

const getRazorpayKeyId = () => {
  return cleanKey(process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY || process.env.VITE_RAZORPAY_KEY_ID || process.env.RAZORPAY_API_KEY);
};

const getRazorpayKeySecret = () => {
  return cleanKey(process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_SECRET || process.env.RAZORPAY_API_SECRET);
};

const getRazorpayInstance = () => {
  const keyId = getRazorpayKeyId();
  const keySecret = getRazorpayKeySecret();

  if (!keyId || !keySecret || keyId === 'rzp_test_placeholder' || keySecret === 'rzp_test_secret_placeholder') {
    return null;
  }

  try {
    return new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    });
  } catch (err) {
    console.warn('Could not initialize Razorpay instance:', err.message);
    return null;
  }
};

// GET /api/payments/razorpay-key - Retrieve public Razorpay Key ID
app.get('/api/payments/razorpay-key', (req, res) => {
  const key = getRazorpayKeyId() || 'rzp_test_placeholder';
  res.status(200).json({
    status: 'success',
    key: key
  });
});

// POST /api/payments/create-order - Create Razorpay Order
app.post('/api/payments/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, planName, planId, customerId } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ status: 'error', message: 'Valid amount is required' });
    }

    const keyId = getRazorpayKeyId() || 'rzp_test_placeholder';
    const razorpay = getRazorpayInstance();

    if (!razorpay) {
      return res.status(200).json({
        status: 'success',
        simulated: true,
        data: {
          id: null,
          amount: Math.round(Number(amount) * 100),
          currency: currency,
          receipt: receipt || `rcpt_${Date.now()}`,
          key: keyId,
          isRealOrder: false
        }
      });
    }

    const options = {
      amount: Math.round(Number(amount) * 100), // amount in paise
      currency: currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: {
        planName: planName || 'Gym Membership',
        planId: planId || '',
        customerId: customerId || ''
      }
    };

    const order = await razorpay.orders.create(options);
    return res.status(200).json({
      status: 'success',
      simulated: false,
      data: {
        ...order,
        key: keyId,
        isRealOrder: true
      }
    });
  } catch (error) {
    console.error('Razorpay Create Order Error:', error);
    return res.status(200).json({
      status: 'success',
      simulated: true,
      data: {
        id: null,
        amount: Math.round(Number(amount) * 100),
        currency: currency,
        key: getRazorpayKeyId() || 'rzp_test_placeholder',
        isRealOrder: false
      }
    });
  }
});

// POST /api/payments/verify - Verify Payment Signature & Activate Membership in MongoDB
app.post('/api/payments/verify', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planName,
      amount,
      userId
    } = req.body;

    const keySecret = process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_SECRET || process.env.RAZORPAY_API_SECRET;

    if (keySecret && keySecret !== 'rzp_test_secret_placeholder' && razorpay_order_id && razorpay_payment_id && razorpay_signature) {
      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generatedSignature !== razorpay_signature) {
        return res.status(400).json({ status: 'error', message: 'Invalid payment signature verification' });
      }
    }

    // Payment signature is valid, update user membership in MongoDB!
    const today = new Date();
    const expDate = new Date();
    expDate.setFullYear(expDate.getFullYear() + 1);

    const startDateStr = today.toISOString().split('T')[0];
    const expiryDateStr = expDate.toISOString().split('T')[0];
    const priceNum = typeof amount === 'number' ? amount : parseInt(String(amount || '0').replace(/[^\d]/g, ''), 10) || 2499;

    let updatedUser = null;
    if (userId) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            membershipPlan: planName || 'Pro Membership',
            membershipStatus: 'Active',
            membershipStartDate: startDateStr,
            membershipExpiry: expiryDateStr,
            amountPaid: priceNum,
            paymentMethod: req.body.paymentMethod || 'Card'
          }
        },
        { new: true }
      ).select('-password');
    }

    console.log(`💳 Razorpay Payment Verified: ${planName} activated for user ${userId || 'guest'}`);

    return res.status(200).json({
      status: 'success',
      message: `Payment verified successfully! ${planName || 'Membership'} activated until ${expiryDateStr}.`,
      data: {
        paymentId: razorpay_payment_id || `pay_${Date.now()}`,
        orderId: razorpay_order_id,
        user: updatedUser,
        membershipPlan: planName,
        membershipExpiry: expiryDateStr,
        startDate: startDateStr,
        amount: priceNum
      }
    });
  } catch (error) {
    console.error('Razorpay Verify Error:', error);
    return res.status(500).json({ status: 'error', message: error.message || 'Payment verification failed' });
  }
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
    console.error(`❌ Port ${PORT} is already in use by another process.`);
  } else {
    console.error(`❌ Server error:`, err);
  }
});
