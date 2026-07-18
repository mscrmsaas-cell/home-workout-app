# 居家锻炼APP - 产品需求文档（PRD）

## 产品概述

### 电梯演讲
一款专为家庭环境设计的智能健身伴侣，通过科学的训练计划、流畅的动画指导和精确的数据追踪，让每个人都能在客厅获得专业级的锻炼体验。无需器械，利用自重即可完成从热身到放松的完整训练流程。

### 问题陈述
- 健身房昂贵且不便
- 缺乏结构化居家训练方案
- 健身APP交互复杂，学习成本高
- 缺少即时反馈和进度追踪
- 动画生硬，缺乏激励感

### 目标用户
- 18-45岁都市人群
- 有居家锻炼意愿但缺乏指导
- 三星S25 Ultra等大屏手机用户
- 偏好简洁优雅设计的用户

### 独特卖点
- Apple Design级别设计品质 + Android原生性能
- 基于Emil Kowalski设计工程的精细动画
- 自适应难度系统（根据反馈调整）
- 120Hz适配的丝滑交互（S25 Ultra优化）
- 无器械自重训练方案

## 目标平台
- **主要**: Android APK（三星S25 Ultra优先适配）
- **屏幕**: 6.9英寸大屏优化，支持横竖屏
- **系统**: Android 14+
- **性能**: 120Hz刷新率支持，GPU加速动画

## 功能列表

### MVP核心功能（第一版）

#### 1. 锻炼计划浏览
- 分类展示：全身、上肢、下肢、核心、有氧
- 难度标签：初级、中级、高级
- 时长标签：5分钟、10分钟、15分钟、20分钟
- 卡片式浏览，支持收藏
- 搜索和筛选

#### 2. 锻炼执行流程
- 开始准备界面（3-2-1倒计时）
- 当前动作展示：名称、示意图、文字说明
- 计时器：倒计时/正计时切换
- 动作切换：自动/手动
- 休息间隔：自定义时长（默认30秒）
- 暂停/继续/跳过功能
- 进度追踪（X/Y动作完成）

#### 3. 数据与进度
- 锻炼历史记录
- 连续锻炼天数（ streak ）
- 总锻炼时长统计
- 完成计划数量
- 每周锻炼热力图

#### 4. 个人设置
- 用户名与头像
- 每日提醒时间
- 休息时间偏好
- 音效开关
- 语音播报开关
- 深色/浅色模式切换
- 减少动态效果开关

### 未来扩展功能
- 自定义训练计划组合
- 社区挑战
- 体重/体脂记录
- 视频动作指导
- 语音教练
- 与智能手表联动

## 用户故事

### 用户故事1：发现锻炼计划
**作为** 一位想要开始锻炼的用户
**我希望** 打开APP就能看到分类清晰的锻炼计划
**以便** 快速找到适合自己的训练内容

**验收标准**:
- 打开APP即见主页计划列表
- 每个计划显示名称、时长、难度、消耗卡路里
- 点击卡片进入详情预览
- 支持按类别和难度筛选
- 收藏的计划置顶显示

### 用户故事2：执行锻炼
**作为** 正在进行锻炼的用户
**我希望** 有清晰的计时和引导
**以便** 专注完成每个动作

**验收标准**:
- 开始前有准备倒计时（3-2-1）
- 当前动作大字显示名称
- 大字体倒计时（90px+）
- 进度条显示整体完成度
- 支持暂停、继续、跳过
- 休息期间显示下一动作预览
- 完成后显示总结和庆祝动画

### 用户故事3：查看进度
**作为** 坚持锻炼的用户
**我希望** 看到我的锻炼数据
**以便** 保持动力并追踪进步

**验收标准**:
- 统计页显示连续天数
- 本周锻炼次数/时长图表
- 历史记录列表（按日期）
- 里程碑成就徽章
- 数据本地持久化

### 用户故事4：个性化设置
**作为** 有特殊偏好的用户
**我希望** 调整APP的行为和外观
**以便** 获得最舒适的体验

**验收标准**:
- 设置页包含所有偏好选项
- 切换即时生效（无需重启）
- 深色模式跟随系统或独立设置
- 减少动态效果选项对动画全局生效
- 提醒推送可设置时间和开关

## 界面设计

### 页面结构

```
App
├── Tab Navigator
│   ├── Home (首页)
│   │   ├── 今日推荐
│   │   ├── 分类浏览
│   │   └── 收藏列表
│   ├── Explore (探索)
│   │   ├── 全部计划
│   │   ├── 筛选面板
│   │   └── 搜索结果
│   ├── Stats (统计)
│   │   ├── 概览卡片
│   │   ├── 周历热力图
│   │   └── 历史记录
│   └── Profile (设置)
│       ├── 用户信息
│       ├── 偏好设置
│       └── 关于
├── Workout Stack (锻炼流程)
│   ├── PreWorkout (准备页)
│   ├── ActiveWorkout (执行页)
│   ├── RestScreen (休息页)
│   └── Completion (完成页)
└── Exercise Detail (动作详情)
```

### 首页（Home）
- **顶部**: 欢迎语 + 连续天数徽章
- **中间**: 横向滚动分类（今日推荐/全身/上肢/下肢/核心）
- **主体**: 垂直滚动计划卡片列表
- **卡片内容**: 封面图、名称、时长、难度标签、开始按钮
- **底部**: Tab导航

### 锻炼执行页（ActiveWorkout）
- **顶部**: 进度条（整体完成百分比）+ 关闭按钮
- **中间**: 动作名称（大标题）+ 示意图
- **下方**: 倒计时数字（巨大字体，居中）
- **底部**: 控制按钮（暂停/跳过/完成）
- **背景**: 随阶段变化（热身→主训练→放松）

### 统计页（Stats）
- **顶部**: 总时长、总次数、连续天数（三列卡片）
- **中间**: 周历热力图（7天，颜色深浅表示时长）
- **下方**: 最近锻炼记录列表
- **成就**: 徽章横向滚动

### 设置页（Profile）
- **头部**: 用户头像 + 名称 + 编辑按钮
- **列表**: 设置项分组（偏好/通知/外观/关于）
- **开关**: 切换类设置使用Switch组件
- **箭头**: 可进入子页面的项显示右箭头

## UX/UI 注意事项

### 大屏适配（S25 Ultra）
- 内容最大宽度限制（440px），居中显示
- 左右留白避免边缘误触
- 底部控制区域抬高（安全区域+16px）
- 卡片布局使用双列（横屏时）

### 动画策略
- 高频操作（计时器控制）：**无动画**，即时响应
- 中频操作（列表点击）：**微交互**（按压态200ms）
- 低频操作（页面切换）：**标准过渡**（350ms ease-out）
- 罕见操作（完成锻炼）：**庆祝动画**（800ms spring）

### 性能优化
- 图片懒加载和缓存
- 锻炼过程中的背景任务暂停
- 列表虚拟化（超过30项）
- 动画使用requestAnimationFrame
- 减少动态效果模式下禁用所有位移动画

### 离线支持
- 所有锻炼数据本地存储（AsyncStorage）
- 锻炼计划内嵌在APP中（无需网络）
- 图片资源预加载到本地缓存
- 统计图表本地计算

### 错误处理
- 存储空间不足：提示清理并降级图片质量
- 计时器后台运行：使用系统通知提醒
- 意外退出：恢复上次锻炼进度
- 首次使用：引导教程（可跳过）

## 数据模型

### 锻炼计划（WorkoutPlan）
```typescript
interface WorkoutPlan {
  id: string;
  name: string;
  category: 'full' | 'upper' | 'lower' | 'core' | 'cardio';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // 分钟
  calories: number; // 估算卡路里
  exercises: Exercise[];
  isFavorite: boolean;
  createdAt: Date;
}
```

### 动作（Exercise）
```typescript
interface Exercise {
  id: string;
  name: string;
  description: string;
  duration: number; // 秒，0表示按次数
  reps?: number; // 次数
  restDuration: number; // 秒后休息
  category: string;
  imageUrl: string;
  tips: string[];
}
```

### 锻炼记录（WorkoutRecord）
```typescript
interface WorkoutRecord {
  id: string;
  planId: string;
  planName: string;
  completedAt: Date;
  duration: number; // 实际用时秒
  exercisesCompleted: number;
  totalExercises: number;
  caloriesBurned: number;
  skippedExercises: string[];
}
```

### 用户设置（UserSettings）
```typescript
interface UserSettings {
  name: string;
  avatar?: string;
  dailyReminder: boolean;
  reminderTime: string; // HH:mm
  restDuration: number; // 默认休息秒
  soundEnabled: boolean;
  voiceEnabled: boolean;
  darkMode: 'system' | 'light' | 'dark';
  reduceMotion: boolean;
  weeklyGoal: number; // 目标次数
}
```

## 技术栈

- **框架**: React Native + Expo
- **导航**: React Navigation 6 (Native Stack + Bottom Tabs)
- **状态管理**: React Context + useReducer
- **存储**: AsyncStorage（持久化）
- **动画**: React Native Animated + LayoutAnimation
- **样式**: StyleSheet（无CSS-in-JS，性能优先）
- **图标**: @expo/vector-icons (Ionicons)
- **构建**: EAS Build（生成APK）

## 里程碑

### Milestone 1: 基础框架（第1-2天）
- [x] 项目搭建和导航结构
- [x] 设计系统实现（颜色、字体、间距）
- [x] 基础组件库（Button、Card、Switch、ListRow）

### Milestone 2: 首页与浏览（第3-4天）
- [x] 首页UI和计划展示
- [x] 分类筛选功能
- [x] 收藏功能
- [x] 锻炼详情页

### Milestone 3: 锻炼流程（第5-7天）
- [x] 锻炼准备和倒计时
- [x] 动作展示和计时器
- [x] 休息间隔界面
- [x] 完成界面和庆祝动画
- [x] 进度保存

### Milestone 4: 统计与设置（第8-9天）
- [x] 统计页UI和图表
- [x] 历史记录列表
- [x] 设置页和偏好存储
- [x] 深色模式支持

### Milestone 5: 测试与优化（第10-12天）
- [x] 设备测试（S25 Ultra模拟）
- [x] 动画性能优化
- [x] 减少动态效果适配
- [x] 边缘情况处理
- [x] APK构建和签名

### Milestone 6: 迭代（持续）
- [ ] 用户反馈收集
- [ ] 新计划内容添加
- [ ] 性能监控和优化
- [ ] 崩溃日志分析