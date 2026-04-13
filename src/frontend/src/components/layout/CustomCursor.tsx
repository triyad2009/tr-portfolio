import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const mouse = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    // Hide on touch devices
    if (window.matchMedia("(hover: none)").matches) return;

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const onEnter = () => setIsVisible(true);
    const onLeave = () => setIsVisible(false);

    const onHoverStart = (e: MouseEvent) => {
      const target = e.target as Element;
      if (
        target.closest(
          'a, button, [role="button"], input, textarea, select, [data-magnetic]',
        )
      ) {
        setIsHovering(true);
      }
    };

    const onHoverEnd = () => setIsHovering(false);

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseover", onHoverStart);
    document.addEventListener("mouseout", onHoverEnd);

    // Lerp ring towards dot
    const animate = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.12;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.12;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouse.current.x - 4}px, ${mouse.current.y - 4}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x - 20}px, ${ring.current.y - 20}px)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseover", onHoverStart);
      document.removeEventListener("mouseout", onHoverEnd);
      cancelAnimationFrame(rafRef.current);
    };
  }, [isVisible]);

  // Only render on desktop
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(hover: none)").matches
  )
    return null;

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none"
        style={{
          zIndex: 99999,
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "oklch(0.75 0.31 262)",
          boxShadow: "0 0 8px oklch(0.75 0.31 262 / 0.9)",
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.2s",
          willChange: "transform",
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none"
        style={{
          zIndex: 99998,
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: `1.5px solid ${isHovering ? "oklch(0.75 0.31 262)" : "oklch(0.75 0.31 262 / 0.4)"}`,
          boxShadow: isHovering
            ? "0 0 12px oklch(0.75 0.31 262 / 0.6)"
            : "none",
          transform: isHovering ? "scale(1.5)" : "scale(1)",
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.2s, border-color 0.2s, box-shadow 0.2s",
          willChange: "transform",
        }}
      />
    </>
  );
}
