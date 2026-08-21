import { useEffect, useRef, useState } from "react";
import { gsap, worldState, isCoarsePointer, reducedMotion, scrollToId, ScrollTrigger } from "../lib/engine";
import { NAV_LINKS, SCENES, PROFILE } from "../data/profile";

/* ---------------- Preloader ---------------- */

const BOOT_LINES = [
  "Compiling insights…",
  "Warming query engine…",
  "Indexing experience…",
  "Calibrating dashboards…",
  "Establishing data link…",
];

export function Preloader({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0);
  const [line, setLine] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef(false);

  useEffect(() => {
    const fast = reducedMotion();
    let v = 0;
    const iv = window.setInterval(() => {
      v = Math.min(100, v + (fast ? 34 : 2 + Math.random() * 5.5));
      setPct(Math.floor(v));
      setLine(Math.min(BOOT_LINES.length - 1, Math.floor((v / 100) * BOOT_LINES.length)));
      if (v >= 100 && !doneRef.current) {
        doneRef.current = true;
        window.clearInterval(iv);
        const el = rootRef.current;
        if (el && !fast) {
          gsap.to(el, {
            opacity: 0,
            duration: 0.7,
            ease: "power2.inOut",
            delay: 0.25,
            onComplete: () => onDone(),
          });
          gsap.to(el.querySelector(".boot-bar-fill"), { scaleX: 1, duration: 0.2 });
        } else {
          window.setTimeout(onDone, 120);
        }
      }
    }, fast ? 40 : 55);
    return () => window.clearInterval(iv);
  }, [onDone]);

  return (
    <div ref={rootRef} className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-bg0" role="status" aria-label="Loading portfolio">
      <div className="mono text-[0.62rem] tracking-[0.5em] text-faint mb-6">RAJASHEKAR.SYS</div>
      <div className="display text-5xl md:text-6xl text-ink">
        ER<span className="text-teal">_</span>
      </div>
      <div className="mt-8 h-px w-56 bg-line overflow-hidden">
        <div className="boot-bar-fill h-full w-full origin-left bg-teal" style={{ transform: `scaleX(${pct / 100})` }} />
      </div>
      <div className="mono mt-4 text-[0.68rem] tracking-[0.25em] text-dim flex items-center gap-3">
        <span className="text-teal">{String(pct).padStart(3, "0")}%</span>
        <span>{BOOT_LINES[line]}</span>
      </div>
    </div>
  );
}

/* ---------------- Custom cursor ---------------- */

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isCoarsePointer() || reducedMotion()) return;
    let x = -100, y = -100, rx = -100, ry = -100;
    let raf = 0;
    const move = (e: MouseEvent) => { x = e.clientX; y = e.clientY; };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const hot = t.closest("a, button, [data-cursor]");
      ringRef.current?.classList.toggle("is-hover", !!hot);
    };
    const loop = () => {
      raf = requestAnimationFrame(loop);
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      if (dotRef.current) dotRef.current.style.transform = `translate(${x - 3}px, ${y - 3}px)`;
      if (ringRef.current) ringRef.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
    };
    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseover", over, { passive: true });
    loop();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
    };
  }, []);

  if (isCoarsePointer() || reducedMotion()) return null;
  return (
    <>
      <div ref={ringRef} className="cursor-ring hidden lg:block" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot hidden lg:block" aria-hidden="true" />
    </>
  );
}

/* ---------------- Top progress hairline + HUD ---------------- */

function Readouts() {
  const pctRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const camRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const p = worldState.p;
      if (pctRef.current) pctRef.current.textContent = String(Math.round(p * 100)).padStart(3, "0");
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      if (camRef.current) camRef.current.textContent = `CAM.Z ${String(Math.round(-p * 640)).padStart(4, "0")}`;
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-line/40">
        <div ref={barRef} className="h-full w-full origin-left bg-gradient-to-r from-teal to-amber" style={{ transform: "scaleX(0)" }} />
      </div>
      <div className="fixed bottom-5 left-5 z-40 hidden md:flex items-center gap-3 mono text-[0.62rem] tracking-[0.22em] text-faint border border-line/70 bg-bg0/70 backdrop-blur-sm px-3 py-2">
        <span className="text-teal"><span ref={pctRef}>000</span>%</span>
        <span className="w-px h-3 bg-line2" />
        <span ref={camRef}>CAM.Z 0000</span>
      </div>
    </>
  );
}

function SceneRail({ active }: { active: string }) {
  return (
    <nav aria-label="Scene navigation" className="fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-end gap-[0.7rem]">
      {SCENES.map((s) => {
        const isActive = s.id === active;
        return (
          <button
            key={s.id}
            onClick={() => scrollToId(s.id)}
            className="group flex items-center gap-2.5 cursor-pointer"
            aria-label={`Go to scene ${s.index} — ${s.label}`}
            aria-current={isActive ? "true" : undefined}
          >
            <span className={`mono text-[0.58rem] tracking-[0.2em] transition-all duration-300 ${isActive ? "text-amber opacity-100 translate-x-0" : "text-faint opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"}`}>
              {s.index} {s.label.toUpperCase()}
            </span>
            <span className={`block transition-all duration-300 ${isActive ? "w-6 h-[3px] bg-amber" : "w-3 h-[2px] bg-line2 group-hover:bg-teal"}`} />
          </button>
        );
      })}
    </nav>
  );
}

/* ---------------- Navigation ---------------- */

export function Nav({ active }: { active: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "py-3" : "py-5"}`}>
        <div className={`mx-auto max-w-[1500px] px-5 md:px-10 flex items-center justify-between transition-all duration-500 ${scrolled ? "" : ""}`}>
          <a href="#home" className="flex items-center gap-3 group" aria-label="Back to top">
            <span className="display grid place-items-center w-9 h-9 border border-line2 text-teal text-sm bg-panel/80 backdrop-blur transition-colors duration-300 group-hover:border-teal group-hover:text-amber">
              ER
            </span>
            <span className="hidden sm:block">
              <span className="block display text-[0.82rem] leading-none text-ink tracking-wide">ELLURI RAJASHEKAR</span>
              <span className="mono block text-[0.56rem] tracking-[0.3em] text-faint mt-1">DATA · BI · AUTOMATION</span>
            </span>
          </a>

          <nav aria-label="Primary" className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((l) => {
              const isActive = active === l.href.slice(1);
              return (
                <a
                  key={l.href}
                  href={l.href}
                  className={`relative px-3.5 py-2 mono text-[0.66rem] tracking-[0.22em] uppercase transition-colors duration-300 ${isActive ? "text-teal" : "text-dim hover:text-ink"}`}
                >
                  {l.label}
                  <span className={`absolute left-3.5 right-3.5 bottom-1 h-px bg-teal transition-transform duration-300 origin-left ${isActive ? "scale-x-100" : "scale-x-0"}`} />
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={PROFILE.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor
              className="hidden md:inline-flex btn-magnetic items-center gap-2 border border-line2 px-4 py-2 mono text-[0.64rem] tracking-[0.22em] uppercase text-dim hover:text-bg0 hover:bg-teal hover:border-teal bg-panel/70 backdrop-blur"
            >
              Resume
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true"><path d="M2 8L8 2M8 2H3.5M8 2V6.5" stroke="currentColor" strokeWidth="1.4" /></svg>
            </a>
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden grid place-items-center w-10 h-10 border border-line2 bg-panel/80 backdrop-blur text-ink"
              aria-label="Open menu"
              aria-expanded={open}
            >
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden="true"><path d="M0 1h16M0 6h10M0 11h16" stroke="currentColor" strokeWidth="1.5" /></svg>
            </button>
          </div>
        </div>
      </header>

      {/* mobile menu */}
      <div className={`fixed inset-0 z-[70] lg:hidden transition-all duration-500 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="absolute inset-0 bg-bg0/95 backdrop-blur-md" onClick={() => setOpen(false)} />
        <div className="relative h-full flex flex-col px-7 pt-5 pb-10">
          <div className="flex items-center justify-between">
            <span className="mono text-[0.6rem] tracking-[0.4em] text-faint">NAVIGATE</span>
            <button onClick={() => setOpen(false)} className="grid place-items-center w-10 h-10 border border-line2 text-ink" aria-label="Close menu">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" /></svg>
            </button>
          </div>
          <nav aria-label="Mobile" className="mt-10 flex flex-col gap-1">
            {NAV_LINKS.map((l, i) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`display text-[2rem] leading-tight py-2 border-b border-line/60 flex items-baseline gap-4 transition-all duration-500 ${open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"} ${active === l.href.slice(1) ? "text-teal" : "text-ink"}`}
                style={{ transitionDelay: `${80 + i * 55}ms` }}
              >
                <span className="mono text-[0.6rem] text-faint tracking-[0.2em]">0{i + 1}</span>
                {l.label}
              </a>
            ))}
          </nav>
          <div className="mt-auto mono text-[0.64rem] tracking-[0.18em] text-dim space-y-2">
            <a className="block text-teal" href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
            <div className="text-faint">{PROFILE.location.toUpperCase()}</div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------------- Active section tracking + composition ---------------- */

export function useActiveSection(): string {
  const [active, setActive] = useState("home");
  useEffect(() => {
    const triggers = SCENES.map((s) => {
      const el = document.getElementById(s.id);
      if (!el) return null;
      return ScrollTrigger.create({
        trigger: el,
        start: "top 55%",
        end: "bottom 45%",
        onToggle: (self) => { if (self.isActive) setActive(s.id); },
      });
    });
    return () => triggers.forEach((t) => t?.kill());
  }, []);
  return active;
}

export function Chrome({ booted, onBoot }: { booted: boolean; onBoot: () => void }) {
  const active = useActiveSection();
  return (
    <>
      {!booted && <Preloader onDone={onBoot} />}
      <Readouts />
      <Nav active={active} />
      <SceneRail active={active} />
      <Cursor />
    </>
  );
}
