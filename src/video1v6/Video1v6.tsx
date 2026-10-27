// Video 1 v6 · «¿Cómo entendemos nuestra labor pedagógica?». Down the funnel (navy) and back up (orange).
// Persistent layers (header, funnel, mini classroom) follow the global frame; each scene crossfades for 0.3 s.
// Scenes are drawn in a 900-wide box and scaled into the right 60 % of the frame.
import React from "react";
import { AbsoluteFill, Audio, Easing, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { mixHex } from "../shared/theme";
import { Room } from "./art";
import { Funnel, FunnelState, frontOf, THETA_END } from "./Funnel";
import { SCENES } from "./scenes";
import { fade, K, L, SANS } from "./theme";
import timeline from "./timeline.json";
import captions from "./captions.json";

type Word = { text: string; start: number; end: number };
type Piece = { src0: number; src1: number; out0: number };
type Seg = { id: string; from: number; dur: number; voice: number; pieces: Piece[] };
const TL = timeline as { fps: number; total: number; segments: Seg[] };
const W = captions as Record<string, Word[]>;
export const VIDEO1V6_LENGTH = TL.total;
const XF = 9; // 0.3 s crossfade
const END_CARD = 45; // ≤ 1.5 s

const SEG = Object.fromEntries(TL.segments.map((s) => [s.id, s]));
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");
// Local frame (inside the segment) at which the nth word starting with `needle` begins.
const cueIn = (id: string) => (needle: string, nth = 0) => {
  const w = (W[id] ?? []).filter((x) => norm(x.text).startsWith(norm(needle)))[nth];
  if (!w) throw new Error(`cue "${needle}"#${nth} not found in ${id}`);
  return Math.round(w.start * TL.fps);
};
const gcue = (id: string, needle: string, nth = 0) => SEG[id].from + cueIn(id)(needle, nth);

// Descent: the navy point reaches ring i as the narration names it, lingers on the ring's front face while
// that ring is narrated, and goes round the back just before the next name. Ascent: the orange point climbs
// from the tip to the top rim between «sube» and «Currículo».
const RING_CUES = [gcue("V01", "Currículo"), gcue("V02", "PEI"), gcue("V03", "PCI"), gcue("V04", "programación"), gcue("V05", "unidades"), gcue("V06", "cuaderno"), gcue("V07", "sesión"), gcue("V08", "Bruno")];
const LAND = gcue("V08", "aterrizan");
const SWING = 0.6 * Math.PI;
const DOWN_KEYS: [number, number][] = [[SEG.V01.from, 0]];
RING_CUES.forEach((c, k) => {
  const i = k + 1, next = RING_CUES[k + 1] ?? LAND;
  DOWN_KEYS.push([c, frontOf(i) - SWING], [next - Math.min(45, Math.round((next - c) * 0.3)), frontOf(i) + SWING]);
});
DOWN_KEYS.push([LAND + 20, THETA_END]);
const ASC0 = gcue("V09", "sube"), ASC1 = gcue("V09", "Currículo");
const thetaAt = (g: number) => g < SEG.V09.from
  ? interpolate(g, DOWN_KEYS.map((k) => k[0]), DOWN_KEYS.map((k) => k[1]), { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.sin) })
  : interpolate(g, [ASC0, ASC1], [THETA_END, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
// Frame at which the ascent enters ring i (from below).
const upAt = (i: number) => ASC0 + ((THETA_END - 2 * Math.PI * i) / THETA_END) * (ASC1 - ASC0);
const PAT_AT = gcue("V02", "PAT");
const OPEN_DIM = gcue("V00", "Veamos"), LEAD = gcue("V03", "Estas"), TEACH_DIM = gcue("V04", "docentes"), BOTH = gcue("V10", "dos");

const funnelState = (g: number): FunnelState => {
  const theta = thetaAt(g);
  const ascent = g >= SEG.V09.from, close = g >= SEG.V10.from;
  const open = fade(g, 6, 12) * (1 - fade(g, OPEN_DIM, 15));
  const both = fade(g, BOTH, 12);
  return {
    ring: RING_CUES.map((c, k) => ({ down: fade(g, c, XF), up: ascent ? fade(g, k === 7 ? ASC0 : upAt(k + 1), XF) : 0 })),
    bands: [
      Math.max(open, both, fade(g, LEAD, 12) * (1 - fade(g, SEG.V04.from, 12))),
      Math.max(open, both, fade(g, SEG.V04.from, 12) * (1 - fade(g, TEACH_DIM, 15))),
    ],
    bandColor: close ? K.orange : K.navy,
    paths: close ? [{ from: 0, to: THETA_END, color: K.orange }]
      : ascent ? [{ from: 0, to: THETA_END, color: K.navy }, { from: theta, to: THETA_END, color: K.orange }]
      : g >= SEG.V01.from ? [{ from: 0, to: theta, color: K.navy }] : [],
    point: g < SEG.V01.from ? null : { theta, color: ascent ? K.orange : K.navy, o: fade(g, SEG.V01.from, 12) * (1 - fade(g, SEG.V10.from, 12)) },
    pat: fade(g, PAT_AT, 10),
  };
};

const Header: React.FC = () => (
  <>
    <div style={{ position: "absolute", left: 64, top: 46, fontFamily: SANS, fontSize: 26, fontWeight: 500, color: K.navy }}>Una clase real · Álgebra · 4.° de secundaria · Semana 26</div>
    <div style={{ position: "absolute", right: 64, top: 40, fontFamily: SANS, fontSize: 20, fontWeight: 800, letterSpacing: 1, color: "#fff", background: K.navy, borderRadius: 10, padding: "8px 18px" }}>VIDEO 1</div>
  </>
);

// The mini 4.° A classroom gains one detail per stage reached.
const MiniClass: React.FC<{ g: number }> = ({ g }) => {
  const d = (i: number) => fade(g, SEG[`V0${i}`].from + 12, 12);
  const sem = d(4), prop = d(7);
  return (
    <div style={{ position: "absolute", left: L.mini.x, top: L.mini.y }}>
      <div style={{ fontFamily: SANS, fontSize: 16, fontWeight: 800, color: K.navy, marginBottom: 6 }}>4.° A</div>
      <div style={{ width: L.mini.w, height: 480 * L.mini.scale, borderRadius: 10, overflow: "hidden", boxShadow: "0 6px 20px rgba(0,46,93,0.14)" }}>
        <div style={{ transform: `scale(${L.mini.scale})`, transformOrigin: "top left" }}>
          <Room boardO={d(1)} crest={d(2)} clock={d(3)} criteria={d(5)} books={d(6)} bruno={d(8)} board={
            <div style={{ padding: "26px 34px", fontFamily: SANS, color: "#fff" }}>
              <div style={{ fontSize: 40, fontWeight: 800, opacity: sem }}>Semana 26</div>
              <div style={{ fontSize: 34, fontWeight: 700, marginTop: 16, lineHeight: 1.25, opacity: prop }}>Propósito: resolver y clasificar sistemas</div>
            </div>
          } />
        </div>
      </div>
    </div>
  );
};

// Burned-in captions, bottom center, two lines at most.
type Chunk = { text: string; start: number; end: number };
const chunk = (words: Word[]): Chunk[] => {
  const out: Chunk[] = [];
  let cur: Word[] = [];
  const flush = () => { if (cur.length) out.push({ text: cur.map((w) => w.text).join(" "), start: cur[0].start, end: cur[cur.length - 1].end }); cur = []; };
  words.forEach((w, i) => {
    cur.push(w);
    const len = cur.map((x) => x.text).join(" ").length;
    if (/[.?!:;]["»]?$/.test(w.text) || (/,$/.test(w.text) && cur.length >= 5) || (len >= 70 && w.text.length > 3) || len >= 86 || !words[i + 1]) flush();
  });
  flush();
  // A one- or two-word tail joins the chunk before it, so no subtitle shows a lone word.
  return out.reduce<Chunk[]>((acc, ch) => {
    const prev = acc[acc.length - 1];
    if (prev && ch.text.split(" ").length <= 2 && prev.text.length + ch.text.length <= 86) { prev.text += " " + ch.text; prev.end = ch.end; } else acc.push({ ...ch });
    return acc;
  }, []);
};
const CHUNKS = Object.fromEntries(Object.entries(W).map(([id, ws]) => [id, chunk(ws)]));
const Captions: React.FC<{ id: string }> = ({ id }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const all = CHUNKS[id] ?? [];
  const c = all.find((ch, i) => t >= ch.start - 0.05 && t < Math.min(all[i + 1]?.start ?? Infinity, ch.end + 0.3));
  if (!c) return null;
  return (
    <div style={{ position: "absolute", bottom: 46, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div style={{ background: "rgba(0,46,93,0.94)", color: "#fff", fontFamily: SANS, fontWeight: 600, fontSize: 34, lineHeight: 1.3, padding: "10px 28px", borderRadius: 14, maxWidth: 1180, textAlign: "center" }}>{c.text}</div>
    </div>
  );
};

const Scene: React.FC<{ seg: Seg; last: boolean }> = ({ seg, last }) => {
  const f = useCurrentFrame();
  const Comp = SCENES[seg.id];
  const o = (seg.from === 0 ? 1 : fade(f, 0, XF)) * (last ? 1 : 1 - fade(f, seg.dur, XF));
  return (
    <AbsoluteFill style={{ opacity: o, transformOrigin: `${L.sceneX}px ${L.scene.oy}px`, transform: `translateX(${L.scene.dx}px) scale(${L.scene.s})` }}>
      <Comp cue={cueIn(seg.id)} dur={seg.dur} />
    </AbsoluteFill>
  );
};

const EndCard: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: K.navy, opacity: fade(f, 0, 8), alignItems: "center", justifyContent: "center", fontFamily: SANS, color: "#fff", gap: 26 }}>
      <div style={{ fontSize: 66, fontWeight: 800 }}>¿Cómo entendemos nuestra labor pedagógica?</div>
      <div style={{ fontSize: 30, fontWeight: 600 }}>Colegio San Pío X <span style={{ color: K.orange }}>·</span> Bloom for Education</div>
    </AbsoluteFill>
  );
};

const Persistent: React.FC = () => {
  const g = useCurrentFrame();
  return (<><Header /><Funnel s={funnelState(g)} /><MiniClass g={g} /></>);
};

export const Video1v6: React.FC = () => (
  <AbsoluteFill style={{ background: K.bg }}>
    {TL.segments.map((s, k) => {
      const last = k === TL.segments.length - 1;
      return (
        <Sequence key={s.id} from={s.from} durationInFrames={s.dur + (last ? 0 : XF)} name={s.id} layout="none">
          <Scene seg={s} last={last} />
        </Sequence>
      );
    })}
    <Persistent />
    {TL.segments.map((s) => (
      <Sequence key={`c${s.id}`} from={s.from} durationInFrames={s.dur} name={`sub ${s.id}`} layout="none"><Captions id={s.id} /></Sequence>
    ))}
    {TL.segments.flatMap((s) => s.pieces.map((p, i) => (
      <Sequence key={`a${s.id}${i}`} from={s.from + Math.round(p.out0 * TL.fps)} name={`voz ${s.id}.${i}`} layout="none">
        <Audio src={staticFile(`audio/v6/${s.id}.mp3`)} trimBefore={Math.round(p.src0 * TL.fps)} trimAfter={Math.round(p.src1 * TL.fps)} />
      </Sequence>
    )))}
    <Sequence from={TL.total - END_CARD} durationInFrames={END_CARD} name="cierre"><EndCard /></Sequence>
  </AbsoluteFill>
);
