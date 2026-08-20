import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function SmoothScroll() {
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            touchMultiplier: 1.5,
        });

        lenis.on('scroll', ScrollTrigger.update);
        const tickerCallback = (time) => {
            lenis.raf(time * 1000);
        };

        gsap.ticker.add(tickerCallback);
        gsap.ticker.lagSmoothing(0);

        // Dynamic Tab Title Change when user switches tabs
        const originalTitle = document.title || "Titan Pulse 3D | Ultimate Gym & Fitness Arena";
        const handleVisibility = () => {
            document.title = document.hidden ? "Hey, over here!👋 - Titan Pulse" : originalTitle;
        };
        document.addEventListener('visibilitychange', handleVisibility);

        // Store lenis on window so other components can access it globally
        window.__lenis = lenis;

        return () => {
            gsap.ticker.remove(tickerCallback);
            lenis.destroy();
            document.removeEventListener('visibilitychange', handleVisibility);
            delete window.__lenis;
        };
    }, []);

    return null;
}
