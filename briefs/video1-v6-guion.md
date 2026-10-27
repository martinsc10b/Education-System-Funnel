# Video 1 v6 · ¿Cómo entendemos nuestra labor pedagógica?

Narración final, tal como se grabó (voz `lZmnvfWF4ko4J7F7QDtX`, eleven_v4). Fuente: `src/video1v6/narration.json`. Composición Remotion: `video-1-v6`. Video: `out/VIDEO-1_Labor-pedagogica-v6.mp4`.

Modelo visual: embudo 2.5D de ocho anillos (más ancho arriba) recorrido por una sola espiral; dos sistemas simultáneos como bandas de fondo: anillos 1–3 «Sistema de liderazgo», anillos 4–8 «Sistema de enseñanza y aprendizaje». Bajada en azul marino, subida en naranja.

Personajes: profesora Carmen (Matemática, 4.° A) y Bruno (4.° A, 15 años).

| Escena | Embudo | Narración |
|---|---|---|
| V00 · Apertura | Embudo y espiral en gris; ambas bandas se encienden y se atenúan | En nuestro colegio, toda decisión debe tener su impacto en el aula. Veamos cómo llega una decisión hasta esta clase de Álgebra de cuarto de secundaria, en la semana veintiséis. |
| V01 · Currículo Nacional | Anillo 1 | Todo empieza en el Currículo Nacional. El Ministerio, junto con la dirección regional y la UGEL, define las treinta y una competencias que todo estudiante del Perú debe desarrollar. Por ejemplo, resolver problemas de regularidad, equivalencia y cambio. |
| V02 · PEI y PAT | Anillo 2 · etiqueta PAT 2027 | El colegio toma ese marco y lo hace suyo. La empresa define su visión, su misión y sus valores, y el PEI los convierte en metas para el colegio. A su lado, el PAT organiza cada año los pasos para lograrlas. |
| V03 · PCI | Anillo 3 · se ilumina «Sistema de liderazgo» | El PCI baja esas metas a decisiones pedagógicas: qué competencias priorizar, con qué enfoque enseñar, cuántas horas dedicar a cada área y cómo evaluar. Estas tres capas forman el sistema de liderazgo. |
| V04 · Programación anual | Se ilumina «Sistema de enseñanza y aprendizaje» · anillo 4 | Aquí empieza el sistema de enseñanza y aprendizaje. Los docentes de Matemática preparan la programación anual: qué se enseña cada semana y en qué orden. Los sistemas de ecuaciones llegan en la semana veintiséis, justo después de las ecuaciones lineales. |
| V05 · Unidad didáctica | Anillo 5 | El año se organiza en cuatro bimestres y ocho unidades, cada una con un reto. Esta semana está en la unidad seis, "Del reto al aprendizaje: Jugamos para crecer", que define los criterios para mirar el trabajo de cada estudiante. |
| V06 · Cuaderno de trabajo | Anillo 6 | El colegio elabora el cuaderno de trabajo y lo entrega dos veces al año, como parte de su propuesta de valor. Sigue la misma secuencia: página ochenta y cuatro, semana veintiséis. |
| V07 · Sesión | Anillo 7 | Y en la sesión, todo se encuentra. La profesora Carmen escribe el propósito a partir de los criterios de la unidad: resolver sistemas de ecuaciones y clasificarlos como compatibles o incompatibles. |
| V08 · Estudiante | Anillo 8 · el punto llega a la punta | Al final está Bruno. Explica por qué un sistema no tiene solución, comprueba su resultado y encuentra un error. Ahí, en el aula, aterrizan todas las decisiones anteriores. |
| V09 · El camino de vuelta | Punto naranja sube 8 → 1 | Y el camino también sube. Lo que Bruno hace y explica ayuda a Carmen a ajustar su enseñanza. Al reunir evidencias de varios estudiantes y en distintos momentos, el colegio puede revisar su planificación y valorar sus avances, con el Currículo Nacional como referente. |
| V10 · Cierre | Todo en naranja · ambas bandas en «dos sistemas» | Esto es el sistema de gestión pedagógica: dos sistemas que funcionan a la vez, el de liderazgo y el de enseñanza y aprendizaje. Decisiones que bajan hasta el aula y aprendizajes que suben para mejorarlas. Es uno de varios sistemas que conviven en el colegio. Tener claridad de los objetivos fortalece la calidad de nuestro servicio educativo. |

Tarjeta final (1,5 s): «¿Cómo entendemos nuestra labor pedagógica?» · Colegio San Pío X · Bloom for Education.

## Criterios de la unidad VI (en pantalla, escenas 5 y 8)

1. Explica qué significan las soluciones y distingue los tipos de sistema
2. Selecciona y aplica procedimientos algebraicos
3. Comprueba sus resultados y explica sus procedimientos

## Notas de producción

- En V03, la voz lee «PCI» con el campo `tts` «pe, ce, i» (solo pronunciación). El subtítulo usa el texto literal.
- Los tiempos salen del audio real: `node scripts/video1v6.mjs tts | stt | timeline | stills`. Cada escena dura lo que su narración y la siguiente empieza 0,3 s después. Las pausas internas mayores de 0,45 s se acortan a 0,35 s.
- «31 competencias» se verificó el 26 de octubre de 2026 contra el CNEB vigente (RM 281-2016). El MINEDU está actualizando el currículo (RM 393-2026, hasta diciembre de 2027): volver a verificar antes de reutilizar este video después de 2027.
- La transcripción (stt) escribe «31», «26» y «84» en cifras; las palabras coinciden con el guion.
