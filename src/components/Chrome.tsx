import { useEffect, useRef, useState } from "react";
import {
  gsap, reducedMotion, scrollToId, getTheme, toggleTheme, THEME_EVENT, worldState, type ThemeName,
} from "../lib/engine";
import { PROFILE } from "../data/profile";

const RESUME_LABEL = "Resume";

const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "workflow", label: "Workflow" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "tools", label: "Explore" },
  { id: "contact", label: "Contact" },
];

const SCENES = [
  "Intro", "Insight", "Impact", "Education", "Toolbox", "Pipeline",
  "Career", "Projects", "Lab", "Intelligence", "Signal",
];

/* ---------------- theme toggle ---------------- */

function ThemeToggle() {
  const [theme, setThemeState] = useState<ThemeName>(() => getTheme());
  useEffect(() => {
    const onTheme = (e: Event) => setThemeState((e as CustomEvent<ThemeName>).detail);
    window.addEventListener(THEME_EVENT, onTheme);
    return () => window.removeEventListener(THEME_EVENT, onTheme);
  }, []);
  return (
    <button
      type="button"
      className="theme-toggle shrink-0"
      onClick={() => toggleTheme()}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={theme === "light"}
      title={theme === "dark" ? "Light mode" : "Dark mode"}
      data-cursor
    >
      {/* sun — shown in dark mode */}
      <svg className="icon-sun" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="3.1" stroke="currentColor" strokeWidth="1.4" />
        <path d="M8 1v1.6M8 13.4V15M1 8h1.6M13.4 8H15M3 3l1.1 1.1M11.9 11.9L13 13M13 3l-1.1 1.1M4.1 11.9L3 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
      {/* moon — shown in light mode */}
      <svg className="icon-moon" width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
        <path d="M12.6 9.2A5.6 5.6 0 0 1 5.8 2.4a.4.4 0 0 0-.5-.5 6.6 6.6 0 1 0 7.8 7.8.4.4 0 0 0-.5-.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

/* ---------------- preloader ---------------- */

function Preloader({ onDone }: { onDone: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      onDone();
      const el = rootRef.current;
      if (!el) return;
      if (reducedMotion()) {
        el.remove();
        return;
      }
      gsap.to(el, {
        yPercent: -100,
        duration: 0.7,
        ease: "power3.inOut",
        onComplete: () => el.remove(),
      });
      // failsafe: never let the overlay stick if the tween is throttled
      window.setTimeout(() => el.remove(), 1200);
    };

    if (reducedMotion()) {
      setPct(100);
      finish();
      return;
    }
    const obj = { v: 0 };
    const tween = gsap.to(obj, {
      v: 100,
      duration: 1.25,
      ease: "power2.inOut",
      onUpdate: () => setPct(Math.round(obj.v)),
      onComplete: finish,
    });
    // Failsafes: background tabs / unfocused preview iframes throttle rAF,
    // which would freeze the tween — force completion regardless.
    const hard = window.setTimeout(finish, 2400);
    const onVisible = () => {
      if (!document.hidden && tween.progress() < 1) tween.progress(1);
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      tween.kill();
      window.clearTimeout(hard);
      document.removeEventListener("visibilitychange", onVisible);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={rootRef} className="preloader-shell fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg0">
      <div className="mono text-[0.62rem] tracking-[0.42em] text-faint">INITIALIZING DATA STREAMS</div>
      <div className="display mt-4 text-5xl md:text-6xl font-bold text-ink tabular-nums">
        {pct}
        <span className="text-teal">%</span>
      </div>
      <div className="mt-6 h-px w-56 bg-line overflow-hidden">
        <div className="h-full bg-teal transition-[width] duration-150 ease-out" style={{ width: `${pct}%` }} />
      </div>
      <div className="mono mt-6 text-[0.6rem] tracking-[0.3em] text-dim">
        {PROFILE.name.toUpperCase()} — {PROFILE.role.toUpperCase()}
      </div>
    </div>
  );
}

/* ---------------- top progress hairline ---------------- */

function ProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reducedMotion()) return;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? worldState.y / max : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${Math.min(1, p)})`;
    };
    const ctx = gsap.context(() => {
      gsap.ticker.add(onScroll);
    });
    return () => ctx.revert();
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-[80] h-[2px] bg-line/40" aria-hidden="true">
      <div ref={barRef} className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-teal via-teal to-amber" />
    </div>
  );
}

/* ---------------- navigation ---------------- */

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.id);
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-42% 0px -52% 0px", threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => {
    setOpen(false);
    scrollToId(id);
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-[85] transition-all duration-500 border-b ${
        scrolled ? "border-line/70 bg-bg0/78 backdrop-blur-md py-2.5" : "border-transparent bg-transparent py-4"
      }`}
    >
      <nav className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-5 md:px-10" aria-label="Primary">
        <a href="#home" onClick={(e) => { e.preventDefault(); go("home"); }} className="flex items-center gap-3" data-cursor>
          <span className="display grid h-9 w-9 place-items-center border border-line2 bg-panel text-[0.9rem] font-bold text-teal">
            ER
          </span>
          <span className="hidden sm:block">
            <span className="display block text-[0.95rem] font-semibold leading-none text-ink">{PROFILE.name}</span>
            <span className="mono mt-1 block text-[0.52rem] tracking-[0.3em] text-faint uppercase">{PROFILE.roleShort}</span>
          </span>
        </a>

        <ul className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                onClick={(e) => { e.preventDefault(); go(l.id); }}
                data-cursor
                className={`mono relative px-3 py-2 text-[0.62rem] tracking-[0.24em] uppercase transition-colors duration-300 ${
                  active === l.id ? "text-teal" : "text-dim hover:text-ink"
                }`}
              >
                {l.label}
                <span
                  className={`absolute left-3 right-3 -bottom-0.5 h-px bg-teal transition-transform duration-300 origin-left ${
                    active === l.id ? "scale-x-100" : "scale-x-0"
                  }`}
                  aria-hidden="true"
                />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <a
            href={PROFILE.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor
            className="hidden md:inline-flex items-center gap-2 border border-line2 px-4 py-2.5 mono text-[0.6rem] tracking-[0.22em] uppercase text-dim transition-colors duration-300 hover:border-amber hover:text-amber"
          >
            <svg width="10" height="12" viewBox="0 0 10 12" fill="none" aria-hidden="true">
              <path d="M5 1v7M5 8L2 5M5 8l3-3M1.5 10.5h7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            {RESUME_LABEL}
          </a>
          <button
            type="button"
            className="lg:hidden grid h-9 w-9 place-items-center border border-line2 text-ink"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden="true">
              {open ? (
                <path d="M2 1l12 10M14 1L2 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              ) : (
                <path d="M1 1.5h14M1 6h10M1 10.5h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* mobile overlay menu */}
      <div
        className={`lg:hidden fixed inset-0 top-0 z-[-1] bg-bg0/97 backdrop-blur-lg transition-all duration-400 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <nav className="flex h-full flex-col justify-center px-8" aria-label="Mobile">
          <ul className="space-y-2">
            {NAV_LINKS.map((l, i) => (
              <li key={l.id} style={{ transitionDelay: `${i * 40}ms` }} className={open ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"} >
                <a
                  href={`#${l.id}`}
                  onClick={(e) => { e.preventDefault(); go(l.id); }}
                  className={`display block py-2.5 text-3xl font-semibold transition-colors duration-300 ${
                    active === l.id ? "text-teal" : "text-ink"
                  }`}
                >
                  <span className="mono mr-4 text-[0.6rem] text-faint align-middle">0{i + 1}</span>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={PROFILE.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex w-max items-center gap-2 border border-line2 px-5 py-3 mono text-[0.62rem] tracking-[0.22em] uppercase text-dim"
          >
            {RESUME_LABEL}
          </a>
        </nav>
      </div>
    </header>
  );
}

/* ---------------- left scene rail ---------------- */

function SceneRail() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const ids = ["home", "about", "impact", "education", "toolbox", "workflow", "experience", "projects", "tools", "intel", "contact"];
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(ids.indexOf(e.target.id));
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <aside className="fixed left-5 top-1/2 z-40 hidden xl:flex -translate-y-1/2 flex-col gap-[7px]" aria-label="Scene index">
      {SCENES.map((s, i) => (
        <button
          key={s}
          type="button"
          onClick={() => scrollToId(["home", "about", "impact", "education", "toolbox", "workflow", "experience", "projects", "tools", "intel", "contact"][i])}
          className="group flex items-center gap-2.5 py-[3px]"
          aria-label={`Go to scene ${i + 1}: ${s}`}
          aria-current={active === i}
        >
          <span
            className={`h-px transition-all duration-400 ${
              active === i ? "w-7 bg-amber" : "w-3.5 bg-line2 group-hover:w-5 group-hover:bg-faint"
            }`}
          />
          <span
            className={`mono text-[0.52rem] tracking-[0.26em] uppercase transition-opacity duration-300 ${
              active === i ? "text-ink opacity-100" : "opacity-0 group-hover:opacity-60 text-faint"
            }`}
          >
            {s}
          </span>
        </button>
      ))}
    </aside>
  );
}

/* ---------------- bottom HUD ---------------- */

function Hud() {
  const [scene, setScene] = useState(0);
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const ids = ["home", "about", "impact", "education", "toolbox", "workflow", "experience", "projects", "tools", "intel", "contact"];
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setScene(Math.max(0, ids.indexOf(e.target.id)));
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setPct(max > 0 ? Math.round((window.scrollY / max) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { obs.disconnect(); window.removeEventListener("scroll", onScroll); };
  }, []);

  return (
    <div className="fixed bottom-5 left-5 z-40 hidden md:flex items-center gap-3 mono text-[0.62rem] tracking-[0.22em] text-faint border border-line/70 bg-bg0/70 backdrop-blur-sm px-3 py-2">
      <span className="text-teal">SCENE {String(scene + 1).padStart(2, "0")}</span>
      <span aria-hidden="true">/</span>
      <span>{SCENES[scene].toUpperCase()}</span>
      <span className="h-3 w-px bg-line2" aria-hidden="true" />
      <span className="tabular-nums">{pct}%</span>
    </div>
  );
}

/* ---------------- custom cursor ---------------- */

function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reducedMotion() || !window.matchMedia("(pointer: fine)").matches) return;
    const dot = dotRef.current!;
    const ring = ringRef.current!;
    const dx = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3" });
    const dy = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3" });
    const rx = gsap.quickTo(ring, "x", { duration: 0.42, ease: "power3" });
    const ry = gsap.quickTo(ring, "y", { duration: 0.42, ease: "power3" });
    const move = (e: PointerEvent) => {
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      ring.classList.toggle("is-hover", !!t.closest("[data-cursor], a, button"));
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
    };
  }, []);
  if (reducedMotion()) return null;
  return (
    <>
      <div ref={dotRef} className="cursor-dot hidden md:block" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring hidden md:block" aria-hidden="true" />
    </>
  );
}

/* ---------------- chrome shell ---------------- */

export function Chrome({ booted, onBoot }: { booted: boolean; onBoot: () => void }) {
  const [showPre, setShowPre] = useState(true);
  useEffect(() => {
    if (booted) {
      const t = window.setTimeout(() => setShowPre(false), 900);
      return () => window.clearTimeout(t);
    }
  }, [booted]);

  return (
    <>
      {showPre && <Preloader onDone={onBoot} />}
      <ProgressBar />
      <Nav />
      <SceneRail />
      <Hud />
      <Cursor />
    </>
  );
}
