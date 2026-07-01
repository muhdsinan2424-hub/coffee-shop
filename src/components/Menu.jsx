import { motion, AnimatePresence } from "framer-motion";
import { IMAGES } from "../assets/images";

const MENU_ITEMS = [
  {
    id: "espresso",
    name: "Craft Espresso",
    category: "signature",
    price: "$5.50",
    image: IMAGES.espresso,
    description: "Rich, syrupy double shot extracted from roasted single-origin Ethiopian beans.",
    ingredients: ["Double Shot Espresso", "Crema Layer", "Purified Water"]
  },
  {
    id: "cappuccino",
    name: "Classic Cappuccino",
    category: "signature",
    price: "$6.50",
    image: IMAGES.cappuccino,
    description: "Equal parts espresso, velvety steamed milk, and heavy dry microfoam.",
    ingredients: ["Espresso", "Steamed Milk", "Velvet Foam", "Cocoa Dust"]
  },
  {
    id: "latte",
    name: "L'Aroma Latte",
    category: "signature",
    price: "$6.75",
    image: IMAGES.latte,
    description: "Our signature latte poured with delicate rosetta artwork using sweet organic milk.",
    ingredients: ["Espresso", "Steamed Milk", "Microfoam Art"]
  },
  {
    id: "flat-white",
    name: "Walnut Flat White",
    category: "signature",
    price: "$6.50",
    image: IMAGES.flatWhite,
    description: "Double ristretto shot finished with a thin layer of microfoam for a punchy coffee flavor.",
    ingredients: ["Ristretto Double", "Microfoam", "Walnut Aroma"]
  },
  {
    id: "cold-brew",
    name: "Kyoto Cold Brew",
    category: "cold-craft",
    price: "$7.00",
    image: IMAGES.coldBrew,
    description: "Brewed cold over 18 hours using a Japanese slow-drip tower for zero bitterness.",
    ingredients: ["18hr Cold Drip", "Ice", "Orange Twist Peel"]
  },
  {
    id: "nitro",
    name: "Nitro Velvet Stout",
    category: "cold-craft",
    price: "$7.50",
    image: IMAGES.nitroCoffee,
    description: "Infused with food-grade nitrogen on tap to create a creamy, draft-beer style head.",
    ingredients: ["Nitrogen Infused", "Cold Brew Base", "Cream Head"]
  },
  {
    id: "iced-caramel",
    name: "Iced Caramel Swirl",
    category: "cold-craft",
    price: "$7.25",
    image: IMAGES.icedCaramel,
    description: "Double shot espresso over cold organic milk and house-made salted caramel butter sauce.",
    ingredients: ["Espresso", "Salted Caramel", "Chilled Milk", "Crushed Ice"]
  },
  {
    id: "affogato",
    name: "Espresso Affogato",
    category: "specials",
    price: "$8.00",
    image: IMAGES.affogato,
    description: "A luxury Madagascar vanilla bean gelato scoop drowned in a hot ristretto shot.",
    ingredients: ["Vanilla Gelato", "Hot Espresso Shot", "Amaretti Crumbles"]
  },
  {
    id: "matcha",
    name: "Forest Matcha Latte",
    category: "specials",
    price: "$7.00",
    image: IMAGES.matchaLatte,
    description: "Uji ceremonial matcha hand-whisked and finished with textured almond milk.",
    ingredients: ["Ceremonial Matcha", "Almond Milk", "Organic Honey"]
  }
];

export default function Menu() {
  const filteredItems = MENU_ITEMS;

  // 3D Card Hover Tilt Calculations (Optimized to use event targets dynamically)
  const handleMouseMove = (e) => {
    const cardEl = e.currentTarget;
    const rect = cardEl.getBoundingClientRect();
    const x = e.clientX - rect.left; // Mouse x position within element
    const y = e.clientY - rect.top;  // Mouse y position within element
    const width = rect.width;
    const height = rect.height;

    // Calculate rotation (-10 to 10 degrees)
    const rotateY = ((x - width / 2) / (width / 2)) * 10;
    const rotateX = -((y - height / 2) / (height / 2)) * 10;

    // Direct GPU transition
    cardEl.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
    
    // Animate glow effect inside card
    const glowEl = cardEl.querySelector(".card-glow");
    if (glowEl) {
      glowEl.style.opacity = "1";
      glowEl.style.transform = `translate3d(${x - 75}px, ${y - 75}px, 0)`;
    }
  };

  const handleMouseLeave = (e) => {
    const cardEl = e.currentTarget;
    cardEl.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    
    const glowEl = cardEl.querySelector(".card-glow");
    if (glowEl) {
      glowEl.style.opacity = "0";
    }
  };

  return (
    <section id="menu" style={{
      padding: "100px 5vw",
      backgroundColor: "var(--color-bg-ivory)",
      position: "relative",
      zIndex: 15
    }}>
      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: "60px" }}>
        <p style={{
          fontFamily: "var(--font-sans)",
          fontSize: "0.85rem",
          letterSpacing: "0.4em",
          textTransform: "uppercase",
          color: "var(--color-olive)",
          marginBottom: "15px",
          fontWeight: 600
        }}>
          Curated Roastery Menu
        </p>
        <h2 style={{
          fontSize: "clamp(2.5rem, 4vw, 4rem)",
          fontFamily: "var(--font-serif)",
          color: "var(--color-forest)"
        }}>
          Signature Coffee Craft
        </h2>
        <div style={{
          width: "80px",
          height: "2px",
          backgroundColor: "var(--color-gold)",
          margin: "25px auto 0"
        }} />
      </div>



      {/* Menu Grid */}
      <motion.div 
        layout 
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "40px",
          maxWidth: "1200px",
          margin: "0 auto"
        }}
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10, transition: { duration: 0.25 } }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                borderRadius: "24px",
                overflow: "hidden",
                transformStyle: "preserve-3d",
                cursor: "pointer",
                position: "relative"
              }}
              className="glass-panel"
            >
                {/* Radial cursor-hover glow */}
                <div 
                  className="card-glow" 
                  style={{
                    position: "absolute",
                    width: "150px",
                    height: "150px",
                    background: "radial-gradient(circle, rgba(197, 164, 126, 0.14) 0%, rgba(197, 164, 126, 0) 70%)",
                    borderRadius: "50%",
                    pointerEvents: "none",
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                    zIndex: 2,
                    left: 0,
                    top: 0
                  }}
                />

                {/* Product Image */}
                <div style={{
                  height: "230px",
                  width: "100%",
                  overflow: "hidden",
                  position: "relative"
                }}>
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.8s var(--transition-smooth)"
                    }}
                    onMouseEnter={(e) => e.target.style.transform = "scale(1.08)"}
                    onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                  />
                  
                  {/* Floating Price Tag */}
                  <div style={{
                    position: "absolute",
                    top: "20px",
                    right: "20px",
                    padding: "6px 14px",
                    borderRadius: "15px",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "var(--color-forest)",
                    zIndex: 3,
                    backgroundColor: "rgba(253, 252, 247, 0.85)",
                    border: "1px solid rgba(197, 164, 126, 0.3)"
                  }}>
                    {item.price}
                  </div>
                </div>

                {/* Content Block */}
                <div style={{ padding: "30px", transform: "translateZ(30px)" }}>
                  <h3 style={{
                    fontSize: "1.4rem",
                    marginBottom: "12px",
                    fontFamily: "var(--font-serif)",
                    color: "var(--color-forest)"
                  }}>
                    {item.name}
                  </h3>
                  <p style={{
                    fontSize: "0.88rem",
                    lineHeight: "1.6",
                    color: "var(--color-charcoal-muted)",
                    marginBottom: "25px",
                    minHeight: "4.8em"
                  }}>
                    {item.description}
                  </p>

                  {/* Ingredients Tags */}
                  <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                    borderTop: "1px solid rgba(197, 164, 126, 0.15)",
                    paddingTop: "20px"
                  }}>
                    {item.ingredients.map((ing, i) => (
                      <span 
                        key={i} 
                        style={{
                          fontSize: "0.7rem",
                          padding: "4px 10px",
                          borderRadius: "10px",
                          backgroundColor: "rgba(62, 78, 61, 0.03)",
                          border: "1px solid rgba(197, 164, 126, 0.25)",
                          color: "var(--color-olive)",
                          letterSpacing: "0.05em"
                        }}
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
