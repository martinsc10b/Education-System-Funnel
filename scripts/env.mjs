// Reads the ElevenLabs key from ./.env, falling back to the Bloomie project's .env (never hardcoded).
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

export const ROOT = resolve(fileURLToPath(import.meta.url), "../..");
const ENV_FILES = [`${ROOT}/.env`, "C:/Users/ms/bloom/bloomie-origen/.env"];

export function loadEnv() {
  const path = ENV_FILES.find(existsSync);
  if (!path) return {};
  return Object.fromEntries(
    readFileSync(path, "utf8").split(/\r?\n/)
      .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
      .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]),
  );
}
export const readJson = (rel) => JSON.parse(readFileSync(`${ROOT}/${rel}`, "utf8"));
export const dirArg = () => process.argv.find((a) => a.startsWith("--dir="))?.slice(6) ?? "strategy";
// --set=video1 reads/writes src/video1/{narration,words,timeline}.json; default is the case video in src/.
export const SET = process.argv.find((a) => a.startsWith("--set="))?.slice(6);
export const SRC = SET ? `src/${SET}` : "src";
export const ids = () => process.argv.slice(2).filter((a) => !a.startsWith("--"));
