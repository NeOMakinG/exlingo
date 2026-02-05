import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useStore } from '../src/store/useStore';
import { colors } from '../src/constants/theme';

export default function Index() {
  const hasCompletedOnboarding = useStore((s) => s.hasCompletedOnboarding);
  const user = useStore((s) => s.user);

  useEffect(() => {
    // Small delay to ensure store is hydrated
    const timer = setTimeout(() => {
      if (!hasCompletedOnboarding) {
        router.replace('/onboarding');
      } else {
        router.replace('/(tabs)/sentences');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [hasCompletedOnboarding, user]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
