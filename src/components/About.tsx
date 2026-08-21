import { useEffect, useRef } from "react";
import { gsap, reducedMotion } from "../lib/engine";
import { CountUp, MaskLines, Reveal, useInView } from "../lib/fx";
import { ABOUT, IMPACT } from "../data/profile";

/* animated DATA → ANALYSIS → INSIGHT → DECISION motif */
function PipelineMotif() {
  const { ref, inView } = useInView<HTMLDivElement>(0.4);
  useEffect(() => {
    if (!inView || !ref.current || reducedMotion()) return;
    const path = ref.current.querySelector<SVGPathElement>(".motif-path");
    if (path) {
      const len = path.getTotalLength();
      gsap.fromTo(path, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 2.2, ease: "power2.inOut" });
    }
    gsap.fromTo(ref.current.querySelectorAll(".motif-node"), { scale: 0, transformOrigin: "center" }, { scale: 1, duration: 0.5, ease: "back.out(2)", stagger: 0.5, delay: 0.2 });
  }, [inView, ref]);

  return (
    <div ref={ref} className="mt-10">
      <svg viewBox="0 0 520 90" className="w-full" role="img" aria-label="Pipeline: complex data to analysis to insight to decision">
        <path d="M30 45 H490" stroke="#1b2940" strokeWidth="1.5" />
        <path className="motif-path" d="M30 45 H490" stroke="#45e5c6" strokeWidth="1.5" />
        {ABOUT.pipeline.map((label, i) => {
          const x = 30 + i * (460 / 3);
          const hot = i === 2;
          return (
            <g key={label} className="motif-node">
              <circle cx={x} cy={45} r={hot ? 9 : 6} fill={hot ? "#ffb454" : "#45e5c6"} />
              <circle cx={x} cy={45} r={hot ? 15 : 11} fill="none" stroke={hot ? "#ffb454" : "#45e5c6"} strokeOpacity="0.3" />
              <text x={x} y={78} textAnchor="middle" fill={hot ? "#ffb454" : "#93a3ba"} fontSize="11" fontFamily="'JetBrains Mono', monospace" letterSpacing="2">
                {label.toUpperCase()}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="mono mt-3 text-[0.62rem] tracking-[0.3em] text-faint">
        THE RECURRING PATTERN — EVERYTHING HERE FOLLOWS IT
      </p>
    </div>
  );
}

function CheckGlyph() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true" className="mt-1 shrink-0">
      <rect x="0.75" y="0.75" width="13.5" height="13.5" stroke="#24344f" strokeWidth="1.2" />
      <path d="M3.5 7.8L6.2 10.5L11.5 4.5" stroke="#45e5c6" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function About() {
  return (
    <section id="about" aria-label="About" className="relative">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10 py-28 md:py-44 grid lg:grid-cols-[5fr_7fr] gap-14 lg:gap-20">
        <div className="lg:sticky lg:top-32 self-start">
          <Reveal>
            <p className="kicker">{ABOUT.kicker}</p>
          </Reveal>
          <MaskLines
            className="display mt-6 text-[clamp(1.9rem,3.6vw,3.3rem)] leading-[1.06] text-ink"
            lines={["Dedicated to excellence", "in data analysis and", "process optimization"]}
          />
          <Reveal delay={0.25}>
            <p className="mt-6 text-teal display text-[1.05rem]">{ABOUT.sub}</p>
          </Reveal>
          <Reveal delay={0.4}>
            <PipelineMotif />
          </Reveal>
        </div>

        <div className="space-y-14">
          <div>
            <Reveal>
              <p className="mono text-[0.62rem] tracking-[0.32em] text-faint uppercase">Professional Overview</p>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-5 text-dim text-[1.05rem] md:text-[1.2rem] leading-[1.75] max-w-2xl">
                {ABOUT.overview.split("Tech Mahindra")[0]}
                <span className="text-ink font-medium">Tech Mahindra</span> and{" "}
                <span className="text-ink font-medium">Frugal Testing</span>
                {ABOUT.overview.split("Frugal Testing.")[1]}
              </p>
            </Reveal>
          </div>

          <div>
            <Reveal>
              <p className="mono text-[0.62rem] tracking-[0.32em] text-faint uppercase">Verified Highlights</p>
            </Reveal>
            <ul className="mt-6 space-y-0">
              {ABOUT.achievements.map((a, i) => (
                <Reveal key={i} delay={0.1 * i}>
                  <li className="group flex items-start gap-5 border-t border-line/80 py-5 transition-colors duration-300 hover:border-teal/50">
                    <span className="mono text-[0.62rem] tracking-[0.2em] text-faint pt-1">0{i + 1}</span>
                    <CheckGlyph />
                    <span className="text-[0.98rem] leading-relaxed text-dim group-hover:text-ink transition-colors duration-300 max-w-xl">{a}</span>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>

          <Reveal delay={0.15}>
            <blockquote className="panel corner-frame p-7 md:p-9 max-w-xl">
              <svg width="26" height="20" viewBox="0 0 26 20" fill="none" aria-hidden="true"><path d="M0 20V11.6C0 4.9 3.8 1.1 10.4 0l1.4 3.4c-3.9 1-5.8 3.1-5.9 6.2H11V20H0zm15 0V11.6C15 4.9 18.8 1.1 25.4 0l.6 3.4c-3.9 1-5.8 3.1-5.9 6.2H26V20H15z" fill="#24344f" /></svg>
              <p className="display mt-4 text-[1.25rem] md:text-[1.45rem] leading-snug text-ink">
                Complex data in. <span className="text-teal">Clear decisions</span> out.
              </p>
              <p className="mono mt-4 text-[0.62rem] tracking-[0.28em] text-faint">— THE WORKFLOW, IN ONE LINE</p>
            </blockquote>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Scene 03 — Impact ---------------- */

function GaugeRing() {
  const { ref, inView } = useInView<HTMLDivElement>(0.45);
  const R = 84;
  const CIRC = 2 * Math.PI * R;
  useEffect(() => {
    if (!inView || !ref.current || reducedMotion()) return;
    const arc = ref.current.querySelector<SVGCircleElement>(".gauge-arc");
    if (arc) gsap.fromTo(arc, { strokeDashoffset: CIRC }, { strokeDashoffset: CIRC * 0.2, duration: 2.4, ease: "power3.inOut", delay: 0.2 });
  }, [inView, ref, CIRC]);

  return (
    <div ref={ref} className="relative grid place-items-center">
      <svg viewBox="0 0 200 200" className="w-[240px] md:w-[320px] -rotate-90" role="img" aria-label="Gauge showing 80 percent">
        <circle cx="100" cy="100" r={R} fill="none" stroke="#1b2940" strokeWidth="7" />
        <circle
          className="gauge-arc"
          cx="100" cy="100" r={R} fill="none" stroke="#45e5c6" strokeWidth="7" strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={reducedMotion() ? CIRC * 0.2 : CIRC}
        />
        {Array.from({ length: 60 }).map((_, i) => {
          const a = (i / 60) * Math.PI * 2;
          return (
            <line
              key={i}
              x1={100 + Math.cos(a) * 94} y1={100 + Math.sin(a) * 94}
              x2={100 + Math.cos(a) * 97} y2={100 + Math.sin(a) * 97}
              stroke="#24344f" strokeWidth="1.4"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="display font-bold text-[clamp(3.2rem,6vw,5.2rem)] leading-none text-ink">
            <CountUp to={IMPACT.stat.value} suffix="%" duration={2400} />
          </div>
          <div className="mono mt-2 text-[0.58rem] tracking-[0.3em] text-teal">MANUAL → AUTOMATED</div>
        </div>
      </div>
    </div>
  );
}

function Medal({ amber, label }: { amber?: boolean; label: string }) {
  return (
    <div className="group flex flex-col items-center gap-2" role="img" aria-label={label}>
      <svg width="52" height="58" viewBox="0 0 52 58" fill="none" aria-hidden="true" className="transition-transform duration-500 group-hover:-translate-y-1.5 group-hover:rotate-6">
        <path d="M26 2L47 14v24L26 50 5 38V14L26 2z" fill={amber ? "rgba(255,180,84,0.08)" : "rgba(69,229,198,0.07)"} stroke={amber ? "#ffb454" : "#45e5c6"} strokeWidth="1.4" />
        <path d="M26 12l9.5 5.5v11L26 34l-9.5-5.5v-11L26 12z" stroke={amber ? "#ffb454" : "#45e5c6"} strokeWidth="1.1" strokeOpacity="0.55" />
        <path d="M21 40l5 8 5-8" stroke={amber ? "#ffb454" : "#45e5c6"} strokeWidth="1.4" />
      </svg>
      <span className="mono text-[0.52rem] tracking-[0.22em] text-faint text-center leading-relaxed">{label}</span>
    </div>
  );
}

export function Impact() {
  return (
    <section id="impact" aria-label="Professional impact" className="relative">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10 py-24 md:py-36">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <Reveal className="order-2 lg:order-1">
            <GaugeRing />
          </Reveal>
          <div className="order-1 lg:order-2">
            <Reveal>
              <p className="kicker">Scene 03 — Professional Impact</p>
            </Reveal>
            <MaskLines
              className="display mt-6 text-[clamp(1.9rem,3.4vw,3rem)] leading-[1.08] text-ink"
              lines={["Numbers that", "changed how", "teams work"]}
            />
            <Reveal delay={0.2}>
              <p className="mt-6 text-dim text-[1.02rem] leading-relaxed max-w-lg">{IMPACT.stat.body}</p>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="mt-9">
                <p className="mono text-[0.62rem] tracking-[0.3em] text-faint uppercase mb-4">{IMPACT.awards.line}</p>
                <div className="flex flex-wrap gap-4 md:gap-5">
                  {Array.from({ length: IMPACT.awards.bravo }).map((_, i) => (
                    <Medal key={`b${i}`} label={`BRAVO ${i + 1}`} />
                  ))}
                  {Array.from({ length: IMPACT.awards.pat }).map((_, i) => (
                    <Medal key={`p${i}`} amber label={`PAT ON THE BACK ${i + 1}`} />
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="mt-20 grid md:grid-cols-2 gap-6">
          {IMPACT.moments.map((m, i) => (
            <Reveal key={m.title} delay={i * 0.12}>
              <article className="panel panel-glow corner-frame p-7 md:p-8 h-full">
                <div className="flex items-center gap-3">
                  <span className="mono text-[0.6rem] tracking-[0.24em] text-amber">0{i + 3}</span>
                  <span className="h-px flex-1 bg-line" />
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    {i === 0
                      ? <><circle cx="6" cy="9" r="3.2" stroke="#45e5c6" strokeWidth="1.3" /><circle cx="12" cy="9" r="3.2" stroke="#ffb454" strokeWidth="1.3" /></>
                      : <><rect x="2" y="9" width="3" height="6" fill="#45e5c6" /><rect x="7.5" y="5" width="3" height="10" fill="#45e5c6" /><rect x="13" y="2" width="3" height="13" fill="#ffb454" /></>}
                  </svg>
                </div>
                <h3 className="display mt-5 text-[1.3rem] text-ink">{m.title}</h3>
                <p className="mt-3 text-dim text-[0.95rem] leading-relaxed">{m.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
