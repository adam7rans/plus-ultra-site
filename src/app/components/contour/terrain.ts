import type { Pt, Chain } from "./settings";

// ─── Heightmap box-blur ───────────────────────────────────────────────────────
// Smoothing the heightmap before marching removes kinks and micro-artifacts
// because it softens abrupt gradient changes in the scalar field.

export function blurHeightmap(src: Float32Array, COLS: number, ROWS: number, passes: number): Float32Array {
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

export function buildChains(
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

