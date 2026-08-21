import { useEffect, useRef } from "react";
import { gsap, reducedMotion, ScrollTrigger, worldState } from "../lib/engine";
import { CountUp, Reveal, Scramble, TypeLoop } from "../lib/fx";
import { HERO_METRICS, PROFILE, SKILL_TICKER } from "../data/profile";

function WaveGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="inline-block -mt-0.5">
      <path d="M1 8c1.5-3 3-3 4 0s2.5 3 4 0 2.5-3 4 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export default function Hero({ booted }: { booted: boolean }) {
  const runwayRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion()) return;
    const ctx = gsap.context(() => {
      const runway = runwayRef.current;
      if (!runway) return;
      gsap.to("[data-hero-name]", {
        yPercent: -22, opacity: 0.12, scale: 0.92, ease: "none",
        scrollTrigger: { trigger: runway, start: "top top", end: "bottom bottom", scrub: 0.7 },
      });
      gsap.to("[data-hero-panel]", {
        xPercent: 30, opacity: 0, ease: "none",
        scrollTrigger: { trigger: runway, start: "20% top", end: "85% bottom", scrub: 0.7 },
      });
      gsap.to("[data-hero-copy]", {
        y: -60, opacity: 0.25, ease: "none",
        scrollTrigger: { trigger: runway, start: "top top", end: "bottom bottom", scrub: 0.7 },
      });
      gsap.to("[data-hero-photo]", {
        yPercent: -14, ease: "none",
        scrollTrigger: { trigger: runway, start: "top top", end: "bottom bottom", scrub: 0.8 },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // pointer parallax on the portrait (fine pointers only)
  useEffect(() => {
    if (reducedMotion() || !window.matchMedia("(pointer: fine)").matches) return;
    const el = photoRef.current;
    if (!el) return;
    const qx = gsap.quickTo(el, "x", { duration: 0.9, ease: "power3" });
    const qy = gsap.quickTo(el, "y", { duration: 0.9, ease: "power3" });
    let raf = 0;
    const onMove = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        qx(worldState.mx * 14);
        qy(worldState.my * 10);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 250);
    return () => window.clearTimeout(t);
  }, [booted]);

  return (
    <section id="home" ref={sectionRef} aria-label="Introduction — Elluri Rajashekar, Data Analyst and BI Expert" className="relative">
      <div ref={runwayRef} className="hero-runway relative h-[185vh]">
        <div className="hero-sticky sticky top-0 hdvh flex flex-col overflow-hidden">
          {/* vertical side meta */}
          <div className="hidden md:flex absolute left-5 top-1/2 -translate-y-1/2 -rotate-180 items-center gap-4 mono text-[0.58rem] tracking-[0.42em] text-faint [writing-mode:vertical-rl]">
            <span>PORTFOLIO — DATA &amp; BI</span>
            <span className="w-px h-14 bg-line2 inline-block" />
            <span className="text-teal">{PROFILE.location.toUpperCase()}</span>
          </div>

          <div className="hero-content flex-1 w-full max-w-[1500px] mx-auto px-5 md:px-10 lg:px-16 grid lg:grid-cols-[7fr_5fr] gap-10 items-end pb-8 pt-24 md:pt-28">
            {/* identity */}
            <div data-hero-copy>
              <Reveal delay={0.15}>
                <p className="kicker flex items-center gap-3">
                  {/* compact portrait on small screens */}
                  <img
                    src={PROFILE.photoUrl}
                    alt={PROFILE.photoAlt}
                    width={112}
                    height={112}
                    decoding="async"
                    className="h-24 w-24 rounded-full border border-line2 object-cover lg:hidden"
                    style={{ boxShadow: "var(--shadow)" }}
                  />
                  <span className="hidden lg:inline-flex"><WaveGlyph /></span>
                  <span>{PROFILE.greeting} —</span>
                  <span className="inline-block w-1.5 h-1.5 bg-teal rounded-full pulse-dot" aria-hidden="true" />
                </p>
              </Reveal>

              <div data-hero-name className="mt-4 md:mt-5 will-change-transform">
                <h1 className="display font-bold text-ink leading-[0.92] text-[clamp(3.6rem,6.5vw,7rem)]">
                  <Scramble text="ELLURI" as="span" className="block" delay={1150} />
                  <Scramble text="RAJASHEKAR" as="span" className="block" delay={1500} />
                </h1>
                <div className="mt-4 md:mt-5 mono text-[0.72rem] md:text-[0.95rem] tracking-[0.3em] text-teal">
                  <TypeLoop words={PROFILE.typeWords} startDelay={2100} />
                </div>
              </div>

              <Reveal delay={1.05} className="mt-5 md:mt-7 max-w-xl">
                <p className="text-dim text-[0.95rem] md:text-[1.08rem] leading-relaxed">
                  {PROFILE.intro}
                </p>
              </Reveal>

              <Reveal delay={1.25} className="mt-6 md:mt-9 flex flex-wrap items-center gap-3 md:gap-4">
                <a
                  href="#projects"
                  data-cursor
                  className="btn-magnetic group inline-flex items-center gap-3 bg-teal text-bg0 px-6 md:px-7 py-3.5 display text-[0.9rem] md:text-[0.95rem] font-semibold hover:bg-amber"
                >
                  Explore My Work
                  <svg width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden="true" className="transition-transform duration-300 group-hover:translate-y-0.5">
                    <path d="M6 1v11M6 12L1.5 7.5M6 12l4.5-4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </a>
                <a
                  href="#contact"
                  data-cursor
                  className="btn-magnetic inline-flex items-center gap-3 border border-line2 text-ink px-6 md:px-7 py-3.5 display text-[0.9rem] md:text-[0.95rem] hover:border-teal hover:text-teal"
                >
                  Get In Touch
                </a>
                <a
                  href={PROFILE.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mono text-[0.62rem] tracking-[0.24em] uppercase text-faint hover:text-amber transition-colors duration-300 inline-flex items-center gap-2"
                >
                  Download Resume
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true"><path d="M2 8L8 2M8 2H3.5M8 2V6.5" stroke="currentColor" strokeWidth="1.3" /></svg>
                </a>
              </Reveal>
            </div>

            {/* portrait + live readout panel */}
            <div data-hero-panel className="hidden lg:block will-change-transform">
              <Reveal delay={0.7}>
                <div className="mb-7 flex justify-end pr-1">
                  <div ref={photoRef} data-hero-photo className="photo-frame hero-portrait group relative will-change-transform">
                    <svg
                      className="photo-ring absolute -inset-3 text-teal/50"
                      style={{ width: "calc(100% + 24px)", height: "calc(100% + 24px)" }}
                      viewBox="0 0 100 100" fill="none" aria-hidden="true"
                    >
                      <circle cx="50" cy="50" r="48.6" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1.4 6.5" />
                      <circle cx="50" cy="50" r="48.6" stroke="var(--color-amber)" strokeWidth="1.1" strokeDasharray="42 264" strokeLinecap="round" opacity="0.85" />
                    </svg>
                    <div className="absolute inset-0 rounded-full border border-line2/80" aria-hidden="true" />
                    <img
                      src={PROFILE.photoUrl}
                      alt={PROFILE.photoAlt}
                      width={640}
                      height={640}
                      decoding="async"
                      className="relative h-full w-full rounded-full object-cover"
                      style={{ boxShadow: "var(--shadow), 0 0 0 6px var(--color-bg0), 0 0 44px -6px var(--color-teal-soft, rgba(69,229,198,0.35))" }}
                    />
                    <span className="chip absolute -bottom-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap !text-[0.52rem] bg-bg0/85 backdrop-blur-sm">
                      HYDERABAD · IN
                    </span>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.85}>
                <aside className="panel corner-frame relative overflow-hidden p-4" aria-label="Live profile readout">
                  <div className="absolute inset-x-0 top-0 h-16 overflow-hidden pointer-events-none" aria-hidden="true">
                    <div className="scanline h-10 w-full bg-gradient-to-b from-transparent via-teal/8 to-transparent" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="mono text-[0.6rem] tracking-[0.34em] text-faint">LIVE READOUT</span>
                    <span className="flex items-center gap-2 mono text-[0.6rem] tracking-[0.2em] text-teal">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal pulse-dot" aria-hidden="true" />
                      ONLINE
                    </span>
                  </div>
                  <div className="mt-2.5 space-y-2">
                    <div className="flex items-baseline justify-between border-b border-line/70 pb-2.5">
                      <span className="mono text-[0.6rem] tracking-[0.26em] text-faint">NAME</span>
                      <span className="display text-[0.95rem] text-ink">{PROFILE.name}</span>
                    </div>
                    <div className="flex items-baseline justify-between border-b border-line/70 pb-2.5">
                      <span className="mono text-[0.6rem] tracking-[0.26em] text-faint">ROLE</span>
                      <span className="display text-[0.95rem] text-teal">{PROFILE.roleShort}</span>
                    </div>
                    <div className="flex items-baseline justify-between border-b border-line/70 pb-2.5">
                      <span className="mono text-[0.6rem] tracking-[0.26em] text-faint">BASE</span>
                      <span className="text-dim text-[0.85rem]">{PROFILE.location}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4 border-b border-line/70 pb-3">
                      <span className="mono text-[0.6rem] tracking-[0.26em] text-faint">CORE STACK</span>
                      <span className="flex flex-wrap justify-end gap-1.5">
                        {PROFILE.typeWords.map((w) => (
                          <span key={w} className="chip !text-[0.58rem] !px-2 !py-1">{w}</span>
                        ))}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2.5 grid grid-cols-3 divide-x divide-line/70 border border-line/70 bg-bg0/40">
                    {HERO_METRICS.map((m) => (
                      <div key={m.label} className="px-2 py-2 text-center">
                        <div className="display text-[1.35rem] text-amber leading-none">
                          <CountUp to={m.value} suffix={m.suffix} />
                        </div>
                        <div className="mono mt-1.5 text-[0.52rem] tracking-[0.18em] text-faint uppercase">{m.label}</div>
                      </div>
                    ))}
                  </div>
                </aside>
              </Reveal>
            </div>
          </div>

          {/* ticker + scroll cue */}
          <div className="relative border-t border-line/70 bg-bg0/60 backdrop-blur-sm">
            <div className="flex items-center">
              <div className="shrink-0 hidden md:flex items-center gap-2 px-5 py-3 border-r border-line/70 mono text-[0.58rem] tracking-[0.3em] text-faint">
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true"><path d="M5.5 1v9M1 5.5h9" stroke="#45e5c6" strokeWidth="1.3" /></svg>
                SCROLL TO BEGIN
              </div>
              <div className="overflow-hidden flex-1 py-3" aria-hidden="true">
                <div className="ticker-track flex w-max items-center gap-8">
                  {[...SKILL_TICKER, ...SKILL_TICKER].map((s, i) => (
                    <span key={i} className="flex items-center gap-8 mono text-[0.66rem] tracking-[0.3em] text-dim whitespace-nowrap">
                      {s.toUpperCase()}
                      <span className="text-teal/60 text-[0.5rem]">◆</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
