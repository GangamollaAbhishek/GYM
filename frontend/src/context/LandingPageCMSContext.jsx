import React, { createContext, useContext, useState, useEffect } from 'react';

const defaultLandingData = {
  brand: {
    name: 'TITAN•PULSE',
    subname: '3D FITNESS SYSTEM',
    tagline: 'RISE ABOVE AVERAGE. DOMINATE YOUR LIMITS.',
    logo: ''
  },
  hero: {
    headlinePart1: 'STRONGER',
    headlinePart2: 'EVERY DAY',
    headlineHoverText: 'BELIEVE IN YOURSELF',
    description: 'Transform your body. Sharpen your mind. Join a community that never quits.',
    ctaButtonText: 'JOIN NOW',
    membersCount: '10K+',
    membersLabel: 'Strong Members',
    transformationsCount: '500+',
    transformationsLabel: 'Transformations',
    hoursCount: '24/7',
    hoursLabel: 'Gym Access',
    athleteImage: '/assets/hero-athlete.png'
  },
  horizontalWords: {
    sentence: 'PAIN IS TEMPORARY GLORY IS FOREVER',
    bottomText: 'Your only limit is you. Every rep, every drop of sweat, and every painful set brings you closer to your ultimate transformation. Rise above average. Dominate your limits.'
  },
  exploreEscape: {
    tagline: 'EXPLORE THE UNSEEN',
    headingMain: 'Find your next',
    headingHighlight: 'breaking point.',
    cards: [
      {
        key: 'hypertrophy',
        title: 'Hypertrophic\nProtocols',
        text: 'Maximum motor unit recruitment for dense muscular growth.',
        category: 'STRENGTH ARENA',
        image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80'
      },
      {
        key: 'cardio',
        title: 'Cyber Cardio\nDecks',
        text: 'High-intensity metabolic circuits driving EPOC oxygen surge.',
        category: 'METABOLIC DRIVE',
        image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80'
      },
      {
        key: 'athletic',
        title: 'Athletic\nKinematics',
        text: 'Force-velocity curve optimization and jump mechanics.',
        category: 'PLYOMETRIC TURF',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80'
      },
      {
        key: 'recovery',
        title: 'Sub-Zero\nRecovery Pods',
        text: 'Cryotherapy and biothermal infrared decompression.',
        category: 'CRYO DECOMPRESSION',
        image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  supplements: {
    title: 'TITAN SUPPLEVATION MATRIX',
    subtitle: '3D KINETIC PRE-WORKOUT & NITROGEN BOOST ENGINE • INTERACTIVE SHOWCASE',
    products: [
      {
        id: 1,
        title: 'WRATHX KINETIC PRE-WORKOUT',
        badge: '01 • EXPLOSIVE IGNITION',
        rating: '4.95',
        image: '/wrathx-preworkout.jpg',
        description: 'Engineered for unyielding kinetic output. Formulated with 350mg Caffeine Anhydrous, 6000mg L-Citrulline Malate, and Beta-Alanine to ignite explosive muscle pumps, razor-sharp focus, and relentless stamina.',
        flavors: ['Crimson Electric', 'Sour Dragonfruit', 'Hyper Blue Razz'],
        specs: ['350mg Caffeine', '6g Citrulline Malate', '3.2g Beta-Alanine', 'Creapure®']
      },
      {
        id: 2,
        title: 'TITAN ISO-WHEY GOLD',
        badge: '02 • HYPERTROPHY REBUILD',
        rating: '4.92',
        image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=1000&auto=format&fit=crop',
        description: 'Ultra-pure micro-filtered whey protein isolate delivering 28g of rapid-absorbing protein, 6.5g BCAA, and zero added sugars per scoop. Designed for immediate post-workout muscle synthesis.',
        flavors: ['Dark Chocolate Fudge', 'French Vanilla', 'Salted Caramel'],
        specs: ['28g Isolate', '6.5g BCAA', 'Zero Sugar', '110 Kcal']
      },
      {
        id: 3,
        title: 'CREATINE MICRO-PURE 5000',
        badge: '03 • ATP CELLULAR POWER',
        rating: '4.98',
        image: 'https://images.unsplash.com/photo-1579722820308-d74e571900a9?q=80&w=1000&auto=format&fit=crop',
        description: '100% German Creapure® Monohydrate micronized to 200 mesh for maximum solubility. Saturates muscle ATP stores to elevate maximal power output and intracellular hydration.',
        flavors: ['Unflavored Pure', 'Atomic Grape', 'Electric Lemonade'],
        specs: ['100% Creapure®', '5000mg Mesh', 'Micronized', 'ATP Surge']
      },
      {
        id: 4,
        title: 'AMINO MATRIX BCAA + ELECTROLYTES',
        badge: '04 • INTRA-WORKOUT HYDRATION',
        rating: '4.89',
        image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?q=80&w=1000&auto=format&fit=crop',
        description: 'Instantized 2:1:1 BCAA ratio infused with key coconut water electrolyte hydration minerals. Halts intra-workout muscle catabolism and eliminates DOMS.',
        flavors: ['Island Punch', 'Watermelon Wave', 'Mango Heat'],
        specs: ['2:1:1 BCAA Ratio', 'Coco-Electrolytes', 'Zero Calories', 'Rapid Hydration']
      }
    ]
  },
  equipment: {
    tagline: 'HOW IT WORKS • 3D CARD STACK',
    title: '3D SMART EQUIPMENT ENGINE',
    steps: [
      {
        id: 'step-01',
        step: 'Step 01 of 4',
        title: 'Biometric Scan & Assessment',
        subtitle: '3D Body Composition Profiling',
        desc: 'High-precision 3D optical body scanning analyzes muscle volume distribution, body fat percentage, and postural alignment in 60 seconds.',
        image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'step-02',
        step: 'Step 02 of 4',
        title: 'AI-Customized Training Split',
        subtitle: 'Algorithmic Periodization',
        desc: 'Neural engine computes your optimal weekly volume, exercise selection, and recovery ratios based on your muscle fiber composition.',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'step-03',
        step: 'Step 03 of 4',
        title: 'Smart Equipment Resistance Setup',
        subtitle: 'Electromagnetic Load Tuning',
        desc: 'Smart machines auto-adjust seat height and electromagnetic resistance in real time based on velocity drop-off and force production.',
        image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'step-04',
        step: 'Step 04 of 4',
        title: '24/7 Elite Trainer Support',
        subtitle: 'Continuous Velocity Profiling',
        desc: 'Certified coaches monitor form metrics live on overhead telemetry displays to refine movement mechanics during peak lifts.',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  footer: {
    brandQuote: 'DOMINATE YOUR LIMITS WITH TITAN PULSE 3D.',
    copyright: '© 2026 TITAN PULSE 3D SYSTEM. ALL RIGHTS RESERVED.',
    contactEmail: 'contact@titanpulse.fit',
    contactPhone: '+91 98765 43210',
    address: 'Cyber Arena Complex, High-Tech City, Hyderabad, IN',
    socials: {
      instagram: 'https://instagram.com',
      youtube: 'https://youtube.com',
      twitter: 'https://twitter.com',
      facebook: 'https://facebook.com',
      linkedin: 'https://linkedin.com'
    }
  }
};

const LandingPageCMSContext = createContext();

export function LandingPageCMSProvider({ children }) {
  const [cmsData, setCmsData] = useState(() => {
    try {
      const saved = localStorage.getItem('titan_landing_cms');
      return saved ? JSON.parse(saved) : defaultLandingData;
    } catch (e) {
      return defaultLandingData;
    }
  });

  const updateSection = (sectionKey, newSectionData) => {
    setCmsData(prev => {
      const updated = {
        ...prev,
        [sectionKey]: {
          ...prev[sectionKey],
          ...newSectionData
        }
      };
      localStorage.setItem('titan_landing_cms', JSON.stringify(updated));
      return updated;
    });
  };

  const updateFullCMS = (newFullData) => {
    setCmsData(newFullData);
    localStorage.setItem('titan_landing_cms', JSON.stringify(newFullData));
  };

  const resetToDefaults = () => {
    setCmsData(defaultLandingData);
    localStorage.setItem('titan_landing_cms', JSON.stringify(defaultLandingData));
  };

  return (
    <LandingPageCMSContext.Provider
      value={{
        cmsData,
        updateSection,
        updateFullCMS,
        resetToDefaults,
        defaultLandingData
      }}
    >
      {children}
    </LandingPageCMSContext.Provider>
  );
}

export function useLandingPageCMS() {
  const context = useContext(LandingPageCMSContext);
  if (!context) {
    return {
      cmsData: defaultLandingData,
      updateSection: () => {},
      updateFullCMS: () => {},
      resetToDefaults: () => {},
      defaultLandingData
    };
  }
  return context;
}
