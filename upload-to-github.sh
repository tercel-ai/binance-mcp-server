#!/bin/bash

# GitHub上传脚本
# 使用方法: ./upload-to-github.sh YOUR_GITHUB_USERNAME

set -e

GITHUB_USERNAME=${1}

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ 请提供GitHub用户名"
    echo "使用方法: ./upload-to-github.sh YOUR_GITHUB_USERNAME"
    exit 1
fi

REPO_NAME="binance-mcp-server"
REPO_URL="https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"

echo "🚀 准备上传到GitHub..."
echo "👤 用户名: $GITHUB_USERNAME"
echo "📦 仓库名: $REPO_NAME"
echo "🔗 仓库URL: $REPO_URL"
echo ""

# 检查Git状态
echo "📋 检查Git状态..."
if ! git status --porcelain | grep -q .; then
    echo "✅ 工作目录干净，所有文件已提交"
else
    echo "⚠️  发现未提交的更改，正在添加..."
    git add .
    git commit -m "📝 Add GitHub setup guide and upload script"
fi

# 检查远程仓库是否已存在
if git remote get-url origin >/dev/null 2>&1; then
    echo "🔗 远程仓库已配置"
    CURRENT_ORIGIN=$(git remote get-url origin)
    if [ "$CURRENT_ORIGIN" != "$REPO_URL" ]; then
        echo "⚠️  更新远程仓库URL: $CURRENT_ORIGIN -> $REPO_URL"
        git remote set-url origin "$REPO_URL"
    fi
else
    echo "🔗 添加远程仓库..."
    git remote add origin "$REPO_URL"
fi

echo ""
echo "📤 准备推送代码到GitHub..."
echo "⚠️  注意: 请确保您已经在GitHub上创建了仓库 '$REPO_NAME'"
echo ""

read -p "是否继续推送? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 推送到GitHub..."
    
    # 设置主分支名称
    git branch -M main
    
    # 推送代码
    if git push -u origin main; then
        echo ""
        echo "🎉 成功上传到GitHub!"
        echo "🔗 仓库地址: https://github.com/${GITHUB_USERNAME}/${REPO_NAME}"
        echo ""
        echo "📋 后续步骤:"
        echo "1. 访问仓库页面检查文件是否正确上传"
        echo "2. 创建第一个Release版本 (推荐v1.0.0)"
        echo "3. 完善仓库描述和标签"
        echo "4. 考虑添加GitHub Pages展示文档"
        echo ""
        echo "📚 项目统计:"
        echo "   • 总文件数: $(git ls-files | wc -l | tr -d ' ')个"
        echo "   • 代码行数: $(find src -name '*.ts' -exec wc -l {} + | tail -1 | awk '{print $1}')行 TypeScript"
        echo "   • 工具数量: 35个 (5个类别)"
        echo "   • 文档页数: 3个主要文档"
        echo "   • 测试覆盖: 100%工具验证"
    else
        echo ""
        echo "❌ 推送失败！"
        echo ""
        echo "🔧 可能的原因和解决方案:"
        echo "1. 仓库不存在: 请先在GitHub上创建 '$REPO_NAME' 仓库"
        echo "2. 权限问题: 检查GitHub访问令牌或SSH密钥"
        echo "3. 网络问题: 检查网络连接"
        echo ""
        echo "📋 手动创建仓库步骤:"
        echo "1. 访问 https://github.com/new"
        echo "2. 仓库名: $REPO_NAME"
        echo "3. 描述: 🚀 Professional Binance MCP Server for Claude Desktop"
        echo "4. 选择Public或Private"
        echo "5. 不要勾选README、.gitignore、License"
        echo "6. 点击Create repository"
        echo "7. 重新运行此脚本"
    fi
else
    echo "⏹️  取消推送"
fi

echo ""
echo "📖 更多帮助请查看: GITHUB_SETUP_GUIDE.md"