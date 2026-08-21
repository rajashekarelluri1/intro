import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

/**
 * Root-level safety net. If anything inside the app throws during render,
 * we retry the mount once (covers transient init races). If it still fails,
 * we render a complete static profile page so the preview is never blank.
 */
class RootBoundary extends React.Component<
  { children: React.ReactNode },
  { failed: boolean; attempts: number }
> {
  state = { failed: false, attempts: 0 };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error("Application error caught at root:", error);
    if (this.state.attempts < 1) {
      window.setTimeout(() => {
        this.setState((s) => ({ attempts: s.attempts + 1, failed: false }));
      }, 0);
    }
  }

  render() {
    if (this.state.failed) {
      if (this.state.attempts < 1) return null; // brief pause before single retry
      return <StaticFallback />;
    }
    return this.props.children;
  }
}

function StaticFallback() {
  const s: React.CSSProperties = { maxWidth: 860, margin: "0 auto", padding: "96px 24px", color: "#e9f1fa", fontFamily: "'General Sans', system-ui, sans-serif" };
  const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: "#45e5c6" };
  return (
    <main style={{ background: "#05070d", minHeight: "100vh" }}>
      <div style={s}>
        <p style={mono}>Data Analyst &amp; BI Expert — Hyderabad, India</p>
        <h1 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(2.5rem, 7vw, 4.5rem)", margin: "16px 0 8px", lineHeight: 1.05 }}>
          Elluri Rajashekar
        </h1>
        <p style={{ color: "#93a3ba", lineHeight: 1.7, maxWidth: 640 }}>
          Passionate about converting complex data into actionable business intelligence. Specializing in
          SQL, Python, Power BI, and process automation to drive organizational growth and efficiency.
          Results-driven Data Analyst with experience at Tech Mahindra and Frugal Testing — 4 Bravo Awards
          &amp; 2 Pat on the Back Awards, and an 80% reduction in manual processes through automation.
        </p>
        <h2 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "1.4rem", margin: "40px 0 12px" }}>Get in touch</h2>
        <ul style={{ lineHeight: 2.2, color: "#93a3ba" }}>
          <li>
            Email: <a style={{ color: "#45e5c6" }} href="mailto:rajashekarelluri@gmail.com">rajashekarelluri@gmail.com</a>
          </li>
          <li>Phone: +91 8XXXXXXXX1</li>
          <li>
            LinkedIn:{" "}
            <a style={{ color: "#45e5c6" }} href="https://www.linkedin.com/in/elluri-rajashekar/">
              in/elluri-rajashekar
            </a>
          </li>
        </ul>
        <h2 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "1.4rem", margin: "40px 0 12px" }}>Resources</h2>
        <ul style={{ lineHeight: 2.2, color: "#93a3ba" }}>
          <li><a style={{ color: "#45e5c6" }} href="https://rajashekarelluri1.github.io/info/sql.htm">SQL Master Cheatsheet</a></li>
          <li><a style={{ color: "#45e5c6" }} href="https://rajashekarelluri1.github.io/info/sql1.htm">SQL Zero to Hero</a></li>
          <li><a style={{ color: "#45e5c6" }} href="https://rajashekarelluri1.github.io/info/excel.html">Excel Mastery</a></li>
          <li><a style={{ color: "#45e5c6" }} href="https://rajashekarelluri1.github.io/info/powerbi.html">Power BI Mastery</a></li>
          <li><a style={{ color: "#45e5c6" }} href="https://rajashekarelluri1.github.io/info/projects.htm">Interactive Dashboards</a></li>
        </ul>
      </div>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RootBoundary>
    <App />
  </RootBoundary>
);
