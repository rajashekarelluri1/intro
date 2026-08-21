import { useEffect, useRef } from "react";
import { gsap, reducedMotion, ScrollTrigger } from "../lib/engine";
import { MaskLines, Reveal } from "../lib/fx";
import { WORKFLOW } from "../data/profile";

function StageGlyph({ i }: { i: number }) {
  const s = { stroke: "#45e5c6", w: 1.5 } as const;
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
      {i === 0 && (
        <>
          <ellipse cx="22" cy="10" rx="14" ry="5" stroke="#ffb454" strokeWidth={s.w} />
          <path d="M8 10v24c0 2.8 6.3 5 14 5s14-2.2 14-5V10" stroke="#24344f" strokeWidth={s.w} />
          <path d="M8 22c0 2.8 6.3 5 14 5s14-2.2 14-5" stroke={s.stroke} strokeWidth={s.w} strokeOpacity="0.7" />
          <circle cx="15" cy="31" r="1.6" fill="#ffb454" /><circle cx="22" cy="33" r="1.6" fill="#45e5c6" /><circle cx="29" cy="31" r="1.6" fill="#ffb454" />
        </>
      )}
      {i === 1 && (
        <>
          <path d="M6 8h32L26 22v12l-8 4V22L6 8z" stroke={s.stroke} strokeWidth={s.w} strokeLinejoin="round" />
          <path d="M12 13h20" stroke="#ffb454" strokeWidth={s.w} strokeLinecap="round" />
          <path d="M15 17.5h14" stroke="#24344f" strokeWidth={s.w} strokeLinecap="round" />
        </>
      )}
      {i === 2 && (
        <>
          <path d="M15 8c-6 0-6 8-6 14s0 14 6 14" stroke={s.stroke} strokeWidth={s.w} strokeLinecap="round" />
          <path d="M29 8c6 0 6 8 6 14s0 14-6 14" stroke={s.stroke} strokeWidth={s.w} strokeLinecap="round" />
          <path d="M25 14l-7 16" stroke="#ffb454" strokeWidth={s.w} strokeLinecap="round" />
          <circle cx="18" cy="22" r="1.5" fill="#45e5c6" /><circle cx="26" cy="22" r="1.5" fill="#45e5c6" />
        </>
      )}
      {i === 3 && (
        <>
          <rect x="17" y="17" width="10" height="10" stroke="#ffb454" strokeWidth={s.w} />
          <rect x="4" y="4" width="8" height="8" stroke={s.stroke} strokeWidth={s.w} />
          <rect x="32" y="4" width="8" height="8" stroke={s.stroke} strokeWidth={s.w} />
          <rect x="4" y="32" width="8" height="8" stroke={s.stroke} strokeWidth={s.w} />
          <rect x="32" y="32" width="8" height="8" stroke={s.stroke} strokeWidth={s.w} />
          <path d="M12 8h10M32 8H22M8 12v10M8 32V22M36 12v10M36 32V22M12 36h10M32 36H22" stroke="#24344f" strokeWidth="1.2" />
        </>
      )}
      {i === 4 && (
        <>
          <rect x="5" y="6" width="34" height="26" stroke="#24344f" strokeWidth={s.w} />
          <rect x="9" y="10" width="12" height="7" stroke={s.stroke} strokeWidth="1.3" />
          <path d="M25 17v-4M29 17v-7M33 17v-2" stroke="#ffb454" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M9 27l5-4 4 2 5-5 4 3 8-6" stroke={s.stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="14" y="34" width="16" height="4" stroke="#24344f" strokeWidth="1.2" />
        </>
      )}
      {i === 5 && (
        <>
          <path d="M22 5l4.5 9.5L36 19l-9.5 4.5L22 33l-4.5-9.5L8 19l9.5-4.5L22 5z" stroke="#ffb454" strokeWidth={s.w} strokeLinejoin="round" />
          <circle cx="22" cy="19" r="3" stroke={s.stroke} strokeWidth={s.w} />
          <path d="M18 37h8" stroke="#24344f" strokeWidth={s.w} strokeLinecap="round" />
        </>
      )}
      {i === 6 && (
        <>
          <circle cx="22" cy="22" r="15" stroke="#24344f" strokeWidth={s.w} />
          <circle cx="22" cy="22" r="8" stroke={s.stroke} strokeWidth={s.w} />
          <circle cx="22" cy="22" r="2.2" fill="#ffb454" />
          <path d="M22 3v6M22 35v6M3 22h6M35 22h6" stroke={s.stroke} strokeWidth={s.w} strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

export default function Workflow() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const pin = pinRef.current;
      if (!track || !pin) return;
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 60);
      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: () => `+=${distance() + 200}`,
          scrub: reducedMotion() ? true : 0.9,
          pin: true,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const idx = Math.min(6, Math.floor(self.progress * 7));
            if (counterRef.current) counterRef.current.textContent = `0${idx + 1}`;
            if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`;
          },
        },
      });
    }, sectionRef);
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => { window.clearTimeout(t); ctx.revert(); };
  }, []);

  return (
    <section id="workflow" ref={sectionRef} aria-label="How I work with data" className="relative bg-bg0/70">
      <div ref={pinRef} className="h-screen flex flex-col justify-center overflow-hidden">
        <div className="w-full max-w-[1500px] mx-auto px-5 md:px-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Reveal><p className="kicker">{WORKFLOW.kicker} — Scene 06</p></Reveal>
              <MaskLines className="display mt-4 text-[clamp(1.7rem,3.2vw,2.8rem)] leading-[1.08] text-ink" lines={[WORKFLOW.heading]} />
              <Reveal delay={0.15}>
                <p className="mt-3 text-dim text-[0.95rem] max-w-md">{WORKFLOW.sub}</p>
              </Reveal>
            </div>
            <div className="mono flex items-center gap-4">
              <div className="text-right">
                <div className="display text-[2.4rem] leading-none text-teal">
                  STAGE <span ref={counterRef}>01</span>
                  <span className="text-faint text-[1.2rem]"> / 07</span>
                </div>
                <div className="mt-2 h-px w-44 bg-line overflow-hidden">
                  <div ref={barRef} className="h-full w-full origin-left bg-gradient-to-r from-teal to-amber" style={{ transform: "scaleX(0)" }} />
                </div>
              </div>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="text-faint">
                <path d="M3 10h13M16 10l-5-5M16 10l-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        <div ref={trackRef} className="mt-10 md:mt-14 flex items-stretch gap-5 md:gap-7 pl-5 md:pl-[max(1.25rem,calc((100vw-1500px)/2+2.5rem))] pr-[12vw] will-change-transform">
          {WORKFLOW.stages.map((st, i) => (
            <article
              key={st.stage}
              className="relative shrink-0 w-[82vw] sm:w-[62vw] lg:w-[40vw] xl:w-[32vw] panel corner-frame overflow-hidden flex flex-col p-7 md:p-9 transition-colors duration-300 hover:border-teal/50"
              aria-label={`Stage ${st.stage}: ${st.title}`}
            >
              <span className="absolute -right-4 -bottom-8 display font-bold text-[10rem] leading-none text-line/40 select-none" aria-hidden="true">
                {st.stage}
              </span>
              <div className="flex items-start justify-between">
                <StageGlyph i={i} />
                <div className="text-right">
                  <span className="mono text-[0.6rem] tracking-[0.3em] text-faint">STAGE</span>
                  <div className={`display text-[1.6rem] leading-none ${i === 6 ? "text-amber" : "text-teal"}`}>{st.stage}</div>
                </div>
              </div>
              <h3 className="display mt-8 text-[1.6rem] md:text-[1.9rem] text-ink">{st.title}</h3>
              <p className="mt-4 text-dim text-[0.95rem] leading-relaxed max-w-md">{st.body}</p>
              <div className="mt-auto pt-8 flex items-center gap-2.5">
                {st.tags.map((t) => (
                  <span key={t} className="chip">{t}</span>
                ))}
                {i < 6 && (
                  <svg width="26" height="10" viewBox="0 0 26 10" fill="none" aria-hidden="true" className="ml-auto text-teal/70">
                    <path className="dash-flow" d="M0 5h22" stroke="currentColor" strokeWidth="1.3" />
                    <path d="M20 1.5L25 5l-5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </article>
          ))}

          {/* end card */}
          <div className="shrink-0 w-[70vw] sm:w-[46vw] lg:w-[26vw] flex flex-col justify-center items-start panel p-9 border-dashed !border-line2">
            <p className="mono text-[0.62rem] tracking-[0.3em] text-faint">PIPELINE COMPLETE</p>
            <p className="display mt-4 text-[1.5rem] text-ink leading-snug">
              Raw input → <span className="text-teal">confident decisions</span>.
            </p>
            <p className="mono mt-4 text-[0.6rem] tracking-[0.24em] text-faint">7 STAGES · 1 STANDARD · 99%+ CARE</p>
          </div>
        </div>
      </div>
    </section>
  );
}
