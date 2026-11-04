export interface Pt { x: number; y: number }
export interface Chain {
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
export const DEFAULTS: ContourParams = {
  speed: 30,
  speedYRatio: 0.85,
  opacity: 0.40,
  lineAlpha: 0.28,
  lineWidth: 1.0,
  cellSize: 7,
  noiseStep: 0.055,
  numLevels: 23,
  noiseOctaves: 3,
  noiseFalloff: 0.72,
  blurPasses: 2,
  minChainPts: 8,
};

export const TILE_W = 4200;
export const TILE_H = 2600;

