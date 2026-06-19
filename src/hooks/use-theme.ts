import { Colors, type Palette } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useLoopStore } from "@/lib/store";

export function useThemeName() {
  const scheme = useColorScheme();
  const preference = useLoopStore((state) => state.meta.theme);

  if (preference === "light") return "light";
  if (preference === "dark") return "dark";
  return scheme === "dark" ? "dark" : "light";
}

export function useTheme(): Palette {
  const themeName = useThemeName();

  return Colors[themeName];
}
