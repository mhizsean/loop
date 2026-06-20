import AffirmationCard from "@/components/affirmation-card";
import { HabitRow } from "@/components/habit-row";
import { SectionLabel } from "@/components/section-label";
import { MaxContentWidth, Spacing, Type } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { greeting, longDateLabel, todayISO } from "@/lib/dates";
import { selectToday, useLoopStore } from "@/lib/store";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TodayScreen() {
  const c = useTheme();
  const today = todayISO();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const habits = useLoopStore((state) => state.habits);
  const meta = useLoopStore((state) => state.meta);
  const toggleComplete = useLoopStore((state) => state.toggleComplete);

  const { due, upcoming } = useMemo(
    () => selectToday({ habits } as any, today),
    [habits, today],
  );

  const affirmation = meta.affirmationEnabled
    ? (meta.affirmationByDate[today] ?? null)
    : null;

  const isEmpty = habits.length === 0;
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
        <Text style={[Type.label, { color: c.textSecondary }]}>
          {" "}
          {longDateLabel(today).toUpperCase()}
        </Text>
        <View style={styles.headerRow}>
          <Text style={[Type.greeting, { color: c.text, flex: 1 }]}>
            {greeting()}
          </Text>
          <Pressable
            onPress={() => router.push("/habit/new")}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Add habit"
          >
            <Text style={{ color: c.accent, fontSize: 28 }}>＋</Text>
          </Pressable>
        </View>

        {affirmation && <AffirmationCard text={affirmation} />}

        {isEmpty ? (
          <Empty />
        ) : (
          <>
            {due.length > 0 && (
              <>
                <SectionLabel>Due Today</SectionLabel>
                {due.map((habit) => (
                  <HabitRow
                    key={habit.id}
                    habit={habit}
                    variant="due"
                    done={habit.lastCompletedAt === today}
                    onToggle={toggleComplete}
                    onPress={() => router.push(`/habit/${habit.id}`)}
                  />
                ))}
              </>
            )}

            {upcoming.length > 0 && (
              <>
                <SectionLabel>Coming up</SectionLabel>
                {upcoming.map((h) => (
                  <HabitRow key={h.id} habit={h} variant="upcoming" />
                ))}
              </>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
}

function Empty() {
  const c = useTheme();

  return (
    <View style={styles.empty}>
      <Text
        style={[
          Type.affirmation,
          { color: c.textSecondary, textAlign: "center" },
        ]}
      >
        Nothing here yet.
      </Text>
      <Text style={[Type.body, { color: c.textMuted, textAlign: "center" }]}>
        Add your first habit to begin. Small and consistent beats big and rare.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: Spacing.screenX, alignItems: "center" },
  inner: { width: "100%", maxWidth: MaxContentWidth },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  empty: {
    paddingTop: Spacing.xxl * 2,
    gap: Spacing.md,
    alignItems: "center",
  },
});
