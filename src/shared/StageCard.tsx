import React from "react";
import { useCurrentFrame } from "remotion";
import { C, SANS, layerColor } from "./theme";
import { isLight, ramp } from "../kit";
import { Stage } from "./stages";

// Stage card: «Es · (Recibe) · Entrega», with the stage's own visual in the middle.
export const StageCard: React.FC<{ stage: Stage; at: number; entregaAt: number; recibe?: string; color?: string; children?: React.ReactNode }> = ({ stage, at, entregaAt, recibe, color, children }) => {
  const f = useCurrentFrame();
  const col = color ?? layerColor(stage.id);
  const t = ramp(f, at, 14), tE = ramp(f, entregaAt, 12);
  const row = (label: string, body: string, o: number) => (
    <div style={{ display: "flex", gap: 16, alignItems: "baseline", opacity: o }}>
      <div style={{ width: 120, flex: "0 0 auto", fontSize: 18, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", color: C.muted }}>{label}</div>
      <div style={{ fontSize: 27, fontWeight: 700, color: C.ink, lineHeight: 1.25 }}>{body}</div>
    </div>
  );
  return (
    <div style={{ width: 870, fontFamily: SANS, opacity: t, transform: `translateY(${(1 - t) * 24}px)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 56, height: 56, borderRadius: 28, background: col, color: isLight(col) ? C.ink : "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 800 }}>{stage.id}</div>
        <div style={{ fontSize: 46, fontWeight: 800, color: C.navy }}>{stage.name}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 28 }}>
        {row("Es", stage.es, 1)}
        {recibe && row("Recibe", recibe, 1)}
        <div style={{ height: 300, position: "relative", margin: "6px 0" }}>{children}</div>
        <div style={{ borderTop: `3px solid ${col}`, paddingTop: 16, opacity: tE }}>{row("Entrega", stage.entrega, 1)}</div>
      </div>
    </div>
  );
};
