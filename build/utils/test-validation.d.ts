#!/usr/bin/env node
/**
 * 工具描述和功能验证脚本
 * 验证所有工具的描述完整性、参数一致性和功能可用性
 */
declare class ToolValidator {
    private results;
    /**
     * 验证工具描述结构
     */
    private validateToolDescription;
    /**
     * 验证单个工具
     */
    private validateTool;
    /**
     * 验证工具集合
     */
    private validateToolSet;
    /**
     * 生成验证报告
     */
    private generateReport;
    /**
     * 执行完整验证
     */
    runValidation(): Promise<void>;
}
export { ToolValidator };
//# sourceMappingURL=test-validation.d.ts.map