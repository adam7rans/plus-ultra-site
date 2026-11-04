export type ContourTheme = "dark" | "light";

export const CONTOUR_PALETTES = {
  dark: {
    contour: "57,255,20",
    spotlight: "#39ff14",
    people: ["#78dfff", "#ffd078", "#d5a4ff"],
  },
  light: {
    contour: "0,0,0",
    spotlight: "#000000",
    people: ["#007ca3", "#946000", "#7844b6"],
  },
} as const;
