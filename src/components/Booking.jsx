import { useState, useRef } from "react";
import { Calendar, Users, MapPin, Clock, ArrowRight, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export default function Booking() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    guests: "2 Guests",
    location: "Main Salon",
    date: "",
    time: "10:00 AM",
    name: "",
    email: "",
    requests: ""
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step === 1 && (!formData.date || !formData.time)) {
      alert("Please select a date and time");
      return;
    }
    setStep(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert("Please provide your name and email address");
      return;
    }
    setStep(3);
  };

  const resetForm = () => {
    setFormData({
      guests: "2 Guests",
      location: "Main Salon",
      date: "",
      time: "10:00 AM",
      name: "",
      email: "",
      requests: ""
    });
    setStep(1);
  };

  const reservationCode = Math.random().toString(36).substring(3, 9).toUpperCase();
  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(".booking-layout", {
      opacity: 0,
      y: 40,
      filter: "blur(6px)"
    }, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      ease: "power2.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 90%",
        end: "top 45%",
        scrub: 1.2
      }
    });
  }, { scope: containerRef });

  return (
    <section id="reservations" ref={containerRef} style={{
      backgroundColor: "var(--color-bg-ivory)",
      padding: "120px 5vw",
      position: "relative",
      zIndex: 15,
      borderTop: "1px solid rgba(197, 164, 126, 0.15)"
    }}>
      <div style={{
        maxWidth: "900px",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "0.8fr 1.2fr",
        gap: "60px",
        alignItems: "center"
      }} className="booking-layout">
        
        {/* Left Side: Callout */}
        <div>
          <p style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.85rem",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: "var(--color-olive)",
            marginBottom: "15px",
            fontWeight: 600
          }}>
            Reservations
          </p>
          <h2 style={{
            fontSize: "clamp(2.2rem, 3.5vw, 3.5rem)",
            fontFamily: "var(--font-serif)",
            lineHeight: 1.15,
            marginBottom: "25px",
            color: "var(--color-forest)"
          }}>
            Reserve Your Experience
          </h2>
          <p style={{
            fontSize: "0.95rem",
            lineHeight: "1.7",
            color: "var(--color-charcoal-muted)",
            marginBottom: "30px"
          }}>
            Join us for an exceptional coffee tasting journey. Select your preferred seating area, schedule a convenient time slot, and allow our master baristas to prepare a tailored tasting flight for you.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "0.9rem", color: "var(--color-charcoal)" }}>
              <Clock size={16} color="var(--color-olive)" />
              <span>Daily: 8:00 AM - 10:00 PM</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "0.9rem", color: "var(--color-charcoal)" }}>
              <MapPin size={16} color="var(--color-olive)" />
              <span>7th Avenue, Chelsea, NYC</span>
            </div>
          </div>
        </div>

        {/* Right Side: Step-by-Step Form Card */}
        <motion.div 
          layout
          className="glass-panel" 
          style={{
            borderRadius: "24px",
            padding: "40px",
            border: "1px solid rgba(197, 164, 126, 0.22)",
            minHeight: "420px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            overflow: "hidden"
          }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Step Progress indicators */}
          {step < 3 && (
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "35px"
            }}>
              <span style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-olive)", fontWeight: 600 }}>
                Step {step} of 2
              </span>
              <div style={{ display: "flex", gap: "6px" }}>
                <div style={{ width: "30px", height: "3px", borderRadius: "2px", backgroundColor: step >= 1 ? "var(--color-olive)" : "rgba(62, 78, 61, 0.08)" }} />
                <div style={{ width: "30px", height: "3px", borderRadius: "2px", backgroundColor: step >= 2 ? "var(--color-olive)" : "rgba(62, 78, 61, 0.08)" }} />
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* STEP 1: OPTIONS & TIMING */}
            {step === 1 && (
              <motion.div 
                key="step-1"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                style={{ display: "flex", flexDirection: "column", gap: "25px" }}
              >
                {/* Guests Count */}
                <div>
                  <label style={labelStyle}><Users size={13} style={{ marginRight: "6px" }} /> Table For</label>
                  <select 
                    value={formData.guests} 
                    onChange={(e) => handleInputChange("guests", e.target.value)}
                    style={selectStyle}
                  >
                    {["1 Guest", "2 Guests", "3 Guests", "4 Guests", "5 Guests", "6 Guests"].map(o => (
                      <option key={o} value={o} style={{ backgroundColor: "var(--color-bg-stone)" }}>{o}</option>
                    ))}
                  </select>
                </div>

                {/* Seating Location Zone */}
                <div>
                  <label style={labelStyle}><MapPin size={13} style={{ marginRight: "6px" }} /> Seating Area</label>
                  <select 
                    value={formData.location} 
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    style={selectStyle}
                  >
                    {["Main Salon", "Walnut Bar Counter", "Cozy Reading Corner", "Outdoor Courtyard"].map(o => (
                      <option key={o} value={o} style={{ backgroundColor: "var(--color-bg-stone)" }}>{o}</option>
                    ))}
                  </select>
                </div>

                {/* Date and Time selectors side-by-side */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div>
                    <label style={labelStyle}><Calendar size={13} style={{ marginRight: "6px" }} /> Date</label>
                    <input 
                      type="date" 
                      value={formData.date}
                      onChange={(e) => handleInputChange("date", e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}><Clock size={13} style={{ marginRight: "6px" }} /> Preferred Time</label>
                    <select 
                      value={formData.time} 
                      onChange={(e) => handleInputChange("time", e.target.value)}
                      style={selectStyle}
                    >
                      {["08:00 AM", "10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM", "06:00 PM", "08:00 PM"].map(o => (
                        <option key={o} value={o} style={{ backgroundColor: "var(--color-bg-stone)" }}>{o}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Next Step Button */}
                <button 
                  onClick={handleNext}
                  style={btnSubmitStyle}
                >
                  Guest Info <ArrowRight size={16} style={{ marginLeft: "8px" }} />
                </button>
              </motion.div>
            )}

            {/* STEP 2: PERSONAL INFO */}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                  {/* Full Name */}
                  <div>
                    <label style={labelStyle}>Full Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Alexander Vance"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      style={inputStyle}
                    />
                  </div>

                  {/* Email Address */}
                  <div>
                    <label style={labelStyle}>Email Address</label>
                    <input 
                      type="email" 
                      required
                      placeholder="e.g. alex@vance.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      style={inputStyle}
                    />
                  </div>

                  {/* Special Requests */}
                  <div>
                    <label style={labelStyle}>Special Requests (Optional)</label>
                    <textarea 
                      rows="3"
                      placeholder="Let us know of any allergies or table preferences..."
                      value={formData.requests}
                      onChange={(e) => handleInputChange("requests", e.target.value)}
                      style={{ ...inputStyle, resize: "none" }}
                    />
                  </div>

                  {/* Back & Submit buttons */}
                  <div style={{ display: "flex", gap: "15px" }}>
                    <button 
                      type="button"
                      onClick={() => setStep(1)}
                      style={{
                        ...btnSubmitStyle,
                        backgroundColor: "transparent",
                        border: "1px solid rgba(197, 164, 126, 0.35)",
                        color: "var(--color-charcoal)"
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = "rgba(62, 78, 61, 0.03)"}
                      onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                    >
                      Back
                    </button>
                    <button 
                      type="submit"
                      style={btnSubmitStyle}
                    >
                      Confirm Booking
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* STEP 3: BOOKING SUCCESS */}
            {step === 3 && (
              <motion.div 
                key="step-3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "25px", width: "100%" }}
              >
                {/* Success Check Circle */}
                <div style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  backgroundColor: "var(--color-forest)",
                  border: "2px solid var(--color-olive)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 20px rgba(58, 78, 70, 0.15)"
                }}>
                  <Check size={32} color="var(--color-bg-ivory)" />
                </div>

                {/* Success Message */}
                <div>
                  <h3 style={{ fontSize: "1.6rem", fontFamily: "var(--font-serif)", marginBottom: "8px", color: "var(--color-forest)" }}>Reservation Confirmed</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--color-charcoal-muted)" }}>We are holding your table in the {formData.location}.</p>
                </div>

                {/* Reservation Card Details */}
                <div style={{
                  backgroundColor: "rgba(62, 78, 61, 0.03)",
                  border: "1px dashed rgba(197, 164, 126, 0.35)",
                  borderRadius: "16px",
                  padding: "20px",
                  width: "100%",
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  fontSize: "0.85rem"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--color-charcoal-muted)" }}>Reference ID:</span>
                    <span style={{ fontWeight: 600, color: "var(--color-forest)", letterSpacing: "0.05em" }}>{reservationCode}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--color-charcoal-muted)" }}>Guests:</span>
                    <span style={{ color: "var(--color-charcoal)" }}>{formData.guests}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--color-charcoal-muted)" }}>Date & Time:</span>
                    <span style={{ color: "var(--color-charcoal)" }}>{formData.date} at {formData.time}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--color-charcoal-muted)" }}>Seating Area:</span>
                    <span style={{ color: "var(--color-charcoal)" }}>{formData.location}</span>
                  </div>
                </div>

                {/* Reserve Another / Return Button */}
                <button 
                  onClick={resetForm}
                  style={{
                    ...btnSubmitStyle,
                    backgroundColor: "transparent",
                    border: "1px solid rgba(197, 164, 126, 0.35)",
                    color: "var(--color-charcoal)"
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = "rgba(62, 78, 61, 0.03)"}
                  onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                >
                  Make Another Reservation
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .booking-layout {
            gridTemplateColumns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </section>
  );
}

// Inline Styles for Form Layout Elements
const labelStyle = {
  display: "flex",
  alignItems: "center",
  fontSize: "0.75rem",
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--color-olive)",
  marginBottom: "10px"
};

const selectStyle = {
  width: "100%",
  backgroundColor: "rgba(253, 252, 247, 0.6)",
  border: "1px solid rgba(197, 164, 126, 0.35)",
  borderRadius: "12px",
  padding: "12px 16px",
  color: "var(--color-charcoal)",
  fontFamily: "var(--font-sans)",
  fontSize: "0.9rem",
  cursor: "pointer",
  outline: "none",
  transition: "border-color 0.3s"
};

const inputStyle = {
  width: "100%",
  backgroundColor: "rgba(253, 252, 247, 0.6)",
  border: "1px solid rgba(197, 164, 126, 0.35)",
  borderRadius: "12px",
  padding: "12px 16px",
  color: "var(--color-charcoal)",
  fontFamily: "var(--font-sans)",
  fontSize: "0.9rem",
  outline: "none",
  transition: "border-color 0.3s"
};

const btnSubmitStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  backgroundColor: "var(--color-forest)",
  color: "var(--color-bg-ivory)",
  border: "none",
  borderRadius: "30px",
  padding: "14px 20px",
  fontFamily: "var(--font-sans)",
  fontSize: "0.85rem",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  cursor: "pointer",
  boxShadow: "0 4px 15px rgba(62, 78, 61, 0.15)",
  transition: "var(--transition-snappy)"
};
