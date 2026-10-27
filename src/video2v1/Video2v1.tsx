// Video 2 v1 · «La brújula». The whole video is the ascent: the cyan point starts at the student and climbs
// the funnel's spiral to the Currículo Nacional as the evidence goes up, one scale at a time.
// Persistent layers (header, funnel, mini classroom, footer) follow the global frame; each scene crossfades
// for 0.3 s. Scenes are drawn in a 900-wide box and scaled into the right 60 % of the frame.
import React from "react";
import { AbsoluteFill, Audio, Easing, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
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
export const VIDEO2V1_LENGTH = TL.total;
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

// Where the evidence is: the ring each cue brings the cyan point to (8 = Estudiante … 1 = Currículo Nacional).
const START = gcue("W00", "estudiantes");
const ARRIVE: [number, number][] = [
  [gcue("W05", "sección"), 7],
  [gcue("W07", "Cuarto"), 6],
  [gcue("W07", "sesenta"), 5],
  [gcue("W07", "secundaria"), 4],
  [gcue("W08", "PCI"), 3],
  [gcue("W08", "PAT"), 2],
  [gcue("W09", "colegio"), 1],
];
// «Sesión» lights in scene 6, when Carmen uses the signal; every other ring lights as the point arrives.
const REACHED = [...ARRIVE.map(([f, i]) => [i, i === 7 ? gcue("W06", "primera") : f]), [8, START]].sort((a, b) => a[0] - b[0]).map(([, f]) => f);
const KEYS: [number, number][] = [[START, THETA_END], [START + 40, frontOf(8)], [gcue("W05", "nueve", 1), frontOf(8)]];
ARRIVE.forEach(([f, i]) => {
  const prev = KEYS[KEYS.length - 1];
  const travel = Math.max(1, Math.min(42, f - prev[0] - 1));
  if (f - travel > prev[0]) KEYS.push([f - travel, prev[1]]);
  KEYS.push([f, frontOf(i)]);
});
const thetaAt = (g: number) => interpolate(g, KEYS.map((k) => k[0]), KEYS.map((k) => k[1]), { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.sin) });
const CLOSE = SEG.W11.from;
const INTRO_DIM = gcue("W00", "Ahora"), LEAD = gcue("W08", "dirección");

const funnelState = (g: number): FunnelState => {
  const theta = thetaAt(g);
  const intro = fade(g, 6, 12) * (1 - fade(g, INTRO_DIM, 15));
  const close = fade(g, CLOSE, 15);
  return {
    reached: REACHED.map((f) => fade(g, f, XF)),
    bands: [Math.max(intro, close, fade(g, LEAD, 15) * (1 - fade(g, SEG.W09.from, 15))), Math.max(intro, close)],
    trail: g < START ? THETA_END : g < CLOSE ? theta : interpolate(g, [CLOSE, CLOSE + 30], [theta, 0], { extrapolateRight: "clamp" }),
    point: g < START ? null : { theta, o: fade(g, START, 10) * (1 - close) },
  };
};

const Header: React.FC = () => (
  <>
    <div style={{ position: "absolute", left: 64, top: 46, fontFamily: SANS, fontSize: 25, fontWeight: 500, color: K.navy, whiteSpace: "nowrap" }}>
      Una clase real · Álgebra · <span style={{ fontWeight: 800, background: "#FFE6D6", borderRadius: 8, padding: "2px 8px" }}>4.° de secundaria</span> · Semana 26 · 21–25 de septiembre
    </div>
    <div style={{ position: "absolute", right: 64, top: 40, fontFamily: SANS, fontSize: 20, fontWeight: 800, letterSpacing: 1, color: "#fff", background: K.navy, borderRadius: 10, padding: "8px 18px" }}>VIDEO 2</div>
  </>
);

// The 4.° A classroom, fixed bottom-right for the whole video.
const MiniClass: React.FC = () => (
  <div style={{ position: "absolute", left: L.mini.x, top: L.mini.y }}>
    <div style={{ fontFamily: SANS, fontSize: 16, fontWeight: 800, color: K.navy, marginBottom: 6 }}>4.° A</div>
    <div style={{ width: L.mini.w, height: 480 * L.mini.scale, borderRadius: 10, overflow: "hidden", boxShadow: "0 6px 20px rgba(0,46,93,0.14)" }}>
      <div style={{ transform: `scale(${L.mini.scale})`, transformOrigin: "top left" }}>
        <Room crest={1} clock={1} criteria={1} books={1} board={
          <div style={{ padding: "26px 34px", fontFamily: SANS, color: "#fff" }}>
            <div style={{ fontSize: 40, fontWeight: 800 }}>Semana 26</div>
            <div style={{ fontSize: 34, fontWeight: 700, marginTop: 16, lineHeight: 1.25 }}>Propósito: resolver y clasificar sistemas</div>
          </div>
        } />
      </div>
    </div>
  </div>
);

// Scenes that put figures on screen carry the footer.
const NUMBERS = new Set(["W02", "W03", "W04", "W05", "W07", "W09"]);
const Footer: React.FC<{ g: number }> = ({ g }) => {
  const o = Math.max(0, ...TL.segments.filter((s) => NUMBERS.has(s.id)).map((s) => fade(g, s.from, XF) * (1 - fade(g, s.from + s.dur, XF))));
  return <div style={{ position: "absolute", left: 26, top: 1036, opacity: o, fontFamily: SANS, fontSize: 17, fontWeight: 600, color: K.gray }}>Estudiantes ficticios · cifras de ejemplo</div>;
};

// Burned-in captions, bottom center, two lines at most; the word being spoken lights up.
type Chunk = { words: Word[]; start: number; end: number };
const chunk = (words: Word[]): Chunk[] => {
  const out: Chunk[] = [];
  let cur: Word[] = [];
  const flush = () => { if (cur.length) out.push({ words: cur, start: cur[0].start, end: cur[cur.length - 1].end }); cur = []; };
  const len = () => cur.map((x) => x.text).join(" ").length;
  words.forEach((w, i) => {
    cur.push(w);
    if (/[.?!:;]["»]?$/.test(w.text) || (/,$/.test(w.text) && cur.length >= 5) || (len() >= 70 && w.text.length > 3) || len() >= 86 || !words[i + 1]) flush();
  });
  flush();
  // A one- or two-word tail joins the chunk before it, so no subtitle shows a lone word.
  return out.reduce<Chunk[]>((acc, ch) => {
    const prev = acc[acc.length - 1];
    const text = (c: Chunk) => c.words.map((w) => w.text).join(" ");
    if (prev && ch.words.length <= 2 && text(prev).length + text(ch).length <= 86) { prev.words.push(...ch.words); prev.end = ch.end; } else acc.push({ ...ch, words: [...ch.words] });
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
      <div style={{ background: "rgba(0,46,93,0.94)", fontFamily: SANS, fontWeight: 600, fontSize: 34, lineHeight: 1.3, padding: "10px 28px", borderRadius: 14, maxWidth: 1180, textAlign: "center" }}>
        {c.words.map((w, i) => {
          const now = t >= w.start - 0.03 && t < (c.words[i + 1]?.start ?? w.end + 0.3);
          return <span key={i} style={{ color: now ? K.cyan : t >= w.start ? "#FFFFFF" : "rgba(255,255,255,0.62)" }}>{w.text}{i < c.words.length - 1 ? " " : ""}</span>;
        })}
      </div>
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
      <div style={{ fontSize: 66, fontWeight: 800 }}>Las decisiones bajan. <span style={{ color: K.cyan }}>La evidencia sube.</span></div>
      <div style={{ fontSize: 30, fontWeight: 600 }}>Colegio San Pío X <span style={{ color: K.orange }}>·</span> Bloom for Education</div>
    </AbsoluteFill>
  );
};

const Persistent: React.FC = () => {
  const g = useCurrentFrame();
  return (<><Header /><Funnel s={funnelState(g)} /><MiniClass /><Footer g={g} /></>);
};

export const Video2v1: React.FC = () => (
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
        <Audio src={staticFile(`audio/video2v1/${s.id}.mp3`)} trimBefore={Math.round(p.src0 * TL.fps)} trimAfter={Math.round(p.src1 * TL.fps)} />
      </Sequence>
    )))}
    <Sequence from={TL.total - END_CARD} durationInFrames={END_CARD} name="cierre"><EndCard /></Sequence>
  </AbsoluteFill>
);
