import { MaxContentWidth, Radius, Spacing, Type } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
  text: string;
  onContinue: () => void;
}

export function AffirmationGate({ text, onContinue }: Props) {
  const c = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        styles.fill,
        { backgroundColor: c.background },
      ]}
    >
      <View
        style={[
          styles.inner,
          { paddingTop: insets.top, paddingBottom: insets.bottom + Spacing.xl },
        ]}
      >
        <Animated.View entering={FadeIn.duration(600)} style={styles.center}>
          <Text
            style={[Type.label, { color: c.accent, marginBottom: Spacing.xl }]}
          >
            Today's note
          </Text>
          <Text
            style={[Type.affirmationLg, { color: c.text, textAlign: "center" }]}
          >
            {text}
          </Text>
        </Animated.View>

        <Pressable
          onPress={onContinue}
          style={[styles.button, { backgroundColor: c.accent }]}
          accessibilityRole="button"
        >
          <Text style={[Type.button, { color: c.accentOn }]}>Continue</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { zIndex: 10 },
  inner: {
    flex: 1,
    paddingHorizontal: Spacing.screenX,
    alignItems: "center",
    width: "100%",
    alignSelf: "center",
    maxWidth: MaxContentWidth,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  button: {
    width: "100%",
    paddingVertical: Spacing.lg,
    borderRadius: Radius.pill,
    alignItems: "center",
  },
});
