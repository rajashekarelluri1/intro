import { useEffect, useRef } from "react";
import { gsap, reducedMotion, ScrollTrigger } from "../lib/engine";
import { MaskLines, Reveal } from "../lib/fx";
import { CAREER } from "../data/profile";

function ArrowMark() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="mt-[0.32rem] shrink-0">
      <path d="M2 7h9M8 3.5L11.5 7 8 10.5" stroke="#45e5c6" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Career() {
  const sectionRef = useRef<HTMLElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        fillRef.current,
        { scaleY: 0 },
        {
          scaleY: 1, ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%", end: "bottom 60%", scrub: 0.6 },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" ref={sectionRef} aria-label="Professional experience" className="relative">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10 py-24 md:py-36">
        <div className="max-w-2xl">
          <Reveal><p className="kicker">{CAREER.kicker} — Scene 07</p></Reveal>
          <MaskLines className="display mt-6 text-[clamp(1.9rem,3.4vw,3rem)] leading-[1.08] text-ink" lines={[CAREER.heading]} />
          <Reveal delay={0.15}>
            <p className="mt-5 text-dim leading-relaxed max-w-xl">{CAREER.sub}</p>
          </Reveal>
        </div>

        <div className="relative mt-16 md:mt-24 pl-8 md:pl-24">
          {/* rail */}
          <div className="absolute left-[7px] md:left-10 top-0 bottom-0 w-px bg-line" aria-hidden="true" />
          <div ref={fillRef} className="absolute left-[7px] md:left-10 top-0 bottom-0 w-px bg-gradient-to-b from-teal via-teal to-amber origin-top" aria-hidden="true" />

          <ol className="space-y-16 md:space-y-24">
            {CAREER.jobs.map((job, ji) => (
              <li key={job.company} className="relative">
                {/* node */}
                <span
                  className={`absolute -left-8 md:-left-[4.35rem] top-2 grid place-items-center w-[15px] h-[15px] rotate-45 border-2 ${job.current ? "border-amber bg-amber/25" : "border-teal bg-bg0"}`}
                  aria-hidden="true"
                >
                  {job.current && <span className="w-1.5 h-1.5 bg-amber pulse-dot -rotate-45" />}
                </span>

                <Reveal>
                  <div className="mono flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.64rem] tracking-[0.26em]">
                    <span className={job.current ? "text-amber" : "text-teal"}>{job.years}</span>
                    <span className="text-faint">{job.period.toUpperCase()}</span>
                    <span className="text-faint flex items-center gap-1.5">
                      <svg width="10" height="12" viewBox="0 0 10 12" fill="none" aria-hidden="true"><path d="M5 1C2.8 1 1 2.8 1 5c0 3 4 6 4 6s4-3 4-6c0-2.2-1.8-4-4-4z" stroke="currentColor" strokeWidth="1.2" /><circle cx="5" cy="5" r="1.4" stroke="currentColor" strokeWidth="1.2" /></svg>
                      {job.location.toUpperCase()}
                    </span>
                    {job.current && (
                      <span className="flex items-center gap-1.5 border border-amber/40 text-amber px-2 py-0.5">
                        <span className="w-1 h-1 rounded-full bg-amber pulse-dot" aria-hidden="true" />
                        CURRENT
                      </span>
                    )}
                  </div>
                </Reveal>

                <Reveal delay={0.08}>
                  <h3 className="display mt-4 text-[clamp(1.6rem,3vw,2.4rem)] text-ink leading-tight">{job.role}</h3>
                  <p className={`display text-[1.1rem] mt-1 ${job.current ? "text-amber" : "text-teal"}`}>@ {job.company}</p>
                </Reveal>

                <Reveal delay={0.14}>
                  <p className="mt-5 text-dim leading-relaxed max-w-2xl">{job.summary}</p>
                </Reveal>

                <ul className="mt-7 grid md:grid-cols-2 gap-x-10 gap-y-3.5 max-w-4xl">
                  {job.bullets.map((b, bi) => (
                    <Reveal key={bi} delay={0.18 + bi * 0.05}>
                      <li className="flex items-start gap-3 text-[0.92rem] leading-relaxed text-dim">
                        <ArrowMark />
                        <span>{b}</span>
                      </li>
                    </Reveal>
                  ))}
                </ul>

                <Reveal delay={0.3}>
                  <div className="mt-7 flex flex-wrap gap-2">
                    {job.chips.map((c) => (
                      <span key={c} className="chip">{c}</span>
                    ))}
                  </div>
                </Reveal>

                {ji === 1 && (
                  <Reveal delay={0.2}>
                    <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t border-line/80 pt-6">
                      {[
                        ["80%", "LESS MANUAL EFFORT"],
                        ["99%+", "DATA ACCURACY"],
                        ["25%", "TEAM EFFICIENCY GAIN"],
                        ["6", "AWARDS EARNED"],
                      ].map(([v, l]) => (
                        <div key={l}>
                          <div className="display text-[1.7rem] text-amber leading-none">{v}</div>
                          <div className="mono mt-1.5 text-[0.56rem] tracking-[0.24em] text-faint">{l}</div>
                        </div>
                      ))}
                    </div>
                  </Reveal>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
