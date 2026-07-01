import { useState } from "react";
import Loader from "./components/Loader";
import CustomCursor from "./components/CustomCursor";
import SmoothScroll from "./components/SmoothScroll";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Menu from "./components/Menu";
import Interior from "./components/Interior";
import Gallery from "./components/Gallery";
import Testimonials from "./components/Testimonials";
import Booking from "./components/Booking";
import Footer from "./components/Footer";

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading ? (
        <Loader onComplete={() => setLoading(false)} />
      ) : (
        <>
          {/* Custom Trailing Glow Cursor */}
          <CustomCursor />

          {/* Floating Pill Glass Navbar */}
          <Navbar />

          {/* Smooth Lenis + GSAP Scroll Container */}
          <SmoothScroll>
            <main className="scroll-container">
              {/* Modern Scroll-animated Parallax Hero */}
              <Hero />

              {/* Signature Drink Cards with 3D Mouse Tilt */}
              <Menu />

              {/* Architectural & Cozy Seating Layout */}
              <Interior />

              {/* Horizontal Scroll Parallax Gallery */}
              <Gallery />

              {/* Testimonials Drag Carousel */}
              <Testimonials />

              {/* Concierge Step-by-Step Table Booking Form */}
              <Booking />

              {/* Cinematic Brand Footer */}
              <Footer />
            </main>
          </SmoothScroll>
        </>
      )}
    </>
  );
}
