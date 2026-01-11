"""
高级使用示例：自定义性格和记忆搜索
"""

import os
import asyncio
from dotenv import load_dotenv
from digital_twin import DigitalTwinAgent, UserProfile

load_dotenv()


async def stream_chat_example(agent: DigitalTwinAgent, message: str):
    """流式对话示例"""
    print(f"\n你: {message}")
    print("数字分身: ", end="", flush=True)

    async for chunk in agent.chat_stream(message):
        print(chunk, end="", flush=True)

    print()


def main():
    print("=" * 60)
    print("数字分身AI代理 - 高级示例")
    print("=" * 60)

    profile = UserProfile(
        name="AI助手",
        bio="一个富有创造力、善于思考的数字伙伴"
    )

    profile.update_trait("openness", 0.9)
    profile.update_trait("conscientiousness", 0.8)
    profile.update_trait("extraversion", 0.7)
    profile.update_trait("agreeableness", 0.8)
    profile.update_trait("neuroticism", 0.3)

    profile.language_style["formality"] = 0.3
    profile.language_style["verbosity"] = 0.7
    profile.language_style["humor"] = 0.8

    agent = DigitalTwinAgent(profile=profile)

    print("\n1. 基础对话")
    print("-" * 60)
    response = agent.chat("你好！能介绍一下你自己吗？")
    print(f"数字分身: {response}")

    print("\n2. 带上下文的对话")
    print("-" * 60)
    context = {"topic": "技术讨论", "mood": "好奇"}
    response = agent.chat("你对人工智能的未来有什么看法？", context=context)
    print(f"数字分身: {response}")

    print("\n3. 流式对话示例")
    print("-" * 60)
    asyncio.run(stream_chat_example(
        agent,
        "给我讲一个关于AI的有趣故事吧"
    ))

    print("\n4. 多轮对话")
    print("-" * 60)
    questions = [
        "我最近在学习Python，有什么建议吗？",
        "那我应该从哪些项目开始练习呢？",
        "谢谢你的建议！"
    ]

    for question in questions:
        print(f"\n你: {question}")
        response = agent.chat(question)
        print(f"数字分身: {response}")

    print("\n5. 搜索过去的对话")
    print("-" * 60)
    search_results = agent.search_past_conversations("Python", max_results=3)
    if search_results:
        print("找到以下相关记忆:")
        for i, result in enumerate(search_results, 1):
            print(f"\n记忆 {i}:")
            print(result[:200] + "..." if len(result) > 200 else result)
    else:
        print("未找到相关记忆")

    print("\n6. 查看更新后的个人资料")
    print("-" * 60)
    print(agent.get_profile_summary())

    agent.save_state()
    print("\n状态已保存！")


if __name__ == "__main__":
    main()
