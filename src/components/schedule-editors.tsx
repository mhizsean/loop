import { Radius, Spacing, Type } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Weekday } from "@/lib/types";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface Props {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
}

interface StepBtnProps {
  label: string;
  onPress: () => void;
  disabled: boolean;
  c: ReturnType<typeof useTheme>;
}

export function Stepper({ value, onChange, min = 1, max = 100 }: Props) {
  const c = useTheme();
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));
  return (
    <View>
      <Text style={[Type.body, { color: c.text }]}>Repeat every</Text>
      <View style={styles.stepControls}>
        <StepBtn label="−" onPress={dec} disabled={value <= min} c={c} />
        <Text style={[styles.stepNum, { color: c.text }]}>{value}</Text>
        <StepBtn label="+" onPress={inc} disabled={value >= max} c={c} />
        <Text style={[Type.meta, { color: c.textSecondary, marginLeft: 4 }]}>
          days
        </Text>
      </View>
    </View>
  );
}

function StepBtn({ label, onPress, disabled, c }: StepBtnProps) {
  return (
    <Pressable
      style={[
        styles.stepBtn,
        { borderColor: c.cardBorder, opacity: disabled ? 0.4 : 1 },
      ]}
      onPress={onPress}
      disabled={disabled}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={label === "−" ? "Decrease " : "Increase "}
    >
      <Text style={{ color: c.accent, fontSize: 18, lineHeight: 20 }}>
        {label}
      </Text>
    </Pressable>
  );
}

const DAYS: { d: Weekday; label: string }[] = [
  { d: 1, label: "M" },
  { d: 2, label: "T" },
  { d: 3, label: "W" },
  { d: 4, label: "T" },
  { d: 5, label: "F" },
  { d: 6, label: "S" },
  { d: 0, label: "S" },
];

export function WeekdayChips({
  selected,
  onChange,
}: {
  selected: Weekday[];
  onChange: (days: Weekday[]) => void;
}) {
  const c = useTheme();
  const toggle = (d: Weekday) =>
    onChange(
      selected.includes(d) ? selected.filter((x) => x !== d) : [...selected, d],
    );

  return (
    <View style={styles.chipRow}>
      {DAYS.map(({ d, label }, i) => {
        const on = selected.includes(d);
        return (
          <Pressable
            key={i}
            onPress={() => toggle(d)}
            style={[
              styles.chip,
              on
                ? { backgroundColor: c.accent, borderColor: c.accent }
                : { borderColor: c.cardBorder },
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
          >
            <Text
              style={{
                color: on ? c.accentOn : c.textSecondary,
                fontWeight: "600",
                fontSize: 14,
              }}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
const styles = StyleSheet.create({
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  stepControls: { flexDirection: "row", alignItems: "center", gap: Spacing.lg },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: Radius.sm,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNum: {
    fontSize: 17,
    fontWeight: "600",
    minWidth: 18,
    textAlign: "center",
  },
  chipRow: { flexDirection: "row", justifyContent: "space-between" },
  chip: {
    width: 40,
    height: 40,
    borderRadius: Radius.pill,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
