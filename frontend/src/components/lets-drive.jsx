import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Cpu, Play, ChevronDown, Sparkles, X, ChevronUp } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const stepsData = [
  {
    id: 'step-01',
    step: 'Step 01 of 4',
    title: 'Biometric Scan & Assessment',
    subtitle: '3D Body Composition Profiling',
    desc: 'High-precision 3D optical body scanning analyzes muscle volume distribution, body fat percentage, and postural alignment in 60 seconds.',
    image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
  },
  {
    id: 'step-02',
    step: 'Step 02 of 4',
    title: 'AI-Customized Training Split',
    subtitle: 'Algorithmic Periodization',
    desc: 'Neural engine computes your optimal weekly volume, exercise selection, and recovery ratios based on your muscle fiber composition.',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
  },
  {
    id: 'step-03',
    step: 'Step 03 of 4',
    title: 'Smart Equipment Resistance Setup',
    subtitle: 'Electromagnetic Load Tuning',
    desc: 'Smart machines auto-adjust seat height and electromagnetic resistance in real time based on velocity drop-off and force production.',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
  },
  {
    id: 'step-04',
    step: 'Step 04 of 4',
    title: '24/7 Elite Trainer Support',
    subtitle: 'Continuous Velocity Profiling',
    desc: 'Certified coaches monitor form metrics live on overhead telemetry displays to refine movement mechanics during peak lifts.',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
  }
];

/**
 * ============================================================================
 * SCROLLABLE 3D CARD STACK COMPONENT
 * Renders cards stacked in 3D perspective depth with wheel scroll navigation.
 * ============================================================================
 */
function ScrollableCardStack({ items, activeIndex, onSelectIndex, onOpenVideo }) {
  const stackRef = useRef(null);

  // Wheel scroll event handler to cycle through stacked cards
  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY > 20 && activeIndex < items.length - 1) {
      onSelectIndex(activeIndex + 1);
    } else if (e.deltaY < -20 && activeIndex > 0) {
      onSelectIndex(activeIndex - 1);
    }
  };

  return (
    <div 
      ref={stackRef}
      onWheel={handleWheel}
      className="relative w-full h-[460px] md:h-[500px] perspective-[1200px] select-none flex items-center justify-center"
    >
      <div className="relative w-full h-full transform-style-3d">
        {items.map((item, index) => {
          const diff = index - activeIndex;
          const isActive = index === activeIndex;

          // 3D Perspective Card Stacking Formulas
          let translateY = 0;
          let translateZ = 0;
          let scale = 1;
          let opacity = 1;
          let zIndex = 10;

          if (diff === 0) {
            translateY = 0;
            translateZ = 0;
            scale = 1;
            opacity = 1;
            zIndex = 30;
          } else if (diff > 0) {
            // Cards stacked below / behind
            translateY = diff * 28;
            translateZ = -diff * 45;
            scale = Math.max(0.75, 1 - diff * 0.06);
            opacity = Math.max(0.3, 1 - diff * 0.25);
            zIndex = 30 - diff;
          } else {
            // Cards passed above
            translateY = diff * 55;
            translateZ = diff * 40;
            scale = Math.max(0.7, 1 + diff * 0.08);
            opacity = 0;
            zIndex = 0;
          }

          return (
            <div
              key={item.id}
              onClick={() => onSelectIndex(index)}
              className={`absolute inset-0 w-full h-full rounded-3xl p-6 md:p-8 bg-[#12161A] border backdrop-blur-xl transition-all duration-500 ease-out cursor-pointer flex flex-col justify-between overflow-hidden shadow-2xl ${
                isActive 
                  ? 'border-[#FF2E4C] shadow-[0_0_35px_rgba(255,46,76,0.35)]' 
                  : 'border-white/10 hover:border-white/20'
              }`}
              style={{
                transform: `translateY(${translateY}px) translateZ(${translateZ}px) scale(${scale})`,
                opacity: opacity,
                zIndex: zIndex,
                pointerEvents: opacity > 0 ? 'auto' : 'none'
              }}
            >
              {/* Card Header Pill */}
              <div className="flex justify-between items-center z-10">
                <span className="px-4 py-1.5 rounded-full bg-[#FF2E4C]/20 border border-[#FF2E4C]/50 text-[#FF2E4C] text-xs font-mono font-bold">
                  {item.step}
                </span>
                <span className="text-xs font-mono text-[#00F0FF] flex items-center gap-1.5">
                  <Cpu size={14} /> ACTIVE TELEMETRY
                </span>
              </div>

              {/* Card Media Preview Container */}
              <div className="relative my-4 h-48 md:h-56 rounded-2xl overflow-hidden border border-white/10 group/img">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 opacity-85 group-hover/img:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12161A] via-transparent to-black/30" />

                {/* Glowing Video Play Button */}
                {isActive && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenVideo(item);
                    }}
                    className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-[#FF2E4C] text-white flex items-center justify-center shadow-[0_0_30px_#FF2E4C] hover:scale-110 transition-transform cursor-pointer z-20"
                  >
                    <Play size={22} className="ml-1 fill-white" />
                    <span className="absolute inset-0 rounded-full bg-[#FF2E4C] animate-ping opacity-60 pointer-events-none" />
                  </button>
                )}
              </div>

              {/* Card Details Footer */}
              <div className="z-10">
                <h3 className="text-xl md:text-2xl font-bold font-heading text-white">{item.title}</h3>
                <p className="text-xs font-mono text-[#00F0FF] mt-1 mb-2">{item.subtitle}</p>
                <p className="text-xs text-[#8A94A0] leading-relaxed line-clamp-2">{item.desc}</p>
              </div>

            </div>
          );
        })}
      </div>

      {/* Card Stack Nav Arrows */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 bg-[#090C0E]/90 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md">
        <button
          onClick={() => onSelectIndex(Math.max(0, activeIndex - 1))}
          disabled={activeIndex === 0}
          className="text-[#8A94A0] hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors p-1"
        >
          <ChevronUp size={18} />
        </button>
        <span className="text-xs font-mono text-[#00F0FF]">
          {activeIndex + 1} / {items.length}
        </span>
        <button
          onClick={() => onSelectIndex(Math.min(items.length - 1, activeIndex + 1))}
          disabled={activeIndex === items.length - 1}
          className="text-[#8A94A0] hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors p-1"
        >
          <ChevronDown size={18} />
        </button>
      </div>
    </div>
  );
}

export default function LetsDrive() {
  const [activeStep, setActiveStep] = useState(0);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(stepsData[0]);
  const containerRef = useRef(null);

  const handleOpenVideo = (item) => {
    setSelectedVideo(item);
    setVideoModalOpen(true);
  };

  return (
    <section ref={containerRef} id="equipment" className="py-24 px-4 md:px-12 bg-[#090C0E] relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs font-mono tracking-widest text-[#00F0FF] uppercase block mb-2">
              HOW IT WORKS • 3D CARD STACK
            </span>
            <h2 className="text-4xl md:text-6xl font-black font-heading text-white uppercase tracking-tight">
              3D SMART <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2E4C] to-[#00F0FF]">EQUIPMENT ENGINE</span>
            </h2>
          </div>

          <button className="px-6 py-3 rounded-full border border-white/10 text-white font-extrabold text-xs font-mono uppercase tracking-wider hover:border-[#FF2E4C] hover:text-[#FF2E4C] transition-colors self-start md:self-auto">
            View All Gear →
          </button>
        </div>

        {/* 2-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: 3D Scrollable Card Stack Showcase */}
          <div className="lg:col-span-6 w-full">
            <ScrollableCardStack 
              items={stepsData}
              activeIndex={activeStep}
              onSelectIndex={setActiveStep}
              onOpenVideo={handleOpenVideo}
            />
          </div>

          {/* Right Column: Interactive 4-Step Accordion Syncing with 3D Stack */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-4">
            {stepsData.map((item, index) => (
              <div 
                key={item.id}
                onClick={() => setActiveStep(index)}
                className={`p-6 rounded-3xl cursor-pointer transition-all duration-300 border ${
                  activeStep === index
                    ? 'bg-[#12161A] border-[#FF2E4C] shadow-[0_0_25px_rgba(255,46,76,0.3)] scale-[1.02]'
                    : 'bg-[#12161A]/50 border-white/10 hover:border-white/20 hover:bg-[#12161A]/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <span className={`w-9 h-9 rounded-full border flex items-center justify-center font-mono text-xs font-bold transition-colors ${
                      activeStep === index
                        ? 'bg-[#FF2E4C] text-white border-[#FF2E4C]'
                        : 'bg-[#090C0E] border-white/10 text-[#FF2E4C]'
                    }`}>
                      0{index + 1}
                    </span>
                    <div>
                      <h4 className="text-lg font-bold font-heading text-white">{item.title}</h4>
                      <span className="text-[11px] font-mono text-[#00F0FF]">{item.subtitle}</span>
                    </div>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-[#8A94A0] transition-transform duration-300 ${activeStep === index ? 'rotate-180 text-[#FF2E4C]' : ''}`} />
                </div>

                {activeStep === index && (
                  <div className="mt-4 pt-4 border-t border-white/10 text-xs text-[#8A94A0] font-mono leading-relaxed animate-fadeIn">
                    {item.desc}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Video Overlay Modal */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-[100] bg-[#090C0E]/90 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-[#12161A] rounded-3xl border border-white/20 p-4 shadow-2xl animate-fadeIn">
            <button 
              onClick={() => setVideoModalOpen(false)}
              className="absolute -top-12 right-0 text-[#8A94A0] hover:text-white p-2"
            >
              <X size={32} />
            </button>
            <div className="aspect-video w-full overflow-hidden rounded-2xl">
              <video 
                src={selectedVideo.videoUrl} 
                controls 
                autoPlay 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-bold font-heading text-white mt-4">
              {selectedVideo.title} — {selectedVideo.subtitle}
            </h3>
          </div>
        </div>
      )}

    </section>
  );
}
