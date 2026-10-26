import { loadFont } from "@remotion/google-fonts/Inter";

export const SANS = loadFont("normal", { weights: ["400", "500", "600", "700", "800"], subsets: ["latin"] }).fontFamily;

// Brand: navy #002E5D (colegio, primary), orange #FF6A14 (negocio, accent), cyan #67D2DF (secondary).
export const C = {
  bg: "#F5F7F6",
  ink: "#13233A",
  muted: "#6B7A89",
  tile: "#D5DCE0",
  line: "#C3CDD3",
  card: "#FFFFFF",
  navy: "#002E5D",
  cyan: "#67D2DF",
  orange: "#FF6A14",
  down: "#002E5D",
  // Currículo drill-down: macro (light) → specific (dark).
  g1: "#A9DDB0",
  g2: "#3F9A55",
  g3: "#1F5E31",
};

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
export const mixHex = (a: string, b: string, t: number) => {
  const [x, y] = [hex(a), hex(b)];
  return "#" + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, "0")).join("");
};
// Down route: light cyan at layer 1 (Currículo), darkening to navy at layer 8 (Estudiante).
export const layerColor = (i: number) => mixHex(C.cyan, C.navy, (i - 1) / 7);

// Fixed geometry (1920×1080). Funnel, thread column (beside each bar) and stage never move.
export const G = {
  barY: (i: number) => 112 + (i - 1) * 96, // layer 1..8
  barH: 80,
  barW: (i: number) => 520 - (i - 1) * 34,
  funnelCx: 330,
  railX: 34,
  stageX: 940,
  stageW: 870,
  stageTop: 170,
  stageBottom: 900,
  threadGap: 16,
  threadW: 230,
};
export const barRight = (i: number) => G.funnelCx + G.barW(i) / 2;
export const threadX = (i: number) => barRight(i) + G.threadGap;
