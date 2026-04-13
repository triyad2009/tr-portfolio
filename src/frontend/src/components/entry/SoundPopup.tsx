import { motion } from "motion/react";
import { useSound } from "../../hooks/useSound";
import { useAppStore } from "../../store/useAppStore";
import MagneticButton from "../ui/MagneticButton";

interface Props {
  onComplete: () => void;
}

function Headphones() {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ width: 56, height: 56 }}
    >
      <circle
        cx="24"
        cy="24"
        r="23"
        stroke="oklch(0.75 0.31 262 / 0.2)"
        strokeWidth="1"
      />
      <path
        d="M10 26v-6C10 17.6 12 11 24 11s14 6.6 14 9v6"
        stroke="oklch(0.75 0.31 262)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <rect
        x="8"
        y="26"
        width="6"
        height="10"
        rx="3"
        fill="oklch(0.75 0.31 262 / 0.3)"
        stroke="oklch(0.75 0.31 262)"
        strokeWidth="1.5"
      />
      <rect
        x="34"
        y="26"
        width="6"
        height="10"
        rx="3"
        fill="oklch(0.75 0.31 262 / 0.3)"
        stroke="oklch(0.75 0.31 262)"
        strokeWidth="1.5"
      />
    </svg>
  );
}

// Floating particle for background
function BgParticle({
  x,
  y,
  size,
  delay,
}: { x: number; y: number; size: number; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        background: `oklch(0.75 0.31 262 / ${0.1 + Math.random() * 0.3})`,
      }}
      animate={{
        opacity: [0.2, 0.8, 0.2],
        y: [0, -12, 0],
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        delay,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
    />
  );
}

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 1.5 + Math.random() * 2.5,
  delay: Math.random() * 3,
}));

export default function SoundPopup({ onComplete }: Props) {
  const { setSoundEnabled } = useAppStore();
  const { play } = useSound();

  const handleYes = () => {
    setSoundEnabled(true);
    // Brief delay to let AudioContext initialize before playing
    setTimeout(() => play("click"), 50);
    setTimeout(onComplete, 200);
  };

  const handleNo = () => {
    setSoundEnabled(false);
    onComplete();
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ zIndex: 9999, background: "oklch(0.06 0 0 / 0.95)" }}
      data-ocid="sound-popup"
    >
      {/* Background particles */}
      <div className="absolute inset-0" aria-hidden="true">
        {PARTICLES.map((p) => (
          <BgParticle key={`sp-${p.id}`} {...p} />
        ))}
      </div>

      {/* Subtle radial sweep */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        animate={{ rotate: 360 }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
        style={{
          background:
            "conic-gradient(from 0deg at 50% 50%, transparent 70%, oklch(0.75 0.31 262 / 0.04) 100%)",
        }}
      />

      {/* Glass card */}
      <motion.div
        initial={{ scale: 0.75, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: -20 }}
        transition={{ duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
        className="relative z-10 glassmorphic rounded-2xl p-10 max-w-sm w-full mx-4 text-center"
        style={{
          border: "1px solid oklch(0.75 0.31 262 / 0.25)",
          boxShadow:
            "0 0 60px oklch(0.75 0.31 262 / 0.12), 0 0 120px oklch(0.75 0.31 262 / 0.06)",
        }}
      >
        {/* Corner accents */}
        <div
          className="absolute top-0 left-0 w-8 h-8 pointer-events-none"
          aria-hidden="true"
          style={{
            borderTop: "1px solid oklch(0.75 0.31 262 / 0.6)",
            borderLeft: "1px solid oklch(0.75 0.31 262 / 0.6)",
          }}
        />
        <div
          className="absolute top-0 right-0 w-8 h-8 pointer-events-none"
          aria-hidden="true"
          style={{
            borderTop: "1px solid oklch(0.75 0.31 262 / 0.6)",
            borderRight: "1px solid oklch(0.75 0.31 262 / 0.6)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-8 h-8 pointer-events-none"
          aria-hidden="true"
          style={{
            borderBottom: "1px solid oklch(0.75 0.31 262 / 0.6)",
            borderLeft: "1px solid oklch(0.75 0.31 262 / 0.6)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-8 h-8 pointer-events-none"
          aria-hidden="true"
          style={{
            borderBottom: "1px solid oklch(0.75 0.31 262 / 0.6)",
            borderRight: "1px solid oklch(0.75 0.31 262 / 0.6)",
          }}
        />

        {/* Headphone icon with pulse */}
        <div className="flex justify-center mb-6">
          <motion.div
            animate={{
              filter: [
                "drop-shadow(0 0 8px oklch(0.75 0.31 262 / 0.6))",
                "drop-shadow(0 0 24px oklch(0.75 0.31 262 / 0.9))",
                "drop-shadow(0 0 8px oklch(0.75 0.31 262 / 0.6))",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <Headphones />
          </motion.div>
        </div>

        {/* Title */}
        <h2
          className="font-display text-2xl font-black mb-2 text-glow-cyan"
          style={{ letterSpacing: "0.1em" }}
        >
          Enable Sound?
        </h2>

        {/* Subtitle */}
        <p
          className="font-body text-sm mb-8 leading-relaxed"
          style={{ color: "oklch(0.5 0 0)" }}
        >
          For the full{" "}
          <span style={{ color: "oklch(0.75 0.31 262 / 0.8)" }}>
            cinematic experience
          </span>
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <MagneticButton className="flex-1" strength={0.25}>
            <button
              type="button"
              onClick={handleYes}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-display text-xs tracking-[0.25em] uppercase font-bold transition-all duration-300 min-h-[48px]"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.75 0.31 262 / 0.15), oklch(0.68 0.25 303 / 0.1))",
                border: "1px solid oklch(0.75 0.31 262 / 0.5)",
                color: "oklch(0.75 0.31 262)",
              }}
              data-ocid="sound-enable"
            >
              <span>Yes</span>
            </button>
          </MagneticButton>

          <MagneticButton className="flex-1" strength={0.25}>
            <button
              type="button"
              onClick={handleNo}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-display text-xs tracking-[0.25em] uppercase font-bold transition-all duration-300 min-h-[48px]"
              style={{
                background: "oklch(0.1 0.01 262 / 0.4)",
                border: "1px solid oklch(0.3 0.01 262 / 0.4)",
                color: "oklch(0.4 0 0)",
              }}
              data-ocid="sound-disable"
            >
              <span>No</span>
            </button>
          </MagneticButton>
        </div>

        {/* Decorative scan line */}
        <motion.div
          className="absolute left-0 right-0 h-px pointer-events-none"
          style={{ background: "oklch(0.75 0.31 262 / 0.15)" }}
          animate={{ top: ["10%", "90%", "10%"] }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </motion.div>
    </motion.div>
  );
}
