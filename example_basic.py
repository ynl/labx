"""
基础使用示例：创建并与数字分身AI代理对话
"""

import os
from dotenv import load_dotenv
from digital_twin import DigitalTwinAgent, UserProfile

load_dotenv()


def main():
    print("=" * 60)
    print("数字分身AI代理 - 基础示例")
    print("=" * 60)

    profile = UserProfile(
        name="小明",
        age=28,
        occupation="软件工程师",
        bio="一个热爱技术、喜欢学习新知识的程序员",
    )

    profile.add_interest("编程", level=0.9, keywords=["Python", "AI", "机器学习"])
    profile.add_interest("阅读", level=0.7, keywords=["科幻", "技术书籍"])
    profile.add_interest("运动", level=0.6, keywords=["跑步", "健身"])

    profile.update_trait("openness", 0.8)
    profile.update_trait("conscientiousness", 0.7)
    profile.update_trait("extraversion", 0.5)

    profile.language_style["formality"] = 0.4
    profile.language_style["verbosity"] = 0.6
    profile.language_style["humor"] = 0.7

    agent = DigitalTwinAgent(
        profile=profile,
        api_key=os.getenv("ANTHROPIC_API_KEY")
    )

    print("\n个人资料摘要:")
    print(agent.get_profile_summary())

    print("\n开始对话 (输入 'quit' 退出, 'summary' 查看摘要)")
    print("-" * 60)

    while True:
        user_input = input("\n你: ").strip()

        if not user_input:
            continue

        if user_input.lower() == 'quit':
            print("\n保存状态并退出...")
            agent.save_state()
            break

        if user_input.lower() == 'summary':
            print("\n" + agent.get_profile_summary())
            continue

        if user_input.lower() == 'reset':
            agent.reset_conversation()
            print("\n对话已重置")
            continue

        try:
            response = agent.chat(user_input)
            print(f"\n数字分身: {response}")
        except Exception as e:
            print(f"\n错误: {e}")

    print("\n再见!")


if __name__ == "__main__":
    main()
