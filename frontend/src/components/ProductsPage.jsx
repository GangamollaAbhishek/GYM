import React, { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Zap,
  Star,
  Search,
  SlidersHorizontal,
  Flame,
  ShieldCheck,
  CheckCircle2,
  Plus,
  Minus,
  Eye,
  X,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Package,
  Award,
  Truck,
  RotateCcw,
  Check,
  ChevronDown,
  ChevronRight,
  Filter,
  Layers,
  Activity,
  Heart,
  ExternalLink,
  User,
} from "lucide-react";
import { useLandingPageCMS } from "../context/LandingPageCMSContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import ProfileDropdown from "./ProfileDropdown";

// Comprehensive Catalog of Premium Gym Supplements & Powerlifting Gear
const BASE_PRODUCTS_CATALOG = [
  {
    id: "prod-wrathx",
    name: "WRATHX Kinetic Pre-Workout Ultra",
    title: "WRATHX KINETIC PRE-WORKOUT",
    category: "preworkout",
    categoryLabel: "Pre-Workouts",
    badge: "01 • EXPLOSIVE IGNITION",
    tag: "BEST SELLER",
    rating: 4.95,
    reviewsCount: 428,
    price: 2199,
    mrp: 2999,
    image: "/wrathx-preworkout.jpg",
    description:
      "Engineered for unyielding kinetic output. Formulated with 350mg Caffeine Anhydrous, 6000mg L-Citrulline Malate, and Beta-Alanine to ignite explosive muscle pumps, razor-sharp focus, and relentless stamina.",
    flavors: ["Crimson Electric", "Sour Dragonfruit", "Hyper Blue Razz"],
    specs: ["350mg Caffeine", "6g Citrulline Malate", "3.2g Beta-Alanine", "Creapure®"],
    nutrition: {
      servingSize: "1 Scoop (15g)",
      servingsPerContainer: "30",
      caffeine: "350mg",
      citrulline: "6000mg",
      betaAlanine: "3200mg",
      calories: "5 Kcal",
    },
    inStock: true,
  },
  {
    id: "prod-iso-whey",
    name: "TITAN ISO-Whey Gold 100% Isolate (2kg)",
    title: "TITAN ISO-WHEY GOLD",
    category: "protein",
    categoryLabel: "Protein & Whey",
    badge: "02 • HYPERTROPHY REBUILD",
    tag: "TOP RATED",
    rating: 4.92,
    reviewsCount: 512,
    price: 4899,
    mrp: 6499,
    image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=1000&auto=format&fit=crop",
    description:
      "Ultra-pure micro-filtered whey protein isolate delivering 28g of rapid-absorbing protein, 6.5g BCAA, and zero added sugars per scoop. Designed for immediate post-workout muscle synthesis.",
    flavors: ["Dark Chocolate Fudge", "French Vanilla", "Salted Caramel", "Cafe Mocha"],
    specs: ["28g Isolate", "6.5g BCAA", "Zero Sugar", "110 Kcal"],
    nutrition: {
      servingSize: "1 Scoop (32g)",
      servingsPerContainer: "62",
      protein: "28g",
      bcaa: "6.5g",
      sugar: "0g",
      calories: "110 Kcal",
    },
    inStock: true,
  },
  {
    id: "prod-creatine-pure",
    name: "Creatine Micro-Pure 5000 Creapure® (300g)",
    title: "CREATINE MICRO-PURE 5000",
    category: "creatine",
    categoryLabel: "Creatine & Strength",
    badge: "03 • ATP CELLULAR POWER",
    tag: "100% GERMAN CREAPURE",
    rating: 4.98,
    reviewsCount: 680,
    price: 1499,
    mrp: 1999,
    image: "https://images.unsplash.com/photo-1579722820308-d74e571900a9?q=80&w=1000&auto=format&fit=crop",
    description:
      "100% German Creapure® Monohydrate micronized to 200 mesh for maximum solubility. Saturates muscle ATP stores to elevate maximal power output and intracellular hydration.",
    flavors: ["Unflavored Pure", "Atomic Grape", "Electric Lemonade"],
    specs: ["100% Creapure®", "5000mg Mesh", "Micronized", "ATP Surge"],
    nutrition: {
      servingSize: "1 Scoop (5g)",
      servingsPerContainer: "60",
      creatineMonohydrate: "5000mg",
      purity: "99.99%",
      calories: "0 Kcal",
    },
    inStock: true,
  },
  {
    id: "prod-bcaa-matrix",
    name: "Amino Matrix BCAA 2:1:1 + Electrolytes",
    title: "AMINO MATRIX BCAA + ELECTROLYTES",
    category: "recovery",
    categoryLabel: "Recovery & Aminos",
    badge: "04 • INTRA-WORKOUT HYDRATION",
    tag: "HYDRATION MATRIX",
    rating: 4.89,
    reviewsCount: 320,
    price: 1899,
    mrp: 2499,
    image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?q=80&w=1000&auto=format&fit=crop",
    description:
      "Instantized 2:1:1 BCAA ratio infused with key coconut water electrolyte hydration minerals. Halts intra-workout muscle catabolism and eliminates DOMS.",
    flavors: ["Island Punch", "Watermelon Wave", "Mango Heat"],
    specs: ["2:1:1 BCAA Ratio", "Coco-Electrolytes", "Zero Calories", "Rapid Hydration"],
    nutrition: {
      servingSize: "1 Scoop (10g)",
      servingsPerContainer: "30",
      bcaa: "7000mg",
      electrolytes: "850mg",
      calories: "0 Kcal",
    },
    inStock: true,
  },
  {
    id: "prod-nitro-shock",
    name: "Nitro-Shock Pump Matrix (Non-Stim)",
    title: "NITRO-SHOCK PUMP MATRIX",
    category: "preworkout",
    categoryLabel: "Pre-Workouts",
    badge: "05 • VASODILATION OVERDRIVE",
    tag: "STIM-FREE",
    rating: 4.91,
    reviewsCount: 215,
    price: 2399,
    mrp: 3199,
    image: "https://images.unsplash.com/photo-1546483875-ad9014c88eba?q=80&w=1000&auto=format&fit=crop",
    description:
      "Stimulant-free massive pump catalyst powered by 8g Pure L-Citrulline, Nitrosigine®, and HydroMax Glycerol for skin-splitting muscular fullness and vascularity.",
    flavors: ["Sour Apple Glacier", "Tropical Sunrise"],
    specs: ["8g Pure Citrulline", "1.5g Nitrosigine®", "HydroMax® 65%", "Stimulant-Free"],
    nutrition: {
      servingSize: "1 Scoop (16g)",
      servingsPerContainer: "25",
      citrulline: "8000mg",
      nitrosigine: "1500mg",
      calories: "10 Kcal",
    },
    inStock: true,
  },
  {
    id: "prod-mass-gainer",
    name: "Titan Anabolic Mass Gainer (3kg)",
    title: "TITAN ANABOLIC MASS GAINER",
    category: "protein",
    categoryLabel: "Protein & Whey",
    badge: "06 • CALORIC DENSITY ENGINE",
    tag: "HIGH CALORIE",
    rating: 4.88,
    reviewsCount: 390,
    price: 3699,
    mrp: 4999,
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1000&auto=format&fit=crop",
    description:
      "Engineered for hardgainers. Packed with 60g multi-phase sustained release protein, 240g clean complex carbohydrates, and 1,250 anabolic calories per serving.",
    flavors: ["Rich Chocolate Brownie", "Vanilla Cream Swirl", "Cookies & Cream"],
    specs: ["60g Protein Matrix", "1,250 Calories", "5g Creapure®", "Digestive Enzymes"],
    nutrition: {
      servingSize: "2 Scoops (300g)",
      servingsPerContainer: "10",
      protein: "60g",
      carbs: "240g",
      calories: "1250 Kcal",
    },
    inStock: true,
  },
  {
    id: "prod-thermo-shred",
    name: "Thermo-Shred Extreme Fat Incinerator",
    title: "THERMO-SHRED EXTREME",
    category: "burners",
    categoryLabel: "Fat Burners",
    badge: "07 • METABOLIC THERMOGENESIS",
    tag: "RAPID SHRED",
    rating: 4.86,
    reviewsCount: 298,
    price: 1999,
    mrp: 2799,
    image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1000&auto=format&fit=crop",
    description:
      "Advanced thermogenic fat burning capsule formulated with Grains of Paradise, L-Carnitine L-Tartrate, Capsimax®, and Green Tea EGCG to torch stubborn adipose tissue.",
    flavors: ["120 Veggie Capsules", "60 Thermo Servings"],
    specs: ["Capsimax® 100mg", "1000mg L-Carnitine", "Grains of Paradise", "Appetite Control"],
    nutrition: {
      servingSize: "2 Capsules",
      servingsPerContainer: "60",
      carnitine: "1000mg",
      caffeine: "200mg",
      calories: "0 Kcal",
    },
    inStock: true,
  },
  {
    id: "prod-testo-surge",
    name: "Testo-Surge Black Matrix (90 Caps)",
    title: "TESTO-SURGE BLACK MATRIX",
    category: "vitamins",
    categoryLabel: "Vitamins & Wellness",
    badge: "08 • FREE TESTOSTERONE SURGE",
    tag: "NATURAL ANABOLIC",
    rating: 4.93,
    reviewsCount: 410,
    price: 2799,
    mrp: 3599,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop",
    description:
      "Clinical strength free testosterone booster formulated with KSM-66® Ashwagandha, PrimaVie® Shilajit, Tongkat Ali, and Boron Citrate for enhanced libido and power.",
    flavors: ["90 Anabolic Capsules"],
    specs: ["KSM-66® 600mg", "PrimaVie® Shilajit 500mg", "Tongkat Ali 200:1", "Boron 10mg"],
    nutrition: {
      servingSize: "3 Capsules Daily",
      servingsPerContainer: "30",
      ashwagandha: "600mg",
      shilajit: "500mg",
      calories: "0 Kcal",
    },
    inStock: true,
  },
  {
    id: "prod-zma-night",
    name: "ZMA Night Recovery + Melatonin",
    title: "ZMA NIGHT RECOVERY",
    category: "recovery",
    categoryLabel: "Recovery & Aminos",
    badge: "09 • DEEP REM REGENERATION",
    tag: "SLEEP & REPAIR",
    rating: 4.87,
    reviewsCount: 185,
    price: 1299,
    mrp: 1799,
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1000&auto=format&fit=crop",
    description:
      "Zinc Monomethionine, Magnesium Aspartate, Vitamin B6 and 3mg Melatonin to maximize nocturnal growth hormone release and deep restorative REM sleep.",
    flavors: ["60 Night Capsules"],
    specs: ["Zinc 30mg", "Magnesium 450mg", "Vitamin B6 10.5mg", "Melatonin 3mg"],
    nutrition: {
      servingSize: "2 Capsules Before Bed",
      servingsPerContainer: "30",
      magnesium: "450mg",
      zinc: "30mg",
      calories: "0 Kcal",
    },
    inStock: true,
  },
  {
    id: "prod-daily-multi",
    name: "Daily Vital-Core Active Multivitamin",
    title: "DAILY VITAL-CORE MULTI",
    category: "vitamins",
    categoryLabel: "Vitamins & Wellness",
    badge: "10 • MICRONUTRIENT SHIELD",
    tag: "38 INGREDIENTS",
    rating: 4.85,
    reviewsCount: 340,
    price: 899,
    mrp: 1299,
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=1000&auto=format&fit=crop",
    description:
      "High-potency multivitamin engineered for high-output athletes. Delivers 38 bioavailable vitamins, minerals, antioxidants, and digestive botanical extracts.",
    flavors: ["60 Daily Tablets"],
    specs: ["100% RDA Minerals", "Immune Defense", "Antioxidant Complex", "Enzyme Support"],
    nutrition: {
      servingSize: "1 Tablet Daily",
      servingsPerContainer: "60",
      vitaminsCount: "23 Essential",
      mineralsCount: "15 Trace",
      calories: "0 Kcal",
    },
    inStock: true,
  },
  {
    id: "prod-omega-3",
    name: "Triple Strength Omega-3 Fish Oil (1250mg)",
    title: "TRIPLE STRENGTH OMEGA-3",
    category: "vitamins",
    categoryLabel: "Vitamins & Wellness",
    badge: "11 • CARDIO & JOINT INTEGRITY",
    tag: "MOLECULARLY DISTILLED",
    rating: 4.94,
    reviewsCount: 460,
    price: 1199,
    mrp: 1699,
    image: "https://images.unsplash.com/photo-1577401239170-897942555fb3?q=80&w=1000&auto=format&fit=crop",
    description:
      "Ultra-concentrated enteric-coated fish oil delivering 560mg EPA and 400mg DHA per softgel. Molecularly distilled for zero heavy metals or fishy burps.",
    flavors: ["60 Enteric Softgels"],
    specs: ["560mg EPA", "400mg DHA", "Zero Mercury", "Joint Lubrication"],
    nutrition: {
      servingSize: "1 Softgel",
      servingsPerContainer: "60",
      fishOil: "1250mg",
      totalOmega3: "1000mg",
      calories: "10 Kcal",
    },
    inStock: true,
  },
  {
    id: "prod-leather-belt",
    name: "Titan Heavy-Duty 10mm Leather Powerlifting Belt",
    title: "TITAN 10MM POWERLIFTING BELT",
    category: "gear",
    categoryLabel: "Gym Gear & Belts",
    badge: "12 • POWERLIFTING GRADE",
    tag: "IPF COMPLIANT",
    rating: 4.97,
    reviewsCount: 310,
    price: 2499,
    mrp: 3499,
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1000&auto=format&fit=crop",
    description:
      "10mm thick double-prong suede leather belt engineered for heavy squats and deadlifts. Provides rock-solid intra-abdominal spinal support and bracing rigidity.",
    flavors: ["Size S (28-32\")", "Size M (32-36\")", "Size L (36-40\")", "Size XL (40-44\")"],
    specs: ["10mm Full Suede", "Dual Steel Prongs", "Heavy Reinforced Stitching", "Non-Slip"],
    nutrition: {
      material: "Genuine Buffalo Suede",
      buckle: "Stainless Steel Double Prong",
      warranty: "2 Year Structural Guarantee",
    },
    inStock: true,
  },
  {
    id: "prod-lifting-straps",
    name: "Titan Pro-Grip Padded Lifting Straps (Pair)",
    title: "PRO-GRIP LIFTING STRAPS",
    category: "gear",
    categoryLabel: "Gym Gear & Belts",
    badge: "13 • MAXIMUM PULL TRACTION",
    tag: "NEOPRENE PADDED",
    rating: 4.92,
    reviewsCount: 520,
    price: 699,
    mrp: 999,
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop",
    description:
      "Heavy-duty woven cotton lifting straps with 5mm thick wrist neoprene padding. Eliminates grip fatigue on heavy barbell rows, deadlifts, and lat pulldowns.",
    flavors: ["Matte Obsidian Black", "Titan Crimson Red"],
    specs: ["24-Inch Length", "5mm Neoprene Wrist Pad", "Cross-Stitched Cotton", "Heavy Pull Tested"],
    nutrition: {
      material: "100% Heavy Duty Cotton Webbing",
      padding: "5mm High-Density Neoprene",
      capacity: "Rated up to 450kg / 1000lbs",
    },
    inStock: true,
  },
  {
    id: "prod-steel-shaker",
    name: "Titan 3D Stainless Steel Insulated Shaker (900ml)",
    title: "TITAN 3D STEEL SHAKER",
    category: "gear",
    categoryLabel: "Gym Gear & Belts",
    badge: "14 • ZERO-ODOR HYDRATION",
    tag: "DOUBLE WALL VACUUM",
    rating: 4.96,
    reviewsCount: 385,
    price: 1199,
    mrp: 1799,
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1000&auto=format&fit=crop",
    description:
      "Kitchen-grade 18/8 double-walled vacuum insulated stainless steel shaker bottle. Keeps beverages ice cold for 24 hours with leakproof lid and silent blending mesh.",
    flavors: ["Stealth Matte Black", "Brushed Titanium Silver", "Crimson Pulse Red"],
    specs: ["18/8 Food Stainless", "24hr Cold Lock", "Leakproof Silicone Seal", "Zero Odor Retention"],
    nutrition: {
      capacity: "900ml / 30oz",
      insulation: "Double-Wall Vacuum Insulation",
      bpaFree: "100% BPA & Toxin Free",
    },
    inStock: true,
  },
  {
    id: "prod-knee-sleeves",
    name: "Titan 7mm Powerlifting Neoprene Knee Sleeves",
    title: "7MM KNEE SLEEVES (PAIR)",
    category: "gear",
    categoryLabel: "Gym Gear & Belts",
    badge: "15 • JOINT REBOUND ENGINE",
    tag: "7MM RIGID NEOPRENE",
    rating: 4.94,
    reviewsCount: 275,
    price: 1899,
    mrp: 2699,
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1000&auto=format&fit=crop",
    description:
      "Heavy compression 7mm neoprene knee sleeves designed for maximal knee joint warmth, patellar stabilization, and elastic kinetic rebound during deep squats.",
    flavors: ["Size S", "Size M", "Size L", "Size XL"],
    specs: ["7mm High-Grade Neoprene", "Ergonomic 3D Contour", "Reinforced Seams", "Approved for Meets"],
    nutrition: {
      thickness: "7mm Compression Neoprene",
      pack: "Pair (Left & Right)",
      care: "Hand Wash Cold",
    },
    inStock: true,
  },
  {
    id: "prod-duffle-bag",
    name: "Titan Tactical 45L Water-Resistant Gym Duffle",
    title: "TITAN TACTICAL 45L DUFFLE",
    category: "gear",
    categoryLabel: "Gym Gear & Belts",
    badge: "16 • ATHLETE GEAR CARRIER",
    tag: "WATER RESISTANT",
    rating: 4.90,
    reviewsCount: 220,
    price: 2999,
    mrp: 4299,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop",
    description:
      "Military-grade 900D Oxford waterproof gym bag with separate ventilated shoe compartment, wet towel pocket, shaker holster, and padded shoulder strap.",
    flavors: ["Tactical Black", "Army Olive", "Urban Charcoal"],
    specs: ["45L Heavy Volume", "Ventilated Shoe Pocket", "900D Oxford Canvas", "Heavy Molle Webbing"],
    nutrition: {
      dimensions: "52cm x 28cm x 30cm",
      material: "900D High-Density Waterproof Oxford",
      compartments: "7 Multi-Utility Pockets",
    },
    inStock: true,
  },
];

const CATEGORIES = [
  { id: "all", label: "All Products", icon: Sparkles },
  { id: "preworkout", label: "Pre-Workouts", icon: Zap },
  { id: "protein", label: "Protein & Whey", icon: Award },
  { id: "creatine", label: "Creatine & Strength", icon: Flame },
  { id: "recovery", label: "Recovery & Aminos", icon: Activity },
  { id: "burners", label: "Fat Burners", icon: Flame },
  { id: "vitamins", label: "Vitamins & Wellness", icon: ShieldCheck },
  { id: "gear", label: "Gym Belts & Gear", icon: Package },
];

export default function ProductsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cmsData } = useLandingPageCMS();
  const { cart, addToCart, totalItemsCount, totalPrice } = useCart();

  // Filters & Search States
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured"); // 'featured' | 'price-asc' | 'price-desc' | 'rating'
  const [selectedFlavors, setSelectedFlavors] = useState({});
  const [quantities, setQuantities] = useState({});
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Merge CMS Dynamic Products from Admin into Catalog
  const allProducts = useMemo(() => {
    const cmsProducts = cmsData?.supplements?.products || [];

    // Map CMS products into standard product structure
    const formattedCmsProducts = cmsProducts.map((p, idx) => {
      const pId = p.id || `cms-prod-${idx}`;
      const pPrice = p.price ? Number(p.price) : idx === 0 ? 2199 : idx === 1 ? 4899 : idx === 2 ? 1499 : idx === 3 ? 1899 : 2499;
      const pMrp = Math.round(pPrice * 1.35);
      const pFlavors = Array.isArray(p.flavors)
        ? p.flavors
        : typeof p.flavors === "string"
        ? p.flavors.split(",").map((s) => s.trim()).filter(Boolean)
        : ["Standard Edition"];
      const pSpecs = Array.isArray(p.specs)
        ? p.specs
        : typeof p.specs === "string"
        ? p.specs.split(",").map((s) => s.trim()).filter(Boolean)
        : ["100% Pure", "Lab Tested", "Biometric Verified"];

      let category = "preworkout";
      const titleLower = (p.title || "").toLowerCase();
      if (titleLower.includes("whey") || titleLower.includes("protein") || titleLower.includes("isolate") || titleLower.includes("gainer")) {
        category = "protein";
      } else if (titleLower.includes("creatine") || titleLower.includes("pure 5000") || titleLower.includes("atp")) {
        category = "creatine";
      } else if (titleLower.includes("bcaa") || titleLower.includes("amino") || titleLower.includes("recovery") || titleLower.includes("zma")) {
        category = "recovery";
      } else if (titleLower.includes("burn") || titleLower.includes("thermo") || titleLower.includes("shred")) {
        category = "burners";
      } else if (titleLower.includes("vita") || titleLower.includes("omega") || titleLower.includes("testo") || titleLower.includes("mineral")) {
        category = "vitamins";
      } else if (titleLower.includes("belt") || titleLower.includes("strap") || titleLower.includes("shaker") || titleLower.includes("sleeve") || titleLower.includes("bag")) {
        category = "gear";
      }

      return {
        id: pId,
        name: p.title || `Titan Performance Formula 0${idx + 1}`,
        title: p.title || `Titan Performance Formula 0${idx + 1}`,
        category,
        categoryLabel: CATEGORIES.find((c) => c.id === category)?.label || "Supplements",
        badge: p.badge || `0${idx + 1} • HQ VERIFIED FORMULA`,
        tag: "ADMIN LIVE CMS",
        rating: Number(p.rating) || 4.95,
        reviewsCount: 350 + idx * 45,
        price: pPrice,
        mrp: pMrp,
        image: p.image || "/wrathx-preworkout.jpg",
        description:
          p.description ||
          "Scientifically formulated for maximum hypertrophy and athletic endurance. Meets Olympic-grade purity standards with instant bioavailability.",
        flavors: pFlavors.length > 0 ? pFlavors : ["Crimson Electric", "Dark Chocolate Fudge"],
        specs: pSpecs,
        isCmsAdded: true,
        nutrition: {
          servingSize: "1 Scoop",
          servingsPerContainer: "30",
          purity: "99.8% Lab Certified",
          dopingFree: "100% WADA Compliant",
        },
        inStock: true,
      };
    });

    // Merge: Put CMS products first, then non-duplicate Base Products
    const merged = [...formattedCmsProducts];
    BASE_PRODUCTS_CATALOG.forEach((baseProd) => {
      const exists = merged.some(
        (m) =>
          m.title.trim().toLowerCase() === baseProd.title.trim().toLowerCase() ||
          m.name.trim().toLowerCase() === baseProd.name.trim().toLowerCase()
      );
      if (!exists) {
        merged.push(baseProd);
      }
    });

    return merged;
  }, [cmsData]);

  // Filtered & Sorted Product List
  const filteredProducts = useMemo(() => {
    let list = [...allProducts];

    // Category Filter
    if (selectedCategory !== "all") {
      list = list.filter((p) => p.category === selectedCategory);
    }

    // Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.badge && p.badge.toLowerCase().includes(q)) ||
          p.specs.some((s) => s.toLowerCase().includes(q)) ||
          p.flavors.some((f) => f.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sortBy === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [allProducts, selectedCategory, searchQuery, sortBy]);

  // Handle Flavor Selection
  const handleFlavorChange = (productId, flavor) => {
    setSelectedFlavors((prev) => ({
      ...prev,
      [productId]: flavor,
    }));
  };

  // Handle Quantity Change
  const handleQuantityChange = (productId, delta) => {
    setQuantities((prev) => {
      const current = prev[productId] || 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [productId]: next };
    });
  };

  // Add Product to Cart
  const handleAddToCart = (product, directCheckout = false) => {
    const chosenFlavor = selectedFlavors[product.id] || (product.flavors && product.flavors[0]) || "Standard";
    const qty = quantities[product.id] || 1;

    const cartItem = {
      id: `${product.id}-${chosenFlavor.replace(/\s+/g, "_")}`,
      name: `${product.name} (${chosenFlavor})`,
      price: product.price,
      image: product.image,
      category: product.categoryLabel || "Supplements",
      flavor: chosenFlavor,
      quantity: qty,
    };

    addToCart(cartItem, qty);
    showToast(`🛒 Added ${qty}x ${product.name} (${chosenFlavor}) to cart!`);

    if (directCheckout) {
      navigate("/cart");
    }
  };

  return (
    <div className="bg-[#0B0B0B] min-h-screen text-white pt-8 pb-28 font-sans selection:bg-[#FF1E27] selection:text-white">
      {/* Dynamic Toast Feedback Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[100] animate-fadeIn">
          <div className="px-5 py-3.5 rounded-2xl bg-[#141419] border border-[#FF1E27]/50 shadow-[0_0_30px_rgba(255,30,39,0.3)] text-white text-xs sm:text-sm font-semibold flex items-center gap-3">
            <Sparkles size={16} className="text-[#FF1E27] shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* ========================================================= */}
        {/* TOP DEDICATED STORE NAVIGATION HEADER                     */}
        {/* ========================================================= */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (window.history.length > 1) {
                  navigate(-1);
                } else {
                  navigate("/account?tab=payments&sub=supplements");
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 hover:text-white text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer border border-white/10 shadow-sm"
              title="Go Back"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <Link to="/" className="flex items-center gap-2">
              <span className="text-base font-black text-white tracking-wider font-['Outfit',sans-serif]">
                TITAN<span className="text-[#FF1E27]">•</span>PULSE
              </span>
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase hidden sm:inline bg-white/[0.04] px-2 py-0.5 rounded-md border border-white/[0.06]">
                OFFICIAL STORE
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/cart"
              className="relative px-3.5 py-2 rounded-xl bg-[#FF1E27]/15 hover:bg-[#FF1E27] text-[#FF1E27] hover:text-white text-xs font-bold transition-all flex items-center gap-2 border border-[#FF1E27]/30 shadow-sm cursor-pointer"
              title="View Cart"
            >
              <ShoppingBag size={15} />
              <span className="hidden sm:inline">Cart</span>
              {totalItemsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-[#FF1E27] text-white text-[10px] font-mono font-black">
                  {totalItemsCount}
                </span>
              )}
            </Link>

            {/* Animated Role & Account Profile Dropdown */}
            <ProfileDropdown />
          </div>
        </div>

        {/* ========================================================= */}
        {/* 1. SEARCH & FILTER CONTROLS                               */}
        {/* ========================================================= */}
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Search Input Bar */}
            <div className="relative flex-1 max-w-lg">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search supplements, whey isolate, creatine, belts, flavors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-[#121217] border border-white/10 text-white text-xs sm:text-sm placeholder-slate-500 outline-none focus:border-[#FF1E27] focus:ring-1 focus:ring-[#FF1E27]/30 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Sorting & Cart Indicator */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-[#121217] border border-white/10 rounded-2xl px-3.5 py-2.5">
                <SlidersHorizontal size={14} className="text-slate-400 shrink-0" />
                <span className="text-xs text-slate-400 hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-white text-xs font-semibold outline-none cursor-pointer"
                >
                  <option value="featured" className="bg-[#121217] text-white">
                    ⭐ Featured & Best Sellers
                  </option>
                  <option value="rating" className="bg-[#121217] text-white">
                    🏆 Highest Rated (4.9+)
                  </option>
                  <option value="price-asc" className="bg-[#121217] text-white">
                    💵 Price: Low to High
                  </option>
                  <option value="price-desc" className="bg-[#121217] text-white">
                    💎 Price: High to Low
                  </option>
                </select>
              </div>

              {/* View Cart Quick Button */}
              <Link
                to="/cart"
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#FF1E27] to-[#E50914] hover:brightness-110 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-[#FF1E27]/20 transition-all cursor-pointer shrink-0"
              >
                <ShoppingBag size={16} />
                <span>View Cart</span>
                {totalItemsCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-white text-[#FF1E27] text-xs font-mono font-black">
                    {totalItemsCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Category Filter Pills Bar */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              const count = cat.id === "all" ? allProducts.length : allProducts.filter((p) => p.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer border ${
                    isSelected
                      ? "bg-[#FF1E27] text-white border-[#FF1E27] shadow-[0_0_20px_rgba(255,30,39,0.35)]"
                      : "bg-[#121217] text-slate-300 hover:text-white border-white/[0.08] hover:border-white/20 hover:bg-white/[0.04]"
                  }`}
                >
                  <Icon size={14} className={isSelected ? "text-white" : "text-[#FF1E27]"} />
                  <span>{cat.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isSelected ? "bg-black/30 text-white" : "bg-white/[0.08] text-slate-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3. PRODUCTS GRID                                          */}
        {/* ========================================================= */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const currentFlavor = selectedFlavors[product.id] || (product.flavors && product.flavors[0]) || "Standard";
              const currentQty = quantities[product.id] || 1;
              const discountPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100);

              return (
                <div
                  key={product.id}
                  className="group relative rounded-3xl bg-[#121218] border border-white/[0.08] hover:border-[#FF1E27]/50 shadow-lg hover:shadow-[0_0_35px_rgba(255,30,39,0.18)] transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  {/* Top Badge Overlay */}
                  <div className="p-5 pb-0 flex items-start justify-between gap-2 z-10">
                    <span className="px-2.5 py-1 rounded-full bg-[#FF1E27]/15 border border-[#FF1E27]/30 text-[#FF1E27] text-[10px] font-mono font-bold uppercase tracking-wider">
                      {product.tag || product.badge}
                    </span>

                    <button
                      onClick={() => setQuickViewProduct(product)}
                      className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.15] text-slate-400 hover:text-white transition-all cursor-pointer"
                      title="Quick View Specifications"
                    >
                      <Eye size={15} />
                    </button>
                  </div>

                  {/* Product Image Frame */}
                  <div className="relative px-6 py-4 flex items-center justify-center h-52 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Product Details Body */}
                  <div className="p-5 pt-0 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      {/* Rating & Category */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 text-[11px] uppercase tracking-wider font-semibold font-mono">
                          {product.categoryLabel}
                        </span>
                        <div className="flex items-center gap-1 text-amber-400 font-bold">
                          <Star size={13} className="fill-amber-400 text-amber-400" />
                          <span>{product.rating}</span>
                          <span className="text-slate-500 text-[10px]">({product.reviewsCount})</span>
                        </div>
                      </div>

                      {/* Product Title */}
                      <h3
                        onClick={() => setQuickViewProduct(product)}
                        className="text-base font-bold text-white font-['Outfit',sans-serif] line-clamp-2 hover:text-[#FF1E27] transition-colors cursor-pointer"
                        title={product.name}
                      >
                        {product.name}
                      </h3>

                      {/* Nutrient / Spec Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {product.specs.slice(0, 3).map((spec, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[10px] text-slate-300 font-mono"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Flavor / Variant Selection */}
                    {product.flavors && product.flavors.length > 0 && (
                      <div className="space-y-1.5 pt-2 border-t border-white/[0.06]">
                        <label className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
                          <span>Variant / Flavor:</span>
                          <span className="text-cyan-400 font-normal truncate max-w-[130px]">{currentFlavor}</span>
                        </label>
                        <select
                          value={currentFlavor}
                          onChange={(e) => handleFlavorChange(product.id, e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-[#090C0E] border border-white/10 text-white text-xs outline-none focus:border-[#FF1E27] transition-all cursor-pointer"
                        >
                          {product.flavors.map((flavor, fIdx) => (
                            <option key={fIdx} value={flavor} className="bg-[#121217] text-white">
                              {flavor}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Price & Quantity & Actions */}
                    <div className="space-y-3 pt-3 border-t border-white/[0.06]">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl font-extrabold text-white font-mono">
                              ₹{product.price.toLocaleString("en-IN")}
                            </span>
                            <del className="text-xs text-slate-500 font-mono">
                              ₹{product.mrp.toLocaleString("en-IN")}
                            </del>
                          </div>
                          <span className="text-[10px] text-emerald-400 font-bold">
                            {discountPercent}% OFF • GST Included
                          </span>
                        </div>

                        {/* Quantity Stepper */}
                        <div className="flex items-center gap-1.5 bg-[#090C0E] border border-white/10 rounded-xl p-1">
                          <button
                            onClick={() => handleQuantityChange(product.id, -1)}
                            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="font-mono text-xs font-bold text-white px-1.5 min-w-[18px] text-center">
                            {currentQty}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(product.id, 1)}
                            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleAddToCart(product, false)}
                          className="py-2.5 px-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.14] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-white/[0.08]"
                        >
                          <ShoppingBag size={14} /> Add Cart
                        </button>
                        <button
                          onClick={() => handleAddToCart(product, true)}
                          className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#FF1E27] to-[#E50914] hover:brightness-110 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-[#FF1E27]/20 transition-all cursor-pointer"
                        >
                          <Zap size={14} /> Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty Search State */
          <div className="p-12 sm:p-16 rounded-3xl bg-[#121218] border border-white/[0.08] text-center space-y-4 max-w-lg mx-auto shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-[#FF1E27]/10 border border-[#FF1E27]/20 text-[#FF1E27] flex items-center justify-center mx-auto">
              <ShoppingBag size={30} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white font-['Outfit',sans-serif]">
                No Matching Supplements Found
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                We couldn't find any products matching "{searchQuery}". Try searching for whey, creatine, pre-workout, or lifting belts.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="px-5 py-2.5 rounded-xl bg-[#FF1E27] hover:bg-[#E50914] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              Reset Filters & Show All
            </button>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* 4. DETAILED PRODUCT QUICK VIEW MODAL                      */}
      {/* ========================================================= */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-[#121218] rounded-3xl border border-white/20 shadow-[0_0_60px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col max-h-[90vh] animate-fadeIn">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-[#181824] to-[#12121A] border-b border-white/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-[#FF1E27]/15 border border-[#FF1E27]/30 text-[#FF1E27] text-xs font-mono font-bold">
                  {quickViewProduct.badge}
                </span>
                <span className="text-xs text-slate-400">• {quickViewProduct.categoryLabel}</span>
              </div>
              <button
                onClick={() => setQuickViewProduct(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                <div className="sm:col-span-5 h-56 bg-[#090C0E] rounded-2xl border border-white/10 p-4 flex items-center justify-center">
                  <img
                    src={quickViewProduct.image}
                    alt={quickViewProduct.name}
                    className="max-h-full max-w-full object-contain filter drop-shadow-xl"
                  />
                </div>

                <div className="sm:col-span-7 space-y-3">
                  <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold">
                    <Star size={14} className="fill-amber-400 text-amber-400" />
                    <span>{quickViewProduct.rating} / 5.0</span>
                    <span className="text-slate-400 font-normal">({quickViewProduct.reviewsCount} athlete reviews)</span>
                  </div>

                  <h2 className="text-xl font-bold text-white font-['Outfit',sans-serif]">
                    {quickViewProduct.name}
                  </h2>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {quickViewProduct.description}
                  </p>

                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-2xl font-black text-white font-mono">
                      ₹{quickViewProduct.price.toLocaleString("en-IN")}
                    </span>
                    <del className="text-sm text-slate-500 font-mono">
                      ₹{quickViewProduct.mrp.toLocaleString("en-IN")}
                    </del>
                    <span className="text-xs text-emerald-400 font-bold">
                      {Math.round(((quickViewProduct.mrp - quickViewProduct.price) / quickViewProduct.mrp) * 100)}% OFF
                    </span>
                  </div>
                </div>
              </div>

              {/* Nutrition & Specifications Fact Panel */}
              <div className="p-4 rounded-2xl bg-[#090C0E] border border-white/10 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <ShieldCheck size={14} className="text-[#FF1E27]" />
                  BIO-TELEMETRY SPECIFICATIONS & NUTRITION FACTS
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {Object.entries(quickViewProduct.nutrition || {}).map(([key, value], idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block capitalize">
                        {key.replace(/([A-Z])/g, " $1")}
                      </span>
                      <span className="text-xs font-bold text-white font-mono mt-0.5 block">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Variant Picker Inside Modal */}
              {quickViewProduct.flavors && quickViewProduct.flavors.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300">
                    Select Flavor / Variant:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {quickViewProduct.flavors.map((flavor, fIdx) => {
                      const isSelected = (selectedFlavors[quickViewProduct.id] || quickViewProduct.flavors[0]) === flavor;
                      return (
                        <button
                          key={fIdx}
                          onClick={() => handleFlavorChange(quickViewProduct.id, flavor)}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                            isSelected
                              ? "bg-[#FF1E27] text-white border-[#FF1E27]"
                              : "bg-white/[0.04] text-slate-300 hover:text-white border-white/10"
                          }`}
                        >
                          {flavor}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions Footer */}
            <div className="p-5 bg-[#0D0D12] border-t border-white/10 flex items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-2 bg-[#090C0E] border border-white/10 rounded-xl p-1.5">
                <button
                  onClick={() => handleQuantityChange(quickViewProduct.id, -1)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <Minus size={14} />
                </button>
                <span className="font-mono text-sm font-bold text-white px-2">
                  {quantities[quickViewProduct.id] || 1}
                </span>
                <button
                  onClick={() => handleQuantityChange(quickViewProduct.id, 1)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <Plus size={14} />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    handleAddToCart(quickViewProduct, false);
                    setQuickViewProduct(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.16] text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer"
                >
                  <ShoppingBag size={15} /> Add to Cart
                </button>
                <button
                  onClick={() => {
                    handleAddToCart(quickViewProduct, true);
                    setQuickViewProduct(null);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF1E27] to-[#E50914] hover:brightness-110 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-[#FF1E27]/30 transition-all cursor-pointer"
                >
                  <Zap size={15} /> Checkout Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. FLOATING CART STATUS DRAWER                            */}
      {/* ========================================================= */}
      {totalItemsCount > 0 && (
        <div className="fixed bottom-6 right-6 z-[90] animate-bounce-short">
          <Link
            to="/cart"
            className="flex items-center gap-3.5 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-[#FF1E27] to-[#E50914] text-white shadow-[0_0_30px_rgba(255,30,39,0.5)] hover:scale-105 transition-all cursor-pointer group border border-white/20"
          >
            <div className="relative">
              <ShoppingBag size={20} className="group-hover:rotate-12 transition-transform" />
              <span className="absolute -top-2 -right-2 px-1.5 py-0.2 rounded-full bg-white text-[#FF1E27] text-[10px] font-mono font-black shadow-sm">
                {totalItemsCount}
              </span>
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-[10px] uppercase font-bold tracking-wider opacity-90 leading-tight">
                Athlete Cart ({totalItemsCount} Items)
              </div>
              <div className="text-sm font-black font-mono">
                ₹{totalPrice.toLocaleString("en-IN")}
              </div>
            </div>
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      )}
    </div>
  );
}
