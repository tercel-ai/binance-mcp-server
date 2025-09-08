# Binance MCP Server 使用指南

## 📖 目录

1. [快速开始](#快速开始)
2. [详细配置](#详细配置)
3. [工具使用说明](#工具使用说明)
4. [常用场景示例](#常用场景示例)
5. [最佳实践](#最佳实践)
6. [故障排除](#故障排除)

## 🚀 快速开始

### 第一步：获取Binance API密钥

1. **登录Binance账户**
   - 访问 [Binance官网](https://www.binance.com) 并登录

2. **创建API密钥**
   - 进入 `账户` → `API管理`
   - 点击"创建API"
   - 输入API标签名称（如"Claude MCP"）
   - 完成安全验证

3. **配置API权限** ⚠️ **重要**
   ```
   ✅ 启用现货及杠杆交易
   ✅ 启用合约交易
   ✅ 启用统一账户 (Portfolio Margin)
   ✅ 启用读取权限
   ❌ 禁用提现权限（安全考虑）
   ```

4. **IP白名单设置**（可选但推荐）
   - 添加你的IP地址以提高安全性

### 第二步：安装和构建项目

```bash
# 克隆项目
git clone <your-repository-url>
cd binance-mcp-server

# 安装依赖
npm install

# 构建项目
npm run build
```

### 第三步：配置Claude Desktop

找到Claude Desktop配置文件：
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\\Claude\\claude_desktop_config.json`

添加以下配置：

```json
{
  "mcpServers": {
    "binance-mcp-server": {
      "command": "node",
      "args": ["/完整路径/到/binance-mcp-server/build/index.js"],
      "env": {
        "BINANCE_API_KEY": "你的API密钥",
        "BINANCE_SECRET_KEY": "你的Secret密钥", 
        "BINANCE_TESTNET": "true",
        "LOG_LEVEL": "info"
      }
    }
  }
}
```

> **💡 新手建议**: 首次使用时设置 `"BINANCE_TESTNET": "true"` 在测试网练习

### 第四步：重启Claude Desktop并测试

重启Claude Desktop后，发送测试消息：
```
请帮我查询Binance账户状态和余额
```

## ⚙️ 详细配置

### 环境变量说明

| 变量名 | 必需 | 默认值 | 描述 |
|--------|------|--------|------|
| `BINANCE_API_KEY` | ✅ | 无 | Binance API密钥 |
| `BINANCE_SECRET_KEY` | ✅ | 无 | Binance Secret密钥 |
| `BINANCE_TESTNET` | ❌ | false | 是否使用测试网 |
| `LOG_LEVEL` | ❌ | info | 日志级别 (debug/info/warn/error) |
| `SERVER_MODE` | ❌ | stdio | 服务器模式 (stdio/http) |
| `PORT` | ❌ | 3000 | HTTP模式端口 |
| `HOST` | ❌ | 0.0.0.0 | HTTP模式主机 |

### 测试网配置

**测试网优势**：
- ✅ 安全练习，不会损失真实资金
- ✅ 相同的API功能和接口
- ✅ 无限制的测试金额

**测试网设置**：
```json
{
  "env": {
    "BINANCE_TESTNET": "true",
    "BINANCE_API_KEY": "测试网API密钥",
    "BINANCE_SECRET_KEY": "测试网Secret密钥"
  }
}
```

获取测试网密钥：
1. 访问 [Binance测试网](https://testnet.binance.vision)
2. 使用GitHub或Google账号登录
3. 生成API密钥并配置权限

## 🛠️ 工具使用说明

### 账户管理类工具 (5个)

#### 1. `binance_account_info` - 账户基本信息
**用途**: 获取账户类型、权限状态
**示例对话**:
```
查看我的Binance账户基本信息和权限状态
```
**输出包含**: 账户类型、交易权限、提现权限、更新时间

#### 2. `binance_spot_balances` - 现货余额查询  
**用途**: 查看现货账户各币种余额
**示例对话**:
```
显示我的现货账户余额，包括可用和冻结资金
```
**输出包含**: 各币种余额、可用/冻结状态、资产建议

#### 3. `binance_portfolio_account` - 统一账户信息
**用途**: 查看Portfolio Margin账户详情
**示例对话**:
```
查询我的统一账户保证金和盈亏情况
```
**输出包含**: 总资产、保证金率、未实现盈亏

#### 4. `binance_futures_positions` - 合约持仓
**用途**: 查看所有合约持仓详情
**示例对话**:
```
显示我的所有合约持仓和盈亏状况
```
**输出包含**: 持仓方向、数量、入场价、当前盈亏

#### 5. `binance_account_status` - 连接状态
**用途**: 检查API连接和时间同步
**示例对话**:
```
检查我的Binance API连接状态
```
**输出包含**: 连接状态、服务器时间、权限验证

### 现货交易类工具 (6个)

#### 1. `binance_spot_buy` - 现货买入
**参数**:
- `symbol`: 交易对 (如 BTCUSDT)
- `quantity`: 买入数量 (可选，与quoteOrderQty二选一)
- `quoteOrderQty`: 买入金额 (以计价币种为单位)
- `type`: 订单类型 (MARKET/LIMIT)
- `price`: 限价单价格 (限价单必需)

**示例对话**:
```
在BTCUSDT现货市场买入价值500 USDT的BTC
```
```
限价买入0.01个BTC，价格设置为43000 USDT
```

#### 2. `binance_spot_sell` - 现货卖出
**参数**:
- `symbol`: 交易对
- `quantity`: 卖出数量
- `type`: 订单类型
- `price`: 限价单价格 (可选)

**示例对话**:
```
市价卖出0.005个BTC
```
```
限价卖出0.01个ETH，价格设置为2600 USDT
```

#### 3. `binance_spot_cancel_order` - 取消订单
**示例对话**:
```
取消订单号12345678的现货订单
```

#### 4. `binance_spot_open_orders` - 当前委托
**示例对话**:
```
查看我当前所有的现货挂单
```

#### 5. `binance_spot_order_history` - 历史订单
**示例对话**:
```
查看BTCUSDT最近10天的现货订单历史
```

#### 6. `binance_spot_trade_history` - 成交记录
**示例对话**:
```
显示我最近的现货成交记录，包含手续费信息
```

### 合约交易类工具 (9个)

#### 1. `binance_futures_buy` - 合约做多
**示例对话**:
```
在BTCUSDT永续合约开多仓，数量0.1BTC，使用10倍杠杆
```
```
限价做多ETHUSDT合约，价格2500，数量1ETH
```

#### 2. `binance_futures_sell` - 合约做空
**示例对话**:
```
做空BTCUSDT永续合约，数量0.05BTC，市价开仓
```

#### 3. `binance_futures_cancel_order` - 取消合约订单
**示例对话**:
```
取消我在BTCUSDT合约的订单号987654321
```

#### 4. `binance_futures_cancel_all_orders` - 批量取消
**示例对话**:
```
取消ETHUSDT合约的所有挂单
```

#### 5. `binance_futures_open_orders` - 合约委托
**示例对话**:
```
查看我所有的合约挂单
```

#### 6. `binance_futures_order_history` - 合约订单历史
**示例对话**:
```
查看BTCUSDT合约最近的订单历史
```

#### 7. `binance_futures_position_info` - 持仓详情
**示例对话**:
```
显示我在BTCUSDT合约的详细持仓信息
```

#### 8. `binance_futures_close_position` - 平仓
**示例对话**:
```
市价平掉我在ETHUSDT合约的所有多头持仓
```

#### 9. `binance_futures_set_leverage` - 设置杠杆
**示例对话**:
```
将BTCUSDT合约杠杆调整为20倍
```

### 市场数据类工具 (9个)

#### 1. `binance_get_price` - 实时价格
**示例对话**:
```
获取BTCUSDT当前价格
```

#### 2. `binance_get_24hr_ticker` - 24小时行情
**示例对话**:
```
显示BTCUSDT的24小时涨跌幅和成交量
```

#### 3. `binance_get_orderbook` - 订单簿深度
**示例对话**:
```
查看BTCUSDT的买卖盘深度数据
```

#### 4. `binance_get_klines` - K线数据
**示例对话**:
```
获取BTCUSDT的4小时K线，最近20根
```

#### 5. `binance_get_all_prices` - 所有价格
**示例对话**:
```
获取所有主要交易对的当前价格
```

#### 6. `binance_futures_prices` - 合约价格
**示例对话**:
```
获取BTCUSDT永续合约的标记价格
```

#### 7. `binance_futures_24hr_ticker` - 合约24小时行情
**示例对话**:
```
显示ETHUSDT永续合约的24小时统计数据
```

#### 8. `binance_server_time` - 服务器时间
**示例对话**:
```
检查Binance服务器时间和本地时间同步
```

#### 9. `binance_exchange_info` - 交易所信息
**示例对话**:
```
获取BTCUSDT的交易规则和精度要求
```

### 高级分析类工具 (6个)

#### 1. `binance_calculate_position_size` - 仓位计算
**用途**: 根据风险管理计算合理仓位
**示例对话**:
```
计算BTCUSDT合约交易中，风险50 USDT，入场44000，止损43000，10倍杠杆的仓位大小
```

#### 2. `binance_analyze_portfolio_risk` - 风险分析
**示例对话**:
```
分析我的账户整体风险状况和资产配置
```

#### 3. `binance_get_market_summary` - 市场概况
**示例对话**:
```
显示当前市场热门交易对和整体趋势
```

#### 4. `binance_compare_symbols` - 交易对比较
**示例对话**:
```
比较BTC、ETH、BNB三个币种的价格表现
```

#### 5. `binance_check_arbitrage_opportunities` - 套利分析
**示例对话**:
```
检查BTC在现货和合约市场的套利机会
```

#### 6. `binance_analyze_price_action` - 价格走势分析
**示例对话**:
```
分析BTCUSDT最近的价格走势和技术指标
```

## 💡 常用场景示例

### 场景1: 每日账户检查
```
早上好！帮我查看今天的账户状况：
1. 显示现货和合约余额
2. 检查所有持仓的盈亏状况  
3. 查看昨晚有没有成交的订单
```

### 场景2: 技术分析交易
```
我想分析BTCUSDT的交易机会：
1. 显示当前价格和24小时涨跌
2. 获取4小时K线数据，最近48根
3. 查看订单簿深度情况
4. 如果价格突破45000，帮我计算10倍杠杆下的合理仓位
```

### 场景3: 风险管理
```
我持有多个合约仓位，请帮我：
1. 分析整体账户风险状况
2. 检查哪些仓位接近强平价
3. 建议是否需要调整仓位或加保证金
```

### 场景4: 套利交易
```
检查以下币种的套利机会：
1. 比较BTC现货和合约价格差
2. 分析ETH的价格差异
3. 如果有超过0.1%的价差，提供具体的套利策略
```

### 场景5: 批量操作
```
帮我执行以下操作：
1. 取消所有BTCUSDT的挂单
2. 将BTCUSDT合约杠杆设置为15倍
3. 市价平掉ETHUSDT的空头持仓
4. 查看操作完成后的持仓状况
```

## 🎯 最佳实践

### 安全实践

1. **API密钥安全**
   ```
   ✅ 使用独立的API密钥，不与其他应用共享
   ✅ 定期更换API密钥（建议每3个月）
   ✅ 设置IP白名单限制访问
   ✅ 禁用提现权限
   ❌ 不要在公共场所或不安全网络下使用
   ```

2. **交易安全**
   ```
   ✅ 从小额开始，熟悉功能后再增加
   ✅ 先在测试网充分练习
   ✅ 设置合理的止损止盈
   ✅ 分散风险，不要集中投资
   ❌ 避免情绪化交易
   ❌ 不要使用过高杠杆
   ```

### 交易策略

1. **仓位管理**
   - 使用`binance_calculate_position_size`工具
   - 单笔交易风险不超过账户的2-5%
   - 合约交易杠杆控制在10倍以内

2. **风险控制**
   - 定期使用`binance_analyze_portfolio_risk`检查
   - 设置强平价格预警（距离当前价格20%以上）
   - 分散持仓，避免单一币种过度集中

3. **市场分析**
   - 结合多个时间框架的K线分析
   - 关注订单簿深度判断流动性
   - 使用套利工具发现价格差异机会

### 操作效率

1. **批量操作**
   ```
   一次对话完成多个操作：
   "帮我查看BTC、ETH、BNB的价格，然后分析我的持仓风险，最后取消所有挂单"
   ```

2. **条件触发**
   ```
   设置条件判断：
   "如果BTCUSDT价格超过45000，帮我开多仓；如果低于43000，平掉现有多仓"
   ```

3. **定期检查**
   ```
   建立日常检查流程：
   "显示今日账户概览、新增持仓、成交订单和盈亏状况"
   ```

## ❗ 故障排除

### 常见错误及解决方案

#### 1. "MCP服务器未响应"
**原因**: MCP服务器未正确启动
**解决**:
```bash
# 检查构建是否完成
npm run build

# 手动测试服务器
node build/index.js

# 检查Claude Desktop配置
cat ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

#### 2. "API密钥验证失败" 
**原因**: API密钥配置错误
**解决**:
- 检查API密钥是否正确复制
- 确认API权限是否正确设置
- 验证是否使用了正确的测试网/主网密钥

#### 3. "交易失败：资金不足"
**原因**: 账户余额不够
**解决**:
```
查询我的现货余额和合约保证金使用情况
```

#### 4. "订单精度错误"
**原因**: 订单参数不符合交易所规则
**解决**:
```
获取BTCUSDT的交易规则和最小订单量要求
```

#### 5. "API请求频率超限"
**原因**: 请求过于频繁
**解决**:
- 减少请求频率
- 合并多个查询为单次对话
- 等待1-2分钟后再试

### 调试模式

启用详细日志：
```json
{
  "env": {
    "LOG_LEVEL": "debug"
  }
}
```

查看日志输出：
- macOS: 查看Console.app中Claude Desktop的日志
- Windows: 查看事件查看器中的应用程序日志

### 重置配置

如果遇到配置问题，可以重置：
```bash
# 备份现有配置
cp ~/Library/Application\ Support/Claude/claude_desktop_config.json ~/Desktop/claude_config_backup.json

# 重新配置（参考快速开始部分）
# 重启Claude Desktop
```

## 📞 获取支持

- **文档问题**: 查看项目README.md
- **Bug报告**: 提交到项目Issue页面
- **功能请求**: 通过Issue或PR提交
- **社区讨论**: 加入相关Discord/Telegram群组

---

**免责声明**: 本工具仅供学习和研究使用。加密货币交易存在风险，使用者应自行承担所有交易风险。开发者不对任何交易损失负责。建议在充分理解风险的前提下使用，并从小额开始练习。