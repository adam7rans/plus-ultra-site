import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { floydSteinbergDither, PALETTE_PLUS_ULTRA, type RGB } from "../lib/dithering";

interface DitheredImageBgProps {
  src: string;
  opacity?: number;
  /** Width at which dithering is computed — higher = finer/smaller pixels */
  internalWidth?: number;
  palette?: RGB[];
}

export function DitheredImageBg({
  src,
  opacity = 0.3,
  internalWidth = 900,
  palette = PALETTE_PLUS_ULTRA,
}: DitheredImageBgProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Scroll-driven zoom: section enters from bottom (0) → leaves top (1)
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1.0, 1.18]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const render = () => {
      const displayW = wrapper.offsetWidth || 1200;
      const displayH = wrapper.offsetHeight || 600;

      const img = new Image();
      img.onload = () => {
        const imgAspect = img.naturalWidth / img.naturalHeight;
        const containerAspect = displayW / displayH;

        // Cover the container at dither resolution
        let ditherW: number, ditherH: number;
        if (imgAspect > containerAspect) {
          ditherH = Math.round(internalWidth / containerAspect);
          ditherW = Math.round(ditherH * imgAspect);
        } else {
          ditherW = internalWidth;
          ditherH = Math.round(internalWidth / imgAspect);
        }

        const offscreen = document.createElement("canvas");
        offscreen.width = ditherW;
        offscreen.height = ditherH;
        const octx = offscreen.getContext("2d")!;
        octx.drawImage(img, 0, 0, ditherW, ditherH);
        const imageData = octx.getImageData(0, 0, ditherW, ditherH);
        floydSteinbergDither(imageData, palette);
        octx.putImageData(imageData, 0, 0);

        canvas.width = displayW;
        canvas.height = displayH;
        const ctx = canvas.getContext("2d")!;
        ctx.imageSmoothingEnabled = false;

        const s = Math.max(displayW / ditherW, displayH / ditherH);
        const drawW = ditherW * s;
        const drawH = ditherH * s;
        ctx.drawImage(offscreen, (displayW - drawW) / 2, (displayH - drawH) / 2, drawW, drawH);
      };
      img.src = src;
    };

    render();

    const observer = new ResizeObserver(render);
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, [src, internalWidth, palette]);

  return (
    <div ref={wrapperRef} className="absolute inset-0 pointer-events-none">
      <motion.div
        className="absolute inset-0"
        style={{ scale, transformOrigin: "center center" }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ opacity, imageRendering: "pixelated" }}
        />
      </motion.div>
    </div>
  );
}
