import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { IMAGES } from "../assets/images";

const CARDS = [
  {
    id: 1,
    title: "Premium Beans",
    subtitle: "Single-Origin Arabica",
    description: "Sourced organically from high-altitude estates in Ethiopia.",
    image: IMAGES.coffeeBeans,
    floatClass: "bob-delay-1"
  },
  {
    id: 2,
    title: "Expert Baristas",
    subtitle: "Calibrated Extraction",
    description: "Steaming, pressure metrics, and water temperature managed to the decimal.",
    image: IMAGES.espressoExtraction,
    floatClass: "bob-delay-2"
  },
  {
    id: 3,
    title: "Signature Coffee",
    subtitle: "The Rosetta Pour",
    description: "Artisanal latte cup presentations marrying visual art with taste.",
    image: IMAGES.latte,
    floatClass: "bob-delay-3"
  },
  {
    id: 4,
    title: "Luxury Café Space",
    subtitle: "Architectural Sanctuary",
    description: "Abundant greenery, Calacatta stone countertops, and walnut tables.",
    image: IMAGES.cafeInterior,
    floatClass: "bob-delay-4"
  }
];

const SLOTS = [
  { // Slot 0: Featured
    width: "290px",
    height: "370px",
    top: "8%",
    left: "6%",
    zIndex: 10,
    scale: 1,
    opacity: 1
  },
  { // Slot 1: Supporting A
    width: "160px",
    height: "210px",
    top: "5%",
    left: "68%",
    zIndex: 5,
    scale: 0.9,
    opacity: 0.82
  },
  { // Slot 2: Supporting B
    width: "160px",
    height: "210px",
    top: "48%",
    left: "68%",
    zIndex: 5,
    scale: 0.9,
    opacity: 0.82
  },
  { // Slot 3: Supporting C
    width: "160px",
    height: "210px",
    top: "54%",
    left: "34%",
    zIndex: 5,
    scale: 0.9,
    opacity: 0.82
  }
];

export default function Gallery() {
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef(null);
  const timerRef = useRef(null);

  // Autoplay Interval
  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        setFeaturedIndex((prev) => (prev + 1) % CARDS.length);
      }, 5000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  // Position cards on active index changes using GSAP
  useEffect(() => {
    CARDS.forEach((card, cardIdx) => {
      // Calculate dynamic slot placement
      const slotIdx = (cardIdx - featuredIndex + CARDS.length) % CARDS.length;
      const targetSlot = SLOTS[slotIdx];
      const isFeatured = slotIdx === 0;

      // Animate card positions
      gsap.to(`.gallery-card-${cardIdx + 1}`, {
        width: targetSlot.width,
        height: targetSlot.height,
        top: targetSlot.top,
        left: targetSlot.left,
        zIndex: targetSlot.zIndex,
        scale: targetSlot.scale,
        opacity: targetSlot.opacity,
        borderColor: isFeatured ? "var(--color-gold)" : "rgba(197, 164, 126, 0.2)",
        boxShadow: isFeatured 
          ? "0 28px 55px rgba(197, 164, 126, 0.24)" 
          : "0 10px 25px rgba(62, 78, 61, 0.05)",
        duration: 1.0,
        ease: "power3.inOut"
      });

      // Animate active card inner image Ken Burns zoom
      gsap.to(`.gallery-card-img-${cardIdx + 1}`, {
        scale: isFeatured ? 1.08 : 1.0,
        duration: isFeatured ? 5.0 : 0.8,
        ease: isFeatured ? "none" : "power2.out"
      });

      // Animate card details visibility
      gsap.to(`.gallery-card-desc-${cardIdx + 1}`, {
        opacity: isFeatured ? 1 : 0,
        height: isFeatured ? "auto" : 0,
        marginTop: isFeatured ? 8 : 0,
        duration: 0.5,
        ease: "power2.out"
      });
    });
  }, [featuredIndex]);

  // 3D Card Hover Tilt Calculations
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(card, {
      rotateY: x * 8,
      rotateX: -y * 8,
      transformPerspective: 1200,
      translateZ: 12,
      ease: "power2.out",
      duration: 0.4
    });
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    gsap.to(card, {
      rotateY: 0,
      rotateX: 0,
      translateZ: 0,
      ease: "power2.out",
      duration: 0.6
    });
  };

  return (
    <div 
      id="gallery" 
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        backgroundColor: "var(--color-bg-ivory)",
        overflow: "hidden",
        display: "flex",
        alignItems: "center"
      }}
    >
      {/* Self-contained CSS for asynchronous card bobs and dust particles */}
      <style>{`
        @keyframes cardBob1 {
          0% { transform: translateY(0); }
          50% { transform: translateY(-7px); }
          100% { transform: translateY(0); }
        }
        @keyframes cardBob2 {
          0% { transform: translateY(0); }
          50% { transform: translateY(-9px); }
          100% { transform: translateY(0); }
        }
        @keyframes cardBob3 {
          0% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
          100% { transform: translateY(0); }
        }
        @keyframes cardBob4 {
          0% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0); }
        }
        @keyframes dustDrift {
          0% { transform: translate(0, 0); opacity: 0.15; }
          50% { transform: translate(15px, -20px); opacity: 0.35; }
          100% { transform: translate(0, 0); opacity: 0.15; }
        }
        .bob-delay-1 { animation: cardBob1 6s infinite ease-in-out; }
        .bob-delay-2 { animation: cardBob2 6.5s infinite ease-in-out; }
        .bob-delay-3 { animation: cardBob3 5.5s infinite ease-in-out; }
        .bob-delay-4 { animation: cardBob4 6.2s infinite ease-in-out; }
        .gallery-dust { animation: dustDrift 9s infinite ease-in-out; }
      `}</style>

      {/* Floating golden dust particles background */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
        pointerEvents: "none"
      }}>
        <div className="gallery-dust" style={{ position: "absolute", top: "25%", left: "45%", width: "4px", height: "4px", borderRadius: "50%", backgroundColor: "var(--color-gold)", animationDelay: "0s" }} />
        <div className="gallery-dust" style={{ position: "absolute", top: "70%", left: "75%", width: "5px", height: "5px", borderRadius: "50%", backgroundColor: "var(--color-gold)", animationDelay: "2.5s" }} />
        <div className="gallery-dust" style={{ position: "absolute", top: "15%", left: "85%", width: "3px", height: "3px", borderRadius: "50%", backgroundColor: "var(--color-gold)", animationDelay: "4.5s" }} />
      </div>

      {/* Main split grid */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        padding: "0 8vw",
        boxSizing: "border-box",
        position: "relative",
        zIndex: 2
      }}>
        
        {/* Left Side: Editorial details that syncs with active featured card */}
        <div style={{
          width: "35%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center"
        }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={featuredIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}
            >
              <span style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.85rem",
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                color: "var(--color-olive)",
                fontWeight: 700,
                marginBottom: "15px"
              }}>
                {CARDS[featuredIndex].subtitle}
              </span>
              <h2 style={{
                fontSize: "clamp(2.4rem, 3.8vw, 3.8rem)",
                fontFamily: "var(--font-serif)",
                color: "var(--color-forest)",
                lineHeight: 1.15,
                marginBottom: "20px"
              }}>
                {CARDS[featuredIndex].title}
              </h2>
              <p style={{
                fontSize: "0.95rem",
                color: "var(--color-charcoal-muted)",
                lineHeight: 1.7,
                marginBottom: "35px",
                maxWidth: "340px"
              }}>
                {CARDS[featuredIndex].description}
              </p>
              
              <button style={{
                backgroundColor: "var(--color-forest)",
                color: "var(--color-bg-ivory)",
                border: "none",
                borderRadius: "30px",
                padding: "14px 32px",
                fontFamily: "var(--font-sans)",
                fontSize: "0.82rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                cursor: "pointer",
                boxShadow: "0 8px 22px rgba(37, 48, 36, 0.12)",
                transition: "opacity 0.3s"
              }}
              onMouseEnter={(e) => e.target.style.opacity = 0.9}
              onMouseLeave={(e) => e.target.style.opacity = 1}
              >
                Discover Craft
              </button>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Side: Asymmetric dynamic swap space */}
        <div style={{
          width: "55vw",
          height: "65vh",
          position: "relative"
        }}>
          {CARDS.map((card, idx) => (
            <div
              key={card.id}
              className={`gallery-card-${idx + 1} ${card.floatClass}`}
              onMouseMove={handleMouseMove}
              onMouseLeave={(e) => {
                handleMouseLeave(e);
                setIsPaused(false);
              }}
              onMouseEnter={() => {
                setFeaturedIndex(idx);
                setIsPaused(true);
              }}
              style={{
                position: "absolute",
                borderRadius: "28px",
                overflow: "hidden",
                border: "1px solid rgba(197, 164, 126, 0.2)",
                backgroundColor: "rgba(253, 252, 247, 0.82)",
                backdropFilter: "blur(12px)",
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
                transformStyle: "preserve-3d",
                willChange: "transform, opacity, border-color, box-shadow"
              }}
            >
              {/* Card Image */}
              <div style={{
                position: "relative",
                width: "100%",
                height: "62%",
                overflow: "hidden"
              }}>
                <div
                  className={`gallery-card-img-${idx + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundImage: `url(${card.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    willChange: "transform"
                  }}
                />
                
                {/* Vignette Overlay */}
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(to top, rgba(253, 252, 247, 0.85) 0%, rgba(253, 252, 247, 0) 100%)",
                  zIndex: 2
                }} />
              </div>

              {/* Card Details (Only rendered when featured slot is active) */}
              <div style={{
                padding: "16px 20px",
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                transform: "translateZ(25px)"
              }}>
                <span style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.62rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--color-olive)",
                  fontWeight: 700,
                  display: "block"
                }}>
                  {card.subtitle}
                </span>
                <h3 style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.15rem",
                  color: "var(--color-forest)",
                  margin: "4px 0 0"
                }}>
                  {card.title}
                </h3>
                
                <p 
                  className={`gallery-card-desc-${idx + 1}`}
                  style={{
                    fontSize: "0.74rem",
                    color: "var(--color-charcoal-muted)",
                    lineHeight: 1.4,
                    margin: 0,
                    overflow: "hidden"
                  }}
                >
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
