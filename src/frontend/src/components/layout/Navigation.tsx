import { Menu, Moon, Sun, Volume2, VolumeX, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useSound } from "../../hooks/useSound";
import { useAppStore } from "../../store/useAppStore";
import MagneticButton from "../ui/MagneticButton";

const NAV_LINKS = [
  { label: "Home", href: "#home", id: "home" },
  { label: "About", href: "#about", id: "about" },
  { label: "Skills", href: "#skills", id: "skills" },
  { label: "Projects", href: "#projects", id: "projects" },
  { label: "Social", href: "#social", id: "social" },
  { label: "Contact", href: "#contact", id: "contact" },
];

export default function Navigation() {
  const { soundEnabled, toggleSound, theme, toggleTheme } = useAppStore();
  const { play, startAmbientMusic, stopAmbientMusic } = useSound();
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);

      // Update active section based on scroll position
      const sections = NAV_LINKS.map((l) =>
        document.getElementById(l.id),
      ).filter(Boolean);
      let current = "home";
      for (const section of sections) {
        if (section && section.getBoundingClientRect().top <= 100) {
          current = section.id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    play("click");
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  const handleSoundToggle = () => {
    const nextEnabled = !soundEnabled;
    toggleSound();
    if (nextEnabled) {
      // Re-enable: play click + restart ambient music
      play("click");
      startAmbientMusic();
    } else {
      // Mute: fade out ambient then play click so user hears the mute confirm
      stopAmbientMusic();
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "glassmorphic border-b border-primary/20 shadow-lg"
            : "bg-transparent"
        }`}
        data-ocid="nav"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo */}
            <MagneticButton strength={0.2}>
              <button
                type="button"
                onClick={() => {
                  play("click");
                  document
                    .getElementById("home")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="relative font-display text-2xl font-black tracking-widest text-glow-cyan bg-transparent border-0 cursor-pointer"
                data-ocid="nav-brand"
              >
                TR
                <span className="absolute -inset-1 blur-sm opacity-40 text-primary font-display text-2xl font-black">
                  TR
                </span>
              </button>
            </MagneticButton>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`relative px-4 py-2 text-sm font-body tracking-widest uppercase transition-all duration-200
                    ${
                      activeSection === link.id
                        ? "text-primary text-glow-cyan"
                        : "text-foreground/60 hover:text-foreground hover:text-glow-cyan"
                    }`}
                  data-ocid={`nav-link-${link.id}`}
                >
                  {link.label}
                  {activeSection === link.id && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                      style={{
                        boxShadow: "0 0 6px oklch(0.75 0.31 262 / 0.8)",
                      }}
                    />
                  )}
                </a>
              ))}
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <MagneticButton strength={0.25}>
                <button
                  type="button"
                  onClick={() => {
                    toggleTheme();
                    play("click");
                  }}
                  className="w-10 h-10 flex items-center justify-center rounded-full glassmorphic border border-primary/20 hover:border-primary/60 hover:glow-cyan transition-all duration-200"
                  aria-label={
                    theme === "dark"
                      ? "Switch to light mode"
                      : "Switch to dark mode"
                  }
                  data-ocid="nav-theme-toggle"
                >
                  {theme === "dark" ? (
                    <Sun size={16} className="text-primary" />
                  ) : (
                    <Moon size={16} className="text-primary" />
                  )}
                </button>
              </MagneticButton>

              {/* Sound Toggle */}
              <MagneticButton strength={0.25}>
                <button
                  type="button"
                  onClick={handleSoundToggle}
                  className="w-10 h-10 flex items-center justify-center rounded-full glassmorphic border border-primary/20 hover:border-primary/60 hover:glow-cyan transition-all duration-200"
                  aria-label={soundEnabled ? "Mute sound" : "Enable sound"}
                  data-ocid="nav-sound-toggle"
                >
                  {soundEnabled ? (
                    <Volume2 size={16} className="text-primary" />
                  ) : (
                    <VolumeX size={16} className="text-muted-foreground" />
                  )}
                </button>
              </MagneticButton>

              {/* Mobile Menu */}
              <button
                type="button"
                onClick={() => {
                  setMobileOpen((v) => !v);
                  play("click");
                }}
                className="md:hidden w-10 h-10 flex items-center justify-center rounded-full glassmorphic border border-primary/20"
                aria-label="Toggle menu"
                data-ocid="nav-mobile-menu"
              >
                {mobileOpen ? (
                  <X size={18} className="text-primary" />
                ) : (
                  <Menu size={18} className="text-foreground" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 glassmorphic border-b border-primary/20 md:hidden"
            data-ocid="nav-mobile-dropdown"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`px-4 py-3 text-sm tracking-widest uppercase rounded-lg transition-all duration-200 min-h-[48px] flex items-center
                    ${
                      activeSection === link.id
                        ? "text-primary bg-primary/10 border border-primary/20"
                        : "text-foreground/70 hover:text-foreground hover:bg-primary/5"
                    }`}
                  data-ocid={`nav-mobile-link-${link.id}`}
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
