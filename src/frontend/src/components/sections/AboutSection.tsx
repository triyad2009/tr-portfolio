import { motion, useAnimationControls } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ScrollTrigger, gsap } from "../../hooks/useGSAP";
import { useSound } from "../../hooks/useSound";
import MagneticButton from "../ui/MagneticButton";

const PROFILE_PHOTO_URL =
  "https://i.postimg.cc/j2TkqS1P/IMG-20260217-124734020.jpg";

// ---------- Types ----------
interface StatItem {
  value: number;
  suffix: string;
  label: string;
  icon: string;
}

interface OrbConfig {
  size: number;
  top: string;
  left: string;
  color: string;
  delay: number;
  duration: number;
}

// ---------- Data ----------
const STATS: StatItem[] = [
  { value: 3, suffix: "+", label: "Years", icon: "⚡" },
  { value: 20, suffix: "+", label: "Projects", icon: "🚀" },
  { value: 10, suffix: "+", label: "Clients", icon: "🌐" },
];

const TECH_PILLS = [
  "React",
  "TypeScript",
  "Three.js",
  "GSAP",
  "Figma",
  "Tailwind",
  "Node.js",
  "WebGL",
];

const ORBS: OrbConfig[] = [
  {
    size: 10,
    top: "12%",
    left: "10%",
    color: "oklch(0.75 0.31 262 / 0.8)",
    delay: 0,
    duration: 3.2,
  },
  {
    size: 8,
    top: "70%",
    left: "80%",
    color: "oklch(0.68 0.25 303 / 0.8)",
    delay: 0.8,
    duration: 4.1,
  },
  {
    size: 12,
    top: "55%",
    left: "5%",
    color: "oklch(0.75 0.31 262 / 0.6)",
    delay: 1.6,
    duration: 3.7,
  },
  {
    size: 7,
    top: "20%",
    left: "75%",
    color: "oklch(0.68 0.25 303 / 0.7)",
    delay: 2.2,
    duration: 4.8,
  },
];

// ---------- Sub-components ----------

function ProfilePhoto() {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {!imgError ? (
        <motion.img
          src={PROFILE_PHOTO_URL}
          alt="Tahsinullah Riyad"
          className="w-full h-full object-cover object-top"
          style={{
            opacity: imgLoaded ? 1 : 0,
            transition: "opacity 0.6s ease",
          }}
          initial={{ scale: 1.08, opacity: 0 }}
          animate={
            imgLoaded ? { scale: 1, opacity: 1 } : { scale: 1.08, opacity: 0 }
          }
          transition={{ duration: 0.8, ease: "easeOut" }}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
        />
      ) : (
        /* Fallback: TR monogram */
        <div className="relative flex flex-col items-center gap-2 select-none">
          <motion.span
            className="font-display font-black text-8xl md:text-9xl text-gradient-cyber"
            animate={{
              filter: [
                "drop-shadow(0 0 20px oklch(0.75 0.31 262 / 0.6))",
                "drop-shadow(0 0 40px oklch(0.75 0.31 262 / 0.9))",
                "drop-shadow(0 0 20px oklch(0.75 0.31 262 / 0.6))",
              ],
            }}
            transition={{
              duration: 2.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            TR
          </motion.span>
          <span
            className="font-mono text-xs tracking-[0.4em] uppercase"
            style={{ color: "oklch(0.75 0.31 262 / 0.7)" }}
          >
            Creative Dev
          </span>
        </div>
      )}

      {/* Photo bottom gradient fade for seamless blend */}
      {!imgError && imgLoaded && (
        <div
          className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, oklch(0.1 0.02 262 / 0.85) 0%, transparent 100%)",
          }}
        />
      )}

      {/* Name badge overlay at bottom */}
      {!imgError && imgLoaded && (
        <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-0.5">
          <span
            className="font-display font-bold text-sm tracking-[0.25em] uppercase"
            style={{
              color: "oklch(0.75 0.31 262)",
              textShadow: "0 0 12px oklch(0.75 0.31 262 / 0.8)",
            }}
          >
            Tahsinullah Riyad
          </span>
          <span
            className="font-mono text-xs tracking-[0.35em] uppercase"
            style={{ color: "oklch(0.75 0.31 262 / 0.6)" }}
          >
            Creative Dev
          </span>
        </div>
      )}
    </div>
  );
}

function FloatingOrb({ orb }: { orb: OrbConfig }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: orb.size,
        height: orb.size,
        top: orb.top,
        left: orb.left,
        background: orb.color,
        boxShadow: `0 0 ${orb.size * 2}px ${orb.color}`,
      }}
      animate={{ y: [0, -16, 0] }}
      transition={{
        duration: orb.duration,
        delay: orb.delay,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
    />
  );
}

function AnimatedCounter({
  value,
  suffix,
  inView,
}: { value: number; suffix: string; inView: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(value / 30);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 40);
    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <span className="text-glow-cyan font-display text-2xl font-bold">
      {count}
      {suffix}
    </span>
  );
}

function StatCard({ stat, inView }: { stat: StatItem; inView: boolean }) {
  return (
    <div className="glassmorphic flex flex-col items-center gap-1 rounded-xl px-4 py-3 flex-1 min-w-0">
      <span className="text-xl">{stat.icon}</span>
      <AnimatedCounter
        value={stat.value}
        suffix={stat.suffix}
        inView={inView}
      />
      <span className="text-muted-foreground text-xs uppercase tracking-widest">
        {stat.label}
      </span>
    </div>
  );
}

// ---------- Main Section ----------
export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const pillsRef = useRef<HTMLDivElement>(null);
  const cardControls = useAnimationControls();
  const [statsInView, setStatsInView] = useState(false);
  const { play } = useSound();

  // GSAP scroll-triggered animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title slides in from left
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, x: -80 },
        {
          opacity: 1,
          x: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // Left card slides in from left with scale
      gsap.fromTo(
        leftRef.current,
        { opacity: 0, x: -100, scale: 0.92 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: leftRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
            onEnter: () => setStatsInView(true),
          },
        },
      );

      // Right text paragraphs stagger from right
      gsap.fromTo(
        ".about-para",
        { opacity: 0, x: 80 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.2,
          scrollTrigger: {
            trigger: rightRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // Tech pills stagger from bottom
      gsap.fromTo(
        ".tech-pill",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "back.out(1.7)",
          stagger: 0.07,
          scrollTrigger: {
            trigger: pillsRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Refresh ScrollTrigger on mount
  useEffect(() => {
    ScrollTrigger.refresh();
  }, []);

  const handleCardHover = () => {
    play("hover");
    cardControls.start({
      boxShadow: [
        "0 0 30px oklch(0.75 0.31 262 / 0.4), 0 0 60px oklch(0.75 0.31 262 / 0.15)",
        "0 0 50px oklch(0.75 0.31 262 / 0.6), 0 0 100px oklch(0.75 0.31 262 / 0.25)",
      ],
      transition: { duration: 0.3 },
    });
  };

  const handleCardLeave = () => {
    cardControls.start({
      boxShadow:
        "0 0 30px oklch(0.75 0.31 262 / 0.4), 0 0 60px oklch(0.75 0.31 262 / 0.15)",
      transition: { duration: 0.4 },
    });
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative min-h-screen bg-background overflow-hidden py-24 px-4 scanlines"
      data-ocid="about-section"
    >
      {/* Grain texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
        }}
      />

      {/* Ambient gradient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 20% 50%, oklch(0.75 0.31 262 / 0.04) 0%, transparent 60%), radial-gradient(ellipse 50% 60% at 80% 50%, oklch(0.68 0.25 303 / 0.04) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section title */}
        <div ref={titleRef} className="mb-16 opacity-0">
          <h2
            className="font-display text-4xl md:text-5xl font-bold text-foreground tracking-widest uppercase"
            data-ocid="about-heading"
          >
            About Me
          </h2>
          <div
            className="mt-3 h-1 w-20 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, oklch(0.75 0.31 262), oklch(0.68 0.25 303))",
              boxShadow: "0 0 12px oklch(0.75 0.31 262 / 0.8)",
            }}
          />
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-12 xl:gap-20 items-start">
          {/* LEFT — Avatar card + stats */}
          <div ref={leftRef} className="flex flex-col gap-6 opacity-0">
            {/* Profile card */}
            <motion.div
              animate={cardControls}
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: "oklch(0.1 0.02 262 / 0.6)",
                backdropFilter: "blur(16px)",
                border: "1px solid oklch(0.75 0.31 262 / 0.3)",
                boxShadow:
                  "0 0 30px oklch(0.75 0.31 262 / 0.4), 0 0 60px oklch(0.75 0.31 262 / 0.15)",
              }}
              onMouseEnter={handleCardHover}
              onMouseLeave={handleCardLeave}
              data-ocid="about-avatar-card"
            >
              {/* Floating orbs inside card */}
              <div className="relative h-80 md:h-96 flex items-center justify-center">
                {ORBS.map((orb) => (
                  <FloatingOrb key={`orb-${orb.top}-${orb.left}`} orb={orb} />
                ))}

                {/* Corner accent lines */}
                <div
                  className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2"
                  style={{ borderColor: "oklch(0.75 0.31 262)" }}
                />
                <div
                  className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2"
                  style={{ borderColor: "oklch(0.75 0.31 262)" }}
                />
                <div
                  className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2"
                  style={{ borderColor: "oklch(0.75 0.31 262)" }}
                />
                <div
                  className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2"
                  style={{ borderColor: "oklch(0.75 0.31 262)" }}
                />

                {/* Profile photo with TR monogram fallback */}
                <ProfilePhoto />

                {/* Scan line overlay */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 40%, oklch(0.75 0.31 262 / 0.04) 50%, transparent 60%)",
                  }}
                  animate={{ y: ["-60%", "160%"] }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                    repeatDelay: 2,
                  }}
                />
              </div>

              {/* Inner bottom border glow */}
              <div
                className="absolute bottom-0 left-0 right-0 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, oklch(0.75 0.31 262 / 0.8), transparent)",
                }}
              />
            </motion.div>

            {/* Stats row */}
            <div className="flex gap-3">
              {STATS.map((stat) => (
                <StatCard
                  key={`stat-${stat.label}`}
                  stat={stat}
                  inView={statsInView}
                />
              ))}
            </div>
          </div>

          {/* RIGHT — Bio text */}
          <div ref={rightRef} className="flex flex-col gap-6 lg:pt-4">
            {/* Tag */}
            <p
              className="about-para font-mono text-xs tracking-[0.35em] uppercase opacity-0"
              style={{ color: "oklch(0.75 0.31 262)" }}
            >
              {"// WHO I AM"}
            </p>

            {/* Main heading */}
            <h3 className="about-para font-display text-3xl md:text-4xl xl:text-5xl font-bold leading-tight opacity-0">
              I Build <span className="text-gradient-cyber">Immersive</span>
              <br />
              Digital Experiences
            </h3>

            {/* Bio paragraphs */}
            <p className="about-para text-muted-foreground leading-relaxed text-base md:text-lg opacity-0">
              {
                "I'm Tahsinullah Riyad — a Creative Web Developer obsessed with pushing the boundaries of what's possible on the web. I blend code, design, and storytelling to craft digital experiences that feel alive."
              }
            </p>
            <p className="about-para text-muted-foreground leading-relaxed text-base md:text-lg opacity-0">
              {
                "With a deep passion for 3D graphics, interactive animation, and immersive interfaces, I specialize in building portfolio-grade experiences, interactive web apps, and visually stunning frontends that leave a lasting impression."
              }
            </p>
            <p className="about-para text-muted-foreground leading-relaxed text-base md:text-lg opacity-0">
              {
                "When I'm not coding, I'm exploring new technologies, experimenting with shaders, or designing motion systems that make people stop and say 'How did they build that?'"
              }
            </p>

            {/* Tech pills */}
            <div ref={pillsRef} className="flex flex-wrap gap-2 mt-2">
              {TECH_PILLS.map((tech) => {
                const idx = TECH_PILLS.indexOf(tech);
                const isCyan = idx % 2 === 0;
                return (
                  <span
                    key={`pill-${tech}`}
                    className="tech-pill glassmorphic font-mono text-xs px-3 py-1.5 rounded-full opacity-0 transition-smooth hover:scale-105"
                    style={{
                      color: isCyan
                        ? "oklch(0.75 0.31 262)"
                        : "oklch(0.68 0.25 303)",
                      border: `1px solid ${isCyan ? "oklch(0.75 0.31 262 / 0.3)" : "oklch(0.68 0.25 303 / 0.3)"}`,
                    }}
                    data-ocid={`tech-pill-${tech.toLowerCase()}`}
                  >
                    {tech}
                  </span>
                );
              })}
            </div>

            {/* CTA button */}
            <div className="mt-4">
              <MagneticButton strength={0.4}>
                <motion.button
                  type="button"
                  className="relative min-h-[48px] px-8 py-3 rounded-xl font-display text-sm font-semibold tracking-widest uppercase overflow-hidden transition-smooth"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.75 0.31 262 / 0.2), oklch(0.68 0.25 303 / 0.2))",
                    border: "1px solid oklch(0.75 0.31 262 / 0.5)",
                    color: "oklch(0.75 0.31 262)",
                    boxShadow: "0 0 20px oklch(0.75 0.31 262 / 0.2)",
                  }}
                  whileHover={{
                    scale: 1.04,
                    boxShadow:
                      "0 0 40px oklch(0.75 0.31 262 / 0.5), 0 0 80px oklch(0.75 0.31 262 / 0.2)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  onHoverStart={() => play("hover")}
                  onClick={() => play("click")}
                  data-ocid="about-cta-resume"
                >
                  {/* Shine sweep */}
                  <motion.span
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(105deg, transparent 40%, oklch(0.75 0.31 262 / 0.15) 50%, transparent 60%)",
                      transform: "translateX(-100%)",
                    }}
                    animate={{
                      transform: ["translateX(-100%)", "translateX(200%)"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatDelay: 3,
                      ease: "easeInOut",
                    }}
                  />
                  <span className="relative z-10 flex items-center gap-2">
                    <span>Download Resume</span>
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden="true"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                  </span>
                </motion.button>
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
