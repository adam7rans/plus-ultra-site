import { useState } from "react";
import type { ContourParams } from "./settings";

interface SliderRowProps {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; format?: (v: number) => string;
}
function SliderRow({ label, value, min, max, step, onChange, format }: SliderRowProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 10, fontFamily: "monospace", color: "rgba(216,234,217,0.6)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>
        <span style={{ fontSize: 10, fontFamily: "monospace", color: "rgba(57,255,20,0.9)", minWidth: 40, textAlign: "right" }}>{format ? format(value) : value}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        style={{ width: "100%", accentColor: "#39FF14", cursor: "pointer", height: 4 }} />
    </div>
  );
}

export function ContourControls({ params, onChange, onReset, isRebuilding }: {
  params: ContourParams; onChange: (p: Partial<ContourParams>) => void;
  onReset: () => void; isRebuilding: boolean;
}) {
  const [open, setOpen] = useState(true);
  const p = params;

  return (
    <div style={{ position: "absolute", top: 80, right: 16, width: 240, backgroundColor: "rgba(13,18,16,0.96)", border: "1px solid rgba(57,255,20,0.25)", borderRadius: 8, boxShadow: "0 0 24px rgba(57,255,20,0.08)", fontFamily: "monospace", zIndex: 50, overflow: "hidden" }}>
      <div onClick={() => setOpen(o => !o)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", cursor: "pointer", borderBottom: open ? "1px solid rgba(57,255,20,0.15)" : "none", userSelect: "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 9, color: "rgba(57,255,20,0.5)" }}>◈</span>
          <span style={{ fontSize: 10, color: "rgba(57,255,20,0.9)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Contour Controls</span>
          {isRebuilding && <span style={{ fontSize: 9, color: "rgba(255,184,0,0.8)" }}>↻</span>}
        </div>
        <span style={{ fontSize: 10, color: "rgba(57,255,20,0.5)" }}>{open ? "▲" : "▼"}</span>
      </div>

      {open && (
        <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 14, maxHeight: "80vh", overflowY: "auto" }}>

          <div>
            <SectionLabel>Motion</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <SliderRow label="Speed" value={p.speed} min={0} max={40} step={0.5} onChange={v => onChange({ speed: v })} format={v => v.toFixed(1)} />
              <SliderRow label="Speed Y ratio" value={p.speedYRatio} min={0} max={2} step={0.05} onChange={v => onChange({ speedYRatio: v })} format={v => v.toFixed(2)} />
            </div>
          </div>

          <div>
            <SectionLabel>Visual</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <SliderRow label="Canvas opacity" value={p.opacity} min={0.05} max={1} step={0.01} onChange={v => onChange({ opacity: v })} format={v => v.toFixed(2)} />
              <SliderRow label="Line alpha" value={p.lineAlpha} min={0.02} max={1} step={0.01} onChange={v => onChange({ lineAlpha: v })} format={v => v.toFixed(2)} />
              <SliderRow label="Line width" value={p.lineWidth} min={0.3} max={4} step={0.1} onChange={v => onChange({ lineWidth: v })} format={v => v.toFixed(1)} />
            </div>
          </div>

          <div>
            <SectionLabel amber>Terrain ↻ rebuilds</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <SliderRow label="Cell size" value={p.cellSize} min={4} max={24} step={1} onChange={v => onChange({ cellSize: v })} format={v => `${v}px`} />
              <SliderRow label="Noise scale" value={p.noiseStep} min={0.008} max={0.1} step={0.001} onChange={v => onChange({ noiseStep: v })} format={v => v.toFixed(3)} />
              <SliderRow label="Levels" value={p.numLevels} min={4} max={50} step={1} onChange={v => onChange({ numLevels: v })} />
              <SliderRow label="Octaves" value={p.noiseOctaves} min={1} max={8} step={1} onChange={v => onChange({ noiseOctaves: v })} />
              <SliderRow label="Falloff" value={p.noiseFalloff} min={0.1} max={0.9} step={0.01} onChange={v => onChange({ noiseFalloff: v })} format={v => v.toFixed(2)} />
            </div>
          </div>

          <div>
            <SectionLabel amber>Smoothing ↻ rebuilds</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <SliderRow label="Blur passes" value={p.blurPasses} min={0} max={6} step={1} onChange={v => onChange({ blurPasses: v })} />
              <SliderRow label="Min chain pts" value={p.minChainPts} min={2} max={20} step={1} onChange={v => onChange({ minChainPts: v })} />
            </div>
          </div>

          <button onClick={onReset}
            style={{ marginTop: 2, padding: "5px 0", fontSize: 10, fontFamily: "monospace", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(57,255,20,0.7)", background: "rgba(57,255,20,0.05)", border: "1px solid rgba(57,255,20,0.2)", borderRadius: 4, cursor: "pointer" }}
            onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.color = "#39FF14"; b.style.borderColor = "rgba(57,255,20,0.5)"; }}
            onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.color = "rgba(57,255,20,0.7)"; b.style.borderColor = "rgba(57,255,20,0.2)"; }}>
            Reset defaults
          </button>
        </div>
      )}
    </div>
  );
}

function SectionLabel({ children, amber = false }: { children: React.ReactNode; amber?: boolean }) {
  return (
    <div style={{ fontSize: 9, color: amber ? "rgba(255,184,0,0.6)" : "rgba(57,255,20,0.45)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8, borderBottom: `1px solid ${amber ? "rgba(255,184,0,0.1)" : "rgba(57,255,20,0.1)"}`, paddingBottom: 4 }}>
      {children}
    </div>
  );
}

