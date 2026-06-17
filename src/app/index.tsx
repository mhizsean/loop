import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ThemedView
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          paddingBottom: insets.bottom + BottomTabInset,
        },
      ]}>
      <ThemedView style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Loop
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
  },
  title: {
    textAlign: 'center',
  },
});
