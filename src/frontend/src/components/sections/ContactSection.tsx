import MagneticButton from "@/components/ui/MagneticButton";
import { useSound } from "@/hooks/useSound";
import { Github, Linkedin, Mail, MessageCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

// ─── Floating Label Input ─────────────────────────────────────────────────────
interface FloatingInputProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  error?: string;
  onChange: (val: string) => void;
  onBlur?: () => void;
  "data-ocid"?: string;
}

function FloatingInput({
  id,
  label,
  type = "text",
  value,
  error,
  onChange,
  onBlur,
  "data-ocid": ocid,
}: FloatingInputProps) {
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;

  return (
    <div className="relative">
      <label
        htmlFor={id}
        className="absolute left-4 pointer-events-none transition-all duration-200 font-mono"
        style={{
          top: lifted ? "6px" : "50%",
          transform: lifted ? "none" : "translateY(-50%)",
          fontSize: lifted ? "0.6rem" : "0.75rem",
          color: focused
            ? "oklch(0.75 0.31 262)"
            : error
              ? "oklch(0.65 0.19 22)"
              : "oklch(0.5 0 0)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          onBlur?.();
        }}
        data-ocid={ocid}
        className="w-full pt-6 pb-2 px-4 rounded-xl font-body text-sm text-foreground transition-all duration-200 focus:outline-none min-h-[56px]"
        style={{
          background: "oklch(0.08 0.02 262 / 0.6)",
          border: focused
            ? "1px solid oklch(0.75 0.31 262 / 0.7)"
            : error
              ? "1px solid oklch(0.65 0.19 22 / 0.6)"
              : "1px solid oklch(0.2 0.02 262 / 0.6)",
          boxShadow: focused
            ? "0 0 0 1px oklch(0.75 0.31 262 / 0.2), 0 0 16px oklch(0.75 0.31 262 / 0.1)"
            : "none",
        }}
      />
      {error && (
        <p className="mt-1 font-mono text-[0.6rem] tracking-widest uppercase text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Floating Textarea ────────────────────────────────────────────────────────
interface FloatingTextareaProps {
  id: string;
  label: string;
  value: string;
  error?: string;
  rows?: number;
  onChange: (val: string) => void;
  onBlur?: () => void;
  "data-ocid"?: string;
}

function FloatingTextarea({
  id,
  label,
  value,
  error,
  rows = 4,
  onChange,
  onBlur,
  "data-ocid": ocid,
}: FloatingTextareaProps) {
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;

  return (
    <div className="relative">
      <label
        htmlFor={id}
        className="absolute left-4 pointer-events-none transition-all duration-200 font-mono"
        style={{
          top: lifted ? "8px" : "16px",
          fontSize: lifted ? "0.6rem" : "0.75rem",
          color: focused
            ? "oklch(0.75 0.31 262)"
            : error
              ? "oklch(0.65 0.19 22)"
              : "oklch(0.5 0 0)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          onBlur?.();
        }}
        data-ocid={ocid}
        className="w-full pt-8 pb-3 px-4 rounded-xl font-body text-sm text-foreground transition-all duration-200 focus:outline-none resize-none"
        style={{
          background: "oklch(0.08 0.02 262 / 0.6)",
          border: focused
            ? "1px solid oklch(0.75 0.31 262 / 0.7)"
            : error
              ? "1px solid oklch(0.65 0.19 22 / 0.6)"
              : "1px solid oklch(0.2 0.02 262 / 0.6)",
          boxShadow: focused
            ? "0 0 0 1px oklch(0.75 0.31 262 / 0.2), 0 0 16px oklch(0.75 0.31 262 / 0.1)"
            : "none",
        }}
      />
      {error && (
        <p className="mt-1 font-mono text-[0.6rem] tracking-widest uppercase text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Animated Checkmark ───────────────────────────────────────────────────────
function AnimatedCheck() {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.1 }}
      className="flex items-center justify-center w-24 h-24 rounded-full mx-auto mb-6"
      style={{
        background: "oklch(0.54 0.2 152 / 0.1)",
        border: "2px solid oklch(0.54 0.2 152 / 0.4)",
        boxShadow: "0 0 30px oklch(0.54 0.2 152 / 0.3)",
      }}
    >
      <svg
        viewBox="0 0 50 50"
        width="48"
        height="48"
        fill="none"
        aria-hidden="true"
        role="img"
      >
        <motion.path
          d="M10 26 L20 36 L40 16"
          stroke="oklch(0.54 0.2 152)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        />
      </svg>
    </motion.div>
  );
}

// ─── Orbiting Orbs ────────────────────────────────────────────────────────────
function FloatingOrbs() {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Large ambient orb */}
      <motion.div
        className="absolute -left-32 top-1/3 w-80 h-80 rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.75 0.31 262 / 0.06) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      {/* Secondary orb */}
      <motion.div
        className="absolute -right-20 bottom-1/4 w-60 h-60 rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.68 0.25 303 / 0.07) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 2,
        }}
      />
      {/* Small decorative orbs */}
      {[
        {
          top: "15%",
          left: "5%",
          size: 6,
          color: "oklch(0.75 0.31 262 / 0.5)",
          delay: 0,
        },
        {
          top: "40%",
          left: "12%",
          size: 4,
          color: "oklch(0.68 0.25 303 / 0.4)",
          delay: 1,
        },
        {
          top: "70%",
          left: "8%",
          size: 8,
          color: "oklch(0.75 0.31 262 / 0.3)",
          delay: 2,
        },
        {
          top: "25%",
          left: "20%",
          size: 3,
          color: "oklch(0.68 0.25 303 / 0.6)",
          delay: 0.5,
        },
      ].map((orb) => (
        <motion.div
          key={`orb-${orb.top}-${orb.left}`}
          className="absolute rounded-full"
          style={{
            top: orb.top,
            left: orb.left,
            width: orb.size,
            height: orb.size,
            background: orb.color,
            boxShadow: `0 0 ${orb.size * 2}px ${orb.color}`,
          }}
          animate={{ y: [0, -12, 0], opacity: [0.6, 1, 0.6] }}
          transition={{
            duration: 3 + orb.delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: orb.delay,
          }}
        />
      ))}
    </div>
  );
}

// ─── Contact Form ─────────────────────────────────────────────────────────────
function ContactForm() {
  const { play } = useSound();
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!form.subject.trim()) newErrors.subject = "Subject is required";
    if (!form.message.trim()) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateField = (field: keyof FormState) => {
    const newErrors = { ...errors };
    if (field === "name" && !form.name.trim()) {
      newErrors.name = "Name is required";
    } else if (field === "email") {
      if (!form.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        newErrors.email = "Enter a valid email address";
      } else {
        const { email: _e, ...rest } = newErrors;
        void _e;
        setErrors(rest);
        return;
      }
    } else if (field === "subject" && !form.subject.trim()) {
      newErrors.subject = "Subject is required";
    } else if (field === "message" && !form.message.trim()) {
      newErrors.message = "Message is required";
    } else {
      const { [field]: _removed, ...rest } = newErrors;
      void _removed;
      setErrors(rest);
      return;
    }
    setErrors(newErrors);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      play("click");
      return;
    }
    setSending(true);
    play("whoosh");
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
      play("transition");
    }, 2000);
  };

  const handleReset = () => {
    setForm({ name: "", email: "", subject: "", message: "" });
    setErrors({});
    setSubmitted(false);
    play("click");
  };

  return (
    <AnimatePresence mode="wait">
      {submitted ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.4, ease: "backOut" }}
          className="rounded-2xl p-10 text-center"
          style={{
            background: "oklch(0.1 0.02 262 / 0.4)",
            backdropFilter: "blur(16px)",
            border: "1px solid oklch(0.75 0.31 262 / 0.12)",
            boxShadow: "0 0 40px oklch(0.75 0.31 262 / 0.06)",
          }}
          data-ocid="contact-success"
        >
          <AnimatedCheck />
          <h3
            className="font-display text-2xl font-bold mb-3 tracking-tight"
            style={{
              color: "oklch(0.75 0.31 262)",
              textShadow: "0 0 20px oklch(0.75 0.31 262 / 0.5)",
            }}
          >
            Message Sent!
          </h3>
          <p className="font-body text-muted-foreground mb-8 leading-relaxed">
            Thank you for reaching out, Tahsinullah will get back to you soon.
          </p>
          <MagneticButton>
            <button
              type="button"
              onClick={handleReset}
              className="px-8 py-3 rounded-xl font-display text-sm tracking-widest uppercase transition-all duration-300 min-h-[48px]"
              style={{
                background: "oklch(0.75 0.31 262 / 0.08)",
                border: "1px solid oklch(0.75 0.31 262 / 0.3)",
                color: "oklch(0.75 0.31 262)",
              }}
              data-ocid="contact-send-another"
            >
              Send Another
            </button>
          </MagneticButton>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          onSubmit={handleSubmit}
          noValidate
          className="rounded-2xl p-8 flex flex-col gap-5"
          style={{
            background: "oklch(0.1 0.02 262 / 0.4)",
            backdropFilter: "blur(16px)",
            border: "1px solid oklch(0.75 0.31 262 / 0.15)",
            boxShadow:
              "0 0 40px oklch(0.75 0.31 262 / 0.06), inset 0 0 20px oklch(0.75 0.31 262 / 0.02)",
          }}
          data-ocid="contact-form"
        >
          <div className="mb-1">
            <h3 className="font-display text-lg font-bold tracking-tight text-foreground">
              Send a Message
            </h3>
            <p className="font-mono text-xs text-muted-foreground tracking-widest mt-1">
              ALL FIELDS REQUIRED
            </p>
          </div>

          <FloatingInput
            id="contact-name"
            label="Your Name"
            value={form.name}
            error={errors.name}
            onChange={(v) => setForm((f) => ({ ...f, name: v }))}
            onBlur={() => validateField("name")}
            data-ocid="contact-name"
          />
          <FloatingInput
            id="contact-email"
            label="Email Address"
            type="email"
            value={form.email}
            error={errors.email}
            onChange={(v) => setForm((f) => ({ ...f, email: v }))}
            onBlur={() => validateField("email")}
            data-ocid="contact-email"
          />
          <FloatingInput
            id="contact-subject"
            label="Subject"
            value={form.subject}
            error={errors.subject}
            onChange={(v) => setForm((f) => ({ ...f, subject: v }))}
            onBlur={() => validateField("subject")}
            data-ocid="contact-subject"
          />
          <FloatingTextarea
            id="contact-message"
            label="Your Message"
            value={form.message}
            error={errors.message}
            rows={4}
            onChange={(v) => setForm((f) => ({ ...f, message: v }))}
            onBlur={() => validateField("message")}
            data-ocid="contact-message"
          />

          <MagneticButton className="w-full">
            <motion.button
              type="submit"
              disabled={sending}
              whileHover={{ scale: sending ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-xl font-display text-sm tracking-widest uppercase font-bold transition-all duration-300 min-h-[52px] flex items-center justify-center gap-3 relative overflow-hidden"
              style={{
                background: sending
                  ? "oklch(0.75 0.31 262 / 0.05)"
                  : "linear-gradient(135deg, oklch(0.75 0.31 262 / 0.15), oklch(0.68 0.25 303 / 0.15))",
                border: "1px solid oklch(0.75 0.31 262 / 0.5)",
                color: "oklch(0.75 0.31 262)",
                boxShadow: sending
                  ? "none"
                  : "0 0 20px oklch(0.75 0.31 262 / 0.15)",
              }}
              data-ocid="contact-submit"
            >
              {sending ? (
                <>
                  <motion.div
                    className="w-4 h-4 rounded-full border-2 border-current border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 0.7,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  />
                  Sending...
                </>
              ) : (
                <>
                  <Mail size={15} />
                  Send Message
                </>
              )}
            </motion.button>
          </MagneticButton>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

// ─── Contact Info (Left Column) ───────────────────────────────────────────────
function ContactInfo() {
  const { play } = useSound();

  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="flex flex-col gap-8"
    >
      {/* Tag */}
      <div
        className="font-mono text-xs tracking-[0.3em] uppercase"
        style={{ color: "oklch(0.75 0.31 262)" }}
      >
        {"// GET IN TOUCH"}
      </div>

      {/* Heading */}
      <div>
        <h2
          className="font-display text-[clamp(2rem,4vw,3.5rem)] font-black leading-none tracking-tight mb-6"
          style={{
            color: "oklch(0.98 0 0)",
            textShadow: "0 0 40px oklch(0.75 0.31 262 / 0.2)",
          }}
        >
          Let's Create
          <br />
          <span
            style={{
              color: "oklch(0.75 0.31 262)",
              textShadow:
                "0 0 20px oklch(0.75 0.31 262 / 0.8), 0 0 40px oklch(0.75 0.31 262 / 0.4)",
            }}
          >
            Something
          </span>
          <br />
          Extraordinary
        </h2>
        <p className="font-body text-muted-foreground text-base leading-relaxed max-w-sm">
          Have a project in mind? Want to collaborate? Or just want to say hi?
          I'd love to hear from you.
        </p>
      </div>

      {/* Contact methods */}
      <div className="flex flex-col gap-4">
        {/* Email */}
        <motion.a
          href="mailto:personal@tahsinullahriyad.world"
          whileHover={{ x: 4 }}
          transition={{ duration: 0.2 }}
          onClick={() => play("click")}
          className="flex items-center gap-4 group min-h-[48px]"
          data-ocid="contact-email-link"
        >
          <div
            className="flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0 transition-all duration-200"
            style={{
              background: "oklch(0.75 0.31 262 / 0.1)",
              border: "1px solid oklch(0.75 0.31 262 / 0.2)",
            }}
          >
            <Mail size={16} style={{ color: "oklch(0.75 0.31 262)" }} />
          </div>
          <div className="min-w-0">
            <div className="font-mono text-[0.6rem] tracking-widest uppercase text-muted-foreground mb-0.5">
              Email
            </div>
            <span
              className="font-body text-sm group-hover:underline break-all"
              style={{ color: "oklch(0.75 0.31 262)" }}
            >
              personal@tahsinullahriyad.world
            </span>
          </div>
        </motion.a>

        {/* WhatsApp contact method */}
        <motion.a
          href="https://wa.me/qr/E44HZE4NNWUSF1?text=Hi+Tahsinullah%2C+I%27d+like+to+work+with+you!"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ x: 4 }}
          transition={{ duration: 0.2 }}
          onClick={() => play("click")}
          className="flex items-center gap-4 group min-h-[48px]"
          data-ocid="contact-whatsapp-link"
        >
          <div
            className="flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0 transition-all duration-200"
            style={{
              background: "oklch(0.54 0.2 152 / 0.1)",
              border: "1px solid oklch(0.54 0.2 152 / 0.2)",
            }}
          >
            <MessageCircle size={16} style={{ color: "oklch(0.54 0.2 152)" }} />
          </div>
          <div className="min-w-0">
            <div className="font-mono text-[0.6rem] tracking-widest uppercase text-muted-foreground mb-0.5">
              WhatsApp
            </div>
            <span
              className="font-body text-sm group-hover:underline"
              style={{ color: "oklch(0.54 0.2 152)" }}
            >
              Quick chat
            </span>
          </div>
        </motion.a>
      </div>

      {/* WhatsApp CTA */}
      <MagneticButton strength={0.35}>
        <motion.a
          href="https://wa.me/qr/E44HZE4NNWUSF1?text=Hi+Tahsinullah%2C+I%27d+like+to+work+with+you!"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => play("click")}
          className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-display text-sm tracking-widest uppercase font-bold transition-all duration-300 min-h-[52px] w-full sm:w-auto"
          style={{
            background: "oklch(0.54 0.2 152 / 0.1)",
            border: "1px solid oklch(0.54 0.2 152 / 0.4)",
            color: "oklch(0.54 0.2 152)",
            boxShadow: "0 0 20px oklch(0.54 0.2 152 / 0.1)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow =
              "0 0 30px oklch(0.54 0.2 152 / 0.35), 0 0 60px oklch(0.54 0.2 152 / 0.15)";
            (e.currentTarget as HTMLElement).style.borderColor =
              "oklch(0.54 0.2 152 / 0.7)";
            (e.currentTarget as HTMLElement).style.background =
              "oklch(0.54 0.2 152 / 0.18)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow =
              "0 0 20px oklch(0.54 0.2 152 / 0.1)";
            (e.currentTarget as HTMLElement).style.borderColor =
              "oklch(0.54 0.2 152 / 0.4)";
            (e.currentTarget as HTMLElement).style.background =
              "oklch(0.54 0.2 152 / 0.1)";
          }}
          data-ocid="contact-whatsapp-cta"
        >
          <MessageCircle size={16} />
          Chat on WhatsApp
        </motion.a>
      </MagneticButton>

      {/* Decorative grid line */}
      <div
        className="w-full h-px mt-4"
        style={{
          background:
            "linear-gradient(90deg, oklch(0.75 0.31 262 / 0.4), transparent)",
        }}
      />
    </motion.div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function SectionFooter() {
  return (
    <footer
      className="mt-24 pt-8 pb-6"
      style={{ borderTop: "1px solid oklch(0.2 0.02 262 / 0.6)" }}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Left: brand */}
        <div className="flex items-center gap-3">
          <div
            className="font-display text-2xl font-black"
            style={{
              color: "oklch(0.75 0.31 262)",
              textShadow:
                "0 0 16px oklch(0.75 0.31 262 / 0.6), 0 0 32px oklch(0.75 0.31 262 / 0.3)",
            }}
          >
            TR
          </div>
          <div
            className="h-5 w-px"
            style={{ background: "oklch(0.2 0.02 262)" }}
          />
          <span className="font-mono text-xs text-muted-foreground tracking-widest uppercase">
            Tahsinullah Riyad
          </span>
        </div>

        {/* Center: copyright */}
        <p className="font-mono text-xs text-muted-foreground tracking-widest text-center">
          © {new Date().getFullYear()} Tahsinullah Riyad. All rights reserved.
        </p>

        {/* Right: social icons + caffeine */}
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/tahsinullahriyad"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-muted-foreground hover:text-primary transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
            data-ocid="footer-github"
          >
            <Github size={16} />
          </a>
          <a
            href="https://www.linkedin.com/in/tahsinullah-riyad-b16035304"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-muted-foreground hover:text-secondary transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
            data-ocid="footer-linkedin"
          >
            <Linkedin size={16} />
          </a>
          <a
            href="mailto:personal@tahsinullahriyad.world"
            aria-label="Email"
            className="text-muted-foreground hover:text-primary transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
            data-ocid="footer-email"
          >
            <Mail size={16} />
          </a>
          <div
            className="h-4 w-px"
            style={{ background: "oklch(0.2 0.02 262)" }}
          />
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors duration-200"
          >
            caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}

// ─── Contact Section (Main Export) ───────────────────────────────────────────
export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative min-h-screen py-24 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, transparent 0%, oklch(0.07 0.015 262 / 0.6) 40%, oklch(0.06 0 0) 100%)",
      }}
    >
      {/* Floating orb decorations */}
      <FloatingOrbs />

      {/* Radial glow behind content */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 80%, oklch(0.75 0.31 262 / 0.04) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header — minimal, tag only */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div
            className="font-mono text-xs tracking-[0.4em] uppercase mb-3"
            style={{ color: "oklch(0.75 0.31 262 / 0.6)" }}
          >
            {"// CONTACT"}
          </div>
          <div
            className="w-16 h-px mx-auto"
            style={{
              background:
                "linear-gradient(90deg, transparent, oklch(0.75 0.31 262 / 0.5), transparent)",
            }}
          />
        </motion.div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-start">
          {/* Left: info */}
          <div className="relative">
            <ContactInfo />
          </div>

          {/* Right: form */}
          <div className="relative">
            <ContactForm />
          </div>
        </div>

        {/* Footer */}
        <SectionFooter />
      </div>
    </section>
  );
}
