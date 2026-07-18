import React, { useRef, useCallback } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Colors, Typography, Radius, TouchTarget, Durations } from '../utils/constants';

interface ButtonProps {
  title: string;
  onPress: (e: GestureResponderEvent) => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'default' | 'small';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'default',
  disabled = false,
  style,
  textStyle,
  icon,
}: ButtonProps) {
  const { isDark, reduceMotion } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    if (!reduceMotion) {
      Animated.timing(scaleAnim, {
        toValue: 0.97,
        duration: Durations.buttonPress,
        useNativeDriver: true,
      }).start();
    }
  }, [reduceMotion, scaleAnim]);

  const handlePressOut = useCallback(() => {
    if (!reduceMotion) {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: Durations.buttonPress,
        useNativeDriver: true,
      }).start();
    }
  }, [reduceMotion, scaleAnim]);

  const getBackgroundColor = () => {
    if (disabled) return isDark ? '#2C2C2E' : '#E5E5EA';
    switch (variant) {
      case 'primary': return Colors.primary;
      case 'secondary': return isDark ? '#1C1C1E' : '#F2F2F7';
      case 'ghost': return 'transparent';
      case 'danger': return Colors.danger;
      default: return Colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return Colors.light.textSecondary;
    switch (variant) {
      case 'primary': return '#FFFFFF';
      case 'secondary': return Colors.primary;
      case 'ghost': return Colors.primary;
      case 'danger': return '#FFFFFF';
      default: return '#FFFFFF';
    }
  };

  const height = size === 'default' ? TouchTarget.primary : TouchTarget.min;
  const fontSize = size === 'default' ? 17 : 15;

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }], width: '100%' }}>
      <TouchableOpacity
        activeOpacity={reduceMotion ? 0.8 : 1}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={[
          styles.button,
          {
            height,
            backgroundColor: getBackgroundColor(),
            borderRadius: Radius.lg,
          },
          style,
        ]}
      >
        {icon}
        <Text
          style={[
            styles.text,
            {
              color: getTextColor(),
              fontSize,
              marginLeft: icon ? 8 : 0,
            },
            textStyle,
          ]}
        >
          {title}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  text: {
    fontWeight: '600',
    letterSpacing: -0.2,
  },
});
