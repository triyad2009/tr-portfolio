import {
  Facebook,
  Github,
  Instagram,
  Linkedin,
  Mail,
  Twitter,
} from "lucide-react";
import { motion } from "motion/react";
import { useRef } from "react";
import { useSound } from "../../hooks/useSound";

// ─── Social Data ──────────────────────────────────────────────────────────────
const socials = [
  {
    name: "GitHub",
    url: "https://github.com/tahsinullahriyad",
    color: "#e2e8f0",
    icon: "github",
    glow: "rgba(226,232,240,0.35)",
    border: "rgba(226,232,240,0.25)",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/tahsinullah-riyad-b16035304",
    color: "#0077b5",
    icon: "linkedin",
    glow: "rgba(0,119,181,0.5)",
    border: "rgba(0,119,181,0.3)",
  },
  {
    name: "Facebook",
    url: "https://www.facebook.com/tahsinullah.riyad.tr",
    color: "#1877f2",
    icon: "facebook",
    glow: "rgba(24,119,242,0.5)",
    border: "rgba(24,119,242,0.3)",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/tahsinullah.riyad",
    color: "#e1306c",
    icon: "instagram",
    glow: "rgba(225,48,108,0.5)",
    border: "rgba(225,48,108,0.3)",
  },
  {
    name: "Twitter / X",
    url: "https://x.com/tahsinullar2k9",
    color: "#1da1f2",
    icon: "twitter",
    glow: "rgba(29,161,242,0.5)",
    border: "rgba(29,161,242,0.3)",
  },
  {
    name: "WhatsApp",
    url: "https://wa.me/qr/E44HZE4NNWUSF1?text=Hi+Tahsinullah,+I'd+like+to+work+with+you!",
    color: "#25d366",
    icon: "whatsapp",
    glow: "rgba(37,211,102,0.5)",
    border: "rgba(37,211,102,0.3)",
  },
  {
    name: "Telegram",
    url: "https://t.me/tahsinullahriyad_tr",
    color: "#2ca5e0",
    icon: "telegram",
    glow: "rgba(44,165,224,0.5)",
    border: "rgba(44,165,224,0.3)",
  },
  {
    name: "Discord",
    url: "https://discord.com/users/tahsinullahriyad",
    color: "#5865f2",
    icon: "discord",
    glow: "rgba(88,101,242,0.5)",
    border: "rgba(88,101,242,0.3)",
  },
  {
    name: "Email",
    url: "mailto:personal@tahsinullahriyad.world",
    color: "#00f5ff",
    icon: "mail",
    glow: "rgba(0,245,255,0.5)",
    border: "rgba(0,245,255,0.3)",
  },
];

// ─── Icon Renderer ────────────────────────────────────────────────────────────
function SocialIcon({ icon, color }: { icon: string; color: string }) {
  const lucideProps = { size: 28, color, strokeWidth: 1.5 };

  switch (icon) {
    case "github":
      return <Github {...lucideProps} />;
    case "linkedin":
      return <Linkedin {...lucideProps} />;
    case "facebook":
      return <Facebook {...lucideProps} />;
    case "instagram":
      return <Instagram {...lucideProps} />;
    case "twitter":
      return <Twitter {...lucideProps} />;
    case "mail":
      return <Mail {...lucideProps} />;
    case "whatsapp":
      return (
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <title>WhatsApp</title>
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      );
    case "telegram":
      return (
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <title>Telegram</title>
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      );
    case "discord":
      return (
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <title>Discord</title>
          <circle cx="9" cy="12" r="1" />
          <circle cx="15" cy="12" r="1" />
          <path d="M7.5 7.5c1-.5 2.5-.8 4.5-.8s3.5.3 4.5.8" />
          <path d="M7.5 16.5c1 .5 2.5.8 4.5.8s3.5-.3 4.5-.8" />
          <path d="M15.5 3.5C17 4 20 5.5 20.5 13.5c-1 1-2.5 1.5-4 2" />
          <path d="M8.5 3.5C7 4 4 5.5 3.5 13.5c1 1 2.5 1.5 4 2" />
        </svg>
      );
    default:
      return null;
  }
}

// ─── Social Card ──────────────────────────────────────────────────────────────
interface SocialCardProps {
  name: string;
  url: string;
  color: string;
  glow: string;
  border: string;
  icon: string;
  index: number;
}

function SocialCard({
  name,
  url,
  color,
  glow,
  border,
  icon,
  index,
}: SocialCardProps) {
  const { play } = useSound();
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleHover = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      play("hover");
    }, 50);
  };

  const handleClick = () => {
    play("click");
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Floating animation offset — stagger the phase per card for organic feel
  const floatDelay = (index * 0.37) % 2;

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: index * 0.08,
        duration: 0.5,
        ease: [0.34, 1.56, 0.64, 1],
      }}
      whileHover={{
        scale: 1.12,
        y: -6,
        transition: { type: "spring", stiffness: 300, damping: 18 },
      }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={handleHover}
      onClick={handleClick}
      className="relative group flex flex-col items-center justify-center gap-3 rounded-2xl p-4
        w-[110px] h-[110px] sm:w-[120px] sm:h-[120px] min-w-[88px] min-h-[88px]
        md:w-[130px] md:h-[130px]
        glassmorphic cursor-pointer"
      style={{
        border: `1px solid ${border}`,
        animationDelay: `${floatDelay}s`,
      }}
      data-ocid={`social-${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
      aria-label={`Visit ${name}`}
    >
      {/* Hover glow ring */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100"
        style={{
          boxShadow: `0 0 20px ${glow}, 0 0 40px ${glow.replace("0.5", "0.2")}, inset 0 0 20px ${glow.replace("0.5", "0.05")}`,
          border: `1px solid ${color}40`,
        }}
        transition={{ duration: 0.2 }}
      />

      {/* Subtle scan-line hover overlay */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${glow.replace("0.5", "0.08")} 0%, transparent 70%)`,
        }}
      />

      {/* Icon */}
      <motion.div
        className="relative z-10"
        animate={{ y: [0, -4, 0] }}
        transition={{
          duration: 2.4 + floatDelay * 0.3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: floatDelay,
        }}
      >
        <SocialIcon icon={icon} color={color} />
      </motion.div>

      {/* Name */}
      <span
        className="relative z-10 font-mono text-[10px] sm:text-xs tracking-wider uppercase text-center leading-tight transition-all duration-200 group-hover:brightness-125"
        style={{ color }}
      >
        {name}
      </span>
    </motion.button>
  );
}

// ─── Holographic TR Badge ─────────────────────────────────────────────────────
function HolographicBadge() {
  return (
    <div className="relative flex items-center justify-center mb-10">
      {/* Outer glow rings */}
      <motion.div
        className="absolute w-32 h-32 rounded-full border border-primary/20"
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.1, 0.4] }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute w-44 h-44 rounded-full border border-primary/10"
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.05, 0.2] }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />

      {/* Core badge */}
      <motion.div
        className="relative glassmorphic rounded-full w-24 h-24 flex items-center justify-center border border-primary/30"
        style={{
          boxShadow:
            "0 0 30px oklch(0.75 0.31 262 / 0.3), 0 0 60px oklch(0.75 0.31 262 / 0.1)",
        }}
        animate={{
          boxShadow: [
            "0 0 30px oklch(0.75 0.31 262 / 0.3), 0 0 60px oklch(0.75 0.31 262 / 0.1)",
            "0 0 50px oklch(0.75 0.31 262 / 0.5), 0 0 80px oklch(0.75 0.31 262 / 0.2)",
            "0 0 30px oklch(0.75 0.31 262 / 0.3), 0 0 60px oklch(0.75 0.31 262 / 0.1)",
          ],
        }}
        transition={{
          duration: 2.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <span className="font-display text-3xl font-black text-glow-cyan tracking-widest">
          TR
        </span>
      </motion.div>
    </div>
  );
}

// ─── Section Component ────────────────────────────────────────────────────────
export default function SocialSection() {
  return (
    <section
      id="social"
      className="relative min-h-[80vh] py-24 overflow-hidden flex flex-col items-center justify-center"
    >
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, oklch(0.08 0.01 262 / 0.6) 30%, oklch(0.09 0.02 303 / 0.4) 70%, transparent 100%)",
        }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.75 0.31 262) 1px, transparent 1px), linear-gradient(90deg, oklch(0.75 0.31 262) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Radial glow center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, oklch(0.75 0.31 262 / 0.05) 0%, transparent 65%)",
        }}
      />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 flex flex-col items-center">
        {/* Section tag */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-mono text-xs text-primary tracking-[0.4em] uppercase mb-4"
        >
          {"// SOCIAL"}
        </motion.div>

        {/* Header */}
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-glow-cyan mb-3 text-center"
        >
          CONNECT WITH ME
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-body text-muted-foreground text-base sm:text-lg mb-12 text-center max-w-md"
        >
          Let's Build Something Amazing Together
        </motion.p>

        {/* Holographic TR badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.7,
            delay: 0.3,
            ease: [0.34, 1.56, 0.64, 1],
          }}
        >
          <HolographicBadge />
        </motion.div>

        {/* Divider line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="w-48 h-px mb-12"
          style={{
            background:
              "linear-gradient(90deg, transparent, oklch(0.75 0.31 262 / 0.7), transparent)",
            boxShadow: "0 0 8px oklch(0.75 0.31 262 / 0.5)",
          }}
        />

        {/* Social grid — row 1 (5), row 2 (4) on desktop; 3-per-row otherwise */}
        <div className="w-full flex flex-col items-center gap-4">
          {/* Row 1 — first 5 */}
          <div className="flex flex-wrap justify-center gap-4">
            {socials.slice(0, 5).map((social, i) => (
              <SocialCard key={`social-${social.name}`} {...social} index={i} />
            ))}
          </div>

          {/* Row 2 — last 4 */}
          <div className="flex flex-wrap justify-center gap-4">
            {socials.slice(5).map((social, i) => (
              <SocialCard
                key={`social-${social.name}`}
                {...social}
                index={i + 5}
              />
            ))}
          </div>
        </div>

        {/* Bottom separator */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="w-64 h-px mt-16 mb-8"
          style={{
            background:
              "linear-gradient(90deg, transparent, oklch(0.68 0.25 303 / 0.5), transparent)",
          }}
        />

        {/* Footer text */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="font-mono text-xs text-muted-foreground/60 tracking-wider text-center"
        >
          {`© ${new Date().getFullYear()} Tahsinullah Riyad. Built with passion and code.`}
        </motion.p>
      </div>
    </section>
  );
}
