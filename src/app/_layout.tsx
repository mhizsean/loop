import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { useTheme, useThemeName } from "@/hooks/use-theme";
import { useLoopStore } from "@/lib/store";
import { View } from "react-native";
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

        <View style={{ flex: 1 }}>
          {hydrated ? (
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: c.background },
              }}
            >
              <Stack.Screen name="(tabs)" />
              <Stack.Screen
                name="habit/[id]"
                options={{ presentation: "modal" }}
              />
            </Stack>
          ) : (
            <View>activity indicator here</View>
          )}
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
