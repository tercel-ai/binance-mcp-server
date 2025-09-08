#!/usr/bin/env node

// 工具验证脚本 - 检查所有35个工具是否完整实现

import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

// 模拟环境设置
process.env.BINANCE_API_KEY = 'test_key';
process.env.BINANCE_SECRET_KEY = 'test_secret';
process.env.BINANCE_TESTNET = 'true';

console.log('🔍 验证Binance MCP服务器工具完整性');
console.log('=======================================');

// 导入工具创建函数
let toolModules;
try {
  const { createAccountTools } = await import('../build/tools/account.js');
  const { createSpotTools } = await import('../build/tools/spot.js');
  const { createFuturesTools } = await import('../build/tools/futures.js');
  const { createMarketTools } = await import('../build/tools/market.js');
  const { createAdvancedTools } = await import('../build/tools/advanced.js');
  
  toolModules = {
    createAccountTools,
    createSpotTools,
    createFuturesTools,
    createMarketTools,
    createAdvancedTools
  };
} catch (error) {
  console.error('❌ 工具模块导入失败:', error.message);
  process.exit(1);
}

// 预期的工具列表
const expectedTools = {
  'account': [
    'binance_account_info',
    'binance_spot_balances',
    'binance_portfolio_account',
    'binance_futures_positions',
    'binance_account_status'
  ],
  'spot': [
    'binance_spot_buy',
    'binance_spot_sell', 
    'binance_spot_cancel_order',
    'binance_spot_open_orders',
    'binance_spot_order_history',
    'binance_spot_trade_history'
  ],
  'futures': [
    'binance_futures_buy',
    'binance_futures_sell',
    'binance_futures_cancel_order',
    'binance_futures_cancel_all_orders',
    'binance_futures_open_orders',
    'binance_futures_order_history',
    'binance_futures_position_info',
    'binance_futures_close_position',
    'binance_futures_set_leverage'
  ],
  'market': [
    'binance_get_price',
    'binance_get_24hr_ticker',
    'binance_get_orderbook',
    'binance_get_klines',
    'binance_get_all_prices',
    'binance_futures_prices',
    'binance_futures_24hr_ticker',
    'binance_server_time',
    'binance_exchange_info'
  ],
  'advanced': [
    'binance_calculate_position_size',
    'binance_analyze_portfolio_risk',
    'binance_get_market_summary',
    'binance_compare_symbols',
    'binance_check_arbitrage_opportunities',
    'binance_analyze_price_action'
  ]
};

// 验证函数
async function validateTools() {
  const results = {
    total: 0,
    found: 0,
    missing: [],
    categories: {}
  };

  // 模拟BinanceClient (不会实际调用API)
  const mockClient = {
    getClient: () => ({}),
    isTestnet: () => true,
    formatError: (err) => String(err)
  };

  console.log('📊 检查工具实现情况:\n');

  for (const [category, expectedToolNames] of Object.entries(expectedTools)) {
    console.log(`📁 ${category.toUpperCase()} 工具 (预期: ${expectedToolNames.length}个)`);
    
    const createFunction = toolModules[`create${category.charAt(0).toUpperCase() + category.slice(1)}Tools`];
    let actualTools = [];
    
    try {
      actualTools = createFunction(mockClient);
    } catch (error) {
      console.log(`   ❌ 工具创建失败: ${error.message}`);
      continue;
    }

    const actualToolNames = actualTools.map(tool => tool.name);
    
    results.categories[category] = {
      expected: expectedToolNames.length,
      found: actualTools.length,
      tools: actualToolNames,
      missing: []
    };

    // 检查每个预期工具
    for (const expectedTool of expectedToolNames) {
      results.total++;
      if (actualToolNames.includes(expectedTool)) {
        results.found++;
        console.log(`   ✅ ${expectedTool}`);
      } else {
        results.missing.push(expectedTool);
        results.categories[category].missing.push(expectedTool);
        console.log(`   ❌ ${expectedTool} - 缺失`);
      }
    }

    // 检查是否有额外工具
    const extraTools = actualToolNames.filter(name => !expectedToolNames.includes(name));
    if (extraTools.length > 0) {
      console.log(`   📎 额外工具: ${extraTools.join(', ')}`);
    }

    console.log(`   小计: ${actualTools.length}/${expectedToolNames.length} 个工具\n`);
  }

  return results;
}

// 运行验证
try {
  const results = await validateTools();
  
  console.log('=======================================');
  console.log('📋 验证结果汇总:');
  console.log(`   总计: ${results.found}/${results.total} 个工具`);
  console.log(`   完成度: ${((results.found / results.total) * 100).toFixed(1)}%`);
  
  if (results.missing.length > 0) {
    console.log(`\n❌ 缺失工具 (${results.missing.length}个):`);
    results.missing.forEach(tool => console.log(`   - ${tool}`));
  }
  
  console.log('\n📊 分类统计:');
  for (const [category, stats] of Object.entries(results.categories)) {
    const completion = ((stats.found / stats.expected) * 100).toFixed(1);
    console.log(`   ${category}: ${stats.found}/${stats.expected} (${completion}%)`);
  }
  
  // 验证工具结构
  console.log('\n🔧 工具结构验证:');
  console.log('   检查工具描述、参数schema等...');
  
  // 这里可以添加更多结构验证逻辑
  let structureValid = true;
  
  // 简单的结构检查
  for (const [category, createFunction] of Object.entries(toolModules)) {
    try {
      const tools = createFunction({ getClient: () => ({}), formatError: (e) => String(e) });
      for (const tool of tools) {
        if (!tool.name || !tool.description || !tool.inputSchema) {
          console.log(`   ❌ ${tool.name || 'unnamed'}: 缺少必要属性`);
          structureValid = false;
        }
      }
    } catch (error) {
      console.log(`   ❌ ${category}: ${error.message}`);
      structureValid = false;
    }
  }
  
  if (structureValid) {
    console.log('   ✅ 所有工具结构完整');
  }
  
  const success = results.found === results.total && structureValid;
  console.log(`\n${success ? '✅' : '❌'} 工具验证${success ? '通过' : '失败'}`);
  
  process.exit(success ? 0 : 1);
  
} catch (error) {
  console.error('❌ 验证过程失败:', error.message);
  console.error(error.stack);
  process.exit(1);
}