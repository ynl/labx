# Expo to React Native HarmonyOS Migration Guide
# Expo 迁移到 React Native 鸿蒙系统指南

## 项目概述

本指南详细说明如何将 Expo 应用迁移到 React Native HarmonyOS (RNOH)，使其能够在纯血鸿蒙系统上运行。

**注意：** 我们使用 React Native + HarmonyOS 方案，而不是重写为鸿蒙原生代码。

---

## 目录

1. [架构说明](#架构说明)
2. [Expo API 到 React Native 映射](#expo-api-到-react-native-映射)
3. [HarmonyOS 特定配置](#harmonyos-特定配置)
4. [迁移步骤](#迁移步骤)
5. [常见问题](#常见问题)

---

## 架构说明

### 原始架构: Expo
```
Expo App
├── Expo SDK (expo-camera, expo-notifications, etc.)
├── React Native Core
└── Native Modules (iOS/Android)
```

### 目标架构: React Native HarmonyOS
```
React Native HarmonyOS App
├── React Native Community Libraries
├── React Native Core
├── RNOH Bridge
└── HarmonyOS Native APIs
```

---

## Expo API 到 React Native 映射

### 1. 认证和存储

| Expo Package | React Native 替代 | 说明 |
|--------------|------------------|------|
| `expo-secure-store` | `@react-native-async-storage/async-storage` | 本地存储 |
| N/A | `@supabase/supabase-js` | 继续使用 Supabase |

**迁移示例:**

**Expo:**
```javascript
import * as SecureStore from 'expo-secure-store';

// 保存数据
await SecureStore.setItemAsync('token', authToken);

// 读取数据
const token = await SecureStore.getItemAsync('token');
```

**React Native:**
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

// 保存数据
await AsyncStorage.setItem('token', authToken);

// 读取数据
const token = await AsyncStorage.getItem('token');
```

---

### 2. 相机功能

| Expo Package | React Native 替代 | 说明 |
|--------------|------------------|------|
| `expo-camera` | `react-native-camera` | 相机拍照和预览 |

**迁移示例:**

**Expo:**
```jsx
import { Camera } from 'expo-camera';

<Camera
  ref={cameraRef}
  type={Camera.Constants.Type.back}
  style={styles.camera}
/>

// 拍照
const photo = await cameraRef.current.takePictureAsync();
```

**React Native:**
```jsx
import { RNCamera } from 'react-native-camera';

<RNCamera
  ref={cameraRef}
  type={RNCamera.Constants.Type.back}
  style={styles.camera}
/>

// 拍照
const photo = await cameraRef.current.takePictureAsync();
```

---

### 3. 图片选择

| Expo Package | React Native 替代 | 说明 |
|--------------|------------------|------|
| `expo-image-picker` | `react-native-image-picker` | 从相册选择图片 |

**迁移示例:**

**Expo:**
```javascript
import * as ImagePicker from 'expo-image-picker';

const result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  quality: 1,
});
```

**React Native:**
```javascript
import { launchImageLibrary } from 'react-native-image-picker';

const result = await launchImageLibrary({
  mediaType: 'photo',
  quality: 1,
});
```

---

### 4. 推送通知

| Expo Package | React Native 替代 | 说明 |
|--------------|------------------|------|
| `expo-notifications` | `react-native-push-notification` | 本地和远程通知 |

**迁移示例:**

**Expo:**
```javascript
import * as Notifications from 'expo-notifications';

// 获取推送 Token
const token = await Notifications.getExpoPushTokenAsync();

// 发送本地通知
await Notifications.scheduleNotificationAsync({
  content: {
    title: "标题",
    body: "内容",
  },
  trigger: null,
});
```

**React Native:**
```javascript
import PushNotification from 'react-native-push-notification';

// 配置推送
PushNotification.configure({
  onRegister: (token) => {
    console.log('TOKEN:', token);
  },
  onNotification: (notification) => {
    console.log('NOTIFICATION:', notification);
  },
});

// 发送本地通知
PushNotification.localNotification({
  title: "标题",
  message: "内容",
});
```

---

### 5. 通讯录

| Expo Package | React Native 替代 | 说明 |
|--------------|------------------|------|
| `expo-contacts` | `react-native-contacts` | 访问设备通讯录 |

**迁移示例:**

**Expo:**
```javascript
import * as Contacts from 'expo-contacts';

// 请求权限
const { status } = await Contacts.requestPermissionsAsync();

// 获取联系人
const { data } = await Contacts.getContactsAsync({
  fields: [Contacts.Fields.PhoneNumbers],
});
```

**React Native:**
```javascript
import Contacts from 'react-native-contacts';

// 请求权限
const permission = await Contacts.requestPermission();

// 获取联系人
const contacts = await Contacts.getAll();
```

---

### 6. 设备信息

| Expo Package | React Native 替代 | 说明 |
|--------------|------------------|------|
| `expo-device` | `react-native-device-info` | 获取设备信息 |

**迁移示例:**

**Expo:**
```javascript
import * as Device from 'expo-device';

console.log(Device.deviceName);
console.log(Device.osVersion);
```

**React Native:**
```javascript
import DeviceInfo from 'react-native-device-info';

console.log(DeviceInfo.getDeviceName());
console.log(DeviceInfo.getSystemVersion());
```

---

### 7. 导航

| Expo Package | React Native 替代 | 说明 |
|--------------|------------------|------|
| `expo-router` | `@react-navigation/native` | 应用导航 |

**迁移示例:**

**Expo Router:**
```javascript
import { router } from 'expo-router';

router.push('/details');
```

**React Navigation:**
```javascript
import { useNavigation } from '@react-navigation/native';

const navigation = useNavigation();
navigation.navigate('Details');
```

---

## HarmonyOS 特定配置

### 1. app.json 配置

为 HarmonyOS 添加特定配置：

```json
{
  "name": "LabX",
  "displayName": "LabX",
  "harmony": {
    "bundleName": "com.labx.app",
    "versionCode": 1000000,
    "versionName": "1.0.0",
    "minAPIVersion": 9,
    "targetAPIVersion": 9,
    "icon": "$media:app_icon",
    "label": "$string:app_name",
    "permissions": [
      "ohos.permission.CAMERA",
      "ohos.permission.READ_MEDIA",
      "ohos.permission.WRITE_MEDIA",
      "ohos.permission.READ_CONTACTS",
      "ohos.permission.WRITE_CONTACTS",
      "ohos.permission.INTERNET",
      "ohos.permission.GET_NETWORK_INFO"
    ]
  }
}
```

### 2. 权限处理

HarmonyOS 的权限系统与 Android/iOS 类似，但有一些差异：

```javascript
import { PermissionsAndroid, Platform } from 'react-native';

const requestCameraPermission = async () => {
  if (Platform.OS === 'harmony') {
    const granted = await PermissionsAndroid.request(
      'ohos.permission.CAMERA',
      {
        title: '相机权限',
        message: '需要相机权限用于扫描账单',
        buttonPositive: '确定',
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  // iOS/Android 权限处理
};
```

### 3. 平台特定代码

使用 Platform 模块处理 HarmonyOS 特定逻辑：

```javascript
import { Platform } from 'react-native';

if (Platform.OS === 'harmony') {
  // HarmonyOS 特定代码
} else if (Platform.OS === 'android') {
  // Android 特定代码
} else if (Platform.OS === 'ios') {
  // iOS 特定代码
}
```

---

## 迁移步骤

### 步骤 1: 创建 React Native 项目

```bash
# 初始化项目
npx react-native init LabX --template react-native-template-typescript

# 进入项目目录
cd LabX

# 安装依赖
npm install
```

### 步骤 2: 安装 React Native 替代包

```bash
# 导航
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context

# 存储
npm install @react-native-async-storage/async-storage

# 网络请求
npm install @supabase/supabase-js axios

# 相机和图片
npm install react-native-camera
npm install react-native-image-picker

# 通讯录
npm install react-native-contacts

# 推送通知
npm install react-native-push-notification

# 设备信息
npm install react-native-device-info
```

### 步骤 3: 配置 HarmonyOS

```bash
# 安装 HarmonyOS CLI (如果可用)
npm install -g @ohos/hvigor

# 链接原生模块
npx react-native link
```

### 步骤 4: 迁移代码

1. **迁移应用入口**
   - 将 Expo 的 `App.tsx` 迁移到 React Native 的 `src/App.tsx`
   - 更新 `index.js` 入口文件

2. **迁移导航**
   - 将 Expo Router 替换为 React Navigation
   - 配置 Stack Navigator 和 Tab Navigator

3. **迁移 API 调用**
   - 根据上述映射表替换 Expo API
   - 测试每个功能模块

4. **迁移样式和组件**
   - React Native 的样式系统与 Expo 兼容
   - 直接复制组件代码

### 步骤 5: 测试

```bash
# 启动 Metro Bundler
npm start

# 在 HarmonyOS 设备或模拟器上运行
npm run harmony
```

---

## 完整的 package.json 依赖

```json
{
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.72.6",
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/stack": "^6.3.20",
    "@react-navigation/bottom-tabs": "^6.5.11",
    "@supabase/supabase-js": "^2.38.4",
    "react-native-camera": "^4.2.1",
    "react-native-image-picker": "^7.0.3",
    "react-native-contacts": "^7.0.8",
    "react-native-device-info": "^10.11.0",
    "react-native-push-notification": "^8.1.1",
    "@react-native-async-storage/async-storage": "^1.21.0",
    "react-native-screens": "^3.27.0",
    "react-native-safe-area-context": "^4.7.4",
    "axios": "^1.6.2"
  }
}
```

---

## 原生模块链接

某些库需要原生代码链接，在 React Native 0.60+ 大部分库支持自动链接：

```bash
# iOS (如果支持)
cd ios && pod install && cd ..

# HarmonyOS
# 按照 RNOH 文档进行配置
```

---

## 环境变量配置

创建 `.env` 文件用于配置：

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

安装 react-native-dotenv：

```bash
npm install react-native-dotenv
```

配置 `babel.config.js`：

```javascript
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['module:react-native-dotenv', {
      moduleName: '@env',
      path: '.env',
    }]
  ],
};
```

---

## 常见问题

### 1. 如何处理 Expo 特定的 API？

大部分 Expo API 都有对应的 React Native 社区库。参考上面的映射表进行替换。

### 2. HarmonyOS 不支持某些原生模块怎么办？

- 检查是否有 HarmonyOS 兼容版本
- 使用 Web API 或 JavaScript 实现
- 联系库作者添加 HarmonyOS 支持
- 考虑自己开发 HarmonyOS 原生模块

### 3. 推送通知在 HarmonyOS 上如何工作？

HarmonyOS 使用 HMS Push Kit，需要：
1. 在华为开发者平台注册应用
2. 配置 HMS Core
3. 集成 HMS Push 模块

### 4. 相机权限如何请求？

```javascript
import { PermissionsAndroid } from 'react-native';

const granted = await PermissionsAndroid.request(
  'ohos.permission.CAMERA'
);
```

### 5. Supabase 在 HarmonyOS 上是否可用？

是的，Supabase JS SDK 使用 HTTP API，可以在 HarmonyOS 上正常工作。

### 6. 如何调试 HarmonyOS 应用？

- 使用 DevEco Studio 的调试工具
- 使用 `console.log` 查看日志
- 使用 React Native Debugger
- 使用 Flipper（如果支持）

---

## 项目结构

```
labx/
├── src/
│   ├── App.tsx                 # 应用主入口
│   ├── context/
│   │   └── AuthContext.tsx     # 认证上下文
│   ├── screens/
│   │   ├── LoginScreen.tsx     # 登录页面
│   │   ├── HomeScreen.tsx      # 主页
│   │   ├── BillScanScreen.tsx  # 账单扫描
│   │   ├── ExperimentDetailScreen.tsx
│   │   └── ProfileScreen.tsx   # 个人中心
│   └── services/
│       ├── AuthService.ts      # 认证服务
│       └── AppInitializer.ts   # 应用初始化
├── index.js                    # React Native 入口
├── app.json                    # 应用配置
├── package.json                # 依赖配置
├── metro.config.js             # Metro 配置
├── babel.config.js             # Babel 配置
└── tsconfig.json               # TypeScript 配置
```

---

## 迁移检查清单

### Expo 依赖移除
- [ ] 移除 `expo` 包
- [ ] 移除 `expo-camera`
- [ ] 移除 `expo-image-picker`
- [ ] 移除 `expo-notifications`
- [ ] 移除 `expo-contacts`
- [ ] 移除 `expo-device`
- [ ] 移除 `expo-router`

### React Native 依赖安装
- [x] 安装 `@react-navigation/native`
- [x] 安装 `react-native-camera`
- [x] 安装 `react-native-image-picker`
- [x] 安装 `react-native-push-notification`
- [x] 安装 `react-native-contacts`
- [x] 安装 `react-native-device-info`
- [x] 安装 `@react-native-async-storage/async-storage`

### 代码迁移
- [x] 迁移应用入口
- [x] 迁移认证系统
- [x] 迁移导航系统
- [x] 迁移登录页面
- [x] 迁移主页面
- [x] 迁移账单扫描页面
- [x] 迁移个人中心页面
- [x] 迁移实验详情页面

### HarmonyOS 配置
- [x] 配置 app.json
- [x] 配置权限声明
- [ ] 测试相机功能
- [ ] 测试相册选择
- [ ] 测试推送通知
- [ ] 测试通讯录访问

### 测试
- [ ] 登录流程测试
- [ ] 页面导航测试
- [ ] 相机拍照测试
- [ ] 相册选择测试
- [ ] 推送通知测试
- [ ] 通讯录读取测试

---

## 参考资源

### 官方文档
- [React Native 官方文档](https://reactnative.dev/)
- [React Navigation 文档](https://reactnavigation.org/)
- [HarmonyOS 开发者文档](https://developer.harmonyos.com/)

### 社区库文档
- [react-native-camera](https://github.com/react-native-camera/react-native-camera)
- [react-native-image-picker](https://github.com/react-native-image-picker/react-native-image-picker)
- [react-native-push-notification](https://github.com/zo0r/react-native-push-notification)
- [react-native-contacts](https://github.com/morenoh149/react-native-contacts)
- [@react-native-async-storage/async-storage](https://github.com/react-native-async-storage/async-storage)

### Supabase
- [Supabase JS SDK](https://supabase.com/docs/reference/javascript)
- [Supabase 认证文档](https://supabase.com/docs/guides/auth)

---

## 获取帮助

如遇到问题：
- 查看本文档的常见问题部分
- 搜索相关库的 GitHub Issues
- 在 HarmonyOS 开发者社区提问
- 联系项目维护者：yilin@tencent.com

---

**最后更新:** 2026-01-16
**版本:** 1.0.0
**适用于:** React Native 0.72+, HarmonyOS API 9+
