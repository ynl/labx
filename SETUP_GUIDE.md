# 详细设置指南

本指南将帮助你一步步设置 AI Creativity Showcase 应用。

## 第一步：环境准备

### 1.1 安装 Node.js

确保你的系统安装了 Node.js 16 或更高版本。

```bash
# 检查 Node.js 版本
node --version

# 检查 npm 版本
npm --version
```

如果未安装，请访问 [nodejs.org](https://nodejs.org) 下载安装。

### 1.2 安装 Expo CLI

```bash
npm install -g expo-cli
```

## 第二步：创建 Supabase 项目

### 2.1 注册账号

1. 访问 [supabase.com](https://supabase.com)
2. 点击 "Start your project"
3. 使用 GitHub 或 Email 注册账号

### 2.2 创建新项目

1. 登录后，点击 "New Project"
2. 填写项目信息:
   - **Name**: ai-creativity-app (或你喜欢的名称)
   - **Database Password**: 设置一个强密码（保存好）
   - **Region**: 选择离你最近的区域
3. 点击 "Create new project"
4. 等待约 2 分钟，项目初始化完成

### 2.3 设置数据库

1. 在左侧菜单中，点击 "SQL Editor"
2. 点击 "New query"
3. 复制项目根目录下的 `supabase-schema.sql` 文件内容
4. 粘贴到 SQL 编辑器中
5. 点击 "Run" 执行 SQL

你应该看到成功消息，表示表和策略已创建。

### 2.4 获取 API 凭据

1. 点击左侧菜单的设置图标 (齿轮)
2. 选择 "API"
3. 你会看到:
   - **Project URL**: 类似 `https://xxxxx.supabase.co`
   - **API Keys**:
     - `anon public`: 用于客户端
     - `service_role`: 不要在客户端使用！
4. 复制 `Project URL` 和 `anon public` key

## 第三步：配置应用

### 3.1 克隆并安装

```bash
# 克隆项目（如果还没有）
git clone <repository-url>
cd labx

# 安装依赖
npm install
```

### 3.2 配置环境变量

1. 在项目根目录创建 `.env` 文件:
   ```bash
   cp .env.example .env
   ```

2. 编辑 `.env` 文件，填入你的 Supabase 凭据:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://你的项目.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=你的anon-key
   ```

   ⚠️ **注意**: 不要提交 `.env` 文件到 Git！

## 第四步：启动应用

### 4.1 启动开发服务器

```bash
npm start
```

你会看到一个 QR 码和几个选项。

### 4.2 在不同平台运行

#### Web (最简单)

```bash
npm run web
```

浏览器会自动打开应用。

#### iOS (需要 Mac)

1. 安装 Xcode
2. 运行:
   ```bash
   npm run ios
   ```

#### Android

1. 安装 Android Studio 和 Android SDK
2. 启动 Android 模拟器
3. 运行:
   ```bash
   npm run android
   ```

#### 在真实设备上测试

1. 安装 Expo Go 应用:
   - iOS: App Store 搜索 "Expo Go"
   - Android: Play Store 搜索 "Expo Go"

2. 打开 Expo Go，扫描终端显示的 QR 码

## 第五步：验证功能

### 5.1 查看示例数据

如果你运行了 `supabase-schema.sql` 中的示例数据插入语句，你应该能在首页看到 3 个示例作品。

### 5.2 测试上传功能

1. 点击底部 "上传" 标签
2. 选择一张图片
3. 填写标题和描述
4. 点击 "上传作品"
5. 返回首页，应该能看到新上传的作品

### 5.3 测试详情和点赞

1. 点击任意作品卡片
2. 查看详情页
3. 点击 "点赞" 按钮
4. 返回首页，点赞数应该增加

## 第六步：自定义和扩展

### 6.1 添加图片上传到 Supabase Storage

当前应用使用 URL 作为图片地址。如果你想实现真正的图片上传:

1. 在 Supabase 中创建 Storage Bucket:
   - 进入 Storage
   - 点击 "New bucket"
   - 命名为 "ai-creations"
   - 设置为 Public

2. 修改 `src/screens/UploadScreen.tsx`:
   ```typescript
   import { supabase } from '../lib/supabase';

   // 在 handleSubmit 中上传图片
   const uploadImage = async (uri: string) => {
     const response = await fetch(uri);
     const blob = await response.blob();
     const fileName = `${Date.now()}.jpg`;

     const { data, error } = await supabase
       .storage
       .from('ai-creations')
       .upload(fileName, blob);

     if (error) throw error;

     const { data: publicData } = supabase
       .storage
       .from('ai-creations')
       .getPublicUrl(fileName);

     return publicData.publicUrl;
   };
   ```

### 6.2 添加用户认证

1. 在 Supabase 启用认证:
   - Settings → Authentication
   - 启用 Email 或其他认证方式

2. 安装依赖并实现登录功能

### 6.3 添加收藏功能

1. 创建新表 `favorites`:
   ```sql
   create table favorites (
     id uuid primary key default gen_random_uuid(),
     user_id uuid references auth.users,
     creation_id uuid references ai_creations,
     created_at timestamp default now()
   );
   ```

2. 实现收藏 API 和 UI

## 常见问题

### Q: 为什么看不到数据？

A: 检查:
1. `.env` 文件配置是否正确
2. Supabase SQL 是否执行成功
3. 打开浏览器控制台查看错误信息

### Q: 图片不显示？

A: 示例数据使用的是 Unsplash 图片。如果网络问题无法访问，可以:
1. 替换为其他图片 URL
2. 实现真正的图片上传功能

### Q: 如何部署到生产环境？

A:
- **Web**: `npx expo export:web`，然后部署到 Vercel/Netlify
- **移动应用**: 使用 EAS Build 构建 APK/IPA

### Q: 如何添加更多 AI 模型？

A: 编辑 `src/constants/categories.ts`，在 `AI_MODELS` 数组中添加。

## 下一步

- 🎨 自定义 UI 主题色
- 👥 添加用户系统
- 💬 添加评论功能
- 🔖 实现收藏功能
- 📊 添加数据分析

祝你开发愉快！🚀
