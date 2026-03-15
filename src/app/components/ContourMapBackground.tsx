import { useEffect, useRef } from "react";
import p5 from "p5";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Pt { x: number; y: number }
interface Chain {
  pts: Pt[];
  closed: boolean;
  bx0: number; bx1: number; by0: number; by1: number;
}

// ─── Marching squares + segment chaining ────────────────────────────────────
//
// Edge keys use integer IDs to avoid float-string hashing:
//   Horizontal edges (shared between cell-row r and r-1, at grid-row r):
//     hKey(r, c) = r * COLS + c
//   Vertical edges (shared between cell-col c and c-1, at grid-col c):
//     vKey(r, c) = ROWS * COLS + r * (COLS + 1) + c
//
// At each contour level, every edge is crossed by at most 2 segments
// (one per neighbouring cell). We store all of them in an array so the
// chaining walker can always pick the unused one.

function buildChains(
  hmap: Float32Array,
  COLS: number,
  ROWS: number,
  CELL: number,
  NUM_LEVELS: number,
): Chain[] {
  const all: Chain[] = [];

  const hKey = (r: number, c: number) => r * COLS + c;
  const vKey = (r: number, c: number) => ROWS * COLS + r * (COLS + 1) + c;

  for (let li = 0; li < NUM_LEVELS; li++) {
    // Spread thresholds evenly across [0,1], avoiding 0 and 1
    const thresh = (li + 0.5) / NUM_LEVELS;

    interface Seg {
      a: number; b: number;
      ax: number; ay: number;
      bx: number; by: number;
    }
    const segs: Seg[] = [];
    const edgeMap = new Map<number, number[]>();

    const addEdge = (key: number, si: number) => {
      let arr = edgeMap.get(key);
      if (!arr) { arr = []; edgeMap.set(key, arr); }
      arr.push(si);
    };

    const addSeg = (
      aK: number, ax: number, ay: number,
      bK: number, bx: number, by: number,
    ) => {
      const si = segs.length;
      segs.push({ a: aK, b: bK, ax, ay, bx, by });
      addEdge(aK, si);
      addEdge(bK, si);
    };

    for (let r = 0; r < ROWS - 1; r++) {
      for (let c = 0; c < COLS - 1; c++) {
        // Vertices: A=top-left, B=top-right, C=bottom-right, D=bottom-left
        const vA = hmap[r * COLS + c];
        const vB = hmap[r * COLS + c + 1];
        const vC = hmap[(r + 1) * COLS + c + 1];
        const vD = hmap[(r + 1) * COLS + c];

        const idx =
          (vA >= thresh ? 1 : 0) |
          (vB >= thresh ? 2 : 0) |
          (vC >= thresh ? 4 : 0) |
          (vD >= thresh ? 8 : 0);

        if (idx === 0 || idx === 15) continue;

        const x0 = c * CELL, y0 = r * CELL;
        const x1 = x0 + CELL, y1 = y0 + CELL;

        // Linear interpolation along an edge
        const ip = (va: number, vb: number) => {
          const d = vb - va;
          return Math.abs(d) < 1e-9 ? 0.5 : Math.max(0, Math.min(1, (thresh - va) / d));
        };

        // Canonical edge keys + interpolated pixel coordinates
        const tK = hKey(r,     c),     tx = x0 + ip(vA, vB) * CELL, ty = y0;
        const bK = hKey(r + 1, c),     bx = x1 - ip(vC, vD) * CELL, by = y1;
        const lK = vKey(r,     c),     lx = x0, ly = y1 - ip(vD, vA) * CELL;
        const rK = vKey(r,     c + 1), rx = x1, ry = y0 + ip(vB, vC) * CELL;

        // Saddle point disambiguation: connect toward higher centre value
        const centre = (vA + vB + vC + vD) * 0.25;
        switch (idx) {
          case  1: addSeg(lK,lx,ly, tK,tx,ty); break;
          case  2: addSeg(tK,tx,ty, rK,rx,ry); break;
          case  3: addSeg(lK,lx,ly, rK,rx,ry); break;
          case  4: addSeg(rK,rx,ry, bK,bx,by); break;
          case  5:
            if (centre >= thresh) {
              addSeg(lK,lx,ly, bK,bx,by);
              addSeg(tK,tx,ty, rK,rx,ry);
            } else {
              addSeg(lK,lx,ly, tK,tx,ty);
              addSeg(rK,rx,ry, bK,bx,by);
            }
            break;
          case  6: addSeg(tK,tx,ty, bK,bx,by); break;
          case  7: addSeg(lK,lx,ly, bK,bx,by); break;
          case  8: addSeg(bK,bx,by, lK,lx,ly); break;
          case  9: addSeg(tK,tx,ty, bK,bx,by); break;
          case 10:
            if (centre >= thresh) {
              addSeg(tK,tx,ty, lK,lx,ly);
              addSeg(bK,bx,by, rK,rx,ry);
            } else {
              addSeg(tK,tx,ty, rK,rx,ry);
              addSeg(bK,bx,by, lK,lx,ly);
            }
            break;
          case 11: addSeg(rK,rx,ry, bK,bx,by); break;
          case 12: addSeg(lK,lx,ly, rK,rx,ry); break;
          case 13: addSeg(tK,tx,ty, rK,rx,ry); break;
          case 14: addSeg(lK,lx,ly, tK,tx,ty); break;
        }
      }
    }

    // ── Chain segments into continuous polylines ──────────────────────────
    const used = new Uint8Array(segs.length);

    const nextUnused = (edgeKey: number): number => {
      const arr = edgeMap.get(edgeKey);
      if (!arr) return -1;
      for (const si of arr) if (!used[si]) return si;
      return -1;
    };

    for (let s0 = 0; s0 < segs.length; s0++) {
      if (used[s0]) continue;
      used[s0] = 1;

      const seg0 = segs[s0];
      // Build forward and backward halves separately (avoid O(n²) unshift)
      const fwd: Pt[] = [{ x: seg0.bx, y: seg0.by }];
      const bwd: Pt[] = [{ x: seg0.ax, y: seg0.ay }];

      // Walk forward from endpoint b
      let curEdge = seg0.b;
      for (;;) {
        const si = nextUnused(curEdge);
        if (si === -1) break;
        used[si] = 1;
        const seg = segs[si];
        if (seg.a === curEdge) {
          fwd.push({ x: seg.bx, y: seg.by });
          curEdge = seg.b;
        } else {
          fwd.push({ x: seg.ax, y: seg.ay });
          curEdge = seg.a;
        }
      }

      // Walk backward from endpoint a
      curEdge = seg0.a;
      for (;;) {
        const si = nextUnused(curEdge);
        if (si === -1) break;
        used[si] = 1;
        const seg = segs[si];
        if (seg.b === curEdge) {
          bwd.push({ x: seg.ax, y: seg.ay });
          curEdge = seg.a;
        } else {
          bwd.push({ x: seg.bx, y: seg.by });
          curEdge = seg.b;
        }
      }

      // Concatenate: bwd is in reverse order (built toward "left"), reverse it
      bwd.reverse();
      const pts = [...bwd, ...fwd];
      if (pts.length < 2) continue;

      // Detect closed loops
      const n = pts.length;
      const dx = pts[0].x - pts[n - 1].x;
      const dy = pts[0].y - pts[n - 1].y;
      const closed = dx * dx + dy * dy < CELL * CELL * 0.25;

      // Bounding box for viewport culling
      let bx0 = pts[0].x, bx1 = pts[0].x, by0 = pts[0].y, by1 = pts[0].y;
      for (let i = 1; i < n; i++) {
        if (pts[i].x < bx0) bx0 = pts[i].x;
        if (pts[i].x > bx1) bx1 = pts[i].x;
        if (pts[i].y < by0) by0 = pts[i].y;
        if (pts[i].y > by1) by1 = pts[i].y;
      }

      all.push({ pts, closed, bx0, bx1, by0, by1 });
    }
  }

  return all;
}

// ─── Component ───────────────────────────────────────────────────────────────

interface ContourMapBackgroundProps {
  className?: string;
  style?: React.CSSProperties;
  /** Overall opacity of the canvas element */
  opacity?: number;
  /** Neon-green RGBA for contour lines */
  lineColor?: string;
  /** Pan speed in pixels per second */
  speed?: number;
}

export function ContourMapBackground({
  className = "",
  style = {},
  opacity = 1,
  lineColor = "rgba(57, 255, 20, 0.38)",
  speed = 2.2,
}: ContourMapBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let p5inst: any;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sketch = (p: any) => {
      // ── Terrain parameters ────────────────────────────────────────────
      const CELL = 10;           // px per marching-squares cell
      const NOISE_STEP = 0.038;  // noise units per cell → ~263 px feature size
      const NUM_LEVELS = 22;     // iso-contour levels (evenly distributed)

      // Static terrain tile — large enough for many minutes of panning
      // at `speed` px/sec without cycling back. Both axes get margin.
      const TILE_W = 4200;
      const TILE_H = 2600;
      const COLS = Math.ceil(TILE_W / CELL) + 2;  // +2: one extra col each side
      const ROWS = Math.ceil(TILE_H / CELL) + 2;

      let chains: Chain[] = [];
      let startMs = 0;
      let cW = 0;
      let cH = 0;

      p.setup = () => {
        cW = container.offsetWidth  || window.innerWidth;
        cH = container.offsetHeight || window.innerHeight;

        const cnv = p.createCanvas(cW, cH);
        cnv.elt.style.cssText =
          "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;display:block;";

        // p5 Perlin noise — analytic C¹ continuity means smooth gradients
        // and aligned MS segments → smooth Catmull-Rom curves.
        p.noiseDetail(4, 0.48);
        p.noiseSeed(27182);

        // ── Build static heightmap (computed once, never mutated) ─────
        const hmap = new Float32Array(COLS * ROWS);
        for (let r = 0; r < ROWS; r++)
          for (let c = 0; c < COLS; c++)
            hmap[r * COLS + c] = p.noise(c * NOISE_STEP, r * NOISE_STEP);

        // ── Build all contour chains (static geometry) ────────────────
        chains = buildChains(hmap, COLS, ROWS, CELL, NUM_LEVELS);

        startMs = p.millis();
      };

      p.draw = () => {
        p.clear();

        const elapsed = (p.millis() - startMs) / 1000;
        // Drift diagonally: rightward + slight downward (top-right → bottom-left feel)
        const panX = (elapsed * speed) % TILE_W;
        const panY = (elapsed * speed * 0.45) % TILE_H;

        // Use the raw Canvas 2D context — p5 v2 removed curveVertex,
        // so we draw Catmull-Rom splines ourselves via bezierCurveTo.
        const ctx = p.drawingContext as CanvasRenderingContext2D;
        ctx.clearRect(0, 0, cW, cH);

        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 1;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        // Tile the terrain in X and Y so the viewport is always fully covered
        // regardless of panX/panY position.  At most 2×2 = 4 passes.
        const tilesX = Math.ceil((panX + cW) / TILE_W); // 1 or 2
        const tilesY = Math.ceil((panY + cH) / TILE_H); // 1 or 2

        for (let tx = 0; tx < tilesX; tx++) {
          for (let ty = 0; ty < tilesY; ty++) {
            const offX = tx * TILE_W - panX;
            const offY = ty * TILE_H - panY;

            // Culling bounds expressed in chain-local coordinates
            const vx0 = -offX - CELL * 4;
            const vx1 = cW - offX + CELL * 4;
            const vy0 = -offY - CELL * 4;
            const vy1 = cH - offY + CELL * 4;

            ctx.save();
            ctx.translate(offX, offY);

            for (const ch of chains) {
              if (ch.bx1 < vx0 || ch.bx0 > vx1 || ch.by1 < vy0 || ch.by0 > vy1) continue;

              const pts = ch.pts;
              const n = pts.length;
              if (n < 2) continue;

              ctx.beginPath();

              const getP = (i: number): Pt => {
                if (ch.closed) return pts[((i % n) + n) % n];
                return pts[Math.max(0, Math.min(n - 1, i))];
              };

              ctx.moveTo(pts[0].x, pts[0].y);
              const count = ch.closed ? n : n - 1;
              for (let i = 0; i < count; i++) {
                const p0 = getP(i - 1);
                const p1 = getP(i);
                const p2 = getP(i + 1);
                const p3 = getP(i + 2);
                const cp1x = p1.x + (p2.x - p0.x) / 6;
                const cp1y = p1.y + (p2.y - p0.y) / 6;
                const cp2x = p2.x - (p3.x - p1.x) / 6;
                const cp2y = p2.y - (p3.y - p1.y) / 6;
                ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
              }

              if (ch.closed) ctx.closePath();
              ctx.stroke();
            }

            ctx.restore();
          }
        }
      };

      p.windowResized = () => {
        cW = container.offsetWidth  || window.innerWidth;
        cH = container.offsetHeight || window.innerHeight;
        p.resizeCanvas(cW, cH);
      };
    };

    p5inst = new p5(sketch, container);
    return () => { p5inst.remove(); };
  }, [lineColor, speed]); // terrain is static; only re-init if color/speed change

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        opacity,
        ...style,
      }}
    />
  );
}