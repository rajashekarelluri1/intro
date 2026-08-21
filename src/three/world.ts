import * as THREE from "three";
import { worldState, reducedMotion, isCoarsePointer, type ThemeName } from "../lib/engine";

export type StationId =
  | "home" | "about" | "impact" | "education" | "toolbox" | "workflow"
  | "experience" | "projects" | "tools" | "intel" | "contact";

const ORDER: StationId[] = [
  "home", "about", "impact", "education", "toolbox", "workflow",
  "experience", "projects", "tools", "intel", "contact",
];

const STATION_Z: Record<StationId, number> = {
  home: 0, about: -55, impact: -110, education: -165, toolbox: -220,
  workflow: -278, experience: -380, projects: -445, tools: -525,
  intel: -580, contact: -640,
};

type GlowKey = "teal" | "tealSoft" | "amber" | "blue" | "gold";

interface Palette {
  bg: number;
  teal: number;
  amber: number;
  blue: number;
  dim: number;
  line: number;
  gridA: number;
  gridB: number;
  starA: number;
  paleNode: number;
  restBar: number;
  pylonBody: number;
  winDark: number;
  monoLine: number;
  cellDark: number;
  tealHex: string;
  amberHex: string;
  blueHex: string;
  dimHex: string;
  faintHex: string;
  glow: Record<GlowKey, [string, string]>;
  blend: THREE.Blending;
  gridOpacity: number;
  starOpacity: number;
}

const DARK: Palette = {
  bg: 0x05070d,
  teal: 0x45e5c6,
  amber: 0xffb454,
  blue: 0x6fa8ff,
  dim: 0x5c6b84,
  line: 0x1b2940,
  gridA: 0x1a2a45,
  gridB: 0x0e1930,
  starA: 0x8fa3c2,
  paleNode: 0xc8d6ea,
  restBar: 0x16233a,
  pylonBody: 0x101b30,
  winDark: 0x16233a,
  monoLine: 0x2c405f,
  cellDark: 0x1d3050,
  tealHex: "#45e5c6",
  amberHex: "#ffb454",
  blueHex: "#6fa8ff",
  dimHex: "#93a3ba",
  faintHex: "#5c6b84",
  glow: {
    teal: ["rgba(69,229,198,0.5)", "rgba(69,229,198,0.12)"],
    tealSoft: ["rgba(69,229,198,0.4)", "rgba(69,229,198,0.08)"],
    amber: ["rgba(255,180,84,0.6)", "rgba(255,180,84,0.1)"],
    blue: ["rgba(111,168,255,0.22)", "rgba(111,168,255,0.05)"],
    gold: ["rgba(255,214,150,0.75)", "rgba(255,180,84,0.16)"],
  },
  blend: THREE.AdditiveBlending,
  gridOpacity: 0.5,
  starOpacity: 0.5,
};

const LIGHT: Palette = {
  bg: 0xe9eff8,
  teal: 0x0b8f76,
  amber: 0xd9820f,
  blue: 0x2b5fc4,
  dim: 0x5d6d88,
  line: 0xb9c6d9,
  gridA: 0xc2cfdf,
  gridB: 0xd8e1ee,
  starA: 0x8ea3c2,
  paleNode: 0x52657f,
  restBar: 0xc7d3e4,
  pylonBody: 0xf4f7fc,
  winDark: 0xd3ddec,
  monoLine: 0x94a7c2,
  cellDark: 0xd8e2f0,
  tealHex: "#0b8f76",
  amberHex: "#b26a08",
  blueHex: "#2b5fc4",
  dimHex: "#47566f",
  faintHex: "#7d8ca5",
  glow: {
    teal: ["rgba(11,143,118,0.38)", "rgba(11,143,118,0.1)"],
    tealSoft: ["rgba(11,143,118,0.28)", "rgba(11,143,118,0.07)"],
    amber: ["rgba(178,106,8,0.42)", "rgba(178,106,8,0.1)"],
    blue: ["rgba(43,95,196,0.16)", "rgba(43,95,196,0.05)"],
    gold: ["rgba(214,138,10,0.45)", "rgba(178,106,8,0.12)"],
  },
  blend: THREE.NormalBlending,
  gridOpacity: 0.7,
  starOpacity: 0.35,
};

const v0 = new THREE.Vector3();
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

interface Anchor { id: StationId; start: number; end: number; z: number; }

export class DataWorld {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private clock = new THREE.Clock();
  private raf = 0;
  private anchors: Anchor[] = [];
  private updates: Array<(t: number, lp: number, station: StationId) => void> = [];
  private lpById: Partial<Record<StationId, number>> = {};
  private camZ = 22;
  private camX = 0;
  private camY = 0;
  private coarse: boolean;
  private staticMode: boolean;
  private visible = true;
  private fpsFrames = 0;
  private fpsTime = 0;
  private degraded = false;
  private disposed = false;
  private disposables: Array<{ dispose: () => void }> = [];
  private P: Palette;

  constructor(canvas: HTMLCanvasElement, theme: ThemeName = "dark") {
    this.coarse = isCoarsePointer();
    this.staticMode = reducedMotion();
    this.P = theme === "light" ? LIGHT : DARK;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !this.coarse,
      powerPreference: "high-performance",
      alpha: false,
    });
    this.renderer.setClearColor(this.P.bg, 1);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.coarse ? 1.5 : 1.75));
    this.renderer.setSize(window.innerWidth, window.innerHeight, false);

    this.camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 400);
    this.camera.position.set(0, 0, 22);

    this.scene.fog = new THREE.Fog(this.P.bg, 26, 165);

    this.buildAmbient();
    this.buildHome();
    this.buildAbout();
    this.buildImpact();
    this.buildEducation();
    this.buildToolbox();
    this.buildWorkflow();
    this.buildCareer();
    this.buildProjects();
    this.buildLab();
    this.buildIntel();
    this.buildContact();

    window.addEventListener("resize", this.onResize);
    document.addEventListener("visibilitychange", this.onVisibility);
  }

  /* ---------------- helpers ---------------- */

  private track<T extends { dispose: () => void }>(d: T): T {
    this.disposables.push(d);
    return d;
  }

  private geom<T extends THREE.BufferGeometry>(g: T): T { return this.track(g); }
  private mat<T extends THREE.Material>(m: T): T { return this.track(m); }

  private label(text: string, color: string, scale = 1.4): THREE.Sprite {
    const c = document.createElement("canvas");
    const pad = 26;
    let ctx = c.getContext("2d")!;
    ctx.font = "600 46px 'JetBrains Mono', monospace";
    c.width = Math.ceil(ctx.measureText(text).width) + pad * 2;
    c.height = 100;
    ctx = c.getContext("2d")!;
    ctx.font = "600 46px 'JetBrains Mono', monospace";
    ctx.textBaseline = "middle";
    ctx.fillStyle = color;
    ctx.fillText(text, pad, 54);
    const tex = this.track(new THREE.CanvasTexture(c));
    tex.minFilter = THREE.LinearFilter;
    const m = this.mat(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, opacity: 0.92 }));
    const sp = new THREE.Sprite(m);
    sp.scale.set((c.width / c.height) * scale, scale, 1);
    return sp;
  }

  private glowTexture(key: GlowKey): THREE.Texture {
    const [inner, outer] = this.P.glow[key];
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(64, 64, 2, 64, 64, 64);
    g.addColorStop(0, inner);
    g.addColorStop(0.35, outer);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    return this.track(new THREE.CanvasTexture(c));
  }

  private glow(key: GlowKey, size: number): THREE.Sprite {
    const m = this.mat(new THREE.SpriteMaterial({
      map: this.glowTexture(key),
      transparent: true, depthWrite: false, blending: this.P.blend, opacity: 0.85,
    }));
    const s = new THREE.Sprite(m);
    s.scale.setScalar(size);
    return s;
  }

  private points(
    n: number,
    fill: (i: number, out: THREE.Vector3) => void,
    color: number, size: number, opacity = 0.8, glowBlend = false
  ): THREE.Points {
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      fill(i, v0);
      pos[i * 3] = v0.x; pos[i * 3 + 1] = v0.y; pos[i * 3 + 2] = v0.z;
    }
    const g = this.geom(new THREE.BufferGeometry());
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const m = this.mat(new THREE.PointsMaterial({
      color, size, transparent: true, opacity, depthWrite: false,
      blending: glowBlend ? this.P.blend : THREE.NormalBlending, sizeAttenuation: true,
    }));
    return new THREE.Points(g, m);
  }

  private group(id: StationId): THREE.Group {
    const g = new THREE.Group();
    g.position.z = STATION_Z[id];
    this.scene.add(g);
    return g;
  }

  /* ---------------- ambient ---------------- */

  private buildAmbient() {
    const P = this.P;
    const q = this.coarse ? 0.5 : 1;

    const stars1 = this.points(Math.floor(1300 * q), (_i, v) => {
      v.set((Math.random() - 0.5) * 130, (Math.random() - 0.5) * 60, 30 - Math.random() * 720);
    }, P.starA, 0.16, P.starOpacity);
    this.scene.add(stars1);

    const stars2 = this.points(Math.floor(420 * q), (_i, v) => {
      v.set((Math.random() - 0.5) * 90, (Math.random() - 0.5) * 44, 25 - Math.random() * 700);
    }, P.teal, 0.22, P.starOpacity * 0.7, true);
    this.scene.add(stars2);

    const grid = new THREE.GridHelper(780, 130, P.gridA, P.gridB);
    grid.position.set(0, -9.5, -320);
    const gm = grid.material as THREE.Material;
    gm.transparent = true;
    gm.opacity = P.gridOpacity;
    this.track(gm);
    this.scene.add(grid);

    const rnd = (a: number, b: number) => a + Math.random() * (b - a);
    for (let s = 0; s < 6; s++) {
      const side = s % 2 === 0 ? 1 : -1;
      const x0 = side * rnd(6, 17);
      const y0 = rnd(-6, 7);
      const pts: THREE.Vector3[] = [];
      for (let k = 0; k < 6; k++) {
        const z = 25 - (k / 5) * 690;
        pts.push(new THREE.Vector3(
          x0 + rnd(-4, 4) + Math.sin(k * 1.7 + s) * 3,
          y0 + rnd(-3, 3) + Math.cos(k * 1.3 + s) * 2.4,
          z
        ));
      }
      const curve = new THREE.CatmullRomCurve3(pts);
      const lineGeo = this.geom(new THREE.BufferGeometry().setFromPoints(curve.getPoints(140)));
      const lineMat = this.mat(new THREE.LineBasicMaterial({
        color: s % 3 === 2 ? P.amber : P.teal, transparent: true, opacity: 0.1,
      }));
      this.scene.add(new THREE.Line(lineGeo, lineMat));

      const n = this.coarse ? 6 : 11;
      const pg = this.geom(new THREE.BufferGeometry());
      pg.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
      const pm = this.mat(new THREE.PointsMaterial({
        color: s % 3 === 2 ? P.amber : P.teal, size: 0.3, transparent: true, opacity: 0.85,
        depthWrite: false, blending: this.P.blend,
      }));
      const ptsObj = new THREE.Points(pg, pm);
      this.scene.add(ptsObj);
      const speeds: number[] = [];
      for (let i = 0; i < n; i++) speeds.push(rnd(0.012, 0.03));
      this.updates.push((t) => {
        const attr = pg.getAttribute("position") as THREE.BufferAttribute;
        const contactFade = 1 - smooth(0.1, 0.55, this.lpById.contact ?? 0);
        (pm as THREE.PointsMaterial).opacity = 0.85 * contactFade;
        (lineMat as THREE.LineBasicMaterial).opacity = 0.1 * contactFade + 0.015;
        if (contactFade < 0.02) { ptsObj.visible = false; return; }
        ptsObj.visible = true;
        for (let i = 0; i < n; i++) {
          const u = this.staticMode ? (i + 0.5) / n : (t * speeds[i] + i / n) % 1;
          curve.getPointAt(u, v0);
          attr.setXYZ(i, v0.x, v0.y, v0.z);
        }
        attr.needsUpdate = true;
      });
    }
  }

  /* ---------------- STATION 01 — hero ---------------- */

  private buildHome() {
    const P = this.P;
    const g = this.group("home");

    const core = new THREE.Mesh(
      this.geom(new THREE.IcosahedronGeometry(2.7, 1)),
      this.mat(new THREE.MeshBasicMaterial({ color: P.teal, wireframe: true, transparent: true, opacity: 0.42 }))
    );
    core.position.set(4.4, 0.6, -6);
    g.add(core);

    const inner = new THREE.Mesh(
      this.geom(new THREE.IcosahedronGeometry(1.25, 0)),
      this.mat(new THREE.MeshBasicMaterial({ color: P.amber, wireframe: true, transparent: true, opacity: 0.65 }))
    );
    inner.position.copy(core.position);
    g.add(inner);

    const halo = this.glow("teal", 10);
    halo.position.copy(core.position);
    g.add(halo);

    const q = this.coarse ? 0.5 : 1;
    const vortex = this.points(Math.floor(620 * q), (i, v) => {
      const a = Math.random() * Math.PI * 2;
      const r = 3.4 + Math.random() * 5.6;
      v.set(Math.cos(a) * r, (Math.random() - 0.5) * 3.4, -6 + Math.sin(a) * r * 0.55);
      v.x += 4.4;
      if (i % 7 === 0) v.y *= 2.1;
    }, P.teal, 0.14, 0.5, true);
    g.add(vortex);

    const frags = [
      "SELECT insight FROM raw;", "GROUP BY impact", "WHERE value IS NOT NULL",
      "JOIN teams ON goals", "ORDER BY clarity DESC", "LIMIT 1 -- risk",
    ];
    const sprites: THREE.Sprite[] = [];
    frags.forEach((f, i) => {
      const sp = this.label(f, i % 3 === 2 ? P.amberHex : P.tealHex, 1.05);
      const side = i % 2 === 0 ? -1 : 1;
      sp.position.set(side * (5.5 + (i % 3) * 1.6), 3.4 - i * 1.25, -4 - (i % 3) * 2.2);
      g.add(sp);
      sprites.push(sp);
    });

    this.updates.push((t, _lp, st) => {
      if (st !== "home") return;
      core.rotation.y = t * 0.14;
      core.rotation.x = t * 0.07;
      inner.rotation.y = -t * 0.3;
      inner.rotation.z = t * 0.18;
      vortex.rotation.y = t * 0.05;
      sprites.forEach((sp, i) => {
        sp.position.y += Math.sin(t * 0.8 + i * 1.4) * 0.0016;
      });
    });
  }

  /* ---------------- STATION 02 — about morph ---------------- */

  private aboutPositions!: THREE.BufferAttribute;
  private buildAbout() {
    const P = this.P;
    const g = this.group("about");
    const N = this.coarse ? 400 : 784;
    const side = Math.round(Math.sqrt(N));
    const A = new Float32Array(N * 3);
    const B = new Float32Array(N * 3);
    const D = new Float32Array(N * 3);
    const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;

    for (let i = 0; i < N; i++) {
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      const r = 4 + Math.random() * 7.5;
      A[i * 3] = r * Math.sin(ph) * Math.cos(th);
      A[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.72;
      A[i * 3 + 2] = r * Math.cos(ph) * 0.6;
      const ix = i % side, iy = Math.floor(i / side);
      B[i * 3] = (ix - side / 2) * 0.58;
      B[i * 3 + 1] = (iy - side / 2) * 0.58;
      B[i * 3 + 2] = gauss() * 0.12;
      if (i < N * 0.58) {
        D[i * 3] = -7.5 + Math.random() * 11;
        D[i * 3 + 1] = gauss() * 0.5;
        D[i * 3 + 2] = gauss() * 0.5;
      } else {
        const s = Math.random();
        const ang = Math.random() * Math.PI * 2;
        const rr = (1 - s) * 3.1;
        D[i * 3] = 3.5 + s * 5;
        D[i * 3 + 1] = Math.cos(ang) * rr;
        D[i * 3 + 2] = Math.sin(ang) * rr;
      }
    }

    const geo = this.geom(new THREE.BufferGeometry());
    this.aboutPositions = new THREE.BufferAttribute(A.slice(), 3);
    geo.setAttribute("position", this.aboutPositions);
    const pm = this.mat(new THREE.PointsMaterial({
      color: P.dim, size: 0.17, transparent: true, opacity: 0.9, depthWrite: false,
    }));
    g.add(new THREE.Points(geo, pm));

    const words = ["DATA", "ANALYSIS", "INSIGHT", "DECISION"];
    const labels = words.map((w, i) => {
      const sp = this.label(w, i === 2 ? P.amberHex : P.tealHex, 1.15);
      sp.position.set(-9 + i * 6, -5.6, 0);
      (sp.material as THREE.SpriteMaterial).opacity = 0;
      g.add(sp);
      return sp;
    });

    const colA = new THREE.Color(P.dim);
    const colB = new THREE.Color(P.teal);
    const colD = new THREE.Color(P.amber);
    const tmp = new THREE.Color();

    this.updates.push((_t, lp, st) => {
      if (st !== "about") return;
      const p1 = smooth(0.05, 0.5, lp);
      const p2 = smooth(0.5, 0.92, lp);
      const arr = this.aboutPositions.array as Float32Array;
      for (let i = 0; i < N; i++) {
        const j = i * 3;
        let x = A[j] + (B[j] - A[j]) * p1;
        let y = A[j + 1] + (B[j + 1] - A[j + 1]) * p1;
        let z = A[j + 2] + (B[j + 2] - A[j + 2]) * p1;
        x += (D[j] - x) * p2;
        y += (D[j + 1] - y) * p2;
        z += (D[j + 2] - z) * p2;
        arr[j] = x; arr[j + 1] = y; arr[j + 2] = z;
      }
      this.aboutPositions.needsUpdate = true;
      tmp.copy(colA).lerp(colB, p1).lerp(colD, p2);
      (pm as THREE.PointsMaterial).color.copy(tmp);
      labels.forEach((sp, i) => {
        (sp.material as THREE.SpriteMaterial).opacity = smooth(0.12 + i * 0.2, 0.3 + i * 0.2, lp) * 0.95;
      });
    });
  }

  /* ---------------- STATION 03 — impact ---------------- */

  private buildImpact() {
    const P = this.P;
    const g = this.group("impact");
    const N = 120;
    const box = this.geom(new THREE.BoxGeometry(0.2, 0.62, 0.2));
    const bm = this.mat(new THREE.MeshBasicMaterial({ color: 0xffffff }));
    const inst = new THREE.InstancedMesh(box, bm, N);
    const mtx = new THREE.Matrix4();
    const quat = new THREE.Quaternion();
    const eul = new THREE.Euler();
    const colFilled = new THREE.Color(P.teal);
    const colRest = new THREE.Color(P.restBar);
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2 - Math.PI / 2;
      eul.set(0, 0, a);
      quat.setFromEuler(eul);
      mtx.compose(
        new THREE.Vector3(Math.cos(a) * 4.1, Math.sin(a) * 4.1, 0),
        quat,
        new THREE.Vector3(1, 1, 1)
      );
      inst.setMatrixAt(i, mtx);
      inst.setColorAt(i, colRest);
    }
    inst.instanceMatrix.needsUpdate = true;
    if (inst.instanceColor) inst.instanceColor.needsUpdate = true;
    inst.position.set(-4.6, 0.4, -2);
    g.add(inst);

    const center = this.label("80%", P.amberHex, 2.6);
    center.position.set(-4.6, 0.4, -1.6);
    g.add(center);
    const sub = this.label("MANUAL WORK → AUTOMATED", P.dimHex, 0.95);
    sub.position.set(-4.6, -2.4, -1.6);
    g.add(sub);

    const medals: THREE.Mesh[] = [];
    for (let i = 0; i < 6; i++) {
      const m = new THREE.Mesh(
        this.geom(new THREE.OctahedronGeometry(0.4, 0)),
        this.mat(new THREE.MeshBasicMaterial({
          color: i < 4 ? P.teal : P.amber, wireframe: i >= 4, transparent: true, opacity: 0.9,
        }))
      );
      g.add(m);
      medals.push(m);
    }
    const glowSpr = this.glow("tealSoft", 7);
    glowSpr.position.set(-4.6, 0.4, -3);
    g.add(glowSpr);

    let lastFill = -1;
    this.updates.push((t, lp, st) => {
      if (st !== "impact") return;
      const fill = Math.round(smooth(0.08, 0.85, lp) * N * 0.8);
      if (fill !== lastFill) {
        lastFill = fill;
        for (let i = 0; i < N; i++) {
          inst.setColorAt(i, i < fill ? colFilled : colRest);
        }
        if (inst.instanceColor) inst.instanceColor.needsUpdate = true;
      }
      medals.forEach((m, i) => {
        const a = t * 0.24 + (i * Math.PI) / 3;
        m.position.set(5.2 + Math.cos(a) * 2.6, 0.6 + Math.sin(a * 1.4) * 1.1, -2 + Math.sin(a) * 2.2);
        m.rotation.y = t * 0.7 + i;
        m.rotation.x = t * 0.4;
      });
    });
  }

  /* ---------------- STATION 04 — education ---------------- */

  private buildEducation() {
    const P = this.P;
    const g = this.group("education");
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-13, -2.6, 0),
      new THREE.Vector3(-4.5, 1.9, -2),
      new THREE.Vector3(4.5, -1.4, -4),
      new THREE.Vector3(13, 2.4, -6),
    ]);
    g.add(new THREE.Mesh(
      this.geom(new THREE.TubeGeometry(curve, 80, 0.045, 6, false)),
      this.mat(new THREE.MeshBasicMaterial({ color: P.teal, transparent: true, opacity: 0.55 }))
    ));

    const stops = [
      { t: 0.1, label: "CLASS X · 2005–2015" },
      { t: 0.5, label: "DIPLOMA · 2015–2018" },
      { t: 0.9, label: "B.TECH · 2018–2021" },
    ];
    const nodes: THREE.Mesh[] = [];
    stops.forEach((s, i) => {
      const p = curve.getPointAt(s.t);
      const node = new THREE.Mesh(
        this.geom(new THREE.SphereGeometry(0.34, 20, 20)),
        this.mat(new THREE.MeshBasicMaterial({ color: i === 2 ? P.amber : P.teal }))
      );
      node.position.copy(p);
      node.scale.setScalar(0.001);
      g.add(node);
      const lb = this.label(s.label, P.dimHex, 1.0);
      lb.position.copy(p).add(new THREE.Vector3(0, -1.3, 0));
      g.add(lb);
      const gl = this.glow("tealSoft", 2.6);
      gl.position.copy(p);
      g.add(gl);
      nodes.push(node);
    });

    const certs: THREE.Mesh[] = [];
    for (let i = 0; i < 4; i++) {
      const cube = new THREE.Mesh(
        this.geom(new THREE.BoxGeometry(0.36, 0.36, 0.36)),
        this.mat(new THREE.MeshBasicMaterial({ color: i % 2 ? P.amber : P.blue, wireframe: true }))
      );
      cube.position.set(-7.5 + i * 5, 4.6, -3);
      g.add(cube);
      certs.push(cube);
    }
    const cl = this.label("CERTIFICATIONS ×4", P.faintHex, 0.85);
    cl.position.set(0, 6, -3);
    g.add(cl);

    this.updates.push((t, lp, st) => {
      if (st !== "education") return;
      nodes.forEach((n, i) => {
        const s = smooth(0.08 + i * 0.28, 0.3 + i * 0.28, lp);
        n.scale.setScalar(Math.max(0.001, s));
        n.rotation.y = t * 0.8;
      });
      certs.forEach((cb, i) => {
        cb.rotation.x = t * 0.6 + i;
        cb.rotation.y = t * 0.45 + i * 0.7;
        cb.position.y = 4.6 + Math.sin(t * 0.9 + i * 1.3) * 0.25;
      });
    });
  }

  /* ---------------- STATION 05 — toolbox ---------------- */

  private buildToolbox() {
    const P = this.P;
    const g = this.group("toolbox");

    const core = new THREE.Mesh(
      this.geom(new THREE.OctahedronGeometry(1.5, 0)),
      this.mat(new THREE.MeshBasicMaterial({ color: P.teal, wireframe: true, transparent: true, opacity: 0.75 }))
    );
    g.add(core);
    g.add(this.glow("teal", 6.5));

    const rings = [
      { r: 4, tilt: 1.15, speed: 0.14, color: P.amber, count: 3 },
      { r: 6, tilt: 0.92, speed: -0.1, color: P.teal, count: 5 },
      { r: 8, tilt: 1.32, speed: 0.07, color: P.blue, count: 5 },
      { r: 10, tilt: 0.72, speed: -0.05, color: P.paleNode, count: 5 },
    ];
    const ringGroups: THREE.Group[] = [];
    rings.forEach((cfg) => {
      const rg = new THREE.Group();
      rg.rotation.x = cfg.tilt;
      const circlePts: THREE.Vector3[] = [];
      for (let i = 0; i <= 90; i++) {
        const a = (i / 90) * Math.PI * 2;
        circlePts.push(new THREE.Vector3(Math.cos(a) * cfg.r, Math.sin(a) * cfg.r, 0));
      }
      rg.add(new THREE.Line(
        this.geom(new THREE.BufferGeometry().setFromPoints(circlePts)),
        this.mat(new THREE.LineBasicMaterial({ color: P.line, transparent: true, opacity: 0.85 }))
      ));
      const inst = new THREE.InstancedMesh(
        this.geom(new THREE.SphereGeometry(0.2, 12, 12)),
        this.mat(new THREE.MeshBasicMaterial({ color: cfg.color })),
        cfg.count
      );
      const m4 = new THREE.Matrix4();
      for (let i = 0; i < cfg.count; i++) {
        const a = (i / cfg.count) * Math.PI * 2;
        m4.setPosition(Math.cos(a) * cfg.r, Math.sin(a) * cfg.r, 0);
        inst.setMatrixAt(i, m4);
      }
      inst.instanceMatrix.needsUpdate = true;
      rg.add(inst);
      g.add(rg);
      ringGroups.push(rg);
    });

    const tag = this.label("18 TOOLS INDEXED", P.faintHex, 0.9);
    tag.position.set(0, -7.4, 0);
    g.add(tag);

    this.updates.push((t, lp, st) => {
      if (st !== "toolbox") return;
      ringGroups.forEach((rg, i) => {
        rg.rotation.z = this.staticMode ? 0 : t * rings[i].speed;
      });
      const s = 1 + Math.sin(t * 1.8) * 0.06 + smooth(0, 0.5, lp) * 0.15;
      core.scale.setScalar(s);
      core.rotation.y = t * 0.35;
      core.rotation.x = t * 0.2;
    });
  }

  /* ---------------- STATION 06 — pipeline ---------------- */

  private buildWorkflow() {
    const P = this.P;
    const g = this.group("workflow");
    const pylonTop: THREE.Vector3[] = [];
    const pylons: THREE.Mesh[] = [];
    const caps: THREE.Mesh[] = [];
    for (let i = 0; i < 7; i++) {
      const x = i % 2 === 0 ? -2.7 : 2.7;
      const z = -i * 10.6;
      const body = new THREE.Mesh(
        this.geom(new THREE.BoxGeometry(0.75, 2.6, 0.75)),
        this.mat(new THREE.MeshBasicMaterial({ color: P.pylonBody, transparent: true, opacity: 0.96 }))
      );
      body.position.set(x, -1.2, z);
      g.add(body);
      pylons.push(body);
      const cap = new THREE.Mesh(
        this.geom(new THREE.BoxGeometry(0.75, 0.1, 0.75)),
        this.mat(new THREE.MeshBasicMaterial({ color: i === 6 ? P.amber : P.teal }))
      );
      cap.position.set(x, 0.15, z);
      g.add(cap);
      caps.push(cap);
      const beam = new THREE.Mesh(
        this.geom(new THREE.BoxGeometry(0.05, 7.5, 0.05)),
        this.mat(new THREE.MeshBasicMaterial({
          color: P.teal, transparent: true, opacity: 0.16, blending: this.P.blend, depthWrite: false,
        }))
      );
      beam.position.set(x, 3.6, z);
      g.add(beam);
      const lb = this.label(`0${i + 1}`, i === 6 ? P.amberHex : P.tealHex, 1.1);
      lb.position.set(x, 1.9, z);
      g.add(lb);
      pylonTop.push(new THREE.Vector3(x, 0.35, z));
    }

    const curve = new THREE.CatmullRomCurve3(pylonTop);
    g.add(new THREE.Line(
      this.geom(new THREE.BufferGeometry().setFromPoints(curve.getPoints(160))),
      this.mat(new THREE.LineBasicMaterial({ color: P.teal, transparent: true, opacity: 0.3 }))
    ));

    const nPackets = this.coarse ? 22 : 44;
    const pg = this.geom(new THREE.BufferGeometry());
    pg.setAttribute("position", new THREE.BufferAttribute(new Float32Array(nPackets * 3), 3));
    const packets = new THREE.Points(pg, this.mat(new THREE.PointsMaterial({
      color: P.amber, size: 0.3, transparent: true, opacity: 0.9,
      depthWrite: false, blending: this.P.blend,
    })));
    g.add(packets);

    this.updates.push((t, lp, st) => {
      if (st !== "workflow") return;
      const attr = pg.getAttribute("position") as THREE.BufferAttribute;
      for (let i = 0; i < nPackets; i++) {
        const u = this.staticMode ? (i + 0.5) / nPackets : (t * 0.045 + lp * 1.6 + i / nPackets) % 1;
        curve.getPointAt(u, v0);
        attr.setXYZ(i, v0.x, v0.y + 0.15, v0.z);
      }
      attr.needsUpdate = true;
      const active = lp * 6;
      pylons.forEach((p, i) => {
        const near = Math.exp(-Math.pow(active - i, 2) / 0.8);
        const s = 1 + near * 0.4;
        p.scale.set(s, 1 + near * 0.25, s);
        caps[i].scale.set(s, 1, s);
      });
    });
  }

  /* ---------------- STATION 07 — career ---------------- */

  private buildCareer() {
    const P = this.P;
    const g = this.group("experience");

    const mono = new THREE.LineSegments(
      this.geom(new THREE.EdgesGeometry(this.geom(new THREE.BoxGeometry(3.1, 8, 3.1)))),
      this.mat(new THREE.LineBasicMaterial({ color: P.monoLine, transparent: true, opacity: 0.95 }))
    );
    mono.position.set(-4.6, -0.5, -9);
    g.add(mono);

    const windows = new THREE.InstancedMesh(
      this.geom(new THREE.PlaneGeometry(0.3, 0.44)),
      this.mat(new THREE.MeshBasicMaterial({ color: 0xffffff })),
      20
    );
    const m4 = new THREE.Matrix4();
    const cLit = new THREE.Color(P.amber);
    const cTeal = new THREE.Color(P.teal);
    const cDark = new THREE.Color(P.winDark);
    for (let r = 0; r < 5; r++) {
      for (let col = 0; col < 4; col++) {
        const idx = r * 4 + col;
        m4.setPosition(-5.05 + col * 0.62, -3.4 + r * 1.5, -7.44);
        windows.setMatrixAt(idx, m4);
        windows.setColorAt(idx, idx % 5 === 0 ? cLit : idx % 3 === 0 ? cTeal : cDark);
      }
    }
    windows.instanceMatrix.needsUpdate = true;
    if (windows.instanceColor) windows.instanceColor.needsUpdate = true;
    g.add(windows);

    const y2021 = this.label("2021 — TECH MAHINDRA", P.dimHex, 1.0);
    y2021.position.set(-4.6, 4.6, -9);
    g.add(y2021);

    const cone = new THREE.LineSegments(
      this.geom(new THREE.EdgesGeometry(this.geom(new THREE.ConeGeometry(1.7, 5, 4)))),
      this.mat(new THREE.LineBasicMaterial({ color: P.teal, transparent: true, opacity: 0.85 }))
    );
    cone.position.set(4.6, -1.4, 3);
    g.add(cone);
    const beacon = this.glow("amber", 5);
    beacon.position.set(4.6, 1.6, 3);
    g.add(beacon);
    const yNow = this.label("2025 — FRUGAL TESTING · NOW", P.amberHex, 1.0);
    yNow.position.set(4.6, 4.8, 3);
    g.add(yNow);

    const railCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-4.6, -4.6, -9), new THREE.Vector3(0, -4.6, -3), new THREE.Vector3(4.6, -4.6, 3),
    ]);
    g.add(new THREE.Line(
      this.geom(new THREE.BufferGeometry().setFromPoints(railCurve.getPoints(60))),
      this.mat(new THREE.LineBasicMaterial({ color: P.line, transparent: true, opacity: 0.9 }))
    ));
    const nP = 10;
    const pg = this.geom(new THREE.BufferGeometry());
    pg.setAttribute("position", new THREE.BufferAttribute(new Float32Array(nP * 3), 3));
    g.add(new THREE.Points(pg, this.mat(new THREE.PointsMaterial({
      color: P.teal, size: 0.26, transparent: true, opacity: 0.9, depthWrite: false, blending: this.P.blend,
    }))));

    this.updates.push((t, lp, st) => {
      if (st !== "experience") return;
      (beacon.material as THREE.SpriteMaterial).opacity = 0.55 + Math.sin(t * 2.2) * 0.25;
      const bs = 1 + Math.sin(t * 2.2) * 0.18 + smooth(0.4, 0.9, lp) * 0.5;
      beacon.scale.setScalar(bs * 5);
      cone.rotation.y = t * 0.4;
      const attr = pg.getAttribute("position") as THREE.BufferAttribute;
      for (let i = 0; i < nP; i++) {
        const u = this.staticMode ? (i + 0.5) / nP : (t * 0.06 + i / nP) % 1;
        railCurve.getPointAt(u, v0);
        attr.setXYZ(i, v0.x, v0.y + 0.1, v0.z);
      }
      attr.needsUpdate = true;
    });
  }

  /* ---------------- STATION 08 — projects ---------------- */

  private buildProjects() {
    const P = this.P;
    const g = this.group("projects");

    const p1 = new THREE.Group();
    p1.position.set(-4.5, 0, 10);
    g.add(p1);
    const grid = new THREE.InstancedMesh(
      this.geom(new THREE.PlaneGeometry(0.44, 0.44)),
      this.mat(new THREE.MeshBasicMaterial({ color: P.cellDark, transparent: true, opacity: 0.9, side: THREE.DoubleSide })),
      64
    );
    const m4 = new THREE.Matrix4();
    for (let r = 0; r < 8; r++) {
      for (let col = 0; col < 8; col++) {
        m4.setPosition(-4.2 + col * 0.56, 3.2 - r * 0.56, 0);
        grid.setMatrixAt(r * 8 + col, m4);
      }
    }
    grid.instanceMatrix.needsUpdate = true;
    p1.add(grid);
    const funnel = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.2, 1.2, 0), new THREE.Vector3(0.5, 0.4, 0.6),
      new THREE.Vector3(2.6, -0.4, 0), new THREE.Vector3(4.2, -1.4, -0.6),
    ]);
    const fn = this.coarse ? 10 : 18;
    const pg1 = this.geom(new THREE.BufferGeometry());
    pg1.setAttribute("position", new THREE.BufferAttribute(new Float32Array(fn * 3), 3));
    p1.add(new THREE.Points(pg1, this.mat(new THREE.PointsMaterial({
      color: P.amber, size: 0.26, transparent: true, opacity: 0.95, depthWrite: false, blending: this.P.blend,
    }))));

    const p2 = new THREE.Group();
    p2.position.set(4.6, -1, -4);
    g.add(p2);
    const heights = [1.2, 2, 1.6, 2.6, 2.2, 3.2, 2.8, 3.8, 3.4, 4.4, 4, 5];
    const bars: THREE.Mesh[] = [];
    heights.forEach((h, i) => {
      const geo = this.geom(new THREE.BoxGeometry(0.46, h, 0.46));
      geo.translate(0, h / 2, 0);
      const bar = new THREE.Mesh(geo, this.mat(new THREE.MeshBasicMaterial({
        color: i % 4 === 3 ? P.amber : P.teal, transparent: true, opacity: 0.85,
      })));
      bar.position.set(-3 + i * 0.66, -2.2, 0);
      bar.scale.y = 0.001;
      p2.add(bar);
      bars.push(bar);
    });
    const donut = new THREE.Mesh(
      this.geom(new THREE.TorusGeometry(1.1, 0.16, 10, 40, Math.PI * 1.45)),
      this.mat(new THREE.MeshBasicMaterial({ color: P.amber, transparent: true, opacity: 0.9 }))
    );
    donut.position.set(5.4, 0.8, 0);
    p2.add(donut);
    const donut2 = new THREE.Mesh(
      this.geom(new THREE.TorusGeometry(1.1, 0.16, 10, 40, Math.PI * 0.55)),
      this.mat(new THREE.MeshBasicMaterial({ color: P.cellDark }))
    );
    donut2.rotation.z = Math.PI * 1.45;
    donut2.position.copy(donut.position);
    p2.add(donut2);

    const p3 = new THREE.Group();
    p3.position.set(-4.6, 0.4, -18);
    g.add(p3);
    const clusters = [
      { c: new THREE.Vector3(-2, 1.6, 0), color: P.teal },
      { c: new THREE.Vector3(2.2, 0.6, 0.4), color: P.amber },
      { c: new THREE.Vector3(0, -1.9, -0.4), color: P.blue },
    ];
    const per = this.coarse ? 50 : 80;
    const n3 = per * 3;
    const basePos = new Float32Array(n3 * 3);
    for (let ci = 0; ci < 3; ci++) {
      for (let i = 0; i < per; i++) {
        const j = (ci * per + i) * 3;
        const th = Math.random() * Math.PI * 2;
        const ph = Math.acos(2 * Math.random() - 1);
        const r = Math.pow(Math.random(), 0.6) * 1.25;
        basePos[j] = clusters[ci].c.x + r * Math.sin(ph) * Math.cos(th);
        basePos[j + 1] = clusters[ci].c.y + r * Math.sin(ph) * Math.sin(th);
        basePos[j + 2] = clusters[ci].c.z + r * Math.cos(ph) * 0.7;
      }
    }
    const geo3 = this.geom(new THREE.BufferGeometry());
    const pos3 = new THREE.BufferAttribute(basePos.slice(), 3);
    geo3.setAttribute("position", pos3);
    const cols3 = new Float32Array(n3 * 3);
    const cTmp = new THREE.Color();
    for (let ci = 0; ci < 3; ci++) {
      cTmp.set(clusters[ci].color);
      for (let i = 0; i < per; i++) {
        const j = (ci * per + i) * 3;
        cols3[j] = cTmp.r; cols3[j + 1] = cTmp.g; cols3[j + 2] = cTmp.b;
      }
    }
    geo3.setAttribute("color", new THREE.BufferAttribute(cols3, 3));
    p3.add(new THREE.Points(geo3, this.mat(new THREE.PointsMaterial({
      size: 0.16, vertexColors: true, transparent: true, opacity: 0.9, depthWrite: false,
    }))));
    clusters.forEach((cl) => {
      const mark = new THREE.Mesh(
        this.geom(new THREE.OctahedronGeometry(0.24, 0)),
        this.mat(new THREE.MeshBasicMaterial({ color: cl.color, wireframe: true }))
      );
      mark.position.copy(cl.c);
      p3.add(mark);
    });

    this.updates.push((t, lp, st) => {
      if (st !== "projects") return;
      const a1 = pg1.getAttribute("position") as THREE.BufferAttribute;
      for (let i = 0; i < fn; i++) {
        const u = this.staticMode ? (i + 0.5) / fn : (t * 0.08 + i / fn) % 1;
        funnel.getPointAt(u, v0);
        a1.setXYZ(i, v0.x, v0.y, v0.z);
      }
      a1.needsUpdate = true;

      const rise = smooth(0.2, 0.8, lp);
      bars.forEach((b, i) => {
        const local = clamp01(rise * 1.6 - (i / bars.length) * 0.6);
        b.scale.y = Math.max(0.001, local);
      });
      donut.rotation.z = t * 0.3;
      donut2.rotation.z = Math.PI * 1.45 + t * 0.3;

      const arr3 = pos3.array as Float32Array;
      for (let i = 0; i < n3; i++) {
        const j = i * 3;
        arr3[j] = basePos[j] + Math.sin(t * 0.7 + i * 0.35) * 0.05;
        arr3[j + 1] = basePos[j + 1] + Math.cos(t * 0.6 + i * 0.27) * 0.05;
      }
      pos3.needsUpdate = true;
    });
  }

  /* ---------------- STATION 09 — lab dashboards ---------------- */

  private dashTexture(seed: number): THREE.Texture {
    const c = document.createElement("canvas");
    c.width = 640; c.height = 400;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#0b1424";
    ctx.fillRect(0, 0, 640, 400);
    ctx.strokeStyle = "#1b2940";
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, 638, 398);
    ["#ff6b6b", "#ffb454", "#45e5c6"].forEach((col, i) => {
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(26 + i * 24, 26, 7, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.fillStyle = "#5c6b84";
    ctx.font = "600 17px 'JetBrains Mono', monospace";
    ctx.fillText(seed === 0 ? "kpi_overview.pbix" : seed === 1 ? "query_workspace.sql" : "sheet_model.xlsx", 96, 32);
    if (seed === 0) {
      for (let i = 0; i < 12; i++) {
        const h = 40 + ((i * 53 + seed * 31) % 140);
        ctx.fillStyle = i % 4 === 3 ? "#ffb454" : "#45e5c6";
        ctx.globalAlpha = 0.85;
        ctx.fillRect(44 + i * 47, 340 - h, 30, h);
      }
      ctx.globalAlpha = 1;
    } else if (seed === 1) {
      ctx.font = "500 19px 'JetBrains Mono', monospace";
      const lines = ["SELECT region, SUM(kpi)", "FROM fact_performance", "WHERE dt >= '2025-01-01'", "GROUP BY region", "ORDER BY 2 DESC;", "-- ✓ 24 rows · 0.03s"];
      lines.forEach((l, i) => {
        ctx.fillStyle = l.startsWith("--") ? "#45e5c6" : l.startsWith("SELECT") ? "#ffb454" : "#93a3ba";
        ctx.fillText(l, 44, 92 + i * 44);
      });
    } else {
      ctx.strokeStyle = "#24344f";
      for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.moveTo(40, 80 + i * 38); ctx.lineTo(600, 80 + i * 38); ctx.stroke(); }
      ctx.strokeStyle = "#45e5c6";
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let i = 0; i <= 20; i++) {
        const x = 40 + i * 28;
        const y = 240 - Math.sin(i * 0.62 + seed) * 70 - ((i * 29 + seed * 17) % 40);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    return this.track(new THREE.CanvasTexture(c));
  }

  private buildLab() {
    const g = this.group("tools");
    const cfg = [
      { x: -5, y: 0.8, z: 8, ry: 0.42, seed: 0 },
      { x: 0, y: -0.4, z: -1, ry: 0, seed: 1 },
      { x: 5, y: 1.1, z: -10, ry: -0.42, seed: 2 },
    ];
    const panels: THREE.Mesh[] = [];
    cfg.forEach((c) => {
      const mesh = new THREE.Mesh(
        this.geom(new THREE.PlaneGeometry(5.2, 3.25)),
        this.mat(new THREE.MeshBasicMaterial({ map: this.dashTexture(c.seed), transparent: true, opacity: 0.96 }))
      );
      mesh.position.set(c.x, c.y, c.z);
      mesh.rotation.y = c.ry;
      g.add(mesh);
      panels.push(mesh);
      const gl = this.glow("blue", 6);
      gl.position.set(c.x, c.y, c.z - 0.4);
      g.add(gl);
    });
    this.updates.push((t, _lp, st) => {
      if (st !== "tools") return;
      panels.forEach((p, i) => {
        p.position.y = cfg[i].y + Math.sin(t * 0.7 + i * 1.9) * 0.18;
        p.rotation.y = cfg[i].ry + Math.sin(t * 0.4 + i) * 0.03;
      });
    });
  }

  /* ---------------- STATION 10 — intelligence lattice ---------------- */

  private buildIntel() {
    const P = this.P;
    const g = this.group("intel");
    const layers = [5, 7, 5];
    const nodes: THREE.Vector3[] = [];
    const layerZ = [2.5, -1.5, -5.5];
    const nodeMeshes: THREE.Mesh[] = [];
    layers.forEach((count, li) => {
      for (let i = 0; i < count; i++) {
        const p = new THREE.Vector3((i / (count - 1) - 0.5) * 9, (li === 1 ? 0.4 : 0) + Math.sin(i * 2.1) * 0.7, layerZ[li]);
        nodes.push(p);
        const m = new THREE.Mesh(
          this.geom(new THREE.SphereGeometry(0.17, 10, 10)),
          this.mat(new THREE.MeshBasicMaterial({ color: li === 1 ? P.teal : P.blue }))
        );
        m.position.copy(p);
        g.add(m);
        nodeMeshes.push(m);
      }
    });
    const segPts: THREE.Vector3[] = [];
    let offset = 0;
    for (let li = 0; li < layers.length - 1; li++) {
      const next = offset + layers[li];
      for (let a = 0; a < layers[li]; a++) {
        for (let b = 0; b < layers[li + 1]; b++) {
          segPts.push(nodes[offset + a], nodes[next + b]);
        }
      }
      offset = next;
    }
    const lineMat = this.mat(new THREE.LineBasicMaterial({ color: P.teal, transparent: true, opacity: 0.16 }));
    g.add(new THREE.LineSegments(this.geom(new THREE.BufferGeometry().setFromPoints(segPts)), lineMat));

    const q = this.coarse ? 0.5 : 1;
    const swirl = this.points(Math.floor(240 * q), (i, v) => {
      const a = (i / 240) * Math.PI * 10;
      const r = 6 + Math.sin(i * 0.31) * 1.6;
      v.set(Math.cos(a) * r, (i / 240 - 0.5) * 9, -1.5 + Math.sin(a) * r * 0.4);
    }, P.teal, 0.13, 0.4, true);
    g.add(swirl);

    this.updates.push((t, _lp, st) => {
      if (st !== "intel") return;
      (lineMat as THREE.LineBasicMaterial).opacity = 0.14 + Math.sin(t * 1.7) * 0.08;
      swirl.rotation.y = t * 0.05;
      nodeMeshes.forEach((m, i) => {
        m.scale.setScalar(1 + Math.sin(t * 2 + i * 0.8) * 0.22);
      });
    });
  }

  /* ---------------- STATION 11 — convergence ---------------- */

  private buildContact() {
    const P = this.P;
    const g = this.group("contact");
    const corePos = new THREE.Vector3(0, 0.2, -8);
    const core = this.glow("gold", 6.5);
    core.position.copy(corePos);
    g.add(core);
    const core2 = this.glow("tealSoft", 11);
    core2.position.copy(corePos);
    g.add(core2);

    const curves: THREE.QuadraticBezierCurve3[] = [];
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      const start = new THREE.Vector3(Math.cos(a) * 17, Math.sin(a) * 10, -8 + Math.sin(a * 2) * 7);
      const ctrl = new THREE.Vector3(Math.cos(a) * 8, Math.sin(a) * 4.5, -8 + Math.cos(a * 3) * 4);
      const cv = new THREE.QuadraticBezierCurve3(start, ctrl, corePos.clone());
      curves.push(cv);
      g.add(new THREE.Line(
        this.geom(new THREE.BufferGeometry().setFromPoints(cv.getPoints(50))),
        this.mat(new THREE.LineBasicMaterial({
          color: i % 3 === 0 ? P.amber : P.teal, transparent: true, opacity: 0.22,
        }))
      ));
    }
    const per = 6;
    const n = curves.length * per;
    const pg = this.geom(new THREE.BufferGeometry());
    pg.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    g.add(new THREE.Points(pg, this.mat(new THREE.PointsMaterial({
      color: 0xffd696, size: 0.3, transparent: true, opacity: 0.95, depthWrite: false, blending: this.P.blend,
    }))));

    const rings: THREE.Mesh[] = [];
    for (let i = 0; i < 2; i++) {
      const ring = new THREE.Mesh(
        this.geom(new THREE.RingGeometry(1.9, 2, 64)),
        this.mat(new THREE.MeshBasicMaterial({
          color: i === 0 ? P.teal : P.amber, transparent: true, opacity: 0.4, side: THREE.DoubleSide, depthWrite: false,
        }))
      );
      ring.position.copy(corePos);
      g.add(ring);
      rings.push(ring);
    }

    this.updates.push((t, lp, st) => {
      if (st !== "contact") return;
      const pull = smooth(0.05, 0.7, lp);
      core.scale.setScalar(6.5 + Math.sin(t * 1.6) * 0.5 + pull * 2.5);
      const attr = pg.getAttribute("position") as THREE.BufferAttribute;
      let idx = 0;
      for (let ci = 0; ci < curves.length; ci++) {
        for (let i = 0; i < per; i++) {
          let u = this.staticMode ? (i + 0.5) / per : (t * (0.05 + pull * 0.12) + i / per + ci * 0.07) % 1;
          u = 1 - (1 - u) * (1 - pull * 0.55);
          curves[ci].getPointAt(clamp01(u), v0);
          attr.setXYZ(idx++, v0.x, v0.y, v0.z);
        }
      }
      attr.needsUpdate = true;
      rings.forEach((r, i) => {
        const cyc = this.staticMode ? 0.3 : ((t * 0.35 + i * 0.5) % 1);
        r.scale.setScalar(1 + cyc * 6.5);
        (r.material as THREE.MeshBasicMaterial).opacity = (1 - cyc) * 0.4 * (0.4 + pull * 0.6);
      });
    });
  }

  /* ---------------- frame loop ---------------- */

  start() {
    this.computeAnchors();
    this.clock.start();
    const loop = () => {
      if (this.disposed) return;
      this.raf = requestAnimationFrame(loop);
      if (!this.visible) return;
      const dt = Math.min(this.clock.getDelta(), 0.05);
      const t = this.staticMode ? 0 : this.clock.elapsedTime;

      const target = this.cameraTarget();
      const damp = this.staticMode ? 1 : 1 - Math.pow(0.0018, dt);
      this.camZ += (target.z - this.camZ) * damp;
      const parallax = this.staticMode || this.coarse ? 0 : 1;
      this.camX += (worldState.mx * 2.1 * parallax + Math.sin(t * 0.11) * 0.7 - this.camX) * damp;
      this.camY += (-worldState.my * 1.15 * parallax + Math.cos(t * 0.09) * 0.45 - this.camY) * damp;
      this.camera.position.set(this.camX, this.camY, this.camZ);
      this.camera.lookAt(this.camX * 0.35, this.camY * 0.3, this.camZ - 46);

      for (const a of this.anchors) {
        const lp = clamp01((worldState.y - a.start) / Math.max(1, a.end - a.start));
        this.lpById[a.id] = lp;
      }
      for (const a of this.anchors) {
        const lp = this.lpById[a.id] ?? 0;
        for (const fn of this.updates) fn(t, lp, a.id);
      }

      this.renderer.render(this.scene, this.camera);

      this.fpsFrames++;
      this.fpsTime += dt;
      if (!this.degraded && this.fpsFrames >= 90) {
        const avg = this.fpsTime / this.fpsFrames;
        if (avg > 0.026 && this.renderer.getPixelRatio() > 1) {
          this.renderer.setPixelRatio(Math.max(1, this.renderer.getPixelRatio() - 0.5));
          this.degraded = true;
        }
        this.fpsFrames = 0;
        this.fpsTime = 0;
      }
    };
    loop();
  }

  private cameraTarget(): { z: number } {
    const y = worldState.y;
    const a = this.anchors;
    if (!a.length) return { z: 22 };
    if (y <= a[0].start) return { z: a[0].z + 22 };
    for (let i = 0; i < a.length; i++) {
      const cur = a[i];
      if (y <= cur.end) {
        const lp = clamp01((y - cur.start) / Math.max(1, cur.end - cur.start));
        return { z: cur.z + 22 - lp * 12 };
      }
      if (i < a.length - 1) {
        const nxt = a[i + 1];
        if (y < nxt.start) {
          const tt = (y - cur.end) / Math.max(1, nxt.start - cur.end);
          const e = tt * tt * (3 - 2 * tt);
          return { z: cur.z + 10 + (nxt.z + 22 - (cur.z + 10)) * e };
        }
      }
    }
    return { z: a[a.length - 1].z + 10 };
  }

  private computeAnchors() {
    this.anchors = [];
    for (const id of ORDER) {
      const el = document.getElementById(id);
      if (!el) continue;
      const start = el.offsetTop;
      const end = Math.max(start + 1, el.offsetTop + el.offsetHeight - window.innerHeight);
      this.anchors.push({ id, start, end, z: STATION_Z[id] });
    }
  }

  private onResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight, false);
    this.computeAnchors();
  };

  private onVisibility = () => {
    this.visible = !document.hidden;
    if (this.visible) this.clock.getDelta();
  };

  refresh() {
    this.computeAnchors();
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.onResize);
    document.removeEventListener("visibilitychange", this.onVisibility);
    this.disposables.forEach((d) => d.dispose());
    this.renderer.dispose();
  }
}
