/**
 * 结果格式化工具类
 * 将JSON数据转换为用户友好的书面格式
 */
export declare class ResultFormatter {
    /**
     * 格式化数字显示
     */
    static formatNumber(num: number | string, decimals?: number): string;
    /**
     * 格式化价格显示
     */
    static formatPrice(price: number, symbol?: string): string;
    /**
     * 格式化数量显示
     */
    static formatQuantity(quantity: number, asset?: string): string;
    /**
     * 格式化百分比
     */
    static formatPercentage(percent: number): string;
    /**
     * 格式化时间戳
     */
    static formatTimestamp(timestamp: number): string;
    /**
     * 格式化现货下单成功结果
     */
    static formatSpotOrderSuccess(data: any): string;
    /**
     * 格式化合约下单成功结果
     */
    static formatFuturesOrderSuccess(data: any): string;
    /**
     * 格式化余额查询结果
     */
    static formatSpotBalances(balances: any[]): string;
    /**
     * 格式化持仓查询结果
     */
    static formatFuturesPositions(positions: any[]): string;
    /**
     * 获取订单状态描述
     */
    private static getOrderStatus;
    /**
     * 获取币种表情符号
     */
    private static getCurrencyEmoji;
    /**
     * 获取币种中文名称
     */
    private static getCurrencyName;
    /**
     * 获取风险等级
     */
    private static getRiskLevel;
    /**
     * 获取持仓风险等级
     */
    private static getPositionRiskLevel;
    /**
     * 获取持仓操作建议
     */
    private static getPositionAdvice;
    /**
     * 格式化价格数据
     */
    static formatPriceData(data: any): string;
    /**
     * 格式化24小时行情
     */
    static format24hrTicker(ticker: any): string;
    /**
     * 格式化订单簿深度
     */
    static formatOrderbook(orderbook: any): string;
    /**
     * 格式化账户信息
     */
    static formatAccountInfo(account: any): string;
}
//# sourceMappingURL=formatter.d.ts.map