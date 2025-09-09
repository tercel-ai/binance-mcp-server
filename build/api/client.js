import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const Binance = require('binance-api-node').default;
import { logger } from '../utils/logger.js';
export class BinanceClient {
    client;
    config;
    constructor(config) {
        this.config = config;
        this.client = Binance({
            apiKey: config.apiKey,
            apiSecret: config.apiSecret,
            useServerTime: true,
            httpBase: config.testnet ? 'https://testnet.binance.vision' : 'https://api.binance.com',
            wsBase: config.testnet ? 'wss://testnet.binance.vision' : 'wss://stream.binance.com:9443',
        });
        logger.info(`Binance客户端初始化完成 - ${config.testnet ? '测试网' : '主网'}`);
    }
    getClient() {
        return this.client;
    }
    isTestnet() {
        return this.config.testnet;
    }
    async testConnectivity() {
        try {
            await this.client.ping();
            logger.info('Binance连接测试成功');
            return true;
        }
        catch (error) {
            logger.error('Binance连接测试失败:', error);
            return false;
        }
    }
    async getServerTime() {
        try {
            const result = await this.client.time();
            return result.serverTime;
        }
        catch (error) {
            logger.error('获取服务器时间失败:', error);
            throw error;
        }
    }
    async getExchangeInfo() {
        try {
            return await this.client.exchangeInfo();
        }
        catch (error) {
            logger.error('获取交易所信息失败:', error);
            throw error;
        }
    }
    formatError(error) {
        if (error.response && error.response.data) {
            return `API错误 ${error.response.status}: ${error.response.data.msg || error.response.data}`;
        }
        return error.message || '未知错误';
    }
}
//# sourceMappingURL=client.js.map