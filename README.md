# Education System Funnel

Videos explicativos para el Consorcio Educativo San Pío X: cómo el Currículo Nacional llega hasta una clase a través de un embudo de 8 etapas, y cómo la evidencia de aprendizaje vuelve hacia arriba. Hechos en [Remotion](https://www.remotion.dev/), con narración en español (voz sintética) y subtítulos incrustados.

## Videos

| Video | Archivo | Duración | Estado |
|---|---|---|---|
| Video 1 · El mapa | [`out/video-1-mapa-v1.mp4`](out/video-1-mapa-v1.mp4) | 3:17 | Construido, por aprobar |
| Video del caso v4 · Álgebra 4.°, semana 26 | [`out/la-vena-completo-v4.mp4`](out/la-vena-completo-v4.mp4) | 10:42 | Completo; base para Video 2 |
| Video 2 · Una clase real | — | — | Guion pendiente |
| Versión anterior (v3, partes 0–1) | [`archive/v3/la-vena-parte-0-1.mp4`](archive/v3/la-vena-parte-0-1.mp4) | 6:14 | Reemplazada por v4 |

## Guiones y resúmenes

| Documento | Markdown | Página en claude.ai |
|---|---|---|
| Estado del proyecto (decisiones y pendientes) | [`briefs/estado-del-proyecto.md`](briefs/estado-del-proyecto.md) | https://claude.ai/artifact/SvZy4CiiEbZxHTMsEJV9VA |
| Guion completo del video del caso v4 | [`briefs/guion-completo-v4.md`](briefs/guion-completo-v4.md) | https://claude.ai/artifact/27kgqc4dccWSx5DWbTPzMs |
| Guion Video 1 · El mapa (v1) | [`briefs/video1-guion-v1.md`](briefs/video1-guion-v1.md) | — |
| Respuestas a la revisión de las partes 0–1 y narración v4 | [`briefs/v4-parte-0-1-borrador.md`](briefs/v4-parte-0-1-borrador.md) | — |
| Guion original v3 | [`briefs/v3-script.md`](briefs/v3-script.md) | — |

Las páginas de claude.ai son privadas: solo las abre la cuenta dueña, o quien reciba acceso desde su menú **Share**. Las versiones HTML de esas páginas están en `briefs/*.html`.

## Estructura

```
src/
  shared/          etapas, colores, MiniMap y tarjeta de etapa compartidos por ambos videos
  video1/          Video 1 · El mapa (narración, tiempos, escenas)
  part01.tsx       video del caso: partes 0–1 (bajada)
  part234.tsx      video del caso: partes 2–4 (escenarios A y B, cierre)
  chrome.tsx       embudo, flecha, hilo, subtítulos
  narration.json   narración del video del caso (texto exacto)
  layers.json      datos de las 8 capas del video del caso
  Root.tsx         composiciones: video-1-mapa, la-vena (caso completo), la-vena-parte-N
public/audio/      narración generada (mp3)
scripts/           tts → stt (verificación y tiempos por palabra) → timeline → render
briefs/            guiones, resúmenes y respuestas
archive/v3/        versión anterior del video del caso
```

## Cómo reconstruir

```bash
npm install
npm run studio                                    # vista previa
node scripts/tts.mjs --set=video1                 # voz (requiere ELEVENLABS_API_KEY en .env)
node scripts/stt.mjs --set=video1                 # verifica la voz contra el guion y guarda tiempos
node scripts/timeline.mjs --set=video1
npx remotion render video-1-mapa out/video-1-mapa-v1.mp4 --codec=h264 --crf=18
```

Sin `--set`, los scripts trabajan sobre el video del caso (`src/narration.json`). La clave de ElevenLabs no está en el repositorio: se lee de un archivo `.env`.

## Colores de marca

- Azul marino `#002E5D` (colegio): bajada (decisiones), en degradé desde el cian `#67D2DF` en el Currículo Nacional hasta el azul marino en el Estudiante.
- Naranja `#FF6A14` (negocio): subida (evidencia).
