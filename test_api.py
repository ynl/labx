"""
测试API接口是否能正常加载
"""

import sys
sys.path.insert(0, '.')

def test_api_import():
    """测试API模块导入"""
    print("=" * 60)
    print("测试 API 接口")
    print("=" * 60)

    try:
        from digital_twin.api import app
        print("✓ API 应用导入成功")

        # 检查路由
        routes = [route.path for route in app.routes]
        print(f"✓ 发现 {len(routes)} 个路由:")
        for route in routes:
            if hasattr(route, '__len__'):
                print(f"  - {route}")

        return True
    except Exception as e:
        print(f"✗ API 导入失败: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_fastapi_endpoints():
    """测试FastAPI端点定义"""
    print("\n" + "=" * 60)
    print("测试 API 端点")
    print("=" * 60)

    try:
        from digital_twin.api import app

        # 提取所有端点
        endpoints = []
        for route in app.routes:
            if hasattr(route, 'methods') and hasattr(route, 'path'):
                for method in route.methods:
                    if method != "HEAD":  # 跳过HEAD方法
                        endpoints.append(f"{method:6s} {route.path}")

        print(f"✓ 发现 {len(endpoints)} 个 API 端点:")
        for endpoint in sorted(endpoints):
            print(f"  {endpoint}")

        # 验证关键端点存在
        required_paths = ['/chat', '/profile', '/summary', '/save']
        paths = [route.path for route in app.routes if hasattr(route, 'path')]

        for req_path in required_paths:
            if req_path in paths:
                print(f"✓ 关键端点存在: {req_path}")
            else:
                print(f"✗ 缺少关键端点: {req_path}")

        return True
    except Exception as e:
        print(f"✗ 端点测试失败: {e}")
        import traceback
        traceback.print_exc()
        return False


def main():
    print("\n╔" + "=" * 58 + "╗")
    print("║" + " " * 18 + "API 接口验证测试" + " " * 18 + "║")
    print("╚" + "=" * 58 + "╝\n")

    success = True
    success = test_api_import() and success
    success = test_fastapi_endpoints() and success

    print("\n" + "=" * 60)
    if success:
        print("✓✓✓ API 接口测试通过！ ✓✓✓")
        print("=" * 60)
        print("\n可以使用以下命令启动API服务器:")
        print("  python run_api.py")
        print("\n启动后访问:")
        print("  http://localhost:8000/docs (Swagger UI)")
        print("  http://localhost:8000/redoc (ReDoc)")
    else:
        print("✗✗✗ API 接口测试失败 ✗✗✗")
        print("=" * 60)

    print()
    return success


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
