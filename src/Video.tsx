import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C } from "./theme";
import { makeCue, Seg, Word } from "./kit";
import { Captions, Chrome } from "./chrome";
import { SCENES as S01 } from "./part01";
import { SCENES234 } from "./part234";

const SCENES = { ...S01, ...SCENES234 };
import timeline from "./timeline.json";
import words from "./words.json";

const TL = timeline as { fps: number; rate: number; total: number; segments: Seg[] };
const W = words as unknown as Record<string, Word[]>;

export const partSegs = (part: number) => TL.segments.filter((s) => s.part === part);
export const partLength = (part: number) => partSegs(part).reduce((a, s) => a + s.dur, 0);

const StageFade: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: interpolate(f, [0, 8, dur - 8, dur], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>{children}</AbsoluteFill>;
};

const Segment: React.FC<{ seg: Seg }> = ({ seg }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cue = makeCue(seg, W[seg.id], fps, TL.rate);
  const spec = SCENES[seg.id];
  const Stage = spec.Stage;
  return (
    <AbsoluteFill>
      <Chrome s={spec.chrome(f, cue, seg)} g={seg.from + f} />
      <StageFade dur={seg.dur}><Stage seg={seg} cue={cue} /></StageFade>
      <Captions seg={seg} words={W[seg.id]} rate={TL.rate} />
      {seg.audio > 0 && <Sequence from={seg.audioFrom}><Audio src={staticFile(`audio/${seg.id}.mp3`)} playbackRate={TL.rate} /></Sequence>}
    </AbsoluteFill>
  );
};

// One Part = its scenes back to back. Each Part is also its own composition.
export const Part: React.FC<{ part: number }> = ({ part }) => {
  const segs = partSegs(part);
  const start = segs[0]?.from ?? 0;
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {segs.map((s) => (
        <Sequence key={s.id} from={s.from - start} durationInFrames={s.dur} name={s.id}><Segment seg={s} /></Sequence>
      ))}
    </AbsoluteFill>
  );
};

// Main video: the Parts in order (only Parts built so far are included).
export const BUILT_PARTS = [0, 1, 2, 3, 4];
export const Main: React.FC<{ parts?: number[] }> = ({ parts = BUILT_PARTS }) => {
  let at = 0;
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {parts.map((p) => {
        const from = at;
        at += partLength(p);
        return <Sequence key={p} from={from} durationInFrames={partLength(p)} name={`Parte ${p}`}><Part part={p} /></Sequence>;
      })}
    </AbsoluteFill>
  );
};
