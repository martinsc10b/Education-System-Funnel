# La vena — video script v3 (for Claude Code)

**Scope:** LOS OLIVOS (Consorcio Educativo San Pío X S.A.C.). Algebra, 4.° de secundaria, week 26 (21–25 Sept 2026).
**Status:** DRAFT for Martin's review. Replaces v2. Narration and on-screen text in Spanish; production notes in English.
**What changed from v2:**
1. Every layer now follows the same three narrative beats: **qué es · qué toma de arriba · qué entrega hacia abajo**.
2. Every layer opens with a **Panorama → Foco → Hilo** visual: show everything the layer contains, dim all but the piece that belongs to this class, then pass a thread to the layer below.
3. On the way up, evidence travels along that same lit thread.
4. Scenario A is merged into one scene to make room.

**Source of truth for every anchor:** the interactive trace at https://claude.ai/artifact/8WHkULKZ7DJaWrreJoJGCa
**Runtime:** ~8:40 (target was 6:00). See the runtime note at the end.
**Format:** 1920×1080, 30 fps.

---

## 0. Build instructions for Claude Code

### Goal
A motion-graphics explainer in which **one persistent funnel is the spine of the whole video**. With the sound off, a viewer should still be able to tell three things from the screen alone: which layer we are in, which way we are moving, and which single piece of that layer belongs to this Algebra class.

### Suggested stack
Remotion (React) or any frame-accurate HTML/SVG pipeline. Keep all layer data in one JSON file (Section 0.5) so the funnel, the panoramas and the document cards can never disagree.

### 0.1 Screen layout (constant except in Scene 0)

```
+-------------------------------+----------------------------------------------+
|  FUNNEL (left ~38% width)     |  STAGE (right ~62%)                          |
|                               |                                              |
|  ▼/▲ direction rail           |  Beat 1  PANORAMA: everything in the layer   |
|  [1 Currículo Nacional     ]  |  Beat 2  FOCO: all dims except our piece     |
|   [2 PEI 2026–2030        ]   |  Beat 3  HILO: our piece shrinks into a      |
|    [3 PCI 2026           ]    |          "thread chip" and travels into the  |
|     [4 Programación anual]    |          next funnel bar                     |
|      [5 Unidad didáctica VI]  |                                              |
|       [6 Cuaderno de trabajo] |  Then: DOCUMENT CARD (document · exact       |
|        [7 Sesión y clase ]    |  location · the line that matters · owner)   |
|         [8 Estudiante   ]     |                                              |
|                               |  Footer: route label · "Casos ficticios"     |
+-------------------------------+----------------------------------------------+
```

- The funnel never leaves the screen and never changes size or position.
- The 8 layers are stacked bars, each narrower than the one above.
- A vertical **direction rail** sits left of the funnel. A pulse moves down (decisions) or up (evidence).

### 0.2 The Panorama → Foco → Hilo mechanic (used in every Part 1 scene)

| Beat | What happens on the stage | Narration beat |
|---|---|---|
| **Entrada** | The thread chip from the layer above arrives at the top of the stage. (Skipped in Scene 1.) | «Qué toma de arriba» |
| **Panorama** | Every item the layer contains appears as a neutral tile grid. All tiles same weight, gray. | «Qué es» |
| **Foco** | All tiles fade to 20% opacity except the one(s) for this class, which fill teal and scale to 1.1. For nested layers (CNEB), the focus happens in steps: zoom into a group, then into one tile. | «Qué es» (continues) |
| **Card** | The document card appears with the exact source and location. | Detail |
| **Hilo** | The lit tile shrinks into a small labeled **thread chip** and moves down into the next funnel bar. The chip's label is the hand-off (for example, «Competencia: regularidad, equivalencia y cambio»). | «Qué entrega hacia abajo» |

The thread chips stack in a thin **thread column** at the far right edge of the stage, one per layer, so by Scene 8 the viewer sees the full chain of what was handed down. This column is reused on the way up.

### 0.3 Funnel states

| State | Visual |
|---|---|
| Inactive | Outline only, muted text |
| Active | Filled with route color, bold text, scale 1.03 |
| Visited in current route | Thin left bar in route color |
| Not reached in this route | Stays inactive |

Route colors:
- **Down (Decisiones):** teal `#2F6F73`
- **Scenario A (Logrado):** green `#3A7D44`
- **Scenario B (Aún no logra):** deep red `#B3261E` (the "blood" route)
- Background `#F5F7F6`, ink `#13233A`, inactive tiles `#D5DCE0`

### 0.4 Rules
1. The rail pulse moves **only** in the direction of the current route.
2. Between routes, all trails reset. Scenario B must not look like a continuation of A.
3. On the way up, the evidence travels along the thread column. Each thread chip the evidence passes turns the route color.
4. Every percentage carries the label "ejemplo". Ana and Bruno are always labeled "Casos ficticios".
5. No real student, teacher, family or supervision report appears. No teacher names.
6. Show **only** the items listed in the scene's panorama. Do not invent sections, pages, criteria or quotes. Where a panorama lists only labels (no numbers), do not add numbers.
7. Hold each document card at least 4 seconds after its narration ends.

### 0.5 Layer data (single source of truth)

```json
[
 {"id":1,"name":"Currículo Nacional",
  "doc":"CNEB (R.M. 281-2016-MINEDU) · Programa curricular de Educación Secundaria",
  "where":"Matemática → «Resuelve problemas de regularidad, equivalencia y cambio» → estándar nivel 7 (fin del ciclo VII)",
  "owner":"MINEDU",
  "panorama":"Perfil de egreso (11 aprendizajes) → 31 competencias por área → 4 competencias de Matemática",
  "focus":"Resuelve problemas de regularidad, equivalencia y cambio",
  "thread":"Competencia · 4 capacidades · estándar nivel 7"},
 {"id":2,"name":"PEI 2026–2030",
  "doc":"Proyecto Educativo Institucional 2026–2030, Los Olivos",
  "where":"5.4 Línea de base · 6.2 Objetivo institucional 01 · 6.3–6.4 Metas CGE 1",
  "owner":"Dirección y equipo directivo",
  "panorama":"Identidad · Diagnóstico · 6 objetivos institucionales · 5 compromisos de gestión escolar",
  "focus":"Objetivo institucional 01 (CGE 1)",
  "thread":"Prioridad: aprendizajes · Meta 2026: 65 %"},
 {"id":3,"name":"PCI 2026",
  "doc":"Proyecto Curricular Institucional 2026",
  "where":"3.2 · 5.3 · 7.2–7.3 · 8 · 9.2–9.4 · 12.1 · 12.3",
  "owner":"Comité de Gestión Pedagógica · Dirección Académica",
  "panorama":"Plan de estudios de secundaria: 11 áreas, 45 horas",
  "focus":"Matemática, 14 horas → Álgebra, 3 horas",
  "thread":"3 h de Álgebra · método · evaluación · formato de la programación"},
 {"id":4,"name":"Programación anual",
  "doc":"Temario anual 2026 · Álgebra 4.° secundaria",
  "where":"VI Unidad · Semana 26 (21–25 set.)",
  "owner":"Docente del curso · revisa Coordinación",
  "panorama":"38 semanas del año",
  "focus":"Semana 26 (con arcos desde las semanas 22 y 24)",
  "thread":"Semana 26: sistemas de ecuaciones lineales"},
 {"id":5,"name":"Unidad didáctica VI",
  "doc":"Unidad de las semanas 24 a 28 (estructura: PCI 7.3)",
  "where":"Semanas 24–28",
  "owner":"Docente · revisa Coordinación",
  "panorama":"Semanas 24, 25, 26, 27, 28",
  "focus":"Semana 26 + los criterios de evaluación",
  "thread":"Criterios de evaluación"},
 {"id":6,"name":"Cuaderno de trabajo",
  "doc":"Cuaderno III Bimestre · Álgebra 4.° secundaria",
  "where":"Semana 26 · páginas 109–113",
  "owner":"Dirección pedagógica",
  "panorama":"Tomo del III Bimestre, semanas 20 a 28",
  "focus":"Páginas 109–113",
  "thread":"Páginas 109–113"},
 {"id":7,"name":"Sesión y clase",
  "doc":"Presentación «Semana 26», 24 diapositivas",
  "where":"Diap. 3 propósito · 7 lista de cotejo · 10 debate · 13–22 práctica · 23 metacognición",
  "owner":"Docente",
  "panorama":"24 diapositivas",
  "focus":"Diapositiva 10: «¿Quién tiene razón?»",
  "thread":"El debate"},
 {"id":8,"name":"Estudiante",
  "doc":"Tarjeta de aprendizaje (mañana siguiente, 5 minutos)",
  "where":"Parte A: resolver y justificar · Parte B: ¿tiene razón María?",
  "owner":"Docente aplica",
  "panorama":"Una sección de estudiantes",
  "focus":"Un estudiante y su tarjeta",
  "thread":"Evidencia"}
]
```

---

## PART 0 — Opening

### Scene 0 · 0:00–0:15 · Una clase
**Funnel:** fades in, all layers inactive. Then layer 8 (Estudiante) glows softly.
**Stage:** title card.
**On-screen:**
> Una clase, un estudiante, todo el sistema
> Los Olivos · Álgebra · 4.° de secundaria · Semana 26

**Narration (ES):**
> Vamos a seguir una sola clase: Álgebra, cuarto de secundaria, semana veintiséis, sistemas de ecuaciones lineales. Primero bajaremos desde el Currículo Nacional hasta el estudiante. Después subiremos con lo que el estudiante aprendió.

---

## PART 1 — Hacia abajo: de todo, a esta clase

Route color: teal. Rail pulse: downward. One scene per layer, top to bottom. Every scene uses Panorama → Foco → Hilo (Section 0.2).

### Scene 1 · 0:15–1:05 · Currículo Nacional (layer 1)

**Panorama, in three nested zoom steps:**
1. A ring of 11 small tiles labeled «Perfil de egreso» (no text inside the tiles).
2. The ring expands into **31 competency tiles**, grouped by area, area names as small headers. Do not write the 31 competency names; show tiles only, except the four in step 3.
3. Zoom into the Matemática group. Its four tiles get names:
   - Resuelve problemas de cantidad
   - **Resuelve problemas de regularidad, equivalencia y cambio**
   - Resuelve problemas de forma, movimiento y localización
   - Resuelve problemas de gestión de datos e incertidumbre

**Foco:** the other 30 tiles dim. «Regularidad, equivalencia y cambio» fills teal. A small tag beside it: «La competencia del álgebra».

**Card:**
- **Currículo Nacional de la Educación Básica (MINEDU)**
- Cuatro capacidades (appear one by one): Traduce · Comunica · Usa estrategias · **Argumenta**
- Estándar nivel 7 (fin del ciclo VII, 3.° a 5.° de secundaria). Three phrases animate in: «sistemas de ecuaciones lineales» · «conjunto solución» · «casos especiales … contraejemplos»
- Responsable: MINEDU

**Hilo:** chip «Competencia · 4 capacidades · estándar nivel 7» moves into layer 2.

**Narration (ES):**
> Todo empieza en el Currículo Nacional. Es el documento del Ministerio de Educación que dice qué debe aprender todo estudiante del Perú. Define un perfil de egreso y treinta y una competencias, organizadas por áreas. Matemática tiene cuatro. Esta clase pertenece a una sola: «Resuelve problemas de regularidad, equivalencia y cambio», la competencia del álgebra.
> Cada competencia tiene capacidades, aquí cuatro: traduce, comunica, usa estrategias y argumenta. Y tiene estándares que describen cómo se ve el logro. Al terminar la secundaria, el nivel siete pide resolver sistemas de ecuaciones lineales, entender su conjunto solución y plantear afirmaciones sobre casos especiales, descartándolas con contraejemplos. Recuerden esa última idea.
> Hacia abajo, el Currículo entrega qué aprender y cómo reconocer que se aprendió. Cómo lograrlo lo decide cada colegio.

### Scene 2 · 1:05–1:50 · PEI 2026–2030 (layer 2)

**Entrada:** the chip from layer 1 lands at the top of the stage.

**Panorama:** three columns, built left to right as the narration names them:
- **Quiénes somos:** misión · visión · valores
- **Dónde estamos:** diagnóstico (línea de base, 5.4)
- **A dónde vamos:** 6 objetivos institucionales, as tiles:
  01 Propuesta pedagógica · 02 Permanencia · 03 Recursos tecnológicos · 04 Clima · 05 Acompañamiento docente · 06 Condiciones operativas
  Below the objectives, a thin row of five small tiles: «5 compromisos de gestión escolar (CGE)».

**Foco:** everything dims except **Objetivo 01** and **CGE 1**, connected by a thin line. The diagnosis column keeps a faint outline, because it is the reason objective 01 exists.

**Card:**
- **PEI 2026–2030 · Los Olivos**
- Objetivo institucional 01 (6.2): contextualizar la propuesta pedagógica para mejorar el logro de aprendizajes · CGE 1
- Meta (6.3–6.4): 90 % en nivel satisfactorio en Matemática y Comunicación al 2030 · 65 % en 2026
- Responsable: Dirección y equipo directivo

**Hilo:** chip «Prioridad: aprendizajes · Meta 2026: 65 %» moves into layer 3.

**Narration (ES):**
> El PEI es el plan estratégico del colegio a cinco años, de 2026 a 2030. Toma el Currículo Nacional y se pregunta qué significa para nosotros. Para construirlo, el equipo directivo responde tres preguntas. Quiénes somos: misión, visión y valores. Dónde estamos: un diagnóstico de cómo aprenden hoy nuestros estudiantes. Y a dónde vamos: objetivos y metas alineados a los cinco compromisos de gestión escolar del Ministerio.
> Nuestro PEI tiene seis objetivos. El que toca esta clase es el objetivo uno: mejorar los aprendizajes contextualizando la propuesta pedagógica. Su meta es noventa por ciento en nivel satisfactorio en Matemática y Comunicación al 2030, empezando por sesenta y cinco por ciento este año.
> Hacia abajo, el PEI entrega una prioridad y una meta que se puede medir.

### Scene 3 · 1:50–2:35 · PCI 2026 (layer 3)

**Entrada:** chip from layer 2.

**Panorama:** the Secundaria plan de estudios (PCI 5.3) as 11 tiles, each sized by weekly hours, with the hour number shown:
Matemática 14 · Ciencia y Tecnología 7 · Comunicación 6 · Inglés 3 · Ciencias Sociales 3 · Educación Física 3 · DPCC 2 · Educación Religiosa 2 · Tutoría 2 · Educación para el Trabajo 2 · Arte y Cultura 1 · Total: 45 horas

**Foco:** all tiles dim except Matemática (14). It splits into course tiles; only **Álgebra · 3 h** is labeled and lit. (Do not label the other Matemática courses.)

**Card:** five rows appear in sync with narration:
- 3.2 · Matemática es la prioridad 1 de intervención
- 8 · Aprendizaje basado en problemas con contextos reales
- 9.2–9.4 · Evaluación formativa en cada sesión · escala AD, A, B, C · retroalimentación descriptiva y por descubrimiento
- 7.2–7.3 · Cómo deben escribirse la programación anual y las unidades
- 12.1 / 12.3 · Análisis mensual de resultados · meta 30 % en A+AD en Matemática de secundaria
- Responsable: Comité de Gestión Pedagógica · Dirección Académica

**Hilo:** chip «3 h de Álgebra · método · evaluación · formato de la programación» moves into layer 4.

**Narration (ES):**
> El PCI es el plan curricular de este año. Toma el Currículo Nacional y las prioridades del PEI, y decide cómo enseñamos: cuántas horas recibe cada área, con qué método y cómo se evalúa.
> En secundaria reparte cuarenta y cinco horas semanales. Como el diagnóstico mostró que Matemática es la prioridad uno, le da catorce horas; tres son de Álgebra. Pide resolver problemas en contextos reales, evaluar en cada sesión y retroalimentar con preguntas, no solo con la respuesta correcta.
> Hacia abajo entrega las horas, el método, la forma de evaluar y el formato que deben seguir la programación anual y las unidades. Y fija cómo vamos a mirar los resultados: cada mes, con una meta de treinta por ciento en logro previsto o destacado.

### Scene 4 · 2:35–3:15 · Programación anual (layer 4)

**Entrada:** chip from layer 3.

**Panorama:** a 38-cell week grid (two rows of 19), week numbers only. A thin bracket marks **VI Unidad** over weeks 24–28. Do not label other units.

**Foco:** all cells dim except weeks 22, 24, 25, 26, 27, 28. Labels appear:
Sem 22 Matrices · Sem 24 Determinantes · Sem 25 Matriz inversa · **Sem 26 Sistemas de ecuaciones lineales (21–25 set.)** · Sem 27–28 Proyecto STEAM III.
Then weeks 22, 25, 27 and 28 dim again, leaving 24 and 26 lit with **two arcs: 22 → 26 and 24 → 26.**

**Card:**
- **Temario anual 2026 · Álgebra 4.° · 3 h por semana**
- Semana 26: definición · clasificación compatible e incompatible · reducción, igualación y sustitución
- Depende de: semana 22 (matrices) y semana 24 (determinantes)
- Responsable: Docente · revisa Coordinación

**Hilo:** chip «Semana 26: sistemas de ecuaciones lineales» moves into layer 5.

**Narration (ES):**
> La programación anual es el plan del curso para todo el año. Toma del PCI las horas, el calendario y la competencia, y los reparte en treinta y ocho semanas.
> Sistemas de ecuaciones lineales cae en la semana veintiséis, del veintiuno al veinticinco de setiembre, dentro de la sexta unidad. Y no llega sola: depende de matrices, en la semana veintidós, y de determinantes, en la veinticuatro, porque los sistemas se clasifican con determinantes.
> Hacia abajo entrega el orden: qué se enseña, cuándo y después de qué.

**Production note:** keep the two arcs as reusable assets. They return in Scene 11.

### Scene 5 · 3:15–3:50 · Unidad didáctica VI (layer 5)

**Entrada:** chip from layer 4.

**Panorama:** five week tiles in a row: 24 · 25 · 26 · 27 · 28. Above them, four labeled empty slots (PCI 7.3): situación significativa · desempeños · criterios de evaluación · secuencia de sesiones.

**Foco:** the slots fill with a soft tint one by one as the narration names them. Then all dim except **week 26** and the **criterios de evaluación** slot.

**Card:**
- **Unidad didáctica VI · semanas 24 a 28**
- Debe contener (PCI 7.3): situación significativa · desempeños · criterios de evaluación · secuencia de sesiones
- Responsable: Docente · revisa Coordinación

**Hilo:** chip «Criterios de evaluación» moves into layer 6.

**Narration (ES):**
> La unidad didáctica agrupa varias semanas alrededor de un propósito. La sexta unidad va de la semana veinticuatro a la veintiocho. Toma de la programación anual qué semanas le tocan, y según el PCI debe tener cuatro piezas: una situación que dé sentido al aprendizaje, los desempeños que se buscan, los criterios de evaluación y la secuencia de sesiones.
> Hacia abajo entrega lo más importante: los criterios. Sin ellos, la evidencia de una clase no tiene dónde anclarse.

**Production note:** do not show invented criteria text. The slots stay labeled but empty of content.

### Scene 6 · 3:50–4:30 · Cuaderno de trabajo (layer 6)

**Entrada:** chip from layer 5.

**Panorama:** the III Bimestre workbook as a fan of page tiles grouped by week, week numbers 20 to 28 as headers. Above the fan, the four capacity tags float as a legend: Traduce · Comunica · Usa estrategias · Argumenta. Above the legend, one line: «Competencia 2: Resuelve problemas de regularidad, equivalencia y cambio».

**Foco:** all page groups dim except **week 26 · pp. 109–113**. The five pages spread out and show their parts as labels: teoría de los tres métodos · clasificación con determinantes · problemas resueltos · 8 ejercicios «Trabajando en clase».

**Card:**
- **Cuaderno III Bimestre · Álgebra 4.°**
- Semana 26 · páginas 109–113
- Cada página indica la competencia que entrena
- Responsable: Dirección pedagógica

**Hilo:** chip «Páginas 109–113» moves into layer 7.

**Narration (ES):**
> El cuaderno de trabajo es lo que el estudiante tiene en la mano. Lo elabora la dirección pedagógica, un tomo por bimestre, siguiendo la programación anual semana por semana. Por eso no puede decir algo distinto al PCI ni al Currículo: cada página indica qué competencia entrena, y debería entrenar sus cuatro capacidades.
> La semana veintiséis ocupa las páginas ciento nueve a ciento trece: la teoría de los tres métodos, la clasificación con determinantes, problemas resueltos y ocho ejercicios para la clase.
> Hacia abajo entrega el material con el que se practica.

**Production note:** do not tag individual workbook items with capacities. The capacity tags stay as a legend only.

### Scene 7 · 4:30–5:10 · Sesión y clase (layer 7)

**Entrada:** chip from layer 6.

**Panorama:** 24 slide thumbnails in a 6×4 grid, numbered.

**Foco:** all dim except slides 3, 7, 10 and 23, which get labels: propósito · lista de cotejo · «¿Quién tiene razón?» · metacognición. Then slides 3, 7 and 23 dim, and **slide 10** enlarges to fill the stage.

**Card:**
- **Presentación «Semana 26» · 24 diapositivas**
- Diap. 3 propósito · Diap. 7 lista de cotejo · Diap. 10 debate · Diap. 23 metacognición
- Responsable: Docente

**Hilo:** chip «El debate» moves into layer 8.

**Narration (ES):**
> La sesión es donde todo lo anterior se vuelve clase. El docente toma los criterios de la unidad y las páginas del cuaderno, y arma su secuencia; esta tiene veinticuatro diapositivas.
> Presenta el propósito, comparte los criterios en una lista de cotejo y abre un debate: ¿quién tiene razón? ¿Dos ecuaciones con dos incógnitas siempre tienen una sola respuesta? Ese debate es exactamente lo que pide el Currículo Nacional: un caso especial y un contraejemplo. Al final, los estudiantes reflexionan sobre cómo aprendieron.
> Hacia abajo, la sesión entrega una experiencia de aprendizaje y una pregunta que se puede evaluar.

**Production note:** when the narration says «Currículo Nacional», flash layer 1 for 0.5 s and draw a thin teal line from layer 7 to layer 1 through the thread column, then return focus.

### Scene 8 · 5:10–5:35 · Estudiante (layer 8)

**Entrada:** chip from layer 7.

**Panorama:** a section of 30 neutral student icons.

**Foco:** all dim except one, who becomes a paper card.

**Card:**
- **Al día siguiente · 5 minutos**
- Parte A: Resuelve x + y = 5, x − y = 1 y explica por qué elegiste ese método
- Parte B: María dice que dos ecuaciones con dos incógnitas siempre tienen exactamente una respuesta. ¿Tiene razón?
- Niveles: 1 sin razón · 2 «no siempre», con una razón · 3 con ejemplo de cero o infinitas soluciones

**Narration (ES):**
> Y llegamos al estudiante. A la mañana siguiente responde una tarjeta de cinco minutos. La parte A mide si sabe resolver. La parte B mide si sabe argumentar. No medimos velocidad; medimos pensamiento.
> Ahora la dirección se invierte. Veamos qué pasa con esa evidencia en dos escenarios distintos.

**Transition (5:35–5:40):** the thread column stays visible but turns gray. The teal trail fades from all layers. The rail pulse stops at the bottom. Text: «Dos escenarios distintos · Casos ficticios».

---

## PART 2 — Escenario A: logra el objetivo

Route color: green. Rail pulse: upward. **Only layers 8, 7, 3 and 1 activate.** Layers 2, 4, 5 and 6 stay inactive, and their thread chips stay gray, to show the route is short.

### Scene 9 · 5:40–6:10 · Ana, nivel 3 (layers 8 → 7 → 3 → 1)

One scene, four quick stops. Each stop shows a two-line card.

| Stop | Funnel | Card | Thread column |
|---|---|---|---|
| 1 | Layer 8 | Ana · Nivel 3 · dibuja dos rectas paralelas: «ninguna solución» | «Evidencia» chip turns green |
| 2 | Layer 7 | Docente · registra en la lista de cotejo · continúa con la semana 27 | «El debate» chip turns green |
| 3 | Layer 3 | Coordinación · análisis mensual (PCI 12.1) · sección en logro (85 %, ejemplo) · suma al indicador 12.3 | Pulse jumps past layers 4–6 |
| 4 | Layer 1 | Cierre del bimestre · la competencia queda registrada (SIAGIE) | The competency chip turns green |

**Narration (ES):**
> En un primer escenario, Ana responde en nivel tres: resuelve el sistema y muestra que María no tiene razón, porque dos rectas paralelas nunca se cruzan. La docente lo registra y la clase continúa. En su análisis mensual, la coordinación ve que la sección logró el objetivo, y eso suma al indicador del PCI. Al cierre del bimestre, el logro queda registrado en la competencia del Currículo Nacional. Cuando el aprendizaje llega, la ruta es corta.

**Transition (6:10–6:15):** green trail and green chips reset to gray. Text: «Otro escenario · Casos ficticios».

---

## PART 3 — Escenario B: aún no lo logra (la vena)

Route color: deep red. Rail pulse: upward, slower. **Every layer activates, from 8 to 1.** Each scene reuses the lit item from that layer's Part 1 Foco beat, now outlined in red. Do not rush this part.

Every scenario card has four rows: **Se activa con · Ve · Decide · Cuándo**.

### Scene 10 · 6:15–6:35 · Bruno, nivel 1 (layer 8)
**Stage:** the 30-icon section returns; 12 icons turn red (label: «4 de cada 10 · ejemplo»). Bruno's card in front: Part A solved correctly; Part B «Sí, siempre hay una respuesta», no reason. Badge: Nivel 1.
**Thread:** «Evidencia» chip turns red.
**Narration (ES):**
> En otro escenario, Bruno resuelve bien el sistema, pero en la parte B dice que María tiene razón, sin dar una razón. Cuatro de cada diez estudiantes de su sección responden igual. Sabe el procedimiento; todavía no sabe argumentar.

### Scene 11 · 6:35–6:55 · Sesión y clase (layer 7)
**Stage:** slide 10 returns, red outline.
**Card:**
- Se activa con: la tarjeta de Bruno y su sección
- Ve: falló la parte B, no la parte A
- Decide: vuelve al debate y retroalimenta con preguntas (PCI 9.4)
- Cuándo: la siguiente clase
**Production note:** when «semana veinticuatro» is spoken, show the 24 → 26 arc from Scene 4 in gray and cross it out softly. This explains why the route continues upward instead of going back to week 24.
**Thread:** «El debate» chip turns red.
**Narration (ES):**
> La docente lee qué parte falló. Como Bruno sí resolvió, el problema no está en los determinantes de la semana veinticuatro: está en argumentar. En la siguiente clase vuelve al debate y le hace preguntas hasta que él mismo encuentre un caso sin solución.

### Scene 12 · 6:55–7:10 · Unidad didáctica VI (layer 5)
**Stage:** the five week tiles return; 27 and 28 light red. The «criterios de evaluación» slot pulses.
**Card:**
- Se activa con: el resultado de la semana 26
- Ve: qué queda de la unidad (semanas 27–28, Proyecto STEAM III)
- Decide: incluye en el proyecto un momento para plantear y refutar afirmaciones
- Cuándo: esa misma semana
**Production note:** the pulse passes through layer 6 without lighting it; layer 6 lights in Scene 13.
**Narration (ES):**
> Con ese dato, el docente ajusta lo que queda de la unidad: el proyecto STEAM de las semanas veintisiete y veintiocho incluirá un momento para plantear y refutar afirmaciones.

### Scene 13 · 7:10–7:35 · Cuaderno de trabajo (layer 6)
**Stage:** pages 109–113 return. The four capacity tags reappear above them. «Usa estrategias» glows faintly over the pages; «Argumenta» stays unlit, with a red outline.
**Card:**
- Se activa con: el mismo patrón en varias secciones de 4.°
- Ve: las páginas 109–113 entrenan el procedimiento, pero ningún ejercicio pide explicar o justificar
- Decide: la dirección pedagógica revisa esas páginas y agrega ítems de «¿quién tiene razón?»
- Cuándo: revisión mensual; impresión del año siguiente
**Thread:** «Páginas 109–113» chip turns red.
**Narration (ES):**
> Si el mismo resultado aparece en varias secciones, ya no es un estudiante: es un patrón. La dirección pedagógica revisa las páginas ciento nueve a ciento trece y ve que entrenan el procedimiento, pero no la argumentación. Un patrón no prueba que el material sea la causa, pero sí justifica revisarlo.

### Scene 14 · 7:35–7:50 · Programación anual (layer 4)
**Stage:** the week 26 cell returns, red outline. A new empty line appears under it: «Criterio de argumentación».
**Card:**
- Se activa con: la revisión del cuaderno
- Ve: la semana 26 lista contenidos, pero no qué debe poder argumentar el estudiante
- Decide: agrega a la semana 26 un criterio de argumentación para el próximo año
- Cuándo: jornada de reflexión de julio o diciembre
**Narration (ES):**
> La programación anual también se ajusta: la semana veintiséis no solo dirá qué contenidos enseñar, sino qué debe poder argumentar el estudiante.

### Scene 15 · 7:50–8:10 · PCI 2026 (layer 3)
**Stage:** the Matemática → Álgebra 3 h tile returns, red outline. Small row of section tiles below it, several red (no numbers).
**Card:**
- Se activa con: el análisis mensual (PCI 12.1)
- Ve: varias secciones bajo el umbral acordado en la misma capacidad
- Decide: activa refuerzo (PCI 10); en diciembre propone cambios para el PCI 2027
- Cuándo: mensual · jornadas de julio y diciembre
**Production note:** «umbral acordado» stays as words. No number.
**Narration (ES):**
> Cada mes, la coordinación compara los resultados de todas las secciones. Si están por debajo del umbral acordado, activa los grupos de refuerzo del PCI. Y en diciembre, el equipo directivo decide qué cambia en el PCI del próximo año: tiempo, método o materiales.

### Scene 16 · 8:10–8:25 · PEI 2026–2030 (layer 2)
**Stage:** the three PEI columns return. The **Dónde estamos (diagnóstico)** column lights red, then objective 01.
**Card:**
- Se activa con: la jornada de reflexión de diciembre
- Ve: que en 4.° la capacidad débil es «argumenta afirmaciones»
- Decide: actualiza el diagnóstico (5.4) con datos por capacidad y precisa el objetivo 01
- Cuándo: diciembre
**Narration (ES):**
> En diciembre, la evidencia llega al PEI. El diagnóstico ya no dice solo que Matemática está baja; dice qué capacidad está baja y en qué grado. Con eso, el objetivo uno se vuelve preciso.

### Scene 17 · 8:25–8:45 · Currículo Nacional (layer 1)
**Stage:** **reverse zoom.** Start on the four capacities with «Argumenta» lit red. Zoom out to the four Matemática competencies with «Regularidad, equivalencia y cambio» red. Zoom out to all 31 competency tiles: one red tile among 31. The three phrases of the level 7 standard reappear; «casos especiales … contraejemplos» is underlined in red.
**Card:**
- Se activa con: el cierre del bimestre
- Ve: la competencia registrada (SIAGIE)
- Decide: el Currículo no cambia; cambia cómo el colegio lo aplica
**Thread:** the full thread column is red from bottom to top.
**Narration (ES):**
> Y la sangre llega al cerebro. La tarjeta de Bruno vuelve a la misma frase del Currículo Nacional con la que empezamos: plantear afirmaciones sobre casos especiales y descartarlas con contraejemplos. Una capacidad, de una competencia, entre treinta y una. El Currículo no cambia. Cambia cómo nuestro colegio lo hace llegar a cada estudiante.

---

## PART 4 — Cierre

### Scene 18 · 8:45–9:15 · El principio
**Funnel:** all layers visible. The teal pulse runs down the left of the rail while the red pulse runs up the right, in a loop. The thread column shows all eight chips, alternating teal and red.
**Stage:** responsibility table, revealed row by row.

| Responsable | Cuándo | Qué hace |
|---|---|---|
| Docente | Cada clase | Lee la tarjeta y reenseña |
| Coordinación | Mensual | Compara secciones y activa refuerzo |
| Dirección pedagógica | Mensual | Revisa el cuaderno |
| Equipo directivo | Julio y diciembre | Ajusta programación, PCI y PEI |

**Final on-screen:**
> Las decisiones bajan. La evidencia sube.
> Así debería funcionar.

**Narration (ES):**
> Las decisiones bajan desde el Currículo Nacional hasta el estudiante: de todo, a esta clase. La evidencia sube por el mismo hilo, desde el estudiante hasta el Currículo. Cada capa sabe qué mira, cuándo lo mira y qué hace cuando el aprendizaje no llega. Así debería funcionar.

**Hold:** 6 seconds on the final frame.

---

## Runtime note
This version runs about **9:15**, up from ~7:55 in v2, because every layer now explains what it is, what it takes and what it hands down. Options, from least to most cost to clarity:
1. **Speed up the Panorama beats** (1.5 s instead of 3 s each): saves about 25 s.
2. **Drop the metacognition mention in Scene 7 and the "4 de cada 10" line in Scene 10:** saves about 10 s.
3. **Split into two videos:** Part 1 (bajada, ~5:40) and Parts 2–4 (subida, ~3:35). Each stands alone, and the second can open with a 10-second recap of the thread column.

I'd choose option 3 if this is for leaders. The down-pass is the lesson; the climb is the operating system. They're easier to absorb as two sittings.

---

## Appendix for Martin (not in the video)

**Verified against source documents:** CNEB level 7 standard text and the four Matemática competencies; PEI §§5.4, 6.2–6.4 and the six institutional objectives; PCI 2026 §§3.2, 5.3 (all 11 Secundaria areas and hours), 7.2–7.3, 8, 9.2–9.4, 10, 12.1, 12.3; temario 2026 weeks 22–28; workbook III Bimestre index (weeks 20–28) and week 26 pp. 109–113, including the «Competencia 2» line on each page; deck slides 3, 7, 10, 13–22, 23.

**From general knowledge of the CNEB, worth a quick check before rendering:** the counts of 11 aprendizajes in the perfil de egreso and 31 competencias. Both are standard CNEB figures, but I did not re-read them in the source during this analysis.

**Inferred, not documented:** that the workbook is produced «un tomo por bimestre» by the dirección pedagógica. The bimester naming supports it; the owner is our assignment from earlier passes. Confirm before narration is recorded.

**Shown in the video as "how it should work", but not true today:**
- Unit VI has no written plan; the Secundaria unit and session folder is empty.
- The temario lacks the standards and criteria that PCI §7.2 requires.
- The monthly analysis (PCI §12.1) and the July/December loop are declared but not yet evidenced.

**Not verified:** the exact 4th-grade desempeño wording in the MINEDU Programa curricular de Secundaria.

**Contradictions to resolve before showing leaders:**
- The PEI baseline (60% "satisfactorio") does not match the PCI baseline (15–27% A+AD in Secundaria math).
- The PCI declares ABP as the main method; the temario, workbook and class are direct instruction.

**Design choice to confirm:** Scenario B follows a *reasoning* failure. A *procedure* failure appears only as the crossed-out arc in Scene 11. If you want it as its own route, it becomes Scenario C: layer 7 → workbook week 24 → programación anual.
