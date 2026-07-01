import { useRef } from "react";
import { IMAGES } from "../assets/images";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export default function Interior() {
  const containerRef = useRef(null);

  useGSAP(() => {
    // Parallax on overlapping graphics
    gsap.fromTo(".interior-main-img", {
      yPercent: -8
    }, {
      yPercent: 8,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.6
      }
    });

    gsap.fromTo(".interior-sub-img", {
      yPercent: 12
    }, {
      yPercent: -12,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.6
      }
    });

    // Content fade up (synchronized scroll-scrub reveal)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 90%",
        end: "top 45%",
        scrub: 1.2
      }
    });

    tl.fromTo(".interior-content-tag", {
      opacity: 0,
      y: 15
    }, {
      opacity: 1,
      y: 0,
      ease: "power2.out"
    })
    .fromTo(".interior-content-title", {
      opacity: 0,
      y: 30,
      filter: "blur(6px)"
    }, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      ease: "power2.out"
    })
    .fromTo(".interior-content-text", {
      opacity: 0,
      y: 20
    }, {
      opacity: 1,
      y: 0,
      ease: "power2.out"
    })
    .fromTo(".interior-stat-box", {
      opacity: 0,
      y: 25
    }, {
      opacity: 1,
      y: 0,
      stagger: 0.15,
      ease: "power2.out"
    });
  }, { scope: containerRef });

  return (
    <section id="interior" ref={containerRef} style={{
      backgroundColor: "var(--color-bg-stone)",
      padding: "100px 5vw",
      position: "relative",
      zIndex: 15,
      borderTop: "1px solid rgba(197, 164, 126, 0.15)"
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "1.1fr 0.9fr",
        gap: "80px",
        alignItems: "center"
      }} className="interior-grid">
        
        {/* Left Side: Overlapping Image Composition */}
        <div style={{
          position: "relative",
          height: "600px",
          width: "100%"
        }} className="interior-visuals">
          
          {/* Main Large Image */}
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "80%",
            height: "75%",
            borderRadius: "24px",
            overflow: "hidden",
            boxShadow: "0 20px 40px rgba(62,78,61,0.06)",
            border: "1px solid rgba(197, 164, 126, 0.25)"
          }}>
            <div style={{
              width: "100%",
              height: "100%",
              backgroundImage: `url(${IMAGES.cafeInterior})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              transform: "scale(1.15)",
              transition: "transform 1.5s var(--transition-smooth)"
            }} className="interior-main-img" />
          </div>

          {/* Overlapping Small Image */}
          <div style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: "55%",
            height: "55%",
            borderRadius: "24px",
            overflow: "hidden",
            boxShadow: "0 25px 50px rgba(62,78,61,0.1)",
            border: "1px solid rgba(197, 164, 126, 0.3)",
            zIndex: 2
          }}>
            <div style={{
              width: "100%",
              height: "100%",
              backgroundImage: `url(${IMAGES.artisanPastry})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              transform: "scale(1.15)",
            }} className="interior-sub-img" />
          </div>

          {/* Floating Marble/Brass Material Badge */}
          <div className="glass-panel badge-float" style={{
            position: "absolute",
            top: "40%",
            left: "70%",
            padding: "24px",
            borderRadius: "20px",
            zIndex: 3,
            maxWidth: "200px",
            textAlign: "center"
          }}>
            <p style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.5rem",
              color: "var(--color-gold)",
              marginBottom: "5px"
            }}>Walnut & Marble</p>
            <p style={{
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--color-charcoal-muted)"
            }}>Artisanal Materials</p>
          </div>
        </div>

        {/* Right Side: Editorial Content */}
        <div style={{ padding: "20px 0" }} className="interior-content">
          <p className="interior-content-tag" style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.85rem",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: "var(--color-olive)",
            marginBottom: "20px",
            fontWeight: 600
          }}>
            The Atmosphere
          </p>
          <h2 className="interior-content-title" style={{
            fontSize: "clamp(2.5rem, 4vw, 3.8rem)",
            fontFamily: "var(--font-serif)",
            lineHeight: 1.15,
            marginBottom: "30px",
            color: "var(--color-forest)"
          }}>
            Designed for Slow Living
          </h2>
          <p className="interior-content-text" style={{
            fontSize: "1.05rem",
            lineHeight: "1.8",
            color: "var(--color-charcoal-muted)",
            marginBottom: "35px"
          }}>
            L'Aroma is designed as an architectural sanctuary. Featuring raw walnut wood furniture sourced from sustainably managed woodlands, cold white Calacatta marble tables, brushed bronze trimmings, and abundant forest-green plants, it is a haven for focused thoughts, quiet conversations, and sensory appreciation.
          </p>

          {/* Experience Statistics/Badges */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "30px",
            borderTop: "1px solid rgba(197, 164, 126, 0.18)",
            paddingTop: "35px"
          }}>
            <div className="interior-stat-box">
              <h4 style={{
                fontFamily: "var(--font-serif)",
                fontSize: "2.2rem",
                color: "var(--color-forest)",
                marginBottom: "5px"
              }}>
                100%
              </h4>
              <p style={{
                fontSize: "0.8rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--color-olive)",
                fontWeight: 500
              }}>
                Single-Origin Arabica
              </p>
            </div>
            <div className="interior-stat-box">
              <h4 style={{
                fontFamily: "var(--font-serif)",
                fontSize: "2.2rem",
                color: "var(--color-forest)",
                marginBottom: "5px"
              }}>
                48hr
              </h4>
              <p style={{
                fontSize: "0.8rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--color-olive)",
                fontWeight: 500
              }}>
                Resting cycle post-roast
              </p>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 992px) {
          .interior-grid {
            gridTemplateColumns: 1fr !important;
            gap: 50px !important;
          }
          .interior-visuals {
            height: 450px !important;
          }
        }
      `}</style>
    </section>
  );
}
