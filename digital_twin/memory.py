from typing import List, Dict, Optional
from datetime import datetime, timedelta
import json
import os
from .models import Memory, Message, Interaction
import uuid


class MemorySystem:
    """数字分身的记忆系统"""

    def __init__(self, storage_path: str = "data/memories.json"):
        self.storage_path = storage_path
        self.short_term_memory: List[Interaction] = []
        self.long_term_memory: List[Memory] = []
        self.working_memory: List[Message] = []
        self.max_working_memory = 10
        self.max_short_term = 50

        self._ensure_storage_dir()
        self.load()

    def _ensure_storage_dir(self):
        """确保存储目录存在"""
        os.makedirs(os.path.dirname(self.storage_path), exist_ok=True)

    def add_interaction(self, messages: List[Message], context: Dict = None):
        """添加一次交互到短期记忆"""
        interaction = Interaction(
            id=str(uuid.uuid4()),
            messages=messages,
            context=context or {},
            timestamp=datetime.now()
        )
        self.short_term_memory.append(interaction)

        # 限制短期记忆大小
        if len(self.short_term_memory) > self.max_short_term:
            old_interaction = self.short_term_memory.pop(0)
            self._consolidate_to_long_term(old_interaction)

        return interaction

    def add_to_working_memory(self, message: Message):
        """添加消息到工作记忆"""
        self.working_memory.append(message)

        # 限制工作记忆大小
        if len(self.working_memory) > self.max_working_memory:
            self.working_memory.pop(0)

    def _consolidate_to_long_term(self, interaction: Interaction):
        """将交互整合到长期记忆"""
        summary = self._summarize_interaction(interaction)

        memory = Memory(
            id=str(uuid.uuid4()),
            content=summary,
            timestamp=interaction.timestamp,
            importance=self._calculate_importance(interaction),
            type="conversation",
            tags=self._extract_tags(interaction)
        )
        self.long_term_memory.append(memory)

    def _summarize_interaction(self, interaction: Interaction) -> str:
        """总结交互内容"""
        messages_text = "\n".join([
            f"{msg.role.value}: {msg.content}" for msg in interaction.messages
        ])
        return f"Conversation summary:\n{messages_text}"

    def _calculate_importance(self, interaction: Interaction) -> float:
        """计算交互的重要性"""
        importance = 0.5

        # 消息长度影响重要性
        total_length = sum(len(msg.content) for msg in interaction.messages)
        if total_length > 500:
            importance += 0.2

        # 用户消息数量影响重要性
        user_messages = sum(1 for msg in interaction.messages if msg.role.value == "user")
        if user_messages > 3:
            importance += 0.1

        return min(1.0, importance)

    def _extract_tags(self, interaction: Interaction) -> List[str]:
        """从交互中提取标签"""
        tags = []
        all_text = " ".join([msg.content for msg in interaction.messages]).lower()

        keywords = {
            "工作": ["工作", "项目", "任务", "会议"],
            "学习": ["学习", "课程", "教程", "知识"],
            "生活": ["生活", "日常", "家庭", "朋友"],
            "健康": ["健康", "运动", "锻炼", "饮食"],
            "兴趣": ["爱好", "兴趣", "娱乐", "游戏"],
        }

        for tag, words in keywords.items():
            if any(word in all_text for word in words):
                tags.append(tag)

        return tags

    def get_recent_context(self, max_messages: int = 5) -> List[Message]:
        """获取最近的上下文消息"""
        return self.working_memory[-max_messages:]

    def search_memories(self, query: str, max_results: int = 5) -> List[Memory]:
        """搜索相关记忆"""
        query_lower = query.lower()
        relevant_memories = []

        for memory in self.long_term_memory:
            if query_lower in memory.content.lower():
                relevant_memories.append((memory, memory.importance))

        relevant_memories.sort(key=lambda x: x[1], reverse=True)
        return [mem for mem, _ in relevant_memories[:max_results]]

    def get_memories_by_timeframe(self, days: int = 7) -> List[Memory]:
        """获取指定时间范围内的记忆"""
        cutoff_date = datetime.now() - timedelta(days=days)
        return [
            mem for mem in self.long_term_memory
            if mem.timestamp >= cutoff_date
        ]

    def save(self):
        """保存记忆到文件"""
        data = {
            "short_term_memory": [
                {
                    "id": interaction.id,
                    "messages": [
                        {
                            "role": msg.role.value,
                            "content": msg.content,
                            "timestamp": msg.timestamp.isoformat()
                        }
                        for msg in interaction.messages
                    ],
                    "timestamp": interaction.timestamp.isoformat(),
                    "context": interaction.context
                }
                for interaction in self.short_term_memory
            ],
            "long_term_memory": [
                {
                    "id": mem.id,
                    "content": mem.content,
                    "timestamp": mem.timestamp.isoformat(),
                    "importance": mem.importance,
                    "type": mem.type,
                    "tags": mem.tags
                }
                for mem in self.long_term_memory
            ]
        }

        with open(self.storage_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

    def load(self):
        """从文件加载记忆"""
        if not os.path.exists(self.storage_path):
            return

        try:
            with open(self.storage_path, 'r', encoding='utf-8') as f:
                data = json.load(f)

            self.short_term_memory = [
                Interaction(
                    id=item["id"],
                    messages=[
                        Message(
                            role=msg["role"],
                            content=msg["content"],
                            timestamp=datetime.fromisoformat(msg["timestamp"])
                        )
                        for msg in item["messages"]
                    ],
                    timestamp=datetime.fromisoformat(item["timestamp"]),
                    context=item.get("context", {})
                )
                for item in data.get("short_term_memory", [])
            ]

            self.long_term_memory = [
                Memory(
                    id=item["id"],
                    content=item["content"],
                    timestamp=datetime.fromisoformat(item["timestamp"]),
                    importance=item["importance"],
                    type=item["type"],
                    tags=item["tags"]
                )
                for item in data.get("long_term_memory", [])
            ]
        except Exception as e:
            print(f"Error loading memories: {e}")

    def clear_all(self):
        """清除所有记忆"""
        self.short_term_memory = []
        self.long_term_memory = []
        self.working_memory = []
