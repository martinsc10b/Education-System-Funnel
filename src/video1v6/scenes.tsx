// Scene illustrations for the right 60 % of the frame, one per narration clip (V00–V10).
// Every reveal is cued from the real word timings: cue("word") is the local frame where that word is spoken.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Card, Check, Icon, Peru, Person, Room, School, Tag } from "./art";
import { fade, K, L, SANS, span } from "./theme";

export type Cue = (needle: string, nth?: number) => number;
export type SceneProps = { cue: Cue; dur: number };

const Abs: React.FC<{ x: number; y: number; o?: number; dy?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ x, y, o = 1, dy = 0, style, children }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translateY(${(1 - o) * dy}px)`, ...style }}>{children}</div>
);

const Title: React.FC<{ eyebrow: string; title: string; color?: string }> = ({ eyebrow, title, color = K.navy }) => (
  <Abs x={L.sceneX} y={L.titleY} style={{ fontFamily: SANS }}>
    <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: 2, color: K.gray }}>{eyebrow}</div>
    <div style={{ fontSize: 52, fontWeight: 800, color, marginTop: 6, whiteSpace: "nowrap" }}>{title}</div>
  </Abs>
);

const Eq: React.FC<{ children: React.ReactNode; size?: number; color?: string }> = ({ children, size = 34, color = K.ink }) => (
  <div style={{ fontFamily: SANS, fontSize: size, fontWeight: 600, color, fontVariantNumeric: "tabular-nums", letterSpacing: 0.5 }}>{children}</div>
);

export const CRITERIA = [
  "Explica qué significan las soluciones y distingue los tipos de sistema",
  "Selecciona y aplica procedimientos algebraicos",
  "Comprueba sus resultados y explica sus procedimientos",
];
const Criterion: React.FC<{ n: number; lit?: number; small?: boolean }> = ({ n, lit = 0, small }) => (
  <div style={{ display: "flex", alignItems: "center", gap: small ? 10 : 16, height: "100%", padding: small ? "0 14px" : "0 20px", boxSizing: "border-box", borderRadius: 14, fontFamily: SANS, background: lit > 0 ? `rgba(255,106,20,${0.12 + 0.88 * lit})` : K.card, boxShadow: lit > 0 ? `0 8px 24px rgba(255,106,20,${0.35 * lit})` : "0 6px 20px rgba(0,46,93,0.08)", transform: `scale(${1 + 0.04 * lit})` }}>
    <div style={{ flex: "0 0 auto", width: small ? 30 : 38, height: small ? 30 : 38, borderRadius: 19, background: lit > 0.5 ? "#fff" : K.orange, color: lit > 0.5 ? K.orange : "#fff", fontWeight: 800, fontSize: small ? 16 : 20, display: "flex", alignItems: "center", justifyContent: "center" }}>{n}</div>
    <div style={{ fontSize: small ? 17 : 23, fontWeight: 700, lineHeight: 1.2, color: lit > 0.5 ? "#fff" : K.ink }}>{CRITERIA[n - 1]}</div>
  </div>
);

// ── 0 · Apertura ────────────────────────────────────────────────────────────────
const V00: React.FC<SceneProps> = ({ cue }) => {
  const f = useCurrentFrame();
  return (
    <>
      <Title eyebrow="COLEGIO SAN PÍO X" title="Toda decisión llega al aula" />
      <Abs x={L.sceneX} y={L.bodyY} o={fade(f, 3, 12)} dy={16}>
        <Room carmen={{ o: 1, pose: "point" }} board={
          <div style={{ padding: "34px 40px", fontFamily: SANS, color: "#fff" }}>
            <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: 2, opacity: 0.75 }}>ÁLGEBRA · 4.° A</div>
            <div style={{ fontSize: 44, fontWeight: 800, lineHeight: 1.15, marginTop: 18 }}>Sistemas de ecuaciones lineales</div>
          </div>
        } />
      </Abs>
      <Abs x={L.sceneX} y={L.bodyY + 498} o={fade(f, cue("Veamos"), 10)} dy={10}><Tag>Lunes 21 de septiembre · 4.° A</Tag></Abs>
    </>
  );
};

// ── 1 · Currículo Nacional ──────────────────────────────────────────────────────
const V01: React.FC<SceneProps> = ({ cue }) => {
  const f = useCurrentFrame();
  const tCard = fade(f, cue("ejemplo"), 12), t31 = fade(f, cue("treinta"), 12);
  const TAGS: [string, string, number, number][] = [["Ministerio", "Ministerio", 70, 150], ["DRE", "dirección", 150, 238], ["UGEL", "UGEL", 96, 318]];
  return (
    <>
      <Title eyebrow="01 · EL MARCO COMÚN" title="Currículo Nacional" />
      <Abs x={L.sceneX + 40} y={L.bodyY} o={fade(f, 3, 14)} dy={16}><Peru w={300} /></Abs>
      {TAGS.map(([label, word, x, y]) => {
        const t = fade(f, cue(word), 10);
        return (
          <Abs key={label} x={L.sceneX + x} y={L.bodyY + y} o={t} style={{ transform: `scale(${0.7 + 0.3 * t})`, transformOrigin: "left center" }}>
            <Tag color={K.navy} bg="#fff" style={{ fontSize: 22, boxShadow: "0 6px 16px rgba(0,0,0,0.18)" }}>{label}</Tag>
          </Abs>
        );
      })}
      <Abs x={L.sceneX + 150} y={L.bodyY + 400} o={fade(f, cue("Perú"), 10)} style={{ fontFamily: SANS, fontSize: 22, fontWeight: 800, letterSpacing: 3, color: K.navy }}>PERÚ</Abs>
      <Abs x={L.sceneX + 420} y={L.bodyY + 10} o={t31} dy={14} style={{ fontFamily: SANS, display: "flex", alignItems: "baseline", gap: 14 }}>
        <div style={{ fontSize: 96, fontWeight: 800, color: K.orange, fontVariantNumeric: "tabular-nums" }}>{Math.round(31 * fade(f, cue("treinta"), 24))}</div>
        <div style={{ fontSize: 36, fontWeight: 800, color: K.navy }}>competencias</div>
      </Abs>
      <Abs x={L.sceneX + 420} y={L.bodyY + 170} o={tCard} dy={20}>
        <Card style={{ width: 480, padding: "26px 30px" }}>
          <Tag color={K.orange} bg="#FFE9DC" style={{ fontSize: 16, letterSpacing: 1.5 }}>COMPETENCIA</Tag>
          <div style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.22, marginTop: 16, color: K.navy }}>Resuelve problemas de regularidad, equivalencia y cambio</div>
        </Card>
      </Abs>
    </>
  );
};

// ── 2 · PEI y PAT ──────────────────────────────────────────────────────────────
const V02: React.FC<SceneProps> = ({ cue }) => {
  const f = useCurrentFrame();
  const tPat = fade(f, cue("PAT"), 12);
  return (
    <>
      <Title eyebrow="02 · NUESTRA IDENTIDAD" title="PEI" />
      <Abs x={L.sceneX} y={L.bodyY + 20} o={fade(f, 3, 14)} dy={16}>
        <School w={560} plaque={
          <div style={{ opacity: fade(f, cue("visión"), 10), background: "#fff", borderRadius: 12, padding: "12px 0", textAlign: "center", fontSize: 26, fontWeight: 800, color: K.navy, boxShadow: "0 6px 18px rgba(0,46,93,0.10)" }}>Visión · Misión · Valores</div>
        } />
      </Abs>
      <Abs x={L.sceneX + 610} y={L.bodyY + 30} o={tPat} dy={18}>
        <Card style={{ width: 290, padding: 18 }}>
          <div style={{ background: K.navy, color: "#fff", borderRadius: 10, padding: "10px 0", textAlign: "center", fontSize: 24, fontWeight: 800 }}>Año escolar 2027</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
            {["I", "II", "III", "IV"].map((b, i) => (
              <div key={b} style={{ opacity: fade(f, cue("PAT") + 6 + i * 4, 8), background: K.soft, borderRadius: 10, padding: "12px 0", textAlign: "center" }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: K.navy }}>{b}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: K.gray }}>bimestre</div>
              </div>
            ))}
          </div>
        </Card>
      </Abs>
    </>
  );
};

// ── 3 · PCI ─────────────────────────────────────────────────────────────────────
const V03: React.FC<SceneProps> = ({ cue }) => {
  const f = useCurrentFrame();
  const items: [string, "target" | "bulb" | "clock" | "check", string][] = [
    ["Competencias", "target", "competencias"],
    ["Enfoque STEAM+H", "bulb", "enfoque"],
    ["Horas", "clock", "horas"],
    ["Evaluación", "check", "evaluar"],
  ];
  return (
    <>
      <Title eyebrow="03 · DECISIONES PEDAGÓGICAS" title="PCI" />
      <Abs x={L.sceneX} y={L.bodyY + 10} o={fade(f, 3, 14)} dy={16}>
        <Card style={{ width: 900, padding: "30px 34px", borderTop: `8px solid ${K.navy}` }}>
          <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: 2, color: K.gray }}>DOCUMENTO DEL COLEGIO</div>
          <div style={{ fontSize: 40, fontWeight: 800, color: K.navy, marginTop: 6 }}>Proyecto Curricular Institucional</div>
          <div style={{ display: "flex", gap: 18, marginTop: 30 }}>
            {items.map(([label, icon, word]) => {
              const t = fade(f, cue(word), 10);
              return (
                <div key={label} style={{ flex: 1, height: 190, borderRadius: 16, background: K.soft, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, opacity: 0.25 + 0.75 * t, transform: `scale(${0.94 + 0.06 * t})` }}>
                  <Icon kind={icon} color={t > 0.5 ? K.navy : K.gray} />
                  <div style={{ fontSize: 23, fontWeight: 800, color: t > 0.5 ? K.navy : K.gray, textAlign: "center" }}>{label}</div>
                </div>
              );
            })}
          </div>
        </Card>
      </Abs>
    </>
  );
};

// ── 4 · Programación anual ──────────────────────────────────────────────────────
const V04: React.FC<SceneProps> = ({ cue }) => {
  const f = useCurrentFrame();
  const CELL = 28, x0 = L.sceneX, y0 = L.bodyY + 150;
  const tLin = fade(f, cue("después"), 10), t26 = fade(f, cue("veintiséis"), 10);
  const fill = (w: number) => (w === 26 && t26 > 0 ? K.orange : w >= 22 && w <= 25 && tLin > 0 ? K.navy : "#DDE4EB");
  return (
    <>
      <Title eyebrow="04 · EL AÑO SEMANA A SEMANA" title="Programación anual" />
      <Abs x={x0} y={L.bodyY + 30} o={fade(f, cue("Matemática"), 10)}><Tag>Matemática · 4.° de secundaria · 38 semanas</Tag></Abs>
      {Array.from({ length: 38 }, (_, i) => {
        const w = i + 1;
        const o = fade(f, 4 + i * 1.2, 8);
        const big = w === 26 ? t26 : 0;
        return (
          <div key={w} style={{ position: "absolute", left: x0 + i * CELL, top: y0, width: CELL - 5, height: 70, borderRadius: 6, opacity: o, background: fill(w), color: (w >= 22 && w <= 25 && tLin > 0.5) || big > 0.5 ? "#fff" : K.gray, fontFamily: SANS, fontSize: 13, fontWeight: 700, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 8, boxSizing: "border-box", transform: `scale(${1 + 0.3 * big})`, zIndex: big ? 2 : 1 }}>{w}</div>
        );
      })}
      <Abs x={x0 + 21 * CELL - 40} y={y0 - 54} o={tLin} dy={8} style={{ fontFamily: SANS, fontSize: 24, fontWeight: 800, color: K.navy, whiteSpace: "nowrap" }}>Ecuaciones lineales</Abs>
      <Abs x={x0 + 25 * CELL - 120} y={y0 + 108} o={t26} dy={12}>
        <Card style={{ padding: "16px 22px", borderLeft: `8px solid ${K.orange}` }}>
          <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: 2, color: K.orange }}>SEMANA 26</div>
          <div style={{ fontSize: 30, fontWeight: 800, color: K.navy, whiteSpace: "nowrap" }}>Sistemas de ecuaciones</div>
        </Card>
      </Abs>
    </>
  );
};

// ── 5 · Unidad didáctica ────────────────────────────────────────────────────────
const V05: React.FC<SceneProps> = ({ cue }) => {
  const f = useCurrentFrame();
  const UNITS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
  const t6 = fade(f, cue("seis"), 12), tCrit = cue("criterios"), tBim = cue("bimestres"), tUni = cue("unidades");
  return (
    <>
      <Title eyebrow="05 · EL RETO DE LA UNIDAD" title="Unidad didáctica" />
      {[0, 1, 2, 3].map((b) => (
        <Abs key={b} x={L.sceneX + b * 262} y={L.bodyY} o={fade(f, tBim - 6 + b * 4, 10)} style={{ fontFamily: SANS }}>
          <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: 1.5, color: K.gray, marginBottom: 10 }}>BIMESTRE {b + 1}</div>
          <div style={{ display: "flex", gap: 10 }}>
            {[0, 1].map((k) => {
              const u = b * 2 + k, big = u === 5 ? t6 : 0;
              return (
                <div key={u} style={{ opacity: fade(f, tUni + u * 2, 8) * (u === 5 ? 1 : 1 - 0.55 * t6), width: 108, height: 72, borderRadius: 12, background: big > 0 ? `rgba(255,106,20,${big})` : K.navy, color: "#fff", fontSize: 28, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.18 * big})`, boxShadow: big ? `0 10px 26px rgba(255,106,20,${0.4 * big})` : "none" }}>{UNITS[u]}</div>
              );
            })}
          </div>
        </Abs>
      ))}
      <Abs x={L.sceneX} y={L.bodyY + 132} o={t6} dy={16}>
        <Card style={{ width: 900, padding: "18px 26px", borderLeft: `8px solid ${K.orange}` }}>
          <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: 2, color: K.orange }}>UNIDAD VI · RETO</div>
          <div style={{ fontSize: 34, fontWeight: 800, color: K.navy, marginTop: 4 }}>Del reto al aprendizaje: Jugamos para crecer</div>
        </Card>
      </Abs>
      <Abs x={L.sceneX} y={L.bodyY + 262} o={fade(f, tCrit, 8)} style={{ fontFamily: SANS, fontSize: 16, fontWeight: 700, letterSpacing: 2, color: K.gray }}>CRITERIOS DE EVALUACIÓN</Abs>
      {[1, 2, 3].map((n) => (
        <Abs key={n} x={L.sceneX} y={L.bodyY + 292 + (n - 1) * 70} o={fade(f, tCrit + 4 + (n - 1) * 8, 10)} dy={12} style={{ width: 880, height: 60 }}><Criterion n={n} /></Abs>
      ))}
    </>
  );
};

// ── 6 · Cuaderno de trabajo ─────────────────────────────────────────────────────
const Exercise: React.FC = () => (
  <div style={{ fontFamily: SANS }}>
    <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: 1.5, color: K.orange }}>EJERCICIO 1</div>
    <div style={{ fontSize: 22, fontWeight: 600, color: K.ink, marginTop: 6 }}>Resuelve el sistema y clasifícalo.</div>
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 18 }}>
      <div style={{ fontSize: 96, fontWeight: 200, color: K.navy, lineHeight: 0.8 }}>{"{"}</div>
      <div><Eq size={36}>x + y = 7</Eq><Eq size={36}>2x − y = 5</Eq></div>
    </div>
    <div style={{ fontSize: 21, fontWeight: 600, color: K.ink, marginTop: 20, lineHeight: 1.45 }}>
      <div><b style={{ color: K.orange }}>a)</b> Resuelve por reducción.</div>
      <div><b style={{ color: K.orange }}>b)</b> Comprueba tu resultado en las dos ecuaciones.</div>
      <div><b style={{ color: K.orange }}>c)</b> ¿Es compatible o incompatible? Explica.</div>
    </div>
  </div>
);
const V06: React.FC<SceneProps> = ({ cue }) => {
  const f = useCurrentFrame();
  const open = fade(f, 3, 16);
  const t84 = fade(f, cue("ochenta"), 10), tW = fade(f, cue("veintiséis"), 10);
  return (
    <>
      <Title eyebrow="06 · EL MATERIAL QUE ACOMPAÑA" title="Cuaderno de trabajo" />
      <Abs x={L.sceneX} y={L.bodyY} o={open} dy={18}>
        <div style={{ width: 900, height: 470, borderRadius: 20, background: K.navy, padding: 14, boxSizing: "border-box", display: "flex", gap: 10 }}>
          <div style={{ flex: 1, background: "#fff", borderRadius: "12px 4px 4px 12px", padding: "26px 30px", boxSizing: "border-box", fontFamily: SANS, position: "relative" }}>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 1, color: K.gray }}>Matemática · Semana 26 · Sistemas de ecuaciones · 4.° A</div>
            <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: 2, color: K.navy, marginTop: 34 }}>CUADERNO DE TRABAJO</div>
            <div style={{ fontSize: 46, fontWeight: 800, marginTop: 12, color: K.navy, display: "inline-block", padding: "0 10px", marginLeft: -10, borderRadius: 10, background: `rgba(255,106,20,${0.18 * tW})` }}>Semana 26</div>
            <div style={{ fontSize: 34, fontWeight: 700, color: K.ink, marginTop: 6 }}>Sistemas de ecuaciones</div>
            <div style={{ marginTop: 22 }}><Tag color={K.orange} bg="#FFE9DC">4.° A</Tag></div>
            <div style={{ position: "absolute", left: 30, bottom: 26, opacity: fade(f, cue("dos"), 10) }}><Tag color="#fff" bg={K.navy}>Se entrega dos veces al año</Tag></div>
          </div>
          <div style={{ flex: 1.15, background: "#fff", borderRadius: "4px 12px 12px 4px", padding: "26px 30px", boxSizing: "border-box", position: "relative" }}>
            <Exercise />
            <div style={{ position: "absolute", right: 24, bottom: 18, fontFamily: SANS, fontSize: 30, fontWeight: 800, color: K.orange, opacity: 0.25 + 0.75 * t84, transform: `scale(${1 + 0.35 * t84 * (1 - fade(f, cue("ochenta") + 16, 12))})` }}>84</div>
          </div>
        </div>
      </Abs>
    </>
  );
};

// ── 7 · Sesión ─────────────────────────────────────────────────────────────────
const PURPOSE = "resolver sistemas de ecuaciones y clasificarlos como compatibles o incompatibles.";
const V07: React.FC<SceneProps> = ({ cue }) => {
  const f = useCurrentFrame();
  const a = cue("propósito"), b = cue("incompatibles") + 12;
  const n = Math.round(PURPOSE.length * span(f, a + 6, b));
  return (
    <>
      <Title eyebrow="07 · EL ENCUENTRO EN EL AULA" title="La sesión de Carmen" />
      <Abs x={L.sceneX} y={L.bodyY} o={fade(f, 3, 12)} dy={16}>
        <Room crest={1} clock={1} criteria={1} books={1} carmen={{ o: 1, pose: "point" }} board={
          <div style={{ padding: "30px 36px", fontFamily: SANS, color: "#fff", fontSize: 31, fontWeight: 700, lineHeight: 1.3 }}>
            <span style={{ color: "#FFB48A", opacity: fade(f, a, 8) }}>Propósito: </span>{PURPOSE.slice(0, n)}
          </div>
        } />
      </Abs>
      <Abs x={L.sceneX} y={L.bodyY + 498} o={fade(f, cue("Carmen"), 10)} dy={10}><Tag color={K.orange} bg="#FFE9DC">Profesora Carmen · Matemática</Tag></Abs>
    </>
  );
};

// ── 8 · Estudiante ──────────────────────────────────────────────────────────────
const Graph: React.FC<{ t: number }> = ({ t }) => (
  <svg width="250" height="190" viewBox="0 0 250 190">
    {Array.from({ length: 6 }, (_, i) => Array.from({ length: 5 }, (_, j) => <circle key={`${i}${j}`} cx={20 + i * 42} cy={15 + j * 40} r="2.5" fill="#5D7A99" />))}
    <path d={`M20 150 L${20 + 200 * t} ${150 - 130 * t}`} stroke="#fff" strokeWidth="5" strokeLinecap="round" />
    <path d={`M60 180 L${60 + 180 * t} ${180 - 117 * t}`} stroke={K.orange} strokeWidth="5" strokeLinecap="round" />
  </svg>
);
const V08: React.FC<SceneProps> = ({ cue }) => {
  const f = useCurrentFrame();
  const zAt = cue("comprueba");
  // Zoom in on the cuaderno de trabajo (~1 s), hold through «error», then back to Bruno at the board.
  const zOut = cue("error") + 40;
  const z = interpolate(f, [zAt, zAt + 30, zOut, zOut + 12], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lit1 = fade(f, cue("Explica"), 10), lit3 = fade(f, zAt, 10);
  const tErr = fade(f, cue("error"), 10), tOk = fade(f, cue("resultado"), 14);
  return (
    <>
      <Title eyebrow="08 · EL APRENDIZAJE SE HACE VISIBLE" title="Bruno, estudiante de 4.° A" />
      <Abs x={L.sceneX} y={L.bodyY} o={fade(f, 3, 12)} dy={16}>
        <Room crest={1} clock={1} criteria={1} books={1} carmen={{ o: 1, pose: "stand" }} bruno={1} board={
          <div style={{ display: "flex", padding: "22px 26px", gap: 20, fontFamily: SANS, color: "#fff" }}>
            <div style={{ width: 230 }}>
              <div style={{ fontSize: 20, fontWeight: 700, opacity: 0.8 }}>Sistemas de ecuaciones</div>
              <div style={{ marginTop: 18 }}><Eq size={30} color="#fff">x + y = 3</Eq><Eq size={30} color="#FFB48A">2x + 2y = 10</Eq></div>
              <div style={{ marginTop: 18, opacity: fade(f, cue("solución"), 10) }}><Tag color="#fff" bg={K.orange}>No tiene solución</Tag></div>
            </div>
            <Graph t={span(f, 6, cue("sistema") + 6)} />
          </div>
        } />
      </Abs>
      {[1, 2, 3].map((n) => (
        <Abs key={n} x={L.sceneX + (n - 1) * 306} y={L.bodyY + 494} o={fade(f, 6, 10)} style={{ width: 288, height: 92 }}>
          <Criterion n={n} small lit={n === 1 ? lit1 : n === 3 ? lit3 : 0} />
        </Abs>
      ))}
      {z > 0 && (
        <div style={{ position: "absolute", left: L.sceneX + 340, top: L.bodyY, width: 560, transformOrigin: "85% 70%", transform: `scale(${0.15 + 0.85 * z})`, opacity: Math.min(1, z * 3) }}>
          <Card style={{ padding: "22px 30px", boxShadow: "0 24px 60px rgba(0,46,93,0.28)" }}>
            <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: 1.5, color: K.gray }}>CUADERNO DE TRABAJO · PÁGINA 84 · BRUNO</div>
            <div style={{ marginTop: 14 }}><Eq>x + y = 3</Eq><Eq>2x + 2y = 10</Eq></div>
            <div style={{ fontSize: 21, fontWeight: 600, color: K.gray, marginTop: 12 }}>Multiplico la primera por 2:</div>
            <Eq>2x + 2y = 6</Eq>
            <div style={{ fontSize: 21, fontWeight: 600, color: K.gray, marginTop: 12 }}>Resto las dos ecuaciones:</div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 10 }}>
              <Eq>0 =</Eq>
              <div style={{ position: "relative" }}>
                <Eq color={tErr > 0.5 ? K.gray : K.ink}>16</Eq>
                <div style={{ position: "absolute", left: -12, top: -6, right: -12, bottom: -6, borderRadius: "50%", boxShadow: `0 0 0 4px ${K.orange}`, opacity: tErr }} />
                <div style={{ position: "absolute", left: -4, right: -4, top: "52%", height: 4, background: K.orange, transform: "rotate(-12deg)", opacity: tErr }} />
              </div>
              <div style={{ opacity: tErr, transform: `translateY(${(1 - tErr) * 6}px)` }}><Eq color={K.orange}>4</Eq></div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14, padding: "10px 14px", borderRadius: 12, background: `rgba(255,106,20,${0.12 * tOk})` }}>
              <div style={{ fontSize: 25, fontWeight: 800, color: K.navy }}>Sin solución: incompatible</div>
              <Check t={tOk} />
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

// ── 9 · El camino de vuelta ─────────────────────────────────────────────────────
const Sheet: React.FC<{ day: string; dot: string; w?: number }> = ({ day, dot, w = 170 }) => (
  <Card style={{ width: w, height: w * 1.25, padding: 16, borderRadius: 12 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 22, height: 22, borderRadius: 11, background: dot }} />
      <div style={{ fontSize: 15, fontWeight: 700, color: K.gray }}>{day}</div>
    </div>
    {[0.9, 0.7, 0.8, 0.55].map((q, i) => <div key={i} style={{ width: `${q * 100}%`, height: 8, borderRadius: 4, background: "#DCE3EA", marginTop: 14 }} />)}
    <div style={{ marginTop: 10 }}><Check size={28} /></div>
  </Card>
);
const V09: React.FC<SceneProps> = ({ cue }) => {
  const f = useCurrentFrame();
  const swap = cue("reunir") - 4;
  const a = 1 - fade(f, swap, 9), b = fade(f, swap, 9);
  const e0 = cue("evidencias"), e1 = cue("momentos");
  const SHEETS: [string, string][] = [["Lunes", "#F28C4B"], ["Martes", "#5B8DB8"], ["Miércoles", "#7BB394"], ["Jueves", "#C27BA0"], ["Viernes", "#E2B34B"]];
  return (
    <>
      <Title eyebrow="EL CAMINO DE VUELTA" title="La evidencia mejora las decisiones" color={K.orange} />
      {a > 0 && (
        <div style={{ opacity: a }}>
          <Person x={L.sceneX + 120} y={L.bodyY + 470} s={2} shirt={K.carmen} hairLong pose="hold" o={fade(f, 3, 12)} />
          <Abs x={L.sceneX + 230} y={L.bodyY + 90} o={fade(f, cue("Bruno"), 10)} dy={12} style={{ transform: "rotate(-4deg)" }}>
            <Card style={{ width: 200, padding: 18, borderRadius: 12 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: K.navy }}>Hoja de Bruno</div>
              {[0.9, 0.75, 0.85, 0.6].map((q, i) => <div key={i} style={{ width: `${q * 100}%`, height: 8, borderRadius: 4, background: "#DCE3EA", marginTop: 14 }} />)}
              <div style={{ marginTop: 12, display: "flex", gap: 10, alignItems: "center" }}><div style={{ width: 26, height: 26, borderRadius: 13, boxShadow: `0 0 0 3px ${K.orange}` }} /><Check size={28} /></div>
            </Card>
          </Abs>
          <Abs x={L.sceneX + 480} y={L.bodyY + 120} o={fade(f, cue("Carmen"), 12)} dy={14}>
            <Card style={{ width: 420, padding: "24px 28px", borderLeft: `8px solid ${K.orange}` }}>
              <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: 2, color: K.gray }}>PRÓXIMA CLASE</div>
              <div style={{ fontSize: 30, fontWeight: 800, color: K.navy, marginTop: 6, lineHeight: 1.2 }}>Carmen revisa la siguiente sesión</div>
              <div style={{ marginTop: 16, opacity: fade(f, cue("ajustar"), 8), transform: `scale(${0.8 + 0.2 * fade(f, cue("ajustar"), 8)})`, transformOrigin: "left center" }}><Tag color="#fff" bg={K.orange}>Ajustar</Tag></div>
            </Card>
          </Abs>
        </div>
      )}
      {b > 0 && (
        <div style={{ opacity: b }}>
          {SHEETS.map(([day, dot], i) => {
            const t = fade(f, e0 + ((e1 - e0) * i) / SHEETS.length, 10);
            return (
              <Abs key={day} x={L.sceneX + 20 + i * 62} y={L.bodyY + 40 + i * 36} o={t} dy={-30} style={{ transform: `translateY(${(1 - t) * -30}px) rotate(${[-6, 3, -2, 5, -3][i]}deg)` }}>
                <Sheet day={day} dot={dot} />
              </Abs>
            );
          })}
          <Abs x={L.sceneX + 470} y={L.bodyY + 70} o={fade(f, cue("colegio"), 12)} dy={16}><School w={420} /></Abs>
        </div>
      )}
    </>
  );
};

// ── 10 · Cierre ────────────────────────────────────────────────────────────────
const Ghost: React.FC<{ x: number; y: number; w: number; h: number; o: number }> = ({ x, y, w, h, o }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: 0.5 * o, filter: "blur(2px)" }}>
    <div style={{ position: "absolute", left: w * 0.2, top: 0, width: w * 0.6, height: h * 0.18, borderRadius: 10, background: "#C8D3DE" }} />
    <div style={{ position: "absolute", left: 0, top: h * 0.22, width: w, height: h * 0.78, borderRadius: 18, background: "#D6DEE6" }} />
  </div>
);
const V10: React.FC<SceneProps> = ({ cue }) => {
  const f = useCurrentFrame();
  const g = cue("varios");
  return (
    <>
      <Title eyebrow="COLEGIO SAN PÍO X" title="Sistema de gestión pedagógica" />
      <Abs x={L.sceneX} y={L.bodyY - 6} o={fade(f, cue("decisiones"), 10)} dy={8}><Tag color="#fff" bg={K.orange}>Decisiones y aprendizajes conectados</Tag></Abs>
      <Ghost x={L.sceneX + 10} y={L.bodyY + 150} w={190} h={230} o={fade(f, g, 14)} />
      <Ghost x={L.sceneX + 690} y={L.bodyY + 120} w={200} h={250} o={fade(f, g + 6, 14)} />
      <Ghost x={L.sceneX + 240} y={L.bodyY + 400} w={170} h={160} o={fade(f, g + 12, 14)} />
      <Abs x={L.sceneX + 230} y={L.bodyY + 140} o={fade(f, 3, 14)} dy={14}>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: -40, right: -40, top: 190, height: 70, borderRadius: "50%", background: "#E7ECE4" }} />
          <School w={420} />
        </div>
      </Abs>
    </>
  );
};

export const SCENES: Record<string, React.FC<SceneProps>> = { V00, V01, V02, V03, V04, V05, V06, V07, V08, V09, V10 };
