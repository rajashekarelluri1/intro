import { useRef, type ReactNode } from "react";
import { isCoarsePointer, reducedMotion } from "../lib/engine";
import { MaskLines, Reveal } from "../lib/fx";
import { CONTACT, NAV_LINKS, PROFILE } from "../data/profile";

function Magnetic({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const enabled = !isCoarsePointer() && !reducedMotion();
  return (
    <a
      ref={ref}
      href={`mailto:${PROFILE.email}`}
      data-cursor
      className={className}
      onMouseMove={(e) => {
        if (!enabled || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        ref.current.style.transform = `translate(${x * 0.18}px, ${y * 0.28}px)`;
      }}
      onMouseLeave={() => {
        if (ref.current) ref.current.style.transform = "";
      }}
    >
      {children}
    </a>
  );
}

function ChannelIcon({ kind }: { kind: string }) {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      {kind === "email" && (
        <>
          <rect x="2.5" y="5.5" width="21" height="15" stroke="#45e5c6" strokeWidth="1.5" />
          <path d="M3 6.5L13 14l10-7.5" stroke="#45e5c6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      {kind === "phone" && (
        <path d="M6 3h4l1.5 5-2.3 1.8a13.5 13.5 0 006 6L17 13.5l5 1.5v4a2 2 0 01-2.2 2A18.5 18.5 0 014 5.2 2 2 0 016 3z" stroke="#ffb454" strokeWidth="1.5" strokeLinejoin="round" />
      )}
      {kind === "linkedin" && (
        <>
          <rect x="3" y="3" width="20" height="20" stroke="#6fa8ff" strokeWidth="1.5" />
          <path d="M8 11.5V18M8 8v.2M12.5 18v-4a2.4 2.4 0 014.8 0v4" stroke="#6fa8ff" strokeWidth="1.6" strokeLinecap="round" />
        </>
      )}
      {kind === "pin" && (
        <>
          <path d="M13 3C9 3 6 6 6 9.8 6 15 13 23 13 23s7-8 7-13.2C20 6 17 3 13 3z" stroke="#45e5c6" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="13" cy="10" r="2.6" stroke="#ffb454" strokeWidth="1.5" />
        </>
      )}
    </svg>
  );
}

const CHANNELS = [
  { kind: "email", label: "Email", value: PROFILE.email, href: `mailto:${PROFILE.email}`, external: false },
  { kind: "phone", label: "Phone", value: PROFILE.phoneDisplay, href: PROFILE.phoneHref, external: false },
  { kind: "linkedin", label: "LinkedIn", value: PROFILE.linkedinLabel, href: PROFILE.linkedinUrl, external: true },
  { kind: "pin", label: "Location", value: PROFILE.location, href: undefined, external: false },
];

export default function Contact() {
  return (
    <section id="contact" aria-label="Contact" className="relative">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10 pt-24 md:pt-36 pb-16">
        <div className="max-w-3xl">
          <Reveal><p className="kicker">{CONTACT.kicker}</p></Reveal>
          <Reveal delay={0.08}>
            <p className="mt-6 text-dim leading-relaxed max-w-2xl">{CONTACT.lead}</p>
          </Reveal>
          <MaskLines
            className="display mt-8 text-[clamp(2.3rem,6vw,5rem)] leading-[1.0] text-ink"
            lines={["Let's build something", "data-driven together"]}
            stagger={0.16}
          />
          <Reveal delay={0.2}>
            <p className="mt-6 text-dim text-[1.02rem] leading-relaxed max-w-xl">{CONTACT.sub}</p>
          </Reveal>

          <Reveal delay={0.3} className="mt-10 flex flex-wrap items-center gap-5">
            <Magnetic className="btn-magnetic group inline-flex items-center gap-4 bg-teal text-bg0 px-9 py-4 display text-[1.1rem] font-semibold hover:bg-amber">
              {CONTACT.cta}
              <svg width="16" height="14" viewBox="0 0 16 14" fill="none" aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                <path d="M1 7h13M14 7L9 2M14 7l-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Magnetic>
            <a
              href={PROFILE.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-magnetic inline-flex items-center gap-3 border border-line2 px-7 py-4 display text-[0.98rem] text-ink hover:border-teal hover:text-teal"
            >
              Download Resume
            </a>
          </Reveal>
        </div>

        <div className="mt-16 md:mt-20 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CHANNELS.map((c, i) => {
            const inner = (
              <>
                <div className="flex items-center justify-between">
                  <ChannelIcon kind={c.kind} />
                  <span className="mono text-[0.56rem] tracking-[0.26em] text-faint">CH.0{i + 1}</span>
                </div>
                <p className="mono mt-6 text-[0.6rem] tracking-[0.28em] text-faint uppercase">{c.label}</p>
                <p className="display mt-2 text-[1.05rem] text-ink break-all leading-snug group-hover:text-teal transition-colors duration-300">{c.value}</p>
                {c.href && (
                  <p className="mono mt-3 text-[0.58rem] tracking-[0.2em] text-teal opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    OPEN CHANNEL →
                  </p>
                )}
              </>
            );
            const cls = "panel panel-glow corner-frame p-6 h-full block transition-transform duration-300 group hover:-translate-y-1.5";
            return (
              <Reveal key={c.label} delay={i * 0.08}>
                {c.href ? (
                  <a
                    href={c.href}
                    {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className={cls}
                    aria-label={`${c.label}: ${c.value}`}
                  >
                    {inner}
                  </a>
                ) : (
                  <div className={cls}>{inner}</div>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>

      {/* footer */}
      <footer className="relative border-t border-line/80 bg-bg0/80 backdrop-blur-sm">
        <div className="mx-auto max-w-[1500px] px-5 md:px-10 py-12">
          <div className="grid md:grid-cols-[auto_1fr_auto] gap-10 items-start">
            <div>
              <div className="flex items-center gap-3">
                <span className="display grid place-items-center w-10 h-10 border border-line2 text-teal">ER</span>
                <div>
                  <p className="display text-[0.95rem] text-ink">ELLURI RAJASHEKAR</p>
                  <p className="mono text-[0.56rem] tracking-[0.28em] text-faint mt-1">{PROFILE.role.toUpperCase()}</p>
                </div>
              </div>
              <p className="mono mt-5 text-[0.6rem] tracking-[0.24em] text-faint flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal pulse-dot" aria-hidden="true" />
                COMPILING INSIGHTS…
              </p>
            </div>

            <nav aria-label="Footer" className="md:justify-self-center">
              <p className="mono text-[0.58rem] tracking-[0.3em] text-faint uppercase mb-4">Navigate</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-2.5">
                {NAV_LINKS.map((l) => (
                  <a key={l.href} href={l.href} className="mono text-[0.66rem] tracking-[0.18em] uppercase text-dim hover:text-teal transition-colors duration-300">
                    {l.label}
                  </a>
                ))}
              </div>
            </nav>

            <div className="md:justify-self-end text-left md:text-right">
              <p className="mono text-[0.58rem] tracking-[0.3em] text-faint uppercase mb-4">Signal Path</p>
              <p className="display text-[0.95rem] text-dim">
                DATA <span className="text-teal">→</span> INSIGHT <span className="text-amber">→</span> DECISION
              </p>
              <p className="mono mt-4 text-[0.6rem] tracking-[0.16em] text-faint">{PROFILE.location.toUpperCase()}</p>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-line/60 flex flex-wrap items-center justify-between gap-4">
            <p className="mono text-[0.58rem] tracking-[0.2em] text-faint">
              © {new Date().getFullYear()} {PROFILE.name.toUpperCase()} — ALL DATA VERIFIED FROM THE ORIGINAL PORTFOLIO
            </p>
            <a href="#home" className="mono text-[0.58rem] tracking-[0.24em] text-dim hover:text-amber transition-colors duration-300 inline-flex items-center gap-2">
              BACK TO ORIGIN
              <svg width="10" height="12" viewBox="0 0 10 12" fill="none" aria-hidden="true"><path d="M5 11V1M5 1L1 5M5 1l4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
            </a>
          </div>
        </div>
      </footer>
    </section>
  );
}
