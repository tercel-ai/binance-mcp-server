#!/usr/bin/env node

// 简单的工具验证脚本，不需要编译
console.log('🚀 Binance MCP 工具验证报告');
console.log('=====================================');

// 检查工具文件是否存在
const fs = require('fs');
const path = require('path');

const toolFiles = [
  'src/tools/account.ts',
  'src/tools/spot.ts', 
  'src/tools/futures.ts',
  'src/tools/market.ts',
  'src/tools/advanced.ts'
];

const utilFiles = [
  'src/utils/validation.ts',
  'src/utils/formatter.ts',
  'src/utils/logger.ts'
];

console.log('\n📁 文件结构检查:');

toolFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - 文件不存在`);
  }
});

utilFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`  ✅ ${file}`);  
  } else {
    console.log(`  ❌ ${file} - 文件不存在`);
  }
});

// 检查工具数量
console.log('\n🔧 工具数量统计:');

toolFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    
    // 统计工具定义
    const toolMatches = content.match(/name:\s*['"`]binance_\w+['"`]/g) || [];
    const toolNames = toolMatches.map(match => match.match(/['"`]([^'"`]+)['"`]/)[1]);
    
    console.log(`  📊 ${path.basename(file, '.ts')}: ${toolNames.length}个工具`);
    toolNames.forEach(name => {
      console.log(`     • ${name}`);
    });
  }
});

// 检查描述结构
console.log('\n📝 描述结构检查:');

const requiredSections = [
  '🔍 功能说明',
  '⚠️ 重要提醒', 
  '🎯 适用场景',
  '输出示例'
];

toolFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    const toolCount = (content.match(/name:\s*['"`]binance_\w+['"`]/g) || []).length;
    
    let structuredCount = 0;
    requiredSections.forEach(section => {
      const sectionCount = (content.match(new RegExp(section.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
      if (sectionCount >= toolCount) {
        structuredCount++;
      }
    });
    
    const completeness = Math.round((structuredCount / requiredSections.length) * 100);
    console.log(`  📈 ${path.basename(file, '.ts')}: ${completeness}% 描述结构完整性`);
  }
});

console.log('\n✅ 验证完成！');
console.log('\n💡 建议:');
console.log('  1. 确保所有工具都有完整的描述结构');
console.log('  2. 运行 npm run build 检查TypeScript编译');
console.log('  3. 测试工具的实际功能'); 

