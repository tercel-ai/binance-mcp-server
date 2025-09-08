#!/usr/bin/env node

// 列出实际实现的所有工具

process.env.BINANCE_API_KEY = 'test_key';
process.env.BINANCE_SECRET_KEY = 'test_secret';
process.env.BINANCE_TESTNET = 'true';

console.log('📋 实际实现的工具列表');
console.log('====================');

try {
  const { createAccountTools } = await import('../build/tools/account.js');
  const { createSpotTools } = await import('../build/tools/spot.js');
  const { createFuturesTools } = await import('../build/tools/futures.js');
  const { createMarketTools } = await import('../build/tools/market.js');
  const { createAdvancedTools } = await import('../build/tools/advanced.js');
  
  const mockClient = {
    getClient: () => ({}),
    isTestnet: () => true,
    formatError: (err) => String(err)
  };

  const categories = [
    ['账户管理', createAccountTools],
    ['现货交易', createSpotTools],
    ['合约交易', createFuturesTools],
    ['市场数据', createMarketTools],
    ['高级分析', createAdvancedTools]
  ];

  let totalTools = 0;

  for (const [categoryName, createFunction] of categories) {
    console.log(`\n📁 ${categoryName}:`);
    
    try {
      const tools = createFunction(mockClient);
      console.log(`   数量: ${tools.length}个工具`);
      
      tools.forEach((tool, index) => {
        console.log(`   ${index + 1}. ${tool.name}`);
        console.log(`      描述: ${tool.description}`);
        if (tool.inputSchema?.properties) {
          const params = Object.keys(tool.inputSchema.properties);
          console.log(`      参数: ${params.length > 0 ? params.join(', ') : '无'}`);
        }
        console.log('');
      });
      
      totalTools += tools.length;
    } catch (error) {
      console.log(`   ❌ 创建失败: ${error.message}`);
    }
  }

  console.log('====================');
  console.log(`📊 总计: ${totalTools} 个工具`);
  
  // 检查是否达到35个工具的目标
  if (totalTools === 35) {
    console.log('✅ 已达到35个工具的目标！');
  } else if (totalTools > 35) {
    console.log(`🎉 超出目标！实现了 ${totalTools - 35} 个额外工具`);
  } else {
    console.log(`⚠️  距离35个工具目标还差 ${35 - totalTools} 个`);
  }

} catch (error) {
  console.error('❌ 列出工具失败:', error.message);
  process.exit(1);
}