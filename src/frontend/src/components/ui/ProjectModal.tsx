import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import { useSound } from "../../hooks/useSound";

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

interface ProjectModalProps {
  project: ProjectData;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const { play } = useSound();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Play transition sound on mount
  useEffect(() => {
    play("transition");
  }, [play]);

  // Trap focus + close on Escape
  useEffect(() => {
    closeButtonRef.current?.focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      play("click");
      onClose();
    }
  };

  const handleClose = () => {
    play("click");
    onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={handleBackdropClick}
      data-ocid="project-modal-overlay"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      {/* Modal card */}
      <motion.div
        className="relative z-10 w-full max-w-2xl glassmorphic rounded-2xl overflow-hidden border border-white/10"
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.85, y: 10 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        data-ocid="project-modal-card"
      >
        {/* Close button */}
        <button
          type="button"
          ref={closeButtonRef}
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 border border-white/10 text-white/60 hover:text-white hover:border-primary/60 hover:bg-primary/10 transition-all duration-300 group"
          aria-label="Close modal"
          data-ocid="project-modal-close"
          style={{ minWidth: 48, minHeight: 48 }}
        >
          <motion.span
            className="text-lg leading-none font-light"
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            ✕
          </motion.span>
        </button>

        {/* Gradient banner */}
        <div
          className={`relative bg-gradient-to-br ${project.gradient} h-52 sm:h-64 flex items-end p-6 overflow-hidden`}
        >
          {/* Scanlines */}
          <div className="absolute inset-0 scanlines" />

          {/* Grid lines */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* Ambient shimmer */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
            initial={{ x: "-150%" }}
            animate={{ x: "200%" }}
            transition={{ duration: 1.2, ease: "easeInOut", delay: 0.3 }}
          />

          {/* Floating corner badge */}
          <span
            className="absolute top-5 left-5 text-xs font-display font-semibold text-white/60 border border-white/20 rounded-full px-3 py-1 bg-black/20 backdrop-blur-sm"
            style={{ fontFamily: "var(--font-display)" }}
          >
            PROJECT
          </span>

          <h2
            className="relative z-10 font-display text-3xl sm:text-4xl font-black text-white leading-tight drop-shadow-xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {project.title}
          </h2>
        </div>

        {/* Modal body */}
        <div className="p-6 sm:p-8 flex flex-col gap-5">
          {/* Long description */}
          <p className="text-foreground/80 leading-relaxed text-base">
            {project.longDescription}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={`modal-tag-${project.id}-${tag}`}
                className="text-xs font-mono px-3 py-1.5 rounded border border-primary/30 text-primary/80 bg-primary/8"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px bg-border/40" />

          {/* Action buttons */}
          <div
            className="flex flex-col sm:flex-row gap-3"
            data-ocid="project-modal-actions"
          >
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="project-modal-github"
              onClick={() => play("click")}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-primary/50 text-primary font-display font-semibold text-sm hover:bg-primary/10 hover:border-primary hover:glow-cyan transition-all duration-300"
              style={{ fontFamily: "var(--font-display)", minHeight: 48 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub →
            </a>

            <a
              href={project.demo}
              target={project.demo !== "#" ? "_blank" : undefined}
              rel="noopener noreferrer"
              data-ocid="project-modal-demo"
              onClick={() => play("click")}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-display font-semibold text-sm hover:opacity-90 glow-cyan transition-all duration-300"
              style={{ fontFamily: "var(--font-display)", minHeight: 48 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Live Demo →
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
