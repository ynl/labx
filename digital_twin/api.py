from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict
from .agent import DigitalTwinAgent
from .profile import UserProfile
import os

app = FastAPI(
    title="Digital Twin AI Agent API",
    description="数字分身AI代理的REST API接口",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

agent: Optional[DigitalTwinAgent] = None


class ChatRequest(BaseModel):
    message: str
    context: Optional[Dict] = None


class ChatResponse(BaseModel):
    response: str
    timestamp: str


class ProfileUpdateRequest(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    occupation: Optional[str] = None
    bio: Optional[str] = None


class InterestRequest(BaseModel):
    topic: str
    level: float = 0.5
    keywords: List[str] = []


class TraitUpdateRequest(BaseModel):
    trait_name: str
    value: float


@app.on_event("startup")
async def startup_event():
    """初始化数字分身代理"""
    global agent

    profile = UserProfile(
        name=os.getenv("DIGITAL_TWIN_NAME", "数字助手"),
        bio=os.getenv("DIGITAL_TWIN_BIO", "我是一个智能的数字分身AI代理")
    )

    try:
        agent = DigitalTwinAgent(
            profile=profile,
            api_key=os.getenv("ANTHROPIC_API_KEY")
        )
        print("数字分身代理初始化成功")
    except Exception as e:
        print(f"初始化失败: {e}")


@app.on_event("shutdown")
async def shutdown_event():
    """保存代理状态"""
    if agent:
        agent.save_state()
        print("代理状态已保存")


@app.get("/")
async def root():
    """根路径"""
    return {
        "message": "Digital Twin AI Agent API",
        "version": "0.1.0",
        "status": "running"
    }


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """与数字分身对话"""
    if not agent:
        raise HTTPException(status_code=500, detail="代理未初始化")

    try:
        response = agent.chat(request.message, request.context)
        from datetime import datetime
        return ChatResponse(
            response=response,
            timestamp=datetime.now().isoformat()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/profile")
async def get_profile():
    """获取个人资料"""
    if not agent:
        raise HTTPException(status_code=500, detail="代理未初始化")

    return {
        "name": agent.profile.name,
        "age": agent.profile.age,
        "occupation": agent.profile.occupation,
        "bio": agent.profile.bio,
        "personality_traits": [
            {
                "name": trait.name,
                "value": trait.value,
                "description": trait.description
            }
            for trait in agent.profile.personality_traits
        ],
        "interests": [
            {
                "topic": interest.topic,
                "level": interest.level,
                "keywords": interest.keywords
            }
            for interest in agent.profile.interests
        ],
        "language_style": agent.profile.language_style
    }


@app.post("/profile/update")
async def update_profile(request: ProfileUpdateRequest):
    """更新个人资料"""
    if not agent:
        raise HTTPException(status_code=500, detail="代理未初始化")

    if request.name:
        agent.profile.name = request.name
    if request.age:
        agent.profile.age = request.age
    if request.occupation:
        agent.profile.occupation = request.occupation
    if request.bio:
        agent.profile.bio = request.bio

    from datetime import datetime
    agent.profile.updated_at = datetime.now()

    return {"status": "success", "message": "个人资料已更新"}


@app.post("/profile/interest/add")
async def add_interest(request: InterestRequest):
    """添加兴趣"""
    if not agent:
        raise HTTPException(status_code=500, detail="代理未初始化")

    agent.profile.add_interest(
        topic=request.topic,
        level=request.level,
        keywords=request.keywords
    )

    return {"status": "success", "message": f"已添加兴趣: {request.topic}"}


@app.post("/profile/trait/update")
async def update_trait(request: TraitUpdateRequest):
    """更新性格特征"""
    if not agent:
        raise HTTPException(status_code=500, detail="代理未初始化")

    agent.profile.update_trait(request.trait_name, request.value)

    return {"status": "success", "message": f"已更新特征: {request.trait_name}"}


@app.get("/summary")
async def get_summary():
    """获取代理摘要"""
    if not agent:
        raise HTTPException(status_code=500, detail="代理未初始化")

    summary = agent.get_profile_summary()
    return {"summary": summary}


@app.get("/memories/search")
async def search_memories(query: str, max_results: int = 5):
    """搜索记忆"""
    if not agent:
        raise HTTPException(status_code=500, detail="代理未初始化")

    results = agent.search_past_conversations(query, max_results)
    return {"results": results}


@app.post("/conversation/reset")
async def reset_conversation():
    """重置当前对话"""
    if not agent:
        raise HTTPException(status_code=500, detail="代理未初始化")

    agent.reset_conversation()
    return {"status": "success", "message": "对话已重置"}


@app.post("/save")
async def save_state():
    """手动保存状态"""
    if not agent:
        raise HTTPException(status_code=500, detail="代理未初始化")

    agent.save_state()
    return {"status": "success", "message": "状态已保存"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
