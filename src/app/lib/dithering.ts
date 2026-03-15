export type RGB = { r: number; g: number; b: number };

// Gameboy-style green palette (2-color)
const PALETTE_GAMEBOY: RGB[] = [
  { r: 15, g: 56, b: 15 },     // Darkest
  { r: 202, g: 220, b: 159 },  // Lightest
];

// Plus Ultra brand palette — dark bg + neon green
export const PALETTE_PLUS_ULTRA: RGB[] = [
  { r: 8, g: 11, b: 9 },      // --pu-bg
  { r: 57, g: 255, b: 20 },   // --pu-green
];

function findClosestColor(color: RGB, palette: RGB[]): RGB {
  let minDistance = Infinity;
  let closest = palette[0];
  for (const p of palette) {
    const distance = Math.sqrt(
      Math.pow(color.r - p.r, 2) +
      Math.pow(color.g - p.g, 2) +
      Math.pow(color.b - p.b, 2)
    );
    if (distance < minDistance) { minDistance = distance; closest = p; }
  }
  return closest;
}

export function floydSteinbergDither(imageData: ImageData, palette: RGB[] = PALETTE_GAMEBOY) {
  const { width, height, data } = imageData;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const oldR = data[i], oldG = data[i + 1], oldB = data[i + 2];
      const closest = findClosestColor({ r: oldR, g: oldG, b: oldB }, palette);
      data[i] = closest.r; data[i + 1] = closest.g; data[i + 2] = closest.b;
      const errR = oldR - closest.r, errG = oldG - closest.g, errB = oldB - closest.b;
      if (x + 1 < width) { const ni = (y * width + (x + 1)) * 4; data[ni] += errR * 7 / 16; data[ni + 1] += errG * 7 / 16; data[ni + 2] += errB * 7 / 16; }
      if (x - 1 >= 0 && y + 1 < height) { const ni = ((y + 1) * width + (x - 1)) * 4; data[ni] += errR * 3 / 16; data[ni + 1] += errG * 3 / 16; data[ni + 2] += errB * 3 / 16; }
      if (y + 1 < height) { const ni = ((y + 1) * width + x) * 4; data[ni] += errR * 5 / 16; data[ni + 1] += errG * 5 / 16; data[ni + 2] += errB * 5 / 16; }
      if (x + 1 < width && y + 1 < height) { const ni = ((y + 1) * width + (x + 1)) * 4; data[ni] += errR / 16; data[ni + 1] += errG / 16; data[ni + 2] += errB / 16; }
    }
  }
}
