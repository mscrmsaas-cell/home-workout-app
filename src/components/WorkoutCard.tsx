import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Colors, Radius, Typography, Spacing } from '../utils/constants';
import { WorkoutPlan } from '../utils/types';
import { categoryLabels, difficultyLabels, difficultyColors } from '../data/workouts';

interface WorkoutCardProps {
  plan: WorkoutPlan;
  onPress: () => void;
  onToggleFavorite: () => void;
}

export function WorkoutCard({ plan, onPress, onToggleFavorite }: WorkoutCardProps) {
  const { isDark, appState } = useTheme();
  const isFav = appState.favorites.includes(plan.id);
  const themeColors = isDark ? Colors.dark : Colors.light;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: themeColors.card,
          shadowColor: isDark ? 'transparent' : '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: isDark ? 0 : 0.08,
          shadowRadius: 20,
          elevation: isDark ? 0 : 4,
        },
      ]}
    >
      {/* 封面色块 */}
      <View style={[styles.cover, { backgroundColor: plan.imageColor }]}>
        <View style={styles.coverOverlay}>
          <Text style={styles.coverEmoji}>
            {plan.category === 'full' && '🔥'}
            {plan.category === 'upper' && '💪'}
            {plan.category === 'lower' && '🦵'}
            {plan.category === 'core' && '🎯'}
            {plan.category === 'cardio' && '❤️'}
          </Text>
        </View>
        {/* 收藏按钮 */}
        <TouchableOpacity
          style={styles.favButton}
          onPress={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          hitSlop={{ top: 8, left: 8, bottom: 8, right: 8 }}
        >
          <Text style={{ fontSize: 22 }}>
            {isFav ? '★' : '☆'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 内容 */}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: themeColors.textPrimary }]} numberOfLines={1}>
            {plan.name}
          </Text>
        </View>

        <View style={styles.tags}>
          <View style={[styles.tag, { backgroundColor: difficultyColors[plan.difficulty] + '20' }]}>
            <Text style={[styles.tagText, { color: difficultyColors[plan.difficulty] }]}>
              {difficultyLabels[plan.difficulty]}
            </Text>
          </View>
          <View style={[styles.tag, { backgroundColor: themeColors.inputBg }]}>
            <Text style={[styles.tagText, { color: themeColors.textSecondary }]}>
              {categoryLabels[plan.category]}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.meta, { color: themeColors.textSecondary }]}>
            ⏱ {plan.duration}分钟 · 🔥 {plan.calories}千卡 · {plan.exercises.length}个动作
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.xl,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  cover: {
    height: 120,
    position: 'relative',
  },
  coverOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  coverEmoji: {
    fontSize: 48,
  },
  favButton: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  title: {
    ...Typography.title3,
    flex: 1,
  },
  tags: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    marginRight: Spacing.sm,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    marginTop: Spacing.xs,
  },
  meta: {
    fontSize: 13,
    letterSpacing: -0.1,
  },
});
