import { useEffect, useRef, useState } from "react";
import { gsap, isCoarsePointer, reducedMotion, ScrollTrigger } from "../lib/engine";
import { MaskLines, Reveal } from "../lib/fx";
import { PROJECTS } from "../data/profile";

/* ---------- per-project animated visuals ---------- */

function VisualP1() {
  return (
    <svg viewBox="0 0 320 90" className="w-full" aria-hidden="true">
      {[0, 1, 2].map((r) =>
        [0, 1, 2, 3, 4].map((c) => (
          <rect key={`${r}${c}`} x={8 + c * 17} y={12 + r * 24} width="13" height="17" fill="#1d3050" stroke="#24344f" strokeWidth="1" />
        ))
      )}
      <path className="dash-flow" d="M100 45 C 150 45, 150 20, 195 20 M100 45 H 195 M100 45 C 150 45, 150 70, 195 70" stroke="#45e5c6" strokeWidth="1.3" fill="none" />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(205 ${8 + i * 25})`}>
          <rect width="34" height="22" fill="none" stroke="#ffb454" strokeWidth="1.3" />
          <path d="M0 0l17 12L34 0" stroke="#ffb454" strokeWidth="1.3" fill="none" />
        </g>
      ))}
      <text x="252" y="38" fill="#5c6b84" fontSize="9" fontFamily="'JetBrains Mono', monospace">BULK</text>
      <text x="252" y="52" fill="#5c6b84" fontSize="9" fontFamily="'JetBrains Mono', monospace">SEND ✓</text>
    </svg>
  );
}

function VisualP2() {
  return (
    <svg viewBox="0 0 320 90" className="w-full" aria-hidden="true">
      {[18, 34, 26, 44, 38, 56, 48, 64].map((h, i) => (
        <rect key={i} x={14 + i * 24} y={80 - h} width="15" height={h} fill={i % 4 === 3 ? "#ffb454" : "#45e5c6"} opacity="0.85">
          <animate attributeName="height" from="0" to={String(h)} dur="1.2s" begin={`${0.15 * i}s`} fill="freeze" />
          <animate attributeName="y" from="80" to={String(80 - h)} dur="1.2s" begin={`${0.15 * i}s`} fill="freeze" />
        </rect>
      ))}
      <circle cx="262" cy="45" r="26" fill="none" stroke="#1d3050" strokeWidth="9" />
      <circle cx="262" cy="45" r="26" fill="none" stroke="#45e5c6" strokeWidth="9" strokeDasharray="114 50" transform="rotate(-90 262 45)" />
      <circle cx="262" cy="45" r="26" fill="none" stroke="#ffb454" strokeWidth="9" strokeDasharray="40 124" strokeDashoffset="-114" transform="rotate(-90 262 45)" />
    </svg>
  );
}

function VisualP3() {
  const pts = [
    [30, 25, "#45e5c6"], [44, 34, "#45e5c6"], [38, 48, "#45e5c6"], [55, 40, "#45e5c6"], [24, 40, "#45e5c6"], [50, 22, "#45e5c6"],
    [140, 55, "#ffb454"], [155, 44, "#ffb454"], [168, 58, "#ffb454"], [150, 66, "#ffb454"], [162, 38, "#ffb454"],
    [250, 30, "#6fa8ff"], [264, 42, "#6fa8ff"], [244, 46, "#6fa8ff"], [258, 55, "#6fa8ff"], [272, 28, "#6fa8ff"],
  ] as const;
  return (
    <svg viewBox="0 0 320 90" className="w-full" aria-hidden="true">
      <path d="M10 80 H 310 M 16 10 V 82" stroke="#1b2940" strokeWidth="1.2" />
      {pts.map(([x, y, col], i) => (
        <circle key={i} cx={x} cy={y} r="3.4" fill={col} opacity="0.9">
          <animate attributeName="opacity" values="0.4;1;0.4" dur={`${2 + (i % 3)}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <path d="M22 30 C 60 10, 90 70, 130 50 S 210 20, 240 38 S 290 55, 306 24" stroke="#45e5c6" strokeWidth="1.4" fill="none" className="dash-flow" />
    </svg>
  );
}

const VISUALS = [VisualP1, VisualP2, VisualP3];

/* ---------- flip card ---------- */

function CaseCard({ index }: { index: number }) {
  const p = PROJECTS.items[index];
  const [flipped, setFlipped] = useState(false);
  const Visual = VISUALS[index];
  const coarse = isCoarsePointer();

  return (
    <div
      className="flip-scene relative shrink-0 w-[86vw] sm:w-[66vw] lg:w-[44vw] xl:w-[36vw] h-[62vh] min-h-[460px] md:h-[560px]"
      onMouseEnter={() => { if (!coarse) setFlipped(true); }}
      onMouseLeave={() => { if (!coarse) setFlipped(false); }}
    >
      <div className={`flip-inner relative w-full h-full ${flipped ? "flipped" : ""}`}>
        {/* front */}
        <button
          className="flip-face absolute inset-0 w-full text-left panel corner-frame p-7 md:p-9 flex flex-col cursor-pointer"
          onClick={() => setFlipped(!flipped)}
          aria-pressed={flipped}
          aria-label={`${p.title} — show impact`}
        >
          <div className="flex items-center justify-between">
            <span className="mono text-[0.62rem] tracking-[0.3em] text-faint">PROJECT {p.index} / 03</span>
            <Visual />
          </div>
          <h3 className="display mt-6 text-[1.55rem] md:text-[1.9rem] leading-tight text-ink">{p.title}</h3>
          <p className="mt-4 text-dim text-[0.95rem] leading-relaxed">{p.front}</p>
          <div className="mt-auto">
            <div className="flex flex-wrap gap-2">
              {p.tags.map((t) => <span key={t} className="chip">{t}</span>)}
            </div>
            <div className="mt-6 flex items-center gap-3 mono text-[0.6rem] tracking-[0.28em] text-teal">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8a6 6 0 0110.5-4M14 8a6 6 0 01-10.5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /><path d="M12.5 1v3.2H9.3M3.5 15v-3.2h3.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
              FLIP FOR IMPACT
            </div>
          </div>
        </button>
        {/* back */}
        <div className="flip-face flip-back absolute inset-0 panel p-7 md:p-9 flex flex-col" style={{ borderColor: "rgba(255,180,84,0.45)" }}>
          <div className="flex items-center justify-between">
            <span className="mono text-[0.62rem] tracking-[0.3em] text-amber">IMPACT REPORT</span>
            <span className="display text-[1.4rem] text-line2">0{index + 1}</span>
          </div>
          <h3 className="display mt-6 text-[1.35rem] md:text-[1.6rem] leading-tight text-ink">{p.title}</h3>
          <p className="mt-4 text-dim text-[0.98rem] leading-relaxed">{p.impact}</p>
          <div className="mt-auto">
            <p className="mono text-[0.58rem] tracking-[0.26em] text-faint mb-3">SIGNAL PATH</p>
            <div className="flex flex-wrap items-center gap-2">
              {p.flow.map((f, fi) => (
                <span key={f} className="flex items-center gap-2">
                  <span className={`chip ${fi === p.flow.length - 1 ? "!border-amber/60 !text-amber" : ""}`}>{f}</span>
                  {fi < p.flow.length - 1 && <span className="text-teal text-[0.7rem]">→</span>}
                </span>
              ))}
            </div>
            <button onClick={() => setFlipped(false)} className="mt-6 mono text-[0.6rem] tracking-[0.28em] text-faint hover:text-teal transition-colors cursor-pointer">
              ← BACK TO BRIEF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const pin = pinRef.current;
      if (!track || !pin) return;
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 40);
      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: () => `+=${distance() + 250}`,
          scrub: reducedMotion() ? true : 0.9,
          pin: true,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
    }, sectionRef);
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => { window.clearTimeout(t); ctx.revert(); };
  }, []);

  return (
    <section id="projects" ref={sectionRef} aria-label="Featured projects" className="relative bg-bg0/70">
      <div ref={pinRef} className="hdvh flex flex-col justify-center overflow-hidden">
        <div className="w-full max-w-[1500px] mx-auto px-5 md:px-10">
          <Reveal><p className="kicker">{PROJECTS.kicker} — Scene 08</p></Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <MaskLines className="display mt-4 text-[clamp(1.7rem,3.2vw,2.8rem)] leading-[1.08] text-ink" lines={[PROJECTS.heading]} />
            <Reveal delay={0.15}>
              <p className="text-dim text-[0.92rem] max-w-sm pb-1">{PROJECTS.sub}</p>
            </Reveal>
          </div>
        </div>

        <div ref={trackRef} className="mt-10 flex items-stretch gap-6 pl-5 md:pl-[max(1.25rem,calc((100vw-1500px)/2+2.5rem))] pr-[10vw] will-change-transform">
          {PROJECTS.items.map((_p, i) => (
            <CaseCard key={i} index={i} />
          ))}

          {/* gallery card */}
          <a
            href={PROJECTS.galleryUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor
            className="group shrink-0 w-[76vw] sm:w-[50vw] lg:w-[30vw] panel corner-frame p-9 flex flex-col justify-between transition-colors duration-300 hover:border-amber/60"
          >
            <div>
              <p className="mono text-[0.62rem] tracking-[0.3em] text-faint">ALL IN ONE</p>
              <h3 className="display mt-5 text-[1.7rem] leading-snug text-ink">
                Want the full<br />project gallery?
              </h3>
              <p className="mt-4 text-dim text-[0.95rem] leading-relaxed">See every dashboard and case study in one place.</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="btn-magnetic inline-flex items-center gap-3 bg-amber text-bg0 px-6 py-3 display text-[0.95rem] font-semibold">
                View Projects
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"><path d="M2 11L11 2M11 2H4M11 2v7" stroke="currentColor" strokeWidth="1.5" /></svg>
              </span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
