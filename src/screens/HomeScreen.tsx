import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Colors, Typography, Spacing, Radius } from '../utils/constants';
import { WorkoutCard } from '../components/WorkoutCard';
import { workoutPlans } from '../data/workouts';
import { useNavigation } from '@react-navigation/native';

const categories = [
  { key: 'all', label: '全部', emoji: '🏋️' },
  { key: 'full', label: '全身', emoji: '🔥' },
  { key: 'upper', label: '上肢', emoji: '💪' },
  { key: 'lower', label: '下肢', emoji: '🦵' },
  { key: 'core', label: '核心', emoji: '🎯' },
  { key: 'cardio', label: '有氧', emoji: '❤️' },
];

export function HomeScreen() {
  const { isDark, appState, toggleFavorite } = useTheme();
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const themeColors = isDark ? Colors.dark : Colors.light;

  const filteredPlans = React.useMemo(() => {
    if (selectedCategory === 'all') return workoutPlans;
    return workoutPlans.filter(p => p.category === selectedCategory);
  }, [selectedCategory]);

  const favorites = workoutPlans.filter(p => appState.favorites.includes(p.id));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 欢迎区域 */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: themeColors.textSecondary }]}>
              你好，{appState.settings.name}
            </Text>
            <Text style={[styles.title, { color: themeColors.textPrimary }]}>
              今天想练什么？
            </Text>
          </View>
          {appState.currentStreak > 0 && (
            <View style={[styles.streakBadge, { backgroundColor: Colors.warning + '20' }]}>
              <Text style={styles.streakText}>🔥 {appState.currentStreak}天</Text>
            </View>
          )}
        </View>

        {/* 分类横向滚动 */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {categories.map(cat => (
            <TouchableOpacity
              key={cat.key}
              onPress={() => setSelectedCategory(cat.key)}
              style={[
                styles.categoryChip,
                {
                  backgroundColor:
                    selectedCategory === cat.key
                      ? Colors.primary
                      : themeColors.card,
                },
              ]}
            >
              <Text style={{ fontSize: 20, marginRight: 6 }}>{cat.emoji}</Text>
              <Text
                style={[
                  styles.categoryLabel,
                  {
                    color:
                      selectedCategory === cat.key
                        ? '#FFFFFF'
                        : themeColors.textPrimary,
                  },
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 收藏的计划 */}
        {favorites.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>
              我的收藏
            </Text>
            {favorites.map(plan => (
              <WorkoutCard
                key={`fav-${plan.id}`}
                plan={plan}
                onPress={() => navigation.navigate('WorkoutDetail', { plan })}
                onToggleFavorite={() => toggleFavorite(plan.id)}
              />
            ))}
          </>
        )}

        {/* 计划列表 */}
        <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>
          {selectedCategory === 'all' ? '推荐训练' : `${categories.find(c => c.key === selectedCategory)?.label}训练`}
        </Text>
        {filteredPlans.map(plan => (
          <WorkoutCard
            key={plan.id}
            plan={plan}
            onPress={() => navigation.navigate('WorkoutDetail', { plan })}
            onToggleFavorite={() => toggleFavorite(plan.id)}
          />
        ))}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  greeting: {
    ...Typography.callout,
    marginBottom: 4,
  },
  title: {
    ...Typography.largeTitle,
  },
  streakBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  streakText: {
    fontSize: 14,
    fontWeight: '600',
  },
  categoryScroll: {
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Radius.full,
    marginRight: Spacing.sm,
  },
  categoryLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  sectionTitle: {
    ...Typography.title2,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
});