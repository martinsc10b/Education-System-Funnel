// Transcribes each clip with ElevenLabs Scribe, compares to the script, saves word timings to src/words.json.
// Caption words use the script's own spelling when the token counts line up; otherwise Scribe's.
import { readFileSync, writeFileSync } from "node:fs";
import { ROOT, loadEnv, readJson, SRC, ids } from "./env.mjs";

const key = loadEnv().ELEVENLABS_API_KEY;
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9ñ ]/g, " ").split(/\s+/).filter(Boolean).join(" ");
// Two-pointer alignment: script tokens take Scribe timings; mismatched runs ("noventa por ciento" vs "90%") share the run's time span.
const align = (script, heard) => {
  const eq = (a, b) => a && b && norm(a) === norm(b.text);
  const res = [];
  let i = 0, j = 0;
  while (i < script.length) {
    if (eq(script[i], heard[j])) { res.push({ text: script[i], start: heard[j].start, end: heard[j].end }); i++; j++; continue; }
    let best = null;
    for (let k = 1; k <= 8 && !best; k++) for (let a = 0; a <= k; a++) { const b = k - a; if (i + a >= script.length ? j + b >= heard.length : eq(script[i + a], heard[j + b])) { best = [a, b]; break; } }
    const [a, b] = best ?? [script.length - i, heard.length - j];
    const t0 = b ? heard[j].start : (heard[j - 1]?.end ?? 0), t1 = b ? heard[j + b - 1].end : (heard[j]?.start ?? t0);
    for (let x = 0; x < a; x++) res.push({ text: script[i + x], start: t0 + ((t1 - t0) * x) / a, end: t0 + ((t1 - t0) * (x + 1)) / a });
    i += a; j += b;
  }
  return res;
};
const only = ids();
let out = {};
try { out = readJson(`${SRC}/words.json`); } catch {}
for (const seg of readJson(`${SRC}/narration.json`).segments.filter((s) => !s.silent && (!only.length || only.includes(s.id)))) {
  const fd = new FormData();
  fd.append("model_id", "scribe_v1");
  fd.append("language_code", "spa");
  fd.append("file", new Blob([readFileSync(`${ROOT}/public/audio/${seg.id}.mp3`)], { type: "audio/mpeg" }), `${seg.id}.mp3`);
  const res = await fetch("https://api.elevenlabs.io/v1/speech-to-text", { method: "POST", headers: { "xi-api-key": key }, body: fd });
  if (!res.ok) throw new Error(`${seg.id}: ${res.status} ${await res.text()}`);
  const j = await res.json();
  const heard = j.words.filter((w) => w.type === "word");
  const script = seg.text.split(/\s+/).filter((t) => norm(t));
  out[seg.id] = align(script, heard);
  const aligned = true;
  const same = norm(seg.text) === norm(j.text);
  console.log(`${seg.id} ${same ? "MATCH" : "DIFF"} ${out[seg.id].length}/${script.length} words${same ? "" : `\n  script: ${norm(seg.text)}\n  heard:  ${norm(j.text)}`}`);
}
writeFileSync(`${ROOT}/${SRC}/words.json`, JSON.stringify(out, null, 1));
