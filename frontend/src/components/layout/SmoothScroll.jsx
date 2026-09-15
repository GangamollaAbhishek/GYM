import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Destroy any leftover instance
    if (window.__lenis) {
      try {
        window.__lenis.destroy();
      } catch (e) {}
    }

    // Initialize single ultra-fluid Lenis instance
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.6,
      infinite: false,
      prevent: (node) =>
        node?.classList?.contains("custom-scrollbar") ||
        node?.classList?.contains("no-scrollbar") ||
        node?.tagName === "INPUT" ||
        node?.tagName === "TEXTAREA" ||
        node?.tagName === "FORM" ||
        node?.closest?.(".auth-container") ||
        node?.closest?.(".admin-portal-wrapper") ||
        node?.closest?.(".customer-portal-wrapper") ||
        node?.closest?.("[data-lenis-prevent]"),
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tickerCallback = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // Dynamic Tab Title Change when user switches tabs
    const originalTitle =
      document.title || "Titan Pulse 3D | Ultimate Gym & Fitness Arena";
    const handleVisibility = () => {
      document.title = document.hidden
        ? "Hey, over here!👋 - Titan Pulse"
        : originalTitle;
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // Store lenis on window globally
    window.__lenis = lenis;

    return () => {
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      document.removeEventListener("visibilitychange", handleVisibility);
      delete window.__lenis;
    };
  }, []);

  return null;
}
