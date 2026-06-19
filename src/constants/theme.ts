import { Platform } from "react-native";

export type ThemeName = "light" | "dark";

export interface Palette {
  background: string;
  card: string;
  cardBorder: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentOn: string;
  accentSoft: string;
  segmentBg: string;
  segmentSelected: string;
  tickBorder: string;
  divider: string;
}

const light: Palette = {
  background: "#F3EFE7",
  card: "#FFFFFF",
  cardBorder: "#E6E0D3",
  text: "#2C2A26",
  textSecondary: "#A39D8E",
  textMuted: "#C3BCAB",
  accent: "#7D8C6A",
  accentOn: "#FFFFFF",
  accentSoft: "rgba(125, 140, 106, 0.12)",
  segmentBg: "#ECE7DB",
  segmentSelected: "#FFFFFF",
  tickBorder: "#C3BCAB",
  divider: "#E6E0D3",
};

const dark: Palette = {
  background: "#16130F",
  card: "#211C17",
  cardBorder: "#2C261F",
  text: "#F0E9DF",
  textSecondary: "#7D7468",
  textMuted: "#544D44",
  accent: "#F0A045",
  accentOn: "#16130F",
  accentSoft: "rgba(240, 160, 69, 0.10)",
  segmentBg: "#211C17",
  segmentSelected: "#3A342C",
  tickBorder: "#3A342C",
  divider: "#2C261F",
};

export const Colors: Record<ThemeName, Palette> = { light, dark };

// ---- typography ------------------------------------------------------------
export const Fonts = {
  serif: Platform.select({
    ios: "Newsreader",
    android: "Newsreader",
    default: "Newsreader, Georgia, serif",
  })!,
  sans: Platform.select({
    ios: "System",
    android: "sans-serif",
    default: "Inter, system-ui, sans-serif",
  })!,
};

export const Type = {
  affirmation: { fontFamily: "serif" as const, fontSize: 26, lineHeight: 34 },
  affirmationLg: { fontFamily: "serif" as const, fontSize: 30, lineHeight: 40 },
  greeting: { fontFamily: "serif" as const, fontSize: 24, lineHeight: 30 },
  title: { fontFamily: "serif" as const, fontSize: 28, lineHeight: 34 },
  habitName: {
    fontFamily: "sans" as const,
    fontSize: 16,
    fontWeight: "500" as const,
  },
  meta: { fontFamily: "sans" as const, fontSize: 13 },
  label: {
    fontFamily: "sans" as const,
    fontSize: 12,
    fontWeight: "600" as const,
    letterSpacing: 1.4,
    textTransform: "uppercase" as const,
  },
  body: { fontFamily: "sans" as const, fontSize: 15, lineHeight: 22 },
  button: {
    fontFamily: "sans" as const,
    fontSize: 16,
    fontWeight: "600" as const,
  },
};

// ---- spacing & shape -------------------------------------------------------
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  screenX: 24,
};

export const Radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  pill: 999,
};

export const MaxContentWidth = 560;
