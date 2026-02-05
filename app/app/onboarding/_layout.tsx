import { Stack } from 'expo-router';
import { colors } from '../../src/constants/theme';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="philosophy" />
      <Stack.Screen name="method" />
      <Stack.Screen name="language" />
      <Stack.Screen name="ready" />
    </Stack>
  );
}
