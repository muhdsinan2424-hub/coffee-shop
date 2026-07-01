import { ReactLenis } from "lenis/react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }) {
  const lenisRef = useRef();

  useEffect(() => {
    // Connect Lenis RAF updates to the GSAP Ticker for performance synchronization
    function update(time) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);
    
    // Recalculate ScrollTrigger markers and offsets once smooth scroll is active
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  return (
    <ReactLenis 
      root 
      ref={lenisRef} 
      options={{ 
        autoRaf: false, // Managed by GSAP ticker for 60fps synchronization
        lerp: 0.08,     // Smoothness weight factor
        duration: 1.2,  // Scrolling duration
        wheelMultiplier: 1.0,
        touchMultiplier: 1.5,
        infinite: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}
