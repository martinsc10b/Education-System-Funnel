import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, G, SANS, barRight, layerColor, threadX } from "./theme";
import { isLight, lerp, mix, ramp, Seg, Word } from "./kit";
import layers from "./layers.json";

export const LAYERS = layers;
export const threadOf = (id: number) => layers[id - 1].thread;

// Everything outside the stage: funnel, direction arrow, thread (outputs) beside the funnel, header, footer.
export type ChromeState = {
  funnel: number; // opacity
  barColor: (i: number) => string; // fill when active / strip when visited
  active: number | null;
  activeT: number;
  visited: number[];
  glows: { layer: number; a: number; color?: string }[];
  chips: { layer: number; t: number; color: string }[];
  rail: Rail;
  rail2?: Rail; // second lane (closing scene: decisions down + evidence up)
  link?: { from: number; to: number; t: number; o: number; color: string };
  header: string;
  route?: { label: string; color: string };
  ficticios: boolean;
  names?: string[]; // stage names (Video 1 uses the generic ones from shared/stages)
  threads?: string[]; // thread chip labels
  title?: React.ReactNode; // header line, left
};
export type Rail = { mode: "down" | "up" | "stop-bottom" | "stop-top" | "none"; from: string; to: string; speed?: number; dx?: number };
export const downColors = (i: number) => layerColor(i);

const Bar: React.FC<{ i: number; s: ChromeState }> = ({ i, s }) => {
  const L = layers[i - 1];
  const w = G.barW(i);
  const col = s.barColor(i);
  const a = s.active === i ? s.activeT : 0;
  const visited = s.visited.includes(i);
  const glow = s.glows.filter((g) => g.layer === i).reduce((m, g) => (g.a > m.a ? g : m), { a: 0 } as { a: number; color?: string });
  const gc = glow.color ?? col;
  const fill = a > 0 ? mix("#FFFFFF", col, a) : glow.a > 0 ? mix("#FFFFFF", gc, 0.25 * glow.a) : "#FFFFFF";
  const onDark = a > 0.5 && !isLight(col);
  return (
    <div
      style={{
        position: "absolute", left: G.funnelCx - w / 2, top: G.barY(i), width: w, height: G.barH, boxSizing: "border-box",
        borderRadius: 14, border: `2px solid ${a > 0 ? mix(C.line, col, a) : glow.a > 0 ? mix(C.line, gc, glow.a) : C.line}`,
        background: fill, transform: `scale(${1 + 0.03 * a})`,
        boxShadow: glow.a > 0 ? `0 0 ${34 * glow.a}px ${gc}${Math.round(160 * glow.a).toString(16).padStart(2, "0")}` : a > 0 ? `0 8px 22px ${col}55` : "none",
        display: "flex", alignItems: "center", gap: 12, padding: "0 16px", overflow: "hidden",
        fontFamily: SANS, color: onDark ? "#fff" : a > 0.5 || visited || glow.a > 0.3 ? C.ink : C.muted,
      }}
    >
      {visited && a < 1 && <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 8, background: col, opacity: 1 - a }} />}
      <div style={{ flex: "0 0 auto", width: 34, height: 34, borderRadius: 17, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 800, background: a > 0.5 ? "rgba(255,255,255,0.25)" : C.bg }}>{i}</div>
      <div style={{ fontSize: w < 330 ? 20 : 22, fontWeight: a > 0.5 ? 800 : 600, whiteSpace: "nowrap" }}>{s.names?.[i - 1] ?? L.name}</div>
    </div>
  );
};

// One-way animated arrow: chevrons flow in the route direction along the left of the funnel.
const Arrow: React.FC<{ s: ChromeState; r: Rail; g: number; id: string }> = ({ s, r, g, id }) => {
  const { mode, from, to, speed = 1.6, dx = 0 } = r;
  if (mode === "none") return null;
  const top = G.barY(1) + 6, bottom = G.barY(8) + G.barH - 6, x = G.railX + dx;
  const up = mode === "up" || mode === "stop-top";
  const moving = mode === "down" || mode === "up";
  const SP = 84;
  const off = moving ? (g * speed) % SP : 0;
  const n = Math.floor((bottom - top) / SP) + 1;
  const chev = (y: number, k: number) => {
    const fade = Math.min(1, (y - top) / 50, (bottom - y) / 50);
    const d = up ? -1 : 1;
    return <path key={k} d={`M ${x - 13} ${y - 8 * d} L ${x} ${y + 6 * d} L ${x + 13} ${y - 8 * d}`} stroke={`url(#${id})`} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={Math.max(0, fade)} />;
  };
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, opacity: s.funnel }} width={120} height={1080}>
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={0} y1={top} x2={0} y2={bottom}>
          <stop offset="0" stopColor={from} /><stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
      <line x1={x} y1={top} x2={x} y2={bottom} stroke={`url(#${id})`} strokeWidth={3} opacity={0.35} />
      {moving && Array.from({ length: n }, (_, k) => chev(up ? bottom - ((k * SP + off) % (bottom - top)) : top + ((k * SP + off) % (bottom - top)), k))}
      {!moving && <path d={up ? `M ${x - 16} ${top + 18} L ${x} ${top} L ${x + 16} ${top + 18}` : `M ${x - 16} ${bottom - 18} L ${x} ${bottom} L ${x + 16} ${bottom - 18}`} stroke={up ? from : to} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" fill="none" />}
    </svg>
  );
};

export const slotRect = (i: number) => ({ x: threadX(i), y: G.barY(i), w: G.threadW, h: G.barH });
export const slotCenter = (i: number): [number, number] => [threadX(i) + G.threadW / 2, G.barY(i) + G.barH / 2];

export const ChipBox: React.FC<{ label: string; color: string; style?: React.CSSProperties }> = ({ label, color, style }) => (
  <div style={{ width: G.threadW, height: G.barH, boxSizing: "border-box", borderRadius: 12, background: color, color: isLight(color) ? C.ink : "#fff", fontFamily: SANS, fontSize: 15.5, fontWeight: 600, lineHeight: 1.22, padding: "6px 12px", display: "flex", alignItems: "center", ...style }}>{label}</div>
);

const Thread: React.FC<{ s: ChromeState }> = ({ s }) => (
  <div style={{ opacity: s.funnel }}>
    <div style={{ position: "absolute", left: threadX(1), top: 80, fontFamily: SANS, fontSize: 14, fontWeight: 800, letterSpacing: 2.5, color: C.muted }}>OUTPUT DE CADA ETAPA</div>
    {layers.map((L) => {
      const r = slotRect(L.id);
      const c = s.chips.find((x) => x.layer === L.id);
      const next = s.chips.find((x) => x.layer === L.id + 1);
      return (
        <React.Fragment key={L.id}>
          <div style={{ position: "absolute", left: r.x, top: r.y, width: r.w, height: r.h, boxSizing: "border-box", borderRadius: 12, border: `2px dashed ${C.tile}` }} />
          {c && c.t > 0 && <ChipBox label={s.threads?.[L.id - 1] ?? L.thread} color={c.color} style={{ position: "absolute", left: r.x, top: r.y, opacity: c.t }} />}
          {c && next && next.t > 0 && L.id < 8 && <div style={{ position: "absolute", left: threadX(L.id + 1) + 26, top: r.y + r.h, width: 4, height: 96 - r.h, background: next.color, opacity: next.t }} />}
        </React.Fragment>
      );
    })}
  </div>
);

// Line along the right end of the thread chips, from one layer up to another (Scene 7 → layer 1).
const Link: React.FC<{ s: ChromeState }> = ({ s }) => {
  if (!s.link || s.link.o <= 0) return null;
  const { from, to, t, o, color } = s.link;
  const pts = [];
  for (let i = from; i >= to; i--) pts.push([threadX(i) + G.threadW + 14, G.barY(i) + G.barH / 2]);
  const total = pts.length - 1;
  const seg = t * total;
  const drawn = pts.slice(0, Math.floor(seg) + 1);
  const k = Math.floor(seg);
  if (k < total) drawn.push([lerp(pts[k][0], pts[k + 1][0], seg - k), lerp(pts[k][1], pts[k + 1][1], seg - k)]);
  const head = drawn[drawn.length - 1];
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, opacity: o }} width={1920} height={1080}>
      <polyline points={drawn.map((p) => p.join(",")).join(" ")} stroke={color} strokeWidth={4} fill="none" />
      <circle cx={head[0]} cy={head[1]} r={8} fill={color} />
      {t >= 1 && <path d={`M ${pts[total][0]} ${pts[total][1]} H ${barRight(to)}`} stroke={color} strokeWidth={3} strokeDasharray="6 6" fill="none" />}
    </svg>
  );
};

export const Chrome: React.FC<{ s: ChromeState; g: number }> = ({ s, g }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <div style={{ position: "absolute", top: 30, left: 70, right: 44, display: "flex", justifyContent: "space-between", alignItems: "baseline", fontFamily: SANS }}>
      <span style={{ fontSize: 26, fontWeight: 800, color: C.navy }}>{s.title ?? <>Álgebra · 4.° de secundaria · Semana 26 <span style={{ color: C.muted, fontWeight: 600 }}>· Sistemas de ecuaciones lineales</span></>}</span>
      <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", color: C.muted }}>{s.header}</span>
    </div>
    <div style={{ opacity: s.funnel }}>{LAYERS.map((L) => <Bar key={L.id} i={L.id} s={s} />)}</div>
    <Arrow s={s} r={s.rail} g={g} id="rg1" />
    {s.rail2 && <Arrow s={s} r={s.rail2} g={g} id="rg2" />}
    <Thread s={s} />
    <Link s={s} />
    <div style={{ position: "absolute", left: G.stageX, right: 40, top: 1032, display: "flex", justifyContent: "space-between", fontFamily: SANS, fontSize: 19, fontWeight: 700 }}>
      <span style={{ color: s.route?.color }}>{s.route?.label ?? ""}</span>
      <span style={{ color: C.muted, letterSpacing: 1 }}>{s.ficticios ? "Casos ficticios" : ""}</span>
    </div>
  </AbsoluteFill>
);

// Burned-in captions from the aligned word timings.
type Chunk = { text: string; start: number; end: number };
const chunk = (words: Word[]): Chunk[] => {
  const out: Chunk[] = [];
  let cur: Word[] = [];
  const flush = () => { if (cur.length) out.push({ text: cur.map((w) => w.text).join(" "), start: cur[0].start, end: cur[cur.length - 1].end }); cur = []; };
  words.forEach((w, i) => {
    cur.push(w);
    const next = words[i + 1];
    const pause = next ? next.start - w.end > 0.4 : true;
    if (/[.?!:;]»?$/.test(w.text) || (/,$/.test(w.text) && cur.length >= 5) || cur.length >= 11 || pause) flush();
  });
  flush();
  return out.reduce<Chunk[]>((acc, ch) => {
    const prev = acc[acc.length - 1];
    if (prev && ch.text.split(" ").length <= 2 && prev.text.split(" ").length <= 10) { prev.text += " " + ch.text; prev.end = ch.end; } else acc.push({ ...ch });
    return acc;
  }, []);
};

export const Captions: React.FC<{ seg: Seg; words?: Word[]; rate: number }> = ({ seg, words, rate }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (!words?.length) return null;
  const t = ((frame - seg.audioFrom) * rate) / fps;
  const c = chunk(words).find((ch, i, all) => t >= ch.start - 0.05 && t < Math.min(all[i + 1]?.start ?? Infinity, ch.end + 0.7));
  if (!c) return null;
  return (
    <div style={{ position: "absolute", top: 930, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div style={{ background: "rgba(0,46,93,0.92)", color: "#fff", fontFamily: SANS, fontWeight: 600, fontSize: 33, lineHeight: 1.25, padding: "10px 28px", borderRadius: 14, maxWidth: 1560, textAlign: "center" }}>{c.text}</div>
    </div>
  );
};

// A chip flying between two global points (center coords), growing from `s0` to full size.
export const FlyChip: React.FC<{ from: [number, number]; to: [number, number]; t: number; label: string; color: string; s0?: number }> = ({ from, to, t, label, color, s0 = 0.45 }) => {
  if (t <= 0 || t >= 1) return null;
  const x = lerp(from[0], to[0], t), y = lerp(from[1], to[1], t) - Math.sin(Math.PI * t) * 60;
  return (
    <div style={{ position: "absolute", left: x - G.threadW / 2, top: y - G.barH / 2, transform: `scale(${lerp(s0, 1, t)})`, opacity: interpolate(t, [0, 0.15], [0, 1], { extrapolateRight: "clamp" }), zIndex: 20 }}>
      <ChipBox label={label} color={color} style={{ boxShadow: `0 10px 26px ${color}66` }} />
    </div>
  );
};

// Input: the output chips of earlier layers land at the top of the stage and stay there.
export const ENTRADA_AT = 6, ENTRADA_DUR = 30;
export const Entrada: React.FC<{ items: { layer: number; at?: number }[] }> = ({ items }) => {
  const frame = useCurrentFrame();
  const single = items.length === 1;
  return (
    <div style={{ position: "absolute", left: G.stageX, top: 104, display: "flex", alignItems: "center", gap: 10, fontFamily: SANS, zIndex: 20 }}>
      <div style={{ fontSize: 17, fontWeight: 800, color: C.muted, letterSpacing: 1, opacity: ramp(frame, ENTRADA_AT, 10) }}>RECIBE (INPUT){single ? ` DE ${LAYERS[items[0].layer - 1].name.toUpperCase()}` : ""}</div>
      {items.map(({ layer, at = ENTRADA_AT }) => {
        const t = ramp(frame, at, ENTRADA_DUR);
        const col = layerColor(layer);
        const [sx, sy] = slotCenter(layer);
        return (
          <div key={layer} style={{ position: "relative", opacity: t > 0 ? 1 : 0 }}>
            <div style={{ height: 44, borderRadius: 22, background: col, color: isLight(col) ? C.ink : "#fff", fontSize: 17, fontWeight: 700, padding: "0 16px", display: "flex", alignItems: "center", whiteSpace: "nowrap", boxShadow: `0 6px 18px ${col}44`, transform: `translate(${(1 - t) * (sx - G.stageX - 200)}px, ${(1 - t) * (sy - 126) - Math.sin(Math.PI * t) * 30}px)` }}>{threadOf(layer)}</div>
          </div>
        );
      })}
    </div>
  );
};

// Panorama (designed in an 870×600 box) that shrinks to the top of the stage when the card arrives.
export const PANO = { w: 870, h: 600, mini: 0.6 };
export const miniPt = (px: number, py: number, m = PANO.mini): [number, number] => [G.stageX + (PANO.w * (1 - m)) / 2 + px * m, G.stageTop + py * m];

export const PanoCard: React.FC<{ cardAt: number; pano: React.ReactNode; card?: React.ReactNode; mini?: number }> = ({ cardAt, pano, card, mini = PANO.mini }) => {
  const frame = useCurrentFrame();
  const t = ramp(frame, cardAt, 18);
  const sc = lerp(1, mini, t);
  return (
    <>
      <div style={{ position: "absolute", left: G.stageX + (PANO.w * (1 - sc)) / 2, top: lerp(G.stageTop + 65, G.stageTop, t), width: PANO.w, height: PANO.h, transform: `scale(${sc})`, transformOrigin: "top left" }}>{pano}</div>
      {card && <div style={{ position: "absolute", left: G.stageX, top: G.stageTop + PANO.h * mini + 18 }}>{card}</div>}
    </>
  );
};
