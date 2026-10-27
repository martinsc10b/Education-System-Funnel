// Scene illustrations for Video 2 v1, one per narration clip (W00–W11), drawn in a 900-wide box.
// Every reveal is cued from the real word timings: cue("word") is the local frame where that word is spoken.
// Figures are the brief's example figures; the brújula is never a grade (no C/B/A/AD).
import React from "react";
import { useCurrentFrame } from "remotion";
import { Brujula, Card, Check, Halves, Room, Tag } from "./art";
import { fade, K, L, SANS } from "./theme";

export type Cue = (needle: string, nth?: number) => number;
export type SceneProps = { cue: Cue; dur: number };

const Abs: React.FC<{ x: number; y: number; o?: number; dy?: number; dx?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ x, y, o = 1, dy = 0, dx = 0, style, children }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(${(1 - o) * dx}px, ${(1 - o) * dy}px)`, ...style }}>{children}</div>
);

const Title: React.FC<{ eyebrow: string; title: string; color?: string }> = ({ eyebrow, title, color = K.navy }) => (
  <Abs x={L.sceneX} y={L.titleY} style={{ fontFamily: SANS }}>
    <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: 2, color: K.gray }}>{eyebrow}</div>
    <div style={{ fontSize: 52, fontWeight: 800, color, marginTop: 6, whiteSpace: "nowrap" }}>{title}</div>
  </Abs>
);

const Eq: React.FC<{ children: React.ReactNode; size?: number; color?: string; weight?: number }> = ({ children, size = 26, color = K.ink, weight = 600 }) => (
  <div style={{ fontFamily: SANS, fontSize: size, fontWeight: weight, color, fontVariantNumeric: "tabular-nums", letterSpacing: 0.4, lineHeight: 1.3 }}>{children}</div>
);
const Small: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = K.gray }) => (
  <div style={{ fontFamily: SANS, fontSize: 15, fontWeight: 700, letterSpacing: 1.6, color }}>{children}</div>
);
const Pct: React.FC<{ v: number; size?: number; color?: string }> = ({ v, size = 44, color = K.navy }) => (
  <span style={{ fontFamily: SANS, fontSize: size, fontWeight: 800, color, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{v} %</span>
);
const B = L.bodyY, X = L.sceneX;

// ── 0 · Apertura ────────────────────────────────────────────────────────────────
const W00: React.FC<SceneProps> = ({ cue }) => {
  const f = useCurrentFrame();
  return (
    <>
      <Title eyebrow="VIDEO 2 · LA BRÚJULA" title="El camino de vuelta" />
      <Abs x={X + 20} y={B + 10} o={fade(f, 3, 14)} dy={16}><Brujula size={330} value={75} t={fade(f, cue("vuelta"), 30)} /></Abs>
      <Abs x={X + 420} y={B + 40} o={fade(f, cue("decisiones"), 10)} dx={-16}><Tag color="#fff" bg={K.navy} style={{ fontSize: 26, padding: "10px 20px" }}>Las decisiones bajan</Tag></Abs>
      <Abs x={X + 420} y={B + 110} o={fade(f, cue("vuelta"), 10)} dx={-16}><Tag color={K.navy} bg={K.cyan} style={{ fontSize: 26, padding: "10px 20px" }}>La evidencia sube</Tag></Abs>
      <Abs x={X + 420} y={B + 200} o={fade(f, cue("cómo"), 12)} dy={14}>
        <Card style={{ width: 470, padding: "24px 28px", borderLeft: `8px solid ${K.cyan}` }}>
          <Small>LA PREGUNTA</Small>
          <div style={{ fontSize: 32, fontWeight: 800, color: K.navy, marginTop: 8, lineHeight: 1.22 }}>¿Está llegando la estrategia del colegio a los estudiantes?</div>
        </Card>
      </Abs>
    </>
  );
};

// ── 1 · Las dos mitades ─────────────────────────────────────────────────────────
const Criterion: React.FC<{ text: string; o: number; color: string }> = ({ text, o, color }) => (
  <div style={{ opacity: o, transform: `translateX(${(1 - o) * 30}px)`, display: "flex", gap: 10, alignItems: "flex-start", background: "#F5F7FA", borderRadius: 10, padding: "10px 12px", marginTop: 10 }}>
    <div style={{ flex: "0 0 auto", width: 12, height: 12, borderRadius: 6, background: color, marginTop: 6 }} />
    <div style={{ fontSize: 19, fontWeight: 700, lineHeight: 1.25, color: K.ink }}>{text}</div>
  </div>
);
const W01: React.FC<SceneProps> = ({ cue }) => {
  const f = useCurrentFrame();
  const split = fade(f, cue("mitades"), 14);
  const tK = fade(f, cue("Conocimiento"), 10), tE = fade(f, cue("Enfoque"), 10);
  return (
    <>
      <Title eyebrow="01 · EL PROPÓSITO DE LA SESIÓN" title="Las dos mitades" />
      <Abs x={X} y={B} o={fade(f, 3, 12)} dy={14}>
        <div style={{ width: 900, height: 200, borderRadius: 16, background: K.navy, boxShadow: "0 0 0 7px #C9D3DD", display: "flex", padding: "24px 30px", boxSizing: "border-box", gap: 30, fontFamily: SANS, color: "#fff" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: 2, opacity: 0.75 }}>PROFESORA CARMEN · 4.° A</div>
            <div style={{ fontSize: 27, fontWeight: 700, lineHeight: 1.3, marginTop: 12 }}>
              <span style={{ color: "#FFB48A" }}>Propósito: </span>
              <span style={{ background: `rgba(103,210,223,${0.35 * tK})`, borderRadius: 6 }}>resolver sistemas de ecuaciones</span> y{" "}
              <span style={{ background: `rgba(255,106,20,${0.4 * tE})`, borderRadius: 6 }}>clasificarlos como compatibles o incompatibles</span>
            </div>
          </div>
          <div style={{ flex: "0 0 auto", borderLeft: "none", paddingTop: 30 }}>
            <Eq size={30} color="#fff">x + 2y = 4</Eq>
            <Eq size={30} color="#FFB48A">2x + 4y = 10</Eq>
          </div>
        </div>
      </Abs>
      <Abs x={X} y={B + 226} o={split} style={{ fontFamily: SANS }}><Small>LISTA DE COTEJO · SESIÓN 6</Small></Abs>
      <Abs x={X + 225 * (1 - split)} y={B + 256} o={split}>
        <Card style={{ width: 440, height: 290, padding: "18px 22px", borderTop: `8px solid ${K.navy}`, opacity: 0.35 + 0.65 * tK }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}><Halves size={40} k={1} /><div style={{ fontSize: 28, fontWeight: 800, color: K.navy }}>Conocimiento</div></div>
          <div style={{ fontSize: 19, fontWeight: 600, color: K.gray, marginTop: 6 }}>Resolver el sistema</div>
          <Criterion text="Selecciona y aplica procedimientos algebraicos" o={fade(f, cue("resolver"), 12)} color={K.navy} />
        </Card>
      </Abs>
      <Abs x={X + 460 - 235 * (1 - split)} y={B + 256} o={split}>
        <Card style={{ width: 440, height: 290, padding: "18px 22px", borderTop: `8px solid ${K.orange}`, opacity: 0.35 + 0.65 * tE }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}><Halves size={40} e={1} /><div style={{ fontSize: 28, fontWeight: 800, color: K.navy }}>Enfoque por competencias</div></div>
          <div style={{ fontSize: 19, fontWeight: 600, color: K.gray, marginTop: 6 }}>Explicar y comprobar · <b style={{ color: K.orange }}>las dos</b></div>
          <Criterion text="Explica el significado de las soluciones y distingue los tipos de sistema" o={fade(f, cue("explicar"), 12)} color={K.orange} />
          <Criterion text="Comprueba resultados y explica procedimientos" o={fade(f, cue("comprobarla"), 12)} color={K.orange} />
        </Card>
      </Abs>
    </>
  );
};

// ── 2 · Bruno y Ana ─────────────────────────────────────────────────────────────
// Two parallel lines, slope −½, intercepts 2 and 2,5 (x from −1 to 6, y from −1 to 3).
const Graph: React.FC<{ t: number }> = ({ t }) => {
  const W = 168, H = 120, px = (x: number) => ((x + 1) / 7) * W, py = (y: number) => H - ((y + 1) / 4) * H;
  const seg = (b: number) => `M${px(-1)} ${py(0.5 + b)} L${px(-1 + 7 * t)} ${py(0.5 + b - 3.5 * t)}`;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ background: "#F5F7FA", borderRadius: 10 }}>
      {Array.from({ length: 8 }, (_, i) => Array.from({ length: 5 }, (_, j) => <circle key={`${i}${j}`} cx={px(i - 1)} cy={py(j - 1)} r={i === 1 || j === 1 ? 2.2 : 1.4} fill={i === 1 || j === 1 ? K.navy : "#B9C4D0"} />))}
      <path d={seg(2)} stroke={K.navy} strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d={seg(2.5)} stroke={K.orange} strokeWidth="4" strokeLinecap="round" fill="none" />
    </svg>
  );
};
const Chip: React.FC<{ ok: boolean; children: React.ReactNode }> = ({ ok, children }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 999, background: ok ? "#E3F6F8" : "#F0F2F5", color: ok ? K.navy : K.gray, fontFamily: SANS, fontSize: 16, fontWeight: 800 }}>
    {children}{ok ? <Check size={18} color={K.navy} /> : <span style={{ fontWeight: 700 }}>· pendiente</span>}
  </span>
);
const Page: React.FC<{ who: string; o: number; same: number; children: React.ReactNode; badge: React.ReactNode }> = ({ who, o, same, children, badge }) => (
  <Card style={{ width: 440, height: 420, padding: "16px 22px", opacity: o, transform: `translateY(${(1 - o) * 18}px)`, position: "relative" }}>
    <Small>CUADERNO DE TRABAJO · {who}</Small>
    <div style={{ marginTop: 8 }}>
      <Eq>x + 2y = 4</Eq>
      <Eq>2x + 4y = 10</Eq>
      <div style={{ fontSize: 15, fontWeight: 600, color: K.gray, marginTop: 4 }}>Multiplico la primera por 2:</div>
      <Eq>2x + 4y = 8</Eq>
      <div style={{ fontSize: 15, fontWeight: 600, color: K.gray, marginTop: 4 }}>Resto las dos ecuaciones:</div>
      <Eq>0 = 2</Eq>
      <div style={{ display: "inline-block", marginTop: 4, padding: "2px 8px", marginLeft: -8, borderRadius: 8, background: `rgba(103,210,223,${0.4 * same})` }}><Eq weight={800} color={K.navy}>No tiene solución</Eq></div>
    </div>
    {children}
    <div style={{ position: "absolute", right: 14, top: 10 }}>{badge}</div>
  </Card>
);
const W02: React.FC<SceneProps> = ({ cue }) => {
  const f = useCurrentFrame();
  const tB = fade(f, 3, 12), tA = fade(f, cue("Ana"), 12);
  const same = fade(f, cue("misma"), 10), why = fade(f, cue("razonamiento"), 10);
  const t100 = fade(f, cue("cien"), 10), t50 = fade(f, cue("cincuenta"), 10);
  const Badge: React.FC<{ v: number; t: number }> = ({ v, t }) => (
    <div style={{ opacity: t, transform: `scale(${0.7 + 0.3 * t})`, background: K.navy, color: "#fff", borderRadius: 12, padding: "3px 10px" }}><Pct v={v} size={24} color="#fff" /></div>
  );
  return (
    <>
      <Title eyebrow="02 · LA MISMA RESPUESTA" title="Bruno y Ana" />
      <Abs x={X} y={B - 6}>
        <Page who="BRUNO" o={tB} same={same} badge={<Badge v={100} t={t100} />}>
          <div style={{ position: "absolute", right: 20, top: 120 }}><Graph t={fade(f, cue("gráfica") - 6, 24)} /></div>
          <div style={{ fontSize: 17, fontWeight: 700, fontStyle: "italic", color: K.ink, lineHeight: 1.3, marginTop: 8, padding: "4px 6px", marginLeft: -6, borderRadius: 8, background: `rgba(255,106,20,${0.16 * why})`, opacity: fade(f, cue("paralelas"), 10) }}>«Las rectas son paralelas: nunca se cruzan. Es un sistema incompatible.»</div>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}><Chip ok>Conocimiento</Chip><Chip ok>Enfoque</Chip></div>
        </Page>
      </Abs>
      <Abs x={X + 460} y={B - 6}>
        <Page who="ANA" o={tA} same={same} badge={<Badge v={50} t={t50} />}>
          <div style={{ fontSize: 17, fontWeight: 700, fontStyle: "italic", color: K.ink, lineHeight: 1.3, marginTop: 8, padding: "4px 6px", marginLeft: -6, borderRadius: 8, background: `rgba(255,106,20,${0.16 * why})`, opacity: fade(f, cue("explicar"), 10) }}>«porque salió cero igual a dos»</div>
          <div style={{ display: "flex", gap: 8, marginTop: 30 }}><Chip ok>Conocimiento</Chip><Chip ok={false}>Enfoque</Chip></div>
        </Page>
      </Abs>
      <Abs x={X} y={B + 432} o={same} dy={12}>
        <Card style={{ width: 900, padding: "14px 22px", borderLeft: `8px solid ${K.orange}` }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: K.ink, lineHeight: 1.3 }}><b style={{ color: K.navy }}>Lo que esperamos en 4.° de secundaria:</b> explicar con la pendiente y la gráfica, clasificar el sistema, comprobar el resultado.</div>
        </Card>
      </Abs>
    </>
  );
};

// ── 3 · La regla ────────────────────────────────────────────────────────────────
const W03: React.FC<SceneProps> = ({ cue }) => {
  const f = useCurrentFrame();
  const ROWS: { who: string; k: number; e: number; none?: boolean; v: string; word: string }[] = [
    { who: "Bruno", k: 1, e: 1, v: "100 %", word: "cien" },
    { who: "Ana", k: 1, e: 0, v: "50 %", word: "cincuenta" },
    { who: "Estudiante 3", k: 0, e: 0, v: "0 %", word: "cero" },
    { who: "Estudiante 4", k: 0, e: 0, none: true, v: "sin registro", word: "registró" },
  ];
  return (
    <>
      <Title eyebrow="03 · AL CERRAR LA SESIÓN" title="La regla" />
      <Abs x={X} y={B} o={fade(f, cue("lista"), 12)} dy={14}>
        <Card style={{ width: 900, padding: "18px 26px" }}>
          <div style={{ display: "flex", alignItems: "center", fontSize: 15, fontWeight: 800, letterSpacing: 1.5, color: K.gray }}>
            <div style={{ flex: 1.3 }}>LISTA DE COTEJO · SESIÓN 6 · 4.° A</div>
            <div style={{ width: 170, color: K.navy }}>CONOCIMIENTO</div>
            <div style={{ width: 170, color: K.orange }}>ENFOQUE</div>
            <div style={{ width: 170, textAlign: "right" }}>SEÑAL</div>
          </div>
          {ROWS.map((r) => {
            const t = fade(f, cue(r.word), 10);
            return (
              <div key={r.who} style={{ display: "flex", alignItems: "center", marginTop: 12, padding: "8px 0", borderRadius: 10, background: `rgba(103,210,223,${0.18 * t})`, opacity: 0.35 + 0.65 * t }}>
                <div style={{ flex: 1.3, display: "flex", alignItems: "center", gap: 12, fontSize: 22, fontWeight: 700, color: K.ink }}><Halves size={36} k={r.k} e={r.e} none={r.none} />{r.who}</div>
                <div style={{ width: 170, fontSize: 20, fontWeight: 700, color: r.none ? K.gray : K.navy }}>{r.none ? "—" : r.k ? <Check size={26} color={K.navy} /> : "no"}</div>
                <div style={{ width: 170, fontSize: 20, fontWeight: 700, color: r.none ? K.gray : K.orange }}>{r.none ? "—" : r.e ? <Check size={26} color={K.orange} /> : "no"}</div>
                <div style={{ width: 170, textAlign: "right", fontSize: 26, fontWeight: 800, color: r.none ? K.gray : K.navy }}>{r.v}</div>
              </div>
            );
          })}
        </Card>
      </Abs>
      <Abs x={X} y={B + 330} style={{ display: "flex", gap: 14 }}>
        {[["Las dos mitades", "100 %", "cien"], ["Una mitad", "50 %", "cincuenta"], ["Ninguna", "0 %", "cero"], ["Sin registro", "no cuenta", "registró"]].map(([a, b, w], i) => {
          const t = fade(f, cue(w), 10);
          return (
            <div key={a} style={{ width: 213, opacity: t, transform: `scale(${0.85 + 0.15 * t})`, borderRadius: 14, padding: "12px 16px", boxSizing: "border-box", fontFamily: SANS, background: i === 3 ? "#EEF1F4" : "#FFFFFF", border: i === 3 ? "3px dashed #B5BDC9" : "none", boxShadow: i === 3 ? "none" : "0 6px 18px rgba(0,46,93,0.10)" }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: K.gray }}>{a}</div>
              <div style={{ fontSize: 30, fontWeight: 800, color: i === 3 ? K.gray : K.navy }}>{b}</div>
            </div>
          );
        })}
      </Abs>
      <Abs x={X} y={B + 444} o={fade(f, cue("señal"), 10)} dy={10}><Tag color={K.navy} bg={K.cyan} style={{ fontSize: 24, padding: "8px 18px" }}>No es una nota: es una señal</Tag></Abs>
    </>
  );
};

// ── 4 · Cada sesión cuenta ──────────────────────────────────────────────────────
const W04: React.FC<SceneProps> = ({ cue }) => {
  const f = useCurrentFrame();
  const S: [number, number][] = [[5, 100], [6, 100], [7, 50], [8, 100], [9, 50]];
  const t0 = cue("cinco"), tFull = fade(f, cue("tres"), 10), tHalf = fade(f, cue("veces", 1), 10), t80 = fade(f, cue("ochenta"), 12);
  return (
    <>
      <Title eyebrow="04 · UNA SESIÓN NO BASTA" title="Cada sesión cuenta" />
      <Abs x={X} y={B} o={fade(f, t0 - 4, 10)} style={{ fontFamily: SANS }}><Small>BRUNO · UNIDAD VI · CINCO SESIONES</Small></Abs>
      <Abs x={X} y={B + 34} style={{ display: "flex", gap: 15 }}>
        {S.map(([n, v], i) => {
          const t = fade(f, t0 + i * 5, 10), lit = v === 100 ? tFull : tHalf;
          return (
            <div key={n} style={{ width: 168, height: 220, borderRadius: 18, background: "#fff", boxShadow: lit > 0 ? `0 0 0 4px rgba(103,210,223,${lit}), 0 8px 22px rgba(0,46,93,0.10)` : "0 8px 22px rgba(0,46,93,0.10)", opacity: t, transform: `translateY(${(1 - t) * 18}px)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, fontFamily: SANS }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: n === 6 ? K.orange : K.gray }}>Sesión {n}</div>
              <Halves size={84} k={1} e={v === 100 ? 1 : 0} />
              <Pct v={v} size={34} />
            </div>
          );
        })}
      </Abs>
      <Abs x={X} y={B + 280} o={fade(f, t0 + 20, 10)}><Tag color={K.navy} bg="#E6EDF4" style={{ fontSize: 20 }}>Cada sesión pesa igual</Tag></Abs>
      <Abs x={X} y={B + 346} o={t80} dy={16}>
        <Card style={{ width: 900, padding: "18px 26px", display: "flex", alignItems: "center", gap: 26, borderLeft: `8px solid ${K.cyan}` }}>
          <Brujula size={110} value={80} t={fade(f, cue("ochenta"), 30)} />
          <div>
            <Small>SU BRÚJULA EN LA UNIDAD</Small>
            <div style={{ fontSize: 40, fontWeight: 800, color: K.navy, marginTop: 4 }}>Bruno · unidad VI · <Pct v={80} size={40} color={K.navy} /></div>
          </div>
        </Card>
      </Abs>
    </>
  );
};

// ── 5 · La sección ──────────────────────────────────────────────────────────────
const W05: React.FC<SceneProps> = ({ cue }) => {
  const f = useCurrentFrame();
  const all = fade(f, cue("veinte"), 10), none = fade(f, cue("dieciocho"), 10), full = fade(f, cue("nueve"), 10), half = fade(f, cue("nueve", 1), 10), t75 = fade(f, cue("setenta"), 12);
  return (
    <>
      <Title eyebrow="05 · VEINTE ESTUDIANTES" title="La sección" />
      <Abs x={X} y={B} o={all} style={{ display: "grid", gridTemplateColumns: "repeat(10, 60px)", gap: 14 }}>
        {Array.from({ length: 20 }, (_, i) => {
          const kind = i < 9 ? "full" : i < 18 ? "half" : "none";
          const t = kind === "full" ? full : kind === "half" ? half : none;
          return <div key={i} style={{ transform: `scale(${1 + 0.12 * t * (1 - t) * 4})` }}><Halves size={60} k={kind === "none" ? 0 : t} e={kind === "full" ? t : 0} none={kind === "none" && none > 0.5} /></div>;
        })}
      </Abs>
      <Abs x={X} y={B + 170} style={{ display: "flex", gap: 14, fontFamily: SANS }}>
        <div style={{ opacity: full }}><Tag color="#fff" bg={K.navy}>9 · las dos mitades</Tag></div>
        <div style={{ opacity: half }}><Tag color={K.navy} bg="#E6EDF4">9 · una mitad</Tag></div>
        <div style={{ opacity: none }}><Tag color={K.gray} bg="#EEF1F4">2 · sin registro, no cuentan</Tag></div>
      </Abs>
      <Abs x={X} y={B + 250} o={t75} dy={16}>
        <Card style={{ width: 900, padding: "18px 26px", display: "flex", alignItems: "center", gap: 26, borderLeft: `8px solid ${K.cyan}` }}>
          <Brujula size={110} value={75} t={fade(f, cue("setenta"), 30)} />
          <div>
            <Small>18 REGISTRADOS · CADA ESTUDIANTE PESA IGUAL</Small>
            <div style={{ fontSize: 44, fontWeight: 800, color: K.navy, marginTop: 4 }}>4.° A · <Pct v={75} size={44} /></div>
          </div>
        </Card>
      </Abs>
    </>
  );
};

// ── 6 · La primera respuesta es del aula ───────────────────────────────────────
const W06: React.FC<SceneProps> = ({ cue }) => {
  const f = useCurrentFrame();
  const tNext = fade(f, cue("siguiente"), 10), tRe = fade(f, cue("explicar"), 10), tAbs = fade(f, cue("registra"), 10);
  return (
    <>
      <Title eyebrow="06 · LA SEÑAL VUELVE AL AULA" title="La primera respuesta es del aula" />
      <Abs x={X} y={B} o={fade(f, 3, 12)} dy={14}>
        <div style={{ transform: "scale(0.78)", transformOrigin: "top left", width: 702, height: 374 }}>
          <Room crest={1} clock={1} criteria={1} books={1} carmen={{ o: 1, pose: "point" }} board={
            <div style={{ padding: "26px 34px", fontFamily: SANS, color: "#fff" }}>
              <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 2, color: "#FFB48A", opacity: tNext }}>SIGUIENTE SESIÓN</div>
              <div style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.2, marginTop: 14, opacity: tRe }}>¿Qué significa un sistema sin solución?</div>
            </div>
          } />
        </div>
      </Abs>
      <Abs x={X + 726} y={B + 20} o={tNext} dx={-14}><Tag color="#fff" bg={K.orange} style={{ fontSize: 22 }}>Siguiente sesión</Tag></Abs>
      <Abs x={X} y={B + 400} style={{ display: "flex", gap: 9 }}>
        {Array.from({ length: 20 }, (_, i) => {
          const half = i >= 9 && i < 18, gone = i >= 18;
          return (
            <div key={i} style={{ width: 36, height: 36, borderRadius: 18, background: gone ? "#D3D9E0" : "#B9C7D6", opacity: gone ? 1 - 0.4 * tAbs : 1, boxShadow: half ? `0 0 0 ${4 * tRe}px ${K.orange}` : gone ? `0 0 0 ${3 * tAbs}px ${K.gray}` : "none" }} />
          );
        })}
      </Abs>
      <Abs x={X} y={B + 456} style={{ display: "flex", gap: 14 }}>
        <div style={{ opacity: tRe }}><Tag color="#fff" bg={K.orange}>Vuelve a explicar · 9 con una mitad</Tag></div>
        <div style={{ opacity: tAbs }}><Tag color={K.gray} bg="#EEF1F4">Registra a quienes faltaron · 2</Tag></div>
      </Abs>
    </>
  );
};

// ── 7 · Grado y división ────────────────────────────────────────────────────────
const Level: React.FC<{ name: string; v: number; w: number; o: number; big?: boolean; style?: React.CSSProperties }> = ({ name, v, w, o, big, style }) => (
  <div style={{ width: w, opacity: o, transform: `translateY(${(1 - o) * 14}px)`, background: "#fff", borderRadius: 16, boxShadow: "0 8px 22px rgba(0,46,93,0.10)", padding: big ? "14px 22px" : "14px 18px", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, fontFamily: SANS, ...style }}>
    <div style={{ fontSize: big ? 28 : 24, fontWeight: 800, color: K.navy, whiteSpace: "nowrap" }}>{name}</div>
    <Pct v={v} size={big ? 40 : 32} />
  </div>
);
const W07: React.FC<SceneProps> = ({ cue }) => {
  const f = useCurrentFrame();
  const tSec = cue("secciones"), t72 = fade(f, cue("setenta"), 10), blinkAt = cue("sesenta");
  const blink = f >= blinkAt ? 0.5 + 0.5 * Math.cos(((f - blinkAt) / 9) * Math.PI) : 0;
  const glowC = f >= blinkAt ? (f - blinkAt < 54 ? blink : 1) : 0;
  const t5 = fade(f, cue("quinto"), 10), t74 = fade(f, cue("setenta", 1), 10);
  const SECS: [string, number][] = [["4.° A", 75], ["4.° B", 80], ["4.° C", 60], ["4.° D", 73]];
  return (
    <>
      <Title eyebrow="07 · LAS SECCIONES SE JUNTAN" title="Grado y división" />
      <Abs x={X} y={B} style={{ display: "flex", gap: 16 }}>
        {SECS.map(([n, v], i) => (
          <Level key={n} name={n} v={v} w={213} o={fade(f, tSec + i * 4, 10)} style={n === "4.° C" ? { boxShadow: `0 0 0 ${5 * glowC}px ${K.orange}, 0 8px 22px rgba(0,46,93,0.10)` } : undefined} />
        ))}
      </Abs>
      <Abs x={X} y={B + 110} style={{ display: "flex", gap: 20 }}>
        <Level name="4.° grado" v={72} w={440} o={t72} big />
        <Level name="5.° grado" v={76} w={440} o={t5} big />
      </Abs>
      <Abs x={X} y={B + 230} o={t74} dy={14}>
        <Card style={{ width: 900, padding: "18px 26px", display: "flex", alignItems: "center", gap: 26, borderLeft: `8px solid ${K.cyan}` }}>
          <Brujula size={110} value={74} t={fade(f, cue("setenta", 1), 30)} />
          <div>
            <Small>4.° Y 5.° GRADO</Small>
            <div style={{ fontSize: 44, fontWeight: 800, color: K.navy, marginTop: 4 }}>Secundaria alta · <Pct v={74} size={44} /></div>
          </div>
        </Card>
      </Abs>
    </>
  );
};

// ── 8 · Cada nivel responde a su escala ────────────────────────────────────────
const Action: React.FC<{ label: string; text: string; o: number; accent: string }> = ({ label, text, o, accent }) => (
  <div style={{ opacity: o, transform: `translateY(${(1 - o) * 12}px)`, background: "#fff", borderRadius: 14, padding: "14px 18px", marginTop: 14, boxShadow: "0 6px 18px rgba(0,46,93,0.08)", borderLeft: `6px solid ${accent}`, fontFamily: SANS }}>
    <div style={{ fontSize: 22, fontWeight: 800, color: K.navy }}>{label}</div>
    <div style={{ fontSize: 18, fontWeight: 600, color: K.gray, marginTop: 4 }}>{text}</div>
  </div>
);
const W08: React.FC<SceneProps> = ({ cue }) => {
  const f = useCurrentFrame();
  const tCo = fade(f, cue("coordinación"), 10), tDir = fade(f, cue("dirección"), 10), tLead = fade(f, cue("liderazgo"), 12);
  return (
    <>
      <Title eyebrow="08 · CADA NIVEL RESPONDE" title="Cada nivel responde a su escala" />
      <Abs x={X} y={B} o={tCo} dy={14}>
        <div style={{ width: 430, minHeight: 440, borderRadius: 20, background: "#FFF1E8", padding: "18px 20px", boxSizing: "border-box", fontFamily: SANS }}>
          <Small color="#E8611A">ENSEÑANZA Y APRENDIZAJE</Small>
          <div style={{ fontSize: 30, fontWeight: 800, color: K.navy, marginTop: 4 }}>Coordinación</div>
          <Action label="Esta unidad" text="Ajusta las sesiones que quedan" o={fade(f, cue("ajusta"), 10)} accent={K.orange} />
          <Action label="Cuaderno de trabajo del próximo año" text="Anota qué cambiar" o={fade(f, cue("próximo"), 10)} accent={K.orange} />
        </div>
      </Abs>
      <Abs x={X + 470} y={B} o={tDir} dy={14}>
        <div style={{ width: 430, minHeight: 440, borderRadius: 20, background: "#E4EBF3", padding: "18px 20px", boxSizing: "border-box", fontFamily: SANS, boxShadow: `0 0 0 ${5 * tLead}px ${K.navy}` }}>
          <Small color={K.navy}>LIDERAZGO</Small>
          <div style={{ fontSize: 30, fontWeight: 800, color: K.navy, marginTop: 4 }}>Dirección</div>
          <Action label="Cierre de bimestre · meta del PCI" text="Compara cada división con la meta" o={fade(f, cue("bimestre"), 10)} accent={K.navy} />
          <Action label="Ajusta el PAT" text="Los pasos del año para lograr las metas" o={fade(f, cue("PAT"), 10)} accent={K.navy} />
          <div style={{ marginTop: 18, opacity: tLead }}><Tag color="#fff" bg={K.navy} style={{ fontSize: 20 }}>Sistema de liderazgo</Tag></div>
        </div>
      </Abs>
    </>
  );
};

// ── 9 · Del estudiante al colegio ───────────────────────────────────────────────
const W09: React.FC<SceneProps> = ({ cue }) => {
  const f = useCurrentFrame();
  const a = cue("pesa"), b = cue("colegio");
  // Bottom to top: each scale appears in turn while the narration climbs to the school.
  const STEPS: { name: string; v: number; w: number; at: number }[] = [
    { name: "Bruno", v: 80, w: 330, at: 2 },
    { name: "4.° A", v: 75, w: 450, at: a },
    { name: "4.° grado", v: 72, w: 570, at: a + (b - a) / 3 },
    { name: "Secundaria alta", v: 74, w: 690, at: a + (2 * (b - a)) / 3 },
    { name: "Colegio San Pío X", v: 78, w: 900, at: cue("setenta") },
  ];
  return (
    <>
      <Title eyebrow="09 · CADA UNO PESA LO MISMO" title="Del estudiante al colegio" />
      {STEPS.map((s, i) => {
        const o = fade(f, s.at, 10), top = i === 4;
        return (
          <Abs key={s.name} x={X + (900 - s.w) / 2} y={B + 420 - i * 100} o={o} dy={20}>
            <div style={{ width: s.w, height: 82, borderRadius: 16, boxSizing: "border-box", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: SANS, background: top ? K.navy : "#fff", boxShadow: top ? "0 12px 30px rgba(0,46,93,0.25)" : "0 8px 22px rgba(0,46,93,0.10)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                {top && <Brujula size={62} value={78} t={fade(f, s.at, 30)} />}
                <div style={{ fontSize: top ? 32 : 26, fontWeight: 800, color: top ? "#fff" : K.navy }}>{s.name}</div>
              </div>
              <Pct v={s.v} size={top ? 42 : 34} color={top ? K.cyan : K.navy} />
            </div>
          </Abs>
        );
      })}
      <Abs x={X + 630} y={B + 436} o={fade(f, cue("novecientos"), 10)} dx={-14}><Tag color={K.navy} bg="#E3F6F8" style={{ fontSize: 22 }}>1 de 919 · ≈ 0,11 %</Tag></Abs>
      <Abs x={X + 270} y={B + 520} o={fade(f, cue("escalas"), 10)} dy={10}><Tag color={K.navy} bg={K.cyan} style={{ fontSize: 20 }}>El mismo número, a distintas escalas</Tag></Abs>
    </>
  );
};

// ── 10 · Tres ritmos ────────────────────────────────────────────────────────────
const W10: React.FC<SceneProps> = ({ cue }) => {
  const f = useCurrentFrame();
  const RHYTHMS: [string, string, string, string][] = [
    ["Sesión", "diario", "La brújula · el pulso", "sesión"],
    ["Examen", "mensual y bimestral", "Conocimiento", "exámenes"],
    ["Proyecto STEAM", "fin de bimestre", "Enfoque por competencias", "STEAM"],
  ];
  const LEVELS: [string, string][] = [["Inicial y Primaria baja", "Producto"], ["Primaria alta", "Desempeño"], ["Secundaria", "Conocimiento"]];
  const tLv = cue("nivel"), tSame = fade(f, cue("igual"), 10);
  return (
    <>
      <Title eyebrow="10 · TRES RITMOS" title="El pulso y la confirmación" />
      <Abs x={X} y={B} style={{ display: "flex", gap: 20 }}>
        {RHYTHMS.map(([name, when, gives, w], i) => {
          const t = fade(f, cue(w), 10);
          return (
            <div key={name} style={{ width: 286, opacity: t, transform: `translateY(${(1 - t) * 14}px)`, background: "#fff", borderRadius: 16, padding: "16px 18px", boxSizing: "border-box", boxShadow: "0 8px 22px rgba(0,46,93,0.10)", fontFamily: SANS }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: K.navy }}>{name}</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: K.gray, marginTop: 2 }}>{when}</div>
              <div style={{ marginTop: 12 }}><Tag color={i === 0 ? K.navy : "#fff"} bg={i === 0 ? K.cyan : i === 1 ? K.navy : K.orange} style={{ fontSize: 17 }}>{gives}</Tag></div>
            </div>
          );
        })}
      </Abs>
      <Abs x={X} y={B + 170} o={fade(f, tLv - 4, 10)} style={{ fontFamily: SANS }}><Small>CADA NIVEL PONDERA SUS NOTAS · LA BRÚJULA SE LEE IGUAL</Small></Abs>
      <Abs x={X} y={B + 204} style={{ display: "flex", gap: 20 }}>
        {LEVELS.map(([lv, more], i) => {
          const t = fade(f, tLv + i * 6, 10);
          return (
            <div key={lv} style={{ width: 286, height: 230, opacity: t, background: "#F3F6F9", borderRadius: 16, padding: "16px 18px", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, fontFamily: SANS, textAlign: "center" }}>
              <div style={{ fontSize: 21, fontWeight: 800, color: K.navy }}>{lv}</div>
              <div style={{ fontSize: 17, fontWeight: 600, color: K.gray }}>más peso al <b style={{ color: K.ink }}>{more}</b></div>
              <div style={{ boxShadow: `0 0 0 ${4 * tSame}px ${K.cyan}`, borderRadius: "50%" }}><Brujula size={104} value={75} /></div>
            </div>
          );
        })}
      </Abs>
      <Abs x={X} y={B + 456} o={fade(f, cue("coinciden"), 10)} dy={10}><Tag color={K.navy} bg={K.cyan} style={{ fontSize: 22 }}>Si no coinciden, también es una señal</Tag></Abs>
    </>
  );
};

// ── 11 · Cierre ────────────────────────────────────────────────────────────────
const W11: React.FC<SceneProps> = ({ cue }) => {
  const f = useCurrentFrame();
  const LINES: [string, string, string, string][] = [
    ["No juzga a los estudiantes", "juzga", K.navy, "#fff"],
    ["Cada bimestre · camino a las metas del 2030", "bimestre", "#fff", K.navy],
    ["Una hipótesis que vamos a probar juntos", "hipótesis", K.navy, K.cyan],
    ["¿Qué capa mover primero?", "capa", "#fff", K.orange],
  ];
  return (
    <>
      <Title eyebrow="CIERRE" title="La brújula orienta" />
      <Abs x={X + 10} y={B + 20} o={fade(f, 3, 14)}><Brujula size={300} value={78} t={fade(f, 3, 40)} /></Abs>
      {LINES.map(([text, w, color, bg], i) => (
        <Abs key={text} x={X + 360} y={B + 30 + i * 84} o={fade(f, cue(w), 10)} dx={-16}>
          <Tag color={color} bg={bg} style={{ fontSize: 24, padding: "12px 20px", boxShadow: bg === "#fff" ? "0 6px 18px rgba(0,46,93,0.12)" : "none" }}>{text}</Tag>
        </Abs>
      ))}
    </>
  );
};

export const SCENES: Record<string, React.FC<SceneProps>> = { W00, W01, W02, W03, W04, W05, W06, W07, W08, W09, W10, W11 };
