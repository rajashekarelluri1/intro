import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { initEngine, ScrollTrigger, THEME_EVENT, getTheme } from "./lib/engine";
import type { DataWorld } from "./three/world";
import { Chrome } from "./components/Chrome";
import Hero from "./components/Hero";
import { About, Impact } from "./components/About";
import { Education, Toolbox } from "./components/EduSkills";
import Workflow from "./components/Workflow";
import Career from "./components/Career";
import Projects from "./components/Projects";
import { Lab, Intel } from "./components/Lab";
import Contact from "./components/Contact";

/** Keeps the page alive even if a single scene misbehaves at runtime. */
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn("Scene error contained:", error);
  }
  render() {
    if (this.state.failed) {
      return (
        <section className="relative mx-auto max-w-[1500px] px-6 py-40 text-center">
          <p className="mono text-[0.66rem] tracking-[0.3em] text-faint uppercase">
            A scene failed to render — the journey continues below.
          </p>
        </section>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    initEngine();
    const canvas = canvasRef.current;
    let world: DataWorld | null = null;
    let cancelled = false;
    let refreshTimer = 0;

    const boot = () => {
      if (!canvas) return;
      // Three.js lives in its own lazy chunk — first paint stays fast.
      // WebGL failure must never take the page down with it.
      import("./three/world")
        .then(({ DataWorld }) => {
          if (cancelled) return;
          try {
            if (world) world.dispose();
            world = new DataWorld(canvas, getTheme());
            world.start();
          } catch (err) {
            console.warn("3D world unavailable — continuing without WebGL.", err);
            world = null;
          }
          window.clearTimeout(refreshTimer);
          refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 350);
        })
        .catch((err) => console.warn("3D world chunk failed to load.", err));
    };

    boot();
    // Rebuild the 3D world with the new palette whenever the theme changes.
    window.addEventListener(THEME_EVENT, boot);
    return () => {
      cancelled = true;
      window.removeEventListener(THEME_EVENT, boot);
      window.clearTimeout(refreshTimer);
      world?.dispose();
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-bg0 text-ink font-body overflow-x-clip">
      <canvas ref={canvasRef} className="fixed inset-0 z-0 h-full w-full" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      <SceneBoundary>
        <Chrome booted={booted} onBoot={() => setBooted(true)} />
      </SceneBoundary>

      <main className="relative z-10">
        <SceneBoundary>
          <Hero booted={booted} />
        </SceneBoundary>
        <SceneBoundary>
          <About />
        </SceneBoundary>
        <SceneBoundary>
          <Impact />
        </SceneBoundary>
        <SceneBoundary>
          <Education />
        </SceneBoundary>
        <SceneBoundary>
          <Toolbox />
        </SceneBoundary>
        <SceneBoundary>
          <Workflow />
        </SceneBoundary>
        <SceneBoundary>
          <Career />
        </SceneBoundary>
        <SceneBoundary>
          <Projects />
        </SceneBoundary>
        <SceneBoundary>
          <Lab />
        </SceneBoundary>
        <SceneBoundary>
          <Intel />
        </SceneBoundary>
        <SceneBoundary>
          <Contact />
        </SceneBoundary>
      </main>
    </div>
  );
}
