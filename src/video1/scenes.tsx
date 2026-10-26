// Video 1 · El mapa: del Currículo Nacional a una clase, y de vuelta. No school data except the bridge label in Scene 5.
import React from "react";
import { useCurrentFrame } from "remotion";
import { C, SANS, layerColor as lc, mixHex } from "../shared/theme";
import { FICHAS, NAMES, STAGES } from "../shared/stages";
import { StageCard } from "../shared/StageCard";
import { MiniMap } from "../shared/MiniMap";
import { Cue, isLight, lerp, ramp, Reveal, SceneProps, Seg } from "../kit";
import { ChromeState, FlyChip, slotCenter } from "../chrome";

export type SceneSpec = { Stage: React.FC<SceneProps>; chrome: (f: number, cue: Cue, seg: Seg) => ChromeState };

const O = C.orange;
const FLY = 34;
const ALL = [1, 2, 3, 4, 5, 6, 7, 8];
const txt = (size: number, weight = 600, color: string = C.ink): React.CSSProperties => ({ fontFamily: SANS, fontSize: size, fontWeight: weight, color, lineHeight: 1.2 });
const abs = (x: number, y: number, w?: number, h?: number): React.CSSProperties => ({ position: "absolute", left: x, top: y, width: w, height: h, boxSizing: "border-box" });
const TITLE = <>El mapa <span style={{ color: C.muted, fontWeight: 600 }}>· del Currículo Nacional a una clase, y de vuelta</span></>;

const base = (over: Partial<ChromeState>): ChromeState => ({
  funnel: 1, barColor: lc, active: null, activeT: 0, visited: [], glows: [], chips: [],
  rail: { mode: "none", from: C.cyan, to: C.navy }, header: "Video 1", ficticios: false,
  names: NAMES, threads: FICHAS, title: TITLE, ...over,
});

// ───────── Escena 0 · La pregunta ─────────
const M00: SceneSpec = {
  Stage: ({ cue }) => {
    const f = useCurrentFrame();
    const tL = ramp(f, cue("largo"), 40);
    return (
      <>
        <div style={{ ...abs(160, 360, 1600), textAlign: "center" }}>
          <Reveal at={12}><div style={txt(72, 800, C.navy)}>¿Cómo llega una norma nacional a una clase?</div></Reveal>
        </div>
        <div style={{ ...abs(460, 600, 1000), display: "flex", alignItems: "center", gap: 20, opacity: ramp(f, cue("norma"), 12) }}>
          <span style={txt(26, 700)}>Currículo Nacional</span>
          <svg width={560} height={10} style={{ flex: 1 }}><line x1={0} y1={5} x2={560 * tL} y2={5} stroke={C.muted} strokeWidth={3} strokeDasharray="4 10" strokeLinecap="round" /></svg>
          <span style={{ ...txt(26, 700), opacity: tL }}>una clase</span>
        </div>
      </>
    );
  },
  chrome: () => base({ funnel: 0, title: TITLE }),
};

// ───────── Escena 1 · Un sistema hecho de sistemas ─────────
const SUBS: { n: string; x: number; y: number; cue: string }[] = [
  { n: "Liderazgo y gestión", x: 960, y: 300, cue: "liderazgo" },
  { n: "Bienestar y convivencia", x: 735, y: 650, cue: "bienestar" },
  { n: "Condiciones operativas", x: 1185, y: 650, cue: "condiciones" },
];
const M01: SceneSpec = {
  Stage: ({ cue, seg }) => {
    const f = useCurrentFrame();
    const tN = ramp(f, cue("necesitan"), 16), tH = ramp(f, cue("Hoy"), 18);
    const end = seg.dur - 26, tM = ramp(f, end, 24); // E&A flies to where the funnel will appear
    const ea = { x: lerp(960, 330, tM), y: lerp(540, 480, tM) };
    const pts = [...SUBS.map((s) => [s.x, s.y]), [960, 540]];
    return (
      <>
        <div style={{ ...abs(960 - 400, 540 - 400, 800, 800), borderRadius: "50%", border: `3px solid ${C.line}`, background: "#fff", opacity: ramp(f, cue("colegio"), 14) * (1 - tM) }} />
        <div style={{ ...abs(810, 92, 300), textAlign: "center", opacity: ramp(f, cue("colegio"), 14) * (1 - tH), ...txt(30, 800, C.muted) }}>Colegio</div>
        <svg style={abs(0, 0, 1920, 1080)} width={1920} height={1080}>
          {pts.flatMap((a, i) => pts.slice(i + 1).map((b, j) => <line key={`${i}-${j}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={C.muted} strokeWidth={2} opacity={0.6 * tN * (1 - 0.7 * tH) * (1 - tM)} />))}
        </svg>
        {SUBS.map((s) => (
          <div key={s.n} style={{ ...abs(s.x - 115, s.y - 115, 230, 230), borderRadius: "50%", background: mixHex("#FFFFFF", C.tile, 0.8), display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 24, opacity: ramp(f, cue(s.cue), 12) * (1 - 0.8 * tH) * (1 - tM), ...txt(23, 700) }}>{s.n}</div>
        ))}
        <div style={{ ...abs(ea.x - 130, ea.y - 130, 260, 260), borderRadius: "50%", background: C.navy, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 28, transform: `scale(${(1 + 0.25 * tH) * (1 - 0.6 * tM)})`, opacity: ramp(f, cue("centro"), 12) * (1 - tM), ...txt(26, 800, "#fff") }}>Enseñanza y aprendizaje</div>
      </>
    );
  },
  chrome: () => base({ funnel: 0 }),
};

// ───────── Escena 2 · El embudo ─────────
const M02: SceneSpec = {
  Stage: ({ cue }) => {
    const f = useCurrentFrame();
    return (
      <>
        <div style={{ ...abs(230, 80, 200), textAlign: "center", opacity: ramp(f, cue("Arriba"), 12), ...txt(20, 800, C.navy) }}>Todo el país</div>
        <div style={{ ...abs(230, 872, 200), textAlign: "center", opacity: ramp(f, cue("Abajo"), 12), ...txt(20, 800, C.navy) }}>Un estudiante</div>
        <Reveal at={cue("Cada")} style={{ ...abs(940, 430, 870) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, ...txt(28, 700) }}>
            <span style={{ padding: "14px 24px", borderRadius: 999, background: `${C.cyan}55` }}>Recibe</span>
            <span style={{ color: C.muted }}>→</span>
            <span style={{ padding: "20px 34px", borderRadius: 16, background: C.navy, color: "#fff" }}>Etapa</span>
            <span style={{ color: C.muted }}>→</span>
            <span style={{ padding: "14px 24px", borderRadius: 999, background: `${C.cyan}55` }}>Entrega</span>
          </div>
        </Reveal>
      </>
    );
  },
  chrome: (f) => base({ funnel: ramp(f, 0, 24) }),
};

// ───────── Escena 3 · Bajada: ocho tiempos ─────────
const Tiles: React.FC<{ items: [string, number][]; color: string }> = ({ items, color }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ display: "flex", gap: 18, height: "100%", alignItems: "center" }}>
      {items.map(([t, at]) => {
        const r = ramp(f, at, 12);
        return <div key={t} style={{ flex: 1, height: 170, borderRadius: 18, background: mixHex("#FFFFFF", color, 0.85 * r), opacity: 0.25 + 0.75 * r, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 16, ...txt(30, 800, r > 0.5 && !isLight(color) ? "#fff" : C.ink) }}>{t}</div>;
      })}
    </div>
  );
};
const Weeks: React.FC<{ n: number; brace?: [number, number]; braceAt?: number; color: string; connAt: number }> = ({ n, brace, braceAt = 0, color, connAt }) => {
  const f = useCurrentFrame();
  const step = 870 / n, w = step - 18;
  return (
    <div style={{ position: "relative", height: "100%" }}>
      {Array.from({ length: n }, (_, i) => (
        <React.Fragment key={i}>
          <div style={{ ...abs(i * step, 110, w, 70), borderRadius: 10, background: brace && i >= brace[0] && i <= brace[1] ? mixHex(C.tile, color, 0.35 * ramp(f, braceAt, 12)) : C.tile, opacity: ramp(f, i * 2, 8) }} />
          {i < n - 1 && <div style={{ ...abs(i * step + w, 128, 18), textAlign: "center", opacity: ramp(f, connAt, 12), ...txt(26, 800, C.muted) }}>›</div>}
        </React.Fragment>
      ))}
      {brace && (
        <div style={{ ...abs(brace[0] * step, 60, (brace[1] - brace[0]) * step + w), opacity: ramp(f, braceAt, 12) }}>
          <div style={{ height: 22, borderTop: `4px solid ${C.navy}`, borderLeft: `4px solid ${C.navy}`, borderRight: `4px solid ${C.navy}`, borderRadius: "6px 6px 0 0" }} />
        </div>
      )}
    </div>
  );
};
const Notebook: React.FC<{ color: string }> = ({ color }) => (
  <svg width={870} height={300} viewBox="0 0 870 300">
    <rect x={185} y={30} width={240} height={250} rx={10} fill="#fff" stroke={color} strokeWidth={4} />
    <rect x={445} y={30} width={240} height={250} rx={10} fill="#fff" stroke={color} strokeWidth={4} />
    <line x1={435} y1={30} x2={435} y2={280} stroke={color} strokeWidth={6} />
    {[0, 1, 2, 3, 4, 5, 6].flatMap((l) => [210, 470].map((x) => <rect key={`${x}-${l}`} x={x} y={62 + l * 30} width={190 - ((l * 37) % 60)} height={10} rx={5} fill={C.tile} />))}
  </svg>
);
const Silhouette: React.FC<{ color: string }> = ({ color }) => (
  <svg width={870} height={300} viewBox="0 0 870 300">
    <circle cx={435} cy={90} r={56} fill={color} />
    <path d="M 335 290 Q 335 168 435 168 Q 535 168 535 290 Z" fill={color} />
  </svg>
);
// Stage 7 receives three inputs: chips from stages 4, 5 and 6 fly in and line up inside the card.
const ThreeInputs: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  return (
    <>
      {[4, 5, 6].map((k, i) => {
        const t = ramp(f, at + i * 8, FLY);
        const to: [number, number] = [940 + 145 + i * 290, 300 + 150];
        const [sx, sy] = slotCenter(k);
        return t >= 1 ? (
          <div key={k} style={{ ...abs(to[0] - 120, to[1] - 40, 240, 80), borderRadius: 12, background: lc(k), color: isLight(lc(k)) ? C.ink : "#fff", display: "flex", alignItems: "center", justifyContent: "center", ...txt(22, 800, isLight(lc(k)) ? C.ink : "#fff") }}>{FICHAS[k - 1]}</div>
        ) : <FlyChip key={k} from={[sx, sy]} to={to} t={t} label={FICHAS[k - 1]} color={lc(k)} s0={1} />;
      })}
      <div style={{ ...abs(940, 300 + 220, 870), textAlign: "center", opacity: ramp(f, at + 40, 12), ...txt(22, 700, C.muted) }}>tres entradas: programación · unidad · cuaderno</div>
    </>
  );
};

const CARD_Y = 150;
const stageScene = (k: number, visual: (cue: Cue, col: string) => React.ReactNode, entregaCue: (cue: Cue) => number): SceneSpec => ({
  Stage: ({ cue }) => {
    const f = useCurrentFrame();
    const col = lc(k);
    const eAt = entregaCue(cue);
    return (
      <>
        <div style={abs(940, CARD_Y)}>
          <StageCard stage={STAGES[k - 1]} at={6} entregaAt={eAt}>{visual(cue, col)}</StageCard>
        </div>
        <FlyChip from={[1375, 820]} to={slotCenter(k)} t={ramp(f, eAt, FLY)} label={FICHAS[k - 1]} color={col} />
      </>
    );
  },
  chrome: (f, cue) => {
    const h = entregaCue(cue);
    return base({
      active: k, activeT: ramp(f, 0, 14), visited: ALL.filter((l) => l < k),
      chips: [...ALL.filter((l) => l < k).map((l) => ({ layer: l, t: 1, color: lc(l) })), { layer: k, t: ramp(f, h + FLY - 3, 4), color: lc(k) }],
      glows: k < 8 ? [{ layer: k + 1, a: 0.7 * Math.max(0, Math.sin((Math.PI * (f - h - FLY)) / 40)) * (f > h + FLY && f < h + FLY + 40 ? 1 : 0), color: lc(k + 1) }] : [],
      rail: { mode: "down", from: C.cyan, to: C.navy }, route: { label: "▼ Bajada · Decisiones", color: C.navy },
    });
  },
});
const E = (c: Cue) => c("Entrega");
const M31 = stageScene(1, (cue, col) => <Tiles color={col} items={[["Competencias", cue("competencias")], ["Capacidades", cue("capacidades")], ["Estándares", cue("estándares")]]} />, E);
const M32 = stageScene(2, (cue, col) => <Tiles color={col} items={[["Quiénes somos", cue("quiénes")], ["Dónde estamos", cue("dónde")], ["A dónde vamos", cue("dónde", 1)]]} />, E);
const M33 = stageScene(3, (cue, col) => <Tiles color={col} items={[["Horas", cue("horas")], ["Método", cue("método")], ["Evaluación", cue("evaluar")]]} />, E);
const M34 = stageScene(4, (cue, col) => <Weeks n={12} color={col} connAt={cue("reparte")} />, E);
const M35 = stageScene(5, (cue, col) => (
  <>
    <Weeks n={12} brace={[3, 7]} braceAt={cue("agrupa")} color={col} connAt={0} />
    <div style={{ ...abs(870 / 12 * 3, 210, 870 / 12 * 5 - 18, 74), borderRadius: 14, background: col, display: "flex", alignItems: "center", justifyContent: "center", ...txt(28, 800, isLight(col) ? C.ink : "#fff") }}>Criterios</div>
  </>
), E);
const M36 = stageScene(6, (_cue, col) => <Notebook color={col} />, E);
const M37: SceneSpec = (() => {
  const s = stageScene(7, () => null, (c) => c("propone"));
  return { ...s, Stage: (p) => (<><s.Stage {...p} /><ThreeInputs at={p.cue("une")} /></>) };
})();
const M38 = stageScene(8, (_cue, col) => <Silhouette color={col} />, (c) => c("evidencia"));

// ───────── Escena 4 · Subida: la evidencia ─────────
const FLIP: [number, (c: Cue) => number][] = [
  [8, (c) => c("sube")], [7, (c) => c("docente")], [6, (c) => c("coordinación")], [5, (c) => c("coordinación") + 14],
  [4, (c) => c("programación")], [3, (c) => c("PCI")], [2, (c) => c("PEI")], [1, (c) => c("Currículo")],
];
const ROWS: [string, string, string, string][] = [
  ["Docente", "Cada clase", "Mira la evidencia y reenseña", "docente"],
  ["Coordinación", "Cada mes", "Compara secciones", "coordinación"],
  ["Colegio", "Cada mes", "Revisa materiales", "colegio"],
  ["Equipo directivo", "Julio y diciembre", "Ajusta programación, PCI y PEI", "equipo"],
];
const M04: SceneSpec = {
  Stage: ({ cue }) => {
    const f = useCurrentFrame();
    const cell = (s: string, w: number, st: React.CSSProperties = {}) => <div style={{ width: w, padding: "16px 20px", ...txt(24, 600), ...st }}>{s}</div>;
    return (
      <>
        <div style={{ ...abs(940, 150, 870), background: "#fff", borderRadius: 18, boxShadow: "0 10px 30px rgba(19,35,58,0.10)", overflow: "hidden" }}>
          <Reveal at={cue("docente") - 10}><div style={{ display: "flex", background: O }}>{cell("Quién", 250, { color: "#fff", fontWeight: 800 })}{cell("Cuándo", 230, { color: "#fff", fontWeight: 800 })}{cell("Qué hace", 390, { color: "#fff", fontWeight: 800 })}</div></Reveal>
          {ROWS.map(([a, b, c, w]) => (
            <Reveal key={a} at={cue(w)}>
              <div style={{ display: "flex", borderTop: `1px solid ${C.tile}` }}>{cell(a, 250, { fontWeight: 800 })}{cell(b, 230, { color: C.muted })}{cell(c, 390)}</div>
            </Reveal>
          ))}
        </div>
        <Reveal at={cue("Currículo")} style={abs(940, 640, 870)}>
          <div style={txt(38, 800, C.navy)}>Las decisiones bajan. <span style={{ color: O }}>La evidencia sube.</span></div>
        </Reveal>
      </>
    );
  },
  chrome: (f, cue) => {
    const at = FLIP.map(([l, c]) => [l, c(cue)] as const);
    const done = at.filter(([, a]) => f >= a);
    const cur = done.length ? done[done.length - 1] : null;
    const both = f >= cue("Currículo");
    return base({
      barColor: () => O, active: cur ? cur[0] : null, activeT: cur ? ramp(f, cur[1], 12) : 0, visited: done.slice(0, -1).map(([l]) => l),
      chips: ALL.map((l) => { const a = at.find(([x]) => x === l)![1]; return { layer: l, t: 1, color: mixHex(lc(l), O, ramp(f, a, 12)) }; }),
      rail: both ? { mode: "down", from: C.cyan, to: C.navy, dx: -14 } : { mode: "up", from: O, to: O },
      rail2: both ? { mode: "up", from: O, to: O, dx: 14 } : undefined,
      route: { label: both ? "▼ Decisiones · ▲ Evidencia" : "▲ Subida · Evidencia", color: O },
    });
  },
};

// ───────── Escena 5 · El puente al Video 2 ─────────
const M05: SceneSpec = {
  Stage: ({ cue }) => {
    const f = useCurrentFrame();
    const tS = ramp(f, 4, 30);
    return (
      <>
        <MiniMap t={tS} lit={7} litT={ramp(f, cue("clase"), 14)} label="Álgebra · 4.° · semana 26" />
        <div style={{ ...abs(560, 420, 1000), textAlign: "center" }}>
          <Reveal at={cue("Álgebra")}><div style={txt(30, 700, C.muted)}>Video 2</div></Reveal>
          <Reveal at={cue("Álgebra") + 8}><div style={{ ...txt(64, 800, C.navy), marginTop: 8 }}>Una clase real</div></Reveal>
        </div>
      </>
    );
  },
  chrome: (f) => base({ funnel: 1 - ramp(f, 0, 16) }),
};

export const SCENES1: Record<string, SceneSpec> = { M00, M01, M02, M31, M32, M33, M34, M35, M36, M37, M38, M04, M05 };
