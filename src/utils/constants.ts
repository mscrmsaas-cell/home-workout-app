// 设计系统常量 - 基于 Apple Design + Emil Kowalski 设计工程
// 文档: documents/design-system.md

export const Colors = {
  // 主色板
  primary: '#007AFF',
  success: '#34C759',
  warning: '#FF9500',
  danger: '#FF3B30',
  indigo: '#5856D6',

  // 中性色 - 浅色模式
  light: {
    background: '#F2F2F7',
    card: '#FFFFFF',
    textPrimary: '#000000',
    textSecondary: '#8E8E93',
    separator: 'rgba(120,120,128,0.2)',
    overlay: 'rgba(0,0,0,0.4)',
    skeleton: '#E5E5EA',
    inputBg: '#F2F2F7',
  },

  // 中性色 - 深色模式
  dark: {
    background: '#000000',
    card: '#1C1C1E',
    textPrimary: '#FFFFFF',
    textSecondary: '#8E8E93',
    separator: 'rgba(120,120,128,0.2)',
    overlay: 'rgba(0,0,0,0.7)',
    skeleton: '#2C2C2E',
    inputBg: '#1C1C1E',
  },

  // 功能色
  tintPrimary: '#0A84FF',      // 深色模式主色（更亮）
  tintSuccess: '#30D158',      // 深色模式成功色
  disabled: 'rgba(142,142,147,0.5)',
};

// 缓动曲线 - Emil Kowalski 标准
// CSS变量标记: --ease-out, --ease-in-out, --ease-drawer, --ease-spring
export const Easing = {
  out: [0.23, 1, 0.32, 1],           // 元素进出 - strong ease-out
  inOut: [0.77, 0, 0.175, 1],        // 移动/变形
  drawer: [0.32, 0.72, 0, 1],       // 抽屉/底部弹窗
  spring: [0.5, 1.8, 0.3, 0.8],      // 弹性（仅低频）
};

// 动画时长 - 频率适配
export const Durations = {
  buttonPress: 160,        // 按钮按压反馈
  listPress: 200,          // 列表项按压
  popupEnter: 300,         // 弹窗出现
  popupExit: 200,          // 弹窗消失
  pageTransition: 350,     // 页面切换
  drawerOpen: 400,         // 抽屉展开
  drawerClose: 300,        // 抽屉关闭
  numberChange: 300,       // 倒计时数字变化
  completion: 800,         // 完成庆祝（低频，可稍长）
  restBreath: 4000,        // 呼吸动画周期
};

// 间距系统 - 4dp基准
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
};

// 字体规范
export const Typography = {
  largeTitle: { fontSize: 34, fontWeight: '700' as const, lineHeight: 41, letterSpacing: -0.4 },
  title1: { fontSize: 28, fontWeight: '700' as const, lineHeight: 34, letterSpacing: -0.4 },
  title2: { fontSize: 22, fontWeight: '700' as const, lineHeight: 28, letterSpacing: -0.4 },
  title3: { fontSize: 20, fontWeight: '600' as const, lineHeight: 25, letterSpacing: -0.4 },
  body: { fontSize: 17, fontWeight: '400' as const, lineHeight: 22, letterSpacing: -0.4 },
  callout: { fontSize: 15, fontWeight: '400' as const, lineHeight: 20, letterSpacing: -0.2 },
  footnote: { fontSize: 13, fontWeight: '400' as const, lineHeight: 18, letterSpacing: -0.1 },
  timer: { fontSize: 96, fontWeight: '700' as const, lineHeight: 96, letterSpacing: -2, fontVariant: ['tabular-nums'] as const },
};

// 圆角
export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
};

// 阴影（仅浅色模式）
export const Shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  button: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
};

// 触控区域（最小44px，重要按钮56px）
export const TouchTarget = {
  min: 44,
  primary: 56,
};

// 三星S25 Ultra适配
export const Device = {
  screenWidth: 3120,
  screenHeight: 1440,
  diagonal: 6.9,
  refreshRate: 120,
  cornerRadius: 34,
  statusBarHeight: 32,
  homeIndicatorHeight: 24,
  contentMaxWidth: 440, // 大屏内容限制居中
};
