import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export function useScrollReveal(selector: string, vars?: gsap.TweenVars) {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        selector,
        { opacity: 0, y: 40, ...vars },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: selector,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );
    });
    return () => ctx.revert();
  }, [selector, vars]);
}
