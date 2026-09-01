import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Zap, Flame, ShieldCheck, Sparkles, Star, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useLandingPageCMS } from '../context/LandingPageCMSContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './PreworkoutShowcaseSection.css';

gsap.registerPlugin(ScrollTrigger);

const DEFAULT_PRODUCTS = [
  {
    id: 1,
    title: "WRATHX KINETIC PRE-WORKOUT",
    badge: "01 • EXPLOSIVE IGNITION",
    rating: "4.95",
    image: "/wrathx-preworkout.jpg",
    description: "Engineered for unyielding kinetic output. Formulated with 350mg Caffeine Anhydrous, 6000mg L-Citrulline Malate, and Beta-Alanine to ignite explosive muscle pumps, razor-sharp focus, and relentless stamina.",
    flavors: ["Crimson Electric", "Sour Dragonfruit", "Hyper Blue Razz"],
    specs: ["350mg Caffeine", "6g Citrulline Malate", "3.2g Beta-Alanine", "Creapure®"]
  },
  {
    id: 2,
    title: "TITAN ISO-WHEY GOLD",
    badge: "02 • HYPERTROPHY REBUILD",
    rating: "4.92",
    image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=1000&auto=format&fit=crop",
    description: "Ultra-pure micro-filtered whey protein isolate delivering 28g of rapid-absorbing protein, 6.5g BCAA, and zero added sugars per scoop. Designed for immediate post-workout muscle synthesis.",
    flavors: ["Dark Chocolate Fudge", "French Vanilla", "Salted Caramel"],
    specs: ["28g Isolate", "6.5g BCAA", "Zero Sugar", "110 Kcal"]
  },
  {
    id: 3,
    title: "CREATINE MICRO-PURE 5000",
    badge: "03 • ATP CELLULAR POWER",
    rating: "4.98",
    image: "https://images.unsplash.com/photo-1579722820308-d74e571900a9?q=80&w=1000&auto=format&fit=crop",
    description: "100% German Creapure® Monohydrate micronized to 200 mesh for maximum solubility. Saturates muscle ATP stores to elevate maximal power output and intracellular hydration.",
    flavors: ["Unflavored Pure", "Atomic Grape", "Electric Lemonade"],
    specs: ["100% Creapure®", "5000mg Mesh", "Micronized", "ATP Surge"]
  },
  {
    id: 4,
    title: "AMINO MATRIX BCAA + ELECTROLYTES",
    badge: "04 • INTRA-WORKOUT HYDRATION",
    rating: "4.89",
    image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?q=80&w=1000&auto=format&fit=crop",
    description: "Instantized 2:1:1 BCAA ratio infused with key coconut water electrolyte hydration minerals. Halts intra-workout muscle catabolism and eliminates DOMS.",
    flavors: ["Island Punch", "Watermelon Wave", "Mango Heat"],
    specs: ["2:1:1 BCAA Ratio", "Coco-Electrolytes", "Zero Calories", "Rapid Hydration"]
  }
];

export default function PreworkoutShowcaseSection({ onReserveSpot }) {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { cmsData } = useLandingPageCMS();
  const suppData = cmsData?.supplements || {};
  const productsData = (suppData.products && suppData.products.length > 0) ? suppData.products : DEFAULT_PRODUCTS;
  const sectionRef = useRef(null);
  const [selectedFlavors, setSelectedFlavors] = useState({
    1: "Crimson Electric",
    2: "Dark Chocolate Fudge",
    3: "Unflavored Pure",
    4: "Island Punch"
  });

  const handleFlavorSelect = (productId, flavor) => {
    setSelectedFlavors(prev => ({
      ...prev,
      [productId]: flavor
    }));
  };

  const handleReserve = (productTitle, productId) => {
    const chosenFlavor = selectedFlavors[productId];
    const fullItemName = `${productTitle} (${chosenFlavor})`;

    if (user || isAuthenticated) {
      const role = (user?.role || '').toLowerCase().trim();
      if (role === 'admin') navigate('/admin');
      else if (role === 'receptionist') navigate('/receptionist');
      else if (role === 'trainer') navigate('/trainer');
      else navigate('/account?tab=personal&sub=profile');
    } else {
      navigate('/login');
    }

    if (onReserveSpot) {
      onReserveSpot(fullItemName);
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const container = sectionRef.current;
      if (!container) return;

      const items = container.querySelectorAll('.showcase__item');

      items.forEach((item, index) => {
        const imgWrap = item.querySelector('.showcase__item-img-wrap');
        const img = item.querySelector('.showcase__item-img');
        const textBlock = item.querySelector('.showcase__item-text-block');

        if (!imgWrap || !img) return;

        gsap.set(item, { perspective: 1000 });
        gsap.set(imgWrap, { transformOrigin: '50% 100%' });
        if (textBlock) gsap.set(textBlock, { transform: 'translate3d(0,0,80px)' });

        const ry = (index % 2 === 0 ? -1 : 1) * 0.35;
        const rz = (index % 2 === 0 ? 1 : -1) * 0.25;
        const initialRot = -50 + (index % 2) * 5;

        // 3D Perspective Entrance Scroll Animation
        gsap.fromTo(imgWrap, {
          rotateX: initialRot,
          rotateY: ry * 20,
          rotateZ: rz * 10,
          opacity: 0.3
        }, {
          rotateX: 0,
          rotateY: 0,
          rotateZ: 0,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 88%',
            end: 'center 45%',
            scrub: 0.8
          }
        });

        // Parallax scroll movement for inner product image
        gsap.fromTo(img, {
          yPercent: -15,
          scale: 1.12
        }, {
          yPercent: 12,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: item,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          }
        });

        // Text reveal animation
        if (textBlock) {
          gsap.fromTo(textBlock, {
            opacity: 0,
            x: index % 2 === 0 ? 35 : -35
          }, {
            opacity: 1,
            x: 0,
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
              end: 'center 50%',
              scrub: 0.6
            }
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="preworkout-showcase" className="supplement-showcase-section">
      <div className="supplement-ambient-glow-1" />
      <div className="supplement-ambient-glow-2" />

      <div className="supplement-showcase-header">
        <h2>{suppData.title || "TITAN SUPPLEVATION MATRIX"}</h2>
        <p>{suppData.subtitle || "3D KINETIC PRE-WORKOUT & NITROGEN BOOST ENGINE • INTERACTIVE SHOWCASE"}</p>
      </div>

      <div className="supplement-grid">
        {productsData.map((item, index) => {
          const itemFlavors = (item.flavors && item.flavors.length > 0) 
            ? item.flavors 
            : ["Crimson Electric", "Hyper Blue Razz", "Sour Fusion"];
          const itemSpecs = (item.specs && item.specs.length > 0)
            ? item.specs
            : ["350mg Energy", "Zero Sugar", "Rapid Action", "Creapure®"];
          const currentFlavor = selectedFlavors[item.id] || itemFlavors[0];

          return (
            <div 
              key={item.id || index} 
              className={`showcase__item ${index % 2 !== 0 ? 'reverse' : ''}`}
            >
              {/* 3D Tilted Card Container */}
              <div className="showcase__item-img-wrap">
                <span className="showcase__item-badge">{item.badge || `0${index + 1} • ADVANCED`}</span>
                <div className="showcase__item-rating">
                  <Star size={14} className="fill-[#FFB800] text-[#FFB800]" />
                  <span>{item.rating || "4.95"}</span>
                </div>

                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="showcase__item-img"
                />
                <div className="showcase__item-overlay" />
              </div>

              {/* Description Text Block */}
              <div className="showcase__item-text-block">
                <h3 className="showcase__item-title">{item.title}</h3>
                <p className="showcase__item-text">{item.description}</p>
                
                {/* Flavor Selector */}
                <div className="flavor-picker">
                  <span className="flavor-picker-label">FLAVOR:</span>
                  {itemFlavors.map((flavor) => (
                    <button
                      key={flavor}
                      onClick={() => handleFlavorSelect(item.id, flavor)}
                      className={`flavor-btn ${currentFlavor === flavor ? 'active' : ''}`}
                    >
                      {flavor}
                    </button>
                  ))}
                </div>

                {/* Spec Badges */}
                <div className="showcase__item-specs">
                  {itemSpecs.map((spec, i) => (
                    <span key={i} className="spec-pill">
                      <Zap size={14} />
                      {spec}
                    </span>
                  ))}
                </div>

                {/* Action Button */}
                <button 
                  onClick={() => handleReserve(item.title, item.id)}
                  className="reserve-btn"
                >
                  <Sparkles size={18} />
                  <span>Claim {currentFlavor} Stash</span>
                  <ChevronRight size={18} />
                </button>

              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
