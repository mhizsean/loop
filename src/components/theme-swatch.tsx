import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import type { ThemePreference } from "@/lib/types";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface Props {
  value: ThemePreference;
  label: string;
  selected: boolean;
  onPress: () => void;
}

export function ThemeSwatch({ value, label, selected, onPress }: Props) {
  const c = useTheme();
  return (
    <Pressable
      style={styles.wrap}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`${label} theme`}
    >
      <View
        style={[
          styles.swatch,
          {
            borderColor: selected ? c.accent : "transparent",
            borderWidth: selected ? 2 : 2,
          },
        ]}
      >
        <Preview value={value} />
      </View>
      <Text
        style={[
          Type.meta,
          {
            color: selected ? c.text : c.textSecondary,
            fontWeight: selected ? "700" : "500",
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function Preview({ value }: { value: ThemePreference }) {
  if (value === "system") {
    return (
      <View style={styles.previewBase}>
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: Colors.light.background },
          ]}
        />
        <View
          style={[styles.diagonal, { backgroundColor: Colors.dark.background }]}
        />
        <Dot color={Colors.light.accent} pos="tl" />
        <Dot color={Colors.dark.accent} pos="br" />
      </View>
    );
  }
  const p = value === "dark" ? Colors.dark : Colors.light;
  return (
    <View
      style={[
        styles.previewBase,
        { backgroundColor: p.background, padding: 6 },
      ]}
    >
      <Dot color={p.accent} pos="tr" />
      <View style={[styles.bar, { backgroundColor: p.card }]} />
    </View>
  );
}

function Dot({ color, pos }: { color: string; pos: "tl" | "tr" | "br" }) {
  const place =
    pos === "tl"
      ? { top: 6, left: 6 }
      : pos === "tr"
        ? { top: 6, right: 6 }
        : { bottom: 6, right: 6 };
  return <View style={[styles.dot, { backgroundColor: color }, place]} />;
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: "center", gap: Spacing.sm },
  swatch: {
    width: "100%",
    height: 74,
    borderRadius: Radius.md,
    overflow: "hidden",
  },
  previewBase: {
    flex: 1,
    borderRadius: Radius.sm - 2,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  diagonal: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: "140%",
    height: "140%",
    transform: [{ rotate: "-45deg" }, { translateX: 30 }],
  },
  dot: { position: "absolute", width: 8, height: 8, borderRadius: 4 },
  bar: { height: 16, borderRadius: 4, margin: 6 },
});
