import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (window.__lenis) {
      try {
        window.__lenis.scrollTo(0, { immediate: true });
      } catch (e) {
        // Fallback
      }
    }
  }, [pathname]);

  return null;
}
