// Video 1 v6 look: flat fills only (no arrows, lines or connectors). Movement is shown by fill color.
import { interpolate } from "remotion";
export { SANS } from "../shared/theme";
export { NAMES } from "../shared/stages";

export const K = {
  bg: "#FAFAF8",
  navy: "#002E5D",
  orange: "#FF6A14",
  gray: "#8A94A6",
  tile: "#ECEFF3",
  ink: "#13233A",
  wall: "#E8EEF3",
  floor: "#E4DACB",
  wood: "#C9A77F",
  skin: "#C98E6B",
  skin2: "#9C6B4E",
  hair: "#2B211C",
  carmen: "#F28C4B",
  bruno: "#DDE8F4",
  card: "#FFFFFF",
  soft: "#F1F4F7",
};

// Fixed geometry, 1920×1080. Left 30 % holds the eight stages; the right 70 % holds the scene.
export const L = {
  stageX: 64,
  stageW: 470,
  stageY: (i: number) => 150 + (i - 1) * 86, // i = 1..8
  stageH: 68,
  sceneX: 640,
  sceneW: 900,
  titleY: 132,
  bodyY: 262,
  mini: { x: 1556, y: 676, w: 300, scale: 300 / 900 },
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const fade = (f: number, at: number, dur = 9) => interpolate(f, [at, at + dur], [0, 1], clamp);
export const span = (f: number, a: number, b: number) => interpolate(f, [a, Math.max(b, a + 1)], [0, 1], clamp);
