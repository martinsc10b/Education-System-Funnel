// The 2.5D funnel: eight elliptical rings seen from ~20° above, widest at the top, wrapped by one spiral
// (one turn per ring, wide at the top rim, tight at the student). Plain SVG with perspective math, no 3D engine.
// The spiral is the only element that links the rings: no arrows, connectors or brackets.
import React from "react";
import { mixHex } from "../shared/theme";
import { K, SANS } from "./theme";

export const F = {
  cx: 238, // funnel axis
  y0: 200, // top rim
  h: 84, // ring height on the axis
  r0: 190, // radius at the top rim
  r1: 26, // radius at the tip
  tilt: Math.sin((20 * Math.PI) / 180), // ellipse ry / rx for a 20° view from above
  gap: 3, // half the seam between rings
};
const Y1 = F.y0 + 8 * F.h;
export const TURNS = 8;
export const THETA_END = TURNS * 2 * Math.PI;
const rAt = (y: number) => F.r0 + ((F.r1 - F.r0) * (y - F.y0)) / (Y1 - F.y0);

export const RINGS: { name: string; detail: string }[] = [
  { name: "Currículo Nacional", detail: "Ministerio · DRE · UGEL · 31 competencias" },
  { name: "PEI", detail: "Visión · Misión · Valores" },
  { name: "PCI", detail: "Competencias · Enfoque · Horas · Evaluación" },
  { name: "Programación anual", detail: "Contenidos por semana" },
  { name: "Unidad didáctica", detail: "8 unidades · 4 bimestres" },
  { name: "Cuaderno de trabajo", detail: "Dos veces al año" },
  { name: "Sesión", detail: "Propósito" },
  { name: "Estudiante", detail: "Logro de aprendizaje" },
];

// Spiral point at angle θ (0 = back of the top rim, θ = 2π(i−1)+π = front of ring i, THETA_END = tip).
// front > 0 means the point is on the side facing the viewer.
export const spiralAt = (theta: number) => {
  const y = F.y0 + (theta / (2 * Math.PI)) * F.h;
  const r = rAt(y) + 3;
  const a = theta - Math.PI;
  return { x: F.cx + r * Math.sin(a), y: y + r * F.tilt * Math.cos(a), front: Math.cos(a) };
};
// θ at the middle of ring i's front face.
export const frontOf = (i: number) => 2 * Math.PI * (i - 1) + Math.PI;

// Path for the visible face of the frustum between two heights.
const face = (yt: number, yb: number) => {
  const rt = rAt(yt), rb = rAt(yb);
  return `M${F.cx - rt} ${yt} A${rt} ${rt * F.tilt} 0 0 0 ${F.cx + rt} ${yt} L${F.cx + rb} ${yb} A${rb} ${rb * F.tilt} 0 0 1 ${F.cx - rb} ${yb} Z`;
};

const LIGHT = mixHex(K.bg, K.gray, 0.28); // inactive ring
const ringColor = (down: number, up: number) => mixHex(mixHex(LIGHT, K.navy, down), K.orange, up);

// Split the spiral into runs of the same (front/back, traveled) state for drawing.
const STEP = 0.04;
const SAMPLES = Array.from({ length: Math.ceil(THETA_END / STEP) + 1 }, (_, k) => Math.min(k * STEP, THETA_END)).map((t) => ({ t, ...spiralAt(t) }));
const runs = (colorAt: (t: number) => string | null) => {
  const out: { front: boolean; color: string | null; d: string }[] = [];
  let cur: (typeof out)[number] | null = null;
  for (const p of SAMPLES) {
    const front = p.front > 0, color = colorAt(p.t);
    const pt = `${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    if (!cur || cur.front !== front || cur.color !== color) {
      if (cur) cur.d += ` L${pt}`;
      cur = { front, color, d: `M${pt}` };
      out.push(cur);
    } else cur.d += ` L${pt}`;
  }
  return out;
};

export type FunnelState = {
  ring: { down: number; up: number }[]; // per ring 1..8: 0..1 navy, 0..1 orange
  bands: [number, number]; // glow of «Sistema de liderazgo» and «Sistema de enseñanza y aprendizaje», 0..1
  bandColor: string;
  paths: { from: number; to: number; color: string }[]; // traveled stretches of the spiral, in θ; later ones win
  point: { theta: number; color: string; o: number } | null;
  pat: number; // «PAT 2027» tag beside the PEI ring
};

const BAND_X = 8, BAND_W = 752;
const bandEdge = F.y0 + 3 * F.h + rAt(F.y0 + 3 * F.h) * F.tilt * 0.55;
const BANDS = [
  { y: 92, h: bandEdge - 92 - 4, label: ["SISTEMA DE LIDERAZGO"], labelY: 104 },
  { y: bandEdge + 4, h: Y1 + 34 - bandEdge - 4, label: ["SISTEMA DE ENSEÑANZA", "Y APRENDIZAJE"], labelY: Y1 - 10 },
];

export const Funnel: React.FC<{ s: FunnelState }> = ({ s }) => {
  const lit = (i: number) => Math.max(s.ring[i - 1].down, s.ring[i - 1].up);
  const colorAt = (t: number) => s.paths.reduce<string | null>((c, p) => (t >= p.from - 1e-6 && t <= p.to + 1e-6 ? p.color : c), null);
  const spiral = runs(colorAt);
  const pt = s.point && { ...spiralAt(s.point.theta), color: s.point.color, o: s.point.o };
  return (
    <>
      {BANDS.map((b, k) => {
        const g = s.bands[k];
        return (
          <React.Fragment key={k}>
            <div style={{ position: "absolute", left: BAND_X, top: b.y, width: BAND_W, height: b.h, borderRadius: 26, background: mixHex("#F0F2F5", mixHex("#FFFFFF", s.bandColor, 0.16), g) }} />
            <div style={{ position: "absolute", right: 1920 - BAND_X - BAND_W + 18, top: b.labelY, textAlign: "right", fontFamily: SANS, fontSize: 15, fontWeight: 800, letterSpacing: 1.6, lineHeight: 1.25, color: mixHex(mixHex(K.bg, K.gray, 0.85), s.bandColor, g) }}>
              {b.label.map((l) => <div key={l}>{l}</div>)}
            </div>
          </React.Fragment>
        );
      })}
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={800} height={1080} viewBox="0 0 800 1080">
        <defs>
          <linearGradient id="fshade" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#000" stopOpacity="0.22" />
            <stop offset="0.32" stopColor="#fff" stopOpacity="0.16" />
            <stop offset="0.62" stopColor="#fff" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.26" />
          </linearGradient>
          <radialGradient id="fglow">
            <stop offset="0" stopColor="#fff" stopOpacity="0.9" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Opening at the top: the inside of ring 1. */}
        <ellipse cx={F.cx} cy={F.y0} rx={F.r0} ry={F.r0 * F.tilt} fill={mixHex(ringColor(s.ring[0].down, s.ring[0].up), "#000000", 0.3)} />
        <ellipse cx={F.cx} cy={F.y0 + 10} rx={F.r0 - 16} ry={(F.r0 - 16) * F.tilt * 0.8} fill="#000" opacity={0.06} />
        {RINGS.map((_, k) => {
          const yt = F.y0 + k * F.h + (k ? F.gap : 0), yb = F.y0 + (k + 1) * F.h - F.gap;
          const d = face(yt, yb);
          return (
            <g key={k}>
              <path d={d} fill={ringColor(s.ring[k].down, s.ring[k].up)} />
              <path d={d} fill="url(#fshade)" />
            </g>
          );
        })}
        {/* Spiral: passes behind the funnel are faint, passes in front are strong. */}
        {spiral.filter((r) => !r.front).map((r, k) => (
          <path key={`b${k}`} d={r.d} fill="none" stroke={r.color ?? K.gray} strokeOpacity={r.color ? 0.42 : 0.22} strokeWidth={r.color ? 3.5 : 2.5} strokeLinecap="round" />
        ))}
        {spiral.filter((r) => r.front).map((r, k) => (
          <g key={`f${k}`}>
            <path d={r.d} fill="none" stroke="#fff" strokeOpacity={0.9} strokeWidth={r.color ? 10 : 7} strokeLinecap="round" />
            <path d={r.d} fill="none" stroke={r.color ?? K.gray} strokeOpacity={r.color ? 1 : 0.55} strokeWidth={r.color ? 5 : 3} strokeLinecap="round" />
          </g>
        ))}
        {pt && (
          <g opacity={pt.o}>
            <circle cx={pt.x} cy={pt.y} r={30} fill={pt.color} opacity={0.22} />
            <circle cx={pt.x} cy={pt.y} r={17} fill={pt.color} opacity={0.35} />
            <circle cx={pt.x} cy={pt.y} r={10} fill={pt.color} stroke="#fff" strokeWidth={3.5} />
            <circle cx={pt.x - 3} cy={pt.y - 3} r={4} fill="url(#fglow)" />
          </g>
        )}
      </svg>
      {RINGS.map((r, k) => {
        const i = k + 1;
        const yc = F.y0 + (k + 0.5) * F.h;
        const x = F.cx + rAt(F.y0 + k * F.h) + 16;
        const on = lit(i);
        const color = s.ring[k].up > 0.5 ? K.orange : mixHex(mixHex(K.bg, K.gray, 0.9), K.navy, on);
        return (
          <div key={i} style={{ position: "absolute", left: x, top: yc + rAt(yc) * F.tilt * 0.45 - 26, fontFamily: SANS, color, whiteSpace: "nowrap" }}>
            <div style={{ fontSize: 25, fontWeight: 800, lineHeight: 1.1, display: "flex", alignItems: "center", gap: 10 }}>
              {r.name}
              {i === 2 && s.pat > 0 && (
                <span style={{ opacity: s.pat, transform: `scale(${0.8 + 0.2 * s.pat})`, background: s.ring[1].up > 0.5 ? K.orange : K.navy, color: "#fff", borderRadius: 8, padding: "3px 9px", fontSize: 16, fontWeight: 800 }}>PAT 2027</span>
              )}
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, marginTop: 4, opacity: 0.92 }}>{r.detail}</div>
          </div>
        );
      })}
    </>
  );
};
