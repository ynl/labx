# LabX - AI Creative Experiment Gallery

![LabX Logo](https://via.placeholder.com/150x150/07C160/FFFFFF?text=LabX)

一个运行在纯血鸿蒙系统上的 AI 创意实验平台，使用 React Native 构建。

## 项目简介

LabX 是一个创新的移动应用，展示各种 AI 驱动的创意实验。主要功能包括：

- 🧠 **AI 账单识别** - 智能识别账单信息并自动分账
- 🧪 **实验展示** - 浏览和体验各种创意实验
- 📱 **跨平台支持** - 基于 React Native，支持 HarmonyOS、iOS 和 Android
- 🔐 **安全认证** - 基于 Supabase 的邮箱验证码登录

## 技术栈

- **框架**: React Native 0.72.6
- **语言**: TypeScript
- **UI**: React Native Components
- **导航**: React Navigation
- **状态管理**: React Context API
- **后端**: Supabase (认证、数据库)
- **相机**: react-native-camera
- **图片选择**: react-native-image-picker
- **通讯录**: react-native-contacts
- **推送通知**: react-native-push-notification
- **本地存储**: @react-native-async-storage/async-storage

## 系统要求

### 开发环境

- Node.js >= 16
- npm 或 yarn
- React Native CLI
- DevEco Studio (用于 HarmonyOS 开发)

### 目标平台

- HarmonyOS API 9+
- iOS 13+
- Android 6.0+

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/yourusername/labx.git
cd labx
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

创建 `.env` 文件：

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

### 4. 运行项目

#### HarmonyOS

```bash
npm run harmony
```

#### iOS

```bash
cd ios && pod install && cd ..
npm run ios
```

#### Android

```bash
npm run android
```

## 项目结构

```
labx/
├── src/
│   ├── App.tsx                      # 应用主入口
│   ├── context/
│   │   └── AuthContext.tsx          # 认证上下文
│   ├── screens/
│   │   ├── LoginScreen.tsx          # 登录页面
│   │   ├── HomeScreen.tsx           # 主页（实验列表）
│   │   ├── BillScanScreen.tsx       # 账单扫描页面
│   │   ├── ExperimentDetailScreen.tsx # 实验详情
│   │   └── ProfileScreen.tsx        # 个人中心
│   └── services/
│       ├── AuthService.ts           # 认证服务
│       └── AppInitializer.ts        # 应用初始化
├── index.js                         # React Native 入口
├── app.json                         # 应用配置
├── package.json                     # 依赖配置
└── EXPO_TO_RNOH_MIGRATION.md       # Expo 迁移指南
```

## 核心功能

### 1. 用户认证

- 邮箱验证码登录
- 基于 Supabase 的安全认证
- 本地 Token 管理
- 账户删除功能

### 2. 实验展示

- 实验列表浏览
- 实验详情查看
- 点击卡片进入体验
- OTA 实时添加新实验

### 3. AI 账单识别

- 相机拍摄账单
- 从相册选择账单图片
- AI 分析提取账单信息
- 支持多参与者分账演示

### 4. 个人中心

- 用户信息展示
- 账户设置
- 退出登录
- 账户删除

## Expo 迁移

本项目从 Expo 迁移到 React Native HarmonyOS。详细的迁移指南请查看：

- [Expo to RNOH Migration Guide](./EXPO_TO_RNOH_MIGRATION.md)

### 主要变更

| Expo Package | React Native 替代 |
|--------------|------------------|
| `expo-camera` | `react-native-camera` |
| `expo-image-picker` | `react-native-image-picker` |
| `expo-notifications` | `react-native-push-notification` |
| `expo-contacts` | `react-native-contacts` |
| `expo-device` | `react-native-device-info` |
| `expo-router` | `@react-navigation/native` |

## 权限说明

应用需要以下权限：

- **相机** (ohos.permission.CAMERA) - 用于扫描账单
- **相册读取** (ohos.permission.READ_MEDIA) - 用于选择账单图片
- **相册写入** (ohos.permission.WRITE_MEDIA) - 用于保存处理后的图片
- **通讯录读取** (ohos.permission.READ_CONTACTS) - 用于快速添加分账参与者
- **网络访问** (ohos.permission.INTERNET) - 用于数据同步和认证

## 开发指南

### 添加新实验

1. 在 `HomeScreen.tsx` 的 `experiments` 数组中添加实验信息：

```typescript
{
  id: '4',
  title: '新实验',
  description: '实验描述',
  category: '分类',
}
```

2. 在 `ExperimentDetailScreen.tsx` 中添加相应的处理逻辑

### 集成新的原生功能

1. 安装对应的 React Native 库
2. 按照库文档进行原生链接
3. 在 `app.json` 中添加所需权限
4. 实现功能并测试

## 构建和发布

### HarmonyOS

```bash
# 构建 HAP 包
npm run build:harmony

# 签名配置
# 在 DevEco Studio 中配置签名
```

### iOS

```bash
# 构建
npm run build:ios

# 或在 Xcode 中打开项目并构建
open ios/LabX.xcworkspace
```

### Android

```bash
# 构建 APK
cd android
./gradlew assembleRelease

# 构建 AAB
./gradlew bundleRelease
```

## 测试

```bash
# 运行单元测试
npm test

# 运行 lint
npm run lint

# 类型检查
npm run type-check
```

## 常见问题

### 1. 相机预览黑屏？

检查权限是否正确授予，并确保相机已正确初始化。

### 2. Supabase 连接失败？

确认 `.env` 文件中的配置正确，并检查网络连接。

### 3. HarmonyOS 构建失败？

确保安装了最新版本的 DevEco Studio 和 HarmonyOS SDK。

## 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

MIT License

## 联系方式

- 作者: yilin
- Email: yilin@tencent.com
- GitHub: [项目地址]

## 致谢

- [React Native](https://reactnative.dev/)
- [Supabase](https://supabase.com/)
- [React Navigation](https://reactnavigation.org/)
- [HarmonyOS](https://developer.harmonyos.com/)

---

**Made with ❤️ for HarmonyOS**
