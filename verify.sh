#!/bin/bash

# LabX HarmonyOS 项目验证脚本
# 用于快速检查项目完整性和编译准备情况

echo "================================================"
echo "  LabX HarmonyOS 项目验证脚本"
echo "================================================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 验证计数器
PASSED=0
FAILED=0
WARNINGS=0

# 检查函数
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅${NC} $2"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}❌${NC} $2 (文件不存在: $1)"
        ((FAILED++))
        return 1
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✅${NC} $2"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}❌${NC} $2 (目录不存在: $1)"
        ((FAILED++))
        return 1
    fi
}

check_command() {
    if command -v $1 &> /dev/null; then
        VERSION=$($1 --version 2>&1 | head -1)
        echo -e "${GREEN}✅${NC} $2: $VERSION"
        ((PASSED++))
        return 0
    else
        echo -e "${YELLOW}⚠️${NC} $2 未安装"
        ((WARNINGS++))
        return 1
    fi
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. 检查开发环境"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_command "node" "Node.js"
check_command "npm" "npm"
check_command "git" "Git"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2. 检查项目根文件"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_file "package.json" "package.json"
check_file "index.js" "React Native 入口文件"
check_file "app.json" "应用配置文件"
check_file "babel.config.js" "Babel 配置"
check_file "metro.config.js" "Metro 配置"
check_file "tsconfig.json" "TypeScript 配置"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3. 检查 React Native 源代码"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_dir "src" "源代码目录"
check_file "src/App.tsx" "应用主入口"
check_dir "src/screens" "页面目录"
check_file "src/screens/LoginScreen.tsx" "登录页面"
check_file "src/screens/HomeScreen.tsx" "主页面"
check_file "src/screens/BillScanScreen.tsx" "账单扫描页面"
check_file "src/screens/ExperimentDetailScreen.tsx" "实验详情页面"
check_file "src/screens/ProfileScreen.tsx" "个人中心页面"
check_dir "src/context" "上下文目录"
check_file "src/context/AuthContext.tsx" "认证上下文"
check_dir "src/services" "服务目录"
check_file "src/services/AuthService.ts" "认证服务"
check_file "src/services/AppInitializer.ts" "应用初始化"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4. 检查 HarmonyOS 原生项目"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_dir "harmony" "HarmonyOS 项目目录"
check_file "harmony/AppScope/app.json5" "应用全局配置"
check_file "harmony/build-profile.json5" "构建配置"
check_file "harmony/hvigorfile.ts" "构建脚本"
check_dir "harmony/entry" "Entry 模块"
check_file "harmony/entry/oh-package.json5" "鸿蒙依赖配置"
check_file "harmony/entry/src/main/module.json5" "模块配置"
check_file "harmony/entry/src/main/ets/entryability/EntryAbility.ts" "应用入口"
check_file "harmony/entry/src/main/ets/pages/Index.ets" "主页面"
check_file "harmony/entry/src/main/resources/base/element/string.json" "字符串资源"
check_file "harmony/entry/src/main/resources/base/element/color.json" "颜色资源"
check_file "harmony/entry/src/main/resources/base/profile/main_pages.json" "页面配置"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "5. 检查文档"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_file "README.md" "项目说明文档"
check_file "BUILDING.md" "快速编译指南"
check_file "HARMONYOS_BUILD_GUIDE.md" "详细构建指南"
check_file "EXPO_TO_RNOH_MIGRATION.md" "Expo 迁移指南"
check_file "VERIFICATION_REPORT.md" "验证报告"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "6. 验证配置文件"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 检查 package.json
if node -e "require('./package.json')" 2>/dev/null; then
    echo -e "${GREEN}✅${NC} package.json 格式正确"
    ((PASSED++))

    PKG_NAME=$(node -e "console.log(require('./package.json').name)")
    PKG_VERSION=$(node -e "console.log(require('./package.json').version)")
    echo "   项目名: $PKG_NAME"
    echo "   版本: $PKG_VERSION"
else
    echo -e "${RED}❌${NC} package.json 格式错误"
    ((FAILED++))
fi

# 检查 TypeScript 配置
if node -e "require('./tsconfig.json')" 2>/dev/null; then
    echo -e "${GREEN}✅${NC} tsconfig.json 格式正确"
    ((PASSED++))
else
    echo -e "${RED}❌${NC} tsconfig.json 格式错误"
    ((FAILED++))
fi

echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "7. 检查依赖安装状态"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅${NC} node_modules 目录存在"
    ((PASSED++))

    # 统计已安装的包
    if command -v find &> /dev/null; then
        PKG_COUNT=$(find node_modules -maxdepth 1 -type d | wc -l)
        echo "   已安装包数量: $PKG_COUNT"
    fi
else
    echo -e "${YELLOW}⚠️${NC} node_modules 目录不存在（需要运行 npm install）"
    ((WARNINGS++))
fi

echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "验证总结"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "通过: ${GREEN}$PASSED${NC}"
echo -e "失败: ${RED}$FAILED${NC}"
echo -e "警告: ${YELLOW}$WARNINGS${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ 项目验证通过！${NC}"
    echo ""
    echo "下一步操作："
    echo "1. 安装依赖: npm install"
    echo "2. 生成 Bundle: npm run bundle:harmony"
    echo "3. 使用 DevEco Studio 打开 harmony/ 目录"
    echo "4. 编译并运行项目"
    echo ""
    echo "详细说明请查看: BUILDING.md"
    exit 0
else
    echo -e "${RED}❌ 项目验证失败，存在 $FAILED 个错误${NC}"
    echo ""
    echo "请检查上述失败项并修复后重试。"
    exit 1
fi
