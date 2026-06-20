// src/app/(tabs)/habits.tsx
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MaxContentWidth, Radius, Spacing, Type } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { scheduleLabel } from "@/lib/schedule";
import { useLoopStore } from "@/lib/store";
import type { Habit } from "@/lib/types";

export default function HabitsScreen() {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const habits = useLoopStore((s) => s.habits);

  return (
    <ScrollView
      style={{ backgroundColor: c.background }}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + Spacing.sm,
          paddingBottom: insets.bottom + 100,
        },
      ]}
    >
      <View style={styles.inner}>
        <View style={styles.header}>
          <Text style={[Type.title, { color: c.text }]}>Habits</Text>
          <Pressable
            onPress={() => router.push("/habit/new")}
            style={[styles.addBtn, { backgroundColor: c.accent }]}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Add a habit"
          >
            <Text style={{ color: c.accentOn, fontSize: 24, lineHeight: 26 }}>
              +
            </Text>
          </Pressable>
        </View>

        {habits.length === 0 ? (
          <Empty />
        ) : (
          <>
            <Text
              style={[
                Type.label,
                { color: c.textSecondary, marginBottom: Spacing.md },
              ]}
            >
              All habits · {habits.length}
            </Text>
            <View
              style={[
                styles.list,
                { backgroundColor: c.card, borderColor: c.cardBorder },
              ]}
            >
              {habits.map((h, i) => (
                <ManageRow
                  key={h.id}
                  habit={h}
                  isLast={i === habits.length - 1}
                  onPress={() => router.push(`/habit/${h.id}`)}
                />
              ))}
            </View>
            <Text
              style={[
                Type.meta,
                {
                  color: c.textMuted,
                  textAlign: "center",
                  marginTop: Spacing.xl,
                },
              ]}
            >
              Tap a habit to adjust its rhythm. Nothing here can be "behind."
            </Text>
          </>
        )}
      </View>
    </ScrollView>
  );
}

function ManageRow({
  habit,
  isLast,
  onPress,
}: {
  habit: Habit;
  isLast: boolean;
  onPress: () => void;
}) {
  const c = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        {
          borderBottomColor: c.divider,
          borderBottomWidth: isLast ? 0 : 1,
          opacity: pressed ? 0.6 : 1,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Edit ${habit.name}`}
    >
      <View style={[styles.dot, { backgroundColor: c.accentSoft }]}>
        <View style={[styles.dotInner, { backgroundColor: c.accent }]} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[Type.habitName, { color: c.text }]} numberOfLines={1}>
          {habit.name}
        </Text>
        <Text style={[Type.meta, { color: c.textSecondary, marginTop: 2 }]}>
          {scheduleLabel(habit)}
        </Text>
      </View>
      <Text style={{ color: c.textMuted, fontSize: 18 }}>›</Text>
    </Pressable>
  );
}

function Empty() {
  const c = useTheme();
  const router = useRouter();
  return (
    <View style={styles.empty}>
      <Text
        style={[
          Type.affirmation,
          { color: c.textSecondary, textAlign: "center" },
        ]}
      >
        No habits yet.
      </Text>
      <Text style={[Type.body, { color: c.textMuted, textAlign: "center" }]}>
        Add one to start building your rhythm.
      </Text>
      <Pressable
        onPress={() => router.push("/habit/new")}
        style={[styles.emptyBtn, { backgroundColor: c.accent }]}
      >
        <Text style={[Type.button, { color: c.accentOn }]}>Add a habit</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: Spacing.screenX, alignItems: "center" },
  inner: { width: "100%", maxWidth: MaxContentWidth },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.xl,
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  list: { borderRadius: Radius.lg, borderWidth: 1, overflow: "hidden" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.lg,
    padding: Spacing.lg,
  },
  dot: {
    width: 32,
    height: 32,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  dotInner: { width: 8, height: 8, borderRadius: 4 },
  empty: { paddingTop: Spacing.xxl * 2, gap: Spacing.md, alignItems: "center" },
  emptyBtn: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.pill,
  },
});
