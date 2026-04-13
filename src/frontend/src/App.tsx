import { ArrowRight, Loader2, Volume2, VolumeX } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import CustomCursor from "./components/layout/CustomCursor";
import Navigation from "./components/layout/Navigation";
import HeroSection from "./components/sections/HeroSection";
import SkillsSection from "./components/sections/SkillsSection";
import GlitchText from "./components/ui/GlitchText";
import MagneticButton from "./components/ui/MagneticButton";
import ParticleBackground from "./components/ui/ParticleBackground";
import ProjectModal from "./components/ui/ProjectModal";
import { useLenis } from "./hooks/useLenis";
import { useSound } from "./hooks/useSound";
import { useAppStore } from "./store/useAppStore";

// ─── Project data ─────────────────────────────────────────────────────────────
interface ProjectData {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  tags: string[];
  github: string;
  demo: string;
  gradient: string;
}

const PROJECTS: ProjectData[] = [
  {
    id: "neo-tokyo",
    title: "Neo-Tokyo 2077",
    description:
      "Immersive cyberpunk WebGL environment with real-time ray-tracing aesthetics and particle systems.",
    longDescription:
      "A fully interactive cyberpunk city built in the browser using Three.js and custom GLSL shaders. Features real-time dynamic lighting, particle rain, holographic UI overlays, and ambient spatial audio that reacts to camera movement.",
    tags: ["Three.js", "GLSL", "React"],
    github: "https://github.com/tahsinullahriyad",
    demo: "#",
    gradient: "from-cyan-900/80 via-blue-900/60 to-purple-900/80",
  },
  {
    id: "kinetic-realms",
    title: "Kinetic Realms",
    description:
      "Procedurally generated 3D landscapes with interactive physics and spatial audio integration.",
    longDescription:
      "Infinite, procedurally generated alien landscapes with real-time physics simulation. Players can interact with terrain, trigger physics events, and experience spatial audio that adapts to the environment and player position.",
    tags: ["R3F", "Cannon.js", "Web Audio"],
    github: "https://github.com/tahsinullahriyad",
    demo: "#",
    gradient: "from-teal-900/80 via-emerald-900/60 to-cyan-900/80",
  },
  {
    id: "holographic-ui",
    title: "Holographic UI Kit",
    description:
      "Production-ready React component library with glassmorphism, OKLCH color system, and micro-animations.",
    longDescription:
      "A comprehensive design system and React component library featuring 40+ production-ready components. Built with OKLCH colors for perceptual uniformity, glassmorphism aesthetics, and GSAP-powered micro-animations throughout.",
    tags: ["React", "TypeScript", "Tailwind"],
    github: "https://github.com/tahsinullahriyad",
    demo: "#",
    gradient: "from-violet-900/80 via-purple-900/60 to-pink-900/80",
  },
  {
    id: "neural-soundscape",
    title: "Neural Soundscape",
    description:
      "Real-time audio visualizer powered by Web Audio API with custom WebGL shaders and reactive geometry.",
    longDescription:
      "A generative audio-visual experience that transforms any audio input into living, breathing 3D geometry. Web Audio API analyzes frequency data in real-time, driving custom WebGL shaders and GSAP-animated reactive meshes.",
    tags: ["Web Audio", "WebGL", "GSAP"],
    github: "https://github.com/tahsinullahriyad",
    demo: "#",
    gradient: "from-orange-900/80 via-red-900/60 to-purple-900/80",
  },
];

// ─── Loading Screen ──────────────────────────────────────────────────────────
function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let current = 0;
    const steps = [
      { target: 30, delay: 20 },
      { target: 60, delay: 30 },
      { target: 85, delay: 40 },
      { target: 100, delay: 25 },
    ];

    let stepIndex = 0;
    const tick = () => {
      if (stepIndex >= steps.length) return;
      const step = steps[stepIndex];
      if (current < step.target) {
        current += 1;
        setProgress(current);
        setTimeout(tick, step.delay);
      } else {
        stepIndex++;
        setTimeout(tick, step.delay * 2);
      }
    };

    setTimeout(tick, 200);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      setTimeout(onComplete, 600);
    }
  }, [progress, onComplete]);

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center bg-background"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      style={{ zIndex: 9999 }}
    >
      {/* Animated grid background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.75 0.31 262 / 0.3) 1px, transparent 1px), linear-gradient(90deg, oklch(0.75 0.31 262 / 0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Brand */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "backOut" }}
          className="font-display text-7xl font-black text-glow-cyan tracking-widest"
        >
          TR
        </motion.div>

        {/* System status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="font-mono text-xs text-muted-foreground tracking-widest uppercase"
        >
          Initializing System...
        </motion.div>

        {/* Progress bar */}
        <div className="w-64 relative">
          <div className="h-px bg-border/30 w-full" />
          <motion.div
            className="absolute top-0 left-0 h-px bg-primary"
            style={{
              width: `${progress}%`,
              boxShadow: "0 0 8px oklch(0.75 0.31 262 / 0.8)",
            }}
            transition={{ duration: 0.1 }}
          />
          <div className="mt-3 flex justify-between font-mono text-xs text-muted-foreground">
            <span>TR_PORTFOLIO.EXE</span>
            <span className="text-primary">{progress}%</span>
          </div>
        </div>

        <Loader2 className="text-primary animate-spin mt-2" size={20} />
      </div>
    </motion.div>
  );
}

// ─── Sound Prompt ─────────────────────────────────────────────────────────────
function SoundPrompt({ onChoice }: { onChoice: (enabled: boolean) => void }) {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ zIndex: 9999 }}
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 50%, oklch(0.75 0.31 262 / 0.4) 0%, transparent 70%)",
        }}
      />
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "backOut" }}
        className="relative glassmorphic rounded-2xl p-10 max-w-sm w-full mx-4 text-center border border-primary/20"
        style={{ boxShadow: "0 0 40px oklch(0.75 0.31 262 / 0.1)" }}
      >
        <div className="font-display text-4xl font-black text-glow-cyan mb-2">
          TR
        </div>
        <h2 className="font-display text-xl font-bold mb-2">Enable Sound?</h2>
        <p className="text-muted-foreground text-sm mb-8 font-body">
          This experience features ambient music and interactive sound effects
          for full immersion.
        </p>
        <div className="flex gap-4">
          <MagneticButton className="flex-1">
            <button
              type="button"
              onClick={() => onChoice(true)}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary/10 border border-primary/40 text-primary font-body text-sm tracking-widest uppercase hover:bg-primary/20 hover:border-primary/80 hover:glow-cyan transition-all duration-200 min-h-[48px]"
              data-ocid="sound-enable"
            >
              <Volume2 size={16} />
              Yes, Enable
            </button>
          </MagneticButton>
          <MagneticButton className="flex-1">
            <button
              type="button"
              onClick={() => onChoice(false)}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-muted/30 border border-border/40 text-muted-foreground font-body text-sm tracking-widest uppercase hover:text-foreground hover:border-border/80 transition-all duration-200 min-h-[48px]"
              data-ocid="sound-disable"
            >
              <VolumeX size={16} />
              No Thanks
            </button>
          </MagneticButton>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Enter Screen ─────────────────────────────────────────────────────────────
function EnterScreen({ onEnter }: { onEnter: () => void }) {
  const { play } = useSound();

  const handleEnter = () => {
    play("transition");
    setTimeout(onEnter, 200);
  };

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center bg-background overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8 }}
      style={{ zIndex: 9998 }}
    >
      <ParticleBackground />

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, oklch(0.75 0.31 262 / 0.06) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-8 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="font-mono text-xs text-muted-foreground tracking-[0.4em] uppercase"
        >
          TR_CREATIVE.STUDIO v2.0
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.6, ease: "backOut" }}
          className="font-display text-[clamp(4rem,12vw,9rem)] font-black leading-none text-glow-cyan tracking-tighter"
        >
          TR
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="font-body text-muted-foreground text-sm tracking-widest"
        >
          TAHSINULLAH RIYAD — CREATIVE WEB DEVELOPER
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <MagneticButton strength={0.4}>
            <button
              type="button"
              onClick={handleEnter}
              className="group relative flex items-center gap-3 px-10 py-4 rounded-xl glassmorphic border border-primary/40 text-primary font-display text-sm tracking-[0.3em] uppercase font-bold hover:border-primary/80 hover:glow-cyan transition-all duration-300 overflow-hidden min-h-[56px]"
              data-ocid="enter-btn"
            >
              <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-0 bg-primary/10 transition-transform duration-300" />
              <span className="relative">Enter Experience</span>
              <ArrowRight
                size={16}
                className="relative group-hover:translate-x-1 transition-transform"
              />
            </button>
          </MagneticButton>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Logo Intro ───────────────────────────────────────────────────────────────
function LogoIntro({ onComplete }: { onComplete: () => void }) {
  const { play, playGlitch } = useSound();
  const [phase, setPhase] = useState<"logo" | "name" | "out">("logo");

  useEffect(() => {
    play("impact");

    const t1 = setTimeout(() => {
      setPhase("name");
      playGlitch();
    }, 1500);

    const t2 = setTimeout(() => {
      setPhase("out");
    }, 3500);

    const t3 = setTimeout(() => {
      onComplete();
    }, 4200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete, play, playGlitch]);

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-background overflow-hidden"
      animate={
        phase === "out" ? { opacity: 0, scale: 1.1 } : { opacity: 1, scale: 1 }
      }
      transition={{ duration: 0.7, ease: "easeInOut" }}
      style={{ zIndex: 9997 }}
    >
      {/* Burst rays */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <motion.div
            key={`ray-${i}`}
            className="absolute left-1/2 top-1/2 origin-bottom"
            style={{
              width: 1,
              height: "50vh",
              background:
                "linear-gradient(to top, oklch(0.75 0.31 262 / 0.15), transparent)",
              rotate: `${i * 45}deg`,
              transformOrigin: "top center",
              marginLeft: "-0.5px",
            }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={phase !== "logo" ? { scaleY: 1, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: i * 0.05 }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center">
        <AnimatePresence mode="wait">
          {phase === "logo" && (
            <motion.div
              key="logo"
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.6, ease: "backOut" }}
              className="font-display text-[12rem] font-black leading-none text-glow-cyan tracking-widest"
            >
              TR
            </motion.div>
          )}

          {(phase === "name" || phase === "out") && (
            <motion.div
              key="name"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <GlitchText
                text="TAHSINULLAH RIYAD"
                className="font-display text-[clamp(2.5rem,7vw,5.5rem)] font-black leading-none tracking-tighter text-glow-cyan"
                triggerOnMount
                delay={100}
                tag="h1"
              />
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "100%" }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="h-px bg-primary/60"
                style={{ boxShadow: "0 0 8px oklch(0.75 0.31 262 / 0.8)" }}
              />
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="font-mono text-muted-foreground text-sm tracking-[0.4em] uppercase"
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

// ─── Main Portfolio ───────────────────────────────────────────────────────────
function MainPortfolio() {
  useLenis();
  const { play, startAmbientMusic } = useSound();
  const soundEnabled = useAppStore((s) => s.soundEnabled);

  // Start ambient music once we reach the main portfolio view
  useEffect(() => {
    if (soundEnabled) {
      // Small delay to let LogoIntro audio finish first
      const t = setTimeout(() => startAmbientMusic(), 800);
      return () => clearTimeout(t);
    }
  }, [soundEnabled, startAmbientMusic]);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(
    null,
  );

  return (
    <div className="relative min-h-screen">
      <ParticleBackground />
      <Navigation />
      <CustomCursor />

      {/* Hero Section — full 3D hero with typewriter and R3F canvas */}
      <HeroSection />

      {/* About Section */}
      <section id="about" className="py-32 relative">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, oklch(0.08 0.01 262 / 0.5) 50%, transparent 100%)",
          }}
        />
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="font-mono text-xs text-primary tracking-widest uppercase mb-4">
              {" "}
              {"// ABOUT"}
            </div>
            <h2 className="font-display text-5xl font-black text-glow-cyan mb-8 tracking-tight">
              Digital
              <br />
              Architect
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="glassmorphic rounded-2xl p-8 border border-primary/10"
          >
            <p className="font-body text-foreground/80 text-lg leading-relaxed mb-6">
              I craft immersive digital experiences where code meets creativity.
              With deep expertise in 3D web development, interactive
              installations, and cutting-edge UI design, I transform complex
              ideas into breathtaking visual realities.
            </p>
            <p className="font-body text-muted-foreground leading-relaxed">
              My work lives at the intersection of technology and art — building
              systems that don't just function, but feel. Every pixel, every
              animation, every interaction is deliberate. The goal is always the
              same: make the user feel something extraordinary.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <SkillsSection />

      {/* Projects Section */}
      <section id="projects" className="py-32 relative">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, oklch(0.08 0.01 303 / 0.3) 50%, transparent 100%)",
          }}
        />
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="font-mono text-xs text-primary tracking-widest uppercase mb-4">
              {" "}
              {"// PROJECTS"}
            </div>
            <h2 className="font-display text-5xl font-black tracking-tight text-glow-cyan">
              Featured Work
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {PROJECTS.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glassmorphic rounded-2xl p-6 border border-primary/10 hover:border-primary/40 hover:glow-cyan transition-all duration-300 group cursor-pointer"
                onClick={() => {
                  setSelectedProject(project);
                  play("click");
                }}
                data-ocid={`project-${i}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-muted-foreground hover:text-primary transition-colors text-xs font-mono"
                    data-ocid={`project-github-${i}`}
                  >
                    [GITHUB →]
                  </a>
                </div>
                <p className="font-body text-muted-foreground text-sm leading-relaxed mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-xs px-2 py-1 rounded bg-primary/10 text-primary border border-primary/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>

      {/* Social Section */}
      <section id="social" className="py-32 relative">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="font-mono text-xs text-secondary tracking-widest uppercase mb-4">
              {" "}
              {"// SOCIAL"}
            </div>
            <h2 className="font-display text-5xl font-black tracking-tight text-glow-purple">
              Connect
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                name: "GitHub",
                url: "https://github.com/tahsinullahriyad",
                color: "primary",
              },
              {
                name: "LinkedIn",
                url: "https://www.linkedin.com/in/tahsinullah-riyad-b16035304",
                color: "secondary",
              },
              {
                name: "Twitter",
                url: "https://x.com/tahsinullar2k9",
                color: "primary",
              },
              {
                name: "Instagram",
                url: "https://www.instagram.com/tahsinullah.riyad",
                color: "secondary",
              },
              {
                name: "Facebook",
                url: "https://www.facebook.com/tahsinullah.riyad.tr",
                color: "primary",
              },
              {
                name: "Discord",
                url: "https://discord.com/users/tahsinullahriyad",
                color: "secondary",
              },
              {
                name: "Telegram",
                url: "https://t.me/tahsinullahriyad_tr",
                color: "primary",
              },
              {
                name: "WhatsApp",
                url: "https://wa.me/qr/E44HZE4NNWUSF1?text=Hi%20Tahsinullah%2C%20I%27d%20like%20to%20work%20with%20you!",
                color: "secondary",
              },
              {
                name: "Email",
                url: "mailto:personal@tahsinullahriyad.world",
                color: "primary",
              },
            ].map((social, i) => (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className={`glassmorphic rounded-xl p-4 text-center border border-primary/10 hover:border-primary/40 transition-all duration-300 group min-h-[64px] flex items-center justify-center ${social.color === "primary" ? "hover:glow-cyan" : "hover:glow-purple"}`}
                data-ocid={`social-${social.name.toLowerCase()}`}
              >
                <span
                  className={`font-mono text-sm font-bold ${social.color === "primary" ? "text-primary" : "text-secondary"}`}
                >
                  {social.name}
                </span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 relative">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, oklch(0.08 0.01 262 / 0.5) 50%, transparent 100%)",
          }}
        />
        <div className="max-w-2xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="font-mono text-xs text-primary tracking-widest uppercase mb-4">
              {" "}
              {"// CONTACT"}
            </div>
            <h2 className="font-display text-5xl font-black tracking-tight text-glow-cyan mb-4">
              Let's Build
            </h2>
            <p className="font-body text-muted-foreground">
              Have a project in mind? Let's create something extraordinary
              together.
            </p>
          </motion.div>

          <ContactForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/30 glassmorphic">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-mono text-xs text-muted-foreground">
            {"SYSTEM: "}
            <span className="text-primary">OPERATIONAL</span>
            {" // TR_NET v2.4 // © "}
            {new Date().getFullYear()}
          </div>
          <div className="font-mono text-xs text-muted-foreground">
            Built with{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-glow-cyan transition-colors"
            >
              caffeine.ai
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── Contact Form ─────────────────────────────────────────────────────────────
function ContactForm() {
  const { play } = useSound();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    play("transition");
    setTimeout(() => setSubmitted(true), 300);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glassmorphic rounded-2xl p-10 text-center border border-primary/20"
        data-ocid="contact-success"
      >
        <div className="font-display text-4xl mb-4">✓</div>
        <h3 className="font-display text-2xl font-bold text-primary mb-2">
          Message Received
        </h3>
        <p className="font-body text-muted-foreground">
          I'll be in touch soon. Let's build something incredible together.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 }}
      onSubmit={handleSubmit}
      className="glassmorphic rounded-2xl p-8 border border-primary/10 flex flex-col gap-5"
      data-ocid="contact-form"
    >
      <div className="flex flex-col gap-2">
        <label
          htmlFor="name"
          className="font-mono text-xs text-muted-foreground tracking-widest uppercase"
        >
          Name
        </label>
        <input
          id="name"
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="bg-background/50 border border-border/40 rounded-lg px-4 py-3 font-body text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all"
          placeholder="Your name"
          data-ocid="contact-name"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="email"
          className="font-mono text-xs text-muted-foreground tracking-widest uppercase"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className="bg-background/50 border border-border/40 rounded-lg px-4 py-3 font-body text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all"
          placeholder="your@email.com"
          data-ocid="contact-email"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="message"
          className="font-mono text-xs text-muted-foreground tracking-widest uppercase"
        >
          Message
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          className="bg-background/50 border border-border/40 rounded-lg px-4 py-3 font-body text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all resize-none"
          placeholder="Tell me about your project..."
          data-ocid="contact-message"
        />
      </div>
      <MagneticButton>
        <button
          type="submit"
          onClick={() => play("click")}
          className="w-full py-4 rounded-xl bg-primary/10 border border-primary/40 text-primary font-display text-sm tracking-widest uppercase hover:bg-primary/20 hover:border-primary/80 hover:glow-cyan transition-all duration-300 min-h-[52px]"
          data-ocid="contact-submit"
        >
          Send Message →
        </button>
      </MagneticButton>
    </motion.form>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const { appState, setAppState, setSoundEnabled } = useAppStore();
  const ref = useRef(false);

  // Force dark class on html
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  // Start loading on mount
  useEffect(() => {
    if (ref.current) return;
    ref.current = true;
  }, []);

  const handleLoadingComplete = () => setAppState("sound-prompt");
  const handleSoundChoice = (enabled: boolean) => {
    setSoundEnabled(enabled);
    setAppState("enter");
  };
  const handleEnter = () => setAppState("intro");
  const handleIntroComplete = () => setAppState("main");

  return (
    <div
      className="min-h-screen bg-background text-foreground overflow-x-hidden"
      style={{ cursor: "none" }}
    >
      <AnimatePresence mode="wait">
        {appState === "loading" && (
          <LoadingScreen key="loading" onComplete={handleLoadingComplete} />
        )}
        {appState === "sound-prompt" && (
          <SoundPrompt key="sound" onChoice={handleSoundChoice} />
        )}
        {appState === "enter" && (
          <EnterScreen key="enter" onEnter={handleEnter} />
        )}
        {appState === "intro" && (
          <LogoIntro key="intro" onComplete={handleIntroComplete} />
        )}
        {appState === "main" && (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <MainPortfolio />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
