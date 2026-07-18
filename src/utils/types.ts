export interface Exercise {
  id: string;
  name: string;
  description: string;
  duration: number;      // 秒，0表示按次数
  reps?: number;         // 次数
  restDuration: number;  // 秒后休息
  category: string;
  imagePlaceholder: string; // 占位符颜色（实际图片使用静态资源）
  tips: string[];
  targetMuscles: string[];
}

export interface WorkoutPlan {
  id: string;
  name: string;
  category: 'full' | 'upper' | 'lower' | 'core' | 'cardio';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;      // 分钟
  calories: number;      // 估算卡路里
  exercises: Exercise[];
  isFavorite: boolean;
  description: string;
  imageColor: string;    // 卡片背景色
}

export interface WorkoutRecord {
  id: string;
  planId: string;
  planName: string;
  completedAt: string;     // ISO日期
  duration: number;      // 实际用时秒
  exercisesCompleted: number;
  totalExercises: number;
  caloriesBurned: number;
  skippedExercises: string[];
}

export interface UserSettings {
  name: string;
  avatar?: string;
  dailyReminder: boolean;
  reminderTime: string;    // HH:mm
  restDuration: number;    // 默认休息秒
  soundEnabled: boolean;
  voiceEnabled: boolean;
  darkMode: 'system' | 'light' | 'dark';
  reduceMotion: boolean;
  weeklyGoal: number;      // 目标次数
}

export interface AppState {
  settings: UserSettings;
  records: WorkoutRecord[];
  favorites: string[];
  currentStreak: number;
  lastWorkoutDate: string | null;
}

export type WorkoutPhase = 'preparing' | 'active' | 'rest' | 'completed' | 'cancelled';

export interface ActiveWorkoutState {
  planId: string;
  currentExerciseIndex: number;
  phase: WorkoutPhase;
  remainingSeconds: number;
  isPaused: boolean;
  skippedExercises: string[];
  startTime: number;
}
