// Part 0 (opening) and Part 1 (hacia abajo): Scenes 0–8 plus the transition into the scenarios. Narration v4.
import React from "react";
import { useCurrentFrame } from "remotion";
import { C, SANS, layerColor as lc, mixHex } from "./theme";
import { Cue, DocCard, isLight, lerp, Pill, ramp, Reveal, SceneProps, Seg, tileStyle } from "./kit";
import { ChromeState, Entrada, FlyChip, LAYERS, miniPt, PanoCard, slotCenter, threadOf } from "./chrome";

export type SceneSpec = { Stage: React.FC<SceneProps>; chrome: (f: number, cue: Cue, seg: Seg) => ChromeState };

const FLY = 34;
const pulse = (f: number, at: number, dur: number) => (f < at || f > at + dur ? 0 : Math.sin((Math.PI * (f - at)) / dur));
const txt = (size: number, weight = 600, color: string = C.ink): React.CSSProperties => ({ fontFamily: SANS, fontSize: size, fontWeight: weight, color, lineHeight: 1.2 });
const abs = (x: number, y: number, w?: number, h?: number): React.CSSProperties => ({ position: "absolute", left: x, top: y, width: w, height: h, boxSizing: "border-box" });
const on = (c: string) => (isLight(c) ? C.ink : "#fff");

// Shared chrome for a Part 1 layer scene: layer k active, 1..k-1 visited, its output chip lands at hiloAt + FLY.
const down = (k: number, hilo?: (cue: Cue) => number) => (f: number, cue: Cue): ChromeState => {
  const h = hilo?.(cue);
  return {
    funnel: 1, barColor: lc, active: k, activeT: ramp(f, 0, 14),
    visited: Array.from({ length: k - 1 }, (_, i) => i + 1),
    glows: h !== undefined && k < 8 ? [{ layer: k + 1, a: 0.8 * pulse(f, h + FLY - 4, 40), color: lc(k + 1) }] : [],
    chips: [
      ...Array.from({ length: k - 1 }, (_, i) => ({ layer: i + 1, t: 1, color: lc(i + 1) })),
      ...(h !== undefined ? [{ layer: k, t: ramp(f, h + FLY - 3, 4), color: lc(k) }] : []),
    ],
    rail: { mode: "down", from: C.cyan, to: C.navy },
    header: "Parte 1 · Hacia abajo",
    route: { label: "▼ Hacia abajo · Decisiones", color: C.navy },
    ficticios: false,
  };
};

// The lit item shrinks into its output chip and flies into the thread beside the funnel.
const Hilo: React.FC<{ at: number; from: [number, number]; layer: number }> = ({ at, from, layer }) => {
  const f = useCurrentFrame();
  return <FlyChip from={from} to={slotCenter(layer)} t={ramp(f, at, FLY)} label={threadOf(layer)} color={lc(layer)} />;
};

// ───────── Scene 0 · Una clase ─────────
const S00: SceneSpec = {
  Stage: ({ cue }) => (
    <div style={abs(940, 230, 900)}>
      <Reveal at={14}><div style={txt(60, 800, C.navy)}>Una clase, un estudiante,<br />todo el sistema</div></Reveal>
      <Reveal at={cue("Queremos")}><div style={{ ...txt(30, 600), marginTop: 30 }}>¿Cómo impacta el logro de aprendizaje de una clase en todo el sistema?</div></Reveal>
      <Reveal at={cue("Cada")}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 40, ...txt(22, 700) }}>
          <span style={{ padding: "10px 18px", borderRadius: 999, background: `${C.cyan}55` }}>Recibe (input)</span>
          <span style={{ color: C.muted }}>→</span>
          <span style={{ padding: "14px 26px", borderRadius: 14, background: C.navy, color: "#fff" }}>Etapa</span>
          <span style={{ color: C.muted }}>→</span>
          <span style={{ padding: "10px 18px", borderRadius: 999, background: `${C.cyan}55` }}>Entrega (output)</span>
        </div>
      </Reveal>
    </div>
  ),
  chrome: (f, cue) => ({
    funnel: ramp(f, 0, 30), barColor: lc, active: null, activeT: 0, visited: [],
    glows: [{ layer: 8, a: ramp(f, cue("estudiante"), 24) * (0.85 + 0.15 * Math.sin(f / 9)), color: C.navy }],
    chips: [], rail: { mode: f >= cue("Primero") ? "down" : "none", from: C.cyan, to: C.navy }, header: "", ficticios: false,
  }),
};

// ───────── Scene 1 · Currículo Nacional ─────────
// Area grouping of the 31 CNEB competencies (counts sum to 31). Only Matemática's four get names.
const AREAS: [string, number][] = [
  ["Comunicación", 3], ["Castellano como segunda lengua", 3], ["Inglés como lengua extranjera", 3], ["Arte y Cultura", 2],
  ["Ciencias Sociales", 3], ["Matemática", 4], ["Ciencia y Tecnología", 3], ["Desarrollo Personal, Ciudadanía y Cívica", 2],
  ["Educación Física", 3], ["Educación para el Trabajo", 1], ["Educación Religiosa", 2], ["Competencias transversales", 2],
];
const MATH = ["Resuelve problemas de cantidad", "Resuelve problemas de regularidad, equivalencia y cambio", "Resuelve problemas de forma, movimiento y localización", "Resuelve problemas de gestión de datos e incertidumbre"];
const GY = 96; // grid top inside the panorama
const gRect = (i: number) => ({ x: (i % 4) * 220, y: GY + Math.floor(i / 4) * 166, w: 205, h: 152 });
const ZY = 60, ZH = 540; // zoomed Matemática box
const MATH_TILES = [[0, 50], [450, 50], [0, 300], [450, 300]];

// Breadcrumb that keeps the 31 in view: 31 competencias → Matemática · 4 → 1 competencia → 4 capacidades.
export const Crumbs: React.FC<{ steps: { at: number; label: string; color: string }[] }> = ({ steps }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ ...abs(0, 0, 870), display: "flex", alignItems: "center", gap: 8 }}>
      {steps.map((s, i) => {
        const t = ramp(f, s.at, 12);
        return (
          <React.Fragment key={i}>
            {i > 0 && <span style={{ ...txt(20, 700, C.muted), opacity: t }}>→</span>}
            <span style={{ opacity: t, padding: "7px 14px", borderRadius: 999, background: s.color, ...txt(18, 800, on(s.color)), whiteSpace: "nowrap" }}>{s.label}</span>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export const CnebPano: React.FC<{ tRing: number; tGrid: number; tZoom: number; tFoco: number; tTag: number; gridAt: number; crumbs?: React.ReactNode; focoColor?: string; markColor?: string; tagText?: string }> = ({ tRing, tGrid, tZoom, tFoco, tTag, gridAt, crumbs, focoColor = C.g2, markColor, tagText = "Esta clase de Álgebra" }) => {
  const f = useCurrentFrame();
  const m = gRect(5);
  const sc = lerp(m.w / 870, 1, tZoom);
  return (
    <div style={{ position: "relative", width: 870, height: 600 }}>
      {crumbs}
      {/* Perfil de egreso: ring of 11 */}
      <div style={{ ...abs(0, 0, 870, 600), opacity: tRing * (1 - tGrid), transform: `scale(${1 + 0.6 * tGrid})` }}>
        {Array.from({ length: 11 }, (_, i) => {
          const a = (i / 11) * Math.PI * 2 - Math.PI / 2;
          return <div key={i} style={{ ...abs(435 + Math.cos(a) * 200 - 28, 320 + Math.sin(a) * 200 - 28, 56, 56), borderRadius: 14, background: C.tile }} />;
        })}
        <div style={{ ...abs(255, 270, 360), textAlign: "center" }}>
          <div style={txt(32, 800)}>Perfil de egreso</div>
          <div style={{ ...txt(19, 500, C.muted), marginTop: 10 }}>lo que debe haber logrado un estudiante al terminar 5.° de secundaria</div>
        </div>
      </div>
      {/* 31 competencies by area, Matemática already marked */}
      <div style={{ ...abs(0, 56, 870), opacity: ramp(f, gridAt, 12) * (1 - tZoom), ...txt(22, 800) }}>31 competencias, organizadas por áreas</div>
      {AREAS.map(([name, n], i) => {
        const r = gRect(i);
        const show = ramp(f, gridAt + i * 3, 12);
        const isMath = i === 5;
        return (
          <div key={name} style={{ ...abs(r.x, r.y, r.w, r.h), opacity: show * (1 - tZoom), borderRadius: 14, border: `2px solid ${isMath ? C.g1 : C.tile}`, background: isMath ? `${C.g1}55` : "#fff", padding: 12 }}>
            <div style={{ ...txt(15, 700, isMath ? C.g3 : C.muted), height: 40 }}>{name}</div>
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              {Array.from({ length: n }, (_, j) => <div key={j} style={{ width: 36, height: 36, borderRadius: 8, background: isMath ? (markColor && j === 1 ? markColor : C.g1) : C.tile }} />)}
            </div>
          </div>
        );
      })}
      {/* Zoom into Matemática */}
      {tZoom > 0 && (
        <div style={{ ...abs(lerp(m.x, 0, tZoom), lerp(m.y, ZY, tZoom), 870, ZH), transform: `scale(${sc})`, transformOrigin: "top left", opacity: Math.min(1, tZoom * 2.5) }}>
          <div style={txt(26, 800, C.g3)}>Matemática · 4 de las 31 competencias</div>
          {MATH.map((name, j) => {
            const isR = j === 1;
            const bg = isR ? mixHex(C.g1, focoColor, tFoco) : C.g1;
            return (
              <div key={j} style={{ ...abs(MATH_TILES[j][0], MATH_TILES[j][1], 420, 230), borderRadius: 18, padding: 24, display: "flex", flexDirection: "column", justifyContent: "center", background: bg, opacity: isR ? 1 : 1 - 0.75 * tFoco, transform: `scale(${isR ? 1 + 0.08 * tFoco : 1})`, boxShadow: isR && tFoco > 0 ? `0 10px 26px ${focoColor}55` : "none" }}>
                <div style={{ ...txt(27, 700, on(bg)), textAlign: "center" }}>{name}</div>
                {isR && <div style={{ marginTop: 16, alignSelf: "center", opacity: tTag, padding: "6px 16px", borderRadius: 999, background: "rgba(255,255,255,0.22)", ...txt(19, 700, "#fff") }}>{tagText}</div>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const S01: SceneSpec = {
  Stage: ({ cue }) => {
    const f = useCurrentFrame();
    const cardAt = cue("divide");
    const crumbs = <Crumbs steps={[
      { at: cue("treinta"), label: "31 competencias", color: C.tile },
      { at: cue("Matemática"), label: "Matemática · 4", color: C.g1 },
      { at: cue("pertenece"), label: "1 competencia", color: C.g2 },
      { at: cue("capacidades"), label: "4 capacidades", color: C.g3 },
    ]} />;
    return (
      <>
        <PanoCard
          cardAt={cardAt}
          pano={<CnebPano crumbs={crumbs} tRing={ramp(f, cue("perfil"), 14)} tGrid={ramp(f, cue("treinta"), 16)} gridAt={cue("treinta")} tZoom={ramp(f, cue("Matemática"), 24)} tFoco={ramp(f, cue("pertenece"), 14)} tTag={ramp(f, cue("Álgebra"), 12)} />}
          card={
            <DocCard title="Currículo Nacional (MINEDU)" color={lc(1)} at={cardAt} rows={[
              { at: cue("capacidades"), label: "4 capacidades", body: <><Pill at={cue("traduce")} color={C.g3} strong>Traduce</Pill><Pill at={cue("comunica")} color={C.g3} strong>Comunica</Pill><Pill at={cue("usa")} color={C.g3} strong>Usa estrategias</Pill><Pill at={cue("argumenta")} color={C.g3} strong>Argumenta</Pill></> },
              { at: cue("estándar"), label: "Estándar", body: <>Cómo se ve el logro al terminar la secundaria:<br /><Pill at={cue("resolver")} color={C.g3}>resolver sistemas de ecuaciones lineales</Pill><Pill at={cue("explicar")} color={C.g3} underline={ramp(f, cue("Recuerden"), 20)}>explicar, con ejemplos, cuándo no tienen una sola solución</Pill></> },
            ]} />
          }
        />
        <Hilo at={cue("siguiente")} from={miniPt(660, ZY + 165)} layer={1} />
      </>
    );
  },
  chrome: down(1, (cue) => cue("siguiente")),
};

// ───────── Scene 2 · PEI ─────────
const OBJ = ["Propuesta pedagógica", "Permanencia", "Recursos tecnológicos", "Clima", "Acompañamiento docente", "Condiciones operativas"];
const PY = 70;
const S02: SceneSpec = {
  Stage: ({ cue }) => {
    const f = useCurrentFrame();
    const col = lc(2);
    const [cQ, cD, cV, cC] = [cue("Quiénes"), cue("Dónde"), cue("dónde", 1), cue("compromisos")];
    const tF = ramp(f, cue("toca"), 14);
    const cardAt = cue("mejorar");
    const head = (x: number, at: number, t: string) => <div style={{ ...abs(x, PY, 380), opacity: ramp(f, at, 10), ...txt(24, 800) }}>{t}</div>;
    const tile = (x: number, y: number, w: number, h: number, at: number, dim: number, lit: number, body: React.ReactNode, key?: string | number) => {
      const st = tileStyle(dim, lit, col);
      return <div key={key} style={{ ...abs(x, y + PY, w, h), borderRadius: 12, padding: "8px 12px", display: "flex", flexDirection: "column", justifyContent: "center", ...st, opacity: (st.opacity as number) * ramp(f, at, 10) }}>{body}</div>;
    };
    const pano = (
      <div style={{ position: "relative", width: 870, height: 600 }}>
        {head(0, cQ, "Quiénes somos")}
        {["Misión", "Visión", "Valores"].map((t, i) => tile(0, 50 + i * 92, 230, 80, cQ + 4 + i * 4, tF, 0, <div style={txt(21, 700)}>{t}</div>, t))}
        {head(250, cD, "Dónde estamos")}
        {tile(250, 50, 230, 150, cD + 4, tF * 0.6, 0, <><div style={txt(22, 800)}>Diagnóstico</div><div style={{ ...txt(17, 500), marginTop: 6 }}>cómo aprenden hoy</div></>)}
        {head(500, cV, "A dónde vamos")}
        <div style={{ ...abs(500, PY + 30), opacity: ramp(f, cV, 10), ...txt(14, 600, C.muted) }}>6 objetivos institucionales</div>
        {OBJ.map((t, i) => {
          const lit = i === 0 ? tF : 0;
          return tile(500 + (i % 2) * 190, 50 + Math.floor(i / 2) * 92, 180, 82, cV + 4 + i * 4, i === 0 ? 0 : tF, lit, <div style={txt(16, 700)}><b>{String(i + 1).padStart(2, "0")}</b> {t}</div>, t);
        })}
        <div style={{ ...abs(500, 340 + PY, 370), opacity: ramp(f, cC, 10) * (1 - 0.7 * tF), ...txt(15, 700, C.muted) }}>5 compromisos de gestión escolar (CGE)</div>
        {[1, 2, 3, 4, 5].map((n) => tile(500 + (n - 1) * 74, 366, 66, 40, cC + n * 3, n === 1 ? 0 : tF, n === 1 ? tF : 0, <div style={{ ...txt(14, 700), textAlign: "center" }}>CGE {n}</div>, n))}
        <svg style={abs(0, 0, 870, 600)} width={870} height={600}>
          <path d={`M 560 ${132 + PY} L 533 ${366 + PY}`} stroke={C.navy} strokeWidth={3} fill="none" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - tF} />
        </svg>
        <div style={{ ...abs(500, 6 + PY - 40, 370), textAlign: "right", opacity: ramp(f, cue("Álgebra"), 10) }}>
          <span style={{ padding: "5px 14px", borderRadius: 999, background: C.navy, ...txt(16, 800, "#fff") }}>▼ esta clase de Álgebra</span>
        </div>
      </div>
    );
    return (
      <>
        <Entrada items={[{ layer: 1 }]} />
        <PanoCard cardAt={cardAt} pano={pano} card={
          <DocCard title="PEI 2026–2030" color={col} at={cardAt} rows={[
            { at: cardAt, label: "Objetivo 01", body: "Mejorar los aprendizajes, contextualizando la propuesta pedagógica" },
            { at: cue("noventa"), label: "Meta", body: <>90 % en nivel satisfactorio en Matemática y Comunicación al 2030 · <b>65 % en 2026</b><br /><span style={{ color: C.muted }}>fijada por el equipo directivo</span></> },
          ]} />
        } />
        <Hilo at={cue("siguiente")} from={miniPt(590, 91 + PY)} layer={2} />
      </>
    );
  },
  chrome: down(2, (cue) => cue("siguiente")),
};

// ───────── Scene 3 · PCI ─────────
type Area = { n: string; h: number; x: number; y: number; w: number; hh: number };
const PCI_AREAS: Area[] = (() => {
  const top = 50, H = 530, gap = 8, rx = 270, RW = 600;
  const out: Area[] = [{ n: "Matemática", h: 14, x: 0, y: top, w: 262, hh: H }];
  const rows: [string, number][][] = [
    [["Ciencia y Tecnología", 7], ["Comunicación", 6]],
    [["Inglés", 3], ["Ciencias Sociales", 3], ["Educación Física", 3], ["DPCC", 2]],
    [["Educación Religiosa", 2], ["Tutoría", 2], ["Educación para el Trabajo", 2], ["Arte y Cultura", 1]],
  ];
  const avail = H - 2 * gap;
  let y = top;
  rows.forEach((row) => {
    const sum = row.reduce((a, [, h]) => a + h, 0);
    const rh = (avail * sum) / 31;
    const aw = RW - (row.length - 1) * gap;
    let x = rx;
    row.forEach(([n, h]) => { const w = (aw * h) / sum; out.push({ n, h, x, y, w, hh: rh }); x += w + gap; });
    y += rh + gap;
  });
  return out;
})();
const ALG_H = (530 * 3) / 14;
const S03: SceneSpec = {
  Stage: ({ cue }) => {
    const f = useCurrentFrame();
    const col = lc(3);
    const tP = cue("Primero");
    const tM = ramp(f, cue("Matemática"), 14), tK = ramp(f, cue("cursos"), 14), tA = ramp(f, cue("Álgebra"), 16);
    const cardAt = cue("Segundo");
    const pano = (
      <div style={{ position: "relative", width: 870, height: 600 }}>
        <div style={{ ...abs(0, 0, 870), display: "flex", justifyContent: "space-between", opacity: ramp(f, tP, 10) }}>
          <span style={txt(22, 800)}>Horas por área · Secundaria</span>
          <span style={txt(22, 700, C.muted)}>Total: 45 horas semanales</span>
        </div>
        {PCI_AREAS.map((a, i) => {
          const isM = i === 0;
          const st = tileStyle(isM ? 0 : tM, isM ? 0.7 * tM : 0, col);
          const small = a.w < 120;
          return (
            <div key={a.n} style={{ ...abs(a.x, a.y, a.w, a.hh), borderRadius: 12, padding: small ? 8 : 14, ...st, transform: "none", opacity: (st.opacity as number) * ramp(f, tP + i * 3, 10) * (isM ? 1 - tK : 1) }}>
              <div style={txt(small ? 14 : 18, 700, st.color as string)}>{a.n}</div>
              <div style={{ ...txt(small ? 26 : 38, 800, st.color as string), marginTop: 4 }}>{a.h}</div>
            </div>
          );
        })}
        {/* The school organizes Matemática into courses; only Álgebra is named */}
        <div style={{ ...abs(0, 50, 262, ALG_H), borderRadius: 12, padding: 14, opacity: tK, background: mixHex("#C9D3DA", col, tA), transform: `scale(${1 + 0.06 * tA})`, boxShadow: tA > 0 ? `0 8px 22px ${col}55` : "none" }}>
          <div style={{ ...txt(24, 800, tA > 0.5 ? on(col) : C.ink), opacity: tA }}>Álgebra · 3 h</div>
        </div>
        <div style={{ ...abs(0, 50 + ALG_H + 6, 262, 530 - ALG_H - 6), borderRadius: 12, background: "#C9D3DA", opacity: tK, padding: 14 }}>
          <div style={txt(17, 700, C.muted)}>Matemática · 14 h<br />organizada por el colegio en cursos</div>
        </div>
      </div>
    );
    return (
      <>
        <Entrada items={[{ layer: 2 }]} />
        <PanoCard mini={0.5} cardAt={cardAt} pano={pano} card={
          <DocCard title="PCI 2026 · decide tres cosas" color={col} at={cardAt} rows={[
            { at: cardAt, label: "1 · Horas", body: "45 h semanales en secundaria · Matemática 14 h · Álgebra 3 h" },
            { at: cardAt + 8, label: "2 · Método", body: "Resolver problemas en contextos reales" },
            { at: cue("Tercero"), label: "3 · Evaluación", body: "En cada sesión · escala AD, A, B, C · retroalimentar con preguntas, no solo con la respuesta correcta" },
            { at: cue("Además"), label: "Resultados", body: <>Cada mes · meta: 30 % de estudiantes en logro previsto o destacado (A + AD) en Matemática <span style={{ color: C.muted }}>· fijada por el equipo directivo</span></> },
          ]} />
        } />
        <Hilo at={cue("siguiente")} from={miniPt(131, 50 + ALG_H / 2, 0.5)} layer={3} />
      </>
    );
  },
  chrome: down(3, (cue) => cue("siguiente")),
};

// ───────── Scene 4 · Programación anual ─────────
const BIM: { name: string; from: number; to: number; months?: string }[] = [
  { name: "I bimestre", from: 1, to: 9 }, { name: "II bimestre", from: 10, to: 19 },
  { name: "III bimestre", from: 20, to: 28, months: "ago. – oct." }, { name: "IV bimestre", from: 29, to: 38 },
];
const ROW_Y = [20, 92, 198, 344];
export const CW = 56, CH = 50;
const STEP = 66, X0 = 150;
const bimOf = (w: number) => BIM.findIndex((b) => w >= b.from && w <= b.to);
export const weekPos = (w: number) => { const b = bimOf(w); return { x: X0 + (w - BIM[b].from) * STEP, y: ROW_Y[b] }; };
// Reusable dependency arc (returns in Scene 11): below the III bimestre row, from week a to week b.
export const Arc: React.FC<{ a: number; b: number; depth: number; t: number; color: string; dash?: boolean }> = ({ a, b, depth, t, color, dash }) => {
  const x1 = weekPos(a).x + CW / 2, x2 = weekPos(b).x + CW / 2, y = weekPos(b).y + CH + 4;
  return (
    <g opacity={t > 0 ? 1 : 0}>
      <path d={`M ${x1} ${y} Q ${(x1 + x2) / 2} ${y + depth} ${x2} ${y}`} stroke={color} strokeWidth={4} fill="none" pathLength={1} strokeDasharray={dash ? "0.04 0.03" : "1 1"} strokeDashoffset={dash ? 0 : 1 - t} opacity={dash ? t : 1} />
      {t > 0.95 && <path d={`M ${x2 - 7} ${y + 12} L ${x2} ${y} L ${x2 + 7} ${y + 12}`} stroke={color} strokeWidth={4} fill="none" />}
    </g>
  );
};
const EqPill: React.FC<{ at: number; week: string; topic: string; color: string; strong?: boolean }> = ({ at, week, topic, color, strong }) => {
  const f = useCurrentFrame();
  const t = ramp(f, at, 12);
  return (
    <div style={{ opacity: t, transform: `translateY(${(1 - t) * 10}px)`, padding: "10px 18px", borderRadius: 14, background: strong ? color : "#fff", border: `3px solid ${color}`, textAlign: "center" }}>
      <div style={txt(16, 800, strong ? on(color) : C.muted)}>{week}</div>
      <div style={txt(22, 800, strong ? on(color) : C.ink)}>{topic}</div>
    </div>
  );
};
const S04: SceneSpec = {
  Stage: ({ cue }) => {
    const f = useCurrentFrame();
    const col = lc(4);
    const gAt = cue("treinta");
    const tB = ramp(f, cue("tercer"), 14), tF = ramp(f, cue("Sistemas"), 14), tL = ramp(f, cue("apoya"), 16);
    const lit = (w: number) => (w === 26 ? 1 : w === 22 || w === 24 ? 0.55 : 0);
    const cardAt = cue("porque");
    const opAt = (s: string, nth = 0) => ramp(f, cue(s, nth), 10);
    const pano = (
      <div style={{ position: "relative", width: 870, height: 600 }}>
        {BIM.map((b, bi) => (
          <div key={b.name} style={{ ...abs(0, ROW_Y[bi] + (b.months ? 2 : 12), 140), opacity: ramp(f, gAt + bi * 6, 10) * (bi === 2 ? 1 : 1 - 0.6 * tB) }}>
            <div style={txt(17, 800, bi === 2 && tB > 0.5 ? C.navy : C.ink)}>{b.name}</div>
            {b.months && <div style={txt(14, 600, C.muted)}>{b.months}</div>}
          </div>
        ))}
        {Array.from({ length: 38 }, (_, i) => {
          const w = i + 1, p = weekPos(w);
          const l = lit(w) * tF;
          const st = tileStyle(lit(w) > 0 ? 0 : Math.max(tF, bimOf(w) === 2 ? 0 : 0.6 * tB), l, col);
          return <div key={w} style={{ ...abs(p.x, p.y, CW, CH), borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", ...st, transform: `scale(${1 + 0.1 * (w === 26 ? tF : 0)})`, opacity: (st.opacity as number) * ramp(f, gAt + i, 8), ...txt(17, 700, st.color as string) }}>{w}</div>;
        })}
        {/* each week builds on the one before */}
        {Array.from({ length: 38 }, (_, i) => i + 1).filter((w) => bimOf(w) === bimOf(w + 1)).map((w) => (
          <div key={`c${w}`} style={{ ...abs(weekPos(w).x + CW, weekPos(w).y + CH / 2 - 11, STEP - CW), textAlign: "center", opacity: tL * (1 - 0.6 * tF), ...txt(16, 800, C.muted) }}>›</div>
        ))}
        <svg style={abs(0, 0, 870, 600)} width={870} height={600}>
          <Arc a={22} b={26} depth={70} t={ramp(f, cue("Matrices"), 20)} color={C.navy} />
          <Arc a={24} b={26} depth={38} t={ramp(f, cue("veinticuatro"), 20)} color={C.navy} />
        </svg>
        <div style={{ ...abs(0, 448, 870), display: "flex", alignItems: "center", gap: 14 }}>
          <EqPill at={cue("Matrices")} week="Sem 22" topic="Matrices" color={col} />
          <span style={{ ...txt(34, 800, C.navy), opacity: opAt("más") }}>+</span>
          <EqPill at={cue("determinantes")} week="Sem 24" topic="Determinantes" color={col} />
          <span style={{ ...txt(34, 800, C.navy), opacity: opAt("hacen") }}>→</span>
          <EqPill at={cue("hacen")} week="Sem 26 · 21–25 set." topic="Sistemas de ecuaciones lineales" color={col} strong />
        </div>
      </div>
    );
    return (
      <>
        <Entrada items={[{ layer: 3 }]} />
        <PanoCard mini={0.66} cardAt={cardAt} pano={pano} card={
          <DocCard title="Temario anual 2026 (sílabo) · Álgebra 4.° · 3 h por semana" color={col} at={cardAt} rows={[
            { at: cardAt + 6, label: "Semana 26", body: "definición · clasificación compatible e incompatible · reducción, igualación y sustitución" },
          ]} />
        } />
        <Hilo at={cue("siguiente")} from={miniPt(weekPos(26).x + CW / 2, weekPos(26).y + CH / 2, 0.66)} layer={4} />
      </>
    );
  },
  chrome: down(4, (cue) => cue("siguiente")),
};

// ───────── Scene 5 · Unidad didáctica VI ─────────
const SLOTS = ["Situación significativa", "Desempeños", "Criterios de evaluación", "Secuencia de sesiones"];
const S05: SceneSpec = {
  Stage: ({ cue }) => {
    const f = useCurrentFrame();
    const col = lc(5);
    const bAt = cue("bimestre"), uAt = cue("sexta"), sAt = cue("cuatro");
    const fill = [cue("situación"), cue("desempeños"), cue("criterios"), cue("secuencia")];
    const cardAt = cue("siguiente");
    const tF = ramp(f, cardAt, 14);
    const wx = (w: number) => (w - 20) * 97;
    const pano = (
      <div style={{ position: "relative", width: 870, height: 600 }}>
        {SLOTS.map((s, i) => {
          const isC = i === 2;
          const tint = ramp(f, fill[i], 12);
          const bg = isC ? mixHex(mixHex("#FFFFFF", col, 0.18 * tint), col, tF) : mixHex("#FFFFFF", col, 0.18 * tint);
          return (
            <div key={s} style={{ ...abs(i * 223, 20, 200, 120), borderRadius: 14, border: `2px dashed ${isC && tF > 0.5 ? col : C.line}`, background: bg, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 12, opacity: ramp(f, sAt + i * 4, 10) * (isC ? 1 : 1 - 0.8 * tF), transform: `scale(${isC ? 1 + 0.08 * tF : 1})` }}>
              <div style={txt(19, 700, on(bg))}>{s}</div>
            </div>
          );
        })}
        {/* III bimestre (weeks 20–28) contains Unidad VI (weeks 24–28) */}
        <div style={{ ...abs(0, 214, 870), opacity: ramp(f, bAt, 10) }}>
          <div style={txt(18, 800, C.muted)}>III bimestre · semanas 20 a 28</div>
          <div style={{ height: 12, marginTop: 6, borderTop: `3px solid ${C.line}`, borderLeft: `3px solid ${C.line}`, borderRight: `3px solid ${C.line}` }} />
        </div>
        {Array.from({ length: 9 }, (_, i) => {
          const w = 20 + i;
          const inU = w >= 24;
          const tU = ramp(f, uAt, 12);
          const st = tileStyle(w === 26 ? 0 : tF, w === 26 ? tF : inU ? 0.35 * tU * (1 - tF) : 0, col);
          return <div key={w} style={{ ...abs(wx(w), 270, 86, 90), borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", ...st, transform: `scale(${w === 26 ? 1 + 0.1 * tF : 1})`, opacity: (st.opacity as number) * ramp(f, bAt + i * 3, 10) * (inU ? 1 : 1 - 0.5 * tU), ...txt(20, 800, st.color as string) }}>{w}</div>;
        })}
        <div style={{ ...abs(wx(24), 372, wx(28) + 86 - wx(24)), opacity: ramp(f, uAt, 12), textAlign: "center" }}>
          <div style={{ height: 12, borderBottom: `3px solid ${C.navy}`, borderLeft: `3px solid ${C.navy}`, borderRight: `3px solid ${C.navy}` }} />
          <div style={{ ...txt(20, 800, C.navy), marginTop: 8 }}>Unidad VI · semanas 24 a 28</div>
        </div>
      </div>
    );
    return (
      <>
        <Entrada items={[{ layer: 4 }]} />
        <PanoCard mini={0.66} cardAt={cardAt} pano={pano} card={
          <DocCard title="Unidad didáctica VI · semanas 24 a 28" color={col} at={cardAt} rows={[
            { at: cardAt + 6, label: "4 piezas", body: "situación significativa · desempeños · criterios de evaluación · secuencia de sesiones" },
            { at: cue("criterios", 1), label: "Entrega", body: "Los criterios: lo que el docente mirará en la respuesta del estudiante" },
          ]} />
        } />
        <Hilo at={cue("criterios", 1)} from={miniPt(2 * 223 + 100, 80, 0.66)} layer={5} />
      </>
    );
  },
  chrome: down(5, (cue) => cue("criterios", 1)),
};

// ───────── Scene 6 · Cuaderno de trabajo ─────────
const CAPS = ["Traduce", "Comunica", "Usa estrategias", "Argumenta"];
export const CapLegend: React.FC<{ at: number; style?: (i: number) => React.CSSProperties }> = ({ at, style }) => (
  <div style={{ display: "flex", gap: 10 }}>
    {CAPS.map((c, i) => <Pill key={c} at={at + i * 4} color={C.g3}><span style={style?.(i)}>{c}</span></Pill>)}
  </div>
);
export const PagesWeek26: React.FC<{ t: number; color: string; y?: number }> = ({ t, color, y = 330 }) => (
  <>
    {[109, 110, 111, 112, 113].map((p, i) => (
      <div key={p} style={{ ...abs(i * 180 + 4, y, 150, 150), borderRadius: 10, background: "#fff", border: `2px solid ${color}`, boxShadow: `0 6px 18px ${color}33`, opacity: t, transform: `translateY(${(1 - t) * 30}px)`, padding: 12 }}>
        <div style={txt(18, 800, color)}>p. {p}</div>
        {[0, 1, 2, 3, 4].map((l) => <div key={l} style={{ height: 8, borderRadius: 4, background: C.tile, marginTop: 12, width: `${90 - ((l * 17) % 40)}%` }} />)}
      </div>
    ))}
  </>
);
const S06: SceneSpec = {
  Stage: ({ cue }) => {
    const f = useCurrentFrame();
    const col = lc(6);
    const tT = ramp(f, cue("tomos"), 12), t2 = ramp(f, cue("tercero"), 12);
    const gAt = cue("semana");
    const tF = ramp(f, cue("veintiséis"), 16);
    const cardAt = cue("siguiente");
    const parts: [string, number][] = [["Teoría de los tres métodos", cue("teoría")], ["Clasificación con determinantes", cue("clasificación")], ["Problemas resueltos", cue("problemas")], ["8 ejercicios «Trabajando en clase»", cue("ocho")]];
    const book = (x: number, label: string, sub: string, lit: number) => (
      <div style={{ ...abs(x, 0, 420, 76), borderRadius: 12, border: `2px solid ${lit > 0.5 ? col : C.line}`, background: lit > 0.5 ? col : "#fff", padding: "10px 16px", opacity: tT * (1 - 0.5 * (1 - lit) * t2) }}>
        <div style={txt(20, 800, lit > 0.5 ? on(col) : C.ink)}>{label}</div>
        <div style={txt(16, 600, lit > 0.5 ? on(col) : C.muted)}>{sub}</div>
      </div>
    );
    const pano = (
      <div style={{ position: "relative", width: 870, height: 600 }}>
        {book(0, "Tomo 1", "I y II bimestre", 0)}
        {book(450, "Tomo 2", "III y IV bimestre", t2)}
        <div style={{ ...abs(0, 96, 870), opacity: ramp(f, cue("competencia"), 10), ...txt(17, 700) }}>Cada página indica: «Competencia 2: Resuelve problemas de regularidad, equivalencia y cambio»</div>
        {Array.from({ length: 9 }, (_, i) => {
          const w = 20 + i;
          const isW = w === 26;
          return (
            <div key={w} style={{ ...abs(i * 80, 142, 74, 150), opacity: ramp(f, gAt + i * 3, 10) * (isW ? 1 : 1 - 0.8 * tF) }}>
              <div style={{ ...txt(15, 800, isW && tF > 0.5 ? C.navy : C.muted), textAlign: "center" }}>Sem {w}</div>
              {[0, 1, 2, 3, 4].map((p) => <div key={p} style={{ ...abs(16, 36, 42, 58), borderRadius: 5, background: "#fff", border: `2px solid ${isW && tF > 0.5 ? col : C.line}`, transformOrigin: "50% 110%", transform: `rotate(${(p - 2) * 11}deg)` }} />)}
            </div>
          );
        })}
        <div style={{ ...abs(724, 160, 146, 100), borderRadius: 10, border: `2px solid ${C.line}`, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", opacity: ramp(f, gAt + 30, 10) * (1 - 0.8 * tF), ...txt(15, 700, C.muted) }}>IV bimestre<br />sem 29–38</div>
        <PagesWeek26 t={tF} color={col} y={292} />
        {parts.map(([p, at], i) => <div key={p} style={{ ...abs((i % 2) * 440, 466 + Math.floor(i / 2) * 42, 430), opacity: ramp(f, at, 10), ...txt(20, 700) }}><span style={{ color: col }}>■</span> {p}</div>)}
      </div>
    );
    return (
      <>
        <Entrada items={[{ layer: 5 }]} />
        <PanoCard mini={0.66} cardAt={cardAt} pano={pano} card={
          <DocCard title="Cuaderno de trabajo de Álgebra 4.° · Tomo 2" color={col} at={cardAt} rows={[
            { at: cardAt + 6, body: "Semana 26 · páginas 109–113" },
            { at: cardAt + 14, body: "Lo elabora el colegio · dos tomos por curso al año · cada página indica la competencia que entrena" },
          ]} />
        } />
        <Hilo at={cue("material")} from={miniPt(435, 370, 0.66)} layer={6} />
      </>
    );
  },
  chrome: down(6, (cue) => cue("material")),
};

// ───────── Scene 7 · Sesión y clase ─────────
const slideRect = (n: number) => ({ x: ((n - 1) % 6) * 147, y: 20 + Math.floor((n - 1) / 6) * 92, w: 135, h: 80 });
const SLIDE_LABELS: Record<number, string> = { 3: "propósito", 7: "lista de cotejo", 10: "debate", 23: "metacognición" };
export const Slide10: React.FC<{ t: number; color: string; outline?: string; tDef?: number }> = ({ t, color, outline, tDef = 1 }) => {
  const r = slideRect(10);
  return (
    <div style={{ ...abs(lerp(r.x, 25, t), lerp(r.y, 20, t), lerp(r.w, 820, t), lerp(r.h, 480, t)), borderRadius: lerp(8, 18, t), background: "#fff", border: `${lerp(2, 4, t)}px solid ${outline ?? color}`, boxShadow: `0 ${16 * t}px ${40 * t}px rgba(19,35,58,0.18)`, padding: lerp(6, 40, t), opacity: t > 0 ? 1 : 0, overflow: "hidden" }}>
      <div style={txt(lerp(12, 20, t), 800, C.muted)}>{t > 0.5 ? "Diapositiva 10 · Debate" : "10"}</div>
      <div style={{ opacity: t > 0.6 ? 1 : 0 }}>
        <div style={{ ...txt(40, 800, color), marginTop: 50, lineHeight: 1.25 }}>¿Dos ecuaciones con dos incógnitas siempre tienen una sola solución?</div>
        <div style={{ ...txt(28, 700, C.ink), marginTop: 28, opacity: tDef }}>Defiende tu respuesta con un ejemplo.</div>
        <div style={{ ...txt(15, 600, C.muted), position: "absolute", left: 40, bottom: 22 }}>Pregunta reformulada. En la presentación original: «¿Quién tiene razón?»</div>
      </div>
    </div>
  );
};
const S07: SceneSpec = {
  Stage: ({ cue }) => {
    const f = useCurrentFrame();
    const col = lc(7);
    const gAt = cue("veinticuatro");
    const tF = ramp(f, cue("Presenta"), 14);
    const tE = ramp(f, cue("debate"), 22);
    const labelAt: Record<number, number> = { 3: cue("propósito"), 7: cue("lista"), 10: cue("debate"), 23: cue("lista") + 24 };
    const cardAt = cue("final");
    const pano = (
      <div style={{ position: "relative", width: 870, height: 600 }}>
        {Array.from({ length: 24 }, (_, i) => {
          const n = i + 1, r = slideRect(n);
          const key = n in SLIDE_LABELS;
          const lit = key ? tF * (n === 10 ? 1 : 1 - tE) : 0;
          return (
            <div key={n} style={{ ...abs(r.x, r.y, r.w, r.h), borderRadius: 8, background: lit > 0.5 ? "#fff" : C.tile, border: `2px solid ${lit > 0.3 ? col : C.tile}`, opacity: ramp(f, gAt + i, 8) * (key ? 1 - 0.8 * (n === 10 ? 0 : tE) : 1 - 0.8 * tF), padding: 6 }}>
              <div style={txt(13, 800, C.muted)}>{n}</div>
              {key && <div style={{ ...txt(14, 700, col), marginTop: 6, opacity: ramp(f, labelAt[n], 10) }}>{SLIDE_LABELS[n]}</div>}
            </div>
          );
        })}
        <Slide10 t={tE} color={col} tDef={ramp(f, cue("defiende"), 12)} />
      </div>
    );
    return (
      <>
        <Entrada items={[{ layer: 4, at: cue("semana") }, { layer: 5, at: cue("criterios") }, { layer: 6, at: cue("páginas") }]} />
        <PanoCard mini={0.66} cardAt={cardAt} pano={pano} card={
          <DocCard title="Presentación «Semana 26» · 24 diapositivas" color={col} at={cardAt} rows={[
            { at: cardAt + 6, label: "Diapositivas", body: "3 propósito · 7 lista de cotejo (lo que se va a observar) · 10 debate · 23 metacognición" },
            { at: cue("entrega"), label: "Entrega", body: "A los estudiantes: practicar, debatir y justificar · una pregunta que se puede evaluar" },
          ]} />
        } />
        <Hilo at={cue("entrega")} from={miniPt(435, 260, 0.66)} layer={7} />
      </>
    );
  },
  chrome: (f, cue) => {
    const base = down(7, (c) => c("entrega"))(f, cue);
    const cS = cue("estándar");
    return {
      ...base,
      glows: [...base.glows, { layer: 1, a: pulse(f, cS + 6, 18), color: lc(1) }],
      link: { from: 7, to: 1, t: ramp(f, cS, 18), o: 1 - ramp(f, cS + 60, 15), color: C.g2 },
    };
  },
};

// ───────── Scene 8 · Estudiante ─────────
export const Student: React.FC<{ x: number; y: number; color: string; o?: number; s?: number }> = ({ x, y, color, o = 1, s = 1 }) => (
  <svg style={{ ...abs(x, y, 60, 72), opacity: o, transform: `scale(${s})` }} width={60} height={72} viewBox="0 0 60 72">
    <circle cx={30} cy={20} r={14} fill={color} />
    <path d="M 6 70 Q 6 40 30 40 Q 54 40 54 70 Z" fill={color} />
  </svg>
);
const PICK = 13;
const S08: SceneSpec = {
  Stage: ({ cue }) => {
    const f = useCurrentFrame();
    const col = lc(8);
    const iAt = cue("estudiante");
    const tF = ramp(f, cue("últimos"), 14);
    const cardAt = cue("tarjeta");
    const pano = (
      <div style={{ position: "relative", width: 870, height: 600 }}>
        <div style={{ ...abs(0, 40), opacity: ramp(f, iAt, 10), ...txt(18, 700, C.muted) }}>Una sección</div>
        {Array.from({ length: 30 }, (_, i) => {
          const isP = i === PICK;
          return <Student key={i} x={(i % 10) * 87 + 13} y={90 + Math.floor(i / 10) * 110} color={isP && tF > 0 ? col : C.tile} o={ramp(f, iAt + i, 8) * (isP ? 1 : 1 - 0.8 * tF)} s={isP ? 1 + 0.4 * tF : 1} />;
        })}
      </div>
    );
    return (
      <>
        <Entrada items={[{ layer: 7 }]} />
        <PanoCard mini={0.5} cardAt={cardAt} pano={pano} card={
          <DocCard title="Últimos 5 minutos de la clase" color={col} at={cardAt} rows={[
            { at: cue("parte", 0), label: "Parte A", body: "Resuelve x + y = 5, x − y = 1 y explica por qué elegiste ese método." },
            { at: cue("parte", 1), label: "Parte B", body: "María dice: «Dos ecuaciones con dos incógnitas siempre tienen exactamente una solución». ¿Estás de acuerdo? Justifica con un ejemplo." },
            { at: cue("argumentar"), label: "Niveles", body: "1 responde sin justificar · 2 dice «no siempre» y da una razón · 3 da un ejemplo de sistema sin solución o con infinitas soluciones" },
            { at: cue("evidencia"), label: "Evidencia", body: <><b>Las respuestas a A y B</b>, valoradas con estos niveles: el logro de aprendizaje de la clase</> },
          ]} />
        } />
        <FlyChip from={[1375, 820]} to={slotCenter(8)} t={ramp(f, cue("evidencia"), FLY)} label={threadOf(8)} color={col} />
      </>
    );
  },
  chrome: (f, cue) => {
    const base = down(8)(f, cue);
    return {
      ...base,
      chips: [...base.chips, { layer: 8, t: ramp(f, cue("evidencia") + FLY - 3, 4), color: lc(8) }],
      rail: { mode: f >= cue("Ahora") ? "stop-bottom" : "down", from: C.cyan, to: C.navy },
      ficticios: f >= cue("tarjeta"),
    };
  },
};

// ───────── Transition · Dos escenarios distintos ─────────
const T08: SceneSpec = {
  Stage: () => (
    <div style={{ ...abs(940, 380, 870), textAlign: "center" }}>
      <Reveal at={18}><div style={txt(54, 800, C.navy)}>Dos escenarios distintos</div></Reveal>
      <Reveal at={30}><div style={{ ...txt(28, 600, C.muted), marginTop: 14 }}>Casos ficticios</div></Reveal>
    </div>
  ),
  chrome: (f) => {
    const t = ramp(f, 0, 30);
    return {
      funnel: 1, barColor: (i) => mixHex(lc(i), C.tile, t), active: t < 1 ? 8 : null, activeT: 1 - t, visited: t < 1 ? [1, 2, 3, 4, 5, 6, 7] : [],
      glows: [], chips: LAYERS.map((L) => ({ layer: L.id, t: 1, color: mixHex(lc(L.id), C.tile, t) })),
      rail: { mode: "stop-bottom", from: mixHex(C.cyan, C.line, t), to: mixHex(C.navy, C.line, t) }, header: "", ficticios: true,
    };
  },
};

export const SCENES: Record<string, SceneSpec> = { S00, S01, S02, S03, S04, S05, S06, S07, S08, T08 };
