import { SymbolView } from "expo-symbols";
import type { ColorValue } from "react-native";

const TAB_ICONS = {
  today: {
    ios: "circle.circle",
    android: "trip_origin",
  },
  habits: {
    ios: "line.3.horizontal",
    android: "format_list_bulleted",
  },
  settings: {
    ios: "slider.horizontal.3",
    android: "tune",
  },
} as const;

type TabIconName = keyof typeof TAB_ICONS;

export function TabIcon({
  name,
  color,
}: {
  name: TabIconName;
  color: ColorValue;
}) {
  return (
    <SymbolView
      name={TAB_ICONS[name]}
      tintColor={color}
      size={22}
      weight="semibold"
    />
  );
}
