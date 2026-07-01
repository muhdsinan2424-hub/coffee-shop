import { useRef } from "react";
import { Coffee, ArrowUpRight, Mail } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const containerRef = useRef(null);

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert("Thank you for joining our private coffee journal circular.");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useGSAP(() => {
    gsap.fromTo(".footer-watermark", {
      y: 40,
      letterSpacing: "0.1em"
    }, {
      y: -20,
      letterSpacing: "0.22em",
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom bottom",
        scrub: 1
      }
    });
  }, { scope: containerRef });

  return (
    <footer ref={containerRef} style={{
      backgroundColor: "var(--color-bg-stone)",
      borderTop: "1px solid rgba(197, 164, 126, 0.15)",
      padding: "100px 5vw 40px",
      position: "relative",
      zIndex: 15,
      overflow: "hidden"
    }}>
      {/* Background massive branding text */}
      <div className="footer-watermark" style={{
        position: "absolute",
        bottom: "-30px",
        left: "50%",
        transform: "translateX(-50%)",
        fontSize: "clamp(6rem, 16vw, 16rem)",
        fontFamily: "var(--font-serif)",
        fontWeight: 400,
        color: "rgba(62, 78, 61, 0.025)",
        letterSpacing: "0.15em",
        pointerEvents: "none",
        whiteSpace: "nowrap",
        zIndex: 1
      }}>
        L'AROMA
      </div>

      <div style={{
        maxWidth: "1100px",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "1.2fr 0.8fr 1fr",
        gap: "60px",
        position: "relative",
        zIndex: 2
      }} className="footer-grid">
        
        {/* Column 1: Brand details */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <Coffee size={20} color="var(--color-olive)" />
            <span style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.1rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--color-forest)"
            }}>
              L'Aroma
            </span>
          </div>
          <p style={{
            fontSize: "0.85rem",
            lineHeight: "1.7",
            color: "var(--color-charcoal-muted)",
            marginBottom: "30px",
            maxWidth: "320px"
          }}>
            Dedicated to roasting rare, single-origin varietals and crafting sensory spaces. Where liquid luxury meets architectural harmony.
          </p>
          <div style={{ display: "flex", gap: "20px" }}>
            {["Instagram", "Journal", "Press Kit"].map((link) => (
              <a 
                key={link}
                href="#"
                style={{
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--color-olive)",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "3px",
                  transition: "var(--transition-snappy)"
                }}
                onMouseEnter={(e) => e.target.style.color = "var(--color-forest)"}
                onMouseLeave={(e) => e.target.style.color = "var(--color-olive)"}
              >
                {link} <ArrowUpRight size={10} />
              </a>
            ))}
          </div>
        </div>

        {/* Column 2: Hours & Seating */}
        <div>
          <h4 style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.8rem",
            fontWeight: 600,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--color-olive)",
            marginBottom: "20px"
          }}>
            Locations & Hours
          </h4>
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            fontSize: "0.85rem",
            color: "var(--color-charcoal-muted)"
          }}>
            <p><strong style={{ color: "var(--color-forest)" }}>Chelsea, NYC</strong><br />7th Avenue, Chelsea<br />Mon - Sun: 8:00 AM - 10:00 PM</p>
            <p><strong style={{ color: "var(--color-forest)" }}>Mayfair, London</strong><br />Bruton Place, Mayfair<br />Mon - Sun: 9:00 AM - 9:00 PM</p>
          </div>
        </div>

        {/* Column 3: Newsletter Circular */}
        <div>
          <h4 style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.8rem",
            fontWeight: 600,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--color-olive)",
            marginBottom: "20px"
          }}>
            The Circular Journal
          </h4>
          <p style={{
            fontSize: "0.85rem",
            color: "var(--color-charcoal-muted)",
            marginBottom: "20px",
            lineHeight: "1.6"
          }}>
            Subscribe to receive priority notifications on rare bean micro-lot releases and private café dining evenings.
          </p>
          <form onSubmit={handleSubscribe} style={{
            display: "flex",
            borderBottom: "1px solid rgba(197, 164, 126, 0.35)",
            paddingBottom: "8px"
          }}>
            <input 
              type="email" 
              required
              placeholder="Your email address"
              style={{
                background: "none",
                border: "none",
                color: "var(--color-charcoal)",
                fontFamily: "var(--font-sans)",
                fontSize: "0.85rem",
                width: "100%",
                outline: "none"
              }}
            />
            <button 
              type="submit"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0 5px"
              }}
            >
              <Mail size={16} color="var(--color-olive)" />
            </button>
          </form>
        </div>

      </div>

      {/* Row 4: Copyright and Back to Top */}
      <div style={{
        maxWidth: "1100px",
        margin: "60px auto 0",
        paddingTop: "30px",
        borderTop: "1px solid rgba(197, 164, 126, 0.15)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "relative",
        zIndex: 2,
        fontSize: "0.75rem",
        color: "var(--color-charcoal-muted)",
        opacity: 0.7
      }} className="footer-copyright-row">
        <span>© {currentYear} L'Aroma Roasters. All rights reserved.</span>
        <button 
          onClick={scrollToTop}
          style={{
            background: "none",
            border: "none",
            color: "var(--color-olive)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            cursor: "pointer",
            fontSize: "0.75rem",
            display: "flex",
            alignItems: "center",
            gap: "5px"
          }}
          onMouseEnter={(e) => e.target.style.color = "var(--color-forest)"}
          onMouseLeave={(e) => e.target.style.color = "var(--color-olive)"}
        >
          Top ↑
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid {
            gridTemplateColumns: 1fr !important;
            gap: 40px !important;
          }
          .footer-copyright-row {
            flexDirection: column !important;
            gap: 15px !important;
            text-align: center !important;
          }
        }
      `}</style>
    </footer>
  );
}
