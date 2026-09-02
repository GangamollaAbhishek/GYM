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
    // Member's Assigned Trainer
    assignedTrainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    assignedTrainerName: {
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
    experience: {
      type: String,
      default: '6+ Years Experience',
    },
    bio: {
      type: String,
      default: 'Certified strength, biomechanics and performance specialist.',
    },
    rating: {
      type: String,
      default: '5.0',
    },
    pricePerSession: {
      type: String,
      default: '₹1,499',
    },
    // Extended Athlete Profile & Physical Telemetry
    avatar: {
      type: String,
      default: '',
    },
    dob: {
      type: String,
      default: '1998-05-14',
    },
    gender: {
      type: String,
      default: 'Male',
    },
    address: {
      street: { type: String, default: 'Flat 402, Titan Heights, Road No. 36, Jubilee Hills' },
      city: { type: String, default: 'Hyderabad' },
      state: { type: String, default: 'Telangana' },
      pincode: { type: String, default: '500033' },
    },
    height: {
      type: String,
      default: '178 cm',
    },
    weight: {
      type: String,
      default: '76 kg',
    },
    bodyFat: {
      type: String,
      default: '14.2%',
    },
    bloodGroup: {
      type: String,
      default: 'O+',
    },
    // Coach Management for Customer
    workoutPlan: {
      split: { type: String, default: 'Push-Pull-Legs (Hypertrophy)' },
      frequency: { type: String, default: '5 Days / Week' },
      intensity: { type: String, default: 'High Intensity RPE 8-9' },
      cardioProtocol: { type: String, default: '20 Mins Incline Treadmill Post-Lift' },
      customNotes: { type: String, default: 'Focus on explosive concentric cadence and 3s eccentric squats.' },
      dailySplits: { type: mongoose.Schema.Types.Mixed, default: null },
      updatedAt: { type: String, default: '' },
    },
    dietPlan: {
      dailyCalories: { type: String, default: '2,800 kcal' },
      protein: { type: String, default: '180g (2.2g/kg)' },
      carbs: { type: String, default: '320g' },
      fats: { type: String, default: '65g' },
      waterIntake: { type: String, default: '4.0 Liters Daily' },
      mealProtocol: { type: String, default: '4 Meals + 1 Pre-Workout Meal + 1 Post-Workout Whey Shake' },
      supplements: { type: [String], default: ['Hydrolyzed Whey Isolate', 'Creatine Creapure 5g', 'BCAA Electrolytes', 'Multivitamin + Omega 3'] },
      updatedAt: { type: String, default: '' },
    },
    trainerNotes: {
      type: [
        {
          note: String,
          date: String,
          author: String,
        }
      ],
      default: [],
    },
    progress: {
      currentWeight: { type: String, default: '76 kg' },
      targetWeight: { type: String, default: '80 kg Lean Mass' },
      bodyFat: { type: String, default: '14.2%' },
      benchPressPR: { type: String, default: '110 kg' },
      squatPR: { type: String, default: '150 kg' },
      deadliftPR: { type: String, default: '190 kg' },
      weeklyAttendanceScore: { type: String, default: '95%' },
      lastAuditDate: { type: String, default: '' },
    },
    chatMessages: {
      type: [
        {
          sender: String,
          senderName: String,
          text: String,
          time: String,
          timestamp: { type: Date, default: Date.now },
        }
      ],
      default: [],
    },
    certificateFiles: {
      type: [
        {
          id: String,
          title: String,
          issuer: String,
          issueDate: String,
          fileType: String,
          fileName: String,
          fileUrl: String,
          public_id: String,
        }
      ],
      default: [],
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

userSchema.methods.comparePassword = async function (enteredPassword) {
  return this.matchPassword(enteredPassword);
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
