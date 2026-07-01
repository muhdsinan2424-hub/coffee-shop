import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 240;

const frameIndex = (index) => {
  const paddedIndex = String(index).padStart(3, "0");
  return `/coffe/ezgif-frame-${paddedIndex}.jpg`;
};

export default function Hero() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);

  // Aspect-ratio cover drawing function for Canvas
  const drawImage = (img) => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const imgWidth = img.width || 1280;
    const imgHeight = img.height || 720;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const imgRatio = imgWidth / imgHeight;
    const canvasRatio = canvasWidth / canvasHeight;

    let drawWidth = canvasWidth;
    let drawHeight = canvasHeight;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasRatio > imgRatio) {
      drawHeight = canvasWidth / imgRatio;
      offsetY = (canvasHeight - drawHeight) / 2;
    } else {
      drawWidth = canvasHeight * imgRatio;
      offsetX = (canvasWidth - drawWidth) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  // Preloading sequence and handling window resizes
  useEffect(() => {
    // 1. Preload frame images
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = frameIndex(i);
      imagesRef.current.push(img);
    }

    // 2. Initial Draw & Resize binds
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;

      // Draw first frame on load
      const firstImg = imagesRef.current[0];
      if (firstImg) {
        if (firstImg.complete) {
          drawImage(firstImg);
        } else {
          firstImg.onload = () => drawImage(firstImg);
        }
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useGSAP(() => {
    // 1. Fade in typography and interface elements on mount
    gsap.fromTo(".hero-main-title", {
      opacity: 0,
      y: 40,
      filter: "blur(8px)"
    }, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 1.5,
      ease: "power3.out"
    });

    gsap.fromTo(".hero-editorial-subtext, .hero-buttons-container, .hero-scroll-indicator", {
      opacity: 0,
      y: 20
    }, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      delay: 0.4,
      ease: "power2.out",
      stagger: 0.15
    });

    // 2. Setup ScrollTrigger timeline for playing frames
    const frameObj = { frame: 0 };
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=2400px",
        scrub: true,
        pin: true,
        invalidateOnRefresh: true
      }
    });

    // Scrub sequential frame drawing
    tl.to(frameObj, {
      frame: TOTAL_FRAMES - 1,
      snap: "frame",
      ease: "none",
      duration: 10,
      onUpdate: () => {
        const currentImg = imagesRef.current[frameObj.frame];
        if (currentImg && currentImg.complete) {
          requestAnimationFrame(() => drawImage(currentImg));
        }
      }
    }, 0)

    // Zoom the background slightly as we scroll
    .to(canvasRef.current, {
      scale: 1.08,
      duration: 10,
      ease: "power1.out"
    }, 0)

    // Slowly fade out content elements
    .to(".hero-content-wrapper", {
      opacity: 0,
      y: -60,
      filter: "blur(6px)",
      duration: 6,
      ease: "power2.in"
    }, 0)

    // Translate buttons container upward slightly
    .to(".hero-buttons-container", {
      y: -30,
      duration: 6,
      ease: "power2.out"
    }, 0)

    // Fade out scroll indicator quickly
    .to(".hero-scroll-indicator", {
      opacity: 0,
      duration: 2,
      ease: "power1.out"
    }, 0);

  }, { scope: containerRef });

  // Magnetic CTA Hover Physics
  const handleMagneticMouseMove = (e) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(btn, {
      x: x * 0.35,
      y: y * 0.35,
      scale: 1.03,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  const handleMagneticMouseLeave = (e) => {
    const btn = e.currentTarget;
    gsap.to(btn, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.5,
      ease: "elastic.out(1.1, 0.4)"
    });
  };

  // Navigations scrolls
  const handleExploreClick = () => {
    const menuEl = document.getElementById("menu");
    if (menuEl) {
      menuEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleWatchClick = () => {
    const galleryEl = document.getElementById("gallery") || document.getElementById("interior");
    if (galleryEl) {
      galleryEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div id="home" ref={containerRef} style={{
      position: "relative",
      width: "100%",
      height: "100vh",
      backgroundColor: "#0d0907", // Dark coffee base background
      overflow: "hidden"
    }}>
      {/* Scroll indicator sliding dot styling */}
      <style>{`
        @keyframes scrollDot {
          0% { transform: translate(-50%, 0); opacity: 0; }
          15% { opacity: 1; }
          60% { transform: translate(-50%, 12px); opacity: 0; }
          100% { transform: translate(-50%, 0); opacity: 0; }
        }
        @keyframes dustDrift {
          0% { transform: translate(0, 0); opacity: 0.12; }
          50% { transform: translate(25px, -25px); opacity: 0.25; }
          100% { transform: translate(0, 0); opacity: 0.12; }
        }
        .hero-dust-particle {
          animation: dustDrift 9s infinite ease-in-out;
        }
      `}</style>

      {/* Canvas Element drawing sequential frames */}
      <canvas 
        ref={canvasRef} 
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          willChange: "transform",
          zIndex: 1
        }}
      />

      {/* Floating golden particles */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 2,
        pointerEvents: "none"
      }}>
        <div className="hero-dust-particle" style={{ position: "absolute", top: "35%", left: "20%", width: "4px", height: "4px", borderRadius: "50%", backgroundColor: "var(--color-gold)", animationDelay: "0s" }} />
        <div className="hero-dust-particle" style={{ position: "absolute", top: "60%", left: "80%", width: "5px", height: "5px", borderRadius: "50%", backgroundColor: "var(--color-gold)", animationDelay: "2s" }} />
        <div className="hero-dust-particle" style={{ position: "absolute", top: "20%", left: "70%", width: "3px", height: "3px", borderRadius: "50%", backgroundColor: "var(--color-gold)", animationDelay: "4.5s" }} />
      </div>

      {/* Radial Dark Vignette Overlay for readability */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "radial-gradient(circle, rgba(15, 10, 8, 0.45) 0%, rgba(15, 10, 8, 0.82) 100%)",
        zIndex: 2,
        pointerEvents: "none"
      }} />

      {/* Centered Typography content wrapper */}
      <div 
        className="hero-content-wrapper"
        style={{
          position: "relative",
          zIndex: 3,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 20px",
          boxSizing: "border-box",
          willChange: "transform, opacity"
        }}
      >
        <h1 
          className="hero-main-title"
          style={{
            fontSize: "clamp(3rem, 5.8vw, 5.8rem)",
            fontFamily: "var(--font-serif)",
            color: "#ffffff",
            fontWeight: 700,
            letterSpacing: "-0.01em",
            textAlign: "center",
            lineHeight: 1.1,
            margin: "0 0 22px",
            textShadow: "0 4px 18px rgba(0, 0, 0, 0.45)",
            willChange: "transform, opacity"
          }}
        >
          Crafted<br />
          For Coffee Lovers
        </h1>

        <p 
          className="hero-editorial-subtext"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(0.95rem, 1.2vw, 1.25rem)",
            color: "rgba(253, 252, 247, 0.85)",
            fontWeight: 450,
            letterSpacing: "0.02em",
            textAlign: "center",
            lineHeight: 1.65,
            maxWidth: "520px",
            margin: "0 0 40px",
            textShadow: "0 2px 10px rgba(0, 0, 0, 0.35)",
            willChange: "transform, opacity"
          }}
        >
          Experience the artistry of micro-batch roasting, sustainable sourcing, and perfect extraction thermodynamics.
        </p>

        {/* Action button triggers */}
        <div 
          className="hero-buttons-container"
          style={{
            display: "flex",
            gap: "20px",
            willChange: "transform, opacity"
          }}
        >
          <button
            onClick={handleExploreClick}
            onMouseMove={handleMagneticMouseMove}
            onMouseLeave={handleMagneticMouseLeave}
            style={{
              backgroundColor: "var(--color-gold)",
              color: "#0d0907",
              border: "none",
              borderRadius: "30px",
              padding: "16px 36px",
              fontFamily: "var(--font-sans)",
              fontSize: "0.85rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              cursor: "pointer",
              boxShadow: "0 10px 30px rgba(197, 164, 126, 0.25)",
              willChange: "transform"
            }}
          >
            Explore Menu
          </button>
          
          <button
            onClick={handleWatchClick}
            onMouseMove={handleMagneticMouseMove}
            onMouseLeave={handleMagneticMouseLeave}
            style={{
              backgroundColor: "rgba(253, 252, 247, 0.08)",
              color: "#ffffff",
              border: "1px solid rgba(253, 252, 247, 0.25)",
              borderRadius: "30px",
              padding: "16px 36px",
              fontFamily: "var(--font-sans)",
              fontSize: "0.85rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              cursor: "pointer",
              backdropFilter: "blur(8px)",
              willChange: "transform"
            }}
          >
            Watch Story
          </button>
        </div>
      </div>

      {/* Floating Scroll Indicator */}
      <div 
        className="hero-scroll-indicator" 
        style={{
          position: "absolute",
          bottom: "5vh",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          zIndex: 3,
          willChange: "opacity"
        }}
      >
        <span style={{
          fontFamily: "var(--font-sans)",
          fontSize: "0.68rem",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "rgba(253, 252, 247, 0.6)",
          fontWeight: 700
        }}>
          Scroll
        </span>
        <div style={{
          width: "20px",
          height: "36px",
          borderRadius: "10px",
          border: "2px solid rgba(253, 252, 247, 0.3)",
          position: "relative"
        }}>
          <div style={{
            width: "4px",
            height: "8px",
            borderRadius: "2px",
            backgroundColor: "var(--color-gold)",
            position: "absolute",
            left: "50%",
            top: "6px",
            animation: "scrollDot 2s infinite ease-in-out"
          }} />
        </div>
      </div>

    </div>
  );
}
