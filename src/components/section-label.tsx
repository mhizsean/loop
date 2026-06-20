import { Spacing, Type } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { StyleSheet, Text } from "react-native";

export function SectionLabel({ children }: { children: string }) {
  const c = useTheme();
  return (
    <Text style={[styles.label, { color: c.textSecondary }]}>{children}</Text>
  );
}

const styles = StyleSheet.create({
  label: {
    ...Type.label,
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
    marginLeft: Spacing.xs,
  },
});
