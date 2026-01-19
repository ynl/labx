# 快速编译指南

## 当前项目状态

✅ **可以编译出鸿蒙应用**

本项目使用 **React Native HarmonyOS (RNOH)** 框架，可以将 React Native 代码编译成运行在纯血鸿蒙系统上的原生应用。

## 核心原理

```
React Native 代码 (JS/TS)
         ↓
    Metro Bundler
         ↓
  JavaScript Bundle
         ↓
     RNOH 框架 (桥接层)
         ↓
   HarmonyOS 原生代码 (ArkTS)
         ↓
    编译成 HAP 包
         ↓
  运行在鸿蒙系统上
```

## 一键编译 (推荐)

```bash
# 1. 安装依赖
npm install

# 2. 生成 JS bundle
npm run bundle:harmony

# 3. 编译 HAP 包
npm run build:harmony
```

## 详细步骤

### 步骤 1: 安装开发工具

1. **DevEco Studio** (必需)
   - 下载: https://developer.harmonyos.com/cn/develop/deveco-studio
   - 版本: 4.0 或更高

2. **Node.js** (必需)
   ```bash
   node --version  # 应该 >= 16.0
   ```

### 步骤 2: 克隆并安装

```bash
git clone <your-repo>
cd labx
npm install
```

### 步骤 3: 配置 Supabase（可选）

创建 `.env` 文件：
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

### 步骤 4: 生成 JavaScript Bundle

```bash
npm run bundle:harmony
```

输出位置: `harmony/entry/src/main/resources/rawfile/bundle.harmony.js`

### 步骤 5: 使用 DevEco Studio 编译

1. 打开 DevEco Studio
2. File → Open → 选择 `labx/harmony` 目录
3. 等待项目同步完成
4. 连接设备或启动模拟器
5. 点击 Run 按钮 ▶️

**或使用命令行：**

```bash
cd harmony
./hvigorw assembleHap
```

输出: `harmony/entry/build/default/outputs/default/entry-default-signed.hap`

### 步骤 6: 安装到设备

```bash
# 查看已连接设备
hdc list targets

# 安装 HAP
hdc install harmony/entry/build/default/outputs/default/entry-default-signed.hap

# 启动应用
hdc shell aa start -a EntryAbility -b com.labx.app
```

## 项目架构

### 双层架构

```
┌─────────────────────────────────────┐
│     React Native 层 (跨平台)       │
│  - 业务逻辑 (TypeScript)            │
│  - UI 组件 (React Components)       │
│  - 状态管理 (Context API)           │
└──────────────┬──────────────────────┘
               │ RNOH 桥接
┌──────────────▼──────────────────────┐
│      HarmonyOS 原生层               │
│  - ArkTS 入口                        │
│  - 原生 API 调用                     │
│  - 系统权限管理                      │
└─────────────────────────────────────┘
```

### 关键文件

| 文件 | 作用 |
|------|------|
| `src/App.tsx` | React Native 应用入口 |
| `index.js` | React Native 注册入口 |
| `harmony/entry/src/main/ets/entryability/EntryAbility.ts` | 鸿蒙应用入口 |
| `harmony/entry/src/main/ets/pages/Index.ets` | 鸿蒙主页面（加载 RN） |
| `harmony/entry/src/main/module.json5` | 鸿蒙模块配置（权限等） |
| `harmony/build-profile.json5` | 编译配置 |

## 支持的功能

✅ **已实现**
- React Native 核心组件
- React Navigation 导航
- Supabase 认证（通过 HTTP API）
- 网络请求 (fetch/axios)
- 本地存储 (AsyncStorage)
- 图片显示

⚠️ **需要适配**
- 相机功能 (需要 RNOH 相机模块)
- 图片选择器 (需要 RNOH 图片选择模块)
- 推送通知 (需要华为推送服务)
- 通讯录访问 (需要 RNOH 通讯录模块)

🔄 **可用替代方案**
- 使用鸿蒙原生 API 实现相机功能
- 使用 Web API 实现部分功能
- 使用 RNOH 社区提供的第三方库

## 常见问题

### Q1: 为什么不能直接使用 `react-native run-harmony`？

A: RNOH 需要先生成 bundle，然后通过 DevEco Studio 编译鸿蒙原生项目。不同于 Android/iOS 的开发流程。

### Q2: 编译失败怎么办？

A: 按顺序检查：
1. DevEco Studio 是否正确安装
2. HarmonyOS SDK 是否下载
3. `npm install` 是否成功
4. `bundle.harmony.js` 是否生成
5. 查看编译日志定位错误

### Q3: 第三方库不兼容怎么办？

A:
1. 检查是否有 RNOH 版本
2. 使用鸿蒙原生 API 替代
3. 提交 Issue 到 RNOH 社区

### Q4: 如何调试？

A:
- **JS 调试**: 在 Metro 启动后使用 Chrome DevTools
- **原生调试**: 在 DevEco Studio 中使用断点调试
- **日志查看**: `hdc hilog | grep LabX`

## 性能优化建议

1. **启用 Hermes 引擎** - 更快的启动速度
2. **代码分割** - 减少初始 bundle 大小
3. **图片优化** - 使用 WebP 格式
4. **懒加载** - 使用 React.lazy 和 Suspense
5. **原生驱动动画** - 使用 `useNativeDriver: true`

## 版本兼容性

| 组件 | 版本 |
|------|------|
| React Native | 0.72.6 |
| RNOH | 0.72.27 |
| HarmonyOS API | 9+ |
| DevEco Studio | 4.0+ |
| Node.js | 16+ |

## 下一步

- [ ] 完善第三方库的鸿蒙适配
- [ ] 实现相机功能的鸿蒙桥接
- [ ] 集成华为推送服务
- [ ] 性能优化和测试
- [ ] 发布到华为应用市场

## 获取帮助

- 📖 详细编译指南: [HARMONYOS_BUILD_GUIDE.md](./HARMONYOS_BUILD_GUIDE.md)
- 🔄 Expo 迁移指南: [EXPO_TO_RNOH_MIGRATION.md](./EXPO_TO_RNOH_MIGRATION.md)
- 💬 技术支持: yilin@tencent.com
- 🐛 提交问题: GitHub Issues

---

**总结**: 是的，这个项目可以编译出鸿蒙应用！按照上述步骤即可在 HarmonyOS 设备上运行。
