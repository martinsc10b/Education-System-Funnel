// The 2.5D funnel for Video 2, adapted from Video 1 v6: flatter rings with visible gaps, colored by system
// (navy family for leadership, soft orange family for teaching and learning, dark → light going down),
// stage names outside on the right, details inside the ring (outside for the two smallest rings).
// Movement is cyan: one point and its trail on the spiral, the only element that links the rings.
import React from "react";
import { mixHex } from "../shared/theme";
import { K, SANS } from "./theme";

export const F = {
  cx: 242, // funnel axis
  y0: 196, // top rim
  h: 85, // ring height on the axis
  r0: 206, // radius at the top rim
  r1: 26, // radius at the tip
  tilt: Math.sin((13 * Math.PI) / 180), // flatter than Video 1 v6 (20°)
  gap: 7, // half the visible gap between rings
};
const Y1 = F.y0 + 8 * F.h;
export const THETA_END = 8 * 2 * Math.PI;
const rAt = (y: number) => F.r0 + ((F.r1 - F.r0) * (y - F.y0)) / (Y1 - F.y0);

export const RINGS: { name: string; detail: string[]; fill: string; text: string }[] = [
  { name: "Currículo Nacional", detail: ["Ministerio · DRE · UGEL · 31 competencias"], fill: "#002E5D", text: "#FFFFFF" },
  { name: "PEI", detail: ["Visión · Misión · Valores · PAT"], fill: "#2D5986", text: "#FFFFFF" },
  { name: "PCI", detail: ["Competencias · Enfoque", "Horas · Evaluación"], fill: "#5F86AF", text: "#FFFFFF" },
  { name: "Programación anual", detail: ["Contenidos por semana"], fill: "#FF8F4F", text: K.navy },
  { name: "Unidad didáctica", detail: ["8 unidades · 4 bimestres"], fill: "#FFA875", text: K.navy },
  { name: "Cuaderno de trabajo", detail: ["Dos veces al año"], fill: "#FFC09B", text: K.navy },
  { name: "Sesión", detail: ["Propósito"], fill: "#FFD6BE", text: K.navy },
  { name: "Estudiante", detail: ["Logro de aprendizaje"], fill: "#FFE6D6", text: K.navy },
];
const INSIDE = 6; // rings 1–6 carry their details inside

// Spiral point at angle θ (0 = top rim, THETA_END = tip). The spiral crosses the front of ring i in the lower
// part of its face (frontOf(i)), leaving the upper part free for the ring's details.
const PHASE = 1.5 * Math.PI;
export const spiralAt = (theta: number) => {
  const y = F.y0 + (theta / (2 * Math.PI)) * F.h;
  const r = rAt(y) + 3;
  const a = theta - PHASE;
  return { x: F.cx + r * Math.sin(a), y: y + r * F.tilt * Math.cos(a), front: Math.cos(a) };
};
export const frontOf = (i: number) => 2 * Math.PI * (i - 1) + PHASE;

const face = (yt: number, yb: number) => {
  const rt = rAt(yt), rb = rAt(yb);
  return `M${F.cx - rt} ${yt} A${rt} ${rt * F.tilt} 0 0 0 ${F.cx + rt} ${yt} L${F.cx + rb} ${yb} A${rb} ${rb * F.tilt} 0 0 1 ${F.cx - rb} ${yb} Z`;
};
// Top surface of a ring (seen from above through the gap): the full top ellipse.
const lid = (yt: number) => {
  const r = rAt(yt);
  return { cx: F.cx, cy: yt, rx: r, ry: r * F.tilt };
};

const STEP = 0.04;
const SAMPLES = Array.from({ length: Math.ceil(THETA_END / STEP) + 1 }, (_, k) => Math.min(k * STEP, THETA_END)).map((t) => ({ t, ...spiralAt(t) }));
const runs = (on: (t: number) => boolean) => {
  const out: { front: boolean; on: boolean; d: string }[] = [];
  let cur: (typeof out)[number] | null = null;
  for (const p of SAMPLES) {
    const front = p.front > 0, o = on(p.t);
    const pt = `${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    if (!cur || cur.front !== front || cur.on !== o) {
      if (cur) cur.d += ` L${pt}`;
      cur = { front, on: o, d: `M${pt}` };
      out.push(cur);
    } else cur.d += ` L${pt}`;
  }
  return out;
};

export type FunnelState = {
  reached: number[]; // per ring 1..8: 0..1, cyan rim and dark label once the evidence has reached it
  bands: [number, number]; // extra glow on «Sistema de liderazgo» and «Sistema de enseñanza y aprendizaje»
  trail: number; // θ from which the cyan trail runs down to the tip (THETA_END = no trail)
  point: { theta: number; o: number } | null;
};

const BAND_X = 8, BAND_W = 752;
const bandEdge = F.y0 + 3 * F.h + rAt(F.y0 + 3 * F.h) * F.tilt * 0.4;
const BANDS = [
  { y: 92, h: bandEdge - 92 - 4, label: ["SISTEMA DE LIDERAZGO"], labelY: 104, tint: "#E4EBF3", glow: "#CFDCEA", ink: K.navy },
  { y: bandEdge + 4, h: Y1 + 40 - bandEdge - 4, label: ["SISTEMA DE ENSEÑANZA", "Y APRENDIZAJE"], labelY: Y1 - 4, tint: "#FFF1E8", glow: "#FFE1CD", ink: "#E8611A" },
];

export const Funnel: React.FC<{ s: FunnelState }> = ({ s }) => {
  const spiral = runs((t) => t >= s.trail - 1e-6);
  const pt = s.point && { ...spiralAt(s.point.theta), o: s.point.o };
  return (
    <>
      {BANDS.map((b, k) => (
        <React.Fragment key={k}>
          <div style={{ position: "absolute", left: BAND_X, top: b.y, width: BAND_W, height: b.h, borderRadius: 26, background: mixHex(b.tint, b.glow, s.bands[k]) }} />
          <div style={{ position: "absolute", right: 1920 - BAND_X - BAND_W + 18, top: b.labelY, textAlign: "right", fontFamily: SANS, fontSize: 15, fontWeight: 800, letterSpacing: 1.6, lineHeight: 1.25, color: b.ink, opacity: 0.75 + 0.25 * s.bands[k] }}>
            {b.label.map((l) => <div key={l}>{l}</div>)}
          </div>
        </React.Fragment>
      ))}
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={800} height={1080} viewBox="0 0 800 1080">
        <defs>
          <linearGradient id="wshade" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#000000" stopOpacity="0.16" />
            <stop offset="0.32" stopColor="#FFFFFF" stopOpacity="0.14" />
            <stop offset="0.62" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="1" stopColor="#000000" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        {/* Painted bottom-up, so each ring hides the back of the ring below and only the gap shows. */}
        {RINGS.map((r, k) => ({ r, k })).reverse().map(({ r, k }) => {
          const yt = F.y0 + k * F.h + (k ? F.gap : 0), yb = F.y0 + (k + 1) * F.h - F.gap;
          const d = face(yt, yb), l = lid(yt), on = s.reached[k];
          return (
            <g key={k}>
              {/* The top of each ring shows through the gap; ring 1's top is the opening of the funnel. */}
              <ellipse {...l} fill={mixHex(r.fill, k ? "#FFFFFF" : "#000000", k ? 0.35 : 0.3)} />
              <path d={d} fill={r.fill} />
              <path d={d} fill="url(#wshade)" />
              {on > 0 && <path d={d} fill="none" stroke={K.cyan} strokeWidth={4} strokeOpacity={on} />}
            </g>
          );
        })}
        {spiral.filter((r) => !r.front).map((r, k) => (
          <path key={`b${k}`} d={r.d} fill="none" stroke={r.on ? K.cyan : K.gray} strokeOpacity={r.on ? 0.5 : 0.22} strokeWidth={r.on ? 3.5 : 2.2} strokeLinecap="round" />
        ))}
        {spiral.filter((r) => r.front).map((r, k) => (
          <g key={`f${k}`}>
            <path d={r.d} fill="none" stroke="#FFFFFF" strokeOpacity={0.85} strokeWidth={r.on ? 10 : 6} strokeLinecap="round" />
            <path d={r.d} fill="none" stroke={r.on ? K.cyan : K.gray} strokeOpacity={r.on ? 1 : 0.5} strokeWidth={r.on ? 5 : 2.6} strokeLinecap="round" />
          </g>
        ))}
        {pt && (
          <g opacity={pt.o}>
            <circle cx={pt.x} cy={pt.y} r={30} fill={K.cyan} opacity={0.25} />
            <circle cx={pt.x} cy={pt.y} r={17} fill={K.cyan} opacity={0.4} />
            <circle cx={pt.x} cy={pt.y} r={10} fill={K.cyan} stroke="#FFFFFF" strokeWidth={3.5} />
          </g>
        )}
      </svg>
      {RINGS.map((r, k) => {
        const yt = F.y0 + k * F.h, yb = yt + F.h, ym = (yt + yb) / 2;
        const front = ym + rAt(ym) * F.tilt * 0.75; // visual middle of the face
        const on = s.reached[k];
        const nameColor = mixHex("#9AA3B2", K.navy, on);
        return (
          <React.Fragment key={k}>
            <div style={{ position: "absolute", left: F.cx + rAt(yt) + 16, top: front - (k < INSIDE ? 16 : 26), fontFamily: SANS, color: nameColor, whiteSpace: "nowrap" }}>
              <div style={{ fontSize: 25, fontWeight: 800, lineHeight: 1.1 }}>{r.name}</div>
              {k >= INSIDE && <div style={{ fontSize: 16, fontWeight: 600, marginTop: 4 }}>{r.detail[0]}</div>}
            </div>
            {k < INSIDE && (
              <div style={{ position: "absolute", left: F.cx - 200, width: 400, top: yt + (k ? F.gap : 0) + rAt(yt) * F.tilt + 6, textAlign: "center", fontFamily: SANS, fontSize: 15, fontWeight: 700, lineHeight: 1.2, color: r.text, opacity: 0.95 }}>
                {r.detail.map((d) => <div key={d}>{d}</div>)}
              </div>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};
