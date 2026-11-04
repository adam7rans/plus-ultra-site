import { useEffect, useRef, useState } from "react";
import p5 from "p5";
import { DEFAULTS, type ContourParams } from "./contour/settings";
import { ContourControls } from "./contour/ContourControls";
import { createContourSketch } from "./contour/createContourSketch";

export type { ContourParams } from "./contour/settings";

interface ContourMapBackgroundProps {
  className?: string;
  style?: React.CSSProperties;
  opacity?: number;
  showControls?: boolean;
  showPeople?: boolean;
}

export function ContourMapBackground({
  className = "",
  style = {},
  opacity = 1,
  showControls = false,
  showPeople = false,
}: ContourMapBackgroundProps) {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [params, setParams] = useState<ContourParams>({ ...DEFAULTS, opacity });
  const paramsRef = useRef(params);
  paramsRef.current = params;
  const [isRebuilding, setIsRebuilding] = useState(false);

  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;
    const { sketch, dispose } = createContourSketch({
      container, paramsRef, onRebuildChange: setIsRebuilding, showPeople,
    });
    const instance = new p5(sketch, container);
    return () => {
      dispose();
      instance.remove();
    };
  }, [showPeople]);

  return (
    <div className={className} style={{ position: "absolute", inset: 0, pointerEvents: "none", ...style }}>
      <div ref={canvasContainerRef} style={{ position: "absolute", inset: 0, opacity: params.opacity }} />
      {showControls && (
        <div style={{ pointerEvents: "auto" }}>
          <ContourControls
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
