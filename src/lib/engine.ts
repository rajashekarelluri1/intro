import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

/** Shared mutable state read by the WebGL world + HUD every frame. */
export const worldState = {
  p: 0, // overall document scroll progress 0..1
  y: 0, // raw scrollY
  mx: 0, // mouse x -1..1
  my: 0, // mouse y -1..1
  ready: false, // preloader finished
};

export const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isCoarsePointer = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(pointer: coarse)").matches;

let lenisInstance: Lenis | null = null;

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenisInstance && !reducedMotion()) {
    lenisInstance.scrollTo(el, { duration: 1.5, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
  } else {
    el.scrollIntoView({ behavior: "auto", block: "start" });
  }
}

/** Boots Lenis + ScrollTrigger sync + global progress tracking. Returns cleanup. */
export function initEngine(): () => void {
  const listeners: Array<[EventTarget, string, EventListener]> = [];
  const on = (t: EventTarget, e: string, fn: EventListener) => {
    t.addEventListener(e, fn, { passive: true });
    listeners.push([t, e, fn]);
  };

  const prefersReduced = reducedMotion();

  if (!prefersReduced) {
    lenisInstance = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisInstance.on("scroll", () => ScrollTrigger.update());
    const raf = (time: number) => lenisInstance?.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
  }

  const readScroll = () => {
    worldState.y = window.scrollY || document.documentElement.scrollTop;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    worldState.p = max > 0 ? Math.min(1, Math.max(0, worldState.y / max)) : 0;
  };
  on(window, "scroll", readScroll);
  readScroll();

  if (!isCoarsePointer()) {
    on(window, "mousemove", ((e: MouseEvent) => {
      worldState.mx = (e.clientX / window.innerWidth) * 2 - 1;
      worldState.my = (e.clientY / window.innerHeight) * 2 - 1;
    }) as EventListener);
  }

  // Anchor links → smooth programmatic scroll
  const onClick = ((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const anchor = target.closest<HTMLAnchorElement>('a[href^="#"]');
    if (!anchor) return;
    const href = anchor.getAttribute("href") || "";
    if (href.length > 1) {
      e.preventDefault();
      scrollToId(href.slice(1));
    }
  }) as EventListener;
  document.addEventListener("click", onClick);
  listeners.push([document, "click", onClick]);

  let refreshTimer: number | undefined;
  const onResize = () => {
    window.clearTimeout(refreshTimer);
    refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 180);
  };
  on(window, "resize", onResize);

  return () => {
    listeners.forEach(([t, e, fn]) => t.removeEventListener(e, fn));
    if (lenisInstance) {
      lenisInstance.destroy();
      lenisInstance = null;
    }
    ScrollTrigger.getAll().forEach((t) => t.kill());
  };
}
