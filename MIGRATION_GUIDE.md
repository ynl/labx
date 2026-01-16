# Expo to HarmonyOS Migration Guide
# Expo 到鸿蒙系统迁移指南

## 概述

本文档详细说明如何将 Expo React Native 应用迁移到纯血鸿蒙系统（HarmonyOS NEXT）。

## 目录

1. [架构对比](#架构对比)
2. [API 映射表](#api-映射表)
3. [核心功能迁移](#核心功能迁移)
4. [配置文件对比](#配置文件对比)
5. [测试指南](#测试指南)
6. [常见问题](#常见问题)

---

## 架构对比

### Expo React Native 架构

```
Expo React Native App
├── JavaScript/TypeScript (业务逻辑)
├── React Native Components (UI)
├── Expo SDK (原生能力封装)
└── Native Modules (iOS/Android)
```

### HarmonyOS 架构

```
HarmonyOS App
├── ArkTS (业务逻辑)
├── ArkUI Components (UI)
├── HarmonyOS SDK (原生能力)
└── Native APIs (纯血鸿蒙)
```

---

## API 映射表

### 1. 认证相关

| Expo API | HarmonyOS API | 说明 |
|----------|--------------|------|
| `AsyncStorage` | `@ohos.data.preferences` | 本地数据存储 |
| `fetch()` | `@ohos.net.http` | HTTP 请求 |
| Supabase SDK | Supabase REST API | 继续使用 HTTP 调用 |

**实现示例：**

**Expo (React Native):**
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

// 保存数据
await AsyncStorage.setItem('token', authToken);

// 读取数据
const token = await AsyncStorage.getItem('token');
```

**HarmonyOS (ArkTS):**
```typescript
import preferences from '@ohos.data.preferences';

// 获取 preferences 实例
const prefs = await preferences.getPreferences(context, 'auth_storage');

// 保存数据
await prefs.put('token', authToken);
await prefs.flush();

// 读取数据
const token = await prefs.get('token', '');
```

---

### 2. 相机和相册

| Expo API | HarmonyOS API | 说明 |
|----------|--------------|------|
| `expo-camera` | `@ohos.multimedia.camera` | 相机功能 |
| `expo-image-picker` | `@ohos.file.photoAccessHelper` | 相册选择 |
| `CameraView` | `XComponent` + CameraManager | 相机预览 |

**实现示例：**

**Expo (React Native):**
```javascript
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

// 请求权限
const { status } = await Camera.requestCameraPermissionsAsync();

// 拍照
const photo = await cameraRef.current.takePictureAsync();

// 选择图片
const result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  quality: 1,
});
```

**HarmonyOS (ArkTS):**
```typescript
import camera from '@ohos.multimedia.camera';
import photoAccessHelper from '@ohos.file.photoAccessHelper';

// 初始化相机
const cameraManager = camera.getCameraManager(context);
const cameras = cameraManager.getSupportedCameras();
const cameraInput = cameraManager.createCameraInput(cameras[0]);

// 拍照
await photoOutput.capture();

// 选择图片
const photoSelectOptions = new photoAccessHelper.PhotoSelectOptions();
photoSelectOptions.maxSelectNumber = 1;
const picker = new photoAccessHelper.PhotoViewPicker();
const result = await picker.select(photoSelectOptions);
```

---

### 3. 推送通知

| Expo API | HarmonyOS API | 说明 |
|----------|--------------|------|
| `expo-notifications` | `@hms.core.push.pushService` | 推送通知 |
| `getExpoPushTokenAsync()` | `pushService.getToken()` | 获取推送 Token |
| `scheduleNotificationAsync()` | `@ohos.notificationManager` | 本地通知 |

**实现示例：**

**Expo (React Native):**
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
  trigger: null, // 立即发送
});

// 监听通知
Notifications.addNotificationReceivedListener(notification => {
  console.log(notification);
});
```

**HarmonyOS (ArkTS):**
```typescript
import pushService from '@hms.core.push.pushService';
import notificationManager from '@ohos.notificationManager';

// 获取推送 Token
const token = await pushService.getToken();

// 发送本地通知
const notificationRequest: notificationManager.NotificationRequest = {
  id: Date.now(),
  content: {
    notificationContentType: notificationManager.ContentType.NOTIFICATION_CONTENT_BASIC_TEXT,
    normal: {
      title: "标题",
      text: "内容"
    }
  }
};
await notificationManager.publish(notificationRequest);

// 监听推送消息
pushService.on('message', (message) => {
  console.log(message);
});
```

---

### 4. 通讯录

| Expo API | HarmonyOS API | 说明 |
|----------|--------------|------|
| `expo-contacts` | `@ohos.contact` | 通讯录访问 |
| `getContactsAsync()` | `contact.query()` | 查询联系人 |
| `addContactAsync()` | `contact.insert()` | 添加联系人 |

**实现示例：**

**Expo (React Native):**
```javascript
import * as Contacts from 'expo-contacts';

// 请求权限
const { status } = await Contacts.requestPermissionsAsync();

// 获取所有联系人
const { data } = await Contacts.getContactsAsync({
  fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Emails],
});

// 搜索联系人
const { data } = await Contacts.getContactsAsync({
  name: '张三',
});
```

**HarmonyOS (ArkTS):**
```typescript
import contact from '@ohos.contact';

// 获取联系人管理器
const holder = contact.getContactHolder(context);

// 查询联系人
const attrs: contact.ContactAttributes = {
  attributes: [
    contact.Attribute.ATTR_NAME,
    contact.Attribute.ATTR_PHONE,
    contact.Attribute.ATTR_EMAIL
  ]
};
const resultSet = await holder.query(attrs);

// 读取联系人数据
while (!resultSet.isEnd()) {
  const contactData = resultSet.get();
  console.log(contactData.name?.fullName);
  resultSet.next();
}
```

---

### 5. 设备信息

| Expo API | HarmonyOS API | 说明 |
|----------|--------------|------|
| `expo-device` | `@ohos.deviceInfo` | 设备信息 |
| `Device.deviceName` | `deviceInfo.deviceType` | 设备类型 |
| `Device.osVersion` | `deviceInfo.osFullName` | 系统版本 |

**实现示例：**

**Expo (React Native):**
```javascript
import * as Device from 'expo-device';

console.log(Device.deviceName);
console.log(Device.osVersion);
console.log(Device.platformApiLevel);
```

**HarmonyOS (ArkTS):**
```typescript
import deviceInfo from '@ohos.deviceInfo';

console.log(deviceInfo.deviceType);
console.log(deviceInfo.osFullName);
console.log(deviceInfo.sdkApiVersion);
```

---

### 6. 网络请求

| Expo API | HarmonyOS API | 说明 |
|----------|--------------|------|
| `fetch()` | `@ohos.net.http` | HTTP 请求 |
| `axios` | `@ohos/axios` | Axios NPM 包 |

**实现示例：**

**Expo (React Native):**
```javascript
// 使用 fetch
const response = await fetch('https://api.example.com/data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ key: 'value' }),
});
const data = await response.json();
```

**HarmonyOS (ArkTS):**
```typescript
import http from '@ohos.net.http';

// 创建 HTTP 请求
const httpRequest = http.createHttp();
const response = await httpRequest.request('https://api.example.com/data', {
  method: http.RequestMethod.POST,
  header: {
    'Content-Type': 'application/json'
  },
  extraData: JSON.stringify({ key: 'value' })
});

const data = JSON.parse(response.result as string);
```

---

### 7. 导航

| Expo API | HarmonyOS API | 说明 |
|----------|--------------|------|
| `@react-navigation/native` | `@ohos.router` | 页面路由 |
| `navigation.navigate()` | `router.pushUrl()` | 页面跳转 |
| `navigation.goBack()` | `router.back()` | 返回上一页 |

**实现示例：**

**Expo (React Native):**
```javascript
import { useNavigation } from '@react-navigation/native';

const navigation = useNavigation();

// 跳转页面
navigation.navigate('Details', { id: 123 });

// 返回
navigation.goBack();
```

**HarmonyOS (ArkTS):**
```typescript
import router from '@ohos.router';

// 跳转页面
router.pushUrl({
  url: 'pages/DetailsPage',
  params: { id: 123 }
});

// 返回
router.back();
```

---

### 8. UI 组件对比

| React Native | HarmonyOS ArkUI | 说明 |
|--------------|-----------------|------|
| `<View>` | `Column()` / `Row()` / `Stack()` | 容器组件 |
| `<Text>` | `Text()` | 文本组件 |
| `<Image>` | `Image()` | 图片组件 |
| `<TextInput>` | `TextInput()` | 输入框 |
| `<Button>` | `Button()` | 按钮 |
| `<ScrollView>` | `Scroll()` | 滚动容器 |
| `<FlatList>` | `List()` | 列表 |
| `<TouchableOpacity>` | `.onClick()` | 点击事件 |

**实现示例：**

**Expo (React Native):**
```jsx
<View style={styles.container}>
  <Text style={styles.title}>Hello</Text>
  <TextInput
    placeholder="输入..."
    onChangeText={setText}
  />
  <Button title="提交" onPress={handleSubmit} />
</View>
```

**HarmonyOS (ArkTS):**
```typescript
Column() {
  Text('Hello')
    .fontSize(20)
    .fontWeight(FontWeight.Bold)

  TextInput({ placeholder: '输入...' })
    .onChange((value: string) => {
      this.text = value;
    })

  Button('提交')
    .onClick(() => {
      this.handleSubmit();
    })
}
.width('100%')
.padding(20)
```

---

## 核心功能迁移

### 1. 应用入口

**Expo (React Native) - App.js:**
```javascript
import { registerRootComponent } from 'expo';
import App from './src/App';

registerRootComponent(App);
```

**HarmonyOS - EntryAbility.ts:**
```typescript
import UIAbility from '@ohos.app.ability.UIAbility';
import window from '@ohos.window';

export default class EntryAbility extends UIAbility {
  onWindowStageCreate(windowStage: window.WindowStage) {
    windowStage.loadContent('pages/HomePage', (err, data) => {
      // 页面加载完成
    });
  }
}
```

---

### 2. 状态管理

**Expo (React Native) - useState:**
```javascript
import { useState } from 'react';

function MyComponent() {
  const [count, setCount] = useState(0);

  return (
    <View>
      <Text>{count}</Text>
      <Button title="+" onPress={() => setCount(count + 1)} />
    </View>
  );
}
```

**HarmonyOS - @State:**
```typescript
@Component
struct MyComponent {
  @State count: number = 0;

  build() {
    Column() {
      Text(this.count.toString())
      Button('+')
        .onClick(() => {
          this.count++;
        })
    }
  }
}
```

---

### 3. 生命周期

**Expo (React Native):**
```javascript
import { useEffect } from 'react';

function MyComponent() {
  useEffect(() => {
    // 组件挂载
    console.log('mounted');

    return () => {
      // 组件卸载
      console.log('unmounted');
    };
  }, []);
}
```

**HarmonyOS:**
```typescript
@Component
struct MyComponent {
  aboutToAppear() {
    // 组件即将出现
    console.log('aboutToAppear');
  }

  aboutToDisappear() {
    // 组件即将消失
    console.log('aboutToDisappear');
  }

  build() {
    // ...
  }
}
```

---

## 配置文件对比

### package.json

**Expo:**
```json
{
  "name": "labx",
  "version": "1.0.0",
  "main": "node_modules/expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios"
  },
  "dependencies": {
    "expo": "^50.0.0",
    "react": "18.2.0",
    "react-native": "0.73.0",
    "expo-camera": "^14.0.0",
    "expo-notifications": "^0.26.0"
  }
}
```

**HarmonyOS:**
```json
{
  "name": "labx-harmonyos",
  "version": "1.0.0",
  "main": "entry/src/main/ets/entryability/EntryAbility.ts",
  "ohos": {
    "org": "com.labx",
    "buildTool": "hvigor"
  },
  "scripts": {
    "build": "hvigor assembleApp",
    "clean": "hvigor clean"
  },
  "dependencies": {
    "@ohos/axios": "^2.0.0"
  }
}
```

---

### 应用配置

**Expo - app.json:**
```json
{
  "expo": {
    "name": "LabX",
    "slug": "labx",
    "version": "1.0.0",
    "ios": { "supportsTablet": true },
    "android": {
      "package": "com.labx.app",
      "permissions": [
        "android.permission.CAMERA",
        "android.permission.READ_CONTACTS"
      ]
    },
    "plugins": [
      ["expo-camera", {}],
      ["expo-notifications", {}]
    ]
  }
}
```

**HarmonyOS - module.json5:**
```json5
{
  "module": {
    "name": "entry",
    "type": "entry",
    "abilities": [...],
    "requestPermissions": [
      {
        "name": "ohos.permission.CAMERA",
        "reason": "$string:camera_permission_reason",
        "usedScene": {
          "abilities": ["EntryAbility"],
          "when": "inuse"
        }
      },
      {
        "name": "ohos.permission.READ_CONTACTS",
        "reason": "$string:contacts_permission_reason"
      }
    ]
  }
}
```

---

## 测试指南

### 1. 环境准备

```bash
# 安装 DevEco Studio
# 下载地址: https://developer.harmonyos.com/cn/develop/deveco-studio

# 配置 SDK
# API Version 9 或更高

# 连接真机或启动模拟器
```

### 2. 构建项目

```bash
# 进入项目目录
cd /home/user/labx

# 构建应用
hvigor assembleApp

# 或在 DevEco Studio 中点击 Build > Build Hap(s)/APP(s)
```

### 3. 运行应用

```bash
# 安装到设备
hdc install entry-default-signed.hap

# 或在 DevEco Studio 中点击 Run
```

### 4. 测试功能清单

- [ ] 用户登录（邮箱验证码）
- [ ] 相机拍照功能
- [ ] 相册选择功能
- [ ] 推送通知接收
- [ ] 通讯录读取
- [ ] 账单识别演示
- [ ] 实验列表展示
- [ ] 页面导航
- [ ] 用户退出登录
- [ ] 账户删除

---

## 常见问题

### 1. 如何调试网络请求？

使用 DevEco Studio 的网络调试工具：
- Tools > HiLog > 筛选 "http"
- 查看请求和响应日志

### 2. 权限申请失败？

确保在 `module.json5` 中正确配置权限，并在运行时请求：

```typescript
import abilityAccessCtrl from '@ohos.abilityAccessCtrl';

const atManager = abilityAccessCtrl.createAtManager();
await atManager.requestPermissionsFromUser(context, [
  'ohos.permission.CAMERA'
]);
```

### 3. 如何处理图片？

使用 `@ohos.multimedia.image` 处理图片：

```typescript
import image from '@ohos.multimedia.image';

// 创建 ImageSource
const imageSource = image.createImageSource(imageData);

// 创建 PixelMap
const pixelMap = await imageSource.createPixelMap();
```

### 4. Supabase 集成问题？

继续使用 REST API 方式调用 Supabase：

```typescript
import http from '@ohos.net.http';

const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_KEY = 'your-anon-key';

const httpRequest = http.createHttp();
const response = await httpRequest.request(`${SUPABASE_URL}/rest/v1/table`, {
  method: http.RequestMethod.GET,
  header: {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${token}`
  }
});
```

### 5. 如何实现 OTA 更新？

HarmonyOS 支持应用市场自动更新，也可以实现自定义更新逻辑：

```typescript
import bundleManager from '@ohos.bundle.bundleManager';

// 检查更新
const versionInfo = await checkServerVersion();

// 下载并安装更新包
if (versionInfo.hasUpdate) {
  downloadAndInstallUpdate(versionInfo.downloadUrl);
}
```

---

## 迁移检查清单

### 开发阶段
- [x] 创建 HarmonyOS 项目结构
- [x] 迁移认证系统
- [x] 实现相机功能
- [x] 实现相册选择
- [x] 集成推送通知
- [x] 实现通讯录访问
- [x] 创建所有页面
- [ ] 实现 AI 账单识别
- [ ] 集成 Sentry 错误监控
- [ ] 集成 PostHog 分析

### 测试阶段
- [ ] 单元测试
- [ ] 集成测试
- [ ] 性能测试
- [ ] 兼容性测试
- [ ] 用户验收测试

### 发布阶段
- [ ] 签名配置
- [ ] 混淆配置
- [ ] 打包 APP
- [ ] 上传应用市场
- [ ] 发布监控

---

## 参考资源

### 官方文档
- [HarmonyOS 开发者文档](https://developer.harmonyos.com/cn/docs)
- [ArkTS 语言参考](https://developer.harmonyos.com/cn/docs/documentation/doc-guides/arkts-overview)
- [ArkUI 组件库](https://developer.harmonyos.com/cn/docs/documentation/doc-references/arkui-ts-components)

### 示例代码
- [HarmonyOS Samples](https://gitee.com/harmonyos/samples)
- [Camera Sample](https://gitee.com/harmonyos/samples/tree/master/code/BasicFeature/Media/Camera)
- [Notification Sample](https://gitee.com/harmonyos/samples/tree/master/code/BasicFeature/Notification)

### 社区资源
- [HarmonyOS 开发者社区](https://developer.huawei.com/consumer/cn/forum/)
- [Stack Overflow - HarmonyOS](https://stackoverflow.com/questions/tagged/harmonyos)

---

## 联系支持

如有问题，请联系：
- Email: yilin@tencent.com
- GitHub Issues: [项目地址]

---

**最后更新:** 2026-01-16
**版本:** 1.0.0
