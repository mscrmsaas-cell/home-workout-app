import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Colors, Typography, Spacing, Durations, Easing } from '../utils/constants';
import { Timer } from '../components/Timer';
import { StorageService } from '../utils/storage';
import { WorkoutRecord } from '../utils/types';

const { width, height } = Dimensions.get('window');

interface WorkoutScreenProps {
  route: { params: { plan: any } };
  navigation: any;
}

export function WorkoutScreen({ route, navigation }: WorkoutScreenProps) {
  const { plan } = route.params;
  const { isDark, reduceMotion, settings } = useTheme();
  const themeColors = isDark ? Colors.dark : Colors.light;

  const [phase, setPhase] = useState<'preparing' | 'active' | 'rest' | 'completed'>('preparing');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [remaining, setRemaining] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const [skipped, setSkipped] = useState<string[]>([]);
  const [totalTime, setTotalTime] = useState(0);
  const startTimeRef = useRef(Date.now());

  // 动画值
  const slideAnim = useRef(new Animated.Value(0)).current;
  const checkScale = useRef(new Animated.Value(0)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;

  const currentExercise = plan.exercises[currentIndex];
  const isLast = currentIndex === plan.exercises.length - 1;
  const progress = (currentIndex + (phase === 'active' ? 0 : 1)) / plan.exercises.length;

  // 计时器逻辑
  useEffect(() => {
    if (isPaused || phase === 'completed') return;

    const timer = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          handlePhaseEnd();
          return prev;
        }
        return prev - 1;
      });
      setTotalTime(t => t + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, phase, currentIndex]);

  const handlePhaseEnd = useCallback(() => {
    if (phase === 'preparing') {
      setPhase('active');
      setRemaining(currentExercise.duration);
    } else if (phase === 'active') {
      if (isLast) {
        setPhase('completed');
        saveRecord();
      } else {
        setPhase('rest');
        setRemaining(settings.restDuration);
      }
    } else if (phase === 'rest') {
      setCurrentIndex(i => i + 1);
      setPhase('active');
      setRemaining(plan.exercises[currentIndex + 1].duration);
    }
  }, [phase, currentIndex, isLast, currentExercise, settings.restDuration, plan.exercises]);

  const saveRecord = async () => {
    const record: WorkoutRecord = {
      id: Date.now().toString(),
      planId: plan.id,
      planName: plan.name,
      completedAt: new Date().toISOString(),
      duration: Math.floor((Date.now() - startTimeRef.current) / 1000),
      exercisesCompleted: plan.exercises.length - skipped.length,
      totalExercises: plan.exercises.length,
      caloriesBurned: Math.floor(plan.calories * (1 - skipped.length / plan.exercises.length)),
      skippedExercises: skipped,
    };
    await StorageService.addRecord(record);

    // 完成庆祝动画
    if (!reduceMotion) {
      Animated.spring(checkScale, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }).start();
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 600,
        delay: 300,
        useNativeDriver: true,
      }).start();
    } else {
      checkScale.setValue(1);
      fadeIn.setValue(1);
    }
  };

  const handleSkip = () => {
    if (phase !== 'active') return;
    setSkipped(s => [...s, currentExercise.id]);
    handlePhaseEnd();
  };

  const handlePauseToggle = () => setIsPaused(p => !p);

  const handleQuit = () => {
    // 保存部分记录
    navigation.goBack();
  };

  // 阶段背景色
  const getBgColor = () => {
    if (phase === 'preparing') return isDark ? '#1C1C1E' : '#F2F2F7';
    if (phase === 'rest') return isDark ? '#1a1a2e' : '#e8e8ff';
    if (phase === 'completed') return isDark ? '#0a1f0a' : '#e8f5e9';
    return themeColors.background;
  };

  // 阶段色
  const phaseColor = phase === 'rest' ? Colors.indigo : phase === 'completed' ? Colors.success : Colors.primary;

  if (phase === 'completed') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: getBgColor() }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <View style={styles.completedContainer}>
          <Animated.View style={{ transform: [{ scale: checkScale }] }}>
            <View style={[styles.checkCircle, { backgroundColor: Colors.success }]}>
              <Text style={styles.checkMark}>✓</Text>
            </View>
          </Animated.View>

          <Animated.View style={{ opacity: fadeIn }}>
            <Text style={[styles.completedTitle, { color: themeColors.textPrimary }]}>
              训练完成！
            </Text>
            <Text style={[styles.completedSubtitle, { color: themeColors.textSecondary }]}>
              你太棒了！坚持就是胜利
            </Text>

            <View style={styles.statsRow}>
              <View style={[styles.statBox, { backgroundColor: themeColors.card }]}>
                <Text style={[styles.statValue, { color: Colors.primary }]}>
                  {Math.floor(totalTime / 60)}:{(totalTime % 60).toString().padStart(2, '0')}
                </Text>
                <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>用时</Text>
              </View>
              <View style={[styles.statBox, { backgroundColor: themeColors.card }]}>
                <Text style={[styles.statValue, { color: Colors.success }]}>
                  {plan.exercises.length - skipped.length}
                </Text>
                <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>完成</Text>
              </View>
              <View style={[styles.statBox, { backgroundColor: themeColors.card }]}>
                <Text style={[styles.statValue, { color: Colors.warning }]}>
                  {Math.floor(plan.calories * (1 - skipped.length / plan.exercises.length))}
                </Text>
                <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>千卡</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.doneButton, { backgroundColor: Colors.primary }]}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.doneButtonText}>返回首页</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: getBgColor() }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* 顶部进度和关闭 */}
      <View style={styles.topBar}>
        <View style={[styles.progressTrack, { backgroundColor: themeColors.separator }]}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${progress * 100}%`,
                backgroundColor: phaseColor,
              },
            ]}
          />
        </View>
        <TouchableOpacity onPress={handleQuit} hitSlop={{ top: 8, left: 8, bottom: 8, right: 8 }}>
          <Text style={[styles.closeButton, { color: themeColors.textSecondary }]}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* 主内容 */}
      <View style={styles.mainContent}>
        {phase === 'preparing' ? (
          <>
            <Text style={[styles.preparingLabel, { color: themeColors.textSecondary }]}>
              准备开始
            </Text>
            <Text style={[styles.preparingTitle, { color: themeColors.textPrimary }]}>
              {plan.name}
            </Text>
            <Timer seconds={remaining} totalSeconds={3} size={220} color={phaseColor} />
            <Text style={[styles.preparingHint, { color: themeColors.textSecondary }]}>
              找好位置，调整呼吸
            </Text>
          </>
        ) : phase === 'rest' ? (
          <>
            <Text style={[styles.restLabel, { color: Colors.indigo }]}>休息中</Text>
            <Timer seconds={remaining} totalSeconds={settings.restDuration} size={180} color={Colors.indigo} />

            {/* 呼吸指示 */}
            {!reduceMotion && (
              <View style={styles.breathContainer}>
                <Animated.View
                  style={[
                    styles.breathCircle,
                    {
                      backgroundColor: Colors.indigo + '20',
                      transform: [
                        {
                          scale: new Animated.Value(1).interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 1.08],
                          }),
                        },
                      ],
                    },
                  ]}
                />
                <Text style={[styles.breathText, { color: Colors.indigo }]}>深呼吸放松</Text>
              </View>
            )}

            {/* 下一项预览 */}
            <View style={[styles.nextPreview, { backgroundColor: themeColors.card }]}>
              <Text style={[styles.nextLabel, { color: themeColors.textSecondary }]}>下一个</Text>
              <Text style={[styles.nextName, { color: themeColors.textPrimary }]}>
                {plan.exercises[currentIndex + 1]?.name}
              </Text>
              <Text style={[styles.nextDuration, { color: themeColors.textSecondary }]}>
                {plan.exercises[currentIndex + 1]?.duration}秒
              </Text>
            </View>
          </>
        ) : (
          <>
            {/* 动作名称 */}
            <Text style={[styles.exerciseNumber, { color: themeColors.textSecondary }]}>
              动作 {currentIndex + 1} / {plan.exercises.length}
            </Text>
            <Text style={[styles.exerciseName, { color: themeColors.textPrimary }]}>
              {currentExercise.name}
            </Text>

            {/* 示意图占位 */}
            <View
              style={[
                styles.exerciseVisual,
                { backgroundColor: currentExercise.imagePlaceholder + '30' },
              ]}
            >
              <Text style={{ fontSize: 80 }}>
                {currentExercise.category === 'warmup' && '🔥'}
                {currentExercise.category === 'cooldown' && '🧘'}
                {currentExercise.category === 'core' && '🎯'}
                {currentExercise.category === 'upper' && '💪'}
                {currentExercise.category === 'lower' && '🦵'}
                {currentExercise.category === 'cardio' && '❤️'}
              </Text>
            </View>

            {/* 描述 */}
            <Text style={[styles.exerciseDesc, { color: themeColors.textSecondary }]}>
              {currentExercise.description}
            </Text>

            {/* 计时器 */}
            <Timer
              seconds={remaining}
              totalSeconds={currentExercise.duration}
              size={160}
              color={phaseColor}
            />
          </>
        )}
      </View>

      {/* 底部控制 */}
      <View style={styles.controls}>
        {phase === 'active' && (
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: themeColors.card }]
            onPress={handleSkip}
          >
            <Text style={[styles.controlText, { color: themeColors.textSecondary }]}>跳过</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.mainControl,
            {
              backgroundColor: isPaused ? Colors.success : phaseColor,
            },
          ]}
          onPress={handlePauseToggle}
        >
          <Text style={styles.mainControlText}>
            {isPaused ? '▶ 继续' : '⏸ 暂停'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  closeButton: {
    fontSize: 20,
    fontWeight: '600',
    padding: Spacing.sm,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
  },
  preparingLabel: {
    ...Typography.title2,
    marginBottom: Spacing.sm,
  },
  preparingTitle: {
    ...Typography.largeTitle,
    marginBottom: Spacing.lg,
  },
  preparingHint: {
    ...Typography.callout,
    marginTop: Spacing.lg,
  },
  exerciseNumber: {
    ...Typography.footnote,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
  },
  exerciseName: {
    ...Typography.title1,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  exerciseVisual: {
    width: 180,
    height: 180,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  exerciseDesc: {
    ...Typography.callout,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.xl,
  },
  restLabel: {
    ...Typography.title1,
    marginBottom: Spacing.lg,
  },
  breathContainer: {
    marginTop: Spacing.lg,
    alignItems: 'center',
  },
  breathCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    position: 'absolute',
  },
  breathText: {
    ...Typography.callout,
    marginTop: 90,
  },
  nextPreview: {
    marginTop: Spacing.xl,
    padding: Spacing.md,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
  },
  nextLabel: {
    ...Typography.footnote,
    marginBottom: 4,
  },
  nextName: {
    ...Typography.title3,
    marginBottom: 4,
  },
  nextDuration: {
    ...Typography.callout,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
    paddingBottom: Spacing.lg,
    gap: Spacing.md,
  },
  controlButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
  },
  controlText: {
    fontSize: 15,
    fontWeight: '600',
  },
  mainControl: {
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 16,
    minWidth: 160,
    alignItems: 'center',
  },
  mainControlText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  // 完成界面
  completedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  checkCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  checkMark: {
    color: '#FFFFFF',
    fontSize: 50,
    fontWeight: '700',
  },
  completedTitle: {
    ...Typography.largeTitle,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  completedSubtitle: {
    ...Typography.body,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  statBox: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
  },
  doneButton: {
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 200,
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});