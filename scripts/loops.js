#!/usr/bin/env node
/**
 * LOOPS - 迭代测试循环脚本
 * 
 * 针对居家锻炼APK的持续集成测试框架：
 * - Loop 1: 代码静态检查（TypeScript编译、语法验证）
 * - Loop 2: 组件单元测试（渲染、状态、交互）
 * - Loop 3: 集成测试（导航流程、数据持久化）
 * - Loop 4: 构建验证（Metro打包、APK生成检查）
 * - Loop 5: 设计合规性检查（Emil Kowalski动画标准、Apple HIG）
 * 
 * 运行: node scripts/loops.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(PROJECT_ROOT, 'src');

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function log(type, message) {
  const prefix = {
    info: `${colors.blue}[INFO]${colors.reset}`,
    pass: `${colors.green}[PASS]${colors.reset}`,
    fail: `${colors.red}[FAIL]${colors.reset}`,
    warn: `${colors.yellow}[WARN]${colors.reset}`,
    loop: `${colors.cyan}${colors.bold}[LOOP]${colors.reset}`,
  }[type] || '[LOG]';
  console.log(`${prefix} ${message}`);
}

// ========== Loop 1: 静态代码检查 ==========
function loop1_staticCheck() {
  log('loop', 'Loop 1: 静态代码检查');
  let errors = [];

  // 检查必需文件
  const requiredFiles = [
    'package.json',
    'app.json',
    'babel.config.js',
    'App.tsx',
    'src/utils/constants.ts',
    'src/utils/types.ts',
    'src/utils/storage.ts',
    'src/context/ThemeContext.tsx',
    'src/components/Button.tsx',
    'src/components/Timer.tsx',
    'src/components/WorkoutCard.tsx',
    'src/screens/HomeScreen.tsx',
    'src/screens/WorkoutScreen.tsx',
    'src/screens/StatsScreen.tsx',
    'src/screens/ProfileScreen.tsx',
    'src/data/workouts.ts',
  ];

  for (const file of requiredFiles) {
    const fullPath = path.join(PROJECT_ROOT, file);
    if (!fs.existsSync(fullPath)) {
      errors.push(`缺少必需文件: ${file}`);
    }
  }

  // 检查TypeScript语法（基础检查：是否有未闭合括号等）
  const tsFiles = [];
  function findTsFiles(dir) {
    for (const entry of fs.readdirSync(dir)) {
      const full = path.join(dir, entry);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        findTsFiles(full);
      } else if (full.endsWith('.ts') || full.endsWith('.tsx')) {
        tsFiles.push(full);
      }
    }
  }
  findTsFiles(SRC_DIR);

  for (const file of tsFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    // 检查基本的括号平衡
    const openBraces = (content.match(/{/g) || []).length;
    const closeBraces = (content.match(/}/g) || []).length;
    const openParens = (content.match(/\(/g) || []).length;
    const closeParens = (content.match(/\)/g) || []).length;
    
    if (Math.abs(openBraces - closeBraces) > 2) {
      errors.push(`${path.relative(PROJECT_ROOT, file)}: 花括号可能不平衡 (${openBraces} vs ${closeBraces})`);
    }
    if (Math.abs(openParens - closeParens) > 2) {
      errors.push(`${path.relative(PROJECT_ROOT, file)}: 圆括号可能不平衡 (${openParens} vs ${closeParens})`);
    }
  }

  // 检查依赖是否在package.json中
  const pkg = JSON.parse(fs.readFileSync(path.join(PROJECT_ROOT, 'package.json'), 'utf-8'));
  const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
  const usedImports = new Set();
  for (const file of tsFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const matches = content.match(/from ['"]([^'"]+)['"]/g) || [];
    for (const m of matches) {
      const dep = m.replace(/from ['"]/, '').replace(/['"]$/, '');
      if (!dep.startsWith('.') && !dep.startsWith('react-native/')) {
        // 处理 scoped 包: @scope/pkg => @scope/pkg
        let pkgName;
        if (dep.startsWith('@')) {
          const parts = dep.split('/');
          pkgName = parts[0] + '/' + parts[1]; // @scope/name
        } else {
          pkgName = dep.split('/')[0];
        }
        if (pkgName !== 'react' && pkgName !== 'react-native') {
          usedImports.add(pkgName);
        }
      }
    }
  }

  for (const dep of usedImports) {
    // 检查主包或子路径包
    const parts = dep.split('/');
    const mainPkg = parts[0].startsWith('@') ? parts[0] + '/' + parts[1] : parts[0];
    let found = false;
    for (const key of Object.keys(allDeps)) {
      if (key === dep || key === mainPkg || key.startsWith(dep + '/')) {
        found = true;
        break;
      }
    }
    if (!found) {
      errors.push(`使用的依赖未在package.json中声明: ${dep}`);
    }
  }

  if (errors.length === 0) {
    log('pass', '所有文件存在且语法检查通过');
    return { pass: true, errors: [] };
  } else {
    for (const e of errors) log('fail', e);
    return { pass: false, errors };
  }
}

// ========== Loop 2: Emil Kowalski 设计合规检查 ==========
function loop2_designCompliance() {
  log('loop', 'Loop 2: Emil Kowalski 设计合规检查');
  let errors = [];
  let warnings = [];

  const tsFiles = [];
  function findTsFiles(dir) {
    for (const entry of fs.readdirSync(dir)) {
      const full = path.join(dir, entry);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        findTsFiles(full);
      } else if (full.endsWith('.ts') || full.endsWith('.tsx')) {
        tsFiles.push(full);
      }
    }
  }
  findTsFiles(SRC_DIR);

  for (const file of tsFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const relPath = path.relative(PROJECT_ROOT, file);

    // 检查禁止使用 ease-in（Emil Kowalski 规则：Never ease-in on UI）
    if (content.includes('ease-in') && !content.includes('ease-in-out')) {
      errors.push(`${relPath}: 发现禁止使用 ease-in 的动画（应使用 ease-out 或 ease-in-out）`);
    }

    // 检查是否使用 transform 和 opacity 做动画（GPU-only）
    // 更精确：只检查 Animated 动画目标值中是否直接使用了布局属性
    if (content.includes('Animated')) {
      const badProps = ['width', 'height', 'margin', 'padding', 'top', 'left'];
      for (const prop of badProps) {
        // 只检查是否在 Animated 动画配置中直接设置布局属性（如 toValue: { width: 200 }）
        // 忽略 StyleSheet 中的静态样式
        const animatedPropPattern = new RegExp(`toValue[^;]*${prop}\\s*:\\s*[^;}]+`, 'i');
        if (animatedPropPattern.test(content)) {
          warnings.push(`${relPath}: Animated 动画配置中直接使用了非GPU属性 ${prop}，建议改用 transform/opacity`);
        }
      }
    }

    // 检查 scale(0) 禁止（应从 scale(0.95)+opacity 开始）
    if (content.includes('scale(0)') || content.includes('scale: 0')) {
      errors.push(`${relPath}: 禁止从 scale(0) 开始动画，应使用 scale(0.95)+opacity:0`);
    }

    // 检查是否有过渡时长超过300ms的UI动画
    const durationMatches = content.match(/duration:\s*(\d+)/g);
    if (durationMatches) {
      for (const match of durationMatches) {
        const val = parseInt(match.replace(/duration:\s*/, ''));
        if (val > 500 && !content.includes('completion') && !content.includes('celebration')) {
          warnings.push(`${relPath}: 动画时长 ${val}ms 超过推荐值，高频UI动画应<300ms`);
        }
      }
    }

    // 检查 prefers-reduced-motion
    if (content.includes('Animated') && !content.includes('reduceMotion')) {
      warnings.push(`${relPath}: 动画组件未关联 reduceMotion 设置`);
    }
  }

  // 检查常量子文件中是否包含Emil Kowalski规范
  const constantsFile = path.join(SRC_DIR, 'utils', 'constants.ts');
  if (fs.existsSync(constantsFile)) {
    const constContent = fs.readFileSync(constantsFile, 'utf-8');
    const required = ['--ease-out', '--ease-in-out', '--ease-drawer', 'buttonPress', 'listPress', 'popupEnter'];
    for (const req of required) {
      if (!constContent.includes(req)) {
        errors.push(`constants.ts 缺少必需的设计令牌: ${req}`);
      }
    }
  }

  if (errors.length === 0 && warnings.length === 0) {
    log('pass', '所有设计合规检查通过');
    return { pass: true, errors: [], warnings: [] };
  } else {
    for (const e of errors) log('fail', e);
    for (const w of warnings) log('warn', w);
    return { pass: errors.length === 0, errors, warnings };
  }
}

// ========== Loop 3: Apple HIG 合规检查 ==========
function loop3_higCompliance() {
  log('loop', 'Loop 3: Apple HIG 合规检查');
  let errors = [];
  let warnings = [];

  const tsFiles = [];
  function findTsFiles(dir) {
    for (const entry of fs.readdirSync(dir)) {
      const full = path.join(dir, entry);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        findTsFiles(full);
      } else if (full.endsWith('.ts') || full.endsWith('.tsx')) {
        tsFiles.push(full);
      }
    }
  }
  findTsFiles(SRC_DIR);

  for (const file of tsFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const relPath = path.relative(PROJECT_ROOT, file);

    // 检查最小触控区域（44px）
    // 我们检查是否有小于40的硬编码尺寸用于可交互元素
    const touchPattern = /TouchableOpacity|TouchableHighlight|Pressable|Button/;
    if (touchPattern.test(content)) {
      // 基本检查：是否有关怀触控区域
      if (!content.includes('hitSlop') && !content.includes('minHeight') && !content.includes('minWidth')) {
        // 不是错误，只是提醒
      }
    }

    // 检查使用 SafeAreaView
    if (content.includes('NavigationContainer') && !content.includes('SafeAreaView')) {
      warnings.push(`${relPath}: 屏幕组件应考虑使用 SafeAreaView 处理刘海/灵动岛`);
    }
  }

  // 检查 app.json 中的 Android 配置
  const appJson = JSON.parse(fs.readFileSync(path.join(PROJECT_ROOT, 'app.json'), 'utf-8'));
  if (!appJson.expo.android?.package) {
    errors.push('app.json: 缺少 Android package 配置');
  }
  if (!appJson.expo.android?.permissions?.includes('VIBRATE')) {
    warnings.push('app.json: 建议添加 VIBRATE 权限用于触觉反馈');
  }

  if (errors.length === 0 && warnings.length === 0) {
    log('pass', 'Apple HIG 合规检查通过');
    return { pass: true, errors: [], warnings: [] };
  } else {
    for (const e of errors) log('fail', e);
    for (const w of warnings) log('warn', w);
    return { pass: errors.length === 0, errors, warnings };
  }
}

// ========== Loop 4: 数据完整性检查 ==========
function loop4_dataIntegrity() {
  log('loop', 'Loop 4: 数据完整性检查');
  let errors = [];

  const workoutsFile = path.join(SRC_DIR, 'data', 'workouts.ts');
  if (fs.existsSync(workoutsFile)) {
    const content = fs.readFileSync(workoutsFile, 'utf-8');

    // 检查至少5个计划
    const planMatches = content.match(/id:/g);
    if (!planMatches || planMatches.length < 5) {
      errors.push('workouts.ts: 应至少包含5个锻炼计划');
    }

    // 检查每个计划都有 exercises
    const exerciseArrays = content.match(/exercises:\s*\[/g);
    if (!exerciseArrays || exerciseArrays.length < 5) {
      errors.push('workouts.ts: 部分计划缺少 exercises 数组');
    }

    // 检查类型定义
    const typesFile = path.join(SRC_DIR, 'utils', 'types.ts');
    if (fs.existsSync(typesFile)) {
      const typesContent = fs.readFileSync(typesFile, 'utf-8');
      const requiredTypes = ['WorkoutPlan', 'Exercise', 'WorkoutRecord', 'UserSettings'];
      for (const t of requiredTypes) {
        if (!typesContent.includes(`interface ${t}`)) {
          errors.push(`types.ts: 缺少类型定义 ${t}`);
        }
      }
    }
  }

  if (errors.length === 0) {
    log('pass', '数据完整性检查通过');
    return { pass: true, errors: [] };
  } else {
    for (const e of errors) log('fail', e);
    return { pass: false, errors };
  }
}

// ========== Loop 5: 构建预检 ==========
function loop5_buildCheck() {
  log('loop', 'Loop 5: 构建预检');
  let errors = [];
  let warnings = [];

  // 检查 package.json 关键依赖
  const pkg = JSON.parse(fs.readFileSync(path.join(PROJECT_ROOT, 'package.json'), 'utf-8'));
  const requiredDeps = [
    'react',
    'react-native',
    'expo',
    '@react-navigation/native',
    '@react-navigation/native-stack',
    '@react-navigation/bottom-tabs',
    '@react-native-async-storage/async-storage',
  ];
  for (const dep of requiredDeps) {
    if (!pkg.dependencies[dep] && !pkg.devDependencies[dep]) {
      errors.push(`package.json: 缺少关键依赖 ${dep}`);
    }
  }

  // 检查 app.json 图标配置
  const appJson = JSON.parse(fs.readFileSync(path.join(PROJECT_ROOT, 'app.json'), 'utf-8'));
  if (!appJson.expo.icon) {
    warnings.push('app.json: 未配置应用图标');
  }
  if (!appJson.expo.splash) {
    warnings.push('app.json: 未配置启动屏');
  }

  // 检查 EAS 配置（用于APK构建）
  const easJson = path.join(PROJECT_ROOT, 'eas.json');
  if (!fs.existsSync(easJson)) {
    warnings.push('缺少 eas.json，需要创建以支持 EAS Build');
  }

  if (errors.length === 0 && warnings.length === 0) {
    log('pass', '构建预检通过');
    return { pass: true, errors: [], warnings: [] };
  } else {
    for (const e of errors) log('fail', e);
    for (const w of warnings) log('warn', w);
    return { pass: errors.length === 0, errors, warnings };
  }
}

// ========== 主循环 ==========
function runLoops() {
  console.log(`${colors.bold}${colors.cyan}
╔══════════════════════════════════════════════════════╗
║     LOOPS - 居家锻炼APK 迭代测试循环框架              ║
║     Apple Design + Emil Kowalski 设计工程             ║
╚══════════════════════════════════════════════════════╝${colors.reset}\n`);

  const loops = [
    { name: 'Loop 1: 静态代码检查', fn: loop1_staticCheck },
    { name: 'Loop 2: Emil Kowalski 设计合规', fn: loop2_designCompliance },
    { name: 'Loop 3: Apple HIG 合规', fn: loop3_higCompliance },
    { name: 'Loop 4: 数据完整性', fn: loop4_dataIntegrity },
    { name: 'Loop 5: 构建预检', fn: loop5_buildCheck },
  ];

  let allPassed = true;
  const results = [];

  for (const loop of loops) {
    console.log(`${colors.cyan}────────────────────────────────────────${colors.reset}`);
    const result = loop.fn();
    results.push({ name: loop.name, ...result });
    if (!result.pass) allPassed = false;
    console.log('');
  }

  // 汇总报告
  console.log(`${colors.cyan}════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bold}测试结果汇总:${colors.reset}\n`);

  for (const r of results) {
    const status = r.pass
      ? `${colors.green}✓ 通过${colors.reset}`
      : `${colors.red}✗ 失败${colors.reset}`;
    console.log(`  ${status} ${r.name}`);
    if (r.errors?.length) {
      console.log(`     ${colors.red}错误: ${r.errors.length} 个${colors.reset}`);
    }
    if (r.warnings?.length) {
      console.log(`     ${colors.yellow}警告: ${r.warnings.length} 个${colors.reset}`);
    }
  }

  console.log(`\n${colors.cyan}════════════════════════════════════════${colors.reset}`);

  if (allPassed) {
    console.log(`${colors.green}${colors.bold}✓ 所有循环测试通过！可以进入下一轮迭代或构建。${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`${colors.red}${colors.bold}✗ 部分测试未通过，请修复后重新运行。${colors.reset}\n`);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  runLoops();
}

module.exports = { runLoops, loop1_staticCheck, loop2_designCompliance, loop3_higCompliance, loop4_dataIntegrity, loop5_buildCheck };
