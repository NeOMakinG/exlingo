import React from 'react';
import {
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PressableScale } from './PressableScale';
import { colors, spacing, fontSize, borderRadius } from '../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  fullWidth?: boolean;
}

const gradientColors: Record<string, [string, string, ...string[]]> = {
  primary: ['#6366f1', '#4f46e5'],
  secondary: ['#27273f', '#1e1e32'],
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  fullWidth = false,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const containerStyles: StyleProp<ViewStyle>[] = [
    styles.container,
    sizeStyles[size].container,
    fullWidth ? styles.fullWidth : undefined,
    isDisabled ? styles.disabled : undefined,
  ];

  const textStyles: StyleProp<TextStyle>[] = [
    styles.text,
    sizeStyles[size].text,
    variant === 'outline' ? styles.outlineText : undefined,
    variant === 'ghost' ? styles.ghostText : undefined,
  ];

  const shadowStyle = Platform.select({
    ios: variant === 'primary' ? {
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    } : undefined,
    android: variant === 'primary' ? { elevation: 6 } : undefined,
  });

  const content = (
    <>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? colors.primary : colors.text}
        />
      ) : (
        <>
          {leftIcon}
          <Text style={[...textStyles, textStyle]}>{title}</Text>
          {rightIcon}
        </>
      )}
    </>
  );

  if (variant === 'outline' || variant === 'ghost') {
    return (
      <PressableScale
        onPress={onPress}
        disabled={isDisabled}
        style={[
          ...containerStyles,
          variant === 'outline' ? styles.outline : undefined,
          variant === 'ghost' ? styles.ghost : undefined,
          style,
        ]}
      >
        {content}
      </PressableScale>
    );
  }

  return (
    <PressableScale
      onPress={onPress}
      disabled={isDisabled}
      style={[...containerStyles, shadowStyle, style]}
    >
      <LinearGradient
        colors={isDisabled ? ['#4a4a5c', '#3a3a4c'] : gradientColors[variant]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.gradient, sizeStyles[size].container]}
      >
        {content}
      </LinearGradient>
    </PressableScale>
  );
}

const sizeStyles = {
  sm: StyleSheet.create({
    container: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
    },
    text: {
      fontSize: fontSize.sm,
    },
  }),
  md: StyleSheet.create({
    container: {
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
    },
    text: {
      fontSize: fontSize.md,
    },
  }),
  lg: StyleSheet.create({
    container: {
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.xl,
    },
    text: {
      fontSize: fontSize.lg,
    },
  }),
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    overflow: 'hidden',
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: borderRadius.md,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    color: colors.text,
    fontWeight: '600',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  outlineText: {
    color: colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  ghostText: {
    color: colors.primary,
  },
});
