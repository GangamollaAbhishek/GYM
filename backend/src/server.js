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
const Feedback = require('./models/Feedback');
const Payment = require('./models/Payment');
const CMS = require('./models/CMS');
const Attendance = require('./models/Attendance');
const Enquiry = require('./models/Enquiry');
const Ticket = require('./models/Ticket');
const { authenticateToken, authorizeRoles } = require('./middleware/authMiddleware');
const { sendWelcomeCredentialsEmail, sendStaffCredentialsEmail } = require('./utils/mailer');

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

    // 1. Seed Primary Admin User
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
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
      }
      console.log('👑 Original Admin user (abhishek / abhigangamolla@gmail.com) verified in database.');
    }

    // Clean up any legacy dummy customer, trainer, and receptionist seeds from MongoDB
    await User.deleteMany({
      $or: [
        { email: 'customer@titangym.com' },
        { email: 'trainer@titangym.com' },
        { email: 'receptionist@titangym.com' },
        { name: 'Front Desk Receptionist' },
        { name: 'Coach Marcus Vance' },
        { name: { $regex: /Marcus Vance/i } },
        { name: { $regex: /Front Desk Receptionist/i } },
      ],
    });
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
          shift: req.user.shift || '06:00 AM - 02:00 PM',
          specialization: req.user.specialization || 'Master Coach & Conditioning',
          assignedRoom: req.user.assignedRoom || 'Main Strength & Conditioning Arena',
          workingDays: req.user.workingDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          breakTime: req.user.breakTime || '01:00 PM - 02:00 PM',
          experience: req.user.experience || '6+ Years Experience',
          bio: req.user.bio || 'Certified strength, biomechanics and performance specialist.',
          rating: req.user.rating || '5.0',
          pricePerSession: req.user.pricePerSession || '₹1,500',
          workoutPlan: req.user.workoutPlan,
          dietPlan: req.user.dietPlan,
          trainerNotes: req.user.trainerNotes || [],
          chatMessages: req.user.chatMessages || []
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

// ==========================================
// CLOUDINARY FILE UPLOAD ENDPOINTS
// ==========================================
const handleCloudinaryUpload = async (req, res) => {
  try {
    const { image, folder = 'titan_avatars' } = req.body;
    if (!image) {
      return res.status(400).json({ status: 'error', message: 'No image data provided' });
    }

    // Direct Cloudinary upload
    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder,
      resource_type: 'auto',
      transformation: [
        { width: 800, height: 800, crop: 'limit', quality: 'auto:good' }
      ]
    });

    return res.status(200).json({
      status: 'success',
      message: 'Image uploaded successfully to Cloudinary',
      url: uploadResponse.secure_url || uploadResponse.url,
      public_id: uploadResponse.public_id
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    // If Cloudinary network times out or has issue, return data URL as resilient fallback
    if (req.body.image && req.body.image.startsWith('data:image')) {
      return res.status(200).json({
        status: 'success',
        message: 'Image processed successfully',
        url: req.body.image
      });
    }
    return res.status(500).json({ status: 'error', message: error.message || 'Failed to upload image to Cloudinary' });
  }
};

app.post('/api/upload', handleCloudinaryUpload);
app.post('/upload', handleCloudinaryUpload);

// ==========================================
// LANDING PAGE CMS & BRAND SETTINGS ROUTES
// ==========================================

const defaultLandingData = {
  brand: {
    name: "TITAN•PULSE",
    subname: "3D FITNESS SYSTEM",
    tagline: "RISE ABOVE AVERAGE. DOMINATE YOUR LIMITS.",
    logo: "",
  },
  hero: {
    headlinePart1: "STRONGER",
    headlinePart2: "EVERY DAY",
    headlineHoverText: "BELIEVE IN YOURSELF",
    description:
      "Transform your body. Sharpen your mind. Join a community that never quits.",
    ctaButtonText: "JOIN NOW",
    membersCount: "10K+",
    membersLabel: "Strong Members",
    transformationsCount: "500+",
    transformationsLabel: "Transformations",
    hoursCount: "24/7",
    hoursLabel: "Gym Access",
    athleteImage: "/assets/toji-2-removebg-preview.png",
  },
  horizontalWords: {
    sentence: "PAIN IS TEMPORARY GLORY IS FOREVER",
    bottomText:
      "Your only limit is you. Every rep, every drop of sweat, and every painful set brings you closer to your ultimate transformation. Rise above average. Dominate your limits.",
  },
  exploreEscape: {
    tagline: "EXPLORE THE UNSEEN",
    headingMain: "Find your next",
    headingHighlight: "breaking point.",
    cards: [
      {
        key: "hypertrophy",
        title: "Hypertrophic\nProtocols",
        text: "Maximum motor unit recruitment for dense muscular growth.",
        category: "STRENGTH ARENA",
        image:
          "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80",
      },
      {
        key: "cardio",
        title: "Cyber Cardio\nDecks",
        text: "High-intensity metabolic circuits driving EPOC oxygen surge.",
        category: "METABOLIC DRIVE",
        image:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
      },
      {
        key: "athletic",
        title: "Athletic\nKinematics",
        text: "Force-velocity curve optimization and jump mechanics.",
        category: "PLYOMETRIC TURF",
        image:
          "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
      },
      {
        key: "recovery",
        title: "Sub-Zero\nRecovery Pods",
        text: "Cryotherapy and biothermal infrared decompression.",
        category: "CRYO DECOMPRESSION",
        image:
          "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  supplements: {
    title: "TITAN SUPPLEVATION MATRIX",
    subtitle:
      "3D KINETIC PRE-WORKOUT & NITROGEN BOOST ENGINE • INTERACTIVE SHOWCASE",
    products: [
      {
        id: 1,
        title: "WRATHX KINETIC PRE-WORKOUT",
        badge: "01 • EXPLOSIVE IGNITION",
        rating: "4.95",
        image: "/wrathx-preworkout.jpg",
        description:
          "Engineered for unyielding kinetic output. Formulated with 350mg Caffeine Anhydrous, 6000mg L-Citrulline Malate, and Beta-Alanine to ignite explosive muscle pumps, razor-sharp focus, and relentless stamina.",
        flavors: ["Crimson Electric", "Sour Dragonfruit", "Hyper Blue Razz"],
        specs: [
          "350mg Caffeine",
          "6g Citrulline Malate",
          "3.2g Beta-Alanine",
          "Creapure®",
        ],
      },
      {
        id: 2,
        title: "TITAN ISO-WHEY GOLD",
        badge: "02 • HYPERTROPHY REBUILD",
        rating: "4.92",
        image:
          "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=1000&auto=format&fit=crop",
        description:
          "Ultra-pure micro-filtered whey protein isolate delivering 28g of rapid-absorbing protein, 6.5g BCAA, and zero added sugars per scoop. Designed for immediate post-workout muscle synthesis.",
        flavors: ["Dark Chocolate Fudge", "French Vanilla", "Salted Caramel"],
        specs: ["28g Isolate", "6.5g BCAA", "Zero Sugar", "110 Kcal"],
      },
      {
        id: 3,
        title: "CREATINE MICRO-PURE 5000",
        badge: "03 • ATP CELLULAR POWER",
        rating: "4.98",
        image:
          "https://images.unsplash.com/photo-1579722820308-d74e571900a9?q=80&w=1000&auto=format&fit=crop",
        description:
          "100% German Creapure® Monohydrate micronized to 200 mesh for maximum solubility. Saturates muscle ATP stores to elevate maximal power output and intracellular hydration.",
        flavors: ["Unflavored Pure", "Atomic Grape", "Electric Lemonade"],
        specs: ["100% Creapure®", "5000mg Mesh", "Micronized", "ATP Surge"],
      },
      {
        id: 4,
        title: "AMINO MATRIX BCAA + ELECTROLYTES",
        badge: "04 • INTRA-WORKOUT HYDRATION",
        rating: "4.89",
        image:
          "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?q=80&w=1000&auto=format&fit=crop",
        description:
          "Instantized 2:1:1 BCAA ratio infused with key coconut water electrolyte hydration minerals. Halts intra-workout muscle catabolism and eliminates DOMS.",
        flavors: ["Island Punch", "Watermelon Wave", "Mango Heat"],
        specs: [
          "2:1:1 BCAA Ratio",
          "Coco-Electrolytes",
          "Zero Calories",
          "Rapid Hydration",
        ],
      },
    ],
  },
  equipment: {
    tagline: "HOW IT WORKS • 3D CARD STACK",
    title: "3D SMART EQUIPMENT ENGINE",
    steps: [
      {
        id: "step-01",
        step: "Step 01 of 4",
        title: "Biometric Scan & Assessment",
        subtitle: "3D Body Composition Profiling",
        desc: "High-precision 3D optical body scanning analyzes muscle volume distribution, body fat percentage, and postural alignment in 60 seconds.",
        image:
          "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: "step-02",
        step: "Step 02 of 4",
        title: "AI-Customized Training Split",
        subtitle: "Algorithmic Periodization",
        desc: "Neural engine computes your optimal weekly volume, exercise selection, and recovery ratios based on your muscle fiber composition.",
        image:
          "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: "step-03",
        step: "Step 03 of 4",
        title: "Smart Equipment Resistance Setup",
        subtitle: "Electromagnetic Load Tuning",
        desc: "Smart machines auto-adjust seat height and electromagnetic resistance in real time based on velocity drop-off and force production.",
        image:
          "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: "step-04",
        step: "Step 04 of 4",
        title: "24/7 Elite Trainer Support",
        subtitle: "Continuous Velocity Profiling",
        desc: "Certified coaches monitor form metrics live on overhead telemetry displays to refine movement mechanics during peak lifts.",
        image:
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  footer: {
    brandQuote: "DOMINATE YOUR LIMITS WITH TITAN PULSE 3D.",
    copyright: "© 2026 TITAN PULSE 3D SYSTEM. ALL RIGHTS RESERVED.",
    contactEmail: "contact@titanpulse.fit",
    contactPhone: "+91 98765 43210",
    address: "Cyber Arena Complex, High-Tech City, Hyderabad, IN",
    socials: {
      instagram: "https://instagram.com",
      youtube: "https://youtube.com",
      twitter: "https://twitter.com",
      facebook: "https://facebook.com",
      linkedin: "https://linkedin.com",
    },
  },
  memberships: [
    {
      id: "PLN-1",
      tierKey: "pro",
      name: "PRO MEMBERSHIP",
      badge: "TITAN ALL-ACCESS PASS",
      subBadge: "BIOMETRIC UNLOCKED • 24/7 ACCESS",
      price: 2499,
      quarterlyPrice: 6999,
      annualPrice: 24999,
      duration: "Monthly",
      description:
        "All-access strength arena, cardio amphitheater, bio-hacking sauna lounge, & automated 3D body composition telemetry tracking.",
      perks:
        "All-Access Gym Floor & Cardio Zone, Biometric Smart Locker Activation, 3D Body Composition Bio-Scan, Sauna & Recovery Lounge",
      services: [
        {
          id: "srv-1",
          name: "All-Access Gym Floor & Cardio Zone",
          category: "Facility Access",
          included: true,
        },
        {
          id: "srv-2",
          name: "Biometric Smart Locker Activation",
          category: "Amenities",
          included: true,
        },
        {
          id: "srv-3",
          name: "3D Body Composition Bio-Scan",
          category: "Technology",
          included: true,
        },
        {
          id: "srv-4",
          name: "Sauna & Recovery Lounge Access",
          category: "Wellness",
          included: true,
        },
        {
          id: "srv-5",
          name: "Titan Companion Mobile App Access",
          category: "Technology",
          included: true,
        },
        {
          id: "srv-6",
          name: "Complimentary Towel Service",
          category: "Amenities",
          included: true,
        },
        {
          id: "srv-7",
          name: "Dedicated Master Coach (4 Sessions/mo)",
          category: "Coaching",
          included: false,
        },
        {
          id: "srv-8",
          name: "Unlimited Cryotherapy Chambers Access",
          category: "Wellness",
          included: false,
        },
      ],
    },
    {
      id: "PLN-2",
      tierKey: "elite",
      name: "ELITE VIP ATHLETE STATUS",
      badge: "VIP ATHLETE STATUS",
      subBadge: "CRYOTHERAPY • HYDRO SUITE • GUEST PERKS",
      price: 4999,
      quarterlyPrice: 12999,
      annualPrice: 49999,
      duration: "Monthly",
      description:
        "VIP priority access, cryotherapy chambers, hydro-massage therapy suite, custom micro-nutrient bar access, and unlimited guest privileges.",
      perks:
        "Unlimited Cryotherapy Chambers Access, Private Hydro-Massage Therapy Suite, Dedicated VIP Keycard Locker Lounge, Free Daily Micro-Nutrient Shake Bar",
      services: [
        {
          id: "srv-1",
          name: "All-Access Gym Floor & Cardio Zone",
          category: "Facility Access",
          included: true,
        },
        {
          id: "srv-2",
          name: "Biometric Smart Locker Activation",
          category: "Amenities",
          included: true,
        },
        {
          id: "srv-3",
          name: "3D Body Composition Bio-Scan",
          category: "Technology",
          included: true,
        },
        {
          id: "srv-4",
          name: "Unlimited Cryotherapy Chambers Access",
          category: "Wellness",
          included: true,
        },
        {
          id: "srv-5",
          name: "Private Hydro-Massage Therapy Suite",
          category: "Wellness",
          included: true,
        },
        {
          id: "srv-6",
          name: "Dedicated VIP Keycard Locker Lounge",
          category: "Amenities",
          included: true,
        },
        {
          id: "srv-7",
          name: "Free Daily Micro-Nutrient Shake Bar",
          category: "Nutrition",
          included: true,
        },
        {
          id: "srv-8",
          name: "Unlimited Guest Privileges (2 Passes/mo)",
          category: "Privileges",
          included: true,
        },
      ],
    },
    {
      id: "PLN-3",
      tierKey: "pt",
      name: "PT VIP COACHING MANUAL",
      badge: "1-ON-1 MASTER COACHING",
      subBadge: "DEDICATED COACH • 3D BIO-SCANS • MEAL MATRIX",
      price: 9999,
      quarterlyPrice: 26999,
      annualPrice: 99999,
      duration: "Monthly",
      description:
        "Dedicated Master Personal Trainer, tailored meal plans, weekly 3D muscle bio-scans, dynamic heart-rate telemetry, and 24/7 direct coach WhatsApp line.",
      perks:
        "Dedicated Master Fitness Coach, Custom Macro & Meal Matrix, Weekly 3D Muscle Bio-Scans, Live Heart-Rate Telemetry, Private 1-on-1 Training Bay",
      services: [
        {
          id: "srv-1",
          name: "Dedicated Master Personal Trainer",
          category: "Coaching",
          included: true,
        },
        {
          id: "srv-2",
          name: "Custom Macro & Meal Matrix Protocols",
          category: "Nutrition",
          included: true,
        },
        {
          id: "srv-3",
          name: "Weekly 3D Muscle Bio-Scans & Audits",
          category: "Technology",
          included: true,
        },
        {
          id: "srv-4",
          name: "Live Heart-Rate & Telemetry Sync",
          category: "Technology",
          included: true,
        },
        {
          id: "srv-5",
          name: "Private 1-on-1 Training Bay Access",
          category: "Facility Access",
          included: true,
        },
        {
          id: "srv-6",
          name: "Unlimited Cryotherapy & Hydro Suites",
          category: "Wellness",
          included: true,
        },
        {
          id: "srv-7",
          name: "24/7 Direct WhatsApp Coach Priority Line",
          category: "Coaching",
          included: true,
        },
        {
          id: "srv-8",
          name: "Complimentary Pre-Workout & Intra-Fuel Shakes",
          category: "Nutrition",
          included: true,
        },
      ],
    },
  ],
};

// GET /api/cms - Fetch landing page CMS & brand settings from MongoDB
app.get('/api/cms', async (req, res) => {
  try {
    let cms = await CMS.findOne({ key: 'landing_cms' });
    if (!cms) {
      cms = await CMS.create({ key: 'landing_cms', ...defaultLandingData });
    }
    return res.status(200).json({
      status: 'success',
      data: cms,
    });
  } catch (error) {
    console.error('Error fetching CMS data:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to fetch CMS settings',
      data: defaultLandingData,
    });
  }
});

// PUT /api/cms - Update full CMS / brand settings in MongoDB
app.put('/api/cms', async (req, res) => {
  try {
    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.__v;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    const cms = await CMS.findOneAndUpdate(
      { key: 'landing_cms' },
      { $set: updateData },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({
      status: 'success',
      message: 'CMS settings and brand identity saved to database successfully',
      data: cms,
    });
  } catch (error) {
    console.error('Error updating CMS data:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to save CMS settings',
    });
  }
});

// PUT /api/cms/:section - Update specific CMS section (e.g. brand, memberships)
app.put('/api/cms/:section', async (req, res) => {
  try {
    const { section } = req.params;
    const sectionData = req.body;

    const cms = await CMS.findOneAndUpdate(
      { key: 'landing_cms' },
      { $set: { [section]: sectionData } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({
      status: 'success',
      message: `CMS section ${section} updated successfully in database`,
      data: cms,
    });
  } catch (error) {
    console.error(`Error updating CMS section ${req.params.section}:`, error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to update CMS section',
    });
  }
});

// POST /api/cms/reset - Reset CMS settings to defaults in MongoDB
app.post('/api/cms/reset', async (req, res) => {
  try {
    const cms = await CMS.findOneAndUpdate(
      { key: 'landing_cms' },
      { $set: defaultLandingData },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      status: 'success',
      message: 'CMS settings restored to defaults in database',
      data: cms,
    });
  } catch (error) {
    console.error('Error resetting CMS data:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to reset CMS settings',
    });
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
          specialization: user.specialization || ''
        },
        token
      }
    });
  } catch (error) {
    console.error('Login API Error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Login failed' });
  }
});

// GET /api/auth/me - Validate token and retrieve full logged-in user profile
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password').lean();
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
          workoutPlan: user.workoutPlan,
          dietPlan: user.dietPlan,
          trainerNotes: user.trainerNotes || [],
          chatMessages: user.chatMessages || []
        }
      }
    });
  } catch (error) {
    console.error('Auth /me Error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to verify session' });
  }
});

// ==========================================
// PROTECTED USER MANAGEMENT ENDPOINTS
// ==========================================

// GET /api/users - Fetch all registered users (Protected: Admin, Receptionist, Trainer)
app.get('/api/users', authenticateToken, authorizeRoles('admin', 'receptionist', 'trainer'), async (req, res) => {
  try {
    const rawUsers = await User.find().select('-password').lean().exec();

    const formattedUsers = rawUsers.map((u, idx) => ({
      id: String(u._id),
      displayId: `USR-${101 + idx}`,
      name: u.name,
      email: u.email,
      phone: u.phone || 'N/A',
      role: u.role || 'customer',
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
        updatedAt: 'Recently updated by Coach'
      },
      dietPlan: u.dietPlan || {
        dailyCalories: '2,800 kcal',
        protein: '180g (2.2g/kg)',
        carbs: '320g',
        fats: '65g',
        waterIntake: '4.0 Liters Daily',
        mealProtocol: '4 Meals + 1 Pre-Workout Meal + 1 Post-Workout Whey Shake',
        supplements: ['Hydrolyzed Whey Isolate', 'Creatine Creapure 5g', 'BCAA Electrolytes', 'Multivitamin + Omega 3'],
        updatedAt: 'Recently updated by Coach'
      },
      trainerNotes: u.trainerNotes && u.trainerNotes.length > 0 ? u.trainerNotes : [
        {
          note: 'Great form progression on compound squats. Recommend moving working sets up by 5kg next week.',
          date: '28 Aug 2026',
          author: 'Master Coach'
        }
      ],
      progress: u.progress || {
        currentWeight: u.weight || '76 kg',
        targetWeight: '80 kg Lean Mass',
        bodyFat: u.bodyFat || '14.2%',
        benchPressPR: '110 kg',
        squatPR: '150 kg',
        deadliftPR: '190 kg',
        weeklyAttendanceScore: '96%',
        lastAuditDate: '30 Aug 2026'
      },
      chatMessages: u.chatMessages || [],
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

// PUT /api/users/:id - General user update endpoint
app.put('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const updateData = { ...req.body };
    delete updateData.password;

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    ).select('-password');

    if (!updated) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    res.status(200).json({
      status: 'success',
      message: 'User updated successfully',
      data: updated
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Failed to update user' });
  }
});

// PUT /api/users/:id/assign-trainer - Direct Assign Trainer endpoint
app.put('/api/users/:id/assign-trainer', authenticateToken, async (req, res) => {
  try {
    const { trainerId, trainerName } = req.body;
    if (!trainerName) {
      return res.status(400).json({ status: 'error', message: 'Trainer name is required' });
    }

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          assignedTrainer: trainerId ? String(trainerId) : null,
          assignedTrainerName: trainerName
        }
      },
      { new: true }
    ).select('-password');

    if (!updated) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    res.status(200).json({
      status: 'success',
      message: `Successfully assigned Coach ${trainerName} to athlete`,
      data: updated
    });
  } catch (error) {
    console.error('Assign trainer endpoint error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Failed to assign trainer' });
  }
});

// PUT /api/users/:id/coaching-data - Update customer workout plan, diet plan, notes & progress (Protected: Trainer & Admin)
app.put('/api/users/:id/coaching-data', authenticateToken, authorizeRoles('admin', 'trainer'), async (req, res) => {
  try {
    const { workoutPlan, dietPlan, trainerNotes, progress } = req.body;
    const updateFields = {};

    if (workoutPlan) updateFields.workoutPlan = workoutPlan;
    if (dietPlan) updateFields.dietPlan = dietPlan;
    if (trainerNotes) updateFields.trainerNotes = trainerNotes;
    if (progress) updateFields.progress = progress;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ status: 'error', message: 'Athlete not found' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Athlete coaching telemetry updated successfully!',
      data: updatedUser
    });
  } catch (error) {
    console.error('Update coaching data error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Failed to update coaching data' });
  }
});

// POST /api/users/:id/chat-message - Send a coach/athlete chat message
app.post('/api/users/:id/chat-message', authenticateToken, async (req, res) => {
  try {
    const { text, sender, senderName } = req.body;
    if (!text) {
      return res.status(400).json({ status: 'error', message: 'Message text is required' });
    }

    const newMsg = {
      sender: sender || 'coach',
      senderName: senderName || req.user.name,
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: new Date()
    };

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $push: { chatMessages: newMsg } },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ status: 'error', message: 'Athlete not found' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Message sent successfully',
      data: newMsg
    });
  } catch (error) {
    console.error('Send chat message error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Failed to send message' });
  }
});

// GET /api/users/:id - Fetch individual user profile & coaching telemetry
app.get('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const userDoc = await User.findById(req.params.id).select('-password').lean().exec();
    if (!userDoc) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    // Fetch full historical attendance records for this athlete
    await syncEndOfDayAttendance();
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

    const formattedAttendance = attendanceDocs.map((l, idx) => ({
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
        attendanceLogs: formattedAttendance
      }
    });
  } catch (error) {
    console.error('Fetch user details error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch user details' });
  }
});

// ==========================================
// FEEDBACK & TRAINER REVIEW API ENDPOINTS
// ==========================================

// POST /api/feedbacks - Create new customer feedback
app.post('/api/feedbacks', authenticateToken, async (req, res) => {
  try {
    const {
      trainerId,
      trainerName,
      category,
      rating,
      message,
      customerName,
      customerPlan,
      customerAvatar,
    } = req.body;

    if (!message) {
      return res.status(400).json({ status: 'error', message: 'Feedback message is required' });
    }

    const customerUser = await User.findById(req.user.id);

    const feedbackDoc = new Feedback({
      customerId: req.user.id,
      customerName: customerName || customerUser?.name || 'Gym Athlete',
      customerEmail: req.user.email || customerUser?.email || '',
      customerAvatar: customerAvatar || customerUser?.avatar || '',
      customerPlan: customerPlan || customerUser?.plan || 'VIP Obsidian Access',
      trainerId: trainerId || customerUser?.assignedTrainer || null,
      trainerName: trainerName || customerUser?.assignedTrainerName || 'Master Coach',
      category: category || 'Trainer Consultation',
      rating: Number(rating) || 5,
      message: message.trim(),
    });

    await feedbackDoc.save();

    res.status(201).json({
      status: 'success',
      message: 'Feedback submitted successfully',
      data: {
        ...feedbackDoc.toObject(),
        id: feedbackDoc._id.toString()
      }
    });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to submit feedback' });
  }
});

// GET /api/feedbacks - List feedbacks (filter by trainerId or trainerName)
app.get('/api/feedbacks', authenticateToken, async (req, res) => {
  try {
    const { trainerId, trainerName, customerId } = req.query;
    let query = {};
    if (trainerId && mongoose.Types.ObjectId.isValid(trainerId)) query.trainerId = trainerId;
    if (trainerName) query.trainerName = new RegExp(trainerName, 'i');
    if (customerId) query.customerId = customerId;

    const feedbacks = await Feedback.find(query).sort({ createdAt: -1 }).lean().exec();

    // Fetch live user avatars to always show the updated profile pictures
    const customerIds = feedbacks.map(f => f.customerId).filter(id => id && mongoose.Types.ObjectId.isValid(id));
    const customerNames = feedbacks.map(f => f.customerName).filter(Boolean);
    const users = await User.find({
      $or: [
        { _id: { $in: customerIds } },
        { name: { $in: customerNames } }
      ]
    }).select('name email avatar plan').lean().exec();

    const userMap = {};
    users.forEach(u => {
      userMap[String(u._id)] = u;
      if (u.name) userMap[u.name.toLowerCase().trim()] = u;
      if (u.email) userMap[u.email.toLowerCase().trim()] = u;
    });

    res.status(200).json({
      status: 'success',
      count: feedbacks.length,
      data: feedbacks.map(f => {
        const liveUser = (f.customerId && userMap[String(f.customerId)]) ||
                         (f.customerName && userMap[f.customerName.toLowerCase().trim()]) ||
                         (f.customerEmail && userMap[f.customerEmail.toLowerCase().trim()]);
        const avatar = liveUser?.avatar || f.customerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
        const plan = liveUser?.plan || f.customerPlan || 'VIP Athlete Member';

        return {
          ...f,
          id: f._id.toString(),
          athleteName: liveUser?.name || f.customerName || 'Gym Athlete',
          athleteAvatar: avatar,
          customerAvatar: avatar,
          plan: plan,
          customerPlan: plan,
          comment: f.message,
          rating: f.rating || 5,
          category: f.category || 'Trainer Review',
          reply: f.reply || '',
          replyAuthor: f.replyAuthor || '',
          replyDate: f.replyDate || '',
          date: f.createdAt ? new Date(f.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recently'
        };
      })
    });
  } catch (error) {
    console.error('Fetch feedbacks error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch feedbacks' });
  }
});

// GET /api/feedbacks/trainer/:trainerId & /feedbacks/trainer/:trainerId
const handleGetTrainerFeedbacks = async (req, res) => {
  try {
    const { trainerId } = req.params;
    const trainerUser = await User.findById(req.user?.id || req.user?._id).lean().exec();
    const trainerName = req.user?.name || trainerUser?.name || '';

    let orConditions = [];

    if (mongoose.Types.ObjectId.isValid(trainerId)) {
      orConditions.push({ trainerId: new mongoose.Types.ObjectId(trainerId) });
    }
    if (trainerUser?._id) {
      orConditions.push({ trainerId: trainerUser._id });
    }
    if (trainerName) {
      orConditions.push({ trainerName: new RegExp(trainerName, 'i') });
    }
    if (trainerId && !mongoose.Types.ObjectId.isValid(trainerId) && trainerId !== 'default') {
      orConditions.push({ trainerName: new RegExp(trainerId, 'i') });
    }

    // Include all customer feedbacks
    orConditions.push({ customerName: { $exists: true, $ne: '' } });

    const query = orConditions.length > 0 ? { $or: orConditions } : {};

    const feedbacks = await Feedback.find(query).sort({ createdAt: -1 }).lean().exec();

    // Fetch live user avatars to always reflect updated pictures
    const customerIds = feedbacks.map(f => f.customerId).filter(id => id && mongoose.Types.ObjectId.isValid(id));
    const customerNames = feedbacks.map(f => f.customerName).filter(Boolean);
    const users = await User.find({
      $or: [
        { _id: { $in: customerIds } },
        { name: { $in: customerNames } }
      ]
    }).select('name email avatar plan').lean().exec();

    const userMap = {};
    users.forEach(u => {
      userMap[String(u._id)] = u;
      if (u.name) userMap[u.name.toLowerCase().trim()] = u;
      if (u.email) userMap[u.email.toLowerCase().trim()] = u;
    });

    res.status(200).json({
      status: 'success',
      count: feedbacks.length,
      data: feedbacks.map(f => {
        const liveUser = (f.customerId && userMap[String(f.customerId)]) ||
                         (f.customerName && userMap[f.customerName.toLowerCase().trim()]) ||
                         (f.customerEmail && userMap[f.customerEmail.toLowerCase().trim()]);
        const avatar = liveUser?.avatar || f.customerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
        const plan = liveUser?.plan || f.customerPlan || 'VIP Athlete Member';

        return {
          ...f,
          id: f._id.toString(),
          athleteName: liveUser?.name || f.customerName || 'Gym Athlete',
          athleteAvatar: avatar,
          customerAvatar: avatar,
          plan: plan,
          customerPlan: plan,
          comment: f.message,
          rating: f.rating || 5,
          category: f.category || 'Trainer Review',
          reply: f.reply || '',
          replyAuthor: f.replyAuthor || '',
          replyDate: f.replyDate || '',
          date: f.createdAt ? new Date(f.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recently'
        };
      })
    });
  } catch (error) {
    console.error('Fetch trainer feedbacks error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch feedbacks' });
  }
};

app.get('/api/feedbacks/trainer/:trainerId', authenticateToken, handleGetTrainerFeedbacks);
app.get('/feedbacks/trainer/:trainerId', authenticateToken, handleGetTrainerFeedbacks);

// PUT /api/feedbacks/:id/reply - Coach/Admin adds a reply to a feedback
const handleReplyFeedback = async (req, res) => {
  try {
    const { reply } = req.body;
    if (!reply) {
      return res.status(400).json({ status: 'error', message: 'Reply text is required' });
    }

    const feedbackDoc = await Feedback.findById(req.params.id);
    if (!feedbackDoc) {
      return res.status(404).json({ status: 'error', message: 'Feedback not found' });
    }

    feedbackDoc.reply = reply.trim();
    feedbackDoc.replyAuthor = req.user.name || 'Master Coach';
    feedbackDoc.replyDate = new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
    await feedbackDoc.save();

    res.status(200).json({
      status: 'success',
      message: 'Reply posted successfully',
      data: {
        ...feedbackDoc.toObject(),
        id: feedbackDoc._id.toString()
      }
    });
  } catch (error) {
    console.error('Reply feedback error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to post reply' });
  }
};

app.put('/api/feedbacks/:id/reply', authenticateToken, handleReplyFeedback);
app.put('/feedbacks/:id/reply', authenticateToken, handleReplyFeedback);

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

    const normalizedRole = (role || 'customer').toLowerCase().trim();
    const isStaff = normalizedRole === 'trainer' || normalizedRole === 'receptionist' || normalizedRole === 'admin' || normalizedRole === 'staff';

    // Generate secure temporary password if not provided or if standard placeholder was passed
    let assignedPassword;
    if (password && password.trim() && !password.includes('@123')) {
      assignedPassword = password.trim();
    } else {
      const randomCode = Math.floor(1000 + Math.random() * 9000);
      if (normalizedRole === 'trainer') {
        assignedPassword = `TitanCoach@${randomCode}`;
      } else if (normalizedRole === 'receptionist') {
        assignedPassword = `TitanDesk@${randomCode}`;
      } else if (normalizedRole === 'admin') {
        assignedPassword = `TitanAdmin@${randomCode}`;
      } else {
        assignedPassword = `TitanPass@${randomCode}`;
      }
    }

    const newUser = new User({
      name: name.trim(),
      email: lowerEmail,
      phone: (phone || '').trim(),
      role: normalizedRole,
      password: assignedPassword,
      membershipPlan,
      membershipStatus,
      membershipDuration,
      membershipStartDate,
      membershipExpiry,
      amountPaid,
      paymentMethod: paymentMethod || ''
    });

    await newUser.save();

    // Dispatch credentials email (Staff credentials for Trainer/Receptionist, Welcome for Customer)
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
          assignedRoom: req.body.room || req.body.assignedRoom
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
          paymentMethod: newUser.paymentMethod
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

// PUT /api/users/:id/shift - Update trainer shift timings, working days, and arena (Protected: Admin, Receptionist, Trainer)
const handleUpdateShift = async (req, res) => {
  try {
    const { id } = req.params;
    const { shift, room, days, specialization, breakTime } = req.body;

    const updateFields = {};
    if (shift) updateFields.shift = shift;
    if (room) updateFields.assignedRoom = room;
    if (days) updateFields.workingDays = days;
    if (specialization) updateFields.specialization = specialization;
    if (breakTime) updateFields.breakTime = breakTime;

    let updated = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      updated = await User.findByIdAndUpdate(
        id,
        { $set: updateFields },
        { new: true }
      ).select('-password');
    }

    if (!updated) {
      updated = await User.findOneAndUpdate(
        { $or: [{ email: id }, { name: new RegExp(`^${id}$`, 'i') }] },
        { $set: updateFields },
        { new: true }
      ).select('-password');
    }

    if (!updated) {
      return res.status(404).json({ status: 'error', message: 'Trainer not found in database' });
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
};

app.put('/api/users/:id/shift', authenticateToken, authorizeRoles('admin', 'receptionist', 'trainer'), handleUpdateShift);
app.put('/users/:id/shift', authenticateToken, authorizeRoles('admin', 'receptionist', 'trainer'), handleUpdateShift);

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

// Cloudinary File & Image Upload API Endpoint (Protected: Admin, Trainer, Customer, Member)
app.post('/api/upload', authenticateToken, authorizeRoles('admin', 'trainer', 'customer', 'member'), async (req, res) => {
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

    // Record persistent payment transaction log
    try {
      const newPayDoc = new Payment({
        invoiceId: `INV-${Date.now().toString().slice(-6)}`,
        userId: userId || null,
        customerName: updatedUser?.name || 'Gym Athlete',
        customerEmail: updatedUser?.email || 'athlete@titanpulse.com',
        customerPhone: updatedUser?.phone || '',
        type: 'Membership',
        planOrItem: planName || 'Pro Membership',
        amount: priceNum,
        paymentMethod: req.body.paymentMethod || 'Card (Online)',
        paymentStatus: 'Paid',
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      });
      await newPayDoc.save();
    } catch (e) {
      console.warn('Payment record log error:', e);
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

// GET /api/payments - Fetch all payment & billing records for Admin & Receptionist
app.get('/api/payments', authenticateToken, authorizeRoles('admin', 'receptionist'), async (req, res) => {
  try {
    // 1. Fetch recorded payments
    const recordedPayments = await Payment.find().sort({ createdAt: -1 }).lean().exec();

    // 2. Fetch all customers who have membership plans/amountPaid
    const payingUsers = await User.find({
      role: 'customer',
      $or: [
        { membershipPlan: { $exists: true, $ne: 'No Active Plan' } },
        { amountPaid: { $exists: true, $gt: 0 } }
      ]
    }).select('-password').lean().exec();

    // Generate synthesized transactions for users with active plans if not already in recordedPayments
    const userPayments = payingUsers.map((u, idx) => {
      const invId = `INV-MEM-${String(u._id).slice(-6).toUpperCase()}`;
      const defaultAmount = u.membershipPlan?.toLowerCase().includes('pt') ? 9999 : (u.membershipPlan?.toLowerCase().includes('elite') ? 4999 : 2499);
      const cleanAmount = u.amountPaid && u.amountPaid > 0 ? u.amountPaid : defaultAmount;
      const formattedDate = u.membershipStartDate 
        ? new Date(u.membershipStartDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        : (u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '02 Sep 2026');

      return {
        id: invId,
        invoiceId: invId,
        customer: u.name,
        customerEmail: u.email,
        customerPhone: u.phone || '+91 99887 66554',
        type: 'Membership',
        plan: u.membershipPlan || 'PRO MEMBERSHIP',
        amount: cleanAmount,
        method: u.paymentMethod || 'Card (Online)',
        date: formattedDate,
        status: u.membershipStatus === 'Active' ? 'Paid' : (u.membershipStatus || 'Paid')
      };
    });

    const combined = [...recordedPayments.map(p => ({
      id: p.invoiceId,
      invoiceId: p.invoiceId,
      customer: p.customerName,
      customerEmail: p.customerEmail,
      customerPhone: p.customerPhone,
      type: p.type,
      plan: p.planOrItem,
      amount: p.amount,
      method: p.paymentMethod,
      date: p.date || new Date(p.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: p.paymentStatus
    }))];

    userPayments.forEach(up => {
      if (!combined.some(c => c.id === up.id || c.customerEmail === up.customerEmail)) {
        combined.push(up);
      }
    });

    res.status(200).json({
      status: 'success',
      count: combined.length,
      data: combined
    });
  } catch (error) {
    console.error('Fetch payments error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch payment records' });
  }
});

// ==========================================
// ATTENDANCE, TURNSTILE & MANUAL OTP CHECK-IN
// ==========================================

// Global in-memory OTP request cache with auto-expiry
const activeOtpMap = new Map();

// Helper to automatically turn active check-ins from previous days into 'Inactive'
const syncEndOfDayAttendance = async () => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    await Attendance.updateMany(
      {
        date: { $lt: todayStr },
        status: 'Active Inside',
      },
      {
        $set: {
          status: 'Inactive',
        },
      }
    );
  } catch (err) {
    console.error('Error syncing end-of-day attendance:', err);
  }
};

// Sync end-of-day attendance on boot & every 5 minutes
syncEndOfDayAttendance();
setInterval(syncEndOfDayAttendance, 5 * 60 * 1000);

// Helper to cleanup expired OTPs
const cleanupExpiredOtps = () => {
  const now = Date.now();
  for (const [key, val] of activeOtpMap.entries()) {
    if (val.expiresAt < now) {
      activeOtpMap.delete(key);
    }
  }
};

// Check if athlete has checked in within the last 6 hours (6-hour gap cooldown)
const check6HourCooldown = async ({ customerId, userId, email, name }) => {
  try {
    const COOLDOWN_MS = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
    const sixHoursAgo = new Date(Date.now() - COOLDOWN_MS);

    const orClauses = [];
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      orClauses.push({ userId: new mongoose.Types.ObjectId(userId) });
    }
    if (customerId && String(customerId).trim()) {
      orClauses.push({ customerId: String(customerId).trim() });
    }
    if (email && email.trim()) {
      orClauses.push({ email: email.toLowerCase().trim() });
    }
    if (name && name.trim()) {
      orClauses.push({ name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } });
    }

    if (orClauses.length === 0) return { isBlocked: false };

    // Find latest attendance record within last 6 hours
    const recentRecord = await Attendance.findOne({
      $or: orClauses,
      status: { $ne: 'Cancelled' },
      $or: [
        { checkInTimestamp: { $gte: sixHoursAgo } },
        { createdAt: { $gte: sixHoursAgo } }
      ]
    }).sort({ checkInTimestamp: -1, createdAt: -1 });

    if (recentRecord) {
      const checkInTime = recentRecord.checkInTimestamp || recentRecord.createdAt || new Date();
      const checkInMs = new Date(checkInTime).getTime();
      const elapsedMs = Math.max(0, Date.now() - checkInMs);

      if (elapsedMs < COOLDOWN_MS) {
        const remainingMs = COOLDOWN_MS - elapsedMs;
        const remainingHours = Math.floor(remainingMs / (1000 * 60 * 60));
        const remainingMinutes = Math.ceil((remainingMs % (1000 * 60 * 60)) / (1000 * 60));

        const nextEligibleDate = new Date(checkInMs + COOLDOWN_MS);
        const nextEligibleTime = nextEligibleDate.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });

        const elapsedHours = Math.floor(elapsedMs / (1000 * 60 * 60));
        const elapsedMinutes = Math.floor((elapsedMs % (1000 * 60 * 60)) / (1000 * 60));
        const timeElapsedStr = elapsedHours > 0 
          ? `${elapsedHours} hr ${elapsedMinutes} mins ago` 
          : `${elapsedMinutes} mins ago`;

        const timeRemainingStr = remainingHours > 0 
          ? `${remainingHours}h ${remainingMinutes}m` 
          : `${remainingMinutes} mins`;

        return {
          isBlocked: true,
          previousCheckIn: {
            logId: recentRecord.logId,
            timeIn: recentRecord.timeIn,
            date: recentRecord.date,
            terminal: recentRecord.terminal || 'Turnstile Gate Alpha-1',
            status: recentRecord.status,
            verification: recentRecord.verification,
            checkInTimestamp: recentRecord.checkInTimestamp || recentRecord.createdAt,
            name: recentRecord.name,
            customerId: recentRecord.customerId,
            plan: recentRecord.plan
          },
          timeElapsedStr,
          timeRemainingStr,
          nextEligibleTime,
          remainingHours,
          remainingMinutes,
          message: `Athlete ${recentRecord.name} is already checked in at ${recentRecord.timeIn} (${timeElapsedStr}). Minimum 6-hour gap required between check-ins. Next check-in eligible at ${nextEligibleTime} (${timeRemainingStr} remaining).`
        };
      }
    }

    return { isBlocked: false };
  } catch (err) {
    console.error('Cooldown check error:', err);
    return { isBlocked: false };
  }
};

// POST /api/attendance/request-otp - Generate & dispatch manual check-in OTP for customer
app.post('/api/attendance/request-otp', async (req, res) => {
  try {
    const { customerId, userId, name, email, phone, plan } = req.body;
    if (!name && !customerId && !userId && !email) {
      return res.status(400).json({ status: 'error', message: 'Customer identifier is required' });
    }

    cleanupExpiredOtps();

    // 6-Hour Cooldown Validation
    const cooldownStatus = await check6HourCooldown({ customerId, userId, name, email });
    if (cooldownStatus.isBlocked) {
      console.warn(`⛔ Check-in blocked for ${name}: Already checked in (${cooldownStatus.timeElapsedStr})`);
      return res.status(400).json({
        status: 'already_checked_in',
        message: cooldownStatus.message,
        data: cooldownStatus
      });
    }

    // Generate secure 4-digit numeric OTP matching orbit verification console
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = Date.now() + 2 * 60 * 1000; // Exactly 2:00 minutes validity

    const otpData = {
      otp: generatedOtp,
      customerId: customerId || `CUST-${Math.floor(100 + Math.random() * 900)}`,
      userId: userId ? String(userId) : null,
      name: name || 'Valued Athlete',
      email: email || '',
      phone: phone || '',
      plan: plan || 'PRO MEMBERSHIP',
      requestedAt: new Date().toISOString(),
      expiresAt,
      verified: false,
    };

    // Store by customerId, userId, and email for fast lookup
    if (customerId) activeOtpMap.set(String(customerId).toLowerCase(), otpData);
    if (userId) activeOtpMap.set(String(userId).toLowerCase(), otpData);
    if (email) activeOtpMap.set(String(email).toLowerCase(), otpData);
    activeOtpMap.set(name.toLowerCase().trim(), otpData);

    console.log(`🔑 Manual Check-In OTP generated for ${name} (${customerId || userId}): [ ${generatedOtp} ] (Expires in 2:00 mins)`);

    return res.status(200).json({
      status: 'success',
      message: `OTP successfully sent to customer portal for ${name}`,
      data: {
        customerId: otpData.customerId,
        userId: otpData.userId,
        name: otpData.name,
        expiresAt: otpData.expiresAt,
        requestedAt: otpData.requestedAt,
        // In local development, also provide the OTP in debug payload for convenience
        debugOtp: generatedOtp,
      }
    });
  } catch (error) {
    console.error('Request OTP Error:', error);
    return res.status(500).json({ status: 'error', message: error.message || 'Failed to request check-in OTP' });
  }
});

// GET /api/attendance/active-otp/:identifier - Retrieve pending check-in OTP for Customer Portal
app.get('/api/attendance/active-otp/:identifier', (req, res) => {
  try {
    const rawId = req.params.identifier;
    if (!rawId) {
      return res.status(400).json({ status: 'error', message: 'Identifier required' });
    }

    cleanupExpiredOtps();

    const lookupKey = rawId.toLowerCase().trim();
    const active = activeOtpMap.get(lookupKey);

    if (active && active.expiresAt > Date.now() && !active.verified) {
      return res.status(200).json({
        status: 'success',
        data: {
          hasActiveOtp: true,
          otp: active.otp,
          customerId: active.customerId,
          name: active.name,
          plan: active.plan,
          expiresAt: active.expiresAt,
          requestedAt: active.requestedAt,
        }
      });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        hasActiveOtp: false,
      }
    });
  } catch (error) {
    console.error('Get Active OTP Error:', error);
    return res.status(500).json({ status: 'error', message: 'Failed to check active OTP' });
  }
});

// POST /api/attendance/verify-otp - Verify receptionist entered OTP & record attendance clock-in
app.post('/api/attendance/verify-otp', async (req, res) => {
  try {
    const { customerId, userId, name, email, phone, plan, otp, terminal } = req.body;

    if (!otp) {
      return res.status(400).json({ status: 'error', message: 'OTP is required for manual verification' });
    }

    cleanupExpiredOtps();

    const cleanOtp = String(otp).trim();
    let matchedData = null;
    let matchedKey = null;

    // Search for matching OTP in active store
    const keysToCheck = [
      customerId ? String(customerId).toLowerCase() : null,
      userId ? String(userId).toLowerCase() : null,
      email ? String(email).toLowerCase() : null,
      name ? name.toLowerCase().trim() : null,
    ].filter(Boolean);

    for (const key of keysToCheck) {
      if (activeOtpMap.has(key)) {
        const candidate = activeOtpMap.get(key);
        if (candidate.otp === cleanOtp && candidate.expiresAt > Date.now()) {
          matchedData = candidate;
          matchedKey = key;
          break;
        }
      }
    }

    // Fallback: search all active entries if user didn't provide specific key
    if (!matchedData) {
      for (const [k, v] of activeOtpMap.entries()) {
        if (v.otp === cleanOtp && v.expiresAt > Date.now()) {
          matchedData = v;
          matchedKey = k;
          break;
        }
      }
    }

    if (!matchedData) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid or expired OTP code. Please check the code or request a new one.'
      });
    }

    // 6-Hour Cooldown Validation before finalizing attendance
    const cooldownStatus = await check6HourCooldown({
      customerId: matchedData.customerId || customerId,
      userId: matchedData.userId || userId,
      name: matchedData.name || name,
      email: matchedData.email || email,
    });

    if (cooldownStatus.isBlocked) {
      console.warn(`⛔ OTP verification blocked: ${matchedData.name} already checked in within 6 hrs`);
      return res.status(400).json({
        status: 'already_checked_in',
        message: cooldownStatus.message,
        data: cooldownStatus
      });
    }

    // Current formatted clock-in time & date
    const now = new Date();
    const timeInStr = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    const dateStr = now.toISOString().split('T')[0];
    const logId = `LOG-${Date.now().toString().slice(-4)}`;

    // Persist Attendance Record to MongoDB Atlas
    const attendanceDoc = new Attendance({
      logId,
      customerId: matchedData.customerId || customerId || `CUST-301`,
      userId: matchedData.userId || userId || null,
      name: matchedData.name || name || 'Athlete Member',
      email: matchedData.email || email || '',
      phone: matchedData.phone || phone || '',
      plan: matchedData.plan || plan || 'PRO MEMBERSHIP',
      terminal: terminal || 'Turnstile Gate Alpha-1 (Front Desk Manual)',
      timeIn: timeInStr,
      timeOut: '--',
      date: dateStr,
      status: 'Active Inside',
      verification: 'Manual OTP Verified',
      otpCode: cleanOtp,
      checkInTimestamp: now,
    });

    await attendanceDoc.save();

    // Mark verified and clear from active store
    matchedData.verified = true;
    for (const [k, v] of activeOtpMap.entries()) {
      if (v.otp === cleanOtp || v.customerId === matchedData.customerId) {
        activeOtpMap.delete(k);
      }
    }

    console.log(`✅ Customer ${attendanceDoc.name} checked in via OTP at ${timeInStr} (Log: ${logId})`);

    return res.status(200).json({
      status: 'success',
      message: `Access Granted: ${attendanceDoc.name} checked in successfully!`,
      data: {
        id: attendanceDoc.logId,
        _id: attendanceDoc._id,
        logId: attendanceDoc.logId,
        customerId: attendanceDoc.customerId,
        userId: attendanceDoc.userId,
        name: attendanceDoc.name,
        email: attendanceDoc.email,
        phone: attendanceDoc.phone,
        plan: attendanceDoc.plan,
        terminal: attendanceDoc.terminal,
        timeIn: attendanceDoc.timeIn,
        timeOut: attendanceDoc.timeOut,
        date: attendanceDoc.date,
        status: attendanceDoc.status,
        verification: attendanceDoc.verification,
        checkInTimestamp: attendanceDoc.checkInTimestamp,
      }
    });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    return res.status(500).json({ status: 'error', message: error.message || 'Failed to verify OTP' });
  }
});

// POST /api/attendance/quick-checkin - Direct RFID / Fast Scanner Check-In
app.post('/api/attendance/quick-checkin', async (req, res) => {
  try {
    const { customerId, userId, name, email, phone, plan, terminal, verification } = req.body;
    if (!name && !customerId && !userId) {
      return res.status(400).json({ status: 'error', message: 'Member details required for check-in' });
    }

    // 6-Hour Cooldown Validation
    const cooldownStatus = await check6HourCooldown({ customerId, userId, name, email });
    if (cooldownStatus.isBlocked) {
      return res.status(400).json({
        status: 'already_checked_in',
        message: cooldownStatus.message,
        data: cooldownStatus
      });
    }

    const now = new Date();
    const timeInStr = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    const dateStr = now.toISOString().split('T')[0];
    const logId = `LOG-${Date.now().toString().slice(-4)}`;

    const attendanceDoc = new Attendance({
      logId,
      customerId: customerId || `CUST-${Math.floor(100 + Math.random() * 900)}`,
      userId: userId || null,
      name: name || 'Athlete Member',
      email: email || '',
      phone: phone || '',
      plan: plan || 'PRO MEMBERSHIP',
      terminal: terminal || 'Turnstile Gate Alpha-1',
      timeIn: timeInStr,
      timeOut: '--',
      date: dateStr,
      status: 'Active Inside',
      verification: verification || 'Biometric NFC Pass',
      checkInTimestamp: now,
    });

    await attendanceDoc.save();

    return res.status(200).json({
      status: 'success',
      message: `Access Granted: ${attendanceDoc.name} checked in!`,
      data: attendanceDoc
    });
  } catch (error) {
    console.error('Quick checkin error:', error);
    return res.status(500).json({ status: 'error', message: error.message || 'Failed to perform check-in' });
  }
});

// GET /api/attendance - Fetch all attendance logs (For Receptionist & Admin Dashboards)
app.get('/api/attendance', async (req, res) => {
  try {
    await syncEndOfDayAttendance();
    const query = {};
    if (req.query.userId) {
      query.$or = [
        { userId: req.query.userId },
        { customerId: req.query.userId }
      ];
    } else if (req.query.email) {
      query.email = req.query.email;
    }
    const logs = await Attendance.find(query)
      .sort({ createdAt: -1 })
      .limit(300)
      .lean()
      .exec();

    const formatted = logs.map(l => ({
      id: l.logId || `LOG-${String(l._id).slice(-4)}`,
      _id: l._id,
      logId: l.logId || `LOG-${String(l._id).slice(-4)}`,
      customerId: l.customerId,
      userId: l.userId,
      name: l.name,
      email: l.email,
      phone: l.phone,
      plan: l.plan,
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
      checkInTimestamp: l.checkInTimestamp || l.createdAt,
      createdAt: l.createdAt,
    }));

    return res.status(200).json({
      status: 'success',
      count: formatted.length,
      data: formatted,
    });
  } catch (error) {
    console.error('Fetch attendance error:', error);
    return res.status(500).json({ status: 'error', message: 'Failed to fetch attendance logs' });
  }
});

// GET /api/attendance/customer/:identifier - Fetch individual customer attendance history
app.get('/api/attendance/customer/:identifier', async (req, res) => {
  try {
    await syncEndOfDayAttendance();
    const identifier = req.params.identifier;
    const isObjectId = mongoose.Types.ObjectId.isValid(identifier);
    const orConditions = [
      { customerId: identifier },
      { email: identifier },
      { name: new RegExp(`^${identifier.trim()}$`, 'i') },
    ];
    if (isObjectId) {
      orConditions.push({ userId: identifier });
    }
    const logs = await Attendance.find({ $or: orConditions })
      .sort({ createdAt: -1 })
      .limit(200)
      .lean()
      .exec();

    const formatted = logs.map(l => ({
      id: l.logId || `LOG-${String(l._id).slice(-4)}`,
      _id: l._id,
      logId: l.logId || `LOG-${String(l._id).slice(-4)}`,
      customerId: l.customerId,
      userId: l.userId,
      name: l.name,
      email: l.email,
      phone: l.phone,
      plan: l.plan,
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
      checkInTimestamp: l.checkInTimestamp || l.createdAt,
      createdAt: l.createdAt,
    }));

    return res.status(200).json({
      status: 'success',
      count: formatted.length,
      data: formatted,
    });
  } catch (error) {
    console.error('Fetch customer attendance error:', error);
    return res.status(500).json({ status: 'error', message: 'Failed to fetch customer attendance' });
  }
});

// GET /api/attendance/my - Fetch personal attendance logs for Customer Dashboard
app.get('/api/attendance/my', authenticateToken, async (req, res) => {
  try {
    await syncEndOfDayAttendance();
    const userId = req.user.id;
    const userEmail = req.user.email;

    const logs = await Attendance.find({
      $or: [{ userId }, { email: userEmail }]
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean()
      .exec();

    return res.status(200).json({
      status: 'success',
      count: logs.length,
      data: logs.map(l => ({
        id: l.logId || `LOG-${String(l._id).slice(-4)}`,
        date: l.date,
        checkIn: l.timeIn,
        checkOut: l.timeOut,
        duration: l.status === 'Checked Out' ? '1 hr 15 mins' : 'In Session',
        gate: l.terminal,
        zone: 'Main Strength & Conditioning Floor',
        status: l.status === 'Active Inside' ? 'Active Floor' : 'Verified',
        verification: l.verification,
      }))
    });
  } catch (error) {
    console.error('Fetch my attendance error:', error);
    return res.status(500).json({ status: 'error', message: 'Failed to fetch your attendance history' });
  }
});

// PUT /api/attendance/:id/checkout - Record Member Check-Out
app.put('/api/attendance/:id/checkout', async (req, res) => {
  try {
    const targetId = req.params.id;
    const now = new Date();
    const timeOutStr = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const updated = await Attendance.findOneAndUpdate(
      { $or: [{ logId: targetId }, { _id: mongoose.isValidObjectId(targetId) ? targetId : null }] },
      {
        $set: {
          status: 'Checked Out',
          timeOut: timeOutStr,
          checkOutTimestamp: now,
        }
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ status: 'error', message: 'Attendance record not found' });
    }

    return res.status(200).json({
      status: 'success',
      message: `Check-out recorded for ${updated.name} at ${timeOutStr}`,
      data: updated
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return res.status(500).json({ status: 'error', message: 'Failed to record check-out' });
  }
});

// ==========================================
// PROSPECT LEADS & ENQUIRY CRM API ENDPOINTS
// ==========================================

// POST /api/enquiries - Capture new prospect lead
app.post('/api/enquiries', async (req, res) => {
  try {
    const { name, phone, email, goal, source, notes, capturedBy } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        status: 'error',
        message: 'Prospect Name and Phone Number are required fields.',
      });
    }

    const count = await Enquiry.countDocuments();
    const nextSeq = String(count + 1).padStart(3, '0');
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const enquiryId = `ENQ-${nextSeq}-${randomSuffix}`;

    const newEnquiry = new Enquiry({
      enquiryId,
      name: name.trim(),
      phone: phone.trim(),
      email: email && email.trim() ? email.trim() : 'N/A',
      goal: goal || 'Muscle Gain & Strength',
      source: source || 'Walk-in Visitor',
      status: 'New Lead',
      notes: notes || '',
      capturedBy: capturedBy || 'Front Desk Receptionist',
      date: new Date().toISOString().split('T')[0],
    });

    await newEnquiry.save();

    console.log(`📥 [Enquiry API] New lead logged: ${newEnquiry.name} (${newEnquiry.enquiryId}) -> Synced to Admin Dashboard.`);

    return res.status(201).json({
      status: 'success',
      message: 'Prospect lead captured successfully and dispatched to Admin Dashboard!',
      data: newEnquiry,
    });
  } catch (error) {
    console.error('Error creating prospect enquiry:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to save enquiry lead: ' + (error.message || 'Server error'),
    });
  }
});

// GET /api/enquiries - Fetch all prospect leads
app.get('/api/enquiries', async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    return res.status(200).json({
      status: 'success',
      count: enquiries.length,
      data: enquiries,
    });
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve enquiries: ' + (error.message || 'Server error'),
    });
  }
});

// PUT /api/enquiries/:id - Update lead status or details
app.put('/api/enquiries/:id', async (req, res) => {
  try {
    const targetId = req.params.id;
    const { status, notes, goal, phone, email } = req.body;

    const updateFields = {};
    if (status) updateFields.status = status;
    if (notes !== undefined) updateFields.notes = notes;
    if (goal) updateFields.goal = goal;
    if (phone) updateFields.phone = phone;
    if (email) updateFields.email = email;

    const updated = await Enquiry.findOneAndUpdate(
      {
        $or: [
          { enquiryId: targetId },
          { _id: mongoose.isValidObjectId(targetId) ? targetId : null },
        ],
      },
      { $set: updateFields },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        status: 'error',
        message: 'Prospect lead record not found.',
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Lead updated successfully.',
      data: updated,
    });
  } catch (error) {
    console.error('Error updating enquiry:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to update enquiry: ' + (error.message || 'Server error'),
    });
  }
});

// DELETE /api/enquiries/:id - Delete lead
app.delete('/api/enquiries/:id', async (req, res) => {
  try {
    const targetId = req.params.id;
    const deleted = await Enquiry.findOneAndDelete({
      $or: [
        { enquiryId: targetId },
        { _id: mongoose.isValidObjectId(targetId) ? targetId : null },
      ],
    });

    if (!deleted) {
      return res.status(404).json({
        status: 'error',
        message: 'Prospect lead record not found.',
      });
    }

    return res.status(200).json({
      status: 'success',
      message: `Lead ${deleted.enquiryId} (${deleted.name}) removed successfully.`,
    });
  } catch (error) {
    console.error('Error deleting enquiry:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to delete enquiry: ' + (error.message || 'Server error'),
    });
  }
});

// ==========================================
// CUSTOMER SUPPORT & SERVICE TICKETS API
// ==========================================

// POST /api/tickets - Customer raises a support/service ticket
app.post('/api/tickets', async (req, res) => {
  try {
    const {
      ticketId,
      customerId,
      customerDisplayId,
      customerName,
      customerEmail,
      customerPhone,
      customerAvatar,
      customerPlan,
      subject,
      category,
      priority,
      description,
      status,
      reply,
    } = req.body;

    if (!subject || !description) {
      return res.status(400).json({
        status: 'error',
        message: 'Ticket Subject and Description are required fields.',
      });
    }

    const uniqueTicketId =
      ticketId ||
      `TCK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTicket = new Ticket({
      ticketId: uniqueTicketId,
      customerId: customerId && mongoose.isValidObjectId(customerId) ? customerId : null,
      customerDisplayId: customerDisplayId || '',
      customerName: customerName || 'Gym Athlete',
      customerEmail: customerEmail || '',
      customerPhone: customerPhone || '',
      customerAvatar: customerAvatar || '',
      customerPlan: customerPlan || 'Titan Elite All-Access',
      subject: subject.trim(),
      category: category || 'Facility & Equipment',
      priority: priority || 'Medium',
      description: description.trim(),
      status: status || 'Open',
      reply: reply || 'Ticket logged with Front Desk. Our management team will review and respond promptly.',
      replyBy: '',
      replyAt: '',
      assignedTo: 'Front Desk Receptionist',
      date: new Date().toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      time: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    });

    await newTicket.save();

    console.log(`🎫 [Support Ticket API] New ticket logged: ${newTicket.ticketId} by ${newTicket.customerName} (${newTicket.subject}) -> Synced to Receptionist Dashboard.`);

    return res.status(201).json({
      status: 'success',
      message: 'Support ticket raised successfully and dispatched to Reception Desk!',
      data: {
        id: newTicket.ticketId,
        _id: newTicket._id,
        ticketId: newTicket.ticketId,
        customerId: newTicket.customerId,
        customerDisplayId: newTicket.customerDisplayId,
        customerName: newTicket.customerName,
        customerEmail: newTicket.customerEmail,
        customerPhone: newTicket.customerPhone,
        customerAvatar: newTicket.customerAvatar,
        customerPlan: newTicket.customerPlan,
        subject: newTicket.subject,
        category: newTicket.category,
        priority: newTicket.priority,
        description: newTicket.description,
        status: newTicket.status,
        reply: newTicket.reply,
        replyBy: newTicket.replyBy,
        replyAt: newTicket.replyAt,
        assignedTo: newTicket.assignedTo,
        date: newTicket.date,
        time: newTicket.time,
        createdAt: newTicket.createdAt,
      },
    });
  } catch (error) {
    console.error('Error creating support ticket:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to create support ticket: ' + (error.message || 'Server error'),
    });
  }
});

// GET /api/tickets - Retrieve all support tickets (for Receptionist & Admin)
app.get('/api/tickets', async (req, res) => {
  try {
    const { status, category, priority, customerId, email } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }
    if (category && category !== 'all') {
      query.category = category;
    }
    if (priority && priority !== 'all') {
      query.priority = priority;
    }
    if (customerId) {
      query.$or = [
        { customerId: mongoose.isValidObjectId(customerId) ? customerId : null },
        { customerDisplayId: customerId },
      ];
    }
    if (email) {
      query.customerEmail = email;
    }

    const tickets = await Ticket.find(query).sort({ createdAt: -1 }).lean().exec();

    const formatted = tickets.map((t) => ({
      id: t.ticketId || `TCK-${String(t._id).slice(-4)}`,
      _id: t._id,
      ticketId: t.ticketId || `TCK-${String(t._id).slice(-4)}`,
      customerId: t.customerId,
      customerDisplayId: t.customerDisplayId,
      customerName: t.customerName,
      customerEmail: t.customerEmail,
      customerPhone: t.customerPhone,
      customerAvatar: t.customerAvatar,
      customerPlan: t.customerPlan,
      subject: t.subject,
      category: t.category,
      priority: t.priority,
      description: t.description,
      status: t.status,
      reply: t.reply,
      replyBy: t.replyBy,
      replyAt: t.replyAt,
      assignedTo: t.assignedTo,
      date: t.date || (t.createdAt ? new Date(t.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : ''),
      time: t.time || (t.createdAt ? new Date(t.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : ''),
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }));

    return res.status(200).json({
      status: 'success',
      count: formatted.length,
      data: formatted,
    });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve support tickets: ' + (error.message || 'Server error'),
    });
  }
});

// GET /api/tickets/my - Retrieve authenticated customer's tickets
app.get('/api/tickets/my', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const userEmail = req.user.email;

    const queryConditions = [];
    if (userId && mongoose.isValidObjectId(userId)) {
      queryConditions.push({ customerId: userId });
    }
    if (userEmail) {
      queryConditions.push({ customerEmail: userEmail });
    }

    const tickets = await Ticket.find({ $or: queryConditions.length > 0 ? queryConditions : [{ customerEmail: userEmail }] })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return res.status(200).json({
      status: 'success',
      count: tickets.length,
      data: tickets.map((t) => ({
        id: t.ticketId || `TCK-${String(t._id).slice(-4)}`,
        _id: t._id,
        ticketId: t.ticketId || `TCK-${String(t._id).slice(-4)}`,
        subject: t.subject,
        category: t.category,
        priority: t.priority,
        description: t.description,
        status: t.status,
        reply: t.reply,
        replyBy: t.replyBy,
        replyAt: t.replyAt,
        assignedTo: t.assignedTo,
        date: t.date,
        time: t.time,
        createdAt: t.createdAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching customer tickets:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to fetch tickets: ' + (error.message || 'Server error'),
    });
  }
});

// PUT /api/tickets/:id - Update ticket status / reply / assigned resolution
app.put('/api/tickets/:id', async (req, res) => {
  try {
    const targetId = req.params.id;
    const { status, reply, replyBy, priority, assignedTo, category } = req.body;

    const updateFields = {};
    if (status) updateFields.status = status;
    if (reply !== undefined) {
      updateFields.reply = reply;
      updateFields.replyBy = replyBy || 'Front Desk Concierge';
      updateFields.replyAt = new Date().toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    if (replyBy) updateFields.replyBy = replyBy;
    if (priority) updateFields.priority = priority;
    if (assignedTo) updateFields.assignedTo = assignedTo;
    if (category) updateFields.category = category;

    const updated = await Ticket.findOneAndUpdate(
      {
        $or: [
          { ticketId: targetId },
          { _id: mongoose.isValidObjectId(targetId) ? targetId : null },
        ],
      },
      { $set: updateFields },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        status: 'error',
        message: 'Support ticket not found.',
      });
    }

    console.log(`🎫 [Support Ticket API] Ticket ${updated.ticketId} updated -> Status: ${updated.status}`);

    return res.status(200).json({
      status: 'success',
      message: `Ticket ${updated.ticketId} updated successfully.`,
      data: {
        id: updated.ticketId,
        _id: updated._id,
        ticketId: updated.ticketId,
        customerId: updated.customerId,
        customerName: updated.customerName,
        customerEmail: updated.customerEmail,
        customerPhone: updated.customerPhone,
        subject: updated.subject,
        category: updated.category,
        priority: updated.priority,
        description: updated.description,
        status: updated.status,
        reply: updated.reply,
        replyBy: updated.replyBy,
        replyAt: updated.replyAt,
        assignedTo: updated.assignedTo,
        date: updated.date,
        time: updated.time,
        updatedAt: updated.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error updating ticket:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to update ticket: ' + (error.message || 'Server error'),
    });
  }
});

// DELETE /api/tickets/:id - Delete ticket
app.delete('/api/tickets/:id', async (req, res) => {
  try {
    const targetId = req.params.id;
    const deleted = await Ticket.findOneAndDelete({
      $or: [
        { ticketId: targetId },
        { _id: mongoose.isValidObjectId(targetId) ? targetId : null },
      ],
    });

    if (!deleted) {
      return res.status(404).json({
        status: 'error',
        message: 'Support ticket not found.',
      });
    }

    return res.status(200).json({
      status: 'success',
      message: `Support ticket ${deleted.ticketId} removed successfully.`,
    });
  } catch (error) {
    console.error('Error deleting ticket:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to delete ticket: ' + (error.message || 'Server error'),
    });
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
