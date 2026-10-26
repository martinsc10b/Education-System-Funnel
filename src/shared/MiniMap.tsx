import React from "react";
import { C, G, SANS, layerColor, mixHex } from "./theme";
import { lerp } from "../kit";
import { NAMES } from "./stages";

// The 8-stage funnel as a small map in the top-left corner. t = 0 draws it at full size where the main
// funnel sits (so it can take over seamlessly); t = 1 is the corner size. `lit` marks the current stage.
export const MINI = { x: 40, y: 92, scale: 0.34 };
export const MiniMap: React.FC<{ t: number; lit?: number; litT?: number; label?: string; color?: string }> = ({ t, lit, litT = 1, label, color }) => {
  const sc = lerp(1, MINI.scale, t);
  const left = G.funnelCx - G.barW(1) / 2;
  const x = lerp(left, MINI.x, t), y = lerp(G.barY(1), MINI.y, t);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: G.barW(1), transform: `scale(${sc})`, transformOrigin: "top left", fontFamily: SANS }}>
      {NAMES.map((n, i) => {
        const id = i + 1, w = G.barW(id);
        const on = id === lit ? litT : 0;
        const col = color ?? layerColor(id);
        return (
          <div key={id} style={{ position: "absolute", left: (G.barW(1) - w) / 2, top: G.barY(id) - G.barY(1), width: w, height: G.barH, boxSizing: "border-box", borderRadius: 14, border: `2px solid ${on ? col : C.line}`, background: on ? mixHex("#FFFFFF", col, on) : "#FFFFFF", display: "flex", alignItems: "center", padding: "0 16px", gap: 12, fontSize: 22, fontWeight: on > 0.5 ? 800 : 600, color: on > 0.5 ? "#fff" : C.muted, whiteSpace: "nowrap", overflow: "hidden" }}>
            <span style={{ fontWeight: 800 }}>{id}</span>{n}
          </div>
        );
      })}
      {label && lit && (
        <div style={{ position: "absolute", left: (G.barW(1) + G.barW(lit)) / 2 + 24, top: G.barY(lit) - G.barY(1) + 4, whiteSpace: "nowrap", fontSize: 64, fontWeight: 800, color: C.navy, opacity: litT }}>{label}</div>
      )}
    </div>
  );
};
