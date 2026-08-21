import { useEffect, useRef, useState } from "react";
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
      import("./three/world").then(({ DataWorld }) => {
        if (cancelled) return;
        if (world) world.dispose();
        world = new DataWorld(canvas, getTheme());
        world.start();
        window.clearTimeout(refreshTimer);
        refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 350);
      });
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

      <Chrome booted={booted} onBoot={() => setBooted(true)} />

      <main className="relative z-10">
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
