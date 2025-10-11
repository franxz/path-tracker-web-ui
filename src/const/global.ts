import type { ColorTheme } from "../types/global";

export const colorThemes: Record<ColorTheme, { light: string; dark: string }> = {
  cyan: { light: "cyan", dark: "darkcyan" },
  blue: { light: "#7ecbff", dark: "#005fa3" },
  green: { light: "#baffc9", dark: "#008c3a" },
  red: { light: "#ffb3b3", dark: "#a30000" },
  orange: { light: "#ffd580", dark: "#b36b00" },
  purple: { light: "#e0b3ff", dark: "#6b00b3" },
  pink: { light: "#ffb3e6", dark: "#b3006b" },
  teal: { light: "#b3fff6", dark: "#008c7a" },
  yellow: { light: "#ffffb3", dark: "#b3b300" },
  gray: { light: "#e0e0e0", dark: "#444" },
};

export { colorThemeLabelsStrings as colorThemeLabels } from "./colorThemeLabelsStrings";
