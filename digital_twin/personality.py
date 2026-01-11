from typing import Dict, List
from .profile import UserProfile


class Personality:
    """数字分身的性格系统，用于影响对话风格和行为"""

    def __init__(self, profile: UserProfile):
        self.profile = profile

    def adjust_response_style(self, base_response: str) -> str:
        """根据性格特征调整回复风格"""
        style = self.profile.language_style

        # 根据正式程度调整
        if style.get("formality", 0.5) > 0.7:
            base_response = self._make_formal(base_response)
        elif style.get("formality", 0.5) < 0.3:
            base_response = self._make_casual(base_response)

        return base_response

    def _make_formal(self, text: str) -> str:
        """使文本更正式"""
        replacements = {
            "嗯": "是的",
            "咋": "怎么",
            "啥": "什么",
            "咋样": "如何",
        }
        for informal, formal in replacements.items():
            text = text.replace(informal, formal)
        return text

    def _make_casual(self, text: str) -> str:
        """使文本更随意"""
        return text

    def get_conversation_prompt(self) -> str:
        """获取对话提示词"""
        prompt = self.profile.to_prompt_context()

        prompt += "\n\n对话指南:\n"

        openness = self.profile.get_trait_value("openness")
        if openness > 0.7:
            prompt += "- 对新想法和创新概念保持开放和好奇\n"
        elif openness < 0.3:
            prompt += "- 倾向于传统和已验证的方法\n"

        extraversion = self.profile.get_trait_value("extraversion")
        if extraversion > 0.7:
            prompt += "- 以热情和外向的方式交流\n"
        elif extraversion < 0.3:
            prompt += "- 以内敛和深思熟虑的方式交流\n"

        agreeableness = self.profile.get_trait_value("agreeableness")
        if agreeableness > 0.7:
            prompt += "- 表现出同理心和合作态度\n"

        conscientiousness = self.profile.get_trait_value("conscientiousness")
        if conscientiousness > 0.7:
            prompt += "- 注重细节和组织性\n"

        prompt += "\n请以符合上述特征的方式回应用户的消息。"

        return prompt

    def should_show_emotion(self, context: str) -> bool:
        """判断是否应该表达情感"""
        neuroticism = self.profile.get_trait_value("neuroticism")
        extraversion = self.profile.get_trait_value("extraversion")

        emotional_keywords = ["开心", "难过", "生气", "激动", "担心", "害怕"]
        has_emotional_content = any(keyword in context for keyword in emotional_keywords)

        if has_emotional_content and (neuroticism > 0.6 or extraversion > 0.6):
            return True

        return False

    def get_response_length_preference(self) -> str:
        """获取回复长度偏好"""
        verbosity = self.profile.language_style.get("verbosity", 0.5)

        if verbosity > 0.7:
            return "详细和全面"
        elif verbosity < 0.3:
            return "简洁和直接"
        else:
            return "适中"
