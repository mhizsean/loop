import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { AffirmationGate } from "@/components/affirmation-gate";
import { useDailyGate } from "@/hooks/use-daily-gate";
import { useTheme, useThemeName } from "@/hooks/use-theme";
import { useLoopStore } from "@/lib/store";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const c = useTheme();

  const themeName = useThemeName();

  const hydrated = useLoopStore((state) => state._hasHydrated);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style={themeName === "dark" ? "light" : "dark"} />

        <View style={{ flex: 1, backgroundColor: c.background }}>
          {hydrated ? (
            <AppShell />
          ) : (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ActivityIndicator color={c.accent} />
            </View>
          )}
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function AppShell() {
  const c = useTheme();
  const { showGate, text, dismiss } = useDailyGate();

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: c.background },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="habit/[id]" options={{ presentation: "modal" }} />
      </Stack>
      {showGate && text && <AffirmationGate text={text} onContinue={dismiss} />}
    </>
  );
}
