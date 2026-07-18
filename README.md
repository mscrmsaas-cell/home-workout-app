# 居家锻炼

> 专为家庭环境设计的智能健身伴侣，基于 Apple Design + Emil Kowalski 设计工程规范，针对三星 S25 Ultra 大屏高刷设备优化。

![Design](https://img.shields.io/badge/Design-Apple%20HIG%20%2B%20Emil%20Kowalski-blue)
![Platform](https://img.shields.io/badge/Platform-Android%2014%2B-green)
![Device](https://img.shields.io/badge/Device-S25%20Ultra%20Optimized-orange)
![Framework](https://img.shields.io/badge/Framework-React%20Native%20%2B%20Expo-61dafb)

## 功能特性

- **5套预设训练计划**：全身燃脂、核心强化、上肢塑形、下肢力量、有氧燃脂
- **智能锻炼流程**：3-2-1倒计时 → 动作指导 → 休息间隔 → 完成庆祝
- **数据追踪**：连续天数、周历热力图、历史记录
- **深色模式**：全自动/跟随系统/独立切换
- **无障碍支持**：减少动态效果、大字体适配
- **三星S25 Ultra优化**：120Hz流畅动画、6.9英寸大屏适配

## 设计亮点

- 按压反馈：`scale(0.97)` + 160ms `ease-out`
- 频率适配动画：高频无动画、低频标准动画、罕见场景庆祝动画
- 仅使用GPU属性（transform/opacity）做动画
- 自定义缓动曲线：`cubic-bezier(0.23, 1, 0.32, 1)`

## 快速构建APK

```bash
# 1. 安装依赖
npm install

# 2. 登录Expo（需注册免费账号）
npx eas-cli login

# 3. 构建APK（云端构建，无需本地Android环境）
npx eas-cli build -p android --profile preview
```

详见 [BUILD.md](./BUILD.md)

## 项目结构

```
src/
├── components/     # Button, Timer, WorkoutCard（可复用组件）
├── screens/        # Home, Workout, Stats, Profile（页面）
├── context/        # ThemeContext（主题/深色模式/减少动画）
├── data/           # 5套训练计划数据
└── utils/          # constants, types, storage

documents/          # 设计系统文档 + PRD
scripts/            # LOOPS 迭代测试框架
```

## LOOPS 测试

```bash
node scripts/loops.js
```

5轮自动化检查：代码静态检查、Emil Kowalski设计合规、Apple HIG合规、数据完整性、构建预检。

## 技术栈

- React Native 0.76 + Expo SDK 52
- React Navigation 6 (Stack + Bottom Tabs)
- AsyncStorage 本地持久化
- TypeScript
- EAS Build (APK生成)

## 许可证

MIT
