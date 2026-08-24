import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, ShieldCheck, Dumbbell } from "lucide-react";

export function TrainerCardDeck({
    items,
    className,
    width = 900,
    showNavigation = true,
    showCounter = true,
    autoPlay = false,
    autoPlayInterval = 4000,
}) {
    const defaultTrainers = [
        {
            id: "t1",
            title: "MARCUS VANCE • HEAD OF STRENGTH",
            description: "IFBB Pro & Master Strength Coach with 14+ years of elite athletic programming. Specialized in maximal hypertrophy, mechanical load optimization, and contest preparation.",
            image: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=800&q=80"
        },
        {
            id: "t2",
            title: "ELENA ROSTOVA • MOBILITY & HIIT",
            description: "Ex-Olympic Gymnast & CSCS Mobility Specialist. Master of high-velocity HIIT conditioning, biomechanical alignment, and functional athletic endurance.",
            image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80"
        },
        {
            id: "t3",
            title: "DAVID STERLING • COMBAT & ATHLETICS",
            description: "Pro Muay Thai Fighter & Tactical Conditioning Specialist. Focuses on explosive rotational power, metabolic energy system development, and extreme mental toughness.",
            image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80"
        },
        {
            id: "t4",
            title: "SARAH JENKINS • RECOMP & NUTRITION",
            description: "Precision Nutrition Coach & Powerlifting Champion. Expert in personalized macronutrient partitioning, biomechanical squat mechanics, and body recomposition.",
            image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80"
        }
    ];

    const trainerItems = items && items.length > 0 ? items : defaultTrainers;

    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(1);

    const activeItem = trainerItems[activeIndex];

    // Auto-play effect
    useEffect(() => {
        if (!autoPlay || trainerItems.length <= 1) return;

        const interval = setInterval(() => {
            setDirection(1);
            setActiveIndex((prev) => (prev + 1) % trainerItems.length);
        }, autoPlayInterval);

        return () => clearInterval(interval);
    }, [autoPlay, autoPlayInterval, trainerItems.length]);

    const handleNext = () => {
        if (activeIndex < trainerItems.length - 1) {
            setDirection(1);
            setActiveIndex(activeIndex + 1);
        }
    };

    const handlePrev = () => {
        if (activeIndex > 0) {
            setDirection(-1);
            setActiveIndex(activeIndex - 1);
        }
    };

    // Pre-calculate rotations for 3D visual variety
    const rotations = useMemo(() => [4, -3, -8, 6], []);

    return (
        <section className="py-24 bg-[#0B0B0B] border-t border-white/10 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[radial-gradient(ellipse_at_center,_rgba(229,9,20,0.2)_0%,_transparent_70%)] blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#151515] border border-[#E50914]/40 text-[#E50914] text-xs font-mono font-bold uppercase tracking-widest mb-4 shadow-[0_0_20px_rgba(229,9,20,0.3)]">
                    <Dumbbell size={14} className="animate-pulse" />
                    <span>ELITE COACHING FACULTY</span>
                </div>

                <h2 className="font-bebas text-5xl sm:text-6xl md:text-7xl text-white tracking-wider uppercase mb-3 drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
                    MEET THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E50914] via-[#FF2B35] to-[#E50914]">TITAN PULSE TRAINERS </span>
                </h2>

                <p className="text-[#A0A0A0] text-sm sm:text-base max-w-2xl mx-auto font-normal">
                    World-class IFBB professionals, CSCS specialists, and combat master trainers dedicated to elevating your physical threshold.
                </p>
            </div>

            {/* 3D Stacked Card Container */}
            <div className={`flex items-center justify-center p-4 sm:p-8 ${className || ""}`}>
                <div
                    className="relative grid grid-cols-1 md:grid-cols-[1.1fr_1fr] md:grid-rows-[auto_auto_auto] gap-x-10 gap-y-6 w-full items-center"
                    style={{ perspective: "1400px", maxWidth: `${width}px` }}
                >
                    {/* Counter */}
                    {showCounter && (
                        <div className="row-start-1 md:col-start-2 md:row-start-1 text-right font-mono text-sm text-[#E50914] font-bold tracking-widest">
                            [ 0{activeIndex + 1} / 0{trainerItems.length} ]
                        </div>
                    )}

                    {/* Image Card Stack */}
                    <div className="row-start-2 col-start-1 md:row-start-1 row-span-3 relative w-full aspect-[4/5] sm:aspect-square">
                        <AnimatePresence custom={direction}>
                            {trainerItems.map((item, index) => {
                                const isActive = index === activeIndex;
                                const offset = index - activeIndex;

                                return (
                                    <motion.div
                                        key={item.id}
                                        className="absolute inset-0 w-full h-full overflow-hidden border-[6px] bg-[#141414] border-[#E50914]/40 shadow-[0_25px_60px_rgba(0,0,0,0.95)] rounded-2xl cursor-pointer"
                                        initial={{
                                            x: offset * 18,
                                            y: Math.abs(offset) * 8,
                                            z: -150 * Math.abs(offset),
                                            scale: 0.85 - Math.abs(offset) * 0.04,
                                            rotateZ: rotations[index % 4],
                                            opacity: isActive ? 1 : 0.5,
                                            zIndex: 10 - Math.abs(offset),
                                        }}
                                        animate={
                                            isActive
                                                ? {
                                                    x: [offset * 18, direction === 1 ? -200 : 200, 0],
                                                    y: [Math.abs(offset) * 8, 0, 0],
                                                    z: [-200, 150, 250],
                                                    scale: [0.85, 1.05, 1],
                                                    rotateZ: [rotations[index % 4], -4, 0],
                                                    opacity: 1,
                                                    zIndex: 100,
                                                }
                                                : {
                                                    x: offset * 18,
                                                    y: Math.abs(offset) * 8,
                                                    z: -150 * Math.abs(offset),
                                                    rotateZ: rotations[index % 4],
                                                    scale: 0.85 - Math.abs(offset) * 0.04,
                                                    opacity: 0.55,
                                                    zIndex: 10 - Math.abs(offset),
                                                }
                                        }
                                        exit={{
                                            x: direction === 1 ? -250 : 250,
                                            z: -260,
                                            scale: 0.75,
                                            rotateZ: direction === 1 ? -10 : 10,
                                            opacity: 0,
                                        }}
                                        transition={{
                                            duration: 0.75,
                                            ease: [0.22, 1, 0.36, 1],
                                        }}
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover filter brightness-90 contrast-110"
                                            draggable={false}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>

                    {/* Text Description Block */}
                    <div className="col-start-1 md:col-start-2 md:row-start-2 flex flex-col justify-center min-h-[140px] text-left">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeItem.id}
                                initial={{ opacity: 0, y: 25 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -25 }}
                                transition={{ duration: 0.35 }}
                            >
                                <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#E50914] mb-2 font-semibold">
                                    <ShieldCheck size={14} />
                                    <span>CERTIFIED MASTER COACH</span>
                                </div>
                                <h3 className="font-bebas text-3xl sm:text-4xl text-white tracking-wide uppercase leading-tight">
                                    {activeItem.title}
                                </h3>
                                <p className="text-sm sm:text-base text-[#C0C0C0] font-sans mt-3 leading-relaxed">
                                    {activeItem.description}
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation Controls */}
                    {showNavigation && trainerItems.length > 1 && (
                        <div className="col-start-1 md:col-start-2 md:row-start-3 flex gap-3 mt-4 md:mt-6">
                            <button
                                disabled={activeIndex === 0}
                                onClick={handlePrev}
                                className={`flex items-center justify-center w-12 h-12 rounded-full border border-white/20 bg-[#151515] text-white transition-all ${activeIndex === 0
                                        ? "opacity-40 cursor-not-allowed"
                                        : "hover:bg-[#E50914] hover:border-[#E50914] hover:scale-105 shadow-[0_0_20px_rgba(229,9,20,0.4)]"
                                    }`}
                                aria-label="Previous coach card"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <button
                                disabled={activeIndex === trainerItems.length - 1}
                                onClick={handleNext}
                                className={`flex items-center justify-center w-12 h-12 rounded-full border border-white/20 bg-[#151515] text-white transition-all ${activeIndex === trainerItems.length - 1
                                        ? "opacity-40 cursor-not-allowed"
                                        : "hover:bg-[#E50914] hover:border-[#E50914] hover:scale-105 shadow-[0_0_20px_rgba(229,9,20,0.4)]"
                                    }`}
                                aria-label="Next coach card"
                            >
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default TrainerCardDeck;
