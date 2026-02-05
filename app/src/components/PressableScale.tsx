import React from 'react';
import { Pressable, PressableProps, ViewStyle, StyleProp } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PressableScaleProps extends Omit<PressableProps, 'style'> {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  scaleValue?: number;
  opacityValue?: number;
}

export function PressableScale({
  children,
  style,
  scaleValue = 0.97,
  opacityValue = 0.9,
  disabled,
  ...props
}: PressableScaleProps) {
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(pressed.value, [0, 1], [1, scaleValue]),
        },
      ],
      opacity: interpolate(pressed.value, [0, 1], [1, opacityValue]),
    };
  });

  const handlePressIn = () => {
    if (!disabled) {
      pressed.value = withSpring(1, { damping: 20, stiffness: 400 });
    }
  };

  const handlePressOut = () => {
    pressed.value = withSpring(0, { damping: 20, stiffness: 400 });
  };

  return (
    <AnimatedPressable
      {...props}
      disabled={disabled}
      onPressIn={(e) => {
        handlePressIn();
        props.onPressIn?.(e);
      }}
      onPressOut={(e) => {
        handlePressOut();
        props.onPressOut?.(e);
      }}
      style={[animatedStyle, style]}
    >
      {children}
    </AnimatedPressable>
  );
}
