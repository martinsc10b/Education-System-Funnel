import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, SANS } from "./theme";

export type Word = { text: string; start: number; end: number };
export type Seg = { id: string; part: number; from: number; dur: number; audioFrom: number; audio: number };
export type Cue = (needle: string, nth?: number) => number;
export type SceneProps = { seg: Seg; cue: Cue };

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");

// Local frame (inside the segment) at which the nth word starting with `needle` is spoken.
export const makeCue = (seg: Seg, words: Word[] | undefined, fps: number, rate: number): Cue => (needle, nth = 0) => {
  const n = norm(needle);
  const hits = (words ?? []).filter((w) => norm(w.text).startsWith(n));
  const w = hits[nth];
  if (!w) throw new Error(`cue "${needle}"#${nth} not found in ${seg.id}`);
  return Math.round(seg.audioFrom + (w.start * fps) / rate);
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.33, 0, 0.2, 1);

// 0→1 ramp starting at `at` over `dur` frames.
export const ramp = (frame: number, at: number, dur = 14) => interpolate(frame, [at, at + dur], [0, 1], { ...clamp, easing: ease });
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const useSpring = (at: number, damping = 16) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: { damping, mass: 0.7 } });
};

// Fades/slides a block in at `at`.
export const Reveal: React.FC<{ at: number; dy?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ at, dy = 14, children, style }) => {
  const frame = useCurrentFrame();
  const t = ramp(frame, at, 12);
  return <div style={{ opacity: t, transform: `translateY(${(1 - t) * dy}px)`, ...style }}>{children}</div>;
};

// Tile states: neutral gray → dim (20 %) → lit (route color, ×1.1).
export const tileStyle = (dim: number, lit: number, color: string): React.CSSProperties => ({
  background: lit > 0 ? mix(C.tile, color, lit) : C.tile,
  color: lit > 0.5 ? (isLight(color) ? C.ink : "#fff") : C.ink,
  opacity: 1 - 0.8 * dim * (1 - lit),
  transform: `scale(${1 + 0.1 * lit})`,
  boxShadow: lit > 0 ? `0 ${8 * lit}px ${22 * lit}px ${color}40` : "none",
});

export const isLight = (c: string) => {
  const v = c.startsWith("#") ? [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16)) : (c.match(/\d+/g) ?? []).map(Number);
  return 0.299 * v[0] + 0.587 * v[1] + 0.114 * v[2] > 165;
};

export const mix = (a: string, b: string, t: number) => {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [x, y] = [p(a), p(b)];
  return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * t)).join(",")})`;
};

// Document card: title, rows that appear on cue, owner line.
export type CardRow = { at: number; label?: string; body: React.ReactNode };
export const DocCard: React.FC<{ title: string; rows: CardRow[]; owner?: string; color: string; at: number; width?: number }> = ({ title, rows, owner, color, at, width = 870 }) => (
  <Reveal at={at} dy={24}>
    <div style={{ width, background: C.card, borderRadius: 18, borderLeft: `7px solid ${color}`, boxShadow: "0 10px 30px rgba(19,35,58,0.10)", padding: "20px 28px", fontFamily: SANS, color: C.ink, boxSizing: "border-box" }}>
      <div style={{ fontSize: 25, fontWeight: 800, marginBottom: 10 }}>{title}</div>
      {rows.map((r, i) => (
        <Reveal key={i} at={r.at} dy={8}>
          <div style={{ display: "flex", gap: 14, fontSize: 19.5, lineHeight: 1.35, padding: "5px 0", borderTop: i ? `1px solid ${C.tile}` : "none" }}>
            {r.label && <div style={{ flex: "0 0 auto", minWidth: 92, fontWeight: 700, color }}>{r.label}</div>}
            <div style={{ flex: 1 }}>{r.body}</div>
          </div>
        </Reveal>
      ))}
      {owner && (
        <div style={{ marginTop: 8, fontSize: 17, color: C.muted }}>
          Responsable: <b style={{ color: C.ink }}>{owner}</b>
        </div>
      )}
    </div>
  </Reveal>
);

// Small pill used inside cards (capacities, phrases).
export const Pill: React.FC<{ at: number; color: string; strong?: boolean; children: React.ReactNode; underline?: number }> = ({ at, color, strong, children, underline = 0 }) => {
  const frame = useCurrentFrame();
  const t = ramp(frame, at, 10);
  return (
    <span style={{ display: "inline-block", opacity: t, transform: `scale(${0.85 + 0.15 * t})`, margin: "3px 8px 3px 0", padding: "3px 12px", borderRadius: 999, background: strong ? color : `${color}22`, color: strong ? (isLight(color) ? C.ink : "#fff") : C.ink, fontFamily: SANS, fontWeight: strong ? 700 : 500, position: "relative" }}>
      {children}
      {underline > 0 && <span style={{ position: "absolute", left: 10, bottom: 1, height: 3, width: `calc(${underline * 100}% - 20px)`, background: color, borderRadius: 2 }} />}
    </span>
  );
};
