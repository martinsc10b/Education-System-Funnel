// Video 2 v1 pipeline («La brújula»). Audio in public/audio/video2v1/, data in src/video2v1/. Same steps as scripts/video1v6.mjs.
// Usage: node scripts/video2v1.mjs tts [V01 ...] | stt [V01 ...] | timeline | stills
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { ROOT, loadEnv, readJson, ids } from "./env.mjs";

const SRC = "src/video2v1", AUDIO = `${ROOT}/public/audio/video2v1`;
const FPS = 30;
const GAP = 0.3; // next scene's voice starts 0.3 s after this one ends
const PAD = 0.05; // kept around each voiced run
const MAX_PAUSE = 0.45, KEEP_PAUSE = 0.35; // internal pauses longer than MAX_PAUSE are shortened to KEEP_PAUSE
const END_HOLD = 1.5; // final card after the last word
const [cmd, ...only] = ids();
const segments = () => readJson(`${SRC}/narration.json`).segments.filter((s) => !only.length || only.includes(s.id));
const key = () => loadEnv().ELEVENLABS_API_KEY ?? (() => { throw new Error("ELEVENLABS_API_KEY missing"); })();

async function tts() {
  const { voice } = readJson(`${SRC}/narration.json`);
  mkdirSync(AUDIO, { recursive: true });
  for (const seg of segments()) {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}?output_format=mp3_44100_128`, {
      method: "POST",
      headers: { "xi-api-key": key(), "Content-Type": "application/json", Accept: "audio/mpeg" },
      body: JSON.stringify({ text: seg.tts ?? seg.text, model_id: "eleven_v4" }),
    });
    if (!res.ok) throw new Error(`${seg.id}: ${res.status} ${await res.text()}`);
    writeFileSync(`${AUDIO}/${seg.id}.mp3`, Buffer.from(await res.arrayBuffer()));
    console.log(seg.id, "ok");
  }
}

// Same normalisation and two-pointer alignment as scripts/stt.mjs: script spelling, Scribe timings.
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9ñ ]/g, " ").split(/\s+/).filter(Boolean).join(" ");
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

async function stt() {
  let out = {};
  try { out = readJson(`${SRC}/words.json`); } catch {}
  let diffs = 0;
  for (const seg of segments()) {
    const fd = new FormData();
    fd.append("model_id", "scribe_v1");
    fd.append("language_code", "spa");
    fd.append("file", new Blob([readFileSync(`${AUDIO}/${seg.id}.mp3`)], { type: "audio/mpeg" }), `${seg.id}.mp3`);
    const res = await fetch("https://api.elevenlabs.io/v1/speech-to-text", { method: "POST", headers: { "xi-api-key": key() }, body: fd });
    if (!res.ok) throw new Error(`${seg.id}: ${res.status} ${await res.text()}`);
    const j = await res.json();
    const script = seg.text.split(/\s+/).filter((t) => norm(t));
    out[seg.id] = align(script, j.words.filter((w) => w.type === "word"));
    const a = norm(seg.text).split(" "), b = norm(j.text).split(" ");
    const same = a.join(" ") === b.join(" ");
    if (!same) diffs++;
    console.log(`${seg.id} ${same ? "MATCH" : "DIFF"}${same ? "" : `\n  script: ${a.join(" ")}\n  heard:  ${b.join(" ")}`}`);
  }
  writeFileSync(`${ROOT}/${SRC}/words.json`, JSON.stringify(out, null, 1));
  console.log(diffs ? `${diffs} clip(s) differ from the script` : "all clips match the script");
}

// Voiced runs of a clip: [start, end] in seconds, from ffmpeg silencedetect at -40 dB.
const voiced = (file) => {
  const dur = Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]).toString());
  const log = spawnSync("ffmpeg", ["-hide_banner", "-i", file, "-af", "silencedetect=n=-40dB:d=0.1", "-f", "null", "-"], { encoding: "utf8" }).stderr;
  const sil = [];
  for (const m of log.matchAll(/silence_start: ([\d.]+)[\s\S]*?silence_end: ([\d.]+)/g)) sil.push([Number(m[1]), Number(m[2])]);
  if (/silence_start: [\d.]+\s*$/.test(log.trim()) || (log.match(/silence_start/g)?.length ?? 0) > sil.length) sil.push([Number([...log.matchAll(/silence_start: ([\d.]+)/g)].at(-1)[1]), dur]);
  const runs = [];
  let t = 0;
  for (const [s, e] of sil) { if (s > t) runs.push([t, s]); t = e; }
  if (t < dur) runs.push([t, dur]);
  // Runs under 0.1 s are breaths or clicks; treating them as silence keeps them from splitting one long pause in two.
  return runs.filter(([s, e]) => e - s >= 0.1);
};

function timeline() {
  const words = readJson(`${SRC}/words.json`);
  const all = readJson(`${SRC}/narration.json`).segments;
  let from = 0;
  const segs = all.map((seg, k) => {
    const runs = voiced(`${AUDIO}/${seg.id}.mp3`);
    const lost = (words[seg.id] ?? []).filter((w) => !runs.some(([s, e]) => w.end > s && w.start < e));
    if (lost.length) console.warn(`${seg.id}: words outside voiced audio: ${lost.map((w) => w.text).join(" ")}`);
    // Merge runs separated by short pauses; keep long pauses but shorten them to KEEP_PAUSE.
    const pieces = [];
    let out = 0;
    for (const [s, e] of runs) {
      const last = pieces.at(-1);
      if (last && s - last.src1 <= MAX_PAUSE) { last.src1 = e; continue; }
      if (last) { out = last.out0 + (last.src1 + PAD - last.src0) + Math.max(0, KEEP_PAUSE - 2 * PAD); }
      pieces.push({ src0: Math.max(0, s - PAD), src1: e, out0: out });
    }
    for (const p of pieces) p.src1 += PAD;
    const last = pieces.at(-1);
    const voice = last.out0 + (last.src1 - last.src0);
    const map = (t) => { const p = [...pieces].reverse().find((q) => t >= q.src0) ?? pieces[0]; return p.out0 + Math.min(Math.max(t - p.src0, 0), p.src1 - p.src0); };
    words[seg.id] = (words[seg.id] ?? []).map((w) => ({ text: w.text, start: +map(w.start).toFixed(3), end: +map(w.end).toFixed(3) }));
    const isLast = k === all.length - 1;
    // The voice span ends PAD after the last word, so the final hold is shortened to keep the end silence under END_HOLD.
    const dur = Math.round((voice + (isLast ? END_HOLD - 2 * PAD : GAP)) * FPS);
    const s = { id: seg.id, from, dur, voice: Math.round(voice * FPS), pieces: pieces.map((p) => ({ src0: +p.src0.toFixed(3), src1: +p.src1.toFixed(3), out0: +p.out0.toFixed(3) })) };
    from += dur;
    return s;
  });
  writeFileSync(`${ROOT}/${SRC}/timeline.json`, JSON.stringify({ fps: FPS, total: from, segments: segs }, null, 1));
  writeFileSync(`${ROOT}/${SRC}/captions.json`, JSON.stringify(words, null, 1));
  const shortened = segs.filter((s) => s.pieces.length > 1).map((s) => `${s.id}×${s.pieces.length - 1}`);
  console.log(`${(from / FPS).toFixed(1)} s`, segs.map((s) => `${s.id}:${(s.dur / FPS).toFixed(1)}`).join(" "));
  console.log("long pauses shortened:", shortened.join(" ") || "none");
}

// One still per scene to out/v2-stills/<id>.png, late in the scene so every element of the spec is on screen.
// --at=0.4 instead renders check frames at that fraction of each scene to out/check/ (not committed).
async function stills() {
  const { bundle } = await import("@remotion/bundler");
  const { renderStill, selectComposition } = await import("@remotion/renderer");
  const at = process.argv.find((a) => a.startsWith("--at="))?.slice(5);
  const dir = at ? `${ROOT}/out/check` : `${ROOT}/out/v2-stills`;
  const serveUrl = await bundle({ entryPoint: `${ROOT}/src/index.ts` });
  mkdirSync(dir, { recursive: true });
  const composition = await selectComposition({ serveUrl, id: "video-2-v1" });
  const AT = { W11: 0.85 }; // W11 late frames are under the end card
  for (const s of readJson(`${SRC}/timeline.json`).segments.filter((x) => !only.length || only.includes(x.id))) {
    const frame = s.from + Math.round(s.dur * (at ? Number(at) : AT[s.id] ?? 0.93));
    await renderStill({ composition, serveUrl, frame, output: `${dir}/${s.id}${at ? `-${at}` : ""}.png` });
    console.log(s.id, frame);
  }
  if (at) return;
  const end = composition.durationInFrames - 5;
  await renderStill({ composition, serveUrl, frame: end, output: `${ROOT}/out/v2-stills/W11-endcard.png` });
  console.log("W11-endcard", end);
}

await ({ tts, stt, timeline, stills }[cmd] ?? (() => { throw new Error(`unknown command ${cmd}`); }))();
