# 数字分身 AI Agent (Digital Twin AI Agent)

一个基于 Anthropic Claude API 的智能数字分身系统，能够模拟个人特征、维护记忆系统，并以符合设定性格的方式进行对话交互。

## ✨ 核心特性

### 1. 个人资料管理
- 基本信息：姓名、年龄、职业、个人简介
- 性格特征：基于大五人格模型（开放性、尽责性、外向性、宜人性、神经质）
- 兴趣爱好：可定制的兴趣主题和关键词
- 语言风格：正式度、详细度、幽默感等可调节参数
- 价值观和信念系统

### 2. 智能记忆系统
- **工作记忆**：保存当前对话的上下文（短期）
- **短期记忆**：最近的交互历史
- **长期记忆**：重要对话的自动整合和存储
- **记忆检索**：基于关键词搜索相关历史对话
- **自动标签**：智能提取对话主题标签

### 3. 性格系统
- 根据性格特征调整对话风格
- 动态情感表达
- 个性化回复长度和正式程度
- 符合设定特征的行为模拟

### 4. 学习能力
- 从对话中自动学习用户兴趣
- 动态调整兴趣权重
- 记忆重要信息并在后续对话中应用

### 5. API 接口
- RESTful API 支持
- 完整的 OpenAPI 文档
- 支持同步和流式对话
- 个人资料管理接口
- 记忆搜索功能

## 🚀 快速开始

### 安装依赖

```bash
pip install -r requirements.txt
```

### 配置环境变量

复制 `.env.example` 为 `.env` 并填入你的 API 密钥：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
ANTHROPIC_API_KEY=your_api_key_here
DIGITAL_TWIN_NAME=你的数字分身名称
DIGITAL_TWIN_BIO=你的数字分身简介
```

### 基础使用示例

```python
from digital_twin import DigitalTwinAgent, UserProfile

# 创建个人资料
profile = UserProfile(
    name="小明",
    age=28,
    occupation="软件工程师",
    bio="一个热爱技术的程序员"
)

# 添加兴趣
profile.add_interest("编程", level=0.9)
profile.add_interest("阅读", level=0.7)

# 设置性格特征
profile.update_trait("openness", 0.8)  # 高开放性
profile.update_trait("extraversion", 0.6)  # 中等外向性

# 创建数字分身代理
agent = DigitalTwinAgent(profile=profile)

# 开始对话
response = agent.chat("你好！今天天气真不错")
print(response)

# 保存状态
agent.save_state()
```

### 运行示例程序

**基础示例**：
```bash
python example_basic.py
```

**高级示例**（包含流式对话、记忆搜索等）：
```bash
python example_advanced.py
```

### 启动 API 服务器

```bash
python run_api.py
```

服务器启动后，访问：
- API 文档：http://localhost:8000/docs
- 交互式文档：http://localhost:8000/redoc

## 📚 API 使用示例

### 对话接口

```bash
curl -X POST "http://localhost:8000/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "你好！",
    "context": {"mood": "happy"}
  }'
```

### 获取个人资料

```bash
curl -X GET "http://localhost:8000/profile"
```

### 更新兴趣

```bash
curl -X POST "http://localhost:8000/profile/interest/add" \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "音乐",
    "level": 0.8,
    "keywords": ["流行", "古典", "爵士"]
  }'
```

### 搜索记忆

```bash
curl -X GET "http://localhost:8000/memories/search?query=编程&max_results=5"
```

## 🏗️ 项目结构

```
labx/
├── digital_twin/           # 核心模块
│   ├── __init__.py        # 包初始化
│   ├── models.py          # 数据模型
│   ├── profile.py         # 个人资料管理
│   ├── memory.py          # 记忆系统
│   ├── personality.py     # 性格系统
│   ├── agent.py           # 主代理逻辑
│   └── api.py             # FastAPI 接口
├── data/                  # 数据存储目录
│   └── memories.json      # 记忆存储文件
├── example_basic.py       # 基础使用示例
├── example_advanced.py    # 高级使用示例
├── run_api.py            # API 服务器启动脚本
├── requirements.txt      # 依赖列表
├── .env.example          # 环境变量示例
├── .gitignore           # Git 忽略文件
└── README.md            # 项目文档
```

## 🎯 核心组件说明

### UserProfile (个人资料)

管理数字分身的个人信息、性格特征和偏好设置。

**主要属性**：
- `personality_traits`: 性格特征列表（大五人格）
- `interests`: 兴趣爱好列表
- `language_style`: 语言风格设置
- `values`: 价值观列表

**主要方法**：
- `update_trait(trait_name, value)`: 更新性格特征
- `add_interest(topic, level, keywords)`: 添加兴趣
- `to_prompt_context()`: 生成提示词上下文

### MemorySystem (记忆系统)

管理不同层次的记忆，支持自动整合和检索。

**主要方法**：
- `add_interaction(messages, context)`: 添加交互记录
- `search_memories(query, max_results)`: 搜索相关记忆
- `get_recent_context(max_messages)`: 获取最近上下文
- `save()` / `load()`: 持久化存储

### Personality (性格系统)

根据设定的性格特征影响对话风格。

**主要方法**：
- `get_conversation_prompt()`: 生成个性化提示词
- `adjust_response_style(response)`: 调整回复风格
- `should_show_emotion(context)`: 判断是否表达情感

### DigitalTwinAgent (主代理)

整合所有组件，提供统一的交互接口。

**主要方法**：
- `chat(message, context)`: 同步对话
- `chat_stream(message, context)`: 流式对话
- `get_profile_summary()`: 获取状态摘要
- `search_past_conversations(query)`: 搜索历史对话
- `save_state()`: 保存所有状态

## 🔧 配置选项

### 性格特征 (0.0 - 1.0)

- **openness** (开放性): 对新体验的开放程度
- **conscientiousness** (尽责性): 组织性和可靠性
- **extraversion** (外向性): 社交性和活力水平
- **agreeableness** (宜人性): 同理心和合作性
- **neuroticism** (神经质): 情绪稳定性

### 语言风格 (0.0 - 1.0)

- **formality**: 正式程度（0=非正式，1=正式）
- **verbosity**: 详细程度（0=简洁，1=详细）
- **humor**: 幽默感（0=严肃，1=幽默）
- **emoji_usage**: 表情符号使用频率

## 🎨 使用场景

1. **个人助手**：创建符合你个性的AI助手
2. **虚拟角色**：为游戏或应用创建有个性的NPC
3. **客服机器人**：定制符合品牌调性的客服
4. **教育辅导**：创建个性化的学习伙伴
5. **情感陪伴**：提供有温度的对话体验

## 📝 开发计划

- [ ] 集成向量数据库实现语义搜索
- [ ] 添加多模态支持（图片、语音）
- [ ] 实现更复杂的学习算法
- [ ] 支持多个数字分身管理
- [ ] 添加情感分析功能
- [ ] Web 前端界面
- [ ] 移动应用集成

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🙏 致谢

本项目使用 [Anthropic Claude API](https://www.anthropic.com/) 提供 AI 能力支持。

---

**注意**: 使用本项目需要有效的 Anthropic API 密钥。请访问 [Anthropic官网](https://www.anthropic.com/) 获取。
