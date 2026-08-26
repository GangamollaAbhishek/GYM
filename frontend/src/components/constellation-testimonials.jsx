import React, { useState } from 'react';
import { Trophy, CheckCircle, Users, MessageSquare } from 'lucide-react';

const athleteAvatars = [
  { 
    id: 1, 
    name: 'Alex Vance', 
    src: 'https://i.pravatar.cc/150?img=11', 
    timeline: '12 Weeks', 
    metric: '-15kg Body Fat Shift / +5kg Muscle', 
    quote: "The 3D load engine pushed me past every plateau I held for 3 years. I'm seeing gains every single week!",
    timestamp: '2 mins ago'
  },
  { 
    id: 2, 
    name: 'Sophia Chen', 
    src: 'https://i.pravatar.cc/150?img=5', 
    timeline: '16 Weeks', 
    metric: '+85kg Deadlift PR', 
    quote: "Barbell velocity tracking fixed my posture and boosted my total dramatically. What happens if we push to the next tier?",
    timestamp: 'Just now'
  },
  { 
    id: 3, 
    name: 'Marcus Brody', 
    src: 'https://i.pravatar.cc/150?img=33', 
    timeline: '8 Weeks', 
    metric: '-18% Body Fat Shift', 
    quote: "The sub-zero cryo recovery lab let me train 6 days a week with zero joint soreness.",
    timestamp: '15 mins ago'
  },
  { 
    id: 4, 
    name: 'David Kim', 
    src: 'https://i.pravatar.cc/150?img=53', 
    timeline: '24 Weeks', 
    metric: 'Pro Physique Certification', 
    quote: "TITAN PULSE 3D is not a gym; it is a hyper-performance training laboratory.",
    timestamp: '1 hour ago'
  },
  { 
    id: 5, 
    name: 'Elena Rostova', 
    src: 'https://i.pravatar.cc/150?img=9', 
    timeline: '10 Weeks', 
    metric: '+40kg Squat PR', 
    quote: "Electromagnetic resistance tuning helped me build lean leg mass twice as fast.",
    timestamp: '3 hours ago'
  },
  { 
    id: 6, 
    name: 'Vikram Malhotra', 
    src: 'https://i.pravatar.cc/150?img=68', 
    timeline: '20 Weeks', 
    metric: '-22kg Fat Reduction', 
    quote: "Biometric optical scans kept me accountable week after week.",
    timestamp: '5 hours ago'
  },
  { 
    id: 7, 
    name: 'Sarah Jenkins', 
    src: 'https://i.pravatar.cc/150?img=20', 
    timeline: '30 Weeks', 
    metric: 'IFBB Pro Card Winner', 
    quote: "The elite master trainers refine mechanics during every heavy compound set.",
    timestamp: 'Yesterday'
  },
  { 
    id: 8, 
    name: "Liam O'Connor", 
    src: 'https://i.pravatar.cc/150?img=12', 
    timeline: '14 Weeks', 
    metric: '+12kg Lean Mass Gain', 
    quote: "Individualized AI nutrition split turned my recovery into overdrive.",
    timestamp: '2 days ago'
  },
];

/**
 * ============================================================================
 * FIGMA COMMENT POP-UP COMPONENT
 * Renders a Figma-style floating comment callout bubble with speech pointer tail.
 * ============================================================================
 */
function FigmaComment({ authorName, avatarUrl, avatarAlt = "Avatar", message, timestamp = "Just now", width = 320, metric, onClose }) {
  return (
    <div 
      className="relative z-50 flex flex-col bg-[#12161A]/95 border border-[#FF2E4C]/70 backdrop-blur-2xl rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.9)] animate-fadeIn transition-all duration-300"
      style={{ width: width ? `${width}px` : '100%', maxWidth: '100%' }}
    >
      {/* Figma Speech Pointer Tail */}
      <div className="absolute -top-2.5 left-8 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[10px] border-b-[#FF2E4C]/70" />
      <div className="absolute -top-2 left-[33px] w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-b-[9px] border-b-[#12161A]" />

      {/* Header Info Row */}
      <div className="flex items-center justify-between gap-3 mb-2 pb-2 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-[#FF2E4C] flex-shrink-0 shadow-[0_0_12px_rgba(255,46,76,0.6)]">
            <img src={avatarUrl} alt={avatarAlt || authorName} className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="text-xs font-bold font-heading text-white block leading-tight">{authorName}</span>
            <span className="text-[10px] font-mono text-[#8A94A0] block">{timestamp}</span>
          </div>
        </div>

        {onClose && (
          <button 
            onClick={onClose}
            className="text-[#8A94A0] hover:text-white text-xs font-mono px-2 py-0.5 rounded-full hover:bg-white/10 transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Metric Tag Badge */}
      {metric && (
        <div className="mb-2 px-2.5 py-1 rounded-md bg-[#FF2E4C]/15 border border-[#FF2E4C]/35 text-[10px] font-mono font-bold text-[#00F0FF] uppercase flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E4C] animate-ping" />
          {metric}
        </div>
      )}

      {/* Message Quote */}
      <p className="text-xs text-[#E5E7EB] leading-relaxed font-sans italic">
        "{message}"
      </p>
    </div>
  );
}

/**
 * ============================================================================
 * ANIMATED AVATAR GROUP COMPONENT
 * Renders overlapping avatar stacks with animated expansion & tooltips.
 * ============================================================================
 */
function AnimatedAvatarGroup({ avatars, maxVisible = 6, size = 48, onSelectAvatar, activeId }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const visibleAvatars = avatars.slice(0, maxVisible);
  const remainingCount = avatars.length - maxVisible;

  return (
    <div className="flex items-center group/avatar-group py-2">
      <div className="flex items-center -space-x-3 group-hover/avatar-group:space-x-1.5 transition-all duration-300 ease-out">
        {visibleAvatars.map((item, index) => {
          const isSelected = activeId === item.id;
          const isHovered = hoveredIndex === index;

          return (
            <div
              key={item.id || index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => {
                if (onSelectAvatar) onSelectAvatar(item);
              }}
              className="relative cursor-pointer transition-all duration-300 ease-out transform hover:scale-125 hover:z-40"
              style={{
                zIndex: isHovered || isSelected ? 40 : visibleAvatars.length - index,
              }}
            >
              {/* Avatar Ring Container */}
              <div 
                className={`rounded-full p-0.5 border-2 transition-all duration-300 shadow-xl ${
                  isSelected || isHovered
                    ? 'border-[#FF2E4C] shadow-[0_0_22px_rgba(255,46,76,0.9)] scale-110'
                    : 'border-[#12161A] hover:border-[#00F0FF]'
                }`}
                style={{ width: size, height: size }}
              >
                <img
                  src={item.src}
                  alt={item.name}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>

              {/* Hover Tooltip Badge */}
              {isHovered && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#090C0E] border border-[#FF2E4C]/60 rounded-full text-center whitespace-nowrap z-50 pointer-events-none animate-fadeIn shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
                  <span className="text-xs font-extrabold text-white font-heading block">{item.name}</span>
                  {item.metric && <span className="text-[9px] font-mono text-[#00F0FF] block">{item.metric}</span>}
                </div>
              )}
            </div>
          );
        })}

        {/* Plus Remaining Counter Badge */}
        {remainingCount > 0 && (
          <div 
            className="relative flex items-center justify-center rounded-full bg-[#12161A] border-2 border-white/15 text-white font-mono font-bold text-xs shadow-xl transition-transform hover:scale-110"
            style={{ width: size, height: size, zIndex: 0 }}
          >
            <span className="text-[#00F0FF]">+{remainingCount}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ConstellationTestimonials() {
  const [activeStory, setActiveStory] = useState(athleteAvatars[1]); // Sophia Chen default

  return (
    <section id="transformations" className="py-24 px-4 md:px-12 bg-[#090C0E] relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-mono tracking-widest text-[#00F0FF] uppercase flex items-center justify-center gap-2">
            <Users size={14} className="text-[#FF2E4C]" /> ATHLETE TRANSFORMATION NETWORK
          </span>
          <h2 className="text-4xl md:text-6xl font-black font-heading text-white uppercase mt-2">
            CONSTELLATION OF <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2E4C] to-[#00F0FF]">VICTORIES</span>
          </h2>
          <p className="text-[#8A94A0] text-xs md:text-sm mt-3 font-mono">
            Click any member avatar to display their live Figma-style feedback pop-up comment.
          </p>
        </div>

        {/* Animated Avatar Group Showcase Layout Card */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 bg-[#12161A]/80 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl">
          <div className="flex flex-col gap-1 text-center md:text-left">
            <span className="text-xs font-mono font-bold text-[#00F0FF] uppercase">500+ VERIFIED TRANSFORMATIONS</span>
            <span className="text-base font-extrabold font-heading text-white">ACTIVE TITAN ATHLETES NETWORK</span>
          </div>

          <div className="flex items-center gap-8 flex-wrap justify-center">
            <AnimatedAvatarGroup 
              avatars={athleteAvatars} 
              maxVisible={6} 
              size={48} 
              activeId={activeStory?.id}
              onSelectAvatar={setActiveStory}
            />
          </div>
        </div>

        {/* Figma Comment Pop-up Callout Box displayed on user click */}
        {activeStory && (
          <div className="w-full flex justify-center mt-6">
            <FigmaComment
              authorName={activeStory.name}
              avatarUrl={activeStory.src}
              avatarAlt={`${activeStory.name}'s avatar`}
              message={activeStory.quote}
              timestamp={activeStory.timestamp || "Just now"}
              metric={`${activeStory.timeline} • ${activeStory.metric}`}
              width={340}
              onClose={() => setActiveStory(null)}
            />
          </div>
        )}

      </div>
    </section>
  );
}
