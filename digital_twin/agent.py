import os
from typing import List, Optional, Dict
from anthropic import Anthropic
from .profile import UserProfile
from .memory import MemorySystem
from .personality import Personality
from .models import Message, MessageRole
from datetime import datetime


class DigitalTwinAgent:
    """数字分身AI代理"""

    def __init__(
        self,
        profile: UserProfile,
        api_key: Optional[str] = None,
        model: str = "claude-3-5-sonnet-20241022",
        memory_path: str = "data/memories.json"
    ):
        self.profile = profile
        self.personality = Personality(profile)
        self.memory = MemorySystem(memory_path)

        api_key = api_key or os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            raise ValueError("ANTHROPIC_API_KEY not found in environment variables")

        self.client = Anthropic(api_key=api_key)
        self.model = model

    def chat(self, user_message: str, context: Optional[Dict] = None) -> str:
        """与数字分身对话"""
        user_msg = Message(
            role=MessageRole.USER,
            content=user_message,
            timestamp=datetime.now()
        )
        self.memory.add_to_working_memory(user_msg)

        system_prompt = self._build_system_prompt()

        conversation_history = self._build_conversation_history()

        try:
            response = self.client.messages.create(
                model=self.model,
                max_tokens=2048,
                system=system_prompt,
                messages=conversation_history
            )

            assistant_response = response.content[0].text

            assistant_msg = Message(
                role=MessageRole.ASSISTANT,
                content=assistant_response,
                timestamp=datetime.now()
            )
            self.memory.add_to_working_memory(assistant_msg)

            self.memory.add_interaction([user_msg, assistant_msg], context)

            self._learn_from_interaction(user_message, assistant_response)

            return assistant_response

        except Exception as e:
            return f"抱歉，发生了错误: {str(e)}"

    def _build_system_prompt(self) -> str:
        """构建系统提示词"""
        base_prompt = self.personality.get_conversation_prompt()

        recent_memories = self.memory.get_memories_by_timeframe(days=7)
        if recent_memories:
            base_prompt += "\n\n最近的重要记忆:\n"
            for mem in recent_memories[:3]:
                base_prompt += f"- {mem.content[:100]}...\n"

        return base_prompt

    def _build_conversation_history(self) -> List[Dict[str, str]]:
        """构建对话历史"""
        messages = []
        recent_messages = self.memory.get_recent_context(max_messages=10)

        for msg in recent_messages:
            messages.append({
                "role": msg.role.value,
                "content": msg.content
            })

        return messages

    def _learn_from_interaction(self, user_message: str, assistant_response: str):
        """从交互中学习，更新个人资料"""
        user_msg_lower = user_message.lower()

        interests_keywords = {
            "编程": ["编程", "代码", "开发", "程序"],
            "音乐": ["音乐", "歌曲", "演唱会"],
            "运动": ["运动", "健身", "跑步", "游泳"],
            "阅读": ["阅读", "书", "小说"],
            "旅行": ["旅行", "旅游", "出国"],
            "美食": ["美食", "餐厅", "烹饪"],
        }

        for topic, keywords in interests_keywords.items():
            if any(keyword in user_msg_lower for keyword in keywords):
                current_interests = [i.topic for i in self.profile.interests]
                if topic not in current_interests:
                    self.profile.add_interest(topic, level=0.3, keywords=keywords)
                else:
                    for interest in self.profile.interests:
                        if interest.topic == topic:
                            interest.level = min(1.0, interest.level + 0.05)

    def get_profile_summary(self) -> str:
        """获取个人资料摘要"""
        summary = f"数字分身: {self.profile.name}\n"
        summary += "=" * 40 + "\n\n"

        if self.profile.bio:
            summary += f"简介: {self.profile.bio}\n\n"

        summary += "性格特征:\n"
        for trait in self.profile.personality_traits:
            summary += f"  {trait.description or trait.name}: {trait.value:.2f}\n"

        if self.profile.interests:
            summary += "\n兴趣爱好:\n"
            for interest in self.profile.interests:
                summary += f"  {interest.topic}: {interest.level:.2f}\n"

        summary += f"\n总交互次数: {len(self.memory.short_term_memory)}\n"
        summary += f"长期记忆数量: {len(self.memory.long_term_memory)}\n"

        return summary

    def save_state(self):
        """保存代理状态"""
        self.memory.save()

    def reset_conversation(self):
        """重置当前对话"""
        self.memory.working_memory = []

    def search_past_conversations(self, query: str, max_results: int = 5) -> List[str]:
        """搜索过去的对话"""
        memories = self.memory.search_memories(query, max_results)
        return [mem.content for mem in memories]

    async def chat_stream(self, user_message: str, context: Optional[Dict] = None):
        """流式对话（生成器）"""
        user_msg = Message(
            role=MessageRole.USER,
            content=user_message,
            timestamp=datetime.now()
        )
        self.memory.add_to_working_memory(user_msg)

        system_prompt = self._build_system_prompt()
        conversation_history = self._build_conversation_history()

        full_response = ""

        try:
            with self.client.messages.stream(
                model=self.model,
                max_tokens=2048,
                system=system_prompt,
                messages=conversation_history
            ) as stream:
                for text in stream.text_stream:
                    full_response += text
                    yield text

            assistant_msg = Message(
                role=MessageRole.ASSISTANT,
                content=full_response,
                timestamp=datetime.now()
            )
            self.memory.add_to_working_memory(assistant_msg)
            self.memory.add_interaction([user_msg, assistant_msg], context)
            self._learn_from_interaction(user_message, full_response)

        except Exception as e:
            yield f"抱歉，发生了错误: {str(e)}"
