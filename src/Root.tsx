import React from "react";
import { Composition } from "remotion";
import { BUILT_PARTS, Main, Part, partLength } from "./Video";
import { Video1, VIDEO1_LENGTH } from "./video1/Video1";

const V = { fps: 30, width: 1920, height: 1080 } as const;
const total = (parts: number[]) => parts.reduce((a, p) => a + partLength(p), 0);

export const Root: React.FC = () => (
  <>
    {/* Video 1 · El mapa (new two-video series). Video 2 and the combined cut get registered once Video 2 is approved. */}
    <Composition id="video-1-mapa" component={Video1} durationInFrames={VIDEO1_LENGTH} {...V} />
    <Composition id="la-vena" component={Main} durationInFrames={total(BUILT_PARTS)} {...V} />
    <Composition id="la-vena-p01" component={Main} defaultProps={{ parts: [0, 1] }} durationInFrames={total([0, 1])} {...V} />
    {BUILT_PARTS.map((p) => (
      <Composition key={p} id={`la-vena-parte-${p}`} component={() => <Part part={p} />} durationInFrames={partLength(p)} {...V} />
    ))}
  </>
);
