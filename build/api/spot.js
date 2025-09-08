import { logger } from '../utils/logger.js';
export class SpotAPI {
    client;
    constructor(client) {
        this.client = client;
    }
    async getAccountInfo() {
        try {
            const binanceClient = this.client.getClient();
            const result = await binanceClient.accountInfo();
            logger.debug('获取现货账户信息成功');
            return result;
        }
        catch (error) {
            logger.error('获取现货账户信息失败:', error);
            throw new Error(this.client.formatError(error));
        }
    }
    async getBalances() {
        try {
            const accountInfo = await this.getAccountInfo();
            return accountInfo.balances.filter(balance => parseFloat(balance.free) > 0 || parseFloat(balance.locked) > 0);
        }
        catch (error) {
            logger.error('获取余额信息失败:', error);
            throw error;
        }
    }
    async placeOrder(params) {
        try {
            const binanceClient = this.client.getClient();
            const orderParams = {
                symbol: params.symbol,
                side: params.side,
                type: params.type,
                quantity: params.quantity.toString(),
            };
            if (params.price) {
                orderParams.price = params.price.toString();
            }
            if (params.timeInForce) {
                orderParams.timeInForce = params.timeInForce;
            }
            if (params.stopPrice) {
                orderParams.stopPrice = params.stopPrice.toString();
            }
            const result = await binanceClient.order(orderParams);
            logger.info(`现货订单创建成功: ${params.symbol} ${params.side} ${params.quantity}`);
            return result;
        }
        catch (error) {
            logger.error('现货下单失败:', error);
            throw new Error(this.client.formatError(error));
        }
    }
    async cancelOrder(symbol, orderId) {
        try {
            const binanceClient = this.client.getClient();
            const result = await binanceClient.cancelOrder({
                symbol,
                orderId,
            });
            logger.info(`现货订单取消成功: ${symbol} #${orderId}`);
            return result;
        }
        catch (error) {
            logger.error('取消现货订单失败:', error);
            throw new Error(this.client.formatError(error));
        }
    }
    async getOpenOrders(symbol) {
        try {
            const binanceClient = this.client.getClient();
            const result = await binanceClient.openOrders(symbol ? { symbol } : {});
            logger.debug(`获取现货委托订单成功: ${result.length}个订单`);
            return result;
        }
        catch (error) {
            logger.error('获取现货委托订单失败:', error);
            throw new Error(this.client.formatError(error));
        }
    }
    async getOrderHistory(params) {
        try {
            const binanceClient = this.client.getClient();
            const result = await binanceClient.allOrders(params);
            logger.debug(`获取现货订单历史成功: ${result.length}个订单`);
            return result;
        }
        catch (error) {
            logger.error('获取现货订单历史失败:', error);
            throw new Error(this.client.formatError(error));
        }
    }
    async getTrades(params) {
        try {
            const binanceClient = this.client.getClient();
            const result = await binanceClient.myTrades(params);
            logger.debug(`获取现货交易历史成功: ${result.length}条记录`);
            return result;
        }
        catch (error) {
            logger.error('获取现货交易历史失败:', error);
            throw new Error(this.client.formatError(error));
        }
    }
    async getPrice(symbol) {
        try {
            const binanceClient = this.client.getClient();
            const result = await binanceClient.prices({ symbol });
            return { symbol, price: result[symbol] };
        }
        catch (error) {
            logger.error('获取价格信息失败:', error);
            throw new Error(this.client.formatError(error));
        }
    }
    async getAllPrices() {
        try {
            const binanceClient = this.client.getClient();
            const result = await binanceClient.prices();
            return Object.entries(result).map(([symbol, price]) => ({ symbol, price: String(price) }));
        }
        catch (error) {
            logger.error('获取所有价格信息失败:', error);
            throw new Error(this.client.formatError(error));
        }
    }
    async getOrderBook(symbol, limit = 100) {
        try {
            const binanceClient = this.client.getClient();
            const result = await binanceClient.book({ symbol, limit });
            logger.debug(`获取订单簿成功: ${symbol}`);
            return result;
        }
        catch (error) {
            logger.error('获取订单簿失败:', error);
            throw new Error(this.client.formatError(error));
        }
    }
    async getKlines(params) {
        try {
            const binanceClient = this.client.getClient();
            const result = await binanceClient.candles(params);
            logger.debug(`获取K线数据成功: ${params.symbol} ${params.interval}`);
            return result.map(kline => ({
                openTime: kline.openTime,
                open: kline.open,
                high: kline.high,
                low: kline.low,
                close: kline.close,
                volume: kline.volume,
                closeTime: kline.closeTime,
                quoteAssetVolume: kline.quoteAssetVolume,
                numberOfTrades: kline.numberOfTrades,
                takerBuyBaseAssetVolume: kline.takerBuyBaseAssetVolume,
                takerBuyQuoteAssetVolume: kline.takerBuyQuoteAssetVolume,
            }));
        }
        catch (error) {
            logger.error('获取K线数据失败:', error);
            throw new Error(this.client.formatError(error));
        }
    }
}
//# sourceMappingURL=spot.js.map