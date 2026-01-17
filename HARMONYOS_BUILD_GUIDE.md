# HarmonyOS 编译指南

本文档详细说明如何在 HarmonyOS 平台上编译和运行 LabX 应用。

## 前置要求

### 1. 开发环境

- **DevEco Studio**: 版本 4.0+
  - 下载地址: https://developer.harmonyos.com/cn/develop/deveco-studio
- **Node.js**: 版本 16.0 或更高
- **npm** 或 **yarn**: 包管理工具
- **HarmonyOS SDK**: API 9 或更高

### 2. React Native HarmonyOS (RNOH)

本项目使用 RNOH 框架，这是华为开发的使 React Native 能够在 HarmonyOS 上运行的适配层。

## 项目结构

```
labx/
├── src/                          # React Native 源代码
│   ├── App.tsx                   # 应用入口
│   ├── screens/                  # 页面组件
│   └── services/                 # 服务层
├── harmony/                      # HarmonyOS 原生项目
│   ├── AppScope/                 # 应用全局配置
│   │   └── app.json5             # 应用配置
│   ├── entry/                    # 主模块
│   │   ├── src/main/
│   │   │   ├── ets/              # ArkTS 代码
│   │   │   │   ├── entryability/ # 应用入口
│   │   │   │   └── pages/        # 鸿蒙页面
│   │   │   ├── resources/        # 资源文件
│   │   │   └── module.json5      # 模块配置
│   │   └── oh-package.json5      # 鸿蒙依赖配置
│   ├── build-profile.json5       # 构建配置
│   └── hvigorfile.ts             # 构建脚本
├── index.js                      # RN 入口
└── package.json                  # 项目依赖
```

## 编译步骤

### 步骤 1: 安装依赖

```bash
# 安装 Node.js 依赖
npm install

# 或使用 yarn
yarn install
```

这会安装以下关键依赖：
- `react-native`: React Native 框架
- `@rnoh/react-native-openharmony`: RNOH 适配层
- 其他第三方库

### 步骤 2: 配置环境变量

创建 `.env` 文件：

```bash
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# 其他配置
API_BASE_URL=https://api.example.com
```

### 步骤 3: 生成 JavaScript Bundle

在编译鸿蒙应用前，需要先生成 JavaScript bundle：

```bash
# 生成 HarmonyOS 平台的 bundle
npm run bundle:harmony
```

这会生成：
- `harmony/entry/src/main/resources/rawfile/bundle.harmony.js`
- `harmony/entry/src/main/resources/rawfile/assets/`

### 步骤 4: 打开 DevEco Studio

1. 启动 DevEco Studio
2. 选择 "Open Project"
3. 导航到 `labx/harmony` 目录
4. 点击 "OK"

### 步骤 5: 配置签名

#### 自动签名（推荐用于开发）

1. 在 DevEco Studio 中，打开 `File > Project Structure`
2. 选择 `Project > Signing Configs`
3. 勾选 "Automatically generate signature"
4. 填写相关信息
5. 点击 "OK"

#### 手动签名（用于发布）

1. 生成密钥库：
   ```bash
   keytool -genkeypair -alias labx -keyalg RSA -keysize 2048 -validity 3650 -keystore labx.p12 -storetype PKCS12
   ```

2. 在 DevEco Studio 中配置签名证书

### 步骤 6: 同步项目

在 DevEco Studio 中：
1. 点击 "Sync" 按钮（或 File > Sync Project）
2. 等待依赖下载和索引完成

### 步骤 7: 编译应用

#### 方式 1: 使用 DevEco Studio

1. 连接 HarmonyOS 设备或启动模拟器
2. 点击工具栏的 "Run" 按钮（绿色三角形）
3. 选择目标设备
4. 等待编译和安装完成

#### 方式 2: 使用命令行

```bash
# 编译 HAP 包（Debug）
npm run build:harmony

# 或直接使用 hvigor
cd harmony
./hvigorw assembleHap --mode module -p product=default
```

编译产物位置：
```
harmony/entry/build/default/outputs/default/entry-default-signed.hap
```

### 步骤 8: 安装到设备

#### 使用 DevEco Studio

应用会自动安装到选定的设备。

#### 使用 hdc 命令行

```bash
# 连接设备
hdc list targets

# 安装 HAP
hdc install harmony/entry/build/default/outputs/default/entry-default-signed.hap

# 启动应用
hdc shell aa start -a EntryAbility -b com.labx.app
```

## 开发调试

### 1. 启动 Metro Server

在一个终端窗口中：

```bash
npm start
```

### 2. 连接调试

在 DevEco Studio 中：
1. 运行应用
2. 打开 "Run > Debug 'entry'"
3. 使用断点调试 ArkTS 代码

对于 React Native 代码调试：
1. 在应用中摇动设备（或按 `Cmd+M`）
2. 选择 "Debug"
3. 在 Chrome 中打开 DevTools

### 3. 热重载

修改 React Native 代码后：
- 保存文件会自动触发热重载
- 或在应用中选择 "Reload"

## 常见问题

### 1. 编译失败：找不到 RNOH

**原因**: `@rnoh/react-native-openharmony` 未正确安装

**解决**:
```bash
rm -rf node_modules
npm install
```

### 2. Bundle 生成失败

**原因**: Metro bundler 配置问题

**解决**:
```bash
# 清除缓存
npm start -- --reset-cache

# 重新生成 bundle
npm run bundle:harmony
```

### 3. 设备不识别

**原因**: HarmonyOS 设备驱动未安装

**解决**:
1. 在设备上启用开发者模式
2. 连接 USB 并授权
3. 检查 hdc 连接：
   ```bash
   hdc list targets
   ```

### 4. 应用闪退

**原因**: 权限未授予或 Bundle 未加载

**解决**:
1. 检查 `module.json5` 中的权限配置
2. 确认 bundle 文件存在：
   ```bash
   ls harmony/entry/src/main/resources/rawfile/
   ```
3. 查看日志：
   ```bash
   hdc hilog
   ```

### 5. 原生模块不工作

**原因**: 某些 React Native 库不支持 HarmonyOS

**解决**:
1. 检查库是否有 HarmonyOS 支持
2. 使用 RNOH 社区提供的替代方案
3. 或实现自定义的 HarmonyOS 桥接

## 性能优化

### 1. 启用 Hermes

在 `app.json` 中：
```json
{
  "react-native": {
    "enableHermes": true
  }
}
```

### 2. 启用 ProGuard/代码混淆

在 `build-profile.json5` 中配置混淆规则。

### 3. 优化 Bundle 大小

```bash
# 分析 bundle 大小
npx react-native-bundle-visualizer

# 使用代码分割
# 在代码中使用 React.lazy 和 Suspense
```

### 4. 启用原生驱动动画

```javascript
Animated.timing(value, {
  toValue: 1,
  useNativeDriver: true  // 使用原生驱动
}).start();
```

## 发布流程

### 1. 准备发布版本

```bash
# 更新版本号
# 修改 harmony/AppScope/app.json5 中的 versionCode 和 versionName

# 生成生产环境 bundle
NODE_ENV=production npm run bundle:harmony
```

### 2. 编译发布版本

```bash
cd harmony
./hvigorw assembleHap --mode module -p product=default -p buildMode=release
```

### 3. 签名

使用发布证书签名 HAP 包。

### 4. 上传到华为应用市场

1. 登录 [AppGallery Connect](https://developer.huawei.com/consumer/cn/service/josp/agc/index.html)
2. 创建应用
3. 上传 HAP 包
4. 填写应用信息
5. 提交审核

## 参考资源

### 官方文档

- [HarmonyOS 开发者文档](https://developer.harmonyos.com/cn/docs)
- [React Native HarmonyOS](https://gitee.com/openharmony-sig/ohos_react_native)
- [DevEco Studio 用户指南](https://developer.harmonyos.com/cn/docs/documentation/doc-guides/tools_overview-0000001053582387)

### 社区资源

- [HarmonyOS 开发者社区](https://developer.huawei.com/consumer/cn/forum/)
- [RNOH GitHub](https://github.com/react-native-oh-library)
- [常见问题 FAQ](https://gitee.com/openharmony-sig/ohos_react_native/wikis/FAQ)

### 工具

- [hdc (HarmonyOS Device Connector)](https://developer.harmonyos.com/cn/docs/documentation/doc-guides/hdc-0000001050164201)
- [hvigor (构建工具)](https://developer.harmonyos.com/cn/docs/documentation/doc-guides/hvigor-0000001052591418)

## 技术支持

如果遇到问题：

1. 查看日志：`hdc hilog`
2. 搜索已知问题：[RNOH Issues](https://gitee.com/openharmony-sig/ohos_react_native/issues)
3. 提交新问题到 GitHub Issues
4. 联系技术支持：yilin@tencent.com

---

**编译成功！** 🎉

现在您的 React Native 应用已经可以在纯血鸿蒙系统上运行了。
