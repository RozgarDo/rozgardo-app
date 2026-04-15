import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to the top of the window on every route change
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // Use instant to avoid weird flickering, or 'smooth' if desired
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
