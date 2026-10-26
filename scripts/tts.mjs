// Narration into public/audio/<id>.mp3 (Tina, eleven_v4).  Usage: node scripts/tts.mjs [S01 ...]
import { writeFileSync, mkdirSync } from "node:fs";
import { ROOT, loadEnv, readJson, SRC, ids } from "./env.mjs";

const key = loadEnv().ELEVENLABS_API_KEY;
if (!key) throw new Error("ELEVENLABS_API_KEY missing");
const { voice, segments } = readJson(`${SRC}/narration.json`);
const only = ids();
mkdirSync(`${ROOT}/public/audio`, { recursive: true });
for (const seg of segments.filter((s) => !s.silent && (!only.length || only.includes(s.id)))) {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}?output_format=mp3_44100_128`, {
    method: "POST",
    headers: { "xi-api-key": key, "Content-Type": "application/json", Accept: "audio/mpeg" },
    body: JSON.stringify({ text: seg.tts ?? seg.text, model_id: "eleven_v4" }),
  });
  if (!res.ok) throw new Error(`${seg.id}: ${res.status} ${await res.text()}`);
  writeFileSync(`${ROOT}/public/audio/${seg.id}.mp3`, Buffer.from(await res.arrayBuffer()));
  console.log(seg.id, "ok");
}
