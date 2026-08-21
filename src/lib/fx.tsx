import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { gsap, reducedMotion } from "./engine";

const GLYPHS = "▓▒░<>/[]{}#$%&@01";

export function useInView<T extends HTMLElement>(threshold = 0.25) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reducedMotion()) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/** Decode-scramble text reveal — the site's signature "data resolving" motion. */
export function Scramble({
  text,
  className,
  delay = 0,
  speed = 26,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
  as?: "span" | "h1" | "h2" | "h3" | "p" | "div";
}) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.2);
  const [out, setOut] = useState(reducedMotion() ? text : "");
  useEffect(() => {
    if (!inView) return;
    if (reducedMotion()) {
      setOut(text);
      return;
    }
    let frame = 0;
    let raf = 0;
    let started = false;
    const total = text.length;
    const timer = window.setTimeout(() => {
      started = true;
      const tick = () => {
        frame++;
        const resolved = Math.floor(frame / 2.2);
        let s = "";
        for (let i = 0; i < total; i++) {
          const ch = text[i];
          if (ch === " " || ch === "\n") {
            s += ch;
          } else if (i < resolved) {
            s += ch;
          } else if (i < resolved + 7) {
            s += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          } else {
            s += "";
          }
        }
        setOut(s);
        if (resolved <= total) raf = requestAnimationFrame(tick);
        else setOut(text);
      };
      tick();
    }, delay);
    return () => {
      window.clearTimeout(timer);
      if (started) cancelAnimationFrame(raf);
    };
  }, [inView, text, delay, speed]);
  return (
    <Tag ref={ref as never} className={className} aria-label={text}>
      {out || "\u00A0"}
    </Tag>
  );
}

/** Numeric count-up when scrolled into view. */
export function CountUp({
  to,
  suffix = "",
  prefix = "",
  duration = 1800,
  className,
}: {
  to: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.4);
  const [val, setVal] = useState(reducedMotion() ? to : 0);
  useEffect(() => {
    if (!inView) return;
    if (reducedMotion()) {
      setVal(to);
      return;
    }
    const obj = { v: 0 };
    const tw = gsap.to(obj, {
      v: to,
      duration: duration / 1000,
      ease: "power2.out",
      onUpdate: () => setVal(Math.round(obj.v)),
    });
    return () => {
      tw.kill();
    };
  }, [inView, to, duration]);
  return (
    <span ref={ref} className={className}>
      {prefix}
      {val}
      {suffix}
    </span>
  );
}

/** Line-mask reveal: each line slides up from behind a mask. */
export function MaskLines({
  lines,
  className,
  lineClassName,
  stagger = 0.12,
  delay = 0,
}: {
  lines: string[];
  className?: string;
  lineClassName?: string;
  stagger?: number;
  delay?: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  useEffect(() => {
    if (!inView || !ref.current) return;
    if (reducedMotion()) return;
    const spans = ref.current.querySelectorAll<HTMLElement>(".mask-line > span");
    const tw = gsap.to(spans, {
      y: 0,
      duration: 1.05,
      ease: "power4.out",
      stagger,
      delay,
    });
    return () => {
      tw.kill();
    };
  }, [inView, stagger, delay, ref]);
  return (
    <h2 ref={ref as never} className={className}>
      {lines.map((l, i) => (
        <span className="mask-line" key={i}>
          <span className={lineClassName}>{l}</span>
        </span>
      ))}
    </h2>
  );
}

/** Fade-rise reveal wrapper. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 26,
  style,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { ref: inRef, inView } = useInView<HTMLDivElement>(0.18);
  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;
    if (reducedMotion()) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }
    const tw = gsap.fromTo(
      el,
      { opacity: 0, y },
      { opacity: 1, y: 0, duration: 0.95, ease: "power3.out", delay }
    );
    return () => {
      tw.kill();
    };
  }, [inView, delay, y]);
  return (
    <div
      ref={(n) => {
        ref.current = n;
        (inRef as { current: HTMLDivElement | null }).current = n;
      }}
      className={className}
      style={{ opacity: reducedMotion() ? 1 : 0, ...style }}
    >
      {children}
    </div>
  );
}

/** Typewriter loop for small terminal strings. */
export function TypeLoop({ words, className, startDelay = 600 }: { words: string[]; className?: string; startDelay?: number }) {
  const [text, setText] = useState(reducedMotion() ? words.join(" · ") : "");
  useEffect(() => {
    if (reducedMotion()) return;
    let wi = 0;
    let ci = 0;
    let deleting = false;
    let timer = 0;
    const tick = () => {
      const word = words[wi];
      if (!deleting) {
        ci++;
        setText(word.slice(0, ci));
        if (ci >= word.length) {
          deleting = true;
          timer = window.setTimeout(tick, 1500);
          return;
        }
        timer = window.setTimeout(tick, 85);
      } else {
        ci--;
        setText(word.slice(0, ci));
        if (ci <= 0) {
          deleting = false;
          wi = (wi + 1) % words.length;
          timer = window.setTimeout(tick, 350);
          return;
        }
        timer = window.setTimeout(tick, 42);
      }
    };
    timer = window.setTimeout(tick, startDelay);
    return () => window.clearTimeout(timer);
  }, [words, startDelay]);
  return (
    <span className={className}>
      {text}
      <span className="caret text-teal">▍</span>
    </span>
  );
}
