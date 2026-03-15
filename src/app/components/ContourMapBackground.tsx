import { useEffect, useRef, useState } from "react";
import p5 from "p5";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Pt { x: number; y: number }
interface Chain {
  pts: Pt[];
  closed: boolean;
  bx0: number; bx1: number; by0: number; by1: number;
}

export interface ContourParams {
  // Motion
  speed: number;
  speedYRatio: number;
  // Visual
  opacity: number;
  lineAlpha: number;
  lineWidth: number;
  // Terrain (rebuilds on change)
  cellSize: number;
  noiseStep: number;
  numLevels: number;
  noiseOctaves: number;
  noiseFalloff: number;
  // Smoothing (also rebuilds)
  blurPasses: number;   // box-blur passes on heightmap before marching
  minChainPts: number;  // discard chains shorter than this many points
}

// Baked from user's tuned settings
const DEFAULTS: ContourParams = {
  speed: 30,
  speedYRatio: 0.85,
  opacity: 0.63,
  lineAlpha: 0.28,
  lineWidth: 1.0,
  cellSize: 15,
  noiseStep: 0.055,
  numLevels: 23,
  noiseOctaves: 3,
  noiseFalloff: 0.72,
  blurPasses: 2,
  minChainPts: 8,
};

const TILE_W = 4200;
const TILE_H = 2600;

// ─── Heightmap box-blur ───────────────────────────────────────────────────────
// Smoothing the heightmap before marching removes kinks and micro-artifacts
// because it softens abrupt gradient changes in the scalar field.

function blurHeightmap(src: Float32Array, COLS: number, ROWS: number, passes: number): Float32Array {
  let buf = src;
  for (let p = 0; p < passes; p++) {
    const dst = new Float32Array(COLS * ROWS);
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        let sum = 0, n = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
              sum += buf[nr * COLS + nc]; n++;
            }
          }
        }
        dst[r * COLS + c] = sum / n;
      }
    }
    buf = dst;
  }
  return buf;
}

// ─── Marching squares + segment chaining ─────────────────────────────────────

function buildChains(
  hmap: Float32Array,
  COLS: number,
  ROWS: number,
  CELL: number,
  NUM_LEVELS: number,
  minPts: number,
): Chain[] {
  const all: Chain[] = [];
  const hKey = (r: number, c: number) => r * COLS + c;
  const vKey = (r: number, c: number) => ROWS * COLS + r * (COLS + 1) + c;

  for (let li = 0; li < NUM_LEVELS; li++) {
    const thresh = (li + 0.5) / NUM_LEVELS;
    interface Seg { a: number; b: number; ax: number; ay: number; bx: number; by: number; }
    const segs: Seg[] = [];
    const edgeMap = new Map<number, number[]>();
    const addEdge = (key: number, si: number) => {
      let arr = edgeMap.get(key);
      if (!arr) { arr = []; edgeMap.set(key, arr); }
      arr.push(si);
    };
    const addSeg = (aK: number, ax: number, ay: number, bK: number, bx: number, by: number) => {
      const si = segs.length;
      segs.push({ a: aK, b: bK, ax, ay, bx, by });
      addEdge(aK, si); addEdge(bK, si);
    };
    for (let r = 0; r < ROWS - 1; r++) {
      for (let c = 0; c < COLS - 1; c++) {
        const vA = hmap[r * COLS + c], vB = hmap[r * COLS + c + 1];
        const vC = hmap[(r + 1) * COLS + c + 1], vD = hmap[(r + 1) * COLS + c];
        const idx = (vA >= thresh ? 1 : 0) | (vB >= thresh ? 2 : 0) | (vC >= thresh ? 4 : 0) | (vD >= thresh ? 8 : 0);
        if (idx === 0 || idx === 15) continue;
        const x0 = c * CELL, y0 = r * CELL, x1 = x0 + CELL, y1 = y0 + CELL;
        const ip = (va: number, vb: number) => { const d = vb - va; return Math.abs(d) < 1e-9 ? 0.5 : Math.max(0, Math.min(1, (thresh - va) / d)); };
        const tK = hKey(r, c),       tx = x0 + ip(vA, vB) * CELL, ty = y0;
        const bK = hKey(r + 1, c),   bx = x1 - ip(vC, vD) * CELL, by = y1;
        const lK = vKey(r, c),       lx = x0, ly = y1 - ip(vD, vA) * CELL;
        const rK = vKey(r, c + 1),   rx = x1, ry = y0 + ip(vB, vC) * CELL;
        const centre = (vA + vB + vC + vD) * 0.25;
        switch (idx) {
          case  1: addSeg(lK,lx,ly, tK,tx,ty); break;
          case  2: addSeg(tK,tx,ty, rK,rx,ry); break;
          case  3: addSeg(lK,lx,ly, rK,rx,ry); break;
          case  4: addSeg(rK,rx,ry, bK,bx,by); break;
          case  5: if (centre >= thresh) { addSeg(lK,lx,ly,bK,bx,by); addSeg(tK,tx,ty,rK,rx,ry); } else { addSeg(lK,lx,ly,tK,tx,ty); addSeg(rK,rx,ry,bK,bx,by); } break;
          case  6: addSeg(tK,tx,ty, bK,bx,by); break;
          case  7: addSeg(lK,lx,ly, bK,bx,by); break;
          case  8: addSeg(bK,bx,by, lK,lx,ly); break;
          case  9: addSeg(tK,tx,ty, bK,bx,by); break;
          case 10: if (centre >= thresh) { addSeg(tK,tx,ty,lK,lx,ly); addSeg(bK,bx,by,rK,rx,ry); } else { addSeg(tK,tx,ty,rK,rx,ry); addSeg(bK,bx,by,lK,lx,ly); } break;
          case 11: addSeg(rK,rx,ry, bK,bx,by); break;
          case 12: addSeg(lK,lx,ly, rK,rx,ry); break;
          case 13: addSeg(tK,tx,ty, rK,rx,ry); break;
          case 14: addSeg(lK,lx,ly, tK,tx,ty); break;
        }
      }
    }
    const used = new Uint8Array(segs.length);
    const nextUnused = (edgeKey: number) => { const arr = edgeMap.get(edgeKey); if (!arr) return -1; for (const si of arr) if (!used[si]) return si; return -1; };
    for (let s0 = 0; s0 < segs.length; s0++) {
      if (used[s0]) continue;
      used[s0] = 1;
      const seg0 = segs[s0];
      const fwd: Pt[] = [{ x: seg0.bx, y: seg0.by }];
      const bwd: Pt[] = [{ x: seg0.ax, y: seg0.ay }];
      let curEdge = seg0.b;
      for (;;) { const si = nextUnused(curEdge); if (si === -1) break; used[si] = 1; const seg = segs[si]; if (seg.a === curEdge) { fwd.push({ x: seg.bx, y: seg.by }); curEdge = seg.b; } else { fwd.push({ x: seg.ax, y: seg.ay }); curEdge = seg.a; } }
      curEdge = seg0.a;
      for (;;) { const si = nextUnused(curEdge); if (si === -1) break; used[si] = 1; const seg = segs[si]; if (seg.b === curEdge) { bwd.push({ x: seg.ax, y: seg.ay }); curEdge = seg.a; } else { bwd.push({ x: seg.bx, y: seg.by }); curEdge = seg.b; } }
      bwd.reverse();
      const pts = [...bwd, ...fwd];

      // Drop short chains — these are the micro-blobs and pointed stubs
      if (pts.length < minPts) continue;

      const n = pts.length;
      const dx = pts[0].x - pts[n - 1].x, dy = pts[0].y - pts[n - 1].y;
      const closed = dx * dx + dy * dy < CELL * CELL * 0.25;
      let bx0 = pts[0].x, bx1 = pts[0].x, by0 = pts[0].y, by1 = pts[0].y;
      for (let i = 1; i < n; i++) { if (pts[i].x < bx0) bx0 = pts[i].x; if (pts[i].x > bx1) bx1 = pts[i].x; if (pts[i].y < by0) by0 = pts[i].y; if (pts[i].y > by1) by1 = pts[i].y; }
      all.push({ pts, closed, bx0, bx1, by0, by1 });
    }
  }
  return all;
}

// ─── Control Panel ────────────────────────────────────────────────────────────

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

function ControlPanel({ params, onChange, onReset, isRebuilding }: {
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

// ─── Component ────────────────────────────────────────────────────────────────

interface ContourMapBackgroundProps {
  className?: string;
  style?: React.CSSProperties;
  opacity?: number;
  showControls?: boolean;
}

export function ContourMapBackground({
  className = "",
  style = {},
  opacity = 1,
  showControls = false,
}: ContourMapBackgroundProps) {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [params, setParams] = useState<ContourParams>({ ...DEFAULTS, opacity });
  const paramsRef = useRef(params);
  paramsRef.current = params;

  const lastTerrainRef = useRef({
    cellSize: params.cellSize, noiseStep: params.noiseStep, numLevels: params.numLevels,
    noiseOctaves: params.noiseOctaves, noiseFalloff: params.noiseFalloff,
    blurPasses: params.blurPasses, minChainPts: params.minChainPts,
  });
  const [isRebuilding, setIsRebuilding] = useState(false);

  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let p5inst: any;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sketch = (p: any) => {
      let chains: Chain[] = [];
      let COLS = 0, ROWS = 0, CELL = 0;
      let startMs = 0, cW = 0, cH = 0;
      let lastRebuildMs = -Infinity;

      const buildTerrain = () => {
        const cp = paramsRef.current;
        CELL = cp.cellSize;
        COLS = Math.ceil(TILE_W / CELL) + 2;
        ROWS = Math.ceil(TILE_H / CELL) + 2;
        p.noiseDetail(cp.noiseOctaves, cp.noiseFalloff);
        let hmap = new Float32Array(COLS * ROWS);
        for (let r = 0; r < ROWS; r++)
          for (let c = 0; c < COLS; c++)
            hmap[r * COLS + c] = p.noise(c * cp.noiseStep, r * cp.noiseStep);
        // Smooth the scalar field — eliminates kinks and micro-artifacts
        hmap = blurHeightmap(hmap, COLS, ROWS, cp.blurPasses);
        chains = buildChains(hmap, COLS, ROWS, CELL, cp.numLevels, cp.minChainPts);
        lastTerrainRef.current = {
          cellSize: cp.cellSize, noiseStep: cp.noiseStep, numLevels: cp.numLevels,
          noiseOctaves: cp.noiseOctaves, noiseFalloff: cp.noiseFalloff,
          blurPasses: cp.blurPasses, minChainPts: cp.minChainPts,
        };
      };

      p.setup = () => {
        cW = container.offsetWidth || window.innerWidth;
        cH = container.offsetHeight || window.innerHeight;
        const cnv = p.createCanvas(cW, cH);
        cnv.elt.style.cssText = "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;display:block;";
        p.noiseSeed(27182);
        buildTerrain();
        startMs = p.millis();
      };

      p.draw = () => {
        const cp = paramsRef.current;
        const lt = lastTerrainRef.current;
        const now = p.millis();

        if (now - lastRebuildMs > 150 && (
          cp.cellSize !== lt.cellSize || cp.noiseStep !== lt.noiseStep ||
          cp.numLevels !== lt.numLevels || cp.noiseOctaves !== lt.noiseOctaves ||
          cp.noiseFalloff !== lt.noiseFalloff || cp.blurPasses !== lt.blurPasses ||
          cp.minChainPts !== lt.minChainPts
        )) {
          lastRebuildMs = now;
          setIsRebuilding(true);
          setTimeout(() => setIsRebuilding(false), 200);
          buildTerrain();
        }

        const elapsed = (now - startMs) / 1000;
        const panX = (elapsed * cp.speed) % TILE_W;
        const panY = (elapsed * cp.speed * cp.speedYRatio) % TILE_H;

        const ctx = p.drawingContext as CanvasRenderingContext2D;
        ctx.clearRect(0, 0, cW, cH);
        ctx.strokeStyle = `rgba(57,255,20,${cp.lineAlpha})`;
        ctx.lineWidth = cp.lineWidth;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        const tilesX = Math.ceil((panX + cW) / TILE_W);
        const tilesY = Math.ceil((panY + cH) / TILE_H);

        for (let tx = 0; tx < tilesX; tx++) {
          for (let ty = 0; ty < tilesY; ty++) {
            const offX = tx * TILE_W - panX;
            const offY = ty * TILE_H - panY;
            const vx0 = -offX - CELL * 4, vx1 = cW - offX + CELL * 4;
            const vy0 = -offY - CELL * 4, vy1 = cH - offY + CELL * 4;
            ctx.save();
            ctx.translate(offX, offY);
            for (const ch of chains) {
              if (ch.bx1 < vx0 || ch.bx0 > vx1 || ch.by1 < vy0 || ch.by0 > vy1) continue;
              const pts = ch.pts;
              const n = pts.length;
              if (n < 2) continue;
              ctx.beginPath();
              const getP = (i: number): Pt => ch.closed ? pts[((i % n) + n) % n] : pts[Math.max(0, Math.min(n - 1, i))];
              ctx.moveTo(pts[0].x, pts[0].y);
              const count = ch.closed ? n : n - 1;
              for (let i = 0; i < count; i++) {
                const p0 = getP(i - 1), p1 = getP(i), p2 = getP(i + 1), p3 = getP(i + 2);
                ctx.bezierCurveTo(
                  p1.x + (p2.x - p0.x) / 6, p1.y + (p2.y - p0.y) / 6,
                  p2.x - (p3.x - p1.x) / 6, p2.y - (p3.y - p1.y) / 6,
                  p2.x, p2.y,
                );
              }
              if (ch.closed) ctx.closePath();
              ctx.stroke();
            }
            ctx.restore();
          }
        }
      };

      p.windowResized = () => {
        cW = container.offsetWidth || window.innerWidth;
        cH = container.offsetHeight || window.innerHeight;
        p.resizeCanvas(cW, cH);
      };
    };

    p5inst = new p5(sketch, container);
    return () => { p5inst.remove(); };
  }, []);

  return (
    <div className={className} style={{ position: "absolute", inset: 0, pointerEvents: "none", ...style }}>
      <div ref={canvasContainerRef} style={{ position: "absolute", inset: 0, opacity: params.opacity }} />
      {showControls && (
        <div style={{ pointerEvents: "auto" }}>
          <ControlPanel
            params={params}
            onChange={patch => setParams(prev => ({ ...prev, ...patch }))}
            onReset={() => setParams({ ...DEFAULTS, opacity })}
            isRebuilding={isRebuilding}
          />
        </div>
      )}
    </div>
  );
}
