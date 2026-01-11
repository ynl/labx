"""
测试数字分身系统的基本功能
"""

import sys
sys.path.insert(0, '.')

def test_profile():
    """测试个人资料功能"""
    print("=" * 60)
    print("测试 1: 个人资料系统")
    print("=" * 60)

    from digital_twin.profile import UserProfile

    profile = UserProfile(
        name="测试用户",
        age=25,
        occupation="软件工程师",
        bio="这是一个测试用户"
    )

    print(f"✓ 创建个人资料成功: {profile.name}")

    # 测试更新特征
    profile.update_trait("openness", 0.8)
    print(f"✓ 更新性格特征成功: openness = {profile.get_trait_value('openness')}")

    # 测试添加兴趣
    profile.add_interest("编程", level=0.9, keywords=["Python", "AI"])
    print(f"✓ 添加兴趣成功: {profile.interests[0].topic}")

    # 测试生成上下文
    context = profile.to_prompt_context()
    print(f"✓ 生成提示词上下文成功 (长度: {len(context)} 字符)")

    return profile


def test_memory():
    """测试记忆系统"""
    print("\n" + "=" * 60)
    print("测试 2: 记忆系统")
    print("=" * 60)

    from digital_twin.memory import MemorySystem
    from digital_twin.models import Message, MessageRole

    memory = MemorySystem(storage_path="data/test_memories.json")

    print(f"✓ 创建记忆系统成功")

    # 测试添加消息到工作记忆
    msg = Message(role=MessageRole.USER, content="你好")
    memory.add_to_working_memory(msg)
    print(f"✓ 添加到工作记忆成功: {len(memory.working_memory)} 条消息")

    # 测试添加交互
    messages = [
        Message(role=MessageRole.USER, content="今天天气怎么样？"),
        Message(role=MessageRole.ASSISTANT, content="今天天气很好！")
    ]
    interaction = memory.add_interaction(messages)
    print(f"✓ 添加交互记录成功: ID = {interaction.id[:8]}...")

    # 测试获取最近上下文
    recent = memory.get_recent_context(max_messages=5)
    print(f"✓ 获取最近上下文成功: {len(recent)} 条消息")

    return memory


def test_personality():
    """测试性格系统"""
    print("\n" + "=" * 60)
    print("测试 3: 性格系统")
    print("=" * 60)

    from digital_twin.profile import UserProfile
    from digital_twin.personality import Personality

    profile = UserProfile(name="测试用户")
    profile.update_trait("extraversion", 0.8)
    profile.update_trait("openness", 0.9)

    personality = Personality(profile)
    print(f"✓ 创建性格系统成功")

    # 测试生成对话提示
    prompt = personality.get_conversation_prompt()
    print(f"✓ 生成对话提示成功 (长度: {len(prompt)} 字符)")

    # 测试回复长度偏好
    length_pref = personality.get_response_length_preference()
    print(f"✓ 获取回复长度偏好: {length_pref}")

    return personality


def test_models():
    """测试数据模型"""
    print("\n" + "=" * 60)
    print("测试 4: 数据模型")
    print("=" * 60)

    from digital_twin.models import Message, MessageRole, PersonalityTrait, Interest, Memory
    from datetime import datetime

    # 测试消息模型
    msg = Message(role=MessageRole.USER, content="测试消息")
    print(f"✓ 创建消息模型成功: {msg.role.value}")

    # 测试性格特征模型
    trait = PersonalityTrait(name="openness", value=0.8, description="开放性")
    print(f"✓ 创建性格特征模型成功: {trait.name} = {trait.value}")

    # 测试兴趣模型
    interest = Interest(topic="编程", level=0.9, keywords=["Python"])
    print(f"✓ 创建兴趣模型成功: {interest.topic}")

    # 测试记忆模型
    memory = Memory(
        id="test-123",
        content="测试记忆内容",
        importance=0.8,
        type="test",
        tags=["测试"]
    )
    print(f"✓ 创建记忆模型成功: {memory.type}")

    return True


def test_integration():
    """集成测试 - 不需要API密钥的部分"""
    print("\n" + "=" * 60)
    print("测试 5: 系统集成 (无API调用)")
    print("=" * 60)

    from digital_twin.profile import UserProfile
    from digital_twin.memory import MemorySystem
    from digital_twin.personality import Personality
    from digital_twin.models import Message, MessageRole

    # 创建完整的用户资料
    profile = UserProfile(
        name="小明",
        age=28,
        occupation="软件工程师",
        bio="一个热爱技术的程序员"
    )
    profile.update_trait("openness", 0.8)
    profile.update_trait("extraversion", 0.6)
    profile.add_interest("编程", level=0.9)

    print(f"✓ 创建完整个人资料")

    # 创建记忆系统
    memory = MemorySystem(storage_path="data/test_integration.json")

    # 添加一些交互
    for i in range(3):
        messages = [
            Message(role=MessageRole.USER, content=f"测试问题 {i+1}"),
            Message(role=MessageRole.ASSISTANT, content=f"测试回答 {i+1}")
        ]
        memory.add_interaction(messages, context={"test": i})

    print(f"✓ 添加 3 条交互记录")

    # 创建性格系统
    personality = Personality(profile)
    conversation_prompt = personality.get_conversation_prompt()

    print(f"✓ 生成对话提示 ({len(conversation_prompt)} 字符)")

    # 保存记忆
    memory.save()
    print(f"✓ 保存记忆到文件")

    # 重新加载记忆
    memory2 = MemorySystem(storage_path="data/test_integration.json")
    print(f"✓ 重新加载记忆: {len(memory2.short_term_memory)} 条交互")

    return True


def main():
    print("\n")
    print("╔" + "=" * 58 + "╗")
    print("║" + " " * 15 + "数字分身 AI Agent 验证测试" + " " * 15 + "║")
    print("╚" + "=" * 58 + "╝")
    print()

    try:
        # 运行所有测试
        test_models()
        test_profile()
        test_memory()
        test_personality()
        test_integration()

        print("\n" + "=" * 60)
        print("✓✓✓ 所有测试通过！系统运行正常！ ✓✓✓")
        print("=" * 60)
        print("\n注意事项:")
        print("- 完整的对话功能需要设置 ANTHROPIC_API_KEY 环境变量")
        print("- 可以运行 example_basic.py 或 example_advanced.py 进行完整测试")
        print("- 使用 run_api.py 启动 API 服务器")
        print()

        return True

    except Exception as e:
        print(f"\n✗✗✗ 测试失败: {e} ✗✗✗")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
