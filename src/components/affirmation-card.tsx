import { Radius, Spacing, Type } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

interface Props {
  text: string;
  initiallyCollapsed?: boolean;
}

export default function AffirmationCard({
  text,
  initiallyCollapsed = false,
}: Props) {
  const c = useTheme();
  const [collapsed, setCollapsed] = useState(initiallyCollapsed);
  const translateY = useSharedValue(0);

  const swipe = Gesture.Pan()
    .activeOffsetY(-10)
    .onUpdate((e) => {
      if (e.translationY < 0) translateY.value = e.translationY;
    })
    .onEnd((e) => {
      if (e.translationY < -40) {
        translateY.value = withTiming(0, { duration: 1 });
        scheduleOnRN(setCollapsed, true);
      } else {
        translateY.value = withTiming(0);
      }
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (collapsed) {
    return (
      <Pressable
        onPress={() => setCollapsed(false)}
        style={[
          styles.pill,
          { backgroundColor: c.card, borderColor: c.cardBorder },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Show today's note"
      >
        <Text style={[styles.pillStar, { color: c.accent }]}>✦</Text>
        <Text style={[Type.body, { color: c.text, flex: 1 }]}>
          Today's note
        </Text>
        <Text style={{ color: c.textMuted }}>›</Text>
      </Pressable>
    );
  }

  return (
    <View>
      <GestureDetector gesture={swipe}>
        <Animated.View
          style={[
            styles.card,
            { backgroundColor: c.card, borderColor: c.cardBorder },
            cardStyle,
          ]}
        >
          <View style={styles.cardHead}>
            <Text style={[Type.label, { color: c.textSecondary }]}>
              Today's note
            </Text>
            <Pressable
              hitSlop={10}
              onPress={() => setCollapsed(true)}
              accessibilityRole="button"
              accessibilityLabel="Collapse today's note"
            >
              <Text style={{ color: c.textMuted, fontSize: 16 }}>⌃</Text>
            </Pressable>
          </View>
          <Text style={[Type.affirmation, { color: c.text }]}>{text}</Text>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.xl,
    borderWidth: 1,
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  cardHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    borderRadius: Radius.pill,
    borderWidth: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  pillStar: { fontSize: 14 },
});
