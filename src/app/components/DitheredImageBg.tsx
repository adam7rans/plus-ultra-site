import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { floydSteinbergDither, PALETTE_PLUS_ULTRA, type RGB } from "../lib/dithering";

// ─── Params ───────────────────────────────────────────────────────────────────

interface DitherParams {
  opacity: number;
  panSpeed: number;
  ditherWidth: number;
  contrast: number;
  scaleStart: number;
  scaleEnd: number;
}

const DEFAULTS: DitherParams = {
  opacity: 0.28,
  panSpeed: 20,
  ditherWidth: 1000,
  contrast: 1.0,
  scaleStart: 1.0,
  scaleEnd: 1.18,
};

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

function SectionLabel({ children, amber = false }: { children: React.ReactNode; amber?: boolean }) {
  return (
    <div style={{ fontSize: 9, color: amber ? "rgba(255,184,0,0.6)" : "rgba(57,255,20,0.45)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8, borderBottom: `1px solid ${amber ? "rgba(255,184,0,0.1)" : "rgba(57,255,20,0.1)"}`, paddingBottom: 4 }}>
      {children}
    </div>
  );
}

function ControlPanel({ params, onChange, onReset }: {
  params: DitherParams;
  onChange: (p: Partial<DitherParams>) => void;
  onReset: () => void;
}) {
  const [open, setOpen] = useState(true);
  const p = params;

  return (
    <div style={{ position: "absolute", top: 16, right: 16, width: 240, backgroundColor: "rgba(13,18,16,0.96)", border: "1px solid rgba(57,255,20,0.25)", borderRadius: 8, boxShadow: "0 0 24px rgba(57,255,20,0.08)", fontFamily: "monospace", zIndex: 50, overflow: "hidden", pointerEvents: "auto" }}>
      <div onClick={() => setOpen(o => !o)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", cursor: "pointer", borderBottom: open ? "1px solid rgba(57,255,20,0.15)" : "none", userSelect: "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 9, color: "rgba(57,255,20,0.5)" }}>◈</span>
          <span style={{ fontSize: 10, color: "rgba(57,255,20,0.9)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Forest Controls</span>
        </div>
        <span style={{ fontSize: 10, color: "rgba(57,255,20,0.5)" }}>{open ? "▲" : "▼"}</span>
      </div>

      {open && (
        <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 14, maxHeight: "80vh", overflowY: "auto" }}>

          <div>
            <SectionLabel>Motion</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <SliderRow label="Pan Speed" value={p.panSpeed} min={0} max={100} step={0.5} onChange={v => onChange({ panSpeed: v })} format={v => v.toFixed(1)} />
            </div>
          </div>

          <div>
            <SectionLabel>Visual</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <SliderRow label="Opacity" value={p.opacity} min={0} max={1} step={0.01} onChange={v => onChange({ opacity: v })} format={v => v.toFixed(2)} />
              <SliderRow label="Contrast ↻" value={p.contrast} min={0.1} max={4.0} step={0.05} onChange={v => onChange({ contrast: v })} format={v => v.toFixed(2)} />
              <SliderRow label="Build Quality ↻" value={p.ditherWidth} min={100} max={2000} step={50} onChange={v => onChange({ ditherWidth: v })} format={v => `${v}px`} />
            </div>
          </div>

          <div>
            <SectionLabel amber>Scroll Zoom — top-pinned</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <SliderRow label="Scale Start" value={p.scaleStart} min={0.5} max={2.0} step={0.01} onChange={v => onChange({ scaleStart: v })} format={v => v.toFixed(2)} />
              <SliderRow label="Scale End" value={p.scaleEnd} min={0.5} max={2.0} step={0.01} onChange={v => onChange({ scaleEnd: v })} format={v => v.toFixed(2)} />
            </div>
          </div>

          <button onClick={onReset}
            style={{ marginTop: 2, padding: "5px 0", fontSize: 10, fontFamily: "monospace", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(57,255,20,0.7)", background: "rgba(57,255,20,0.05)", border: "1px solid rgba(57,255,20,0.2)", borderRadius: 4, cursor: "pointer" }}
            onMouseEnter={e => { const b = e.currentTarget; b.style.color = "#39FF14"; b.style.borderColor = "rgba(57,255,20,0.5)"; }}
            onMouseLeave={e => { const b = e.currentTarget; b.style.color = "rgba(57,255,20,0.7)"; b.style.borderColor = "rgba(57,255,20,0.2)"; }}>
            Reset Defaults
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

interface DitheredImageBgProps {
  src: string;
  opacity?: number;
  internalWidth?: number;
  palette?: RGB[];
  showControls?: boolean;
}

export function DitheredImageBg({
  src,
  opacity = DEFAULTS.opacity,
  internalWidth = DEFAULTS.ditherWidth,
  palette = PALETTE_PLUS_ULTRA,
  showControls = false,
}: DitheredImageBgProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [params, setParams] = useState<DitherParams>({
    ...DEFAULTS,
    opacity,
    ditherWidth: internalWidth,
  });

  const updateParam = (partial: Partial<DitherParams>) =>
    setParams(p => ({ ...p, ...partial }));

  // Refs read inside rAF — updated without causing re-renders or rebuilds
  const panSpeedRef = useRef(params.panSpeed);
  useEffect(() => { panSpeedRef.current = params.panSpeed; }, [params.panSpeed]);

  // Full CSS display dimensions — set by build effect, read by rAF
  const displayWRef = useRef(1200);
  const displayHRef = useRef(600);

  // Scroll-driven dither resolution (0 = coarse 100px, 1 = fine 1000px)
  // Written by MotionValue subscriber, read by rAF each frame
  const ditherProgressRef = useRef(0);

  const stateRef = useRef<{
    panorama: HTMLCanvasElement | null;
    tileDisplayW: number; // in full-display-pixel units
    drawH: number;
  }>({ panorama: null, tileDisplayW: 0, drawH: 0 });

  const animRef = useRef<number>(0);
  const offsetRef = useRef<number>(0);
  const lastTimeRef = useRef<number | null>(null);

  // ── Scroll: zoom (existing) ────────────────────────────────────────────────
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [params.scaleStart, params.scaleEnd]);

  // ── Scroll: dither resolution — starts at 25% visible, ends at page bottom ─
  const { scrollYProgress: ditherScrollY } = useScroll({
    target: wrapperRef,
    offset: ["start end", "end end"],
  });
  // clamp so progress 0 until 25% through the scroll range, then 0→1
  const ditherProgress = useTransform(ditherScrollY, [0.25, 1], [0, 1], { clamp: true });

  useEffect(() => {
    // Push MotionValue changes into a plain ref so rAF can read synchronously
    return ditherProgress.on("change", v => { ditherProgressRef.current = v; });
  }, [ditherProgress]);

  // ── Panorama build — reruns on src / build-quality / contrast / palette ────
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const buildPanorama = (displayW: number, displayH: number) => {
      const img = new Image();
      img.onload = () => {
        const imgAspect = img.naturalWidth / img.naturalHeight;
        const containerAspect = displayW / displayH;

        let ditherW: number, ditherH: number;
        if (imgAspect > containerAspect) {
          ditherH = Math.round(params.ditherWidth / containerAspect);
          ditherW = Math.round(ditherH * imgAspect);
        } else {
          ditherW = params.ditherWidth;
          ditherH = Math.round(params.ditherWidth / imgAspect);
        }

        const offscreen = document.createElement("canvas");
        offscreen.width = ditherW;
        offscreen.height = ditherH;
        const octx = offscreen.getContext("2d")!;
        octx.filter = `contrast(${params.contrast})`;
        octx.drawImage(img, 0, 0, ditherW, ditherH);
        octx.filter = "none";
        const imageData = octx.getImageData(0, 0, ditherW, ditherH);
        floydSteinbergDither(imageData, palette);
        octx.putImageData(imageData, 0, 0);

        // [original | flipped] seamless mirror panorama
        const pan = document.createElement("canvas");
        pan.width = ditherW * 2;
        pan.height = ditherH;
        const pctx = pan.getContext("2d")!;
        pctx.drawImage(offscreen, 0, 0);
        pctx.save();
        pctx.translate(ditherW * 2, 0);
        pctx.scale(-1, 1);
        pctx.drawImage(offscreen, 0, 0);
        pctx.restore();

        // tileDisplayW in full-display-pixel units
        const s = Math.max(displayW / ditherW, displayH / ditherH);
        const newTileDisplayW = ditherW * s;

        // Preserve pan position proportionally across rebuilds
        const oldTileW = stateRef.current.tileDisplayW;
        if (oldTileW > 0 && newTileDisplayW > 0) {
          offsetRef.current = (offsetRef.current / oldTileW) * newTileDisplayW;
        }

        stateRef.current = { panorama: pan, tileDisplayW: newTileDisplayW, drawH: ditherH * s };
      };
      img.src = src;
    };

    const init = (resetOffset = false) => {
      const displayW = wrapper.offsetWidth || 1200;
      const displayH = wrapper.offsetHeight || 600;
      // Store full display dimensions for the rAF loop to reference
      displayWRef.current = displayW;
      displayHRef.current = displayH;
      if (resetOffset) offsetRef.current = 0;
      buildPanorama(displayW, displayH);
      // Note: canvas.width/height NOT set here — rAF loop manages that
    };

    init();

    const observer = new ResizeObserver(() => {
      lastTimeRef.current = null;
      init(true);
    });
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, [src, params.ditherWidth, params.contrast, palette]);

  // ── Animation loop — runs once forever, reads only refs ───────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const draw = (time: number) => {
      const { panorama, tileDisplayW, drawH } = stateRef.current;
      const displayW = displayWRef.current;
      const displayH = displayHRef.current;

      if (panorama && tileDisplayW > 0 && displayW > 0) {
        const dt = lastTimeRef.current != null ? (time - lastTimeRef.current) / 1000 : 0;
        lastTimeRef.current = time;

        offsetRef.current = (offsetRef.current + panSpeedRef.current * dt) % tileDisplayW;

        // Scroll-driven buffer resolution: 100px (blocky) → 1000px (fine)
        // canvas CSS is always w-full h-full with imageRendering:pixelated,
        // so a smaller buffer = larger apparent dither pixels
        const progress = ditherProgressRef.current;
        const bufW = Math.round(100 + 900 * progress);
        const bufH = Math.round(bufW * displayH / displayW);

        if (canvas.width !== bufW) canvas.width = bufW;
        if (canvas.height !== bufH) canvas.height = bufH;

        // Scale factor from full-display coords → buffer coords
        const sf = bufW / displayW;

        const ctx = canvas.getContext("2d")!;
        ctx.clearRect(0, 0, bufW, bufH);
        ctx.imageSmoothingEnabled = false;

        const panBufW = tileDisplayW * 2 * sf;
        const drawBufH = drawH * sf;
        let x = -(offsetRef.current * sf);
        while (x < bufW) {
          ctx.drawImage(panorama, x, 0, panBufW, drawBufH);
          x += panBufW;
        }
      } else {
        lastTimeRef.current = time;
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div ref={wrapperRef} className="absolute inset-0 pointer-events-none">
      {/* transformOrigin top-pinned: zoom expands downward, top never clips */}
      <motion.div
        className="absolute inset-0"
        style={{ scale, transformOrigin: "50% 0%" }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ opacity: params.opacity, imageRendering: "pixelated" }}
        />
      </motion.div>

      {showControls && (
        <ControlPanel
          params={params}
          onChange={updateParam}
          onReset={() => setParams({ ...DEFAULTS, opacity, ditherWidth: internalWidth })}
        />
      )}
    </div>
  );
}
