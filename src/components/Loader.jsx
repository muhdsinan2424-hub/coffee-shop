import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { motion, AnimatePresence } from "framer-motion";

const LOADER_QUOTES = [
  "Selecting single-origin beans...",
  "Roasting at 220°C to highlight origin...",
  "Grinding with micron-level precision...",
  "Pre-infusing under soft pressure...",
  "Extracting at 9 bars of pressure...",
  "Steaming velvet microfoam...",
  "Pouring latte art... L'Aroma awaits."
];

export default function Loader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    // Quote cycling
    const quoteInterval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % LOADER_QUOTES.length);
    }, 1800);

    // Progress counter simulation
    const tl = gsap.timeline({
      onComplete: () => {
        clearInterval(quoteInterval);
        
        // Final exit animation
        const exitTl = gsap.timeline({
          onComplete: onComplete
        });
        
        exitTl.to(".loader-content", {
          opacity: 0,
          y: -50,
          duration: 0.8,
          ease: "power3.in"
        })
        .to(".loader-bg", {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
          duration: 1.2,
          ease: "power4.inOut"
        }, "-=0.4");
      }
    });

    // Simulate progress
    const obj = { val: 0 };
    tl.to(obj, {
      val: 100,
      duration: 5,
      ease: "power2.out",
      onUpdate: () => {
        setProgress(Math.floor(obj.val));
      }
    });

    return () => {
      clearInterval(quoteInterval);
    };
  }, [onComplete]);

  return (
    <div className="loader-bg" style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "var(--color-bg-stone)",
      zIndex: 99999,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    }}>
      <div className="loader-content" style={{
        textAlign: "center",
        maxWidth: "500px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "40px"
      }}>
        {/* Animated Coffee Cup SVG */}
        <div style={{ position: "relative", width: "80px", height: "80px" }}>
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
            {/* Cup Outline */}
            <path d="M12 20H48V42C48 48.6 42.6 54 36 54H28C21.4 54 16 48.6 16 42V20" stroke="var(--color-olive)" strokeWidth="3" strokeLinecap="round" />
            <path d="M48 26H52C55.3 26 58 28.7 58 32C58 35.3 55.3 38 52 38H48" stroke="var(--color-olive)" strokeWidth="3" strokeLinecap="round" />
            {/* Plate */}
            <path d="M10 58H54" stroke="var(--color-olive)" strokeWidth="3" strokeLinecap="round" />
            {/* Coffee Filling Level */}
            <path 
              d={`M18 ${44 - (20 * progress / 100)} C 22 ${42 - (20 * progress / 100)} 26 ${46 - (20 * progress / 100)} 30 ${44 - (20 * progress / 100)} C 34 ${42 - (20 * progress / 100)} 38 ${46 - (20 * progress / 100)} 42 ${44 - (20 * progress / 100)} C 46 ${42 - (20 * progress / 100)} 46 ${44 - (20 * progress / 100)} 46 ${44 - (20 * progress / 100)} V 42 C 46 47.5 41.5 52 36 52 H 28 C 22.5 52 18 47.5 18 42 V 42`} 
              fill="var(--color-gold)"
              style={{ transition: "all 0.1s linear" }}
            />
            {/* Rising Steam */}
            <path className="steam-line" d="M26 12C26 8 28 8 28 4" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round" opacity={progress > 30 ? 0.6 : 0} style={{ transition: "opacity 0.5s" }} />
            <path className="steam-line" d="M32 14C32 9 34 9 34 5" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round" opacity={progress > 55 ? 0.6 : 0} style={{ transition: "opacity 0.5s" }} />
            <path className="steam-line" d="M38 12C38 8 40 8 40 4" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round" opacity={progress > 75 ? 0.6 : 0} style={{ transition: "opacity 0.5s" }} />
          </svg>
        </div>

        {/* Brand Text */}
        <div>
          <h1 style={{
            display: "flex",
            justifyContent: "center",
            fontSize: "2.5rem",
            letterSpacing: "0.2em",
            fontFamily: "var(--font-serif)",
            color: "var(--color-forest)",
            marginBottom: "8px",
            textTransform: "uppercase"
          }}>
            {"L'AROMA".split("").map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 15, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  duration: 0.8,
                  delay: 0.08 * index + 0.15,
                  ease: [0.16, 1, 0.3, 1]
                }}
                style={{ display: "inline-block" }}
              >
                {char}
              </motion.span>
            ))}
          </h1>
          <motion.p 
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            animate={{ opacity: 1, letterSpacing: "0.3em" }}
            transition={{ duration: 1.5, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              color: "var(--color-olive)",
              fontSize: "0.85rem",
              textTransform: "uppercase"
            }}
          >
            Artisan Roastery
          </motion.p>
        </div>

        {/* Progress Numbers */}
        <div style={{
          fontSize: "5.5rem",
          fontWeight: 200,
          fontFamily: "var(--font-sans)",
          color: "var(--color-forest)",
          lineHeight: 1
        }}>
          {progress.toString().padStart(3, "0")}<span style={{ fontSize: "2rem", color: "var(--color-olive)" }}>%</span>
        </div>

        {/* Rotating Craft Quotes */}
        <div style={{ height: "40px", overflow: "hidden", position: "relative", display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
          <AnimatePresence mode="wait">
            <motion.p
              key={quoteIndex}
              initial={{ y: 12, opacity: 0, filter: "blur(3px)" }}
              animate={{ y: 0, opacity: 0.85, filter: "blur(0px)" }}
              exit={{ y: -12, opacity: 0, filter: "blur(3px)" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontSize: "0.95rem",
                fontStyle: "italic",
                fontFamily: "var(--font-serif)",
                color: "var(--color-charcoal-muted)",
                margin: 0,
                position: "absolute",
                textAlign: "center",
                width: "100%"
              }}
            >
              {LOADER_QUOTES[quoteIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
