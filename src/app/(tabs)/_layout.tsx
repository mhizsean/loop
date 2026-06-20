import { useTheme, useThemeName } from "@/hooks/use-theme";
import { Tabs } from "expo-router";
import { Text } from "react-native";

export default function TabsLayout() {
  const c = useTheme();
  const themeName = useThemeName();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: c.background,
          borderTopColor: c.divider,
        },
        tabBarActiveTintColor: themeName === "dark" ? c.accent : c.text,
        tabBarInactiveTintColor: c.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "today",
          tabBarIcon: ({ color }) => <TabGlyph glyph="◉" color={color} />,
        }}
      />
      <Tabs.Screen
        name="habits"
        options={{
          title: "Habits",
          tabBarIcon: ({ color }) => <TabGlyph glyph="≣" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <TabGlyph glyph="⚙" color={color} />,
        }}
      />{" "}
    </Tabs>
  );
}

function TabGlyph({
  glyph,
  color,
}: {
  glyph: string;
  color: import("react-native").ColorValue;
}) {
  return <Text style={{ color, fontSize: 18 }}>{glyph}</Text>;
}
