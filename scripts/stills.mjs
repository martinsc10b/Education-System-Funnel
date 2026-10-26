// Renders check frames for each segment of a composition to out/stills/<id>-<n>.png.
// Usage: node scripts/stills.mjs [compId] [fractions, e.g. 0.3,0.6,0.97] [segIds...]
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { mkdirSync } from "node:fs";
import { ROOT, readJson, SRC, ids } from "./env.mjs";

const [comp = "la-vena-p01", fr = "0.35,0.7,0.97", ...only] = ids();
const serveUrl = await bundle({ entryPoint: `${ROOT}/src/index.ts` });
mkdirSync(`${ROOT}/out/stills`, { recursive: true });
const composition = await selectComposition({ serveUrl, id: comp });
const segs = readJson(`${SRC}/timeline.json`).segments;
const start = segs[0].from;
for (const s of segs.filter((x) => !only.length || only.includes(x.id))) {
  for (const [n, q] of fr.split(",").map(Number).entries()) {
    const frame = Math.min(composition.durationInFrames - 1, s.from - start + Math.round(s.dur * q));
    await renderStill({ composition, serveUrl, frame, output: `${ROOT}/out/stills/${s.id}-${n}.png`, scale: 0.5 });
  }
  console.log(s.id);
}
