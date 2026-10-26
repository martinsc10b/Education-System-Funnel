// Parts 2–4: Escenario A (Ana), Escenario B (Bruno, layers 8 → 1 with Scenes 12/13 swapped), cierre. Up route in orange.
import React from "react";
import { useCurrentFrame } from "remotion";
import { C, SANS, layerColor as lc, mixHex } from "./theme";
import { Cue, DocCard, CardRow, Pill, ramp, Reveal } from "./kit";
import { ChromeState, LAYERS, PanoCard } from "./chrome";
import { Arc, CnebPano, CW, CH, PagesWeek26, SceneSpec, Slide10, Student, weekPos } from "./part01";

const O = C.orange;
const txt = (size: number, weight = 600, color: string = C.ink): React.CSSProperties => ({ fontFamily: SANS, fontSize: size, fontWeight: weight, color, lineHeight: 1.2 });
const abs = (x: number, y: number, w?: number, h?: number): React.CSSProperties => ({ position: "absolute", left: x, top: y, width: w, height: h, boxSizing: "border-box" });
const GRAY = C.tile;
const ALL = [1, 2, 3, 4, 5, 6, 7, 8];

// Scenario card: Se activa con · Ve · Decide · Cuándo.
const Scen: React.FC<{ layer: number; at: number; rows: [string, React.ReactNode, number][] }> = ({ layer, at, rows }) => (
  <DocCard title={LAYERS[layer - 1].name} color={O} at={at} rows={rows.map(([label, body, a]): CardRow => ({ label, body, at: a }))} />
);

// ───────── Part 2 · Escenario A: Ana (8 → 7 → 3 → 1) ─────────
const A_STOPS = [8, 7, 3, 1];
const aCues = (cue: Cue) => [cue("Ana"), cue("docente"), cue("coordinación"), cue("cierre")];
const S09: SceneSpec = {
  Stage: ({ cue }) => {
    const f = useCurrentFrame();
    const at = aCues(cue);
    const cur = at.filter((a) => f >= a).length - 1;
    const cards: [string, React.ReactNode][] = [
      ["Ana · Nivel 3", <>Dibuja dos rectas paralelas: «ninguna solución». María se equivoca.</>],
      ["Docente", "Registra en la lista de cotejo · continúa con la semana 27"],
      ["Coordinación", <>Análisis mensual · sección en logro (85 %, <i>ejemplo</i>) · suma a la meta del PCI</>],
      ["Cierre del bimestre", "La competencia queda registrada (SIAGIE)"],
    ];
    return (
      <>
        <div style={abs(940, 104, 870)}>
          <Reveal at={6}><div style={txt(30, 800, O)}>Escenario A · Logra el objetivo</div></Reveal>
        </div>
        {cards.map(([h, b], i) => (
          <div key={i} style={{ ...abs(940, 178 + i * 176, 870, 156), opacity: ramp(f, at[i], 12) * (i === cur ? 1 : 0.5), transform: `translateY(${(1 - ramp(f, at[i], 12)) * 20}px)`, background: "#fff", borderRadius: 18, borderLeft: `7px solid ${O}`, boxShadow: i === cur ? `0 10px 30px ${O}33` : "none", padding: "18px 26px", display: "flex", gap: 24, alignItems: "center" }}>
            <div style={{ flex: "0 0 auto", width: 64, height: 64, borderRadius: 32, background: i === cur ? O : C.bg, ...txt(28, 800, i === cur ? "#fff" : C.muted), display: "flex", alignItems: "center", justifyContent: "center" }}>{A_STOPS[i]}</div>
            <div style={{ flex: 1 }}>
              <div style={txt(16, 800, C.muted)}>{LAYERS[A_STOPS[i] - 1].name.toUpperCase()}</div>
              <div style={{ ...txt(25, 800), marginTop: 4 }}>{h}</div>
              <div style={{ ...txt(20, 500), marginTop: 4 }}>{b}</div>
            </div>
            {i === 0 && (
              <svg width={130} height={110} viewBox="0 0 130 110">
                <line x1={10} y1={100} x2={110} y2={10} stroke={C.navy} strokeWidth={5} />
                <line x1={30} y1={105} x2={125} y2={20} stroke={O} strokeWidth={5} />
              </svg>
            )}
          </div>
        ))}
      </>
    );
  },
  chrome: (f, cue) => {
    const at = aCues(cue);
    const cur = Math.max(0, at.filter((a) => f >= a).length - 1);
    return {
      funnel: 1, barColor: () => O, active: A_STOPS[cur], activeT: ramp(f, at[cur], 12),
      visited: A_STOPS.slice(0, cur), glows: [],
      chips: ALL.map((l) => { const i = A_STOPS.indexOf(l); return { layer: l, t: 1, color: i >= 0 && f >= at[i] ? mixHex(GRAY, O, ramp(f, at[i], 10)) : GRAY }; }),
      rail: { mode: "up", from: O, to: O, speed: 1.6 },
      link: cur > 0 ? { from: A_STOPS[cur - 1], to: A_STOPS[cur], t: ramp(f, at[cur], 16), o: 1 - ramp(f, at[cur] + 40, 12), color: O } : undefined,
      header: "Parte 2 · Escenario A", route: { label: "▲ Escenario A · Logrado", color: O }, ficticios: true,
    };
  },
};

const T09: SceneSpec = {
  Stage: () => (
    <div style={{ ...abs(940, 380, 870), textAlign: "center" }}>
      <Reveal at={18}><div style={txt(54, 800, C.navy)}>Otro escenario</div></Reveal>
      <Reveal at={30}><div style={{ ...txt(28, 600, C.muted), marginTop: 14 }}>Casos ficticios</div></Reveal>
    </div>
  ),
  chrome: (f) => {
    const t = ramp(f, 0, 30);
    return {
      funnel: 1, barColor: () => mixHex(O, GRAY, t), active: t < 1 ? 1 : null, activeT: 1 - t, visited: t < 1 ? [8, 7, 3] : [], glows: [],
      chips: ALL.map((l) => ({ layer: l, t: 1, color: [8, 7, 3, 1].includes(l) ? mixHex(O, GRAY, t) : GRAY })),
      rail: { mode: "stop-top", from: mixHex(O, C.line, t), to: mixHex(O, C.line, t) }, header: "", ficticios: true,
    };
  },
};

// ───────── Part 3 · Escenario B: Bruno (every layer, 8 → 1) ─────────
// Layer k active, layers below already visited; evidence travels up the thread from k+1 and lights chip k.
const upB = (k: number) => (f: number): ChromeState => ({
  funnel: 1, barColor: () => O, active: k, activeT: ramp(f, 0, 14),
  visited: ALL.filter((l) => l > k), glows: [],
  chips: ALL.map((l) => ({ layer: l, t: 1, color: l > k ? O : l === k ? mixHex(GRAY, O, ramp(f, 14, 12)) : GRAY })),
  rail: { mode: "up", from: O, to: O, speed: 1.0 },
  link: k < 8 ? { from: k + 1, to: k, t: ramp(f, 0, 16), o: 1 - ramp(f, 40, 12), color: O } : undefined,
  header: "Parte 3 · Escenario B", route: { label: "▲ Escenario B · Aún no logra", color: O }, ficticios: true,
});

const PICKS = [1, 4, 6, 9, 13, 15, 17, 20, 23, 25, 27, 29], BRUNO = 13;
const S10: SceneSpec = {
  Stage: ({ cue }) => {
    const f = useCurrentFrame();
    const tR = ramp(f, cue("Cuatro"), 14);
    const cardAt = cue("Bruno");
    const pano = (
      <div style={{ position: "relative", width: 870, height: 600 }}>
        <div style={{ ...abs(0, 40), ...txt(18, 700, C.muted) }}>Una sección</div>
        <div style={{ ...abs(520, 34, 350), textAlign: "right", opacity: tR }}><span style={{ padding: "6px 16px", borderRadius: 999, background: O, ...txt(20, 800, "#fff") }}>4 de cada 10 · <i>ejemplo</i></span></div>
        {Array.from({ length: 30 }, (_, i) => {
          const red = PICKS.includes(i);
          const col = i === BRUNO ? O : red ? mixHex(C.tile, O, tR) : C.tile;
          return <Student key={i} x={(i % 10) * 87 + 13} y={90 + Math.floor(i / 10) * 110} color={col} o={ramp(f, i, 8)} s={i === BRUNO ? 1.3 : 1} />;
        })}
      </div>
    );
    return (
      <PanoCard mini={0.55} cardAt={cardAt} pano={pano} card={
        <DocCard title="Bruno · Nivel 1" color={O} at={cardAt} rows={[
          { at: cue("resuelve"), label: "Parte A", body: "x = 3, y = 2 · correcto" },
          { at: cue("parte"), label: "Parte B", body: "«Sí, estoy de acuerdo». Sin justificar." },
          { at: cue("Sabe"), label: "Lectura", body: "Sabe el procedimiento; todavía no sabe argumentar." },
        ]} />
      } />
    );
  },
  chrome: (f, cue) => {
    const b = upB(8)(f);
    return { ...b, chips: b.chips.map((c) => (c.layer === 8 ? { ...c, color: mixHex(GRAY, O, ramp(f, cue("Bruno"), 12)) } : c)) };
  },
};

const S11: SceneSpec = {
  Stage: ({ cue }) => {
    const f = useCurrentFrame();
    const tA = ramp(f, cue("veinticuatro"), 14), tX = ramp(f, cue("está"), 12);
    const cardAt = cue("lee");
    const vx = weekPos(21).x, vy = weekPos(26).y - 10;
    const pano = (
      <div style={{ position: "relative", width: 870, height: 600 }}>
        <Slide10 t={1} color={lc(7)} outline={O} />
        <div style={{ ...abs(430, 300, 430, 190), opacity: tA, background: "#fff", borderRadius: 12, border: `2px solid ${C.line}`, boxShadow: "0 8px 24px rgba(19,35,58,0.15)" }}>
          <svg width={430} height={190} viewBox={`${vx + 60} ${vy} 330 ${CH + 72}`} preserveAspectRatio="xMidYMid meet">
            {[22, 24, 26].map((w) => <g key={w}><rect x={weekPos(w).x} y={weekPos(w).y} width={CW} height={CH} rx={8} fill={C.tile} /><text x={weekPos(w).x + CW / 2} y={weekPos(w).y + 33} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={18} fill={C.ink}>{w}</text></g>)}
            <Arc a={24} b={26} depth={38} t={1} color={C.muted} dash />
            <g opacity={tX} stroke={O} strokeWidth={6} strokeLinecap="round">
              <line x1={weekPos(25).x} y1={vy + 60} x2={weekPos(25).x + 40} y2={vy + 100} />
              <line x1={weekPos(25).x + 40} y1={vy + 60} x2={weekPos(25).x} y2={vy + 100} />
            </g>
          </svg>
        </div>
      </div>
    );
    return (
      <PanoCard cardAt={cardAt} pano={pano} card={
        <Scen layer={7} at={cardAt} rows={[
          ["Se activa con", "la tarjeta de Bruno y su sección", cardAt],
          ["Ve", "falló la parte B, no la parte A", cue("resolvió")],
          ["Decide", "vuelve al debate y retroalimenta con preguntas", cue("vuelve")],
          ["Cuándo", "la siguiente clase", cue("siguiente")],
        ]} />
      } />
    );
  },
  chrome: upB(7),
};

// Scene 12 (swapped): Cuaderno de trabajo
const S12: SceneSpec = {
  Stage: ({ cue }) => {
    const f = useCurrentFrame();
    const cardAt = cue("patrón");
    const caps: [string, React.CSSProperties][] = [
      ["Traduce", {}], ["Comunica", {}],
      ["Usa estrategias", { background: `${C.g3}`, color: "#fff" }],
      ["Argumenta", { background: "#fff", color: O, outline: `3px dashed ${O}` }],
    ];
    const pano = (
      <div style={{ position: "relative", width: 870, height: 600 }}>
        <div style={{ ...abs(0, 20, 870), display: "flex", gap: 12 }}>
          {caps.map(([c, st]) => <span key={c} style={{ padding: "8px 18px", borderRadius: 999, background: `${C.g3}22`, ...txt(22, 700), ...st }}>{c}</span>)}
        </div>
        <div style={{ ...abs(0, 82, 870), ...txt(18, 600, C.muted) }}>Semana 26 · páginas 109–113: entrenan el procedimiento; ninguna pide justificar</div>
        <PagesWeek26 t={1} color={O} y={140} />
      </div>
    );
    return (
      <PanoCard mini={0.75} cardAt={cardAt} pano={pano} card={
        <Scen layer={6} at={cardAt} rows={[
          ["Se activa con", "el mismo patrón en varias secciones de 4.°", cardAt],
          ["Ve", "las páginas 109–113 entrenan el procedimiento, pero ningún ejercicio pide explicar o justificar", cue("entrenan")],
          ["Decide", "el colegio revisa esas páginas y agrega ítems que pidan justificar con un ejemplo", cue("justifica")],
          ["Cuándo", "revisión mensual · impresión del año siguiente", cue("justifica") + 12],
        ]} />
      } />
    );
  },
  chrome: upB(6),
};

// Scene 13 (swapped): Unidad didáctica VI
const S13: SceneSpec = {
  Stage: ({ cue }) => {
    const f = useCurrentFrame();
    const cardAt = cue("ajusta");
    const pz = 0.5 + 0.5 * Math.sin(f / 6);
    const pano = (
      <div style={{ position: "relative", width: 870, height: 600 }}>
        <div style={{ ...abs(335, 30, 200, 120), borderRadius: 14, border: `3px dashed ${O}`, background: mixHex("#FFFFFF", O, 0.12 + 0.2 * pz), display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", ...txt(20, 800) }}>Criterios de evaluación</div>
        {[24, 25, 26, 27, 28].map((w, i) => {
          const hot = w >= 27;
          return <div key={w} style={{ ...abs(i * 177, 230, 160, 130), borderRadius: 14, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: hot ? O : w === 26 ? "#fff" : C.tile, border: w === 26 ? `3px solid ${O}` : "none", ...txt(24, 800, hot ? "#fff" : C.ink) }}>Semana {w}</div>;
        })}
        <div style={{ ...abs(2 * 177 + 177, 380, 337), textAlign: "center", opacity: ramp(f, cue("proyecto"), 12), ...txt(20, 800, O) }}>Proyecto STEAM III</div>
      </div>
    );
    return (
      <PanoCard cardAt={cardAt} pano={pano} card={
        <Scen layer={5} at={cardAt} rows={[
          ["Se activa con", "el resultado de la semana 26", cardAt],
          ["Ve", "qué queda de la unidad: semanas 27–28, Proyecto STEAM III", cue("proyecto")],
          ["Decide", "incluye en el proyecto un momento para plantear y refutar afirmaciones", cue("incluirá")],
          ["Cuándo", "esa misma semana", cue("incluirá") + 14],
        ]} />
      } />
    );
  },
  chrome: upB(5),
};

const S14: SceneSpec = {
  Stage: ({ cue }) => {
    const f = useCurrentFrame();
    const cardAt = cue("ajusta");
    const tN = ramp(f, cue("argumentar"), 14);
    const pano = (
      <div style={{ position: "relative", width: 870, height: 600 }}>
        <div style={{ ...abs(0, 60), ...txt(18, 800, C.muted) }}>III bimestre</div>
        {Array.from({ length: 9 }, (_, i) => {
          const w = 20 + i;
          return <div key={w} style={{ ...abs(i * 97, 100, 86, 80), borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: w === 26 ? "#fff" : C.tile, border: w === 26 ? `4px solid ${O}` : "none", opacity: w === 26 ? 1 : 0.45, ...txt(22, 800) }}>{w}</div>;
        })}
        <div style={{ ...abs(6 * 97 - 260, 210, 640), ...txt(20, 700), padding: "14px 18px", borderRadius: 12, background: "#fff", border: `2px solid ${C.line}` }}>
          Semana 26: definición · clasificación · reducción, igualación y sustitución
        </div>
        <div style={{ ...abs(6 * 97 - 260, 290, 640), padding: "14px 18px", borderRadius: 12, border: `3px dashed ${O}`, opacity: tN, ...txt(22, 800, O) }}>+ Criterio de argumentación</div>
      </div>
    );
    return (
      <PanoCard cardAt={cardAt} pano={pano} card={
        <Scen layer={4} at={cardAt} rows={[
          ["Se activa con", "la revisión del cuaderno", cardAt],
          ["Ve", "la semana 26 lista contenidos, pero no qué debe poder argumentar el estudiante", cardAt + 14],
          ["Decide", "agrega a la semana 26 un criterio de argumentación para el próximo año", cue("argumentar")],
          ["Cuándo", "jornada de reflexión de julio o diciembre", cue("argumentar") + 14],
        ]} />
      } />
    );
  },
  chrome: upB(4),
};

const S15: SceneSpec = {
  Stage: ({ cue }) => {
    const f = useCurrentFrame();
    const cardAt = cue("compara");
    const tS = ramp(f, cue("debajo"), 14);
    const pano = (
      <div style={{ position: "relative", width: 870, height: 600 }}>
        <div style={{ ...abs(255, 40, 360, 150), borderRadius: 14, background: "#fff", border: `4px solid ${O}`, padding: 20 }}>
          <div style={txt(18, 700, C.muted)}>Matemática</div>
          <div style={{ ...txt(34, 800), marginTop: 6 }}>Álgebra · 3 h</div>
        </div>
        <div style={{ ...abs(0, 250, 870), textAlign: "center", ...txt(18, 700, C.muted) }}>Secciones de 4.° de secundaria</div>
        {Array.from({ length: 6 }, (_, i) => {
          const low = [0, 2, 3].includes(i);
          return <div key={i} style={{ ...abs(i * 147, 290, 135, 110), borderRadius: 12, background: low ? mixHex(C.tile, O, tS) : C.tile }} />;
        })}
        <div style={{ ...abs(0, 420, 870), textAlign: "center", opacity: tS, ...txt(20, 800, O) }}>bajo el umbral acordado</div>
      </div>
    );
    return (
      <PanoCard cardAt={cardAt} pano={pano} card={
        <Scen layer={3} at={cardAt} rows={[
          ["Se activa con", "el análisis mensual", cardAt],
          ["Ve", "varias secciones bajo el umbral acordado en la misma capacidad", cue("debajo")],
          ["Decide", "activa los grupos de refuerzo; en diciembre propone cambios para el PCI 2027", cue("activa")],
          ["Cuándo", "mensual · jornadas de julio y diciembre", cue("diciembre")],
        ]} />
      } />
    );
  },
  chrome: upB(3),
};

const S16: SceneSpec = {
  Stage: ({ cue }) => {
    const f = useCurrentFrame();
    const cardAt = cue("evidencia");
    const tD = ramp(f, cue("diagnóstico"), 14), tO = ramp(f, cue("objetivo"), 14);
    const col = (title: string, body: string, x: number, t: number) => (
      <div style={{ ...abs(x, 60, 270, 260), borderRadius: 16, padding: 20, background: t > 0 ? mixHex("#FFFFFF", O, t) : "#fff", border: `2px solid ${t > 0.3 ? O : C.line}` }}>
        <div style={txt(24, 800, t > 0.5 ? "#fff" : C.ink)}>{title}</div>
        <div style={{ ...txt(20, 600, t > 0.5 ? "#fff" : C.muted), marginTop: 14 }}>{body}</div>
      </div>
    );
    const pano = (
      <div style={{ position: "relative", width: 870, height: 600 }}>
        {col("Quiénes somos", "Misión · visión · valores", 0, 0)}
        {col("Dónde estamos", "Diagnóstico: qué capacidad está baja y en qué grado", 300, tD)}
        {col("A dónde vamos", "Objetivo 01: mejorar los aprendizajes", 600, tO)}
      </div>
    );
    return (
      <PanoCard cardAt={cardAt} pano={pano} card={
        <Scen layer={2} at={cardAt} rows={[
          ["Se activa con", "la jornada de reflexión de diciembre", cardAt],
          ["Ve", "que en 4.° la capacidad débil es «argumenta afirmaciones»", cue("capacidad")],
          ["Decide", "actualiza el diagnóstico con datos por capacidad y precisa el objetivo 01", cue("objetivo")],
          ["Cuándo", "diciembre", cue("objetivo") + 14],
        ]} />
      } />
    );
  },
  chrome: upB(2),
};

// Scene 17: reverse zoom, capacities → 4 Matemática competencies → one tile among 31.
const CAPS = ["Traduce", "Comunica", "Usa estrategias", "Argumenta"];
const S17: SceneSpec = {
  Stage: ({ cue }) => {
    const f = useCurrentFrame();
    const tC = ramp(f, cue("competencia"), 14);
    const tOut = ramp(f, cue("treinta"), 26);
    const cardAt = cue("explicar");
    const pano = (
      <div style={{ position: "relative", width: 870, height: 600 }}>
        <div style={{ ...abs(0, 120, 870, 300), opacity: 1 - tC, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {CAPS.map((c) => {
            const arg = c === "Argumenta";
            return <div key={c} style={{ borderRadius: 18, background: arg ? O : C.g3, opacity: arg ? 1 : 0.4, display: "flex", alignItems: "center", justifyContent: "center", ...txt(32, 800, "#fff"), transform: `scale(${arg ? 1.06 : 1})` }}>{c}</div>;
          })}
          <div style={{ ...abs(0, -60, 870), ...txt(22, 800, C.g3) }}>4 capacidades</div>
        </div>
        <div style={{ ...abs(0, 0, 870, 600), opacity: tC }}>
          <CnebPano tRing={0} tGrid={1} gridAt={-100} tZoom={1 - tOut} tFoco={1} tTag={1} focoColor={O} markColor={O} tagText="Regularidad, equivalencia y cambio" />
        </div>
      </div>
    );
    return (
      <PanoCard mini={0.5} cardAt={cardAt} pano={pano} card={
        <DocCard title="Currículo Nacional (MINEDU)" color={O} at={cardAt} rows={[
          { at: cardAt, label: "Estándar", body: <Pill at={cardAt} color={O} underline={ramp(f, cardAt + 10, 20)}>explicar, con ejemplos, cuándo no tienen una sola solución</Pill> },
          { at: cue("Una"), label: "Se activa con", body: "el cierre del bimestre" },
          { at: cue("Una") + 10, label: "Ve", body: "la competencia registrada (SIAGIE)" },
          { at: cue("cambia"), label: "Decide", body: "el Currículo no cambia; cambia cómo el colegio lo aplica" },
        ]} />
      } />
    );
  },
  chrome: (f, cue) => {
    const b = upB(1)(f);
    return { ...b, chips: b.chips.map((c) => (c.layer === 1 ? { ...c, color: mixHex(GRAY, O, ramp(f, cue("Currículo"), 12)) } : c)) };
  },
};

// ───────── Part 4 · Cierre ─────────
const ROWS: [string, string, string][] = [
  ["Docente", "Cada clase", "Lee la tarjeta y reenseña"],
  ["Coordinación", "Mensual", "Compara secciones y activa refuerzo"],
  ["El colegio", "Mensual", "Revisa el cuaderno"],
  ["Equipo directivo", "Julio y diciembre", "Ajusta programación, PCI y PEI"],
];
const S18: SceneSpec = {
  Stage: ({ cue }) => {
    const f = useCurrentFrame();
    const r0 = cue("evidencia");
    const fin = cue("Así");
    const cell = (s: string, w: number, st: React.CSSProperties = {}) => <div style={{ width: w, padding: "14px 18px", ...txt(22, 600), ...st }}>{s}</div>;
    return (
      <>
        <div style={{ ...abs(940, 150, 870), background: "#fff", borderRadius: 18, boxShadow: "0 10px 30px rgba(19,35,58,0.10)", overflow: "hidden" }}>
          <Reveal at={10}><div style={{ display: "flex", background: C.navy }}>{cell("Responsable", 260, { color: "#fff", fontWeight: 800 })}{cell("Cuándo", 230, { color: "#fff", fontWeight: 800 })}{cell("Qué hace", 380, { color: "#fff", fontWeight: 800 })}</div></Reveal>
          {ROWS.map(([a, b, c], i) => (
            <Reveal key={a} at={r0 + i * 18}>
              <div style={{ display: "flex", borderTop: `1px solid ${C.tile}` }}>{cell(a, 260, { fontWeight: 800 })}{cell(b, 230, { color: C.muted })}{cell(c, 380)}</div>
            </Reveal>
          ))}
        </div>
        <div style={{ ...abs(940, 600, 870) }}>
          <Reveal at={cue("Cada")}>
            <div style={txt(38, 800, C.navy)}>Las decisiones bajan. <span style={{ color: O }}>La evidencia sube.</span></div>
          </Reveal>
          <Reveal at={fin}><div style={{ ...txt(34, 700, C.ink), marginTop: 18 }}>Así debería funcionar.</div></Reveal>
        </div>
      </>
    );
  },
  chrome: () => ({
    funnel: 1, barColor: lc, active: null, activeT: 0, visited: [], glows: [],
    chips: ALL.map((l) => ({ layer: l, t: 1, color: l % 2 ? lc(l) : O })),
    rail: { mode: "down", from: C.cyan, to: C.navy, speed: 1.6, dx: -14 },
    rail2: { mode: "up", from: O, to: O, speed: 1.6, dx: 14 },
    header: "Parte 4 · Cierre", route: { label: "▼ Decisiones · ▲ Evidencia", color: C.navy }, ficticios: false,
  }),
};

export const SCENES234: Record<string, SceneSpec> = { S09, T09, S10, S11, S12, S13, S14, S15, S16, S17, S18 };
