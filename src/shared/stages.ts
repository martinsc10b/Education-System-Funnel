// The 8 stages of the map. Single source for both videos (Video 1 script §0.2).
export type Stage = { id: number; name: string; es: string; entrega: string; ficha: string };
export const STAGES: Stage[] = [
  { id: 1, name: "Currículo Nacional", es: "Lo que todo estudiante del Perú debe aprender (MINEDU)", entrega: "Qué aprender y cómo reconocer el logro", ficha: "Qué aprender" },
  { id: 2, name: "PEI", es: "El plan del colegio a cinco años", entrega: "Prioridades y metas medibles", ficha: "Prioridades y metas" },
  { id: 3, name: "PCI", es: "El plan curricular del año", entrega: "Horas, método y forma de evaluar", ficha: "Reglas del año" },
  { id: 4, name: "Programación anual", es: "Un curso, todo el año, semana a semana", entrega: "El orden: qué, cuándo, después de qué", ficha: "El orden" },
  { id: 5, name: "Unidad didáctica", es: "Varias semanas con un propósito", entrega: "Los criterios de evaluación", ficha: "Criterios" },
  { id: 6, name: "Cuaderno de trabajo", es: "Lo que el estudiante tiene en la mano", entrega: "El material para practicar", ficha: "Material" },
  { id: 7, name: "Sesión", es: "Donde todo se vuelve clase", entrega: "Una tarea que deja evidencia", ficha: "Tarea con evidencia" },
  { id: 8, name: "Estudiante", es: "Quien aprende", entrega: "La evidencia de lo que logró", ficha: "Evidencia" },
];
export const NAMES = STAGES.map((s) => s.name);
export const FICHAS = STAGES.map((s) => s.ficha);
