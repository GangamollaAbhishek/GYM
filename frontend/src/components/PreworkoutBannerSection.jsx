import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './PreworkoutBannerSection.css';

gsap.registerPlugin(ScrollTrigger);

export default function PreworkoutBannerSection() {
    const sectionRef = useRef(null);

    const items = [
        {
            id: 1,
            title: "WRATHX PRE-WORKOUT",
            badge: "01 • IGNITION",
            image: "/wrathx-preworkout.jpg",
            description: "Engineered for unyielding kinetic output. Formulated with 350mg Caffeine Anhydrous, 6000mg L-Citrulline Malate, and Beta-Alanine to ignite explosive muscle pumps, vascularity, and laser-sharp cognitive focus during extreme training sessions.",
            specs: ["350mg Caffeine", "6g Citrulline", "Creapure®"]
        },
        {
            id: 2,
            title: "TITAN ISO-WHEY GOLD",
            badge: "02 • REBUILD",
            image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=1000&auto=format&fit=crop",
            description: "Ultra-pure micro-filtered whey protein isolate delivering 28g of rapid-absorbing protein, 6.5g BCAA, and zero added sugars per scoop. Designed for immediate post-workout muscle protein synthesis and lean tissue recovery.",
            specs: ["28g Isolate", "6.5g BCAA", "Zero Sugar"]
        },
        {
            id: 3,
            title: "CREATINE MICRO-PURE",
            badge: "03 • POWER",
            image: "https://images.unsplash.com/photo-1579722820308-d74e571900a9?q=80&w=1000&auto=format&fit=crop",
            description: "100% Pharmaceutical-Grade Creapure® Monohydrate micronized for maximum solubility. Saturates muscle ATP stores to increase maximal strength, explosive power output, and intracellular cell hydration.",
            specs: ["100% Creapure®", "5g Per Scoop", "Micronized"]
        },
        {
            id: 4,
            title: "AMINO MATRIX BCAA",
            badge: "04 • RECOVER",
            image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?q=80&w=1000&auto=format&fit=crop",
            description: "Instantized 2:1:1 BCAA blend with key electrolyte hydration minerals. Prevents muscle catabolism during grueling workouts, speeds up cellular repair, and reduces delayed onset muscle soreness (DOMS).",
            specs: ["2:1:1 Ratio", "Electrolytes", "Zero Calories"]
        }
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            const container = sectionRef.current;
            if (!container) return;

            const contentItems = container.querySelectorAll('.content__item');

            contentItems.forEach((item, index) => {
                const imgWrap = item.querySelector('.content__item-img-wrap');
                const img = item.querySelector('.content__item-img');
                const textBlock = item.querySelector('.content__item-text-block');

                if (!imgWrap || !img) return;

                // 3D Perspective Setup
                gsap.set(item, { perspective: 1000 });
                gsap.set(imgWrap, { transformOrigin: '50% 100%' });
                if (textBlock) gsap.set(textBlock, { transform: 'translate3d(0,0,120px)' });

                // Random 3D tilt angles (-60deg to -45deg)
                const ry = (index % 2 === 0 ? -1 : 1) * 0.4;
                const rz = (index % 2 === 0 ? 1 : -1) * 0.3;
                const initialRot = -60 + (index % 2) * 5;

                // 3D Perspective Scroll Tilt
                gsap.fromTo(imgWrap, {
                    rotateX: initialRot,
                    rotateY: ry * 25,
                    rotateZ: rz * 15,
                    opacity: 0.3
                }, {
                    rotateX: 0,
                    rotateY: 0,
                    rotateZ: 0,
                    opacity: 1,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 90%',
                        end: 'center 45%',
                        scrub: 1
                    }
                });

                // Inner Image Y Parallax Translation
                gsap.fromTo(img, {
                    yPercent: -20,
                    scale: 1.15
                }, {
                    yPercent: 15,
                    scale: 1,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: item,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1
                    }
                });

                // Side Text Fade & Slide Entrance
                if (textBlock) {
                    gsap.fromTo(textBlock, {
                        opacity: 0,
                        x: index % 2 === 0 ? 40 : -40
                    }, {
                        opacity: 1,
                        x: 0,
                        scrollTrigger: {
                            trigger: item,
                            start: 'top 85%',
                            end: 'center 50%',
                            scrub: 0.8
                        }
                    });
                }
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="supplement-scroll-section">
            <div className="supplement-scroll-header">
                <h2>TITAN SUPPLEVATION MATRIX</h2>
                <p>3D SCROLL PERSPECTIVE TILT • STACKED ONE BY ONE</p>
            </div>

            <div className="supplement-content">
                {items.map((item, index) => (
                    <div 
                        key={item.id} 
                        className={`content__item ${index % 2 !== 0 ? 'reverse' : ''}`}
                    >
                        {/* 3D Tilted Card Container */}
                        <div className="content__item-img-wrap">
                            <span className="content__item-badge">{item.badge}</span>
                            <img 
                                src={item.image} 
                                alt={item.title} 
                                className="content__item-img"
                            />
                            <div className="content__item-overlay" />
                        </div>

                        {/* Description Text Block (Right / Left Column) */}
                        <div className="content__item-text-block">
                            <h3 className="content__item-title">{item.title}</h3>
                            <p className="content__item-text">{item.description}</p>
                            
                            <div className="content__item-specs">
                                {item.specs.map((spec, i) => (
                                    <span key={i} className="spec-pill">{spec}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
