import { useState, useEffect, useRef } from "react";
import { Coffee } from "lucide-react";
import { gsap } from "gsap";
import { motion } from "framer-motion";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Magnetic Button Effect
  const handleMouseMove = (e) => {
    const btn = ctaRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(btn, {
      x: x * 0.35,
      y: y * 0.35,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = (e) => {
    const btn = ctaRef.current;
    if (!btn) return;
    gsap.to(btn, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.3)"
    });
    // Reset visual hover colors
    e.target.style.backgroundColor = "var(--color-forest)";
    e.target.style.color = "var(--color-bg-ivory)";
  };

  const scrollToSection = (id) => {
    if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav style={{
      position: "fixed",
      top: isScrolled ? "15px" : "30px",
      left: "50%",
      transform: "translateX(-50%)",
      width: isScrolled ? "80%" : "90%",
      maxWidth: "1100px",
      height: isScrolled ? "60px" : "74px",
      borderRadius: "40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 30px",
      zIndex: 9999,
      transition: "width 0.6s cubic-bezier(0.16, 1, 0.3, 1), top 0.6s cubic-bezier(0.16, 1, 0.3, 1), height 0.6s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.6s, border-color 0.6s",
    }} className="glass-panel">
      
      {/* Logo */}
      <div 
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          cursor: "pointer",
        }}
      >
        <Coffee size={22} color="var(--color-olive)" />
        <span style={{
          fontFamily: "var(--font-serif)",
          fontSize: "1.25rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "var(--color-forest)"
        }}>
          L'Aroma
        </span>
      </div>

      {/* Nav Links */}
      <ul style={{
        display: "flex",
        alignItems: "center",
        gap: "35px",
        listStyle: "none",
      }} className="nav-links-container">
        {["Home", "Menu", "Interior", "Testimonials"].map((item, idx) => (
          <li 
            key={item} 
            style={{ position: "relative" }}
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Sliding Hover Capsule Indicator */}
            {hoveredIndex === idx && (
              <motion.div
                layoutId="navHover"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                style={{
                  position: "absolute",
                  top: "-6px",
                  left: "-12px",
                  right: "-12px",
                  bottom: "-6px",
                  backgroundColor: "rgba(62, 78, 61, 0.05)",
                  borderRadius: "20px",
                  zIndex: -1
                }}
              />
            )}
            <button 
              onClick={() => scrollToSection(item.toLowerCase())}
              style={{
                background: "none",
                border: "none",
                color: "var(--color-charcoal)",
                fontFamily: "var(--font-sans)",
                fontSize: "0.85rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
                opacity: 0.75,
                transition: "var(--transition-snappy)"
              }}
              onMouseEnter={(e) => {
                e.target.style.opacity = 1;
                e.target.style.color = "var(--color-olive)";
              }}
              onMouseLeave={(e) => {
                e.target.style.opacity = 0.75;
                e.target.style.color = "var(--color-charcoal)";
              }}
            >
              {item}
            </button>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <button 
        ref={ctaRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => scrollToSection("reservations")}
        className="btn-shine-container"
        style={{
          backgroundColor: "var(--color-forest)",
          color: "var(--color-bg-ivory)",
          border: "1px solid rgba(197, 164, 126, 0.3)",
          padding: "10px 24px",
          borderRadius: "20px",
          fontFamily: "var(--font-sans)",
          fontSize: "0.8rem",
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          cursor: "pointer",
          boxShadow: "0 4px 15px rgba(62, 78, 61, 0.15)",
          transition: "background-color 0.3s, color 0.3s, transform 0.3s ease"
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "var(--color-olive)";
          e.target.style.color = "var(--color-bg-ivory)";
        }}
      >
        <span className="btn-shine-overlay" />
        Book Table
      </button>

      {/* Internal style for small screens */}
      <style>{`
        @media (max-width: 768px) {
          .nav-links-container {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
}
