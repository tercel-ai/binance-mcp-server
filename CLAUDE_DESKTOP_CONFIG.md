# Claude Desktop MCP 配置指南

本文档详细说明如何在Claude Desktop中配置Binance MCP服务器，支持本地和远程两种连接方式。

## 配置文件位置

根据您的操作系统，Claude Desktop的配置文件位于以下位置：

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%/Claude/claude_desktop_config.json`
- **Linux**: `~/.config/claude/claude_desktop_config.json`

## 配置方式

### 方式一：本地连接 (推荐用于开发)

适用于在本地运行MCP服务器的情况。

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

**配置说明：**
- `command`: 使用Node.js运行服务器
- `args`: 指向构建后的入口文件的绝对路径
- `env.BINANCE_API_KEY`: 您的Binance API密钥
- `env.BINANCE_SECRET_KEY`: 您的Binance API私钥
- `env.BINANCE_TESTNET`: 是否使用测试网 (`true`或`false`)
- `env.LOG_LEVEL`: 日志级别 (`debug`, `info`, `warn`, `error`)

### 方式二：远程HTTP连接 (推荐用于生产)

适用于MCP服务器部署在远程服务器的情况。

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

**配置说明：**
- `command`: 使用SSE (Server-Sent Events) 连接方式
- `args`: 远程服务器的SSE端点URL
- `env`: API配置通过安全连接传输给远程服务器

### 方式三：同时配置两种方式

您可以同时配置本地和远程连接，根据需要选择使用：

```json
{
  "mcpServers": {
    "binance-local": {
      "command": "node",
      "args": ["/absolute/path/to/binance-mcp-server/build/index.js"],
      "env": {
        "BINANCE_API_KEY": "your_binance_api_key_here",
        "BINANCE_SECRET_KEY": "your_binance_secret_key_here",
        "BINANCE_TESTNET": "true",
        "LOG_LEVEL": "debug"
      }
    },
    "binance-production": {
      "command": "sse",
      "args": ["https://your-production-server.com:3000/message"],
      "env": {
        "BINANCE_API_KEY": "your_production_api_key_here",
        "BINANCE_SECRET_KEY": "your_production_secret_key_here",
        "BINANCE_TESTNET": "false",
        "LOG_LEVEL": "info"
      }
    }
  }
}
```

## 获取Binance API密钥

### 1. 登录Binance账户

访问 [Binance](https://binance.com) 并登录您的账户。

### 2. 创建API密钥

1. 进入 **API管理** 页面：[https://binance.com/api-management](https://binance.com/api-management)
2. 点击 **Create API**
3. 选择 **System generated**
4. 给API密钥命名，例如：`Claude-MCP-Trading`
5. 完成身份验证（短信验证码等）

### 3. 配置API权限

为了安全起见，建议只开启必要的权限：

**基础查询权限**（最低权限，推荐新手使用）：
- ✅ **Enable Reading** - 读取账户信息和市场数据
- ❌ **Enable Spot & Margin Trading** - 不开启现货交易
- ❌ **Enable Futures** - 不开启合约交易

**完整交易权限**（完整功能，需要谨慎使用）：
- ✅ **Enable Reading** - 读取账户信息和市场数据
- ✅ **Enable Spot & Margin Trading** - 现货和杠杆交易
- ✅ **Enable Futures** - 合约交易

### 4. 设置IP限制

为提高安全性，建议设置IP访问限制：

**本地连接**：添加您的本地IP地址
**远程连接**：添加服务器的公网IP地址

如果不确定IP地址，可以临时选择"Unrestrict"，但建议后续添加限制。

## 环境变量详解

| 环境变量 | 必需 | 默认值 | 说明 |
|----------|------|--------|------|
| `BINANCE_API_KEY` | ✅ | - | Binance API密钥 |
| `BINANCE_SECRET_KEY` | ✅ | - | Binance API私钥 |
| `BINANCE_TESTNET` | ❌ | `false` | 是否使用测试网 |
| `LOG_LEVEL` | ❌ | `info` | 日志级别 |

### 测试网配置

Binance提供测试网环境用于开发和测试：

**测试网特点**：
- 使用虚拟资金，不涉及真实交易
- 获取测试网API密钥：[https://testnet.binance.vision](https://testnet.binance.vision)
- 适合学习和调试

**测试网配置示例**：
```json
{
  "env": {
    "BINANCE_API_KEY": "your_testnet_api_key",
    "BINANCE_SECRET_KEY": "your_testnet_secret_key",
    "BINANCE_TESTNET": "true",
    "LOG_LEVEL": "debug"
  }
}
```

## 配置验证

### 1. 重启Claude Desktop

配置完成后，完全退出并重新启动Claude Desktop应用。

### 2. 测试连接

在Claude Desktop的对话中输入以下测试命令：

```
帮我查看Binance账户余额
```

### 3. 预期结果

**成功连接**：
- 显示账户余额信息
- 格式化的用户友好输出

**连接失败**：
- 错误提示信息
- 检查配置和网络连接

## 故障排除

### 常见问题

1. **找不到配置文件**
   - 确认Claude Desktop版本支持MCP
   - 手动创建配置文件和目录

2. **API密钥错误**
   ```
   ❌ 缺少必要的环境变量: BINANCE_API_KEY
   ```
   - 检查API密钥格式
   - 确认环境变量名称正确

3. **权限不足**
   ```
   ❌ API密钥权限不足
   ```
   - 检查Binance API权限设置
   - 确认IP限制配置

4. **网络连接问题**
   ```
   ❌ 无法连接到服务器
   ```
   - 检查服务器状态
   - 确认URL和端口配置

### 调试步骤

1. **检查配置格式**
   ```bash
   # 使用JSON验证器检查配置文件
   cat claude_desktop_config.json | jq .
   ```

2. **查看Claude Desktop日志**
   - macOS: `~/Library/Logs/Claude/`
   - Windows: `%APPDATA%/Claude/logs/`

3. **测试API连接**
   ```bash
   # 使用curl测试远程连接
   curl -v http://your-server:3000/message
   ```

## 安全最佳实践

### 1. API密钥管理
- 定期轮换API密钥
- 使用最小权限原则
- 启用IP白名单

### 2. 配置文件安全
- 确保配置文件权限正确 (`chmod 600`)
- 不要在公共场所编辑配置
- 定期备份配置文件

### 3. 网络安全
- 优先使用HTTPS连接
- 考虑使用VPN访问远程服务器
- 监控异常访问记录

## 示例配置模板

### 开发环境配置
```json
{
  "mcpServers": {
    "binance-dev": {
      "command": "node",
      "args": ["/Users/yourname/binance-mcp-server/build/index.js"],
      "env": {
        "BINANCE_API_KEY": "your_testnet_api_key",
        "BINANCE_SECRET_KEY": "your_testnet_secret_key",
        "BINANCE_TESTNET": "true",
        "LOG_LEVEL": "debug"
      }
    }
  }
}
```

### 生产环境配置
```json
{
  "mcpServers": {
    "binance-prod": {
      "command": "sse",
      "args": ["https://binance-mcp.your-domain.com:3000/message"],
      "env": {
        "BINANCE_API_KEY": "your_production_api_key",
        "BINANCE_SECRET_KEY": "your_production_secret_key",
        "BINANCE_TESTNET": "false",
        "LOG_LEVEL": "info"
      }
    }
  }
}
```

---

**重要提醒**: 
- 请妥善保管您的API密钥，不要分享给他人
- 建议先在测试网环境熟悉功能后再使用主网
- 交易有风险，请合理控制仓位大小