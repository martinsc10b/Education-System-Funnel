# Video 1 · El mapa: del Currículo Nacional a una clase, y de vuelta

**Versión:** 1 · borrador para aprobación · 21 oct. 2026
**Alcance:** GROUP (explica el sistema; no usa datos de un campus)
**Duración objetivo:** ~3:00 · 1920×1080 · 30 fps · narración en español con subtítulos
**Relación con Video 2:** Video 1 enseña el mapa. Video 2 (la clase de Álgebra 4.°, semana 26, basada en el guion v4) hace zoom en un caso real dentro de ese mapa. Ambos comparten embudo, nombres, colores y componentes.

> Nota de construcción (26 oct. 2026): el video renderizado (`out/video-1-mapa-v1.mp4`, 3:17) usa los colores de marca elegidos por el usuario (azul marino #002E5D con degradé cian→azul en la bajada, naranja #FF6A14 en la subida y en ambos escenarios de Video 2), no los de la tabla 0.3.

---

## 0. Instrucciones de construcción para Claude Code

### 0.1 Un solo proyecto, dos videos, uno combinado
Construir **un único proyecto Remotion** con esta estructura:

```
src/
  shared/
    stages.ts      ← única fuente de los 8 nombres de etapa y sus textos cortos
    theme.ts       ← colores, tipografía, tiempos estándar
    Funnel.tsx     ← embudo de 8 etapas (estados: inactivo, activo, foco, atenuado)
    ThreadColumn.tsx ← columna de fichas del hilo a la derecha del embudo
    MiniMap.tsx    ← embudo pequeño en una esquina, con la etapa actual marcada
    StageCard.tsx  ← tarjeta «Es · Recibe · Entrega»
  video1/          ← escenas de este guion
  video2/          ← escenas del caso (se construyen después)
  Root.tsx         ← registra tres composiciones: Video1, Video2, Combinado
```

- **Combinado** = Video1 + Escena 5 (puente) + Video2, sin repetir la apertura de Video 2.
- Video 2 **no puede** redefinir nombres de etapa ni colores: los importa de `shared/`.
- Construir y renderizar solo Video 1 por ahora. Video 2 se construye cuando su guion esté aprobado.

### 0.2 Las 8 etapas (contenido de `stages.ts`)
Los nombres deben ser idénticos en ambos videos.

| # | Nombre en pantalla | Es (una línea) | Entrega a la siguiente |
|---|---|---|---|
| 1 | Currículo Nacional | Lo que todo estudiante del Perú debe aprender (MINEDU) | Qué aprender y cómo reconocer el logro |
| 2 | PEI | El plan del colegio a cinco años | Prioridades y metas medibles |
| 3 | PCI | El plan curricular del año | Horas, método y forma de evaluar |
| 4 | Programación anual | Un curso, todo el año, semana a semana | El orden: qué, cuándo, después de qué |
| 5 | Unidad didáctica | Varias semanas con un propósito | Los criterios de evaluación |
| 6 | Cuaderno de trabajo | Lo que el estudiante tiene en la mano | El material para practicar |
| 7 | Sesión | Donde todo se vuelve clase | Una tarea que deja evidencia |
| 8 | Estudiante | Quien aprende | La evidencia de lo que logró |

### 0.3 Colores (`theme.ts`)
| Uso | Color | Hex |
|---|---|---|
| Fondo | gris muy claro | `#F5F7F6` |
| Texto | tinta | `#13233A` |
| Bajada: decisiones | azul marino | `#1F3A5F` |
| Subida: evidencia (genérica, Video 1) | naranja | `#D9822B` |
| Video 2 · Escenario A (logra) | verde | `#3A7D44` |
| Video 2 · Escenario B (aún no) | rojo profundo | `#B3261E` |
| Etapa inactiva | gris | `#C9D1D3` |

### 0.4 Reglas de producción
1. Video 1 **no muestra datos del colegio**: ni porcentajes, ni cursos, ni nombres. Solo el mapa.
2. Mostrar en pantalla solo lo que dice la columna «En pantalla». No inventar íconos con texto adicional.
3. Cada tarjeta de etapa queda al menos 4 s en pantalla.
4. El embudo ocupa ~38 % izquierdo; el panel de contenido ~62 % derecho (igual que Video 2).
5. Al bajar, cada etapa entrega una ficha al hilo en azul marino. Al subir, las mismas fichas se vuelven naranjas de abajo hacia arriba.
6. El MiniMap aparece por primera vez en la Escena 5 y se usa en todo Video 2.

---

## 1. Guion

### Escena 0 · La pregunta · 0:00–0:15
**Narración**
En el Perú, el Ministerio de Educación define lo que todo estudiante debe aprender. Pero entre esa norma y lo que pasa en una clase hay un largo camino. Este video muestra ese camino.

**En pantalla**
- Fondo limpio. Pregunta centrada: «¿Cómo llega una norma nacional a una clase?»
- Abajo, pequeño: «Currículo Nacional» … «una clase», unidos por una línea punteada larga.

---

### Escena 1 · Un sistema hecho de sistemas · 0:15–0:42
**Narración**
Un colegio funciona como un sistema formado por varios sistemas. Uno organiza el liderazgo y la gestión. Otro cuida el bienestar y la convivencia. Otro asegura las condiciones: personas, horarios, espacios y recursos. Y en el centro está el sistema de enseñanza y aprendizaje. Todos se necesitan entre sí. Hoy seguimos solo uno: el que lleva el aprendizaje hasta la clase.

**En pantalla**
- Un círculo grande: «Colegio». Dentro aparecen, al nombrarlos, cuatro círculos: Liderazgo y gestión · Bienestar y convivencia · Condiciones operativas · Enseñanza y aprendizaje (al centro).
- Líneas finas los conectan entre sí («todos se necesitan»).
- Foco: los otros tres se atenúan; «Enseñanza y aprendizaje» crece y se transforma en el embudo (transición a Escena 2).

---

### Escena 2 · El embudo · 0:42–0:55
**Narración**
Ese sistema funciona como un embudo de ocho etapas. Arriba, lo que vale para todo el país. Abajo, un estudiante en una clase. Cada etapa recibe algo de la anterior y entrega algo a la siguiente.

**En pantalla**
- El embudo de 8 etapas, todas inactivas, con sus nombres.
- Etiqueta arriba: «Todo el país». Etiqueta abajo: «Un estudiante».
- Esquema al lado: Recibe → Etapa → Entrega.

---

### Escena 3 · Bajada: las decisiones · 0:55–2:15
Ocho tiempos de ~10 s. En cada uno: la etapa se activa en azul marino, aparece su tarjeta (Es · Entrega) y una ficha cae al hilo.

| Tiempo | Etapa | Narración | En pantalla |
|---|---|---|---|
| 0:55–1:05 | 1 Currículo Nacional | El Currículo Nacional dice qué debe aprender todo estudiante del país: competencias, capacidades y estándares de logro. Entrega qué aprender y cómo reconocer que se aprendió. | Tarjeta: Competencias · Capacidades · Estándares. Ficha: «Qué aprender». |
| 1:05–1:15 | 2 PEI | El PEI es el plan del colegio a cinco años. Dice quiénes somos, dónde estamos y a dónde vamos. Entrega prioridades y metas que se pueden medir. | Tres columnas: Quiénes somos · Dónde estamos · A dónde vamos. Ficha: «Prioridades y metas». |
| 1:15–1:25 | 3 PCI | El PCI es el plan curricular del año. Reparte las horas por área y fija el método y la forma de evaluar. Entrega reglas comunes para todos los cursos. | Tarjeta: Horas · Método · Evaluación. Ficha: «Reglas del año». |
| 1:25–1:35 | 4 Programación anual | La programación anual toma un curso y lo reparte en todas las semanas del año. Entrega el orden: qué se enseña, cuándo y después de qué. | Fila de semanas con conectores ›. Ficha: «El orden». |
| 1:35–1:45 | 5 Unidad didáctica | La unidad agrupa varias semanas alrededor de un propósito. Entrega los criterios: lo que el docente va a mirar en el trabajo del estudiante. | Llave sobre varias semanas; casilla «Criterios» resaltada. Ficha: «Criterios». |
| 1:45–1:55 | 6 Cuaderno de trabajo | El cuaderno de trabajo es lo que el estudiante tiene en la mano. Sigue la programación semana a semana. Entrega el material para practicar. | Un cuaderno abierto, páginas sin texto legible. Ficha: «Material». |
| 1:55–2:05 | 7 Sesión | En la sesión todo se vuelve clase. El docente une lo que recibió y propone una tarea que deja evidencia. | Llegan tres fichas (de 4, 5 y 6) a la etapa 7. Ficha: «Tarea con evidencia». |
| 2:05–2:15 | 8 Estudiante | Y el estudiante responde. Lo que hace es la evidencia de lo que aprendió. | Una silueta de estudiante. Ficha: «Evidencia». |

**Nota de construcción:** en el tiempo 7, mostrar explícitamente que la sesión recibe tres entradas (programación, unidad y cuaderno). Es el único punto donde el embudo no es una cadena simple, y Video 2 lo necesita igual.

---

### Escena 4 · Subida: la evidencia · 2:15–2:45
**Narración**
Ahí el camino da la vuelta. La evidencia sube por el mismo hilo. El docente la mira en cada clase y reenseña. La coordinación la compara cada mes entre secciones. El colegio revisa sus materiales. Y el equipo directivo, en julio y en diciembre, ajusta la programación, el PCI y el PEI. El Currículo Nacional no cambia. Cambia cómo el colegio lo hace llegar a cada estudiante.

**En pantalla**
- Flecha naranja hacia arriba. Las fichas del hilo se vuelven naranjas de abajo hacia arriba, sincronizadas con la narración.
- Tabla que se arma fila por fila:

| Quién | Cuándo | Qué hace |
|---|---|---|
| Docente | Cada clase | Mira la evidencia y reenseña |
| Coordinación | Cada mes | Compara secciones |
| Colegio | Cada mes | Revisa materiales |
| Equipo directivo | Julio y diciembre | Ajusta programación, PCI y PEI |

- Al final: las dos flechas a la vez (azul hacia abajo, naranja hacia arriba). Texto: «Las decisiones bajan. La evidencia sube.»

---

### Escena 5 · El puente al Video 2 · 2:45–3:00
**Narración**
Así debería funcionar el sistema. Ahora vamos a comprobarlo con una clase real: Álgebra, cuarto de secundaria, semana veintiséis.

**En pantalla**
- El embudo se reduce y se coloca en la esquina superior izquierda como **MiniMap**.
- En el MiniMap se enciende la etapa 7. Etiqueta: «Álgebra · 4.° · semana 26».
- Texto: «Video 2 · Una clase real».
- En el video Combinado, esta escena enlaza directamente con la primera escena de Video 2 (que arranca con el MiniMap ya en la esquina).

---

## 2. Notas para revisión

**Lo que este video afirma sin datos del colegio.** Todo el contenido es estructural. Las únicas referencias institucionales son la cadencia de la Escena 4 (mensual; julio y diciembre), que viene de PCI 2026 §12.1 (LOS OLIVOS). Si el video se usará también en San Martín de Porres, confirmar que su PCI fija la misma cadencia.

**«Así debería funcionar».** Igual que en Video 2, el video describe el diseño, no la práctica actual. Hoy la Unidad VI no tiene plan escrito y el análisis mensual no está evidenciado (ver hallazgos previos).

**Los cuatro subsistemas de la Escena 1** son un marco institucional para explicar, no una clasificación oficial del MINEDU. Opción a decidir: alinearlos con los cinco Compromisos de Gestión Escolar (CGE), que el PEI ya usa. Eso le da respaldo normativo, pero suma cinco nombres y unos 10 segundos. Verificar la redacción vigente de los CGE antes de usarla.

**Para mantener la conexión con Video 2:** al revisar el guion v4, sus escenas 1–8 deberían acortarse, porque Video 1 ya explica qué es cada etapa. Video 2 puede enfocarse en qué toma esta clase de cada etapa.
