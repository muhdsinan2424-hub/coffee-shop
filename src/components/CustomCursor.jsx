import { useEffect, useState, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const glowRef = useRef(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Position coordinates for interpolation (lerping)
  const mouseCoords = useRef({ x: 0, y: 0 });
  const ringCoords = useRef({ x: 0, y: 0 });
  const glowCoords = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseCoords.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Clickable Hover Detection
    const updateHoverState = () => {
      const hoverables = document.querySelectorAll(
        'a, button, select, input, textarea, .hover-target, [role="button"]'
      );
      
      hoverables.forEach((el) => {
        el.addEventListener("mouseenter", () => setIsHovered(true));
        el.addEventListener("mouseleave", () => setIsHovered(false));
      });
    };

    // Update hover listeners initially and on DOM mutations
    updateHoverState();
    const observer = new MutationObserver(updateHoverState);
    observer.observe(document.body, { childList: true, subtree: true });

    // Animation Loop for Smooth Trail (Lerping)
    let rafId;
    const animateCursor = () => {
      const targetX = mouseCoords.current.x;
      const targetY = mouseCoords.current.y;

      // Lerp for the outer ring (slower lag)
      ringCoords.current.x += (targetX - ringCoords.current.x) * 0.15;
      ringCoords.current.y += (targetY - ringCoords.current.y) * 0.15;

      // Lerp for the backdrop glow (even slower lag)
      glowCoords.current.x += (targetX - glowCoords.current.x) * 0.08;
      glowCoords.current.y += (targetY - glowCoords.current.y) * 0.08;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringCoords.current.x}px, ${ringCoords.current.y}px, 0)`;
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${glowCoords.current.x}px, ${glowCoords.current.y}px, 0)`;
      }

      rafId = requestAnimationFrame(animateCursor);
    };

    rafId = requestAnimationFrame(animateCursor);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      observer.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Background Soft Glow */}
      <div 
        ref={glowRef} 
        className="custom-cursor-glow" 
        style={{
          transform: "translate3d(0, 0, 0)",
          opacity: isHovered ? 1.5 : 1
        }}
      />
      {/* Outer Ring */}
      <div 
        ref={ringRef} 
        className="custom-cursor" 
        style={{
          transform: "translate3d(0, 0, 0)",
          width: isHovered ? "48px" : "24px",
          height: isHovered ? "48px" : "24px",
          backgroundColor: isHovered ? "rgba(220, 207, 183, 0.08)" : "transparent",
          borderColor: isHovered ? "var(--color-caramel)" : "var(--color-cappuccino)",
          mixBlendMode: isHovered ? "normal" : "difference"
        }}
      />
      {/* Inner Dot */}
      <div 
        ref={dotRef} 
        className="custom-cursor-dot" 
        style={{
          transform: "translate3d(0, 0, 0)",
          width: isHovered ? "6px" : "4px",
          height: isHovered ? "6px" : "4px"
        }}
      />
    </>
  );
}
