import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, Play, Trophy, Users, Zap, X } from 'lucide-react';
import KineticText from './KineticText';
import SplitHoverText from './SplitHoverText';
import CreepyButton from './CreepyButton';
import { useLandingPageCMS } from '../context/LandingPageCMSContext';


export default function Hero({ onSearchSubmit, onJoinClick, onStoryClick }) {
  const { cmsData } = useLandingPageCMS();
  const heroData = cmsData?.hero || {};

  const [videoModalOpen, setVideoModalOpen] = useState(false);

  // Mouse Parallax Effect Setup
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 120 };
  const parallaxX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), springConfig);
  const parallaxY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-10, 10]), springConfig);
  const parallaxRotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]), springConfig);

  const handleMouseMove = (e) => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth) - 0.5;
    const y = (e.clientY / innerHeight) - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handlePrimaryClick = () => {
    if (onJoinClick) {
      onJoinClick();
    } else if (onSearchSubmit) {
      onSearchSubmit({ goal: 'VIP All-Access', date: 'Immediate' });
    } else {
      const exploreElem = document.getElementById('programs-section');
      if (exploreElem) {
        exploreElem.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleWatchStoryClick = () => {
    if (onStoryClick) {
      onStoryClick();
    } else {
      setVideoModalOpen(true);
    }
  };

  // Ultra-Smooth Bezier Curve for High-End Cinematic Motion
  const smoothEase = [0.16, 1, 0.3, 1];

  return (
    <section 
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-screen lg:h-screen bg-[#0B0B0B] text-[#FFFFFF] overflow-hidden flex items-center justify-center pt-24 sm:pt-28 pb-8 selection:bg-[#E50914] selection:text-white"
    >
      {/* 1. ATMOSPHERIC CINEMATIC BACKGROUND (IMMEDIATELY VISIBLE) */}
      {/* Grid Backdrop */}
      <div 
        className="layer absolute inset-0 opacity-[0.12] pointer-events-none" 
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.25) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Red Gym Lighting Ambient Glow */}
      <div 
        className="layer absolute top-1/2 right-[12%] -translate-y-1/2 w-[480px] sm:w-[640px] h-[480px] sm:h-[640px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(229,9,20,0.32)_0%,_rgba(255,43,53,0.1)_50%,_transparent_70%)] blur-[100px] pointer-events-none"
      />


      {/* Bottom Fade Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0B0B0B] to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#E50914]/40 to-transparent z-10" />

      {/* 2. HERO CONTAINER (FITS SCREEN PERFECTLY) */}
      <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-12 max-w-7xl h-full flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-10 w-full">
          
          {/* ============================================================ */}
          {/* LEFT SIDE: KINETIC TEXT ENTERS IN SYNC WITH ATHLETE IMAGE   */}
          {/* ============================================================ */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left space-y-5 sm:space-y-6 z-30 overflow-hidden py-2">
            
            {/* A. MAIN HEADLINE (SLIDES FROM LEFT AFTER TRANSITION SCRIBBLE AT 2.0s) */}
            <motion.div
              initial={{ opacity: 0, x: -220 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, delay: 2.0, ease: smoothEase }}
              className="flex flex-col items-start tracking-tight"
            >

              <KineticText
                text={heroData.headlinePart1 || 'STRONGER'}
                as="h1"
                className="font-bebas text-6xl sm:text-7xl md:text-8xl lg:text-[100px] xl:text-[114px] leading-[0.88] uppercase text-[#FFFFFF] drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                delay={2.0}
                stagger={0.025}
              />
              <SplitHoverText
                mainText={heroData.headlinePart2 || 'EVERY DAY'}
                subText={heroData.headlineHoverText || 'BELIEVE IN YOURSELF'}
                className="font-bebas text-6xl sm:text-7xl md:text-8xl lg:text-[100px] xl:text-[114px] leading-[0.88] uppercase"
              />
            </motion.div>

            {/* B. DESCRIPTION PARAGRAPH (SLIDES FROM LEFT AT 2.2s) */}
            <motion.p
              initial={{ opacity: 0, x: -220 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.1, delay: 2.2, ease: smoothEase }}
              className="text-base sm:text-lg md:text-xl text-[#A0A0A0] max-w-xl font-normal leading-relaxed border-l-2 border-[#E50914]/60 pl-4 sm:pl-5"
            >
              {heroData.description || 'Transform your body. Sharpen your mind. Join a community that never quits.'}
            </motion.p>

            {/* C. JOIN NOW CREEPY BUTTON (SLIDES FROM LEFT AT 2.4s) */}
            <motion.div
              initial={{ opacity: 0, x: -220 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.1, delay: 2.4, ease: smoothEase }}
              className="pt-1"
            >
              <CreepyButton
                onClick={handlePrimaryClick}
                className="h-12 min-w-[11.5em] rounded-xl"
                coverClassName="bg-gradient-to-r from-[#E50914] via-[#FF2B35] to-[#E50914] text-white font-extrabold text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(229,9,20,0.5)]"
              >
                {heroData.ctaButtonText || 'JOIN NOW'}
              </CreepyButton>
            </motion.div>

            {/* D. STATISTICS CARDS (SLIDES FROM LEFT AT 2.6s) */}
            <motion.div
              initial={{ opacity: 0, x: -220 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.15, delay: 2.6, ease: smoothEase }}
              className="grid grid-cols-3 gap-3 sm:gap-4 pt-2 sm:pt-3 max-w-xl"
            >
              <div className="p-3.5 sm:p-4 rounded-2xl bg-[#151515]/80 border border-white/10 backdrop-blur-md hover:border-[#E50914]/50 transition-colors group">
                <div className="flex items-center gap-1.5 text-[#E50914] text-xs font-mono mb-1">
                  <Users size={14} />
                  <span className="uppercase tracking-wider">Members</span>
                </div>
                <div className="font-bebas text-2xl sm:text-3xl text-white tracking-wide group-hover:text-[#FF2B35] transition-colors">
                  {heroData.membersCount || '10K+'}
                </div>
                <div className="text-[11px] sm:text-xs text-[#A0A0A0] leading-tight">{heroData.membersLabel || 'Strong Members'}</div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl bg-[#151515]/80 border border-white/10 backdrop-blur-md hover:border-[#E50914]/50 transition-colors group">
                <div className="flex items-center gap-1.5 text-[#E50914] text-xs font-mono mb-1">
                  <Trophy size={14} />
                  <span className="uppercase tracking-wider">Results</span>
                </div>
                <div className="font-bebas text-2xl sm:text-3xl text-white tracking-wide group-hover:text-[#FF2B35] transition-colors">
                  {heroData.transformationsCount || '500+'}
                </div>
                <div className="text-[11px] sm:text-xs text-[#A0A0A0] leading-tight">{heroData.transformationsLabel || 'Transformations'}</div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl bg-[#151515]/80 border border-white/10 backdrop-blur-md hover:border-[#E50914]/50 transition-colors group">
                <div className="flex items-center gap-1.5 text-[#E50914] text-xs font-mono mb-1">
                  <Zap size={14} />
                  <span className="uppercase tracking-wider">Hours</span>
                </div>
                <div className="font-bebas text-2xl sm:text-3xl text-white tracking-wide group-hover:text-[#FF2B35] transition-colors">
                  {heroData.hoursCount || '24/7'}
                </div>
                <div className="text-[11px] sm:text-xs text-[#A0A0A0] leading-tight">{heroData.hoursLabel || 'Gym Access'}</div>
              </div>
            </motion.div>

          </div>


          {/* ============================================================ */}
          {/* RIGHT SIDE: ATHLETE IMAGE RISES FROM BOTTOM 1 SECOND AFTER TEXT (AT 3.0s) */}
          {/* ============================================================ */}
          <div className="lg:col-span-5 relative flex items-center lg:items-end justify-center lg:justify-end h-full min-h-[400px] sm:min-h-[480px] lg:min-h-[560px] pt-2 lg:pt-0 overflow-hidden">
            
            {/* Physical Rise From BOTTOM TO UP 1 SECOND AFTER TEXT AT 3.0s */}
            <motion.div
              initial={{ opacity: 0, y: 320, scale: 0.93 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.2, delay: 3.0, ease: smoothEase }}
              style={{
                x: parallaxX,
                y: parallaxY,
                rotateY: parallaxRotateY,
              }}
              className="relative w-full max-w-[400px] sm:max-w-[480px] lg:max-w-[520px] z-20 flex justify-center lg:justify-end"
            >
              {/* Floating Wrapper */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 5.5,
                  ease: "easeInOut",
                  delay: 4.2
                }}
                className="relative w-full flex justify-center lg:justify-end"
              >
                {/* Red Rim Lighting Glow */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#E50914]/35 via-[#FF2B35]/15 to-transparent blur-3xl rounded-full transform scale-90 translate-y-6 opacity-80" />

                {/* Hero Athlete Image */}
                <img
                  src="/assets/hero-athlete.png"
                  alt="Titan Pulse Athlete"
                  className="relative z-10 w-auto h-[400px] sm:h-[480px] lg:h-[550px] xl:h-[590px] object-contain object-bottom drop-shadow-[0_15px_45px_rgba(229,9,20,0.35)] filter brightness-[1.05] contrast-[1.1]"
                />
              </motion.div>
            </motion.div>

          </div>

        </div>
      </div>


      {/* 3. CINEMATIC VIDEO STORY MODAL */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative w-full max-w-4xl bg-[#151515] rounded-3xl border border-[#E50914]/50 p-4 sm:p-8 shadow-[0_0_60px_rgba(229,9,20,0.4)] text-center"
          >
            <button
              onClick={() => setVideoModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-[#A0A0A0] hover:text-white rounded-full bg-white/10 transition-colors"
            >
              <X size={24} />
            </button>

            <h3 className="font-bebas text-3xl sm:text-4xl text-white mb-2 tracking-wider">
              OUR STORY: THE TITAN LEGACY
            </h3>
            <p className="text-xs sm:text-sm text-[#A0A0A0] mb-6 max-w-xl mx-auto">
              Behind every transformation is relentless grit, discipline, and standard. Watch how our members redefine human potential.
            </p>

            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 flex items-center justify-center shadow-inner">
              <iframe
                className="w-full h-full"
                src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&mute=0"
                title="Titan Pulse Cinematic Gym Trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </motion.div>
        </div>
      )}

    </section>
  );
}
