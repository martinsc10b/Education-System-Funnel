// Video 2 v1 look (copied from Video 1 v6): flat fills only, no arrows, lines or connectors. Cyan marks movement.
import { interpolate } from "remotion";
export { SANS } from "../shared/theme";

export const K = {
  bg: "#FAFAF8",
  navy: "#002E5D",
  orange: "#FF6A14",
  cyan: "#67D2DF",
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

// Fixed geometry, 1920×1080. The funnel fills the left 40 %; scenes are laid out in a 900-wide box at sceneX
// and scaled by scene.s around (sceneX, scene.oy), then shifted by scene.dx, so they land at x ≈ 810–1620.
export const L = {
  sceneX: 640,
  scene: { s: 0.9, oy: 120, dx: 170 },
  sceneW: 900,
  titleY: 132,
  bodyY: 262,
  mini: { x: 1652, y: 792, w: 228, scale: 228 / 900 },
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const fade = (f: number, at: number, dur = 9) => interpolate(f, [at, at + dur], [0, 1], clamp);
export const span = (f: number, a: number, b: number) => interpolate(f, [a, Math.max(b, a + 1)], [0, 1], clamp);
