import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { useEffect } from "react";
import { ScrollTrigger, gsap } from "../../hooks/useGSAP";
import { useSound } from "../../hooks/useSound";
import ProjectModal from "../ui/ProjectModal";

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
    id: "alpha",
    title: "Nexus — 3D Landing Page",
    description:
      "An immersive 3D landing page built with Three.js and React Three Fiber featuring real-time shader effects, particle systems, and scroll-based camera movement.",
    longDescription:
      "Nexus pushes the boundaries of web-based 3D graphics. The site features a custom GLSL shader pipeline, interactive particle field, and smooth scroll-driven camera animation. Built as a showcase for what the modern web is capable of.",
    tags: ["Three.js", "React", "GLSL", "GSAP"],
    github: "https://github.com/tahsinullahriyad",
    demo: "#",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    id: "beta",
    title: "Spectrum — Design System",
    description:
      "A comprehensive design system and component library built with React, TypeScript, and Tailwind CSS. Features 40+ components with dark/light mode support.",
    longDescription:
      "Spectrum is a production-ready design system built for modern web applications. It includes a fully-typed component API, customizable theme tokens, accessibility compliance, and interactive documentation.",
    tags: ["React", "TypeScript", "Tailwind", "Storybook"],
    github: "https://github.com/tahsinullahriyad",
    demo: "#",
    gradient: "from-purple-500 to-pink-600",
  },
  {
    id: "gamma",
    title: "Orbit — Portfolio Framework",
    description:
      "A modular portfolio framework for creative developers. Features cinematic animations, sound design, and a CMS-powered content layer for easy project management.",
    longDescription:
      "Orbit abstracts the hard parts of building a premium portfolio — cinematic entry experiences, 3D rendering, and sound design — into reusable, composable modules. Built from real-world portfolio projects.",
    tags: ["React", "Three.js", "GSAP", "Framer Motion"],
    github: "https://github.com/tahsinullahriyad",
    demo: "#",
    gradient: "from-teal-500 to-green-600",
  },
];

const GRADIENT_GLOW: Record<string, string> = {
  "from-cyan-500 to-blue-600":
    "0 0 30px oklch(0.75 0.31 262 / 0.5), 0 0 60px oklch(0.75 0.31 262 / 0.2)",
  "from-purple-500 to-pink-600":
    "0 0 30px oklch(0.68 0.25 303 / 0.5), 0 0 60px oklch(0.68 0.25 303 / 0.2)",
  "from-teal-500 to-green-600":
    "0 0 30px oklch(0.72 0.27 160 / 0.5), 0 0 60px oklch(0.72 0.27 160 / 0.2)",
};

interface ProjectCardProps {
  project: ProjectData;
  index: number;
  onOpen: (project: ProjectData) => void;
}

function ProjectCard({ project, index, onOpen }: ProjectCardProps) {
  const { play } = useSound();
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    play("hover");
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleClick = () => {
    play("click");
    onOpen(project);
  };

  return (
    <motion.div
      data-ocid={`project-card-${project.id}`}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.15 + 0.2,
        ease: [0.22, 1, 0.36, 1],
      }}
      animate={isHovered ? { y: -12 } : { y: 0 }}
      style={
        isHovered
          ? { boxShadow: GRADIENT_GLOW[project.gradient] }
          : { boxShadow: "none" }
      }
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className="glassmorphic rounded-2xl overflow-hidden cursor-pointer group border border-white/[0.06] hover:border-white/20 transition-colors duration-300 flex flex-col"
      tabIndex={0}
      aria-label={`Open project: ${project.title}`}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
    >
      {/* Gradient banner */}
      <div
        className={`relative bg-gradient-to-br ${project.gradient} h-44 flex items-end p-5 overflow-hidden`}
      >
        {/* Scanlines overlay */}
        <div className="absolute inset-0 scanlines" />

        {/* Animated shine */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
          initial={{ x: "-150%" }}
          animate={isHovered ? { x: "150%" } : { x: "-150%" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />

        {/* Grid lines decoration */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <h3
          className="relative z-10 font-display text-xl font-bold text-white leading-tight drop-shadow-lg"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {project.title}
        </h3>

        {/* View tag */}
        <motion.span
          className="absolute top-4 right-4 text-xs font-display font-semibold text-white/80 border border-white/30 rounded-full px-3 py-1 bg-black/20 backdrop-blur-sm"
          style={{ fontFamily: "var(--font-display)" }}
          animate={
            isHovered ? { scale: 1.05, opacity: 1 } : { scale: 1, opacity: 0.7 }
          }
          transition={{ duration: 0.2 }}
        >
          VIEW PROJECT →
        </motion.span>
      </div>

      {/* Card body */}
      <div className="p-5 flex flex-col gap-4 flex-1">
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {project.tags.map((tag) => (
            <motion.span
              key={`${project.id}-tag-${tag}`}
              className="text-xs font-mono px-2.5 py-1 rounded border border-primary/20 text-primary/60 bg-primary/5"
              animate={
                isHovered
                  ? {
                      borderColor: "oklch(0.75 0.31 262 / 0.5)",
                      color: "oklch(0.75 0.31 262)",
                    }
                  : {
                      borderColor: "oklch(0.75 0.31 262 / 0.2)",
                      color: "oklch(0.75 0.31 262 / 0.6)",
                    }
              }
              transition={{ duration: 0.2 }}
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const [activeProject, setActiveProject] = useState<ProjectData | null>(null);

  useEffect(() => {
    if (!titleRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative min-h-screen py-24 px-6"
      data-ocid="projects-section"
    >
      {/* Ambient background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, oklch(0.75 0.31 262 / 0.04) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <div ref={titleRef} className="text-center mb-16">
          <p
            className="text-primary text-sm font-display font-semibold tracking-[0.3em] uppercase mb-3 text-glow-cyan"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Featured Work
          </p>
          <h2
            className="text-5xl md:text-6xl font-display font-black text-foreground tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            MY <span className="text-gradient-cyber">PROJECTS</span>
          </h2>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-primary glow-cyan" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/60" />
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((project, index) => (
            <ProjectCard
              key={`project-${project.id}`}
              project={project}
              index={index}
              onOpen={setActiveProject}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <a
            href="https://github.com/tahsinullahriyad"
            target="_blank"
            rel="noopener noreferrer"
            data-ocid="projects-github-cta"
            className="inline-flex items-center gap-2 text-sm font-display font-semibold text-primary/70 hover:text-primary transition-colors duration-300 border border-primary/20 hover:border-primary/50 rounded-full px-6 py-3 hover:glow-cyan"
            style={{ fontFamily: "var(--font-display)" }}
          >
            VIEW ALL ON GITHUB →
          </a>
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {activeProject && (
          <ProjectModal
            project={activeProject}
            onClose={() => setActiveProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
