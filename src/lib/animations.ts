import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let initialized = false;

const fromVarsMap: Record<string, Record<string, number>> = {
  bottom: { opacity: 0, y: 40 },
  left: { opacity: 0, x: -40 },
  right: { opacity: 0, x: 40 },
  fade: { opacity: 0 },
};

export function initRevealAnimations(): void {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
    const delay = parseFloat(el.dataset.revealDelay ?? "0");
    const from = el.dataset.revealFrom ?? "bottom";
    const fromVars = fromVarsMap[from] ?? fromVarsMap.bottom;

    gsap.from(el, {
      ...fromVars,
      duration: 0.8,
      delay,
      ease: "power3.out",
      clearProps: "transform",
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        once: true,
      },
    });
  });
}
