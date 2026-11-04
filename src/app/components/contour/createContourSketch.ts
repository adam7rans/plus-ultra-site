import type { ContourParams, Chain, Pt } from "./settings";
import { TILE_W, TILE_H } from "./settings";
import { blurHeightmap, buildChains } from "./terrain";
import { createPeopleLayer } from "./people";
import { CONTOUR_PALETTES, type ContourTheme } from "./palette";

interface SketchOptions {
  container: HTMLDivElement;
  paramsRef: { current: ContourParams };
  onRebuildChange: (rebuilding: boolean) => void;
  showPeople: boolean;
  theme: ContourTheme;
}

export function createContourSketch({ container, paramsRef, onRebuildChange, showPeople, theme }: SketchOptions) {
  let onPointerMove: ((e: PointerEvent) => void) | null = null;
  let onPointerLeave: (() => void) | null = null;
  let rebuildTimer: ReturnType<typeof setTimeout> | undefined;
  const lastTerrainRef = { current: { ...paramsRef.current } };
  const palette = CONTOUR_PALETTES[theme];
  const peopleLayer = createPeopleLayer(palette.people);
  const sketch = (p: any) => {
    let chains: Chain[] = [];
    let COLS = 0, ROWS = 0, CELL = 0;
    let startMs = 0, cW = 0, cH = 0;
    let lastRebuildMs = -Infinity;
    let lastPanRebuildMs = -Infinity;
    let tileOffsetX = 0, tileOffsetY = 0;
    let offscreen: HTMLCanvasElement;
    let octx: CanvasRenderingContext2D;
    let targetX = -9999, targetY = -9999;
    let spotX = -9999, spotY = -9999;
    let spotOpacity = 0, targetOpacity = 0;
    const SPOT_RADIUS = 350;
    const LERP_POS = 0.08, LERP_FADE = 0.05;

    const buildTerrain = () => {
      const cp = paramsRef.current;
      CELL = cp.cellSize;
      COLS = Math.ceil(TILE_W / CELL) + 2;
      ROWS = Math.ceil(TILE_H / CELL) + 2;
      p.noiseDetail(cp.noiseOctaves, cp.noiseFalloff);
      // Sample noise at absolute world coordinates so the terrain is
      // consistent across pan positions and never needs to tile.
      const noiseOffX = (tileOffsetX / CELL) * cp.noiseStep;
      const noiseOffY = (tileOffsetY / CELL) * cp.noiseStep;
      let hmap = new Float32Array(COLS * ROWS);
      for (let r = 0; r < ROWS; r++)
        for (let c = 0; c < COLS; c++)
          hmap[r * COLS + c] = p.noise(noiseOffX + c * cp.noiseStep, noiseOffY + r * cp.noiseStep);
      // Smooth the scalar field — eliminates kinks and micro-artifacts
      hmap = blurHeightmap(hmap, COLS, ROWS, cp.blurPasses);
      chains = buildChains(hmap, COLS, ROWS, CELL, cp.numLevels, cp.minChainPts);
      lastTerrainRef.current = { ...cp };
    };

    p.setup = () => {
      cW = container.offsetWidth || window.innerWidth;
      cH = container.offsetHeight || window.innerHeight;
      const cnv = p.createCanvas(cW, cH);
      cnv.elt.style.cssText = "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;display:block;";
      p.noiseSeed(27182);
      buildTerrain();
      startMs = p.millis();
      offscreen = document.createElement('canvas');
      offscreen.width = cW;
      offscreen.height = cH;
      octx = offscreen.getContext('2d')!;
      onPointerMove = (e: PointerEvent) => {
        if (e.pointerType === "touch") return;
        const rect = container.getBoundingClientRect();
        targetX = e.clientX - rect.left;
        targetY = e.clientY - rect.top;
        targetOpacity = (targetX >= 0 && targetX <= rect.width && targetY >= 0 && targetY <= rect.height) ? 1 : 0;
      };
      onPointerLeave = () => { targetOpacity = 0; };
      document.addEventListener('pointermove', onPointerMove);
      document.documentElement.addEventListener('pointerleave', onPointerLeave);
      window.addEventListener('blur', onPointerLeave);
      document.addEventListener('visibilitychange', onPointerLeave);
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
        onRebuildChange(true);
        clearTimeout(rebuildTimer);
        rebuildTimer = setTimeout(() => onRebuildChange(false), 200);
        buildTerrain();
      }

      const elapsed = (now - startMs) / 1000;
      // Absolute (non-wrapping) pan — terrain rebuilds automatically as we scroll
      const panX = elapsed * cp.speed;
      const panY = elapsed * cp.speed * cp.speedYRatio;

      // Rebuild terrain when the viewport scrolls past 50% of the pre-computed
      // tile. New tile is centred 25% behind current pan so we have ~TILE_W/2
      // of lookahead before the next rebuild.
      if (now - lastPanRebuildMs > 500) {
        const sx = panX - tileOffsetX, sy = panY - tileOffsetY;
        if (sx > TILE_W * 0.5 || sy > TILE_H * 0.5) {
          tileOffsetX = panX - TILE_W * 0.25;
          tileOffsetY = panY - TILE_H * 0.25;
          lastPanRebuildMs = now;
          buildTerrain();
        }
      }

      const scrolledX = panX - tileOffsetX;
      const scrolledY = panY - tileOffsetY;

      // Per-frame lerp for spotlight position and opacity
      spotX = spotX + (targetX - spotX) * LERP_POS;
      spotY = spotY + (targetY - spotY) * LERP_POS;
      spotOpacity = spotOpacity + (targetOpacity - spotOpacity) * LERP_FADE;

      // Draw all viewport-culled chains with a single translation (no tiling)
      const drawChains = (context: CanvasRenderingContext2D) => {
        const vx0 = scrolledX - CELL * 4, vx1 = scrolledX + cW + CELL * 4;
        const vy0 = scrolledY - CELL * 4, vy1 = scrolledY + cH + CELL * 4;
        context.save();
        context.translate(-scrolledX, -scrolledY);
        for (const ch of chains) {
          if (ch.bx1 < vx0 || ch.bx0 > vx1 || ch.by1 < vy0 || ch.by0 > vy1) continue;
          const pts = ch.pts;
          const n = pts.length;
          if (n < 2) continue;
          context.beginPath();
          const getP = (i: number): Pt => ch.closed ? pts[((i % n) + n) % n] : pts[Math.max(0, Math.min(n - 1, i))];
          context.moveTo(pts[0].x, pts[0].y);
          const count = ch.closed ? n : n - 1;
          for (let i = 0; i < count; i++) {
            const p0 = getP(i - 1), p1 = getP(i), p2 = getP(i + 1), p3 = getP(i + 2);
            context.bezierCurveTo(
              p1.x + (p2.x - p0.x) / 6, p1.y + (p2.y - p0.y) / 6,
              p2.x - (p3.x - p1.x) / 6, p2.y - (p3.y - p1.y) / 6,
              p2.x, p2.y,
            );
          }
          if (ch.closed) context.closePath();
          context.stroke();
        }
        context.restore();
      };

      const ctx = p.drawingContext as CanvasRenderingContext2D;
      ctx.clearRect(0, 0, cW, cH);
      ctx.lineWidth = cp.lineWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Pass 1 — ambient layer (dimmed to make spotlight contrast pop)
      ctx.strokeStyle = `rgba(${palette.contour},${cp.lineAlpha * 0.65})`;
      drawChains(ctx);

      // Pass 2 — spotlight overlay
      if (spotOpacity > 0.01) {
        octx.clearRect(0, 0, cW, cH);
        octx.strokeStyle = palette.spotlight;
        octx.lineWidth = cp.lineWidth;
        octx.lineCap = "round";
        octx.lineJoin = "round";
        octx.globalCompositeOperation = "source-over";
        drawChains(octx);

        if (showPeople) {
          peopleLayer.draw(octx, { x: panX, y: panY, width: cW, height: cH }, {
            x: spotX, y: spotY, radius: SPOT_RADIUS,
          }, elapsed);
        }

        // Mask bright lines to the spotlight circle via radial gradient
        octx.globalCompositeOperation = "destination-in";
        const grad = octx.createRadialGradient(spotX, spotY, 0, spotX, spotY, SPOT_RADIUS);
        grad.addColorStop(0, `rgba(0,0,0,${spotOpacity})`);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        octx.fillStyle = grad;
        octx.fillRect(0, 0, cW, cH);
        octx.globalCompositeOperation = "source-over";

        ctx.drawImage(offscreen, 0, 0);
      }
    };

    p.windowResized = () => {
      cW = container.offsetWidth || window.innerWidth;
      cH = container.offsetHeight || window.innerHeight;
      p.resizeCanvas(cW, cH);
      offscreen.width = cW;
      offscreen.height = cH;
    };
  };

  return {
    sketch,
    dispose() {
      clearTimeout(rebuildTimer);
      if (onPointerMove) document.removeEventListener('pointermove', onPointerMove);
      if (onPointerLeave) {
        document.documentElement.removeEventListener('pointerleave', onPointerLeave);
        window.removeEventListener('blur', onPointerLeave);
        document.removeEventListener('visibilitychange', onPointerLeave);
      }
    },
  };
}
