from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
from datetime import datetime
from enum import Enum


class MessageRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


class Message(BaseModel):
    role: MessageRole
    content: str
    timestamp: datetime = Field(default_factory=datetime.now)
    metadata: Dict[str, Any] = Field(default_factory=dict)


class Interaction(BaseModel):
    id: str
    messages: List[Message]
    timestamp: datetime = Field(default_factory=datetime.now)
    context: Dict[str, Any] = Field(default_factory=dict)
    summary: Optional[str] = None


class PersonalityTrait(BaseModel):
    name: str
    value: float = Field(ge=0.0, le=1.0, description="Trait intensity from 0 to 1")
    description: Optional[str] = None


class Interest(BaseModel):
    topic: str
    level: float = Field(ge=0.0, le=1.0, description="Interest level from 0 to 1")
    keywords: List[str] = Field(default_factory=list)


class Memory(BaseModel):
    id: str
    content: str
    timestamp: datetime = Field(default_factory=datetime.now)
    importance: float = Field(ge=0.0, le=1.0, default=0.5)
    type: str = "general"
    tags: List[str] = Field(default_factory=list)
    embedding: Optional[List[float]] = None
