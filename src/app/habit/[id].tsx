import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Stepper, WeekdayChips } from "@/components/schedule-editors";
import { SectionLabel } from "@/components/section-label";
import { Segmented } from "@/components/segmented";
import { MaxContentWidth, Radius, Spacing, Type } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useLoopStore } from "@/lib/store";
import type { Schedule, Weekday } from "@/lib/types";
import { emptyReminder } from "@/lib/types";

type SchedKind = "daily" | "interval" | "weekdays";

export default function HabitFormScreen() {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const isNew = id === "new";
  const existing = useLoopStore((s) =>
    isNew ? undefined : s.habits.find((h) => h.id === id),
  );
  const addHabit = useLoopStore((s) => s.addHabit);
  const updateHabit = useLoopStore((s) => s.updateHabit);
  const deleteHabit = useLoopStore((s) => s.deleteHabit);

  const [name, setName] = useState(existing?.name ?? "");
  const [kind, setKind] = useState<SchedKind>(
    existing?.schedule.type ?? "daily",
  );
  const [everyN, setEveryN] = useState(
    existing?.schedule.type === "interval" ? existing.schedule.everyNDays : 2,
  );
  const [days, setDays] = useState<Weekday[]>(
    existing?.schedule.type === "weekdays" ? existing.schedule.days : [],
  );
  const [remindOn, setRemindOn] = useState(existing?.reminder.enabled ?? false);
  const [time, setTime] = useState(existing?.reminder.time ?? "18:00");
  const [showPicker, setShowPicker] = useState(false);

  const canSave =
    name.trim().length > 0 && (kind !== "weekdays" || days.length > 0);

  const buildSchedule = (): Schedule => {
    if (kind === "interval") return { type: "interval", everyNDays: everyN };
    if (kind === "weekdays") return { type: "weekdays", days };
    return { type: "daily" };
  };

  const onSave = () => {
    if (!canSave) return;
    const schedule = buildSchedule();
    const reminder = {
      ...emptyReminder(),
      enabled: remindOn,
      time: remindOn ? time : null,
    };
    if (isNew) {
      addHabit({ name, schedule, reminder });
    } else if (existing) {
      updateHabit(existing.id, { name: name.trim(), schedule, reminder });
    }
    router.back();
  };

  const onDelete = () => {
    if (existing) deleteHabit(existing.id);
    router.back();
  };

  const timeToDate = (t: string): Date => {
    const [h, m] = t.split(":").map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d;
  };
  const onPickTime = (event: DateTimePickerEvent, picked?: Date) => {
    if (Platform.OS !== "ios") setShowPicker(false);
    if (event.type === "dismissed" || !picked) return;
    const hh = String(picked.getHours()).padStart(2, "0");
    const mm = String(picked.getMinutes()).padStart(2, "0");
    setTime(`${hh}:${mm}`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Text style={[Type.body, { color: c.textSecondary }]}>Cancel</Text>
        </Pressable>
        <Text
          style={[
            Type.label,
            { color: c.text, letterSpacing: 0.5, fontSize: 16 },
          ]}
        >
          {isNew ? "New habit" : "Edit habit"}
        </Text>
        <Pressable onPress={onSave} hitSlop={8} disabled={!canSave}>
          <Text
            style={[Type.button, { color: canSave ? c.accent : c.textMuted }]}
          >
            Save
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 40 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.inner}>
          <SectionLabel>Habit name</SectionLabel>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g. Read a chapter of a book"
            placeholderTextColor={c.textMuted}
            style={[
              styles.nameInput,
              { color: c.text, borderBottomColor: c.cardBorder },
            ]}
            autoFocus={isNew}
          />

          <SectionLabel>How often</SectionLabel>
          <Segmented
            value={kind}
            onChange={setKind}
            options={[
              { value: "daily", label: "Daily" },
              { value: "interval", label: "Every N days" },
              { value: "weekdays", label: "Weekdays" },
            ]}
          />

          {kind === "interval" && (
            <View style={{ marginTop: Spacing.lg }}>
              <Stepper value={everyN} onChange={setEveryN} />
              <Text
                style={[
                  Type.meta,
                  { color: c.textSecondary, marginTop: Spacing.md },
                ]}
              >
                Shows up in "Due today" every{" "}
                {everyN === 1 ? "day" : `${everyN} days`} — no pressure to do it
                the days between.
              </Text>
            </View>
          )}

          {kind === "weekdays" && (
            <View style={{ marginTop: Spacing.lg }}>
              <WeekdayChips selected={days} onChange={setDays} />
              {days.length === 0 && (
                <Text
                  style={[
                    Type.meta,
                    { color: c.textMuted, marginTop: Spacing.md },
                  ]}
                >
                  Pick at least one day.
                </Text>
              )}
            </View>
          )}

          <SectionLabel>Reminder</SectionLabel>
          <View
            style={[
              styles.card,
              { backgroundColor: c.card, borderColor: c.cardBorder },
            ]}
          >
            <View style={styles.reminderRow}>
              <View style={{ flex: 1 }}>
                <Text style={[Type.habitName, { color: c.text }]}>
                  Remind me
                </Text>
                <Text
                  style={[Type.meta, { color: c.textSecondary, marginTop: 2 }]}
                >
                  A gentle nudge before the day ends
                </Text>
              </View>
              <Switch
                value={remindOn}
                onValueChange={setRemindOn}
                trackColor={{ true: c.accent, false: c.cardBorder }}
                thumbColor={c.card}
              />
            </View>
            {remindOn && (
              <Pressable
                style={[styles.timeRow, { borderTopColor: c.divider }]}
                onPress={() => setShowPicker((v) => !v)}
              >
                <Text style={[Type.body, { color: c.text }]}>Time</Text>
                <Text style={[Type.body, { color: c.accent }]}>
                  {formatTime(time)}
                </Text>
              </Pressable>
            )}

            {remindOn && showPicker && (
              <View
                style={Platform.OS === "ios" ? styles.iosPicker : undefined}
              >
                <DateTimePicker
                  value={timeToDate(time)}
                  mode="time"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={onPickTime}
                />
              </View>
            )}
          </View>

          {!isNew && (
            <Pressable onPress={onDelete} style={styles.delete} hitSlop={8}>
              <Text style={[Type.body, { color: "#C0584F" }]}>
                Delete habit
              </Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function formatTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const ampm = h < 12 ? "AM" : "PM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.screenX,
    paddingBottom: Spacing.md,
  },
  content: { paddingHorizontal: Spacing.screenX, alignItems: "center" },
  inner: { width: "100%", maxWidth: MaxContentWidth },
  nameInput: {
    ...Type.title,
    fontSize: 24,
    borderBottomWidth: 1,
    paddingVertical: Spacing.sm,
  },
  card: { borderRadius: Radius.md, borderWidth: 1, overflow: "hidden" },
  reminderRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.lg,
    borderTopWidth: 1,
  },
  delete: {
    alignItems: "center",
    marginTop: Spacing.xxl,
    paddingVertical: Spacing.md,
  },
  iosPicker: { alignItems: "center" },
});
