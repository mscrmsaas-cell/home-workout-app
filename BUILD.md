# 居家锻炼APK - 构建指南

## 项目概述

基于 **React Native + Expo** 构建的居家锻炼应用，采用 **Apple Design + Emil Kowalski 设计工程**规范。

- **目标设备**: 三星 S25 Ultra (6.9英寸, 120Hz)
- **系统要求**: Android 14+
- **设计规范**: 详见 `documents/design-system.md`
- **产品需求**: 详见 `documents/PRD.md`

---

## 快速开始

### 环境要求

- Node.js 18+
- npm 9+
- [EAS CLI](https://docs.expo.dev/eas/) (用于云端构建APK)
- (可选) Android Studio + SDK (用于本地构建)

### 安装依赖

```bash
cd home-workout-app
npm install
```

### 开发模式运行

```bash
npx expo start
# 按 'a' 在Android模拟器/设备上运行
```

---

## 构建APK (推荐方式：EAS Build)

[EAS Build](https://docs.expo.dev/build/introduction/) 是Expo官方云端构建服务，无需配置本地Android环境即可生成APK。

### 步骤1: 安装 EAS CLI

```bash
npm install -g eas-cli
```

### 步骤2: 登录Expo账号

```bash
eas login
```

> 如果没有Expo账号，先访问 https://expo.dev/signup 注册免费账号。

### 步骤3: 配置项目 (已预配置)

项目已包含 `eas.json` 配置：

```json
{
  "build": {
    "preview": {
      "distribution": "internal",
      "android": { "buildType": "apk" }
    }
  }
}
```

### 步骤4: 构建APK

```bash
cd home-workout-app
eas build -p android --profile preview
```

构建完成后，EAS会提供下载链接。APK可以直接安装在三星S25 Ultra上。

### 构建输出

- 格式: `.apk` (非AAB，直接安装)
- 签名: 使用Expo开发密钥（生产发布需配置自己的keystore）
- 下载: 通过终端链接或 https://expo.dev/accounts/[your-account]/projects/[project-name]/builds

---

## 本地构建 (需要Android SDK)

如需本地构建，需要配置完整的Android开发环境：

### 环境配置

1. 安装 [Android Studio](https://developer.android.com/studio)
2. 安装 SDK Platform (Android 14)
3. 配置 `ANDROID_HOME` 环境变量
4. 确认 Java 17+ 可用

### 本地构建步骤

```bash
# 1. 预生成Android项目
cd home-workout-app
npx expo prebuild --platform android

# 2. 进入Android目录
cd android

# 3. 构建Release APK
./gradlew assembleRelease

# 4. APK输出路径
# android/app/build/outputs/apk/release/app-release-unsigned.apk
```

> 注意：本地构建需要自行配置签名密钥（keystore）。

---

## 项目结构

```
home-workout-app/
├── .github/workflows/build.yml    # GitHub Actions CI/CD (自动构建)
├── scripts/loops.js               # LOOPS 迭代测试框架
├── documents/
│   ├── design-system.md           # Apple Design + Emil Kowalski 设计系统
│   └── PRD.md                     # 产品需求文档
├── src/
│   ├── components/                # 可复用组件
│   │   ├── Button.tsx             # 主按钮（按压反馈动画）
│   │   ├── Timer.tsx              # 大字体倒计时器
│   │   └── WorkoutCard.tsx        # 锻炼计划卡片
│   ├── screens/                   # 页面屏幕
│   │   ├── HomeScreen.tsx         # 首页浏览
│   │   ├── WorkoutScreen.tsx      # 锻炼执行流程
│   │   ├── StatsScreen.tsx        # 数据统计
│   │   └── ProfileScreen.tsx      # 个人设置
│   ├── context/
│   │   └── ThemeContext.tsx       # 主题/深色模式/减少动画
│   ├── data/
│   │   └── workouts.ts            # 5套预设训练计划
│   ├── utils/
│   │   ├── constants.ts           # 设计令牌（颜色/字体/间距/动画）
│   │   ├── types.ts               # TypeScript类型定义
│   │   └── storage.ts             # AsyncStorage 数据持久化
│   └── assets/                    # 图片资源
├── App.tsx                        # 主入口（导航配置）
├── app.json                       # Expo配置
├── package.json                   # 依赖列表
├── eas.json                       # EAS Build配置
├── babel.config.js                # Babel配置
└── tsconfig.json                  # TypeScript配置
```

---

## 核心功能

### 锻炼计划
- 5套预设训练：全身燃脂、核心强化、上肢塑形、下肢力量、有氧燃脂
- 难度分级：初级/中级/高级
- 分类筛选：全身/上肢/下肢/核心/有氧
- 收藏功能

### 锻炼执行流程
- 3-2-1 准备倒计时
- 大字体动作指导（90px+）
- 实时倒计时 + 进度环
- 动作间休息间隔（可自定义15-60秒）
- 暂停/继续/跳过控制
- 完成庆祝动画

### 数据追踪
- 连续锻炼天数（Streak）
- 周历热力图
- 总次数/总时长/总卡路里
- 历史记录列表

### 个性化设置
- 深色/浅色/跟随系统模式
- 减少动态效果（无障碍支持）
- 休息时长偏好
- 音效/语音播报开关
- 周目标设置

---

## 设计亮点

### Emil Kowalski 动画规范
- **按压反馈**: `transform: scale(0.97)` + `transition: 160ms ease-out`
- **缓动曲线**: 使用 `cubic-bezier(0.23, 1, 0.32, 1)` 代替默认ease-out
- **频率适配**: 高频操作无动画，低频操作标准动画，罕见操作可庆祝
- **可中断性**: 所有动画使用CSS transitions，支持中途反向操作
- **物理正确性**: 从不从 `scale(0)` 开始，禁用布局属性动画
- **非对称时长**: 进入可慢，退出必须快（系统响应）

### Apple Design 风格
- 系统色彩：#007AFF 主色、#34C759 成功、#FF9500 警告
- 字体层级：34px大标题 → 28px标题 → 17px正文 → 13px脚注
- 间距系统：4dp基准单位（8/16/24/32/48）
- 圆角规范：12px输入框 → 16px按钮 → 20px卡片 → 24px统计卡片
- 深色模式：纯黑背景 + 深灰卡片 + 白色文字
- 最小触控区域：44px（标准）/ 56px（主按钮）

### 三星S25 Ultra适配
- 内容最大宽度限制440px，居中显示
- 底部安全区域抬高24px（手势导航）
- 120Hz刷新率支持：动画时长优化为120fps帧数
- 6.9英寸大屏双列布局（横屏）

---

## 测试框架 (LOOPS)

```bash
node scripts/loops.js
```

自动执行5轮检查：
1. **静态代码检查** - 文件完整性、语法平衡、依赖声明
2. **Emil Kowalski 设计合规** - 缓动曲线、GPU-only动画、scale(0)禁用、频率适配
3. **Apple HIG 合规** - 触控区域、SafeAreaView、系统权限
4. **数据完整性** - 计划数据、类型定义、存储服务
5. **构建预检** - 依赖完整性、图标配置、EAS设置

---

## GitHub Actions 自动构建

项目已配置 `.github/workflows/build.yml`，推送代码时自动：
1. 运行LOOPS测试
2. 提交EAS Build云端构建APK
3. 无需本地Android环境

配置方式：
1. 在GitHub仓库设置中添加 `EXPO_TOKEN` Secret
2. 获取Token: `eas login` → `eas access-token:generate`
3. 推送代码到main分支，自动触发构建

---

## 常见问题

### Q: 为什么APK需要EAS Build而不是直接本地构建？
A: React Native/Expo应用需要Android SDK和原生工具链。EAS Build在云端提供完整环境，无需本地配置。

### Q: 安装后图标显示异常？
A: 当前使用占位图标。生产前请替换 `src/assets/` 下的icon.png/splash.png为真实设计资源（1024x1024）。

### Q: 如何添加自定义训练计划？
A: 编辑 `src/data/workouts.ts`，按照 `WorkoutPlan` 接口格式添加新计划。

### Q: 数据存储在哪里？
A: 使用 React Native AsyncStorage 本地存储，所有数据保存在设备本地，不上传云端。

### Q: 支持横屏吗？
A: 当前锁定为portrait。如需横屏，修改 `app.json` 中的 `orientation` 为 `default`。

---

## 版本历史

### v1.0.0
- 初始版本，包含5套训练计划
- 完整的锻炼执行流程（准备→执行→休息→完成）
- 数据统计与周历热力图
- 深色模式 + 减少动态效果（无障碍）
- LOOPS 迭代测试框架

---

## 许可证

MIT License - 可自由修改和分发。

---
**构建支持**: 如遇构建问题，请检查 `scripts/loops.js` 输出，或查看EAS Build日志 https://expo.dev/builds

**三星S25 Ultra 优化备注**: 本项目针对大屏高刷设备优化，使用GPU-only动画属性（transform/opacity），确保120Hz刷新率下流畅运行。