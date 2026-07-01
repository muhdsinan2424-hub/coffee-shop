import { useRef } from "react";
import { Star } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const REVIEWS = [
  {
    id: 1,
    quote: "The interior layout is a masterpiece of cozy minimalist design. The warm walnut wood, white marble, and brushed brass details create an unmatched sensory sanctuary.",
    author: "Architectural Digest",
    rating: 5,
    tag: "Design Review"
  },
  {
    id: 2,
    quote: "L'Aroma has elevated espresso extraction to a pure science. Their single-origin Ethiopian cold drip is a revelation—remarkably sweet, floral, and smooth.",
    author: "Michelin Guide Critic",
    rating: 5,
    tag: "Gastronomy Review"
  },
  {
    id: 3,
    quote: "Every detail feels expensive and carefully handcrafted. From the custom ceramics to the linen napkins and the ambient golden hour acoustics.",
    author: "Vogue Lifestyle",
    rating: 5,
    tag: "Atmosphere Review"
  },
  {
    id: 4,
    quote: "An absolute masterclass in branding. L'Aroma doesn't just sell coffee; they offer a curated sensory experience that lingers in your memory.",
    author: "Awwwards Jury",
    rating: 5,
    tag: "Brand Review"
  }
];

export default function Testimonials() {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const loopRef = useRef(null);

  useGSAP(() => {
    // 1. Reveal testimonials title block on scroll entry
    gsap.fromTo(".testimonials-title-block", {
      opacity: 0,
      y: 30,
      filter: "blur(6px)"
    }, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      ease: "power2.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 90%",
        end: "top 55%",
        scrub: 1.2
      }
    });

    // 2. Infinite Horizontal Loop using GSAP Timeline
    const track = trackRef.current;
    if (!track) return;

    // Calculate width of half of the track (first set of reviews)
    const totalWidth = track.scrollWidth;
    const halfWidth = totalWidth / 2;

    const tl = gsap.timeline({
      repeat: -1,
      defaults: { ease: "none" }
    });

    tl.to(track, {
      x: -halfWidth,
      duration: 35 // Extremely smooth cinematic speed
    });

    loopRef.current = tl;
  }, { scope: containerRef });

  return (
    <section id="testimonials" ref={containerRef} style={{
      backgroundColor: "var(--color-bg-stone)",
      padding: "120px 5vw",
      position: "relative",
      zIndex: 15,
      overflow: "hidden"
    }}>
      {/* Self-contained CSS for seamless hover states */}
      <style>{`
        .testimonials-card-hover {
          transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.45s, border-color 0.45s;
        }
        .testimonials-card-hover:hover {
          transform: translateY(-8px) scale(1.01);
          box-shadow: 0 16px 40px rgba(62, 78, 61, 0.08) !important;
          border-color: var(--color-gold) !important;
        }
      `}</style>

      {/* Title */}
      <div className="testimonials-title-block" style={{ textAlign: "center", marginBottom: "60px" }}>
        <p style={{
          fontFamily: "var(--font-sans)",
          fontSize: "0.85rem",
          letterSpacing: "0.4em",
          textTransform: "uppercase",
          color: "var(--color-olive)",
          marginBottom: "15px",
          fontWeight: 600
        }}>
          Accolades & Stories
        </p>
        <h2 style={{
          fontSize: "clamp(2.5rem, 4vw, 4rem)",
          fontFamily: "var(--font-serif)",
          color: "var(--color-forest)"
        }}>
          What Connoisseurs Say
        </h2>
        <div style={{
          width: "80px",
          height: "2px",
          backgroundColor: "var(--color-gold)",
          margin: "25px auto 0"
        }} />
      </div>

      {/* Infinite Horizontal Carousel Container */}
      <div 
        onMouseEnter={() => {
          if (loopRef.current) loopRef.current.pause();
        }}
        onMouseLeave={() => {
          if (loopRef.current) loopRef.current.play();
        }}
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          overflow: "hidden"
        }}
      >
        <div 
          ref={trackRef}
          style={{
            display: "flex",
            gap: "30px",
            width: "max-content",
            padding: "20px 10px",
            willChange: "transform"
          }}
        >
          {/* Double mapped array for a seamless loop */}
          {[...REVIEWS, ...REVIEWS].map((rev, idx) => (
            <div 
              key={`${rev.id}-${idx}`} 
              style={{
                width: "450px",
                maxWidth: "85vw",
                borderRadius: "24px",
                padding: "40px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "360px",
                boxShadow: "0 10px 30px rgba(62,78,61,0.04)",
                cursor: "pointer",
                flexShrink: 0
              }}
              className="glass-panel testimonials-card-hover"
            >
              {/* Stars & Tag */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <div style={{ display: "flex", gap: "4px" }}>
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={15} fill="var(--color-gold)" color="var(--color-gold)" />
                  ))}
                </div>
                <span style={{
                  fontSize: "0.75rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--color-olive)",
                  border: "1px solid rgba(197, 164, 126, 0.25)",
                  padding: "4px 10px",
                  borderRadius: "12px",
                  backgroundColor: "rgba(62, 78, 61, 0.03)"
                }}>
                  {rev.tag}
                </span>
              </div>

              {/* Review Text */}
              <p style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.2rem",
                lineHeight: "1.6",
                color: "var(--color-charcoal)",
                fontStyle: "italic",
                margin: "25px 0"
              }}>
                "{rev.quote}"
              </p>

              {/* Review Author */}
              <div style={{
                borderTop: "1px solid rgba(197, 164, 126, 0.15)",
                paddingTop: "20px"
              }}>
                <h4 style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  letterSpacing: "0.05em",
                  color: "var(--color-forest)"
                }}>
                  {rev.author}
                </h4>
                <p style={{
                  fontSize: "0.75rem",
                  color: "var(--color-charcoal-muted)",
                  marginTop: "2px"
                }}>
                  Verified Critic
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hover info guide */}
      <div style={{
        textAlign: "center",
        marginTop: "40px",
        color: "var(--color-charcoal-muted)",
        opacity: 0.7,
        fontSize: "0.75rem",
        letterSpacing: "0.15em",
        textTransform: "uppercase"
      }}>
        Hover over reviews to pause testimonials
      </div>
    </section>
  );
}
