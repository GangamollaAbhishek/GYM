import React, { useEffect, useRef, useState } from 'react';
import { FrameLoader } from './frameLoader';
import { Flame, ArrowRight, ArrowDown } from 'lucide-react';
import './scrollFrameAnimation.css';

export default function ScrollFrameAnimation({
  framePath = '/frames/ezgif-frame-',
  frameCount = 300,
  frameExtension = 'jpg',
  digits = 3,
  onPrimaryCtaClick = null,
  children
}) {
  const scrollContainerRef = useRef(null);
  const canvasRef = useRef(null);
  const frameLoaderRef = useRef(null);
  const animationFrameRef = useRef(null);
  
  const [scrollProgress, setScrollProgress] = useState(0);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize FrameLoader Engine
  useEffect(() => {
    const loader = new FrameLoader({
      framePath,
      frameCount,
      frameExtension,
      digits,
      onProgress: (loaded, total) => {
        setLoadProgress(Math.round((loaded / total) * 100));
      },
      onComplete: () => {
        setIsLoaded(true);
      }
    });

    frameLoaderRef.current = loader;
    loader.startPreloading();

    return () => {
      loader.destroy();
    };
  }, [framePath, frameCount, frameExtension, digits]);

  // Scroll Progress Calculation & Canvas Render Loop
  useEffect(() => {
    const container = scrollContainerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    let lastProgress = -1;

    const render = () => {
      // 1. Measure Scroll Position
      const rect = container.getBoundingClientRect();
      const totalScrollableHeight = rect.height - window.innerHeight;
      
      let progress = 0;
      if (totalScrollableHeight > 0) {
        progress = Math.min(1, Math.max(0, -rect.top / totalScrollableHeight));
      }

      if (Math.abs(progress - lastProgress) > 0.0001) {
        lastProgress = progress;
        setScrollProgress(progress);
      }

      // 2. High-DPR Canvas Sizing
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.parentElement.clientWidth;
      const height = canvas.parentElement.clientHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      // 3. Frame Selection & Drawing
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.fillStyle = '#080a0c';
      ctx.fillRect(0, 0, width, height);

      const targetIndex = Math.min(
        frameCount - 1,
        Math.max(0, Math.floor(progress * (frameCount - 1)))
      );

      const loader = frameLoaderRef.current;
      const img = loader ? loader.getFrame(targetIndex) : null;

      if (img && img.complete && img.naturalWidth !== 0) {
        // Object-Fit: Cover Calculations
        const imgRatio = img.naturalWidth / img.naturalHeight;
        const canvasRatio = width / height;

        let drawWidth = width;
        let drawHeight = height;
        let offsetX = 0;
        let offsetY = 0;

        if (canvasRatio > imgRatio) {
          drawHeight = width / imgRatio;
          offsetY = (height - drawHeight) / 2;
        } else {
          drawWidth = height * imgRatio;
          offsetX = (width - drawWidth) / 2;
        }

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

        // Dark Radial Vignette - deepens as video scrub finishes and text reveals
        const textProgress = Math.max(0, Math.min(1, (progress - 0.65) / 0.25));
        const vignetteInner = 0.15 + textProgress * 0.25;
        const vignetteOuter = 0.65 + textProgress * 0.30;

        const vignette = ctx.createRadialGradient(
          width / 2,
          height / 2,
          Math.min(width, height) * 0.25,
          width / 2,
          height / 2,
          Math.max(width, height) * 0.75
        );
        vignette.addColorStop(0, `rgba(8, 10, 12, ${vignetteInner})`);
        vignette.addColorStop(0.75, `rgba(8, 10, 12, ${vignetteOuter})`);
        vignette.addColorStop(1, `rgba(8, 10, 12, ${vignetteOuter + 0.05})`);
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, width, height);
      } else {
        // Fallback smooth gradient prior to frame load
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#080a0c');
        gradient.addColorStop(0.5, '#12161a');
        gradient.addColorStop(1, '#080a0c');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }

      ctx.restore();

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [frameCount]);

  // Text Reveal Logic: Text reveals smoothly when scrollProgress >= 0.70 (reaching video end)
  const textRevealProgress = Math.max(0, Math.min(1, (scrollProgress - 0.68) / 0.22));
  const isVideoCompleted = scrollProgress >= 0.88;

  const handleCtaClick = () => {
    if (onPrimaryCtaClick) {
      onPrimaryCtaClick('START YOUR JOURNEY');
    } else {
      const nextSection = document.getElementById('programs-section');
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div ref={scrollContainerRef} className="sfa-scroll-container">
      <div className="sfa-sticky-viewport">
        
        {/* Canvas Background Engine */}
        <canvas ref={canvasRef} className="sfa-canvas" />

        {/* Noise & Vignette Overlays */}
        <div className="sfa-noise-overlay" />

        {/* Main Interactive Stage Overlay */}
        <div className="sfa-content-layer">
          
          {/* Main Hero Text Stage — Only reveals as video sequence completes */}
          <div 
            className="sfa-stage-container"
            style={{
              opacity: textRevealProgress,
              transform: `translate(-50%, calc(-50% + ${(1 - textRevealProgress) * 40}px))`,
              pointerEvents: textRevealProgress > 0.5 ? 'auto' : 'none',
              transition: 'opacity 0.15s ease-out, transform 0.15s ease-out'
            }}
          >
            {/* Badge */}
            <div className="sfa-stage-badge">
              <Flame size={14} className="text-[#FF2E4C] animate-pulse" />
              <span>PREMIUM FITNESS EXPERIENCE</span>
            </div>

            {/* Heading */}
            <h1 className="sfa-stage-heading sfa-text-metallic">
              FORGE YOUR <span className="sfa-text-crimson">LIMITS</span>
            </h1>

            {/* Subheading */}
            <p className="sfa-stage-subheading">
              Experience high-intensity performance training powered by state-of-the-art facilities, elite coaching, and real-time biomechanics.
            </p>

            {/* CTA Button */}
            <button 
              onClick={handleCtaClick}
              className="sfa-btn-primary"
            >
              <span>START YOUR JOURNEY</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Optional Children (e.g. Search Widget) — Fades in with final reveal */}
          {children && (
            <div 
              className="relative z-30 w-full max-w-4xl mx-auto"
              style={{
                opacity: textRevealProgress,
                transform: `translateY(${(1 - textRevealProgress) * 30}px)`,
                pointerEvents: textRevealProgress > 0.5 ? 'auto' : 'none',
                transition: 'opacity 0.15s ease-out, transform 0.15s ease-out'
              }}
            >
              {children}
            </div>
          )}

          {/* Bottom Scroll Indicator Bar */}
          <div className="sfa-progress-bar-container">
            <div className="sfa-progress-track">
              <div 
                className="sfa-progress-fill" 
                style={{ width: `${Math.round(scrollProgress * 100)}%` }} 
              />
            </div>
            <div className="sfa-progress-text flex items-center gap-1.5">
              {isVideoCompleted ? (
                <span className="text-[#00F0FF] font-bold">VIDEO COMPLETED — REVEALING TITAN PULSE</span>
              ) : (
                <>
                  <span>SCROLL TO PLAY VIDEO • FRAME {Math.min(frameCount, Math.floor(scrollProgress * frameCount) + 1)} / {frameCount}</span>
                  <ArrowDown size={12} className="text-[#FF2E4C] animate-bounce" />
                </>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

