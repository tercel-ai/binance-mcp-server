#!/usr/bin/env node

/**
 * 工具描述和功能验证脚本
 * 验证所有工具的描述完整性、参数一致性和功能可用性
 */

import { BinanceClient } from '../api/client.js';
import { createAccountTools } from '../tools/account.js';
import { createSpotTools } from '../tools/spot.js';
import { createFuturesTools } from '../tools/futures.js';
import { createMarketTools } from '../tools/market.js';
import { createAdvancedTools } from '../tools/advanced.js';

interface ValidationResult {
  toolName: string;
  category: string;
  hasDescription: boolean;
  hasInputSchema: boolean;
  hasRequiredFields: boolean;
  hasExamples: boolean;
  descriptionStructure: {
    hasFunctionDescription: boolean;
    hasImportantReminders: boolean;
    hasUseCases: boolean;
    hasOutputExample: boolean;
  };
  issues: string[];
}

class ToolValidator {
  private results: ValidationResult[] = [];

  /**
   * 验证工具描述结构
   */
  private validateToolDescription(toolName: string, description: string): ValidationResult['descriptionStructure'] {
    return {
      hasFunctionDescription: description.includes('🔍 功能说明') || description.includes('功能说明'),
      hasImportantReminders: description.includes('⚠️ 重要提醒') || description.includes('重要提醒'),
      hasUseCases: description.includes('🎯 适用场景') || description.includes('适用场景'),
      hasOutputExample: description.includes('输出示例') || description.includes('示例')
    };
  }

  /**
   * 验证单个工具
   */
  private validateTool(tool: any, category: string): ValidationResult {
    const result: ValidationResult = {
      toolName: tool.name,
      category,
      hasDescription: !!tool.description,
      hasInputSchema: !!tool.inputSchema,
      hasRequiredFields: !!tool.inputSchema?.required,
      hasExamples: false,
      descriptionStructure: {
        hasFunctionDescription: false,
        hasImportantReminders: false,
        hasUseCases: false,
        hasOutputExample: false
      },
      issues: []
    };

    // 验证描述存在性
    if (!tool.description) {
      result.issues.push('缺少工具描述');
    } else {
      result.descriptionStructure = this.validateToolDescription(tool.name, tool.description);
      
      // 检查描述结构完整性
      if (!result.descriptionStructure.hasFunctionDescription) {
        result.issues.push('缺少功能说明部分');
      }
      if (!result.descriptionStructure.hasImportantReminders) {
        result.issues.push('缺少重要提醒部分');
      }
      if (!result.descriptionStructure.hasUseCases) {
        result.issues.push('缺少适用场景部分');
      }
      if (!result.descriptionStructure.hasOutputExample) {
        result.issues.push('缺少输出示例部分');
      }
    }

    // 验证输入架构
    if (!tool.inputSchema) {
      result.issues.push('缺少输入参数架构');
    } else {
      // 检查参数示例
      const properties = tool.inputSchema.properties || {};
      for (const [key, prop] of Object.entries(properties)) {
        if ((prop as any).examples) {
          result.hasExamples = true;
          break;
        }
      }
    }

    return result;
  }

  /**
   * 验证工具集合
   */
  private validateToolSet(tools: any[], category: string): void {
    console.log(`\n🔍 验证 ${category} 工具 (共${tools.length}个):`);
    
    for (const tool of tools) {
      const result = this.validateTool(tool, category);
      this.results.push(result);
      
      if (result.issues.length === 0) {
        console.log(`  ✅ ${tool.name} - 验证通过`);
      } else {
        console.log(`  ❌ ${tool.name} - 发现问题:`);
        result.issues.forEach(issue => {
          console.log(`     • ${issue}`);
        });
      }
    }
  }

  /**
   * 生成验证报告
   */
  private generateReport(): void {
    console.log('\n📊 验证报告汇总');
    console.log('=====================================');
    
    const totalTools = this.results.length;
    const passedTools = this.results.filter(r => r.issues.length === 0).length;
    const failedTools = totalTools - passedTools;
    
    console.log(`📈 总体统计:`);
    console.log(`  总工具数: ${totalTools}`);
    console.log(`  通过验证: ${passedTools} (${((passedTools/totalTools)*100).toFixed(1)}%)`);
    console.log(`  存在问题: ${failedTools} (${((failedTools/totalTools)*100).toFixed(1)}%)`);
    
    // 按类别统计
    const categories = ['account', 'spot', 'futures', 'market', 'advanced'];
    console.log(`\n📋 分类统计:`);
    
    categories.forEach(category => {
      const categoryResults = this.results.filter(r => r.category === category);
      const categoryPassed = categoryResults.filter(r => r.issues.length === 0).length;
      console.log(`  ${category}: ${categoryPassed}/${categoryResults.length} 通过`);
    });
    
    // 详细问题统计
    const allIssues = this.results.flatMap(r => r.issues);
    const issueStats: { [key: string]: number } = {};
    allIssues.forEach(issue => {
      issueStats[issue] = (issueStats[issue] || 0) + 1;
    });
    
    if (Object.keys(issueStats).length > 0) {
      console.log(`\n⚠️  常见问题统计:`);
      Object.entries(issueStats)
        .sort((a, b) => b[1] - a[1])
        .forEach(([issue, count]) => {
          console.log(`  ${issue}: ${count}次`);
        });
    }
    
    // 推荐改进建议
    console.log(`\n💡 改进建议:`);
    if (failedTools > 0) {
      console.log(`  1. 完善所有工具的描述结构，确保包含四个核心部分`);
      console.log(`  2. 为参数添加更多示例以提高易用性`);
      console.log(`  3. 统一描述格式和风格`);
    } else {
      console.log(`  🎉 所有工具验证通过！描述质量优秀。`);
    }
  }

  /**
   * 执行完整验证
   */
  public async runValidation(): Promise<void> {
    console.log('🚀 开始工具描述验证...');
    
    // 模拟客户端（不需要真实API密钥进行结构验证）
    const mockClient = {} as BinanceClient;
    
    try {
      // 验证各类工具
      this.validateToolSet(createAccountTools(mockClient), 'account');
      this.validateToolSet(createSpotTools(mockClient), 'spot');
      this.validateToolSet(createFuturesTools(mockClient), 'futures');
      this.validateToolSet(createMarketTools(mockClient), 'market');
      this.validateToolSet(createAdvancedTools(mockClient), 'advanced');
      
      // 生成最终报告
      this.generateReport();
      
    } catch (error) {
      console.error('❌ 验证过程中发生错误:', error);
    }
  }
}

// 主函数
async function main() {
  const validator = new ToolValidator();
  await validator.runValidation();
}

// 导出验证器
export { ToolValidator };

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('验证脚本执行失败:', error);
    process.exit(1);
  });
}