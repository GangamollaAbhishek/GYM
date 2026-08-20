import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ExpandingFrameSection.css';

gsap.registerPlugin(ScrollTrigger);

export default function ExpandingFrameSection() {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const container = sectionRef.current;
            if (!container) return;

            const cardBg = container.querySelector('.naked-city-background');
            const headline1 = container.querySelector('.naked-city-text-1');
            const headline2 = container.querySelector('.naked-city-text-2');
            const backdropImg = container.querySelector('.naked-city-img');

            if (!cardBg) return;

            const isDesktop = window.innerWidth >= 720;
            if (!isDesktop) {
                gsap.set(cardBg, { width: '100%', height: '100vh', borderRadius: 0 });
                return;
            }

            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const initialWidth = cardBg.offsetWidth;
            const initialHeight = cardBg.offsetHeight;

            // Timeline for expansion + hold + flawless fade-out exit transition into next section
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: container,
                    start: 'top top',
                    end: `+=${viewportHeight * 2.2}px`,
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1,
                    onEnter: () => {
                        const topNav = document.querySelector('header');
                        if (topNav) gsap.to(topNav, { opacity: 0, pointerEvents: 'none', duration: 0.3 });
                    },
                    onLeave: () => {
                        const topNav = document.querySelector('header');
                        if (topNav) gsap.to(topNav, { opacity: 1, pointerEvents: 'auto', duration: 0.3 });
                    },
                    onEnterBack: () => {
                        const topNav = document.querySelector('header');
                        if (topNav) gsap.to(topNav, { opacity: 0, pointerEvents: 'none', duration: 0.3 });
                    },
                    onLeaveBack: () => {
                        const topNav = document.querySelector('header');
                        if (topNav) gsap.to(topNav, { opacity: 1, pointerEvents: 'auto', duration: 0.3 });
                    }
                }
            });

            // Phase 1 (0.0 -> 0.55): Expand black 50% card box to 100vw x 100vh full screen
            tl.fromTo(cardBg, {
                width: initialWidth,
                height: initialHeight,
                borderRadius: 24
            }, {
                width: viewportWidth,
                height: viewportHeight,
                borderRadius: 0,
                ease: 'none',
                duration: 0.55
            }, 0);

            // Morph gym quotes smoothly during expansion
            if (headline1 && headline2) {
                tl.to(headline1, { opacity: 0, scale: 0.92, duration: 0.25, ease: 'power1.in' }, 0.1);
                tl.fromTo(headline2, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.25, ease: 'power1.out' }, 0.3);
            }

            // Phase 2 (0.55 -> 0.75): Stationary hold buffer while user reads Quote 2
            tl.to({}, { duration: 0.2 });

            // Phase 3 (0.75 -> 1.0): Flawless dissolve & lift transition so zero text overlaps into CylinderSection!
            tl.to([cardBg, headline2, backdropImg], {
                opacity: 0,
                y: -70,
                scale: 0.95,
                ease: 'power2.inOut',
                duration: 0.25
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section className="naked-city-wrapper">
            <div ref={sectionRef} className="naked-city-backdrop">
                
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
