// Flat illustrations for Video 1 v6. Everything is a fill; no arrows, connectors or vertical rules.
import React from "react";
import { K, SANS } from "./theme";

type XY = { x: number; y: number; s?: number; o?: number };

// A standing person, feet at (x, y). pose: point = right arm raised to the board, hold = arm forward with a sheet.
export const Person: React.FC<XY & { shirt: string; hairLong?: boolean; skin?: string; pose?: "point" | "hold" | "stand"; legs?: string }> = ({ x, y, s = 1, o = 1, shirt, hairLong, skin = K.skin, pose = "stand", legs = K.navy }) => (
  <svg style={{ position: "absolute", left: x - 40 * s, top: y - 200 * s, opacity: o, overflow: "visible" }} width={80 * s} height={200 * s} viewBox="0 0 80 200">
    {hairLong && <path d="M18 34 Q18 12 40 12 Q62 12 62 34 L64 86 L16 86 Z" fill={K.hair} />}
    <rect x="25" y="128" width="13" height="70" rx="6" fill={legs} />
    <rect x="42" y="128" width="13" height="70" rx="6" fill={legs} />
    <rect x="16" y="60" width="48" height="78" rx="18" fill={shirt} />
    <rect x="9" y="68" width="11" height="54" rx="5.5" fill={shirt} />
    {pose === "point" && <rect x="56" y="64" width="11" height="58" rx="5.5" fill={shirt} transform="rotate(-140 61 70)" />}
    {pose === "hold" && <rect x="56" y="70" width="11" height="44" rx="5.5" fill={shirt} transform="rotate(-70 61 74)" />}
    {pose === "stand" && <rect x="60" y="68" width="11" height="54" rx="5.5" fill={shirt} />}
    <circle cx="40" cy="36" r="20" fill={skin} />
    {hairLong ? <path d="M20 34 Q22 14 40 14 Q58 14 60 34 Q50 24 30 28 Z" fill={K.hair} /> : <path d="M20 34 Q20 14 40 14 Q60 14 60 30 Q48 22 22 34 Z" fill={K.hair} />}
  </svg>
);

// A student seen from behind, sitting at a desk centered on x.
export const Student: React.FC<{ x: number; y: number; book?: number; hair?: string }> = ({ x, y, book = 0, hair = K.hair }) => (
  <div style={{ position: "absolute", left: x - 60, top: y - 70, width: 120, height: 140 }}>
    <div style={{ position: "absolute", left: 32, top: 34, width: 56, height: 44, borderRadius: "24px 24px 6px 6px", background: "#B9C7D6" }} />
    <div style={{ position: "absolute", left: 42, top: 0, width: 36, height: 36, borderRadius: 18, background: hair }} />
    <div style={{ position: "absolute", left: 0, top: 70, width: 120, height: 16, borderRadius: 4, background: K.wood }} />
    <div style={{ position: "absolute", left: 12, top: 86, width: 10, height: 50, borderRadius: 3, background: "#B48F66" }} />
    <div style={{ position: "absolute", left: 98, top: 86, width: 10, height: 50, borderRadius: 3, background: "#B48F66" }} />
    {book > 0 && (
      <div style={{ position: "absolute", left: 38, top: 56, width: 44, height: 18, opacity: book, display: "flex", gap: 2 }}>
        <div style={{ flex: 1, background: "#fff", borderRadius: 2, boxShadow: `0 0 0 2px ${K.navy}` }} />
        <div style={{ flex: 1, background: "#fff", borderRadius: 2, boxShadow: `0 0 0 2px ${K.navy}` }} />
      </div>
    )}
  </div>
);

export type RoomProps = {
  board?: React.ReactNode;
  crest?: number;
  clock?: number;
  criteria?: number;
  books?: number;
  carmen?: { o: number; pose?: "point" | "stand" };
  bruno?: number;
  boardO?: number;
};

// The 4.° A classroom, drawn in a 900×480 box. The mini classroom is the same drawing scaled down.
export const Room: React.FC<RoomProps> = ({ board, crest = 0, clock = 0, criteria = 0, books = 0, carmen, bruno = 0, boardO = 1 }) => (
  <div style={{ position: "relative", width: 900, height: 480, borderRadius: 26, overflow: "hidden", background: K.wall, fontFamily: SANS }}>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 84, background: K.floor }} />
    <div style={{ position: "absolute", left: 34, top: 44, width: 96, height: 150, borderRadius: 10, background: "#CFE4EE", boxShadow: "inset 0 0 0 8px #F7FAFC" }} />
    <div style={{ position: "absolute", left: 180, top: 30, width: 540, height: 226, borderRadius: 12, background: K.navy, boxShadow: "0 0 0 7px #C9D3DD", opacity: boardO, overflow: "hidden" }}>{board}</div>
    <div style={{ position: "absolute", left: 770, top: 36, width: 56, height: 56, borderRadius: 28, background: "#fff", boxShadow: `0 0 0 4px ${K.navy}`, opacity: clock }}>
      <div style={{ position: "absolute", left: 26, top: 12, width: 4, height: 18, borderRadius: 2, background: K.navy }} />
      <div style={{ position: "absolute", left: 26, top: 26, width: 16, height: 4, borderRadius: 2, background: K.orange }} />
    </div>
    <div style={{ position: "absolute", left: 772, top: 112, width: 52, height: 60, opacity: crest, background: K.navy, clipPath: "polygon(0 0, 100% 0, 100% 60%, 50% 100%, 0 60%)", color: "#fff", fontSize: 13, fontWeight: 800, display: "flex", justifyContent: "center", paddingTop: 14, boxSizing: "border-box" }}>SPX</div>
    <div style={{ position: "absolute", left: 752, top: 190, width: 96, height: 104, borderRadius: 8, background: "#fff", opacity: criteria, padding: 10, boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 9 }}>
      <div style={{ fontSize: 10, fontWeight: 800, color: K.navy }}>CRITERIOS</div>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <div style={{ width: 10, height: 10, borderRadius: 5, background: K.orange }} />
          <div style={{ flex: 1, height: 8, borderRadius: 4, background: "#D3DBE3" }} />
        </div>
      ))}
    </div>
    <Student x={300} y={366} book={books} />
    <Student x={450} y={366} book={books} hair="#4A3328" />
    <Student x={600} y={366} book={books} />
    {carmen && carmen.o > 0 && <Person x={140} y={420} s={1.05} shirt={K.carmen} hairLong pose={carmen.pose ?? "point"} o={carmen.o} />}
    {bruno > 0 && <Person x={760} y={420} s={0.98} shirt={K.bruno} skin={K.skin2} pose="point" o={bruno} />}
  </div>
);

export const School: React.FC<{ w?: number; plaque?: React.ReactNode }> = ({ w = 620, plaque }) => (
  <div style={{ position: "relative", width: w, height: w * 0.56, fontFamily: SANS }}>
    <div style={{ position: "absolute", transform: `scale(${w / 620})`, transformOrigin: "top left", width: 620, height: 348 }}>
      <div style={{ position: "absolute", left: 120, top: 0, width: 380, height: 14, borderRadius: 7, background: K.navy }} />
      <div style={{ position: "absolute", left: 10, top: 24, width: 600, height: 16, borderRadius: 4, background: K.navy }} />
      <div style={{ position: "absolute", left: 24, top: 40, width: 572, height: 230, background: "#DCE5EE" }} />
      <div style={{ position: "absolute", left: 220, top: 40, width: 180, height: 230, background: "#fff" }} />
      <div style={{ position: "absolute", left: 220, top: 60, width: 180, textAlign: "center", fontSize: 26, fontWeight: 800, color: K.navy }}>SAN PÍO X</div>
      <div style={{ position: "absolute", left: 220, top: 94, width: 180, textAlign: "center", fontSize: 12, fontWeight: 700, letterSpacing: 2, color: K.gray }}>COLEGIO</div>
      <div style={{ position: "absolute", left: 270, top: 150, width: 80, height: 120, borderRadius: "8px 8px 0 0", background: K.navy }} />
      {[50, 120, 450, 520].map((x) => [80, 160].map((y) => <div key={`${x}-${y}`} style={{ position: "absolute", left: x, top: y, width: 46, height: 46, borderRadius: 6, background: "#B9CCDD" }} />))}
      <div style={{ position: "absolute", left: 0, top: 262, width: 620, height: 22, borderRadius: 11, background: "#E6EAEE" }} />
      {plaque && <div style={{ position: "absolute", left: 110, top: 292, width: 400 }}>{plaque}</div>}
    </div>
  </div>
);

// Simplified silhouette of Peru.
export const Peru: React.FC<{ w?: number }> = ({ w = 380 }) => (
  <svg width={w} height={w * 1.3} viewBox="0 0 400 520">
    <path d="M40 118 L72 96 L104 92 L130 52 L170 10 L214 24 L244 58 L282 70 L314 108 L352 130 L388 172 L372 206 L330 228 L318 262 L340 300 L388 322 L392 372 L376 420 L398 466 L366 498 L330 518 L296 498 L232 452 L170 402 L122 326 L82 252 L52 196 L18 152 Z" fill={K.navy} />
  </svg>
);

// Simple flat icons for the PCI (48×48).
export const Icon: React.FC<{ kind: "target" | "bulb" | "clock" | "check"; color: string }> = ({ kind, color }) => (
  <svg width="56" height="56" viewBox="0 0 48 48">
    {kind === "target" && (<><circle cx="24" cy="24" r="20" fill={color} /><circle cx="24" cy="24" r="13" fill="#fff" /><circle cx="24" cy="24" r="6" fill={color} /></>)}
    {kind === "bulb" && (<><circle cx="24" cy="20" r="14" fill={color} /><rect x="17" y="32" width="14" height="10" rx="3" fill={color} /><circle cx="24" cy="20" r="6" fill="#fff" /></>)}
    {kind === "clock" && (<><circle cx="24" cy="24" r="20" fill={color} /><circle cx="24" cy="24" r="15" fill="#fff" /><rect x="22" y="13" width="4" height="13" rx="2" fill={color} /><rect x="22" y="22" width="11" height="4" rx="2" fill={color} /></>)}
    {kind === "check" && (<><rect x="6" y="4" width="36" height="40" rx="6" fill={color} /><rect x="12" y="10" width="24" height="28" rx="3" fill="#fff" /><path d="M16 24 L22 30 L33 17" stroke={color} strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></>)}
  </svg>
);

export const Check: React.FC<{ size?: number; color?: string; t?: number }> = ({ size = 36, color = K.orange, t = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" style={{ opacity: t > 0 ? 1 : 0 }}>
    <path d="M6 19 L14 27 L30 9" stroke={color} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="40" strokeDashoffset={40 * (1 - t)} />
  </svg>
);

// White rounded card with a soft shadow.
export const Card: React.FC<{ style?: React.CSSProperties; children: React.ReactNode }> = ({ style, children }) => (
  <div style={{ background: K.card, borderRadius: 18, boxShadow: "0 10px 30px rgba(0,46,93,0.10)", fontFamily: SANS, color: K.ink, boxSizing: "border-box", ...style }}>{children}</div>
);

export const Tag: React.FC<{ color?: string; bg?: string; children: React.ReactNode; style?: React.CSSProperties }> = ({ color = K.navy, bg = "#E6EDF4", children, style }) => (
  <span style={{ display: "inline-block", padding: "6px 14px", borderRadius: 999, background: bg, color, fontFamily: SANS, fontWeight: 700, fontSize: 20, whiteSpace: "nowrap", ...style }}>{children}</span>
);
