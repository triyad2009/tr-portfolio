import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useSound } from "../../hooks/useSound";
import MagneticButton from "../ui/MagneticButton";

interface Props {
  onEnter: () => void;
}

// Floating particle
function FloatParticle({
  x,
  y,
  size,
  delay,
  color,
}: {
  x: number;
  y: number;
  size: number;
  delay: number;
  color: string;
}) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        background: color,
      }}
      animate={{
        opacity: [0, 0.8, 0.4, 0.8, 0],
        y: [0, -20, -10, -25, 0],
        x: [0, 5, -3, 8, 0],
      }}
      transition={{
        duration: 4 + Math.random() * 3,
        delay,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
    />
  );
}

const PARTICLE_COLORS = [
  "oklch(0.75 0.31 262 / 0.4)",
  "oklch(0.68 0.25 303 / 0.3)",
  "oklch(0.72 0.27 247 / 0.35)",
];

const PARTICLES = Array.from({ length: 35 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 1 + Math.random() * 3.5,
  delay: Math.random() * 4,
  color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
}));

export default function EnterScreen({ onEnter }: Props) {
  const { playCinematicEntry } = useSound();
  const [isExiting, setIsExiting] = useState(false);
  const flashRef = useRef<HTMLDivElement>(null);

  const handleEnter = () => {
    if (isExiting) return;
    playCinematicEntry();
    setIsExiting(true);

    // Flash effect
    if (flashRef.current) {
      flashRef.current.style.opacity = "1";
      setTimeout(() => {
        if (flashRef.current) flashRef.current.style.opacity = "0";
      }, 150);
    }

    setTimeout(onEnter, 600);
  };

  // Pulse the enter button glow
  useEffect(() => {
    // CSS handles the pulse via keyframe in index.css
  }, []);

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.08 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      style={{ zIndex: 9998, background: "oklch(0.06 0 0)" }}
      data-ocid="enter-screen"
    >
      {/* Animated gradient swirl */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        animate={{ rotate: [0, 360] }}
        transition={{
          duration: 30,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
        style={{
          background:
            "conic-gradient(from 0deg at 40% 60%, oklch(0.68 0.25 303 / 0.08) 0%, transparent 40%, oklch(0.75 0.31 262 / 0.06) 70%, transparent 100%)",
        }}
      />

      {/* Counter-rotating sweep */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        animate={{ rotate: [360, 0] }}
        transition={{
          duration: 22,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
        style={{
          background:
            "conic-gradient(from 180deg at 60% 40%, oklch(0.75 0.31 262 / 0.04) 0%, transparent 50%, oklch(0.68 0.25 303 / 0.05) 80%, transparent 100%)",
        }}
      />

      {/* Radial center glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, oklch(0.75 0.31 262 / 0.06) 0%, oklch(0.68 0.25 303 / 0.04) 40%, transparent 70%)",
        }}
      />

      {/* Particle field */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {PARTICLES.map((p) => (
          <FloatParticle key={`ep-${p.id}`} {...p} />
        ))}
      </div>

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.75 0.31 262) 1px, transparent 1px), linear-gradient(90deg, oklch(0.75 0.31 262) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Light burst overlay (flashes on click) */}
      <div
        ref={flashRef}
        className="absolute inset-0 pointer-events-none transition-opacity duration-150"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 50%, oklch(0.98 0 0 / 0.3) 0%, transparent 70%)",
          opacity: 0,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 text-center px-4">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="font-mono text-[10px] tracking-[0.5em] uppercase"
          style={{ color: "oklch(0.4 0 0)" }}
        >
          TR_CREATIVE.STUDIO v2.0
        </motion.div>

        {/* TR Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 0.6,
            duration: 0.7,
            ease: [0.34, 1.56, 0.64, 1],
          }}
          className="font-display font-black leading-none text-glow-cyan"
          style={{ fontSize: "clamp(4rem, 14vw, 10rem)" }}
        >
          TR
        </motion.div>

        {/* Name subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="font-body text-xs tracking-[0.3em] uppercase"
          style={{ color: "oklch(0.4 0 0)", marginTop: "-0.5rem" }}
        >
          TAHSINULLAH RIYAD · CREATIVE WEB DEVELOPER
        </motion.div>

        {/* Divider line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="h-px w-32"
          style={{
            background:
              "linear-gradient(90deg, transparent, oklch(0.75 0.31 262 / 0.6), transparent)",
          }}
        />

        {/* ENTER EXPERIENCE button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
        >
          <MagneticButton strength={0.45}>
            <motion.button
              type="button"
              onClick={handleEnter}
              disabled={isExiting}
              className="group relative flex items-center justify-center gap-4 px-12 py-5 rounded-xl font-display font-bold uppercase overflow-hidden min-h-[56px] min-w-[260px] transition-all duration-300"
              style={{
                background: "oklch(0.10 0.02 262 / 0.2)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid oklch(0.75 0.31 262 / 0.4)",
                color: "oklch(0.75 0.31 262)",
                letterSpacing: "0.25em",
                fontSize: "0.75rem",
              }}
              whileHover={{
                scale: 1.04,
                boxShadow:
                  "0 0 30px oklch(0.75 0.31 262 / 0.5), 0 0 60px oklch(0.75 0.31 262 / 0.25)",
                borderColor: "oklch(0.75 0.31 262 / 0.9)",
              }}
              whileTap={{ scale: 0.97 }}
              animate={{
                boxShadow: [
                  "0 0 12px oklch(0.75 0.31 262 / 0.2), 0 0 24px oklch(0.75 0.31 262 / 0.1)",
                  "0 0 24px oklch(0.75 0.31 262 / 0.4), 0 0 48px oklch(0.75 0.31 262 / 0.2)",
                  "0 0 12px oklch(0.75 0.31 262 / 0.2), 0 0 24px oklch(0.75 0.31 262 / 0.1)",
                ],
              }}
              transition={{
                boxShadow: {
                  duration: 2.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                },
              }}
              data-ocid="enter-btn"
              aria-label="Enter the portfolio experience"
            >
              {/* Sweep hover fill */}
              <motion.span
                className="absolute inset-0 pointer-events-none"
                initial={{ x: "-100%" }}
                whileHover={{ x: "0%" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                style={{
                  background:
                    "linear-gradient(90deg, oklch(0.75 0.31 262 / 0.08), oklch(0.68 0.25 303 / 0.06))",
                }}
              />

              <span className="relative tracking-[0.3em]">
                ENTER EXPERIENCE
              </span>

              {/* Arrow */}
              <motion.span
                className="relative"
                animate={{ x: [0, 4, 0] }}
                transition={{
                  duration: 1.8,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                style={{ color: "oklch(0.75 0.31 262)" }}
              >
                →
              </motion.span>
            </motion.button>
          </MagneticButton>
        </motion.div>

        {/* Journey text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="font-mono text-[10px] tracking-[0.35em] uppercase"
          style={{ color: "oklch(0.3 0 0)" }}
        >
          Press to begin your journey
        </motion.p>
      </div>

      {/* Bottom scanline decoration */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.75 0.31 262 / 0.3), transparent)",
        }}
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
}
