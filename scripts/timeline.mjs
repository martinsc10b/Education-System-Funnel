// Measures each clip with ffprobe and writes src/timeline.json (30 fps). Silent segments use their fixed length.
// Each segment gets a lead-in before the voice and a tail after it.
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { ROOT, readJson, SRC, ids } from "./env.mjs";

const FPS = 30, LEAD = 20, TAIL = 45, RATE = 1;
let from = 0;
const segs = readJson(`${SRC}/narration.json`).segments.map((seg) => {
  let s;
  if (seg.silent) s = { id: seg.id, part: seg.part, from, dur: seg.silent, audioFrom: 0, audio: 0 };
  else {
    const sec = Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", `${ROOT}/public/audio/${seg.id}.mp3`]).toString());
    const audio = Math.ceil((sec * FPS) / RATE);
    s = { id: seg.id, part: seg.part, from, dur: LEAD + audio + TAIL + (seg.extraTail ?? 0), audioFrom: LEAD, audio };
  }
  from += s.dur;
  return s;
});
writeFileSync(`${ROOT}/${SRC}/timeline.json`, JSON.stringify({ fps: FPS, rate: RATE, total: from, segments: segs }, null, 1));
console.log(`${(from / FPS / 60).toFixed(2)} min`, segs.map((s) => `${s.id}:${(s.dur / FPS).toFixed(1)}`).join(" "));
