import React, { useEffect, useRef, useState } from 'react';
import { Trophy, CheckCircle, Star } from 'lucide-react';

export default function ConstellationTestimonials() {
  const canvasRef = useRef(null);
  const [activeStory, setActiveStory] = useState(null);

  const stories = [
    {
      id: 1,
      x: 0.25,
      y: 0.35,
      name: 'Alex Vance',
      timeline: '12 Weeks',
      metric: '-15kg Body Fat Shift / +5kg Muscle',
      quote: 'The 3D load engine pushed me past every plateau I held for 3 years.'
    },
    {
      id: 2,
      x: 0.5,
      y: 0.25,
      name: 'Sophia Chen',
      timeline: '16 Weeks',
      metric: '+85kg Deadlift PR',
      quote: 'Barbell velocity tracking fixed my posture and boosted my total dramatically.'
    },
    {
      id: 3,
      x: 0.75,
      y: 0.45,
      name: 'Marcus Brody',
      timeline: '8 Weeks',
      metric: '-18% Body Fat Shift',
      quote: 'The sub-zero cryo recovery lab let me train 6 days a week with zero joint soreness.'
    },
    {
      id: 4,
      x: 0.38,
      y: 0.65,
      name: 'David Kim',
      timeline: '24 Weeks',
      metric: 'Pro Physique Certification',
      quote: 'TITAN PULSE 3D is not a gym; it is a hyper-performance training laboratory.'
    }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = 450;
    };
    resize();
    window.addEventListener('resize', resize);

    const render = (time) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;

      // Draw constellation connection lines
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 46, 76, 0.3)';
      ctx.lineWidth = 1;

      stories.forEach((node, i) => {
        stories.forEach((otherNode, j) => {
          if (i < j) {
            ctx.moveTo(node.x * width, node.y * height);
            ctx.lineTo(otherNode.x * width, otherNode.y * height);
          }
        });
      });
      ctx.stroke();

      // Draw glowing nodes
      stories.forEach((node) => {
        const nx = node.x * width;
        const ny = node.y * height;

        const glowRadius = 14 + Math.sin(time * 0.003 + node.id) * 4;
        const gradient = ctx.createRadialGradient(nx, ny, 2, nx, ny, glowRadius);
        gradient.addColorStop(0, '#FF2E4C');
        gradient.addColorStop(1, 'rgba(255, 46, 76, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(nx, ny, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#00F0FF';
        ctx.beginPath();
        ctx.arc(nx, ny, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section id="transformations" className="py-24 px-4 md:px-12 bg-[#090C0E] relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-mono tracking-widest text-[#00F0FF] uppercase">ATHLETE TRANSFORMATION NETWORK</span>
          <h2 className="text-4xl md:text-6xl font-black font-heading text-white uppercase mt-2">
            CONSTELLATION OF <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2E4C] to-[#00F0FF]">VICTORIES</span>
          </h2>
          <p className="text-[#8A94A0] text-xs md:text-sm mt-3 font-mono">
            Hover or click nodes on the constellation map to view verified before/after member statistics.
          </p>
        </div>

        {/* Interactive Canvas Container */}
        <div className="relative bg-[#12161A] rounded-3xl border border-white/10 p-4 md:p-8 shadow-2xl">
          <canvas ref={canvasRef} className="w-full h-[450px] block" />

          {/* Overlay Node Buttons */}
          <div className="absolute inset-0 pointer-events-none">
            {stories.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveStory(s)}
                style={{ top: `${s.y * 100}%`, left: `${s.x * 100}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto p-2 group"
              >
                <div className="px-3 py-1 rounded-full bg-[#090C0E] border border-[#FF2E4C]/60 text-[10px] font-mono text-white group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(255,46,76,0.4)]">
                  {s.name}
                </div>
              </button>
            ))}
          </div>

          {/* Glassmorphic Tooltip Card */}
          {activeStory && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-11/12 max-w-xl p-6 rounded-2xl bg-[#090C0E]/95 border border-[#FF2E4C]/60 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-30 flex flex-col gap-3">
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <div className="flex items-center gap-2">
                  <Trophy size={16} className="text-[#FF2E4C]" />
                  <span className="font-heading font-extrabold text-white text-lg">{activeStory.name}</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#FF2E4C]/20 text-[#FF2E4C] text-xs font-mono font-bold">
                  {activeStory.timeline}
                </span>
              </div>
              <div className="text-sm font-mono font-bold text-[#00F0FF] flex items-center gap-1.5 uppercase">
                <CheckCircle size={14} className="text-[#FF2E4C]" /> {activeStory.metric}
              </div>
              <p className="text-xs text-[#8A94A0] leading-relaxed">
                "{activeStory.quote}"
              </p>
              <button 
                onClick={() => setActiveStory(null)}
                className="self-end text-[10px] font-mono uppercase text-[#8A94A0] hover:text-white"
              >
                Close Modal [x]
              </button>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
