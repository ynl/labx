"""
启动数字分身AI代理的API服务器
"""

import os
from dotenv import load_dotenv
import uvicorn

load_dotenv()

if __name__ == "__main__":
    print("=" * 60)
    print("数字分身AI代理 API 服务器")
    print("=" * 60)
    print("\nAPI文档: http://localhost:8000/docs")
    print("交互式API: http://localhost:8000/redoc")
    print("\n按 Ctrl+C 停止服务器")
    print("=" * 60)

    uvicorn.run(
        "digital_twin.api:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
