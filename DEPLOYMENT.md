# Binance MCP 服务器部署指南

本文档详细介绍如何部署Binance MCP服务器，支持本地stdio连接和远程HTTP SSE连接两种模式。

## 概述

Binance MCP服务器支持两种连接模式：

1. **本地模式 (stdio)**: 用于Claude Desktop本地连接
2. **远程模式 (HTTP SSE)**: 用于服务器部署，通过URL远程连接

## 快速开始

### 1. 环境要求

- Node.js >= 20.0.0
- npm >= 9.0.0
- Binance API密钥 (从 [Binance API管理](https://binance.com/api-management) 获取)

### 2. 安装依赖

```bash
# 克隆项目
git clone <your-repository-url>
cd binance-mcp-server

# 安装依赖
npm install

# 构建项目
npm run build
```

## 本地部署 (stdio模式)

### 1. 配置Claude Desktop

在Claude Desktop的MCP配置文件中添加以下配置：

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "binance": {
      "command": "node",
      "args": ["/absolute/path/to/binance-mcp-server/build/index.js"],
      "env": {
        "BINANCE_API_KEY": "your_binance_api_key_here",
        "BINANCE_SECRET_KEY": "your_binance_secret_key_here",
        "BINANCE_TESTNET": "false",
        "LOG_LEVEL": "info"
      }
    }
  }
}
```

### 2. 启动服务

```bash
# 直接启动
npm start

# 或开发模式
npm run dev
```

### 3. 验证连接

重启Claude Desktop，在对话中输入"帮我查看Binance账户余额"来测试连接。

## 远程部署 (HTTP SSE模式)

### 1. 服务器配置

#### 使用Docker部署 (推荐)

1. **准备环境变量文件**

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑.env文件，设置基础服务器配置 (不包含API密钥)
vim .env
```

`.env` 文件内容示例：
```bash
# 服务器配置
SERVER_MODE=http
PORT=3000
HOST=0.0.0.0
LOG_LEVEL=info

# 可选配置
API_TIMEOUT=10000
ALLOWED_ORIGINS=*
HEALTH_CHECK_INTERVAL=30
```

2. **构建并启动Docker容器**

```bash
# 构建并启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f binance-mcp-server

# 检查服务状态
docker-compose ps
```

3. **使用Nginx反向代理 (可选，支持HTTPS)**

```bash
# 启动包含Nginx的完整服务
docker-compose --profile https up -d

# 配置SSL证书 (请替换为您的实际证书)
mkdir -p nginx/ssl
# 将您的SSL证书复制到 nginx/ssl/ 目录
# cp your-cert.pem nginx/ssl/cert.pem
# cp your-key.pem nginx/ssl/key.pem
```

#### 手动部署

1. **配置环境变量**

```bash
# 设置服务器环境变量
export SERVER_MODE=http
export PORT=3000
export HOST=0.0.0.0
export LOG_LEVEL=info
```

2. **启动HTTP服务器**

```bash
# 使用专用启动脚本
npm run start:http

# 或直接运行
SERVER_MODE=http npm start
```

### 2. Claude Desktop配置

在Claude Desktop的MCP配置文件中添加远程连接配置：

```json
{
  "mcpServers": {
    "binance-remote": {
      "command": "sse",
      "args": ["http://your-server-domain.com:3000/message"],
      "env": {
        "BINANCE_API_KEY": "your_binance_api_key_here",
        "BINANCE_SECRET_KEY": "your_binance_secret_key_here",
        "BINANCE_TESTNET": "false",
        "LOG_LEVEL": "info"
      }
    }
  }
}
```

**重要说明**: API密钥仍然在Claude Desktop的配置中设置，通过安全的SSE连接传递给远程服务器。

### 3. 防火墙配置

确保服务器的端口配置正确：

```bash
# 开放HTTP端口 (如果使用防火墙)
sudo ufw allow 3000/tcp

# 开放HTTPS端口 (如果使用Nginx)
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

## 配置选项详解

### 环境变量

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `SERVER_MODE` | `stdio` | 服务器模式 (`stdio` 或 `http`) |
| `PORT` | `3000` | HTTP服务器端口 |
| `HOST` | `0.0.0.0` | HTTP服务器主机地址 |
| `LOG_LEVEL` | `info` | 日志级别 (`debug`, `info`, `warn`, `error`) |
| `BINANCE_TESTNET` | `false` | 是否使用Binance测试网 |
| `API_TIMEOUT` | `10000` | API请求超时时间 (毫秒) |
| `ALLOWED_ORIGINS` | `*` | CORS允许的源 |

### MCP配置参数

#### 本地连接 (stdio)
- `command`: `"node"`
- `args`: `["/path/to/build/index.js"]`
- `env`: 包含Binance API密钥的环境变量

#### 远程连接 (SSE)
- `command`: `"sse"`
- `args`: `["http://server-url:port/message"]`
- `env`: 包含Binance API密钥的环境变量

## 运维管理

### 健康检查

```bash
# 检查服务状态
curl http://your-server:3000/message

# 使用Docker检查
docker-compose ps
docker-compose logs binance-mcp-server
```

### 日志管理

```bash
# 查看实时日志
docker-compose logs -f binance-mcp-server

# 查看错误日志
docker-compose logs --tail=100 binance-mcp-server | grep ERROR
```

### 服务重启

```bash
# Docker方式
docker-compose restart binance-mcp-server

# 手动方式
pm2 restart binance-mcp-server  # 如果使用PM2
# 或
sudo systemctl restart binance-mcp-server  # 如果配置为系统服务
```

### 备份与恢复

```bash
# 备份配置文件
tar -czf binance-mcp-backup.tar.gz \
  .env \
  docker-compose.yml \
  nginx/nginx.conf \
  nginx/ssl/

# 恢复配置
tar -xzf binance-mcp-backup.tar.gz
```

## 安全考虑

### API密钥安全
- API密钥仅存储在Claude Desktop配置中，通过加密的SSE连接传输
- 服务器不持久化存储API密钥
- 建议使用只读权限的API密钥进行市场数据查询

### 网络安全
- 使用HTTPS/SSL加密传输
- 配置防火墙限制访问端口
- 考虑使用VPN或私有网络

### 访问控制
- 配置Nginx访问控制
- 使用IP白名单限制访问
- 启用请求频率限制

## 故障排除

### 常见问题

1. **连接失败**
   - 检查服务器是否正常运行
   - 验证端口是否开放
   - 确认URL配置正确

2. **API密钥错误**
   - 确认API密钥格式正确
   - 检查API权限设置
   - 验证测试网配置

3. **工具列表为空**
   - HTTP模式下初次连接时是正常的
   - 使用任意工具后会自动初始化

### 调试方法

```bash
# 启用调试日志
LOG_LEVEL=debug npm run start:http

# 检查网络连通性
curl -v http://your-server:3000/message

# 检查Docker容器
docker-compose exec binance-mcp-server /bin/sh
```

## 性能优化

### 资源限制
- Docker容器内存限制：512MB
- CPU限制：1核
- 并发连接数：建议不超过10个

### 监控建议
- 使用Prometheus + Grafana监控
- 配置日志聚合 (ELK Stack)
- 设置告警规则

## 更新升级

### Docker部署更新
```bash
# 停止服务
docker-compose down

# 更新代码
git pull origin main

# 重新构建并启动
docker-compose build --no-cache
docker-compose up -d
```

### 手动部署更新
```bash
# 更新代码
git pull origin main

# 重新安装依赖并构建
npm install
npm run build

# 重启服务
npm run start:http
```

## 支持与反馈

如遇到问题，请：

1. 检查日志输出
2. 查看GitHub Issues
3. 提供完整的错误信息和配置细节

---

**注意**: 请确保妥善保管您的Binance API密钥，切勿在公共场所或不安全的环境中暴露。