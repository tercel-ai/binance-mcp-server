/**
 * 参数验证结果接口
 */
export interface ValidationResult {
    valid: boolean;
    data?: any;
    error?: string;
    warnings?: string[];
    suggestions?: string[];
}
/**
 * 参数验证器类
 */
export declare class ParameterValidator {
    /**
     * 验证交易对参数
     */
    static validateSymbol(symbol?: string, required?: boolean): ValidationResult;
    /**
     * 验证价格参数
     */
    static validatePrice(price?: number, required?: boolean): ValidationResult;
    /**
     * 验证数量参数
     */
    static validateQuantity(quantity?: number, required?: boolean): ValidationResult;
    /**
     * 验证杠杆倍数
     */
    static validateLeverage(leverage?: number): ValidationResult;
    /**
     * 验证订单类型
     */
    static validateOrderType(type?: string): ValidationResult;
    /**
     * 验证交易方向
     */
    static validateSide(side?: string, required?: boolean): ValidationResult;
    /**
     * 验证时间间隔
     */
    static validateInterval(interval?: string): ValidationResult;
    /**
     * 综合参数验证
     */
    static validateParameters(params: any, rules: {
        [key: string]: {
            required?: boolean;
            type?: string;
        };
    }): ValidationResult;
    /**
     * 格式化验证错误消息
     */
    static formatValidationError(result: ValidationResult): string;
    /**
     * 格式化验证警告消息
     */
    static formatValidationWarnings(warnings: string[]): string;
}
//# sourceMappingURL=validation.d.ts.map