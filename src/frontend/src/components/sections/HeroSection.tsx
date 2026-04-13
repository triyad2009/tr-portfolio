import { useGSAP } from "@gsap/react";
import { Canvas, useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useSound } from "../../hooks/useSound";
import { useAppStore } from "../../store/useAppStore";
import MagneticButton from "../ui/MagneticButton";

// ─── Profile photo ─────────────────────────────────────────────────────────────
const PROFILE_PHOTO_URL =
  "https://i.postimg.cc/j2TkqS1P/IMG-20260217-124734020.jpg";

// ─── Typewriter words ──────────────────────────────────────────────────────────
const TYPEWRITER_WORDS = [
  "I Build Immersive Experiences",
  "I Craft Digital Worlds",
  "I Engineer 3D Web Magic",
];

// ─── Profile Photo Component ───────────────────────────────────────────────────
function ProfilePhoto() {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.75, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
      className="relative flex-shrink-0 mx-auto lg:mx-0"
      style={{ width: 100, height: 100 }}
    >
      {/* Outer glow ring — animated pulse */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        animate={{
          boxShadow: [
            "0 0 12px 2px oklch(0.75 0.31 262 / 0.4), 0 0 28px 4px oklch(0.75 0.31 262 / 0.15)",
            "0 0 22px 5px oklch(0.75 0.31 262 / 0.65), 0 0 44px 10px oklch(0.75 0.31 262 / 0.2)",
            "0 0 12px 2px oklch(0.75 0.31 262 / 0.4), 0 0 28px 4px oklch(0.75 0.31 262 / 0.15)",
          ],
        }}
        transition={{
          duration: 2.4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{ borderRadius: "50%" }}
      />

      {/* Rotating dashed ring */}
      <motion.div
        className="absolute -inset-2 rounded-full pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
        style={{
          border: "1px dashed oklch(0.75 0.31 262 / 0.35)",
          borderRadius: "50%",
        }}
      />

      {/* Cyan solid border ring */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none z-10"
        style={{
          border: "2px solid oklch(0.75 0.31 262 / 0.7)",
          borderRadius: "50%",
        }}
      />

      {/* Photo or fallback */}
      {!error ? (
        <img
          src={PROFILE_PHOTO_URL}
          alt="Tahsinullah Riyad"
          className="w-full h-full rounded-full"
          style={{
            objectFit: "cover",
            objectPosition: "center top",
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.5s ease",
          }}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      ) : (
        /* TR Monogram fallback */
        <div
          className="w-full h-full rounded-full flex items-center justify-center font-display font-black text-2xl"
          style={{
            background: "oklch(0.12 0.04 262)",
            color: "oklch(0.75 0.31 262)",
            border: "2px solid oklch(0.75 0.31 262 / 0.5)",
          }}
        >
          TR
        </div>
      )}

      {/* Skeleton while loading */}
      {!loaded && !error && (
        <div
          className="absolute inset-0 rounded-full animate-pulse"
          style={{ background: "oklch(0.15 0.03 262 / 0.8)" }}
        />
      )}
    </motion.div>
  );
}

// ─── 3D Floating Object ────────────────────────────────────────────────────────
function FloatingObject({
  mousePos,
}: {
  mousePos: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const targetRot = useRef({ x: 0, y: 0 });

  useFrame(({ clock }) => {
    if (!meshRef.current || !innerRef.current) return;

    const t = clock.getElapsedTime();
    const mx = mousePos.current.x;
    const my = mousePos.current.y;

    // Lerp toward mouse-derived rotation
    targetRot.current.x = my * 0.5;
    targetRot.current.y = t * 0.4 + mx * 0.6;

    meshRef.current.rotation.x +=
      (targetRot.current.x - meshRef.current.rotation.x) * 0.05;
    meshRef.current.rotation.y +=
      (targetRot.current.y - meshRef.current.rotation.y) * 0.05;

    // Inner wireframe counter-rotates slightly
    innerRef.current.rotation.x = -meshRef.current.rotation.x * 0.3;
    innerRef.current.rotation.y = meshRef.current.rotation.y * 1.1;

    // Gentle float
    meshRef.current.position.y = Math.sin(t * 0.8) * 0.12;
  });

  return (
    <group>
      {/* Outer TorusKnot — metallic holographic */}
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[1.1, 0.35, 128, 16]} />
        <meshPhongMaterial
          color={new THREE.Color("oklch(0.75 0.31 262)")}
          emissive={new THREE.Color("oklch(0.2 0.15 262)")}
          specular={new THREE.Color("oklch(0.9 0.2 200)")}
          shininess={120}
          wireframe={false}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Wireframe overlay — teal glow */}
      <mesh ref={innerRef}>
        <torusKnotGeometry args={[1.12, 0.36, 80, 8]} />
        <meshBasicMaterial
          color={new THREE.Color("oklch(0.85 0.25 200)")}
          wireframe
          transparent
          opacity={0.25}
        />
      </mesh>

      {/* Ambient + point lights */}
      <ambientLight intensity={0.08} />
      <pointLight
        position={[3, 3, 3]}
        color={new THREE.Color("oklch(0.75 0.31 262)")}
        intensity={12}
        distance={10}
      />
      <pointLight
        position={[-3, -3, 3]}
        color={new THREE.Color("oklch(0.68 0.25 303)")}
        intensity={8}
        distance={10}
      />
      <pointLight
        position={[0, 0, 4]}
        color={new THREE.Color("oklch(0.85 0.2 200)")}
        intensity={4}
        distance={8}
      />
    </group>
  );
}

// ─── HeroSection ───────────────────────────────────────────────────────────────
export default function HeroSection() {
  const { play } = useSound();
  const soundEnabled = useAppStore((s) => s.soundEnabled);

  // Refs for GSAP
  const labelRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Typewriter state
  const [wordIndex, setWordIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  // Mouse position for 3D (normalized -1 to 1)
  const mousePos = useRef({ x: 0, y: 0 });
  const isMobile = useRef(
    typeof window !== "undefined" && window.innerWidth < 768,
  );

  // Play whoosh on mount
  useEffect(() => {
    if (soundEnabled) {
      setTimeout(() => play("whoosh"), 400);
    }
  }, [soundEnabled, play]);

  // Typewriter cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setWordIndex((i) => (i + 1) % TYPEWRITER_WORDS.length);
        setVisible(true);
      }, 400);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Mouse tracking (desktop only)
  useEffect(() => {
    if (isMobile.current) return;
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePos.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // GSAP entrance timeline — label + name stagger at 0.8s to give photo time to land
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (labelRef.current) {
      tl.from(labelRef.current, { opacity: 0, y: 20, duration: 0.6 }, 0.8);
    }

    if (nameRef.current) {
      const letters = nameRef.current.querySelectorAll(".letter");
      tl.from(
        letters,
        { opacity: 0, y: 40, stagger: 0.04, duration: 0.5 },
        1.1,
      );
    }

    if (subtitleRef.current) {
      tl.from(subtitleRef.current, { opacity: 0, y: 20, duration: 0.6 }, 1.8);
    }

    if (buttonsRef.current) {
      tl.from(
        buttonsRef.current,
        { opacity: 0, scale: 0.85, duration: 0.5 },
        2.4,
      );
    }

    if (scrollRef.current) {
      tl.from(scrollRef.current, { opacity: 0, duration: 0.5 }, 2.8);
    }
  }, []);

  // Split name into letter spans with unique keys
  const nameLetters = "TAHSINULLAH RIYAD".split("").map((char, i) => {
    const key = `letter-${char === " " ? "space" : char}-${i}`;
    return (
      <span
        key={key}
        className={`letter inline-block ${char === " " ? "mr-[0.2em]" : ""}`}
        style={{ display: char === " " ? "inline" : "inline-block" }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    );
  });

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden pt-16"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.06 0 0) 0%, oklch(0.08 0.025 275) 50%, oklch(0.06 0 0) 100%)",
      }}
    >
      {/* Top gradient bleed */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.75 0.31 262 / 0.06) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 50%, oklch(0.68 0.25 303 / 0.04) 0%, transparent 50%)",
        }}
      />

      {/* Grid lines */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.75 0.31 262 / 0.5) 1px, transparent 1px), linear-gradient(90deg, oklch(0.75 0.31 262 / 0.5) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Main layout */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-12 lg:gap-0 py-12 lg:py-0 min-h-screen">
        {/* LEFT — Text content */}
        <div className="flex-1 lg:w-[55%] flex flex-col gap-6 text-center lg:text-left items-center lg:items-start">
          {/* Profile photo — cinematic reveal as intro anchor */}
          <ProfilePhoto />

          {/* Label */}
          <div ref={labelRef} className="opacity-0">
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-glow-cyan">
              {"< CREATIVE WEB DEVELOPER />"}
            </span>
          </div>

          {/* Name */}
          <h1
            ref={nameRef}
            className="font-display font-black leading-[0.9] tracking-tighter"
            style={{ fontSize: "clamp(2.8rem, 6vw, 6.5rem)" }}
          >
            {nameLetters}
          </h1>

          {/* Subtitle + Typewriter */}
          <div ref={subtitleRef} className="opacity-0 flex flex-col gap-3">
            <p
              className="font-display font-bold text-gradient-cyber"
              style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.8rem)" }}
            >
              Creative Web Developer
            </p>

            {/* Typewriter */}
            <div
              className="h-8 flex items-center justify-center lg:justify-start"
              aria-live="polite"
            >
              <AnimatePresence mode="wait">
                {visible && (
                  <motion.span
                    key={`word-${wordIndex}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35 }}
                    className="font-mono text-sm text-muted-foreground tracking-widest"
                  >
                    {TYPEWRITER_WORDS[wordIndex]}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* CTA Buttons */}
          <div
            ref={buttonsRef}
            className="opacity-0 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-2"
          >
            <MagneticButton strength={0.35}>
              <button
                type="button"
                onClick={() => {
                  play("click");
                  document
                    .getElementById("projects")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                onMouseEnter={() => play("hover")}
                className="group relative flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary/10 border border-primary/40 text-primary font-display text-sm tracking-widest uppercase font-bold hover:bg-primary/20 hover:border-primary/80 hover:glow-cyan transition-all duration-300 overflow-hidden min-h-[52px]"
                data-ocid="hero-view-work"
              >
                <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-0 bg-primary/10 transition-transform duration-300" />
                <span className="relative">View My Work</span>
                <span className="relative text-xs opacity-70">→</span>
              </button>
            </MagneticButton>

            <MagneticButton strength={0.35}>
              <button
                type="button"
                onClick={() => {
                  play("click");
                  document
                    .getElementById("contact")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                onMouseEnter={() => play("hover")}
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl glassmorphic border border-secondary/30 text-secondary font-display text-sm tracking-widest uppercase font-bold hover:border-secondary/70 hover:glow-purple transition-all duration-300 min-h-[52px]"
                data-ocid="hero-contact-me"
              >
                Contact Me
              </button>
            </MagneticButton>
          </div>
        </div>

        {/* RIGHT — 3D Canvas */}
        <div
          className="relative w-full lg:w-[45%] h-[40vw] lg:h-[90vh] max-h-[600px] min-h-[280px] flex-shrink-0"
          data-ocid="hero-3d-canvas"
        >
          {/* Glow halo behind canvas */}
          <div
            className="absolute inset-[15%] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, oklch(0.75 0.31 262 / 0.12) 0%, oklch(0.68 0.25 303 / 0.06) 50%, transparent 70%)",
              filter: "blur(30px)",
            }}
          />

          <Canvas
            camera={{ position: [0, 0, 4.5], fov: 60 }}
            gl={{ alpha: true, antialias: true }}
            style={{ background: "transparent" }}
          >
            <FloatingObject mousePos={mousePos} />
          </Canvas>

          {/* Corner decorations */}
          <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-primary/40 pointer-events-none" />
          <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-primary/40 pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-primary/40 pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-primary/40 pointer-events-none" />

          {/* Scan line animation */}
          <motion.div
            className="absolute left-0 right-0 h-px pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, transparent, oklch(0.75 0.31 262 / 0.4), transparent)",
            }}
            animate={{ top: ["10%", "90%", "10%"] }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0"
        data-ocid="hero-scroll-indicator"
      >
        <span className="font-mono text-xs text-muted-foreground tracking-[0.3em] uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{
            duration: 1.4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="flex flex-col items-center gap-1"
        >
          <div className="w-px h-6 bg-gradient-to-b from-primary/70 to-transparent" />
          <div
            className="w-1.5 h-1.5 rounded-full bg-primary/60"
            style={{ boxShadow: "0 0 6px oklch(0.75 0.31 262 / 0.8)" }}
          />
        </motion.div>
      </div>
    </section>
  );
}
