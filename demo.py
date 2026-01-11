#!/usr/bin/env python3
"""
数字分身 AI Agent 演示脚本
展示系统核心功能（无需 API 密钥）
"""

import sys
sys.path.insert(0, '.')

from digital_twin.profile import UserProfile
from digital_twin.memory import MemorySystem
from digital_twin.personality import Personality
from digital_twin.models import Message, MessageRole


def print_section(title):
    """打印章节标题"""
    print("\n" + "=" * 70)
    print(f"  {title}")
    print("=" * 70 + "\n")


def demo_profile():
    """演示个人资料系统"""
    print_section("1. 个人资料系统演示")

    # 创建个人资料
    profile = UserProfile(
        name="小明",
        age=28,
        occupation="AI研究员",
        bio="一个对人工智能充满热情的研究者，喜欢探索新技术"
    )

    print("📋 创建了个人资料:")
    print(f"  姓名: {profile.name}")
    print(f"  年龄: {profile.age}")
    print(f"  职业: {profile.occupation}")
    print(f"  简介: {profile.bio}")

    # 设置性格特征
    print("\n🎭 设置性格特征 (基于大五人格模型):")
    profile.update_trait("openness", 0.9)        # 高度开放
    profile.update_trait("conscientiousness", 0.8)  # 高度尽责
    profile.update_trait("extraversion", 0.6)    # 中等外向
    profile.update_trait("agreeableness", 0.7)   # 较高宜人性
    profile.update_trait("neuroticism", 0.3)     # 低神经质

    for trait in profile.personality_traits:
        level = "高" if trait.value >= 0.7 else "中" if trait.value >= 0.4 else "低"
        print(f"  {trait.description}: {level} ({trait.value:.1f})")

    # 添加兴趣
    print("\n🎯 添加兴趣爱好:")
    profile.add_interest("人工智能", level=0.95, keywords=["机器学习", "深度学习", "NLP"])
    profile.add_interest("编程", level=0.9, keywords=["Python", "JavaScript"])
    profile.add_interest("阅读", level=0.7, keywords=["科技", "哲学", "科幻"])

    for interest in profile.interests:
        print(f"  {interest.topic}: {interest.level:.2f} - {', '.join(interest.keywords)}")

    # 设置语言风格
    print("\n💬 语言风格设置:")
    profile.language_style["formality"] = 0.4   # 较随意
    profile.language_style["verbosity"] = 0.7   # 较详细
    profile.language_style["humor"] = 0.6       # 适度幽默

    style_desc = {
        "formality": "正式程度",
        "verbosity": "详细程度",
        "humor": "幽默感",
        "emoji_usage": "表情符号"
    }

    for key, value in profile.language_style.items():
        desc = style_desc.get(key, key)
        print(f"  {desc}: {value:.1f}")

    return profile


def demo_personality(profile):
    """演示性格系统"""
    print_section("2. 性格系统演示")

    personality = Personality(profile)

    # 生成对话提示
    print("🤖 生成的对话提示词:\n")
    prompt = personality.get_conversation_prompt()
    print(prompt)

    # 回复风格偏好
    print(f"\n📝 回复长度偏好: {personality.get_response_length_preference()}")

    # 情感表达判断
    test_contexts = [
        "我今天考试通过了，太开心了！",
        "今天天气不错",
        "我遇到了一些困难，感觉有点沮丧"
    ]

    print("\n😊 情感表达判断:")
    for context in test_contexts:
        should_show = personality.should_show_emotion(context)
        emoji = "✓" if should_show else "✗"
        print(f"  {emoji} \"{context}\" - {'会' if should_show else '不会'}表达情感")

    return personality


def demo_memory():
    """演示记忆系统"""
    print_section("3. 记忆系统演示")

    memory = MemorySystem(storage_path="data/demo_memories.json")

    print("🧠 记忆系统架构:")
    print("  - 工作记忆: 保存当前对话上下文")
    print("  - 短期记忆: 最近的交互历史")
    print("  - 长期记忆: 重要信息的永久存储")

    # 模拟对话
    print("\n💭 模拟对话交互:\n")

    conversations = [
        ("你好！我想了解一下机器学习", "你好！很高兴和你讨论机器学习。机器学习是AI的核心..."),
        ("Python 适合做什么？", "Python 非常适合数据科学、机器学习、Web开发等..."),
        ("推荐一些学习资源", "我推荐从 Coursera 的机器学习课程开始..."),
    ]

    for i, (user_msg, assistant_msg) in enumerate(conversations, 1):
        messages = [
            Message(role=MessageRole.USER, content=user_msg),
            Message(role=MessageRole.ASSISTANT, content=assistant_msg)
        ]

        # 添加到工作记忆
        for msg in messages:
            memory.add_to_working_memory(msg)

        # 添加交互
        interaction = memory.add_interaction(messages, context={"topic": "学习"})

        print(f"对话 {i}:")
        print(f"  👤 用户: {user_msg}")
        print(f"  🤖 助手: {assistant_msg}")
        print(f"  💾 交互ID: {interaction.id[:16]}...")
        print()

    print(f"📊 当前记忆状态:")
    print(f"  - 工作记忆: {len(memory.working_memory)} 条消息")
    print(f"  - 短期记忆: {len(memory.short_term_memory)} 次交互")
    print(f"  - 长期记忆: {len(memory.long_term_memory)} 条记忆")

    # 获取最近上下文
    print(f"\n📜 最近 3 条消息:")
    recent = memory.get_recent_context(max_messages=3)
    for msg in recent:
        role_emoji = "👤" if msg.role == MessageRole.USER else "🤖"
        print(f"  {role_emoji} {msg.content[:50]}...")

    # 保存记忆
    memory.save()
    print(f"\n💾 记忆已保存到: {memory.storage_path}")

    return memory


def demo_integration(profile, memory):
    """演示系统集成"""
    print_section("4. 系统集成演示")

    print("🔗 整合所有组件:")
    print("  ✓ 个人资料系统")
    print("  ✓ 性格系统")
    print("  ✓ 记忆系统")

    print("\n📋 生成完整的代理状态摘要:\n")
    print("-" * 70)
    print(f"数字分身: {profile.name}")
    print("=" * 70)

    if profile.bio:
        print(f"\n简介: {profile.bio}")

    print(f"\n基本信息:")
    if profile.age:
        print(f"  年龄: {profile.age}")
    if profile.occupation:
        print(f"  职业: {profile.occupation}")

    print(f"\n性格特征:")
    for trait in profile.personality_traits[:3]:  # 显示前3个
        level = "高" if trait.value >= 0.7 else "中" if trait.value >= 0.4 else "低"
        print(f"  {trait.description}: {level} ({trait.value:.2f})")

    print(f"\n兴趣爱好:")
    for interest in profile.interests[:3]:  # 显示前3个
        print(f"  {interest.topic}: {interest.level:.2f}")

    print(f"\n记忆统计:")
    print(f"  总交互次数: {len(memory.short_term_memory)}")
    print(f"  长期记忆: {len(memory.long_term_memory)} 条")

    print("-" * 70)


def main():
    """主函数"""
    print("\n" + "╔" + "=" * 68 + "╗")
    print("║" + " " * 20 + "数字分身 AI Agent 演示" + " " * 20 + "║")
    print("╚" + "=" * 68 + "╝")

    print("\n本演示展示数字分身系统的核心功能（无需 API 密钥）")
    print("包括：个人资料管理、性格系统、记忆系统和系统集成")

    # 运行各个演示
    profile = demo_profile()
    personality = demo_personality(profile)
    memory = demo_memory()
    demo_integration(profile, memory)

    # 总结
    print_section("演示完成")
    print("✅ 所有核心功能演示完成！\n")
    print("📚 下一步:")
    print("  1. 设置 ANTHROPIC_API_KEY 环境变量以启用完整对话功能")
    print("  2. 运行 'python example_basic.py' 查看完整示例")
    print("  3. 运行 'python run_api.py' 启动 API 服务器")
    print("  4. 访问 http://localhost:8000/docs 查看 API 文档")
    print("\n💡 提示: 运行 'python test_system.py' 进行系统验证测试")
    print()


if __name__ == "__main__":
    main()
