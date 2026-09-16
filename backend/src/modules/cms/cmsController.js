const CMS = require('../../models/CMS');

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
        flavors: ["Unflavored Pure"],
        specs: ["5g Creapure®", "0 Fillers", "Zero Sugar", "100 Servings"],
      },
    ],
  },
  memberships: [
    {
      id: "PLN-1",
      tierKey: "pro",
      name: "PRO ALL-ACCESS BIOMETRIC",
      badge: "TITAN ALL-ACCESS PASS",
      subBadge: "BIOMETRIC UNLOCKED • 24/7 ACCESS",
      price: 2499,
      quarterlyPrice: 6999,
      annualPrice: 24999,
      duration: "Monthly",
      description:
        "Full unrestricted access to strength arenas, cardio zones, locker rooms, biothermal sauna, and the Titan Pulse Companion App.",
      perks:
        "All-Access Gym Floor & Cardio Zone, Biometric Smart Locker Activation, 3D Body Composition Bio-Scan, Sauna & Recovery Lounge Access",
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
const getCMS = async (req, res) => {
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
};

// PUT /api/cms - Update full CMS / brand settings in MongoDB
const updateCMS = async (req, res) => {
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
};

// PUT /api/cms/:section - Update specific CMS section (e.g. brand, memberships)
const updateCMSSection = async (req, res) => {
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
};

// POST /api/cms/reset - Reset CMS settings to defaults in MongoDB
const resetCMS = async (req, res) => {
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
};

module.exports = {
  getCMS,
  updateCMS,
  updateCMSSection,
  resetCMS,
  defaultLandingData,
};
