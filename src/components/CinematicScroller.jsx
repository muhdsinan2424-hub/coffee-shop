import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { IMAGES } from "../assets/images";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

export default function CinematicScroller() {
  const containerRef = useRef(null);
  const stickyRef = useRef(null);
  const canvasRef = useRef(null);
  const threeCanvasRef = useRef(null);

  // WebGL 3D Animation proxy values for GSAP ScrollTrigger
  const threeAnimationRef = useRef({
    cameraZ: 8,
    leftCupX: 0,
    leftCupZ: 0,
    leftCupOpacity: 0, // Beans opacity
    rightCupX: 0,
    rightCupZ: 0,
    rightCupOpacity: 0, // Splash scale
    centerCupX: 0,
    centerCupY: 0,
    centerCupZ: 0,
    centerCupRotateX: 0,
    centerCupRotateY: 0,
    centerCupScale: 1
  });

  // Steam particle animation on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let particles = [];
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    class Particle {
      constructor() {
        this.reset();
        // Randomize initial heights to spread them out
        this.y = Math.random() * canvas.height;
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 100;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = -(Math.random() * 0.8 + 0.4);
        this.alpha = Math.random() * 0.15 + 0.05;
        this.size = Math.random() * 60 + 40;
        this.life = Math.random() * 300 + 200;
        this.maxLife = this.life;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;

        // Fade out as it ages or reaches top
        const lifeRatio = this.life / this.maxLife;
        this.alpha = lifeRatio * 0.12;

        if (this.life <= 0 || this.y < -this.size) {
          this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        const grad = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size
        );
        grad.addColorStop(0, `rgba(197, 164, 126, ${this.alpha})`);
        grad.addColorStop(1, "rgba(197, 164, 126, 0)");
        ctx.fillStyle = grad;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Initialize particles
    for (let i = 0; i < 25; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // WebGL Three.js coffee cups rendering
  useEffect(() => {
    const canvas = threeCanvasRef.current;
    if (!canvas) return;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 8);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    // Warm Directional Sunlight
    const sunLight = new THREE.DirectionalLight(0xffecd2, 2.0);
    sunLight.position.set(6, 8, 4);
    sunLight.castShadow = true;
    scene.add(sunLight);

    // Volumetric Spotlight ray representation
    const spotLight = new THREE.SpotLight(0xffdfb3, 5.0, 15, Math.PI * 0.18, 0.5, 1);
    spotLight.position.set(-4, 5, 3);
    spotLight.castShadow = true;
    scene.add(spotLight);

    // Latte art texture canvas generator
    const createLatteArtTexture = () => {
      const artCanvas = document.createElement("canvas");
      artCanvas.width = 256;
      artCanvas.height = 256;
      const ctx = artCanvas.getContext("2d");

      // Dark espresso crema base
      ctx.fillStyle = "#3c2012";
      ctx.fillRect(0, 0, 256, 256);

      // Creamy white microfoam pours
      ctx.fillStyle = "#ebd5c1";
      ctx.strokeStyle = "#ebd5c1";
      ctx.lineWidth = 14;

      // Concentric circles representing latte crema rings
      ctx.beginPath();
      ctx.arc(128, 128, 64, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(128, 128, 38, 0, Math.PI * 2);
      ctx.stroke();

      // Swirled leaf patterns
      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
        const xOffset = Math.cos(angle) * 50 + 128;
        const yOffset = Math.sin(angle) * 50 + 128;
        ctx.beginPath();
        ctx.arc(xOffset, yOffset, 14, 0, Math.PI * 2);
        ctx.fill();
      }

      // Center heart shape
      ctx.beginPath();
      ctx.arc(128, 128, 18, 0, Math.PI * 2);
      ctx.fill();

      return new THREE.CanvasTexture(artCanvas);
    };

    // Cup assembly factory
    const build3DCup = (colorHex) => {
      const cupGroup = new THREE.Group();

      // Saucer (Plate)
      const saucerGeo = new THREE.CylinderGeometry(1.6, 1.1, 0.08, 32);
      const saucerMat = new THREE.MeshPhysicalMaterial({
        color: colorHex,
        roughness: 0.08,
        clearcoat: 1.0,
        clearcoatRoughness: 0.04
      });
      const saucer = new THREE.Mesh(saucerGeo, saucerMat);
      saucer.position.y = -0.7;
      saucer.receiveShadow = true;
      cupGroup.add(saucer);

      // Cup Body
      const cupGeo = new THREE.CylinderGeometry(1.1, 0.8, 1.1, 32, 1, false);
      const cupMat = new THREE.MeshPhysicalMaterial({
        color: colorHex,
        roughness: 0.08,
        clearcoat: 1.0,
        clearcoatRoughness: 0.04
      });
      const cupBody = new THREE.Mesh(cupGeo, cupMat);
      cupBody.castShadow = true;
      cupBody.receiveShadow = true;
      cupGroup.add(cupBody);

      // Coffee Liquid inside
      const liquidGeo = new THREE.CylinderGeometry(1.04, 1.04, 0.1, 32);
      const liquidMat = new THREE.MeshStandardMaterial({
        map: createLatteArtTexture(),
        roughness: 0.15
      });
      const liquid = new THREE.Mesh(liquidGeo, liquidMat);
      liquid.position.y = 0.46;
      cupGroup.add(liquid);

      // Handle
      const handleGeo = new THREE.TorusGeometry(0.35, 0.09, 16, 32, Math.PI * 1.3);
      const handle = new THREE.Mesh(handleGeo, cupMat);
      handle.position.set(1.05, 0, 0);
      handle.rotation.z = -Math.PI * 0.15;
      handle.castShadow = true;
      cupGroup.add(handle);

      return cupGroup;
    };

    // 1. Center Cup (Hero Product)
    const centerCup = build3DCup(0xfffef9); // Pure white ceramic glaze
    scene.add(centerCup);

    // 2. Coffee Beans (12 floating beans orbiting)
    const beansGroup = new THREE.Group();
    const beanGeo = new THREE.DodecahedronGeometry(0.2, 1);
    beanGeo.scale(1.8, 1.1, 1.0); // Squashed bean shape
    const beanMat = new THREE.MeshStandardMaterial({
      color: 0x3d2012, // Rich dark coffee color
      roughness: 0.6,
      metalness: 0.1
    });

    const beansCount = 12;
    const beans = [];
    for (let i = 0; i < beansCount; i++) {
      const beanMesh = new THREE.Mesh(beanGeo, beanMat);
      
      // Arrange in a circular ring orbit around the cup
      const angle = (i / beansCount) * Math.PI * 2;
      const radius = 2.4 + Math.random() * 0.6;
      beanMesh.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 1.5,
        Math.sin(angle) * radius
      );
      beanMesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      
      // Save initial orbit details for render calculation
      beanMesh.userData = {
        angle,
        radius,
        speed: 0.008 + Math.random() * 0.006,
        floatOffset: Math.random() * Math.PI * 2,
        floatSpeed: 0.01 + Math.random() * 0.01
      };
      
      beansGroup.add(beanMesh);
      beans.push(beanMesh);
    }
    // Initially hide the beans (opacity handled inside timeline proxy)
    beansGroup.visible = false;
    scene.add(beansGroup);

    // 3. Floating coffee powder / gold dust particles
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const speeds = [];

    for (let i = 0; i < particleCount * 3; i += 3) {
      // Scatter in a cylinder/sphere around the cup
      const radius = Math.random() * 5 + 0.5;
      const theta = Math.random() * Math.PI * 2;
      positions[i] = Math.cos(theta) * radius;
      positions[i+1] = (Math.random() - 0.5) * 6;
      positions[i+2] = Math.sin(theta) * radius;
      
      speeds.push({
        y: 0.004 + Math.random() * 0.006,
        theta: (Math.random() - 0.5) * 0.005
      });
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xc5a47e, // Warm Gold/Copper particles
      size: 0.05,
      transparent: true,
      opacity: 0.6
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 4. Coffee Splash Mesh Crown (Procedural wavy ring representing splash)
    const splashGroup = new THREE.Group();
    
    // Create liquid splash using lathe curve points
    const splashPoints = [];
    for (let i = 0; i < 10; i++) {
      splashPoints.push(new THREE.Vector2(
        Math.sin(i * 0.3) * 0.8 + 1.2, // Tapered profile
        (i - 5) * 0.12
      ));
    }
    const splashGeo = new THREE.LatheGeometry(splashPoints, 32);
    const splashMat = new THREE.MeshPhysicalMaterial({
      color: 0x2d170c, // Shiny dark coffee liquid
      roughness: 0.1,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05
    });
    const splashBase = new THREE.Mesh(splashGeo, splashMat);
    splashBase.rotation.x = Math.PI;
    splashBase.position.y = -0.55;
    splashGroup.add(splashBase);
    
    // Add small splash crown droplets
    const dropletGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const droplets = [];
    for (let i = 0; i < 8; i++) {
      const droplet = new THREE.Mesh(dropletGeo, splashMat);
      const angle = (i / 8) * Math.PI * 2;
      droplet.position.set(
        Math.cos(angle) * 1.5,
        -0.3,
        Math.sin(angle) * 1.5
      );
      droplet.userData = {
        baseY: -0.3,
        speed: 0.04,
        angleOffset: i * 0.5
      };
      splashGroup.add(droplet);
      droplets.push(droplet);
    }
    
    splashGroup.scale.set(0.001, 0.001, 0.001); // Start hidden/scaled down
    splashGroup.visible = false;
    scene.add(splashGroup);

    // Resize handler
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    // Animation render loop
    let animationFrameId;
    let time = 0;

    const renderLoop = () => {
      time += 0.015;

      const anim = threeAnimationRef.current;
      camera.position.z = anim.cameraZ;

      // Update Center Cup base floating & scroll rotation/scale
      centerCup.position.x = anim.centerCupX;
      centerCup.position.y = anim.centerCupY + Math.sin(time) * 0.12; // float offset
      centerCup.position.z = anim.centerCupZ;
      centerCup.rotation.x = anim.centerCupRotateX;
      centerCup.rotation.y = anim.centerCupRotateY + time * 0.15; // rotate y
      centerCup.scale.setScalar(anim.centerCupScale);

      // Handle coffee beans visibility & rotation
      if (anim.leftCupOpacity > 0.05) {
        beansGroup.visible = true;
        beans.forEach((bean) => {
          // Orbit calculations
          bean.userData.angle += bean.userData.speed;
          bean.position.x = Math.cos(bean.userData.angle) * bean.userData.radius;
          bean.position.z = Math.sin(bean.userData.angle) * bean.userData.radius;
          
          // Hover floating offset
          bean.userData.floatOffset += bean.userData.floatSpeed;
          bean.position.y = Math.sin(bean.userData.floatOffset) * 0.4;
          
          // Random spinning
          bean.rotation.x += 0.005;
          bean.rotation.y += 0.008;
          
          // Apply opacity fade-in
          bean.material.opacity = anim.leftCupOpacity * 0.85;
          bean.material.transparent = true;
        });
      } else {
        beansGroup.visible = false;
      }

      // Handle liquid splash visibility & scale
      if (anim.rightCupOpacity > 0.01) {
        splashGroup.visible = true;
        splashGroup.scale.setScalar(anim.rightCupOpacity);
        
        // Ripple droplets
        droplets.forEach((d) => {
          d.position.y = d.userData.baseY + Math.sin(time * 3 + d.userData.angleOffset) * 0.12;
        });
      } else {
        splashGroup.visible = false;
      }

      // Animate powder / gold dust particles drift
      const particlePos = particleGeo.attributes.position.array;
      for (let i = 0; i < particleCount * 3; i += 3) {
        // Drift upwards
        particlePos[i+1] += speeds[i/3].y;
        
        // Spin around Y axis
        const xVal = particlePos[i];
        const zVal = particlePos[i+2];
        const rad = Math.sqrt(xVal * xVal + zVal * zVal);
        let theta = Math.atan2(zVal, xVal);
        theta += speeds[i/3].theta;
        particlePos[i] = Math.cos(theta) * rad;
        particlePos[i+2] = Math.sin(theta) * rad;

        // Reset if drifted too high
        if (particlePos[i+1] > 3) {
          particlePos[i+1] = -3;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(renderLoop);
    };
    renderLoop();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
    };
  }, []);

  // Mouse-based depth parallax movement (isolated to active visible scene)
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const xVal = (clientX / window.innerWidth - 0.5) * 20; // -10px to 10px
      const yVal = (clientY / window.innerHeight - 0.5) * 20; // -10px to 10px
      
      const scenes = containerRef.current?.querySelectorAll(".scene");
      if (!scenes) return;
      
      let activeScene = null;
      let maxOpacity = -1;
      
      scenes.forEach(scene => {
        const opacity = parseFloat(window.getComputedStyle(scene).opacity || "0");
        if (opacity > maxOpacity) {
          maxOpacity = opacity;
          activeScene = scene;
        }
      });
      
      if (activeScene && maxOpacity > 0.1) {
        const bgImg = activeScene.querySelector(".bg-img");
        const textBlock = activeScene.querySelector(".text-block");
        
        if (bgImg) {
          gsap.to(bgImg, {
            x: xVal * 0.7,
            y: yVal * 0.7,
            duration: 1.2,
            ease: "power2.out"
          });
        }
        
        if (textBlock) {
          gsap.to(textBlock, {
            x: -xVal * 0.5,
            y: -yVal * 0.5,
            duration: 1.2,
            ease: "power2.out"
          });
        }
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useGSAP(() => {
    const scroller = containerRef.current;
    
    // Master timeline bound to scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scroller,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
        pin: true,
        invalidateOnRefresh: true,
      }
    });

    // 0. Base animation proxy reference
    const anim = threeAnimationRef.current;

    // STAGE 1 (Scroll 0% to 20%): Camera pushes forward & background zooms
    tl.to(anim, {
      cameraZ: 6.2,
      duration: 3,
      ease: "power2.inOut"
    }, 0)
    .to(".sec-exterior .bg-img", {
      scale: 1.12,
      duration: 3,
      ease: "power2.inOut"
    }, 0)
    // Fade out first intro text block
    .to(".sec-exterior h2", {
      opacity: 0,
      y: -50,
      filter: "blur(6px)",
      duration: 1.5,
      ease: "power2.inOut"
    }, 0.5)
    .to(".sec-exterior p", {
      opacity: 0,
      y: -30,
      filter: "blur(4px)",
      duration: 1.5,
      ease: "power2.inOut"
    }, 0.6)
    .to(".sec-exterior .hero-buttons, .sec-exterior .scroll-indicator", {
      opacity: 0,
      y: -20,
      filter: "blur(3px)",
      duration: 1.2,
      ease: "power2.inOut"
    }, 0.4)

    // STAGE 2 (Scroll 20% to 40%): Coffee beans orbit in, splash crown grows, cup enlarges
    .to(anim, {
      leftCupOpacity: 1.0, // Beans opacity
      rightCupOpacity: 1.0, // Splash scale
      centerCupScale: 1.25, // Cup enlarges
      cameraZ: 4.8,
      duration: 3.5,
      ease: "power2.inOut"
    }, 3)

    // STAGE 3 (Scroll 40% to 70%): Center cup rotates in 3D & moves down
    .to(anim, {
      centerCupRotateX: 1.0, // Tilt forward to show latte art crema
      centerCupRotateY: Math.PI * 0.9, // Smooth rotation
      centerCupY: -3.5, // Slide down
      leftCupOpacity: 0.2, // Fade out beans slightly
      rightCupOpacity: 0.2, // Fade out splash slightly
      cameraZ: 4.2,
      duration: 5,
      ease: "power1.inOut"
    }, 6.5)

    // STAGE 4 (Scroll 70% to 100%): Center cup leaves screen & doors split open
    .to(anim, {
      centerCupScale: 0.2,
      centerCupY: -6.0,
      leftCupOpacity: 0,
      rightCupOpacity: 0,
      duration: 3.5,
      ease: "power2.in"
    }, 11.5)
    .to(".door-left", {
      xPercent: -100,
      rotateY: -45,
      opacity: 0.1,
      duration: 2.5,
      ease: "power1.inOut"
    }, 11.5)
    .to(".door-right", {
      xPercent: 100,
      rotateY: 45,
      opacity: 0.1,
      duration: 2.5,
      ease: "power1.inOut"
    }, 11.5)
    .to(".sec-exterior", {
      opacity: 0,
      duration: 1.5,
      ease: "none"
    }, 13)

    // 3. Counter Scene: Fades in as doors open
    .fromTo(".sec-counter", {
      opacity: 0,
      scale: 1.15
    }, {
      opacity: 1,
      scale: 1.0,
      duration: 3,
      ease: "power2.out"
    }, 13)
    .fromTo(".sec-counter h2", {
      opacity: 0,
      y: 35,
      letterSpacing: "-0.01em",
      filter: "blur(6px)"
    }, {
      opacity: 1,
      y: 0,
      letterSpacing: "0.02em",
      filter: "blur(0px)",
      duration: 1.8,
      ease: "power3.out"
    }, 13.7)
    .fromTo(".sec-counter p", {
      opacity: 0,
      y: 20,
      filter: "blur(4px)"
    }, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 1.8,
      ease: "power2.out"
    }, 14.3)
    .to(".sec-counter .bg-img", {
      xPercent: -5,
      duration: 3,
      ease: "none"
    }, 14.5)
    .to(".sec-counter", {
      opacity: 0,
      scale: 0.94,
      duration: 2,
      ease: "power2.in"
    }, 17.5)

    // 4. Bean Display Scene
    .fromTo(".sec-beans", {
      opacity: 0,
      scale: 1.15
    }, {
      opacity: 1,
      scale: 1.0,
      duration: 3,
      ease: "power2.out"
    }, 18.5)
    .fromTo(".sec-beans h2", {
      opacity: 0,
      y: 35,
      letterSpacing: "-0.01em",
      filter: "blur(6px)"
    }, {
      opacity: 1,
      y: 0,
      letterSpacing: "0.02em",
      filter: "blur(0px)",
      duration: 1.8,
      ease: "power3.out"
    }, 19.2)
    .fromTo(".sec-beans p", {
      opacity: 0,
      y: 20,
      filter: "blur(4px)"
    }, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 1.8,
      ease: "power2.out"
    }, 19.8)
    .to(".sec-beans", {
      opacity: 0,
      scale: 0.94,
      duration: 2,
      ease: "power2.in"
    }, 22.5)

    // 5. Espresso Extraction Scene
    .fromTo(".sec-espresso", {
      opacity: 0,
      scale: 1.15
    }, {
      opacity: 1,
      scale: 1.0,
      duration: 3,
      ease: "power2.out"
    }, 23.5)
    .fromTo(".sec-espresso h2", {
      opacity: 0,
      y: 35,
      letterSpacing: "-0.01em",
      filter: "blur(6px)"
    }, {
      opacity: 1,
      y: 0,
      letterSpacing: "0.02em",
      filter: "blur(0px)",
      duration: 1.8,
      ease: "power3.out"
    }, 24.2)
    .fromTo(".sec-espresso p", {
      opacity: 0,
      y: 20,
      filter: "blur(4px)"
    }, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 1.8,
      ease: "power2.out"
    }, 24.8)
    .to(".sec-espresso", {
      opacity: 0,
      scale: 0.94,
      duration: 2,
      ease: "power2.in"
    }, 27.5)

    // 6. Latte Art Pour Scene
    .fromTo(".sec-latte", {
      opacity: 0,
      scale: 1.15
    }, {
      opacity: 1,
      scale: 1.0,
      duration: 3,
      ease: "power2.out"
    }, 28.5)
    .fromTo(".sec-latte h2", {
      opacity: 0,
      y: 35,
      letterSpacing: "-0.01em",
      filter: "blur(6px)"
    }, {
      opacity: 1,
      y: 0,
      letterSpacing: "0.02em",
      filter: "blur(0px)",
      duration: 1.8,
      ease: "power3.out"
    }, 29.2)
    .fromTo(".sec-latte p", {
      opacity: 0,
      y: 20,
      filter: "blur(4px)"
    }, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 1.8,
      ease: "power2.out"
    }, 29.8)
    .to(".sec-latte", {
      opacity: 0,
      yPercent: -15,
      duration: 3,
      ease: "power2.inOut"
    }, 32);

  }, { scope: containerRef });

  return (
    <div id="journey" ref={containerRef} style={{
      position: "relative",
      width: "100%",
      height: "450vh", // The scroll duration
      backgroundColor: "var(--color-bg-ivory)"
    }}>
      <div ref={stickyRef} style={{
        position: "sticky",
        top: 0,
        width: "100%",
        height: "100vh",
        overflow: "hidden"
      }}>
        
        {/* Steam overlay canvas */}
        <canvas ref={canvasRef} style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 10,
          pointerEvents: "none"
        }} />

        {/* --- SCENE 1: CAFE EXTERIOR --- */}
        <div className="scene sec-exterior" style={sceneStyle}>
          <div className="bg-img" style={{
            ...bgImageStyle,
            backgroundImage: `linear-gradient(to bottom, rgba(253, 252, 247, 0.15), rgba(253, 252, 247, 0.75)), url(${IMAGES.cafeExterior})`,
            filter: "blur(20px)"
          }} />
          
          {/* Three.js WebGL 3D Coffee Cups Canvas */}
          <canvas ref={threeCanvasRef} style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 4,
            pointerEvents: "none"
          }} />
          <div className="text-block" style={{ ...textBlockStyle, padding: "40px 60px" }}>
            <p style={{ letterSpacing: "0.4em", textTransform: "uppercase", fontSize: "0.85rem", color: "var(--color-gold)", fontWeight: 600, marginBottom: "8px" }}>Golden hour</p>
            <h2 style={{ fontSize: "clamp(3rem, 5.5vw, 5.5rem)", fontFamily: "var(--font-serif)", lineHeight: 1.1, margin: "10px 0 20px 0", color: "var(--color-forest)" }}>Artisan Alchemy</h2>
            <p style={{ fontSize: "1.05rem", maxWidth: "550px", color: "var(--color-charcoal-muted)", marginBottom: "30px", lineHeight: "1.6" }}>
              Experience single-origin coffee craft defined by architectural design and sensory sanctuary.
            </p>
            
            {/* CTA Buttons */}
            <div className="hero-buttons" style={{ display: "flex", gap: "16px", justifyContent: "center", marginBottom: "30px", width: "100%" }}>
              <button className="btn-shine-container" style={{
                padding: "14px 28px",
                borderRadius: "30px",
                backgroundColor: "var(--color-forest)",
                color: "var(--color-bg-ivory)",
                border: "none",
                fontWeight: 600,
                fontSize: "0.95rem",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 8px 20px rgba(62,78,61,0.15)"
              }}>
                Reserve Table
                <div className="btn-shine-overlay" />
              </button>
              <button style={{
                padding: "14px 28px",
                borderRadius: "30px",
                backgroundColor: "transparent",
                border: "1px solid rgba(197, 164, 126, 0.45)",
                color: "var(--color-forest)",
                fontSize: "0.95rem",
                fontWeight: 600,
                cursor: "pointer"
              }}>
                Explore Menu
              </button>
            </div>
            
            {/* Elegant Scroll Indicator */}
            <div className="scroll-indicator" style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "10px",
              marginTop: "10px"
            }}>
              <span style={{ fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--color-olive)" }}>
                Scroll to Explore
              </span>
              <div style={{
                width: "2px",
                height: "36px",
                backgroundColor: "rgba(197, 164, 126, 0.3)",
                position: "relative",
                overflow: "hidden",
                borderRadius: "1px"
              }}>
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "50%",
                  backgroundColor: "var(--color-gold)",
                  animation: "scrollLine 2s ease infinite"
                }} />
              </div>
            </div>
          </div>

          {/* 3D Glass Doors Overlay */}
          <div className="doors-wrapper" style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            perspective: "1200px",
            zIndex: 5,
            pointerEvents: "none"
          }}>
            {/* Left Door */}
            <div className="door-left" style={{
              flex: 1,
              height: "100%",
              borderRight: "2px solid rgba(197, 164, 126, 0.5)",
              background: "linear-gradient(90deg, rgba(253, 252, 247, 0.45) 0%, rgba(197, 164, 126, 0.05) 100%)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              paddingRight: "20px",
              transformOrigin: "left center"
            }}>
              {/* Brass Handle */}
              <div style={{
                width: "8px",
                height: "120px",
                backgroundColor: "var(--color-gold)",
                borderRadius: "4px",
                boxShadow: "0 0 10px rgba(197, 164, 126, 0.3)"
              }} />
            </div>
            {/* Right Door */}
            <div className="door-right" style={{
              flex: 1,
              height: "100%",
              borderLeft: "2px solid rgba(197, 164, 126, 0.5)",
              background: "linear-gradient(270deg, rgba(253, 252, 247, 0.45) 0%, rgba(197, 164, 126, 0.05) 100%)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              paddingLeft: "20px",
              transformOrigin: "right center"
            }}>
              {/* Brass Handle */}
              <div style={{
                width: "8px",
                height: "120px",
                backgroundColor: "var(--color-gold)",
                borderRadius: "4px",
                boxShadow: "0 0 10px rgba(197, 164, 126, 0.3)"
              }} />
            </div>
          </div>
        </div>

        {/* --- SCENE 2: COFFEE COUNTER --- */}
        <div className="scene sec-counter" style={{ ...sceneStyle, opacity: 0 }}>
          <div className="bg-img" style={{
            ...bgImageStyle,
            backgroundImage: `linear-gradient(to bottom, rgba(253, 252, 247, 0.35), rgba(253, 252, 247, 0.85)), url(${IMAGES.cafeCounter})`
          }} />
          <div className="text-block" style={textBlockStyle}>
            <p style={{ letterSpacing: "0.4em", textTransform: "uppercase", fontSize: "0.85rem", color: "var(--color-gold)", fontWeight: 600 }}>The Sanctuary</p>
            <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontFamily: "var(--font-serif)", lineHeight: 1.2, margin: "15px 0", color: "var(--color-forest)" }}>Step Inside</h2>
            <p style={{ fontSize: "1.05rem", maxWidth: "600px", color: "var(--color-charcoal-muted)" }}>A warm space detailed in Walnut wood, Calacatta marble, and brushed brass lighting.</p>
          </div>
        </div>

        {/* --- SCENE 3: BEAN DISPLAY --- */}
        <div className="scene sec-beans" style={{ ...sceneStyle, opacity: 0 }}>
          <div className="bg-img" style={{
            ...bgImageStyle,
            backgroundImage: `linear-gradient(to bottom, rgba(253, 252, 247, 0.35), rgba(253, 252, 247, 0.85)), url(${IMAGES.coffeeBeans})`
          }} />
          <div className="text-block" style={textBlockStyle}>
            <p style={{ letterSpacing: "0.4em", textTransform: "uppercase", fontSize: "0.85rem", color: "var(--color-gold)", fontWeight: 600 }}>The Origin</p>
            <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontFamily: "var(--font-serif)", lineHeight: 1.2, margin: "15px 0", color: "var(--color-forest)" }}>Single-Origin Craft</h2>
            <p style={{ fontSize: "1.05rem", maxWidth: "600px", color: "var(--color-charcoal-muted)" }}>Slow-roasted in-house to unleash unique tasting notes of stonefruit, dark chocolate, and floral jasmine.</p>
          </div>
        </div>

        {/* --- SCENE 4: ESPRESSO EXTRACTION --- */}
        <div className="scene sec-espresso" style={{ ...sceneStyle, opacity: 0 }}>
          <div className="bg-img" style={{
            ...bgImageStyle,
            backgroundImage: `linear-gradient(to bottom, rgba(253, 252, 247, 0.35), rgba(253, 252, 247, 0.85)), url(${IMAGES.espressoExtraction})`
          }} />
          <div className="text-block" style={textBlockStyle}>
            <p style={{ letterSpacing: "0.4em", textTransform: "uppercase", fontSize: "0.85rem", color: "var(--color-gold)", fontWeight: 600 }}>The Extraction</p>
            <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontFamily: "var(--font-serif)", lineHeight: 1.2, margin: "15px 0", color: "var(--color-forest)" }}>Liquid Alchemy</h2>
            <p style={{ fontSize: "1.05rem", maxWidth: "600px", color: "var(--color-charcoal-muted)" }}>9 bars of silent pressure extracting rich, dark nectar topped with a thick velvet golden crema.</p>
          </div>
        </div>

        {/* --- SCENE 5: LATTE ART POUR --- */}
        <div className="scene sec-latte" style={{ ...sceneStyle, opacity: 0 }}>
          <div className="bg-img" style={{
            ...bgImageStyle,
            backgroundImage: `linear-gradient(to bottom, rgba(253, 252, 247, 0.35), rgba(253, 252, 247, 0.85)), url(${IMAGES.latteArt})`
          }} />
          <div className="text-block" style={textBlockStyle}>
            <p style={{ letterSpacing: "0.4em", textTransform: "uppercase", fontSize: "0.85rem", color: "var(--color-gold)", fontWeight: 600 }}>The Signature</p>
            <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontFamily: "var(--font-serif)", lineHeight: 1.2, margin: "15px 0", color: "var(--color-forest)" }}>Final Presentation</h2>
            <p style={{ fontSize: "1.05rem", maxWidth: "600px", color: "var(--color-charcoal-muted)" }}>Silky microfoam poured freehand at exactly 65°C to create drinking artwork.</p>
          </div>
        </div>

      </div>
    </div>
  );
}

// Inline Styles for Performance (Avoiding extra CSS loading lag)
const sceneStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 10vw",
};

const bgImageStyle = {
  position: "absolute",
  top: "-4%",
  left: "-4%",
  width: "108%",
  height: "108%",
  backgroundSize: "cover",
  backgroundPosition: "center",
  zIndex: 1
};

const textBlockStyle = {
  position: "relative",
  zIndex: 2,
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "35px 50px",
  borderRadius: "24px",
  background: "linear-gradient(135deg, rgba(253, 252, 247, 0.88) 0%, rgba(245, 243, 236, 0.92) 50%, rgba(253, 252, 247, 0.88) 100%)",
  backgroundSize: "200% 200%",
  animation: "volumetricGlow 8s ease infinite",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(197, 164, 126, 0.25)",
  boxShadow: "0 15px 45px rgba(62, 78, 61, 0.08)",
  maxWidth: "600px",
  margin: "0 auto",
  transformStyle: "preserve-3d"
};
