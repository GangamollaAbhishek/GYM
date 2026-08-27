const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['admin', 'customer', 'receptionist', 'trainer'],
      default: 'customer',
    },
    // Membership Management Fields
    membershipPlan: {
      type: String,
      default: 'No Active Plan',
    },
    membershipDuration: {
      type: String,
      default: '',
    },
    membershipStatus: {
      type: String,
      default: 'No Membership',
    },
    membershipStartDate: {
      type: String,
      default: '',
    },
    membershipExpiry: {
      type: String,
      default: '',
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
    paymentMethod: {
      type: String,
      default: '',
    },
    // Trainer Shift & Schedule Management Fields
    shift: {
      type: String,
      default: '06:00 AM - 02:00 PM',
    },
    specialization: {
      type: String,
      default: 'Master Coach & Conditioning',
    },
    assignedRoom: {
      type: String,
      default: 'Main Strength & Conditioning Arena',
    },
    workingDays: {
      type: [String],
      default: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    },
  },
  {
    timestamps: true,
  }
);

// Method to match entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (this.password === enteredPassword) return true;
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (e) {
    return false;
  }
};

// Pre-save hook to hash password and normalize role
userSchema.pre('save', async function (next) {
  if (this.role === 'member') {
    this.role = 'customer';
  }
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
