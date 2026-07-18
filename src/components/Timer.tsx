import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Colors, Typography, Durations } from '../utils/constants';

interface TimerProps {
  seconds: number;
  totalSeconds: number;
  size?: number;
  showProgress?: boolean;
  color?: string;
}

export function Timer({ seconds, totalSeconds, size = 200, showProgress = true, color = Colors.primary }: TimerProps) {
  const { isDark, reduceMotion } = useTheme();
  const themeColors = isDark ? Colors.dark : Colors.light;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // 数字变化时的淡入淡出效果（低频场景，非计时器控制）
  useEffect(() => {
    if (reduceMotion) return;
    fadeAnim.setValue(0.7);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: Durations.numberChange,
      useNativeDriver: true,
    }).start();
  }, [seconds, reduceMotion]);

  const progress = totalSeconds > 0 ? (totalSeconds - seconds) / totalSeconds : 0;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference * (1 - progress);

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const display = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* 进度环 */}
      {showProgress && (
        <View style={[StyleSheet.absoluteFill, { justifyContent: 'center', alignItems: 'center' }]}>
          <View
            style={{
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: strokeWidth,
              borderColor: themeColors.separator,
            }}
          />
          <View
            style={{
              position: 'absolute',
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: strokeWidth,
              borderColor: color,
              borderLeftColor: 'transparent',
              borderBottomColor: progress < 0.25 ? 'transparent' : color,
              borderRightColor: progress < 0.5 ? 'transparent' : color,
              borderTopColor: progress < 0.75 ? 'transparent' : color,
              transform: [{ rotate: '-90deg' }],
            }}
          />
        </View>
      )}

      {/* 时间数字 */}
      <Animated.View style={{ opacity: fadeAnim }}>
        <Text
          style={[
            styles.timerText,
            {
              color: themeColors.textPrimary,
              fontSize: size * 0.28,
              fontVariant: ['tabular-nums'],
            },
          ]}
        >
          {display}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontWeight: '700',
    letterSpacing: -2,
  },
});
