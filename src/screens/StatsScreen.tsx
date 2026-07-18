import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Colors, Typography, Spacing, Radius } from '../utils/constants';
import { StorageService } from '../utils/storage';

interface WeeklyStat {
  day: string;
  minutes: number;
}

export function StatsScreen() {
  const { isDark, appState } = useTheme();
  const themeColors = isDark ? Colors.dark : Colors.light;
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStat[]>([]);
  const [totalStats, setTotalStats] = useState({ totalWorkouts: 0, totalMinutes: 0, totalCalories: 0 });

  useEffect(() => {
    loadStats();
  }, [appState.records]);

  const loadStats = async () => {
    const weekly = await StorageService.getWeeklyStats();
    const total = await StorageService.getTotalStats();
    setWeeklyStats(weekly);
    setTotalStats(total);
  };

  const weekMax = Math.max(...weeklyStats.map(s => s.minutes), 1);
  const dayNames = ['日', '一', '二', '三', '四', '五', '六'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={[styles.title, { color: themeColors.textPrimary }]}>运动统计</Text>

        {/* 概览卡片 */}
        <View style={styles.overviewGrid}>
          <View style={[styles.overviewCard, { backgroundColor: themeColors.card }]
            <Text style={[styles.overviewValue, { color: Colors.primary }]}>{totalStats.totalWorkouts}</Text>
            <Text style={[styles.overviewLabel, { color: themeColors.textSecondary }]}>总次数</Text>
          </View>
          <View style={[styles.overviewCard, { backgroundColor: themeColors.card }]}>
            <Text style={[styles.overviewValue, { color: Colors.success }]}>{totalStats.totalMinutes}</Text>
            <Text style={[styles.overviewLabel, { color: themeColors.textSecondary }]}>总分钟</Text>
          </View>
          <View style={[styles.overviewCard, { backgroundColor: themeColors.card }]}>
            <Text style={[styles.overviewValue, { color: Colors.warning }]}>{totalStats.totalCalories}</Text>
            <Text style={[styles.overviewLabel, { color: themeColors.textSecondary }]}>总千卡</Text>
          </View>
        </View>

        {/* 连续天数 */}
        <View style={[styles.streakCard, { backgroundColor: Colors.warning + '15' }]}>
          <Text style={styles.streakEmoji}>🔥</Text>
          <View>
            <Text style={[styles.streakValue, { color: themeColors.textPrimary }]}>
              {appState.currentStreak} 天
            </Text>
            <Text style={[styles.streakLabel, { color: themeColors.textSecondary }]}>连续锻炼</Text>
          </View>
        </View>

        {/* 周历热力图 */}
        <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>本周活动</Text>
        <View style={[styles.heatmap, { backgroundColor: themeColors.card }]}>
          {weeklyStats.map((stat, i) => {
            const intensity = stat.minutes / weekMax;
            const opacity = intensity > 0 ? 0.3 + intensity * 0.7 : 0.1;
            return (
              <View key={i} style={styles.heatmapItem}>
                <View
                  style={[
                    styles.heatmapBar,
                    {
                      height: Math.max(8, intensity * 100),
                      backgroundColor:
                        stat.minutes > 0 ? Colors.success : themeColors.skeleton,
                      opacity: stat.minutes > 0 ? opacity : 0.3,
                    },
                  ]}
                />
                <Text style={[styles.heatmapDay, { color: themeColors.textSecondary }]}>
                  {dayNames[i]}
                </Text>
                <Text style={[styles.heatmapMin, { color: themeColors.textPrimary }]}>
                  {stat.minutes}</Text>
              </View>
            );
          })}
        </View>

        {/* 最近记录 */}
        <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>最近记录</Text>
        {appState.records.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: themeColors.card }]}>
            <Text style={styles.emptyEmoji}>🏃</Text>
            <Text style={[styles.emptyText, { color: themeColors.textSecondary }]}>还没有锻炼记录，开始你的第一次训练吧！</Text>
          </View>
        ) : (
          appState.records.slice(0, 10).map((record) => {
            const date = new Date(record.completedAt);
            return (
              <View
                key={record.id}
                style={[styles.recordCard, { backgroundColor: themeColors.card }]}
              >
                <View style={styles.recordHeader}>
                  <Text style={[styles.recordName, { color: themeColors.textPrimary }]}>
                    {record.planName}
                  </Text>
                  <Text style={[styles.recordDate, { color: themeColors.textSecondary }]}>
                    {date.getMonth() + 1}/{date.getDate()}
                  </Text>
                </View>
                <View style={styles.recordStats}>
                  <Text style={[styles.recordStat, { color: themeColors.textSecondary }]}>
                    ⏱ {Math.floor(record.duration / 60)}分钟
                  </Text>
                  <Text style={[styles.recordStat, { color: themeColors.textSecondary }]}>
                    🔥 {record.caloriesBurned}千卡
                  </Text>
                  <Text style={[styles.recordStat, { color: themeColors.textSecondary }]}>
                    ✅ {record.exercisesCompleted}/{record.totalExercises}动作
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing['2xl'],
  },
  title: {
    ...Typography.largeTitle,
    marginBottom: Spacing.lg,
  },
  overviewGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  overviewCard: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: Radius.xl,
    alignItems: 'center',
  },
  overviewValue: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  overviewLabel: {
    fontSize: 13,
  },
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: Radius.xl,
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  streakEmoji: {
    fontSize: 40,
  },
  streakValue: {
    fontSize: 22,
    fontWeight: '700',
  },
  streakLabel: {
    fontSize: 15,
  },
  sectionTitle: {
    ...Typography.title2,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  heatmap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderRadius: Radius.xl,
    marginBottom: Spacing.lg,
  },
  heatmapItem: {
    alignItems: 'center',
    flex: 1,
  },
  heatmapBar: {
    width: 24,
    borderRadius: 4,
    marginBottom: 8,
    minHeight: 8,
  },
  heatmapDay: {
    fontSize: 13,
    marginBottom: 2,
  },
  heatmapMin: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyCard: {
    padding: Spacing.xl,
    borderRadius: Radius.xl,
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  emptyText: {
    ...Typography.callout,
    textAlign: 'center',
  },
  recordCard: {
    padding: Spacing.md,
    borderRadius: Radius.xl,
    marginBottom: Spacing.md,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  recordName: {
    ...Typography.title3,
  },
  recordDate: {
    ...Typography.callout,
  },
  recordStats: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  recordStat: {
    ...Typography.footnote,
  },
});

