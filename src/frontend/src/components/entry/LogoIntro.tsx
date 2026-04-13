import gsap from "gsap";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useSound } from "../../hooks/useSound";
import { useAppStore } from "../../store/useAppStore";
import GlitchText from "../ui/GlitchText";

interface Props {
  onComplete: () => void;
}

type Stage = "logo" | "name" | "burst" | "out";

// Individual particle for burst effect
function BurstParticle({
  angle,
  distance,
  color,
  delay,
}: {
  angle: number;
  distance: number;
  color: string;
  delay: number;
}) {
  const x = Math.cos(angle) * distance;
  const y = Math.sin(angle) * distance;

  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: 4 + Math.random() * 6,
        height: 4 + Math.random() * 6,
        background: color,
        left: "50%",
        top: "50%",
        translateX: "-50%",
        translateY: "-50%",
        boxShadow: `0 0 8px ${color}`,
      }}
      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
      animate={{ x, y, opacity: 0, scale: 0 }}
      transition={{ duration: 1.2, delay, ease: [0.2, 0, 0.8, 1] }}
    />
  );
}

const BURST_COLORS = [
  "oklch(0.75 0.31 262)",
  "oklch(0.68 0.25 303)",
  "oklch(0.72 0.27 247)",
  "oklch(0.9 0.2 200)",
  "oklch(0.85 0.3 280)",
];

const BURST_PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  angle: (i / 30) * Math.PI * 2 + Math.random() * 0.3,
  distance: 80 + Math.random() * 160,
  color: BURST_COLORS[i % BURST_COLORS.length],
  delay: Math.random() * 0.15,
}));

// Light ray behind TR
function LightRay({ angle, delay }: { angle: number; delay: number }) {
  return (
    <motion.div
      className="absolute pointer-events-none origin-center"
      style={{
        left: "50%",
        top: "50%",
        width: 1,
        height: "45vh",
        background:
          "linear-gradient(to bottom, oklch(0.75 0.31 262 / 0.2), transparent)",
        rotate: angle,
        transformOrigin: "top center",
        marginLeft: "-0.5px",
        marginTop: 0,
      }}
      initial={{ scaleY: 0, opacity: 0 }}
      animate={{ scaleY: 1, opacity: 1 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
    />
  );
}

const RAYS = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  angle: i * 45,
  delay: i * 0.06,
}));

export default function LogoIntro({ onComplete }: Props) {
  const { play, playGlitch } = useSound();
  const { soundEnabled } = useAppStore();
  const [stage, setStage] = useState<Stage>("logo");
  const logoRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Stage 1: TR logo appears (0–1.5s)
    if (soundEnabled) play("impact");

    // Animate TR logo via GSAP for precise control
    if (logoRef.current) {
      gsap.fromTo(
        logoRef.current,
        { scale: 0.4, opacity: 0, rotation: -3 },
        {
          scale: 1,
          opacity: 1,
          rotation: 2,
          duration: 0.8,
          ease: "power3.out",
          onComplete: () => {
            if (logoRef.current) {
              gsap.to(logoRef.current, {
                rotation: 0,
                duration: 0.4,
                ease: "power1.inOut",
              });
            }
          },
        },
      );
    }

    // Stage 2: TR shrinks, name appears (1.5–3.5s)
    const t1 = setTimeout(() => {
      setStage("name");
      if (soundEnabled) playGlitch();
    }, 1500);

    // Stage 3: Burst (3.5–4.5s)
    const t2 = setTimeout(() => {
      setStage("burst");
    }, 3400);

    // Stage 4: Fade out (4.5–5.5s)
    const t3 = setTimeout(() => {
      setStage("out");
      if (sceneRef.current) {
        gsap.to(sceneRef.current, {
          opacity: 0,
          duration: 0.7,
          ease: "power2.inOut",
        });
      }
    }, 4400);

    // Complete
    const t4 = setTimeout(onComplete, 5200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete, play, playGlitch, soundEnabled]);

  const showRays = stage === "name" || stage === "burst" || stage === "out";
  const showBurst = stage === "burst" || stage === "out";

  return (
    <motion.div
      ref={sceneRef}
      className="fixed inset-0 flex items-center justify-center overflow-hidden"
      style={{ zIndex: 9997, background: "oklch(0.04 0 0)" }}
      data-ocid="logo-intro"
    >
      {/* Radial deep-space background */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 70% 70% at 50% 50%, oklch(0.12 0.04 262 / 0.4) 0%, transparent 70%)",
        }}
      />

      {/* Light rays */}
      <AnimatePresence>
        {showRays &&
          RAYS.map((r) => (
            <LightRay key={`ray-${r.id}`} angle={r.angle} delay={r.delay} />
          ))}
      </AnimatePresence>

      {/* White radial burst */}
      <AnimatePresence>
        {showBurst && (
          <motion.div
            key="white-burst"
            className="absolute pointer-events-none"
            aria-hidden="true"
            style={{
              width: "100vw",
              height: "100vh",
              background:
                "radial-gradient(ellipse 30% 30% at 50% 50%, oklch(0.98 0 0 / 0.15) 0%, transparent 70%)",
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 2, 3] }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      {/* Burst particles */}
      <AnimatePresence>
        {showBurst && (
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
          >
            {BURST_PARTICLES.map((p) => (
              <BurstParticle key={`bp-${p.id}`} {...p} />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center">
        <AnimatePresence mode="wait">
          {stage === "logo" && (
            <motion.div
              key="tr-logo"
              ref={logoRef}
              exit={{ scale: 0.5, opacity: 0, filter: "blur(8px)" }}
              transition={{ duration: 0.4, ease: "easeIn" }}
              className="font-display font-black leading-none select-none"
              style={{
                fontSize: "clamp(8rem, 20vw, 14rem)",
                color: "oklch(0.75 0.31 262)",
                textShadow: [
                  "0 0 20px oklch(0.75 0.31 262 / 0.8)",
                  "0 0 60px oklch(0.75 0.31 262 / 0.5)",
                  "0 0 120px oklch(0.75 0.31 262 / 0.25)",
                  "0 0 200px oklch(0.75 0.31 262 / 0.1)",
                ].join(", "),
              }}
            >
              TR
            </motion.div>
          )}

          {(stage === "name" || stage === "burst" || stage === "out") && (
            <motion.div
              key="name-block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex flex-col items-center gap-5 text-center px-4"
            >
              {/* Small TR above name */}
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="font-display font-black text-glow-cyan"
                style={{
                  fontSize: "clamp(2rem, 5vw, 3.5rem)",
                  letterSpacing: "0.3em",
                }}
              >
                TR
              </motion.div>

              {/* Glitch-reveal name */}
              <div style={{ fontSize: "clamp(2rem, 6vw, 5rem)" }}>
                <GlitchText
                  text="TAHSINULLAH RIYAD"
                  className="font-display font-black leading-none tracking-tighter text-glow-cyan"
                  triggerOnMount
                  delay={80}
                  tag="h1"
                />
              </div>

              {/* Divider line */}
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.7 }}
                className="h-px w-full max-w-sm"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, oklch(0.75 0.31 262 / 0.8), transparent)",
                  boxShadow: "0 0 8px oklch(0.75 0.31 262 / 0.8)",
                }}
              />

              {/* Title */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="font-mono text-xs tracking-[0.45em] uppercase"
                style={{ color: "oklch(0.5 0 0)" }}
              >
                Creative Web Developer
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
