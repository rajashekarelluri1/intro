import { useEffect, useRef, useState } from "react";
import { initEngine, ScrollTrigger } from "./lib/engine";
import type { DataWorld } from "./three/world";
import { Chrome } from "./components/Chrome";
import Hero from "./components/Hero";
import { About, Impact } from "./components/About";
import { Education, Toolbox } from "./components/EduSkills";
import Workflow from "./components/Workflow";
import Career from "./components/Career";
import Projects from "./components/Projects";
import { Intel, Lab } from "./components/Lab";
import Contact from "./components/Contact";

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    const cleanupEngine = initEngine();
    let world: DataWorld | null = null;
    let cancelled = false;

    // lazy-load the heavy WebGL scene so the first paint stays fast
    import("./three/world")
      .then(({ DataWorld: World }) => {
        if (cancelled || !canvasRef.current) return;
        world = new World(canvasRef.current);
        world.start();
        world.refresh();
        ScrollTrigger.refresh();
      })
      .catch((err) => {
        // graceful fallback: the site remains fully usable without WebGL
        console.warn("WebGL unavailable — static experience active.", err);
      });

    const t = window.setTimeout(() => ScrollTrigger.refresh(), 600);
    const onFonts = () => {
      world?.refresh();
      ScrollTrigger.refresh();
    };
    if (document.fonts?.ready) document.fonts.ready.then(onFonts).catch(() => undefined);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
      world?.dispose();
      cleanupEngine();
    };
  }, []);

  return (
    <div className="grain relative min-h-screen bg-bg0 text-ink selection:bg-teal/30">
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-teal focus:text-bg0 focus:px-4 focus:py-2 mono text-xs"
      >
        Skip to content
      </a>

      {/* cinematic WebGL backdrop */}
      <canvas ref={canvasRef} className="fixed inset-0 z-0 w-full h-full pointer-events-none" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
      <div className="bg-blueprint fixed inset-0 z-0 pointer-events-none" aria-hidden="true" />

      <Chrome booted={booted} onBoot={() => setBooted(true)} />

      <main id="main" className="relative z-10">
        <Hero booted={booted} />
        <About />
        <Impact />
        <Education />
        <Toolbox />
        <Workflow />
        <Career />
        <Projects />
        <Lab />
        <Intel />
        <Contact />
      </main>
    </div>
  );
}
