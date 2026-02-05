import React from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  ViewStyle,
  StyleProp,
  Platform,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, borderRadius, spacing } from '../constants/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface GradientCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'subtle';
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

const gradientColors: Record<string, [string, string, ...string[]]> = {
  primary: ['#6366f1', '#4f46e5', '#4338ca'],
  secondary: ['#1e1e32', '#252542', '#2a2a4a'],
  accent: ['#f59e0b', '#d97706', '#b45309'],
  subtle: ['#1a1a2e', '#1e1e32', '#252542'],
};

export function GradientCard({
  children,
  onPress,
  variant = 'subtle',
  style,
  disabled = false,
}: GradientCardProps) {
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(pressed.value, [0, 1], [1, 0.98]),
        },
      ],
      opacity: interpolate(pressed.value, [0, 1], [1, 0.9]),
    };
  });

  const handlePressIn = () => {
    pressed.value = withSpring(1, { damping: 20, stiffness: 400 });
  };

  const handlePressOut = () => {
    pressed.value = withSpring(0, { damping: 20, stiffness: 400 });
  };

  const shadowStyle = Platform.select({
    ios: {
      shadowColor: variant === 'primary' ? colors.primary : '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: variant === 'primary' ? 0.3 : 0.2,
      shadowRadius: 8,
    },
    android: {
      elevation: variant === 'primary' ? 8 : 4,
    },
  });

  if (onPress && !disabled) {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.container, shadowStyle, animatedStyle, style]}
      >
        <LinearGradient
          colors={gradientColors[variant]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {children}
        </LinearGradient>
      </AnimatedPressable>
    );
  }

  return (
    <View style={[styles.container, shadowStyle, style]}>
      <LinearGradient
        colors={gradientColors[variant]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {children}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  gradient: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
});
