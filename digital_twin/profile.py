from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from datetime import datetime
from .models import PersonalityTrait, Interest


class UserProfile(BaseModel):
    """数字分身的个人资料模型"""

    name: str
    age: Optional[int] = None
    occupation: Optional[str] = None
    bio: Optional[str] = None

    # 性格特征 (Big Five personality traits)
    personality_traits: List[PersonalityTrait] = Field(default_factory=lambda: [
        PersonalityTrait(name="openness", value=0.5, description="开放性"),
        PersonalityTrait(name="conscientiousness", value=0.5, description="尽责性"),
        PersonalityTrait(name="extraversion", value=0.5, description="外向性"),
        PersonalityTrait(name="agreeableness", value=0.5, description="宜人性"),
        PersonalityTrait(name="neuroticism", value=0.5, description="神经质"),
    ])

    # 兴趣爱好
    interests: List[Interest] = Field(default_factory=list)

    # 偏好设置
    preferences: Dict[str, any] = Field(default_factory=dict)

    # 语言风格
    language_style: Dict[str, any] = Field(default_factory=lambda: {
        "formality": 0.5,  # 0=非正式, 1=正式
        "verbosity": 0.5,  # 0=简洁, 1=详细
        "humor": 0.5,      # 0=严肃, 1=幽默
        "emoji_usage": 0.3, # 0=不用, 1=经常用
    })

    # 价值观和信念
    values: List[str] = Field(default_factory=list)

    # 创建和更新时间
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    def update_trait(self, trait_name: str, value: float):
        """更新性格特征值"""
        for trait in self.personality_traits:
            if trait.name == trait_name:
                trait.value = max(0.0, min(1.0, value))
                self.updated_at = datetime.now()
                return

        self.personality_traits.append(
            PersonalityTrait(name=trait_name, value=value)
        )
        self.updated_at = datetime.now()

    def add_interest(self, topic: str, level: float = 0.5, keywords: List[str] = None):
        """添加兴趣"""
        if keywords is None:
            keywords = []

        for interest in self.interests:
            if interest.topic.lower() == topic.lower():
                interest.level = level
                interest.keywords = keywords
                self.updated_at = datetime.now()
                return

        self.interests.append(
            Interest(topic=topic, level=level, keywords=keywords)
        )
        self.updated_at = datetime.now()

    def get_trait_value(self, trait_name: str) -> float:
        """获取性格特征值"""
        for trait in self.personality_traits:
            if trait.name == trait_name:
                return trait.value
        return 0.5

    def to_prompt_context(self) -> str:
        """将个人资料转换为提示词上下文"""
        context = f"你是{self.name}的数字分身。\n\n"

        if self.bio:
            context += f"背景: {self.bio}\n\n"

        if self.age:
            context += f"年龄: {self.age}\n"
        if self.occupation:
            context += f"职业: {self.occupation}\n"

        if self.personality_traits:
            context += "\n性格特征:\n"
            for trait in self.personality_traits:
                level = "低" if trait.value < 0.3 else "中" if trait.value < 0.7 else "高"
                context += f"- {trait.description or trait.name}: {level} ({trait.value:.2f})\n"

        if self.interests:
            context += "\n兴趣爱好:\n"
            for interest in self.interests:
                context += f"- {interest.topic} (兴趣度: {interest.level:.2f})\n"

        if self.values:
            context += f"\n价值观: {', '.join(self.values)}\n"

        style = self.language_style
        context += "\n语言风格:\n"
        context += f"- 正式程度: {'正式' if style['formality'] > 0.6 else '随意' if style['formality'] < 0.4 else '适中'}\n"
        context += f"- 详细程度: {'详细' if style['verbosity'] > 0.6 else '简洁' if style['verbosity'] < 0.4 else '适中'}\n"
        context += f"- 幽默感: {'幽默' if style['humor'] > 0.6 else '严肃' if style['humor'] < 0.4 else '适中'}\n"

        return context
