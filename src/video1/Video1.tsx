import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C } from "../shared/theme";
import { makeCue, Seg, Word } from "../kit";
import { Captions, Chrome } from "../chrome";
import { SCENES1 } from "./scenes";
import timeline from "./timeline.json";
import words from "./words.json";

const TL = timeline as { fps: number; rate: number; total: number; segments: Seg[] };
const W = words as unknown as Record<string, Word[]>;
export const VIDEO1_LENGTH = TL.total;

const StageFade: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: interpolate(f, [0, 8, dur - 8, dur], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>{children}</AbsoluteFill>;
};

const Segment: React.FC<{ seg: Seg }> = ({ seg }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cue = makeCue(seg, W[seg.id], fps, TL.rate);
  const spec = SCENES1[seg.id];
  const Stage = spec.Stage;
  return (
    <AbsoluteFill>
      <Chrome s={spec.chrome(f, cue, seg)} g={seg.from + f} />
      <StageFade dur={seg.dur}><Stage seg={seg} cue={cue} /></StageFade>
      <Captions seg={seg} words={W[seg.id]} rate={TL.rate} />
      <Sequence from={seg.audioFrom}><Audio src={staticFile(`audio/${seg.id}.mp3`)} playbackRate={TL.rate} /></Sequence>
    </AbsoluteFill>
  );
};

// Video 1 · El mapa. The last segment (M05) is the bridge into Video 2.
export const Video1: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    {TL.segments.map((s) => (
      <Sequence key={s.id} from={s.from} durationInFrames={s.dur} name={s.id}><Segment seg={s} /></Sequence>
    ))}
  </AbsoluteFill>
);
