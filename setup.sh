#!/bin/bash

# Binance MCP Server 快速设置脚本

echo "🚀 Binance MCP Server 快速设置"
echo "================================"

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js (版本 >= 18)"
    exit 1
fi

# 检查npm是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装，请确保 npm 可用"
    exit 1
fi

echo "✅ Node.js 版本: $(node --version)"
echo "✅ npm 版本: $(npm --version)"

# 安装依赖
echo ""
echo "📦 安装项目依赖..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败"
    exit 1
fi

# 创建环境变量文件
if [ ! -f .env ]; then
    echo ""
    echo "📝 创建环境配置文件..."
    cp .env.example .env
    echo "✅ 已创建 .env 文件，请编辑此文件并填入你的 Binance API 密钥"
else
    echo "⚠️  .env 文件已存在，跳过创建"
fi

# 构建项目
echo ""
echo "🔨 构建项目..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 项目构建失败"
    exit 1
fi

echo ""
echo "🎉 设置完成！"
echo ""
echo "接下来的步骤："
echo ""
echo "1. 获取 Binance API 密钥："
echo "   https://www.binance.com/cn/my/settings/api-management"
echo ""
echo "2. 配置 Claude Desktop："
echo "   编辑配置文件："
echo "   - macOS: ~/Library/Application Support/Claude/claude_desktop_config.json"
echo "   - Windows: %APPDATA%\Claude\claude_desktop_config.json"
echo ""
echo "   添加以下配置（替换为你的实际路径和API密钥）："
echo '   {'
echo '     "mcpServers": {'
echo '       "binance": {'
echo '         "command": "node",'
echo "         \"args\": [\"$(pwd)/build/index.js\"],"
echo '         "env": {'
echo '           "BINANCE_API_KEY": "your_api_key_here",'
echo '           "BINANCE_SECRET_KEY": "your_secret_key_here",'
echo '           "BINANCE_TESTNET": "false"'
echo '         }'
echo '       }'
echo '     }'
echo '   }'
echo ""
echo "3. 重启 Claude Desktop"
echo ""
echo "需要帮助？查看完整文档："
echo "cat README.md"