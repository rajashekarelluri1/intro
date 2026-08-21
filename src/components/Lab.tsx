import { useEffect, useRef, useState } from "react";
import { reducedMotion } from "../lib/engine";
import { MaskLines, Reveal, Scramble, useInView } from "../lib/fx";
import { LAB } from "../data/profile";

/* ---------------- typing console ---------------- */

function TypedQuery() {
  const { ref, inView } = useInView<HTMLDivElement>(0.4);
  const [chars, setChars] = useState(reducedMotion() ? LAB.queryLine.length : 0);
  const [done, setDone] = useState(reducedMotion());

  useEffect(() => {
    if (!inView || reducedMotion()) return;
    if (chars >= LAB.queryLine.length) {
      const t = window.setTimeout(() => setDone(true), 450);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => setChars((c) => c + 1), chars === 0 ? 500 : 26);
    return () => window.clearTimeout(t);
  }, [inView, chars]);

  return (
    <div ref={ref} className="panel corner-frame overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-line/80 bg-bg0/60">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff6b6b]/80" aria-hidden="true" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber/80" aria-hidden="true" />
        <span className="w-2.5 h-2.5 rounded-full bg-teal/80" aria-hidden="true" />
        <span className="mono ml-3 text-[0.62rem] tracking-[0.24em] text-faint">QUERY.SQL — LIVE PLAYGROUND</span>
      </div>
      <div className="p-5 md:p-6 mono text-[0.78rem] md:text-[0.85rem] leading-relaxed min-h-[118px]">
        <div className="flex gap-4">
          <span className="text-faint select-none">01</span>
          <span className="text-dim">
            <span className="text-faint">-- </span>
            <span className="text-amber">SELECT</span>
            {LAB.queryLine.slice(3, chars)}
            {!done && <span className="caret text-teal">▍</span>}
          </span>
        </div>
        <div className={`flex gap-4 mt-3 transition-opacity duration-500 ${done ? "opacity-100" : "opacity-0"}`}>
          <span className="text-faint select-none">✓</span>
          <span className="text-teal">{LAB.queryStatus}</span>
        </div>
      </div>
    </div>
  );
}

function ResultPanel() {
  const { ref, inView } = useInView<HTMLDivElement>(0.35);
  const bars = [42, 68, 55, 84, 72, 96, 88, 61];
  return (
    <div ref={ref} className="panel corner-frame p-5 md:p-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <span className="mono text-[0.6rem] tracking-[0.26em] text-faint">RESULT SET — SKILL × IMPACT</span>
        <span className="mono text-[0.58rem] text-teal flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-teal pulse-dot" aria-hidden="true" /> LIVE
        </span>
      </div>
      <div className="mt-5 flex items-end gap-2 h-28" role="img" aria-label="Animated bar chart">
        {bars.map((h, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
            <div
              className={`w-full transition-all duration-700 ease-out ${i === 5 ? "bg-amber" : "bg-teal/70"}`}
              style={{ height: inView ? `${h}%` : "4%", transitionDelay: `${i * 90}ms` }}
            />
            <span className="mono text-[0.5rem] text-faint">{["SQ", "PY", "PB", "XL", "ET", "AS", "DB", "AI"][i]}</span>
          </div>
        ))}
      </div>
      <div className="mt-5 grid grid-cols-2 gap-2 mono text-[0.58rem] tracking-[0.14em] text-dim">
        <div className="border border-line/70 px-3 py-2 flex justify-between"><span>ROWS</span><span className="text-ink">2,048</span></div>
        <div className="border border-line/70 px-3 py-2 flex justify-between"><span>TIME</span><span className="text-teal">0.03s</span></div>
      </div>
    </div>
  );
}

function ResourceRow({ r, i }: { r: (typeof LAB.resources)[number]; i: number }) {
  return (
    <Reveal delay={i * 0.07}>
      <a
        href={r.href}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor
        className="group grid grid-cols-[40px_1fr_auto] md:grid-cols-[64px_1fr_auto] items-start gap-4 md:gap-8 border-t border-line/80 py-5 md:py-6 transition-all duration-300 hover:bg-panel/60 hover:pl-3"
      >
        <span className="mono text-[0.66rem] text-faint tracking-[0.2em] pt-1">{String(i + 1).padStart(2, "0")}</span>
        <span className="block min-w-0">
          <span className="flex flex-wrap items-center gap-3">
            <span className="display text-[1.15rem] md:text-[1.35rem] text-ink group-hover:text-teal transition-colors duration-300">{r.title}</span>
            <span className="chip !text-[0.56rem]">{r.tag}</span>
          </span>
          <span className="block text-dim text-[0.86rem] leading-relaxed mt-1.5 max-w-2xl">{r.body}</span>
        </span>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true" className="text-faint transition-all duration-300 group-hover:text-amber group-hover:translate-x-1 group-hover:-translate-y-1 mt-1">
          <path d="M4 18L18 4M18 4H7M18 4v11" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </a>
    </Reveal>
  );
}

export function Lab() {
  return (
    <section id="tools" aria-label="Tools and dashboards lab" className="relative">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10 py-24 md:py-36">
        <div className="max-w-2xl">
          <Reveal><p className="kicker">{LAB.kicker} — Scene 09</p></Reveal>
          <MaskLines className="display mt-6 text-[clamp(1.9rem,3.4vw,3rem)] leading-[1.08] text-ink" lines={["Explore My Tools", "& Dashboards"]} />
          <Reveal delay={0.15}>
            <p className="mt-5 text-dim leading-relaxed max-w-xl">{LAB.sub}</p>
          </Reveal>
        </div>

        <div className="mt-14 grid lg:grid-cols-2 gap-5 items-stretch">
          <TypedQuery />
          <ResultPanel />
        </div>

        <div className="mt-16">
          <Reveal>
            <p className="mono text-[0.62rem] tracking-[0.32em] text-faint uppercase flex items-center gap-4">
              Lab Modules
              <span className="h-px flex-1 max-w-[140px] bg-line" />
              <span className="text-teal">05 LIVE RESOURCES</span>
            </p>
          </Reveal>
          <div className="mt-4 border-b border-line/80">
            {LAB.resources.map((r, i) => (
              <ResourceRow key={r.title} r={r} i={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Scene 10 — intelligence interstitial ---------------- */

export function Intel() {
  return (
    <section id="intel" aria-label="Intelligence" className="relative h-[120vh]">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center text-center px-6">
        <p className="kicker">Scene 10 — The Visual Language</p>
        <h2 className="display mt-8 flex flex-wrap items-baseline justify-center gap-x-3 md:gap-x-5 text-[clamp(1.9rem,6vw,4.6rem)] leading-[1.05] text-ink">
          <Scramble text="DATA" as="span" className="text-teal" />
          <span className="text-faint font-normal" aria-hidden="true">+</span>
          <Scramble text="AUTOMATION" as="span" delay={350} />
          <span className="text-faint font-normal" aria-hidden="true">+</span>
          <Scramble text="INTELLIGENCE" as="span" className="text-amber" delay={700} />
        </h2>
        <Reveal delay={0.4}>
          <p className="mono mt-8 text-[0.64rem] md:text-[0.7rem] tracking-[0.3em] text-faint max-w-xl leading-loose">
            EVERY PARTICLE, STREAM AND GAUGE ON THIS PAGE FOLLOWS ONE IDEA —
            <span className="text-dim"> THE LATTICE YOU'RE FLYING THROUGH IS THE METAPHOR.</span>
          </p>
        </Reveal>
        <div className="mt-10 flex items-center gap-3" aria-hidden="true">
          <span className="w-2 h-2 bg-teal pulse-dot" />
          <span className="w-10 h-px bg-line2" />
          <span className="w-2 h-2 bg-amber pulse-dot" style={{ animationDelay: "0.6s" }} />
        </div>
      </div>
    </section>
  );
}
