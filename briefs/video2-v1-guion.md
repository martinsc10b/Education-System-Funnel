# Video 2 v1 · La brújula

Narración final, tal como se grabó (voz `lZmnvfWF4ko4J7F7QDtX`, eleven_v4, la misma de Video 1 v6). Fuente del guion: Claude Doc v5 (aprobado el 27 de octubre de 2026). Fuente en el repo: `src/video2v1/narration.json`. Composición Remotion: `video-2-v1`. Video: `out/VIDEO-2_La-brujula-v1.mp4`.

Modelo visual: el mismo embudo 2.5D de Video 1 v6, con anillos más ovalados y separados. Colores por sistema: liderazgo (anillos 1–3) en la familia azul marino, enseñanza y aprendizaje (anillos 4–8) en naranjas suaves, de oscuro a claro hacia abajo. Todo el video es la subida: un punto cian y su rastro recorren la espiral desde Estudiante hasta Currículo Nacional.

Personajes: profesora Carmen (Matemática, 4.° A); Bruno y Ana (ficticios, 15 años). Coordinación y Dirección aparecen sin nombre. En pantalla, siempre que hay cifras: «Estudiantes ficticios · cifras de ejemplo».

| Escena | Embudo | Narración |
|---|---|---|
| W00 · Apertura | Punto cian en Estudiante | En el video anterior vimos que las decisiones bajan hasta el aula. Ahora seguimos el camino de vuelta: cómo sabe el colegio si su estrategia está llegando a los estudiantes. |
| W01 · Las dos mitades | Estudiante | Volvamos a la clase de la profesora Carmen. Su propósito tiene dos mitades. Conocimiento: resolver el sistema. Enfoque por competencias: explicar qué significa la solución y comprobarla. |
| W02 · Bruno y Ana | Estudiante | Bruno resuelve, explica que las rectas son paralelas y lo comprueba en una gráfica: cien por ciento. Ana también llega a la respuesta, pero no sabe explicar por qué: cincuenta. La respuesta es la misma. El razonamiento, no. |
| W03 · La regla | Estudiante | Al cerrar la sesión, Carmen revisa la lista de cotejo que ya usa. Las dos mitades, cien. Una, cincuenta. Ninguna, cero. Y quien no se registró, no cuenta. No es una nota. Es una señal. |
| W04 · Cada sesión cuenta | Estudiante | Una sesión no basta. En cinco sesiones de la unidad, Bruno logra las dos mitades tres veces y una mitad dos veces. Su brújula en la unidad: ochenta por ciento. |
| W05 · La sección | Sube de Estudiante a Sesión | En cuarto A hay veinte estudiantes. Hoy se registraron dieciocho: nueve logran las dos mitades y nueve, una. La sección está en setenta y cinco por ciento. |
| W06 · La primera respuesta es del aula | Se ilumina Sesión | La primera en usar esa señal es Carmen. En la siguiente sesión vuelve a explicar qué significa un sistema sin solución, y registra a quienes faltaron. |
| W07 · Grado y división | Sube de 6 a 4 | Las secciones se juntan. Cuarto grado llega a setenta y dos, y una sección en sesenta destaca de inmediato. Con quinto, secundaria alta suma setenta y cuatro. |
| W08 · Cada nivel responde a su escala | Cruza a liderazgo: PCI, PEI | La coordinación ajusta las sesiones que quedan en la unidad y anota qué cambiar en el próximo cuaderno de trabajo. Al cerrar el bimestre, la dirección compara cada división con la meta del PCI y ajusta el PAT. Ese paso ya es el sistema de liderazgo. |
| W09 · Del estudiante al colegio | Llega a Currículo Nacional | Bruno es uno de novecientos diecinueve estudiantes. Cada uno pesa lo mismo, y juntos forman la brújula del colegio: setenta y ocho por ciento. Es el mismo número, a distintas escalas. |
| W10 · Tres ritmos | Currículo Nacional | La brújula de cada sesión da el pulso diario. Los exámenes confirman el conocimiento. El proyecto STEAM confirma el enfoque por competencias. Cada nivel pondera sus notas a su manera; la brújula se lee igual en todos. Si no coinciden, eso también es una señal. |
| W11 · Cierre | Embudo y espiral completos | La brújula no juzga a los estudiantes. Con ella podemos ver, cada bimestre, si vamos camino a las metas del 2030. Es una hipótesis que vamos a probar juntos: si nos muestra dónde funciona nuestro sistema de gestión pedagógica, y qué capa mover primero. |

Tarjeta final (1,5 s): «Las decisiones bajan. La evidencia sube.» · Colegio San Pío X · Bloom for Education.

## Cómo se mide la brújula

- Cada sesión, el propósito tiene dos mitades (lista de cotejo de la sesión 6): **Conocimiento** (selecciona y aplica procedimientos algebraicos) y **Enfoque por competencias** (explica el significado de las soluciones y distingue los tipos de sistema, y comprueba resultados y explica procedimientos; las dos son necesarias).
- Las dos mitades = 100 % · una = 50 % · ninguna = 0 % · sin registro = no cuenta (se excluye, nunca vale cero). No es una nota.
- Cada sesión pesa igual; la brújula de un estudiante es el promedio de sus sesiones medidas. Al subir, cada estudiante pesa igual.

## Cifras de ejemplo (en pantalla)

- Bruno, unidad VI, cinco sesiones: 100 · 100 (sesión 6) · 50 · 100 · 50 → 80 %.
- 4.° A: 20 estudiantes, 18 registrados: 9 con las dos mitades, 9 con una, 2 sin registro → 75 %.
- 4.° A 75 % · B 80 % · C 60 % · D 73 % → 4.° grado 72 %. 5.° grado 76 % → secundaria alta 74 %. Colegio 78 %. Bruno = 1 de 919 ≈ 0,11 %.

## Notas de producción

- En W08, la voz lee «PCI» con el campo `tts` «pe, ce, i» (solo pronunciación). El subtítulo usa el texto literal.
- La transcripción (stt) escribe en cifras «100», «50», «80», «20», «18», «75», «72», «60», «74» y «78»; las palabras coinciden con el guion.
- Los tiempos salen del audio real: `node scripts/video2v1.mjs tts | stt | timeline | stills`. Cada escena dura lo que su narración y la siguiente empieza 0,3 s después. Las pausas internas mayores de 0,45 s se acortan a 0,35 s.
- Duración: 2:46,6 (el guion estimaba ~3:15; la voz es más rápida que la estimación y el texto no se modificó).
