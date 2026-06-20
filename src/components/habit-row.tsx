import { Radius, Spacing, Type } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { comingUpLabel, scheduleLabel } from "@/lib/schedule";
import type { Habit } from "@/lib/types";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface Props {
  habit: Habit;
  variant: "due" | "upcoming";
  done?: boolean;
  onToggle?: (id: string) => void;
  onPress?: (id: string) => void;
}

export function HabitRow({
  habit,
  variant,
  done = false,
  onToggle,
  onPress,
}: Props) {
  const c = useTheme();
  const upcoming = variant === "upcoming";

  const nameColor = upcoming ? c.textMuted : done ? c.textSecondary : c.text;

  const meta = upcoming ? comingUpLabel(habit) : scheduleLabel(habit);

  return (
    <Pressable
      onPress={() => !upcoming && onPress?.(habit.id)}
      style={({ pressed }) => [
        styles.row,
        { opacity: pressed && !upcoming ? 0.6 : 1 },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${habit.name}, ${meta}${done ? ", done" : ""}`}
    >
      <Tick
        done={done}
        disabled={upcoming}
        color={c.accent}
        onColor={c.accentOn}
        border={c.tickBorder}
        onPress={() => onToggle?.(habit.id)}
      />
      <View style={styles.body}>
        <Text
          style={[
            Type.habitName,
            { color: nameColor },
            done && styles.struck,
            done && { textDecorationColor: c.textMuted },
          ]}
          numberOfLines={1}
        >
          {habit.name}
        </Text>
        <Text
          style={[
            Type.meta,
            { color: upcoming ? c.textMuted : c.textSecondary },
          ]}
        >
          {meta}
        </Text>
      </View>
    </Pressable>
  );
}

function Tick({
  done,
  disabled,
  color,
  onColor,
  border,
  onPress,
}: {
  done: boolean;
  disabled: boolean;
  color: string;
  onColor: string;
  border: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      hitSlop={10}
      disabled={disabled}
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: done }}
      style={[
        styles.tick,
        done
          ? { backgroundColor: color, borderColor: color }
          : { borderColor: border, borderStyle: disabled ? "dashed" : "solid" },
      ]}
    >
      {done && <View style={[styles.check, { borderColor: onColor }]} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  tick: {
    width: 26,
    height: 26,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  check: {
    width: 9,
    height: 5,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    transform: [{ rotate: "-45deg" }],
    marginTop: -2,
  },
  body: { flex: 1, gap: 3 },
  struck: { textDecorationLine: "line-through" },
});
