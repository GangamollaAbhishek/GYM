import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ExpandingFrameSection.css";

gsap.registerPlugin(ScrollTrigger);

export default function ExpandingFrameSection() {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const container = sectionRef.current;
      const pinTarget = pinRef.current;
      if (!container || !pinTarget) return;

      const cardBg = container.querySelector(".naked-city-background");
      const headline1 = container.querySelector(".naked-city-text-1");
      const headline2 = container.querySelector(".naked-city-text-2");
      const backdropImg = container.querySelector(".naked-city-img");

      if (!cardBg) return;

      const isDesktop = window.innerWidth >= 720;
      if (!isDesktop) {
        gsap.set(cardBg, { width: "100%", height: "100vh", borderRadius: 0 });
        return;
      }

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const initialWidth = cardBg.offsetWidth;
      const initialHeight = cardBg.offsetHeight;

      // Timeline for expansion + hold + transition
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          pin: pinTarget,
          start: "top top",
          end: `+=${viewportHeight * 2.2}px`,
          scrub: 1,
          anticipatePin: 1,
          onEnter: () => {
            const topNav = document.querySelector("header");
            if (topNav)
              gsap.to(topNav, {
                opacity: 0,
                pointerEvents: "none",
                duration: 0.3,
              });
          },
          onLeave: () => {
            const topNav = document.querySelector("header");
            if (topNav)
              gsap.to(topNav, {
                opacity: 1,
                pointerEvents: "auto",
                duration: 0.3,
              });
          },
          onEnterBack: () => {
            const topNav = document.querySelector("header");
            if (topNav)
              gsap.to(topNav, {
                opacity: 0,
                pointerEvents: "none",
                duration: 0.3,
              });
          },
          onLeaveBack: () => {
            const topNav = document.querySelector("header");
            if (topNav)
              gsap.to(topNav, {
                opacity: 1,
                pointerEvents: "auto",
                duration: 0.3,
              });
          },
        },
      });

      // 1. Expand Card to 100% viewport width & height
      tl.to(cardBg, {
        width: viewportWidth,
        height: viewportHeight,
        borderRadius: 0,
        ease: "power2.inOut",
        duration: 1,
      });

      // 2. Reveal Background Image & First Motivational Quote
      if (backdropImg) {
        tl.to(backdropImg, { opacity: 1, scale: 1.05, duration: 0.8 }, "-=0.5");
      }

      if (headline1) {
        tl.fromTo(
          headline1,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.3",
        );
      }

      // 3. Swap Quote Text
      if (headline1 && headline2) {
        tl.to(headline1, { opacity: 0, y: -40, duration: 0.5 }, "+=0.8").fromTo(
          headline2,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.6 },
        );
      }

      // 4. Fade out section smoothly
      tl.to(container, { opacity: 0.9, duration: 0.4 }, "+=0.6");
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="naked-city-section">
      <div ref={pinRef} className="naked-city-backdrop w-full h-full">
        {/* Fullscreen Backdrop Image behind the expanding card */}
        <div className="naked-city-img">
          <img
            src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1920&auto=format&fit=crop"
            alt="Titan Gym Ambient Background"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-black/40 to-[#0B0B0B]" />
        </div>

        {/* Black Expanding Card Box (50% to 100%) */}
        <div className="naked-city-background" />

        {/* Gym Motivational Quotes */}
        <div className="naked-city-content">
          <h1 className="naked-city-h1 naked-city-text-1">
            DISCIPLINE IS THE BRIDGE BETWEEN GOALS AND ACCOMPLISHMENT
          </h1>
          <h1 className="naked-city-h1 naked-city-text-2 absolute">
            PUSH PAST YOUR LIMITS AND CLAIM YOUR LEGACY
          </h1>
        </div>
      </div>
    </section>
  );
}
