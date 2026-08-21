import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export type ThemeName = "dark" | "light";

const THEME_KEY = "er-theme";
export const THEME_EVENT = "er-theme";

/** Shared world state read by the Three.js frame loop */
export const worldState = {
  y: 0,
  my: 0,
  mx: 0,
  theme: (typeof document !== "undefined" &&
    (document.documentElement.getAttribute("data-theme") as ThemeName)) || "dark",
};

export function reducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isCoarsePointer(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
}

export function getTheme(): ThemeName {
  const t = document.documentElement.getAttribute("data-theme");
  return t === "light" ? "light" : "dark";
}

export function setTheme(theme: ThemeName) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* private mode */
  }
  worldState.theme = theme;
  window.dispatchEvent(new CustomEvent<ThemeName>(THEME_EVENT, { detail: theme }));
}

export function toggleTheme() {
  setTheme(getTheme() === "dark" ? "light" : "dark");
}

let lenis: Lenis | null = null;

export function initEngine() {
  // Respect reduced motion: skip Lenis, GSAP animations elsewhere degrade to static.
  if (!reducedMotion()) {
    lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenis.on("scroll", (l: Lenis) => {
      worldState.y = l.animatedScroll;
      ScrollTrigger.update();
    });
    gsap.ticker.add((time) => {
      lenis?.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  } else {
    worldState.y = window.scrollY;
    window.addEventListener("scroll", () => {
      worldState.y = window.scrollY;
      ScrollTrigger.update();
    });
  }

  // pointer parallax (fine pointers only)
  if (typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener(
      "pointermove",
      (e) => {
        worldState.mx = (e.clientX / window.innerWidth) * 2 - 1;
        worldState.my = (e.clientY / window.innerHeight) * 2 - 1;
      },
      { passive: true }
    );
  }

  window.addEventListener("load", () => {
    requestAnimationFrame(() => ScrollTrigger.refresh());
  });
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(el, { offset: 0, duration: 1.6 });
  } else {
    el.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth" });
  }
}

export function refreshTriggers() {
  requestAnimationFrame(() => ScrollTrigger.refresh());
}
