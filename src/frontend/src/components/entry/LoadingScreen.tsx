import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface Props {
  onComplete: () => void;
}

const GLITCH_CHARS = "!<>-_\\/[]{}—=+*^?#@$%&0123456789ABCDEF";

function randomChar() {
  return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
}

// Particle dot for background depth
function Particle({
  x,
  y,
  size,
  delay,
}: { x: number; y: number; size: number; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        background: `oklch(0.75 0.31 262 / ${0.2 + Math.random() * 0.4})`,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 0.5, 1, 0],
        scale: [0, 1, 0.8, 1, 0],
      }}
      transition={{
        duration: 2.5 + Math.random() * 2,
        delay,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
    />
  );
}

const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 1 + Math.random() * 3,
  delay: Math.random() * 2,
}));

export default function LoadingScreen({ onComplete }: Props) {
  const [progress, setProgress] = useState(0);
  const [displayProgress, setDisplayProgress] = useState("000");
  const glitchRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isComplete = progress === 100;

  // GSAP-style smooth counter via requestAnimationFrame
  useEffect(() => {
    const startTime = performance.now();
    const duration = 2500;
    let raf: number;

    const easeInOut = (t: number) =>
      t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const rawT = Math.min(elapsed / duration, 1);
      const t = easeInOut(rawT);
      const val = Math.round(t * 100);
      setProgress(val);
      if (rawT < 1) {
        raf = requestAnimationFrame(animate);
      }
    };

    const timer = setTimeout(() => {
      raf = requestAnimationFrame(animate);
    }, 300);

    return () => {
      clearTimeout(timer);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Glitch the counter digits every 200ms
  useEffect(() => {
    let glitchActive = false;

    glitchRef.current = setInterval(() => {
      if (glitchActive || isComplete) return;
      glitchActive = true;

      const glitchStr = `${randomChar()}${randomChar()}${randomChar()}`;
      setDisplayProgress(glitchStr);

      setTimeout(() => {
        setDisplayProgress(String(progress).padStart(3, "0"));
        glitchActive = false;
      }, 60);
    }, 200);

    return () => {
      if (glitchRef.current) clearInterval(glitchRef.current);
    };
  }, [progress, isComplete]);

  // Normal display sync
  useEffect(() => {
    setDisplayProgress(String(progress).padStart(3, "0"));
  }, [progress]);

  // Trigger complete
  useEffect(() => {
    if (progress === 100) {
      const t = setTimeout(onComplete, 700);
      return () => clearTimeout(t);
    }
  }, [progress, onComplete]);

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden scanlines"
      exit={{ y: "-100%", opacity: 0 }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
      style={{ zIndex: 9999, background: "oklch(0.06 0 0)" }}
      data-ocid="loading-screen"
    >
      {/* Particle depth layer */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {PARTICLES.map((p) => (
          <Particle key={`p-${p.id}`} {...p} />
        ))}
      </div>

      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.75 0.31 262) 1px, transparent 1px), linear-gradient(90deg, oklch(0.75 0.31 262) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial glow center */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 50% 50%, oklch(0.75 0.31 262 / 0.05) 0%, transparent 70%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-10 w-full px-6">
        {/* Brand badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.4, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          className="font-display text-sm font-bold tracking-[0.5em] uppercase text-glow-cyan"
        >
          TR
        </motion.div>

        {/* System label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="font-mono text-[10px] tracking-[0.4em] uppercase"
          style={{ color: "oklch(0.5 0 0)" }}
        >
          Initializing Portfolio System...
        </motion.div>

        {/* Big glitch counter */}
        <AnimatePresence mode="wait">
          <motion.div
            key="counter"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="font-display font-black leading-none select-none text-glow-cyan"
            style={{ fontSize: "clamp(6rem, 20vw, 14rem)" }}
            aria-live="polite"
            aria-label={`Loading ${progress}%`}
          >
            {displayProgress}
          </motion.div>
        </AnimatePresence>

        {/* Percent label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="font-mono text-xs tracking-[0.6em] uppercase"
          style={{ color: "oklch(0.75 0.31 262 / 0.6)", marginTop: "-2rem" }}
        >
          PERCENT COMPLETE
        </motion.div>

        {/* Progress bar */}
        <div className="relative w-full max-w-sm">
          <div
            className="h-px w-full"
            style={{ background: "oklch(0.75 0.31 262 / 0.12)" }}
          />
          <motion.div
            className="absolute top-0 left-0 h-px"
            style={{
              width: `${progress}%`,
              background: "oklch(0.75 0.31 262)",
              boxShadow:
                "0 0 6px oklch(0.75 0.31 262), 0 0 20px oklch(0.75 0.31 262 / 0.6)",
              transition: "width 0.08s linear",
            }}
          />
          {/* Trailing glow dot */}
          <motion.div
            className="absolute top-0 w-1 h-1 rounded-full -translate-y-[1px]"
            style={{
              left: `${progress}%`,
              background: "oklch(0.75 0.31 262)",
              boxShadow: "0 0 8px 2px oklch(0.75 0.31 262 / 0.8)",
              transition: "left 0.08s linear",
            }}
          />

          {/* Labels */}
          <div className="mt-3 flex justify-between">
            <span
              className="font-mono text-[10px] tracking-widest"
              style={{ color: "oklch(0.4 0 0)" }}
            >
              TR_PORTFOLIO.EXE
            </span>
            <span className="font-mono text-[10px] tracking-widest text-glow-cyan">
              {progress}%
            </span>
          </div>
        </div>

        {/* Status line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.4, 1] }}
          transition={{
            delay: 0.8,
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
          }}
          className="font-mono text-[10px] tracking-[0.3em] uppercase"
          style={{ color: "oklch(0.75 0.31 262 / 0.4)" }}
        >
          {isComplete ? "SYSTEM READY" : "LOADING ASSETS..."}
        </motion.div>
      </div>
    </motion.div>
  );
}
