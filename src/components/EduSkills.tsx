import { useEffect, useRef, useState } from "react";
import { gsap, reducedMotion } from "../lib/engine";
import { MaskLines, Reveal, useInView } from "../lib/fx";
import { CERTIFICATIONS, EDUCATION, SKILL_TICKER, TOOLBOX } from "../data/profile";

/* ---------------- Scene 04 — Education ---------------- */

function CertIcon({ i }: { i: number }) {
  const stroke = i % 2 ? "#ffb454" : "#45e5c6";
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true">
      {i === 0 && (
        <>
          <path d="M4 8h22M4 15h14M4 22h22" stroke="#24344f" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M19 12.5c2.5 0 4 1.4 4 3.7 0 2.9-3 3.3-4 5.8h6" stroke={stroke} strokeWidth="1.7" strokeLinecap="round" />
        </>
      )}
      {i === 1 && (
        <>
          <rect x="4" y="4" width="22" height="22" stroke="#24344f" strokeWidth="1.5" />
          <path d="M9 21c3-2 4-8 4-12M17 9c0 4 1 10 4 12" stroke={stroke} strokeWidth="1.7" strokeLinecap="round" />
          <path d="M8 17.5L12 14l3 2.5L21 11" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.7" />
        </>
      )}
      {i === 2 && (
        <>
          <ellipse cx="15" cy="8" rx="10" ry="3.6" stroke={stroke} strokeWidth="1.6" />
          <path d="M5 8v14c0 2 4.5 3.6 10 3.6s10-1.6 10-3.6V8" stroke="#24344f" strokeWidth="1.6" />
          <path d="M5 15c0 2 4.5 3.6 10 3.6s10-1.6 10-3.6" stroke={stroke} strokeWidth="1.4" strokeOpacity="0.7" />
        </>
      )}
      {i === 3 && (
        <>
          <rect x="4" y="4" width="22" height="22" stroke="#24344f" strokeWidth="1.5" />
          <rect x="8" y="15" width="3.4" height="7" fill={stroke} />
          <rect x="13.4" y="10" width="3.4" height="12" fill={stroke} fillOpacity="0.75" />
          <rect x="18.8" y="7" width="3.4" height="15" fill="#ffb454" />
        </>
      )}
    </svg>
  );
}

export function Education() {
  const railRef = useRef<HTMLDivElement>(null);
  const { ref, inView } = useInView<HTMLDivElement>(0.25);

  useEffect(() => {
    if (!inView || !railRef.current || reducedMotion()) return;
    gsap.fromTo(railRef.current, { scaleX: 0 }, { scaleX: 1, duration: 1.8, ease: "power2.inOut" });
  }, [inView]);

  return (
    <section id="education" aria-label="Education and certifications" className="relative">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10 py-24 md:py-36">
        <div ref={ref} className="max-w-2xl">
          <Reveal><p className="kicker">Scene 04 — Foundations</p></Reveal>
          <MaskLines
            className="display mt-6 text-[clamp(1.9rem,3.4vw,3rem)] leading-[1.08] text-ink"
            lines={["Engineering roots,", "analyst instincts"]}
          />
          <Reveal delay={0.2}>
            <p className="mt-5 text-dim leading-relaxed max-w-xl">
              A decade of structured problem-solving — from civil engineering to business intelligence.
            </p>
          </Reveal>
        </div>

        {/* timeline */}
        <div className="relative mt-16 md:mt-24">
          <div className="absolute left-0 right-0 top-[7px] h-px bg-line" aria-hidden="true" />
          <div ref={railRef} className="absolute left-0 right-0 top-[7px] h-px bg-gradient-to-r from-teal via-teal to-amber origin-left" aria-hidden="true" />
          <ol className="grid md:grid-cols-3 gap-10 md:gap-8">
            {[...EDUCATION].reverse().map((e, i) => (
              <Reveal key={e.degree} delay={0.25 + i * 0.18}>
                <li className="relative pt-8">
                  <span className={`absolute top-0 left-0 w-[15px] h-[15px] border-2 ${i === 2 ? "border-amber bg-amber/20" : "border-teal bg-bg0"} rotate-45`} aria-hidden="true" />
                  <p className="mono text-[0.62rem] tracking-[0.28em] text-faint">{e.years}</p>
                  <h3 className="display mt-3 text-[1.35rem] text-ink">{e.degree}</h3>
                  <p className="text-teal text-[0.9rem] mt-1">{e.field}</p>
                  <p className="text-dim text-[0.9rem] mt-2">{e.school}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>

        {/* certifications */}
        <div className="mt-16 md:mt-20">
          <Reveal>
            <p className="mono text-[0.62rem] tracking-[0.32em] text-faint uppercase flex items-center gap-4">
              Certifications
              <span className="h-px flex-1 max-w-[120px] bg-line" />
              <span className="text-teal">×4</span>
            </p>
          </Reveal>
          <ul className="mt-6 grid sm:grid-cols-2 gap-4">
            {CERTIFICATIONS.map((c, i) => (
              <Reveal key={c} delay={i * 0.08}>
                <li className="panel panel-glow flex items-center gap-5 px-5 py-4 transition-transform duration-300 hover:-translate-y-1">
                  <CertIcon i={i} />
                  <span className="text-[0.92rem] text-dim leading-snug">{c}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Scene 05 — Toolbox ---------------- */

const TONE: Record<string, { text: string; border: string; bg: string }> = {
  amber: { text: "text-amber", border: "hover:border-amber/60", bg: "bg-amber/10" },
  teal: { text: "text-teal", border: "hover:border-teal/60", bg: "bg-teal/10" },
  blue: { text: "text-blue", border: "hover:border-blue/60", bg: "bg-blue/10" },
  ink: { text: "text-ink", border: "hover:border-ink/50", bg: "bg-ink/10" },
};

function CategoryGlyph({ i, tone }: { i: number; tone: string }) {
  const color = tone === "amber" ? "#ffb454" : tone === "teal" ? "#45e5c6" : tone === "blue" ? "#6fa8ff" : "#e9f1fa";
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true" className="transition-transform duration-500 group-hover:rotate-6">
      {i === 0 && (
        <>
          <path d="M12 8L4 17l8 9" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M22 8l8 9-8 9" stroke="#24344f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M19 5l-4 24" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeOpacity="0.7" />
        </>
      )}
      {i === 1 && (
        <>
          <rect x="4" y="4" width="26" height="26" stroke="#24344f" strokeWidth="1.5" />
          <rect x="9" y="16" width="4" height="9" fill={color} />
          <rect x="15" y="11" width="4" height="14" fill={color} fillOpacity="0.7" />
          <rect x="21" y="7" width="4" height="18" fill={color} fillOpacity="0.45" />
        </>
      )}
      {i === 2 && (
        <>
          <path d="M5 6h24l-9 11v9l-6 3V17L5 6z" stroke={color} strokeWidth="1.7" strokeLinejoin="round" />
          <path d="M10 10h14" stroke="#24344f" strokeWidth="1.5" />
        </>
      )}
      {i === 3 && (
        <>
          <circle cx="17" cy="17" r="6" stroke={color} strokeWidth="1.7" />
          <path d="M17 4v5M17 25v5M4 17h5M25 17h5M8 8l3.5 3.5M22.5 22.5L26 26M26 8l-3.5 3.5M11.5 22.5L8 26" stroke="#24344f" strokeWidth="1.7" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

export function Toolbox() {
  const [focus, setFocus] = useState<number | null>(null);

  return (
    <section id="toolbox" aria-label="Technical skills" className="relative">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10 py-24 md:py-36">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <Reveal><p className="kicker">Scene 05 — Toolbox</p></Reveal>
            <MaskLines className="display mt-6 text-[clamp(1.9rem,3.4vw,3rem)] leading-[1.08] text-ink" lines={["Technical Skills"]} />
            <Reveal delay={0.15}>
              <p className="mt-5 text-dim leading-relaxed">
                Four orbits around one analytical core. Select a category to isolate it — every tool below is part of the daily practice.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <div className="mono text-right">
              <div className="display text-[2.6rem] leading-none text-amber">18</div>
              <div className="text-[0.6rem] tracking-[0.3em] text-faint mt-1.5">TOOLS INDEXED</div>
            </div>
          </Reveal>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 gap-5">
          {TOOLBOX.map((cat, ci) => {
            const tone = TONE[cat.tone];
            const dimmed = focus !== null && focus !== ci;
            return (
              <Reveal key={cat.category} delay={ci * 0.08}>
                <article
                  className={`group panel corner-frame p-6 md:p-7 transition-all duration-500 cursor-pointer ${tone.border} ${dimmed ? "opacity-30 scale-[0.985]" : "opacity-100"}`}
                  onClick={() => setFocus(focus === ci ? null : ci)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setFocus(focus === ci ? null : ci); } }}
                  tabIndex={0}
                  role="button"
                  aria-pressed={focus === ci}
                  aria-label={`${cat.category}: ${cat.items.join(", ")}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <CategoryGlyph i={ci} tone={cat.tone} />
                    <span className={`mono text-[0.58rem] tracking-[0.26em] ${tone.text}`}>
                      ORBIT 0{ci + 1} — {cat.items.length} NODES
                    </span>
                  </div>
                  <h3 className="display mt-5 text-[1.25rem] text-ink">{cat.category}</h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {cat.items.map((it) => (
                      <span key={it} className={`chip ${focus === ci ? `${tone.text} border-current` : ""}`}>{it}</span>
                    ))}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        {/* skill marquee */}
        <Reveal delay={0.1} className="mt-14">
          <div className="relative overflow-hidden border-y border-line/70 py-4" aria-hidden="true">
            <div className="ticker-track flex w-max items-center gap-10" style={{ animationDuration: "28s" }}>
              {[...SKILL_TICKER, ...SKILL_TICKER].map((s, i) => (
                <span key={i} className={`display text-[1.5rem] md:text-[2rem] whitespace-nowrap ${i % 3 === 1 ? "text-ink/90" : "text-transparent [-webkit-text-stroke:1px_#3a4d6e]"}`}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
