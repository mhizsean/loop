import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { SectionLabel } from "@/components/section-label";
import { Segmented } from "@/components/segmented";
import { ThemeSwatch } from "@/components/theme-swatch";
import { MaxContentWidth, Radius, Spacing, Type } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useLoopStore } from "@/lib/store";
import type { AffirmationTone, ThemePreference } from "@/lib/types";

const APP_VERSION = "1.0.0";

export default function SettingsScreen() {
  const c = useTheme();
  const insets = useSafeAreaInsets();

  const meta = useLoopStore((s) => s.meta);
  const setTheme = useLoopStore((s) => s.setTheme);
  const setAffirmationEnabled = useLoopStore((s) => s.setAffirmationEnabled);
  const setAffirmationTone = useLoopStore((s) => s.setAffirmationTone);

  const themes: { value: ThemePreference; label: string }[] = [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
    { value: "system", label: "System" },
  ];

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
        <Text style={[Type.title, { color: c.text, marginBottom: Spacing.xl }]}>
          Settings
        </Text>

        <SectionLabel>Appearance</SectionLabel>
        <View style={styles.swatches}>
          {themes.map((t) => (
            <ThemeSwatch
              key={t.value}
              value={t.value}
              label={t.label}
              selected={meta.theme === t.value}
              onPress={() => setTheme(t.value)}
            />
          ))}
        </View>

        <SectionLabel>Affirmations</SectionLabel>
        <View
          style={[
            styles.group,
            { backgroundColor: c.card, borderColor: c.cardBorder },
          ]}
        >
          <View style={styles.row}>
            <Text style={[Type.habitName, { color: c.text }]}>
              Daily affirmation
            </Text>
            <Switch
              value={meta.affirmationEnabled}
              onValueChange={setAffirmationEnabled}
              trackColor={{ true: c.accent, false: c.cardBorder }}
              thumbColor={c.card}
            />
          </View>
          {meta.affirmationEnabled && (
            <View
              style={[
                styles.row,
                styles.rowDivided,
                { borderTopColor: c.divider },
              ]}
            >
              <Text style={[Type.habitName, { color: c.text }]}>Tone</Text>
              <View style={{ width: 180 }}>
                <Segmented<AffirmationTone>
                  value={meta.affirmationTone}
                  onChange={setAffirmationTone}
                  options={[
                    { value: "gentle", label: "Gentle" },
                    { value: "direct", label: "Direct" },
                  ]}
                />
              </View>
            </View>
          )}
        </View>

        <SectionLabel>Notifications</SectionLabel>
        <View
          style={[
            styles.group,
            { backgroundColor: c.card, borderColor: c.cardBorder },
          ]}
        >
          <View style={styles.row}>
            <View>
              <Text style={[Type.habitName, { color: c.text }]}>Reminders</Text>
              <Text
                style={[Type.meta, { color: c.textSecondary, marginTop: 2 }]}
              >
                Set per habit
              </Text>
            </View>
            <Text style={{ color: c.textMuted, fontSize: 18 }}>›</Text>
          </View>
        </View>

        <SectionLabel>About</SectionLabel>
        <View
          style={[
            styles.group,
            { backgroundColor: c.card, borderColor: c.cardBorder },
          ]}
        >
          <View
            style={[
              styles.row,
              { flexDirection: "column", alignItems: "flex-start", gap: 4 },
            ]}
          >
            <Text style={[Type.body, { color: c.text }]}>
              Your data stays on this device.
            </Text>
            <Text style={[Type.meta, { color: c.textSecondary }]}>
              Loop · version {APP_VERSION}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: Spacing.screenX, alignItems: "center" },
  inner: { width: "100%", maxWidth: MaxContentWidth },
  swatches: { flexDirection: "row", gap: Spacing.md },
  group: { borderRadius: Radius.lg, borderWidth: 1, overflow: "hidden" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.lg,
  },
  rowDivided: { borderTopWidth: 1 },
});
