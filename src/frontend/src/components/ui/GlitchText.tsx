import { useCallback, useEffect, useRef, useState } from "react";

interface Props {
  text: string;
  className?: string;
  triggerOnMount?: boolean;
  delay?: number;
  tag?: "h1" | "h2" | "h3" | "span" | "p";
}

const GLITCH_CHARS = "!<>-_\\/[]{}—=+*^?#@$%&0123456789ABCDEF";

function randomChar() {
  return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
}

export default function GlitchText({
  text,
  className = "",
  triggerOnMount = true,
  delay = 0,
  tag: Tag = "span",
}: Props) {
  const [displayText, setDisplayText] = useState(triggerOnMount ? "" : text);
  const [isGlitching, setIsGlitching] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runGlitch = useCallback(() => {
    setIsGlitching(true);
    let iteration = 0;
    const totalIterations = text.length * 3;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (i < iteration / 3) return char;
            return randomChar();
          })
          .join(""),
      );

      iteration++;
      if (iteration >= totalIterations) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(text);
        setIsGlitching(false);
      }
    }, 30);
  }, [text]);

  useEffect(() => {
    if (!triggerOnMount) return;
    timeoutRef.current = setTimeout(runGlitch, delay);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [triggerOnMount, delay, runGlitch]);

  const handleMouseEnter = () => {
    if (!isGlitching) runGlitch();
  };

  return (
    <Tag
      className={`${className} font-mono`}
      onMouseEnter={handleMouseEnter}
      data-text={text}
      aria-label={text}
    >
      {displayText || "\u00A0"}
    </Tag>
  );
}
