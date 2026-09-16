const User = require('../../models/User');
const { generateToken } = require('../../utils/token');

// GET /api/auth/me - Verify current session token and retrieve fresh user profile
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id || req.user._id).select('-password').lean();
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user._id.toString(),
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          role: user.role || 'customer',
          avatar: user.avatar || '',
          dob: user.dob || '1998-05-14',
          gender: user.gender || 'Male',
          address: user.address || {
            street: 'Flat 402, Titan Heights, Road No. 36, Jubilee Hills',
            city: 'Hyderabad',
            state: 'Telangana',
            pincode: '500033',
          },
          height: user.height || '178 cm',
          weight: user.weight || '76 kg',
          bodyFat: user.bodyFat || '14.2%',
          bloodGroup: user.bloodGroup || 'O+',
          membershipPlan: user.membershipPlan || 'No Active Plan',
          membershipStatus: user.membershipStatus || 'No Membership',
          membershipStartDate: user.membershipStartDate || '',
          membershipExpiry: user.membershipExpiry || '',
          amountPaid: user.amountPaid || 0,
          paymentMethod: user.paymentMethod || 'Card',
          assignedTrainer: user.assignedTrainer ? String(user.assignedTrainer) : null,
          assignedTrainerName: user.assignedTrainerName || '',
          createdAt: user.createdAt,
          shift: user.shift || '06:00 AM - 02:00 PM',
          specialization: user.specialization || 'Master Coach & Conditioning',
          assignedRoom: user.assignedRoom || 'Main Strength & Conditioning Arena',
          workingDays: user.workingDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          breakTime: user.breakTime || '01:00 PM - 02:00 PM',
          experience: user.experience || '6+ Years Experience',
          bio: user.bio || 'Certified strength, biomechanics and performance specialist.',
          rating: user.rating || '5.0',
          pricePerSession: user.pricePerSession || '₹1,500',
          workoutPlan: user.workoutPlan,
          dietPlan: user.dietPlan,
          trainerNotes: user.trainerNotes || [],
          chatMessages: user.chatMessages || [],
        },
      },
    });
  } catch (error) {
    console.error('Auth verification error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to verify session' });
  }
};

// POST /api/auth/register - Register a new customer
const register = async (req, res) => {
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
        message: 'An account with this email address already exists. Please sign in instead.',
      });
    }

    // Security rule: Normal user registration strictly defaults to CUSTOMER.
    // Elevated roles (SUPER_ADMIN, ADMIN, RECEPTIONIST, TRAINER) can never be claimed via public register.
    const user = new User({
      name: name.trim(),
      email: lowerEmail,
      phone: (phone || '').trim(),
      password: password.trim(),
      role: 'CUSTOMER',
      activities: ['GYM'],
      branchId: 'main_branch',
    });

    await user.save();
    console.log(`✅ New user registered in MongoDB: ${user.name} (${lowerEmail}) [Role: CUSTOMER]`);

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
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Register API Error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Registration failed' });
  }
};

// POST /api/auth/login - Secure login endpoint with JWT generation
const login = async (req, res) => {
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
        message: 'Invalid email or password.',
      });
    }

    // Verify password
    const isMatch = await user.matchPassword(cleanPassword);
    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password.',
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
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          role: user.role || 'customer',
          avatar: user.avatar || '',
          membershipPlan: user.membershipPlan || 'No Active Plan',
          membershipStatus: user.membershipStatus || 'No Membership',
          membershipStartDate: user.membershipStartDate || '',
          membershipExpiry: user.membershipExpiry || '',
          amountPaid: user.amountPaid || 0,
          paymentMethod: user.paymentMethod || '',
          assignedTrainer: user.assignedTrainer ? String(user.assignedTrainer) : null,
          assignedTrainerName: user.assignedTrainerName || '',
          shift: user.shift || '',
          specialization: user.specialization || '',
        },
        token,
      },
    });
  } catch (error) {
    console.error('Login API Error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Login failed' });
  }
};

// POST /api/auth/change-password - Change user password (Protected)
const changePassword = async (req, res) => {
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
      message: 'Password updated and saved successfully in MongoDB Atlas!',
    });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({ status: 'error', message: error.message || 'Failed to update password' });
  }
};

module.exports = {
  getMe,
  register,
  login,
  changePassword,
};
