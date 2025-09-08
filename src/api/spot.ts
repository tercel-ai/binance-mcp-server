import { BinanceClient } from './client.js';
import { SpotOrder, AccountBalance, TickerPrice, OrderBookDepth, KlineData } from '../utils/types.js';
import { logger } from '../utils/logger.js';

export class SpotAPI {
  private client: BinanceClient;

  constructor(client: BinanceClient) {
    this.client = client;
  }

  async getAccountInfo() {
    try {
      const binanceClient = this.client.getClient();
      const result = await binanceClient.accountInfo();
      logger.debug('获取现货账户信息成功');
      return result;
    } catch (error) {
      logger.error('获取现货账户信息失败:', error);
      throw new Error(this.client.formatError(error));
    }
  }

  async getBalances(): Promise<AccountBalance[]> {
    try {
      const accountInfo = await this.getAccountInfo();
      return accountInfo.balances.filter(balance => 
        parseFloat(balance.free) > 0 || parseFloat(balance.locked) > 0
      );
    } catch (error) {
      logger.error('获取余额信息失败:', error);
      throw error;
    }
  }

  async placeOrder(params: {
    symbol: string;
    side: 'BUY' | 'SELL';
    type: 'MARKET' | 'LIMIT' | 'STOP_LOSS' | 'STOP_LOSS_LIMIT' | 'TAKE_PROFIT' | 'TAKE_PROFIT_LIMIT' | 'LIMIT_MAKER';
    quantity: number;
    price?: number;
    timeInForce?: 'GTC' | 'IOC' | 'FOK';
    stopPrice?: number;
  }): Promise<SpotOrder> {
    try {
      const binanceClient = this.client.getClient();
      const orderParams: any = {
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
      return result as SpotOrder;
    } catch (error) {
      logger.error('现货下单失败:', error);
      throw new Error(this.client.formatError(error));
    }
  }

  async cancelOrder(symbol: string, orderId: number): Promise<SpotOrder> {
    try {
      const binanceClient = this.client.getClient();
      const result = await binanceClient.cancelOrder({
        symbol,
        orderId,
      });
      logger.info(`现货订单取消成功: ${symbol} #${orderId}`);
      return result as SpotOrder;
    } catch (error) {
      logger.error('取消现货订单失败:', error);
      throw new Error(this.client.formatError(error));
    }
  }

  async getOpenOrders(symbol?: string): Promise<SpotOrder[]> {
    try {
      const binanceClient = this.client.getClient();
      const result = await binanceClient.openOrders(symbol ? { symbol } : {});
      logger.debug(`获取现货委托订单成功: ${result.length}个订单`);
      return result as SpotOrder[];
    } catch (error) {
      logger.error('获取现货委托订单失败:', error);
      throw new Error(this.client.formatError(error));
    }
  }

  async getOrderHistory(params: {
    symbol: string;
    orderId?: number;
    startTime?: number;
    endTime?: number;
    limit?: number;
  }): Promise<SpotOrder[]> {
    try {
      const binanceClient = this.client.getClient();
      const result = await binanceClient.allOrders(params);
      logger.debug(`获取现货订单历史成功: ${result.length}个订单`);
      return result as SpotOrder[];
    } catch (error) {
      logger.error('获取现货订单历史失败:', error);
      throw new Error(this.client.formatError(error));
    }
  }

  async getTrades(params: {
    symbol: string;
    startTime?: number;
    endTime?: number;
    fromId?: number;
    limit?: number;
  }) {
    try {
      const binanceClient = this.client.getClient();
      const result = await binanceClient.myTrades(params);
      logger.debug(`获取现货交易历史成功: ${result.length}条记录`);
      return result;
    } catch (error) {
      logger.error('获取现货交易历史失败:', error);
      throw new Error(this.client.formatError(error));
    }
  }

  async getPrice(symbol: string): Promise<TickerPrice> {
    try {
      const binanceClient = this.client.getClient();
      const result = await binanceClient.prices({ symbol });
      return { symbol, price: result[symbol] };
    } catch (error) {
      logger.error('获取价格信息失败:', error);
      throw new Error(this.client.formatError(error));
    }
  }

  async getAllPrices(): Promise<TickerPrice[]> {
    try {
      const binanceClient = this.client.getClient();
      const result = await binanceClient.prices();
      return Object.entries(result).map(([symbol, price]) => ({ symbol, price: String(price) })) as any;
    } catch (error) {
      logger.error('获取所有价格信息失败:', error);
      throw new Error(this.client.formatError(error));
    }
  }

  async getOrderBook(symbol: string, limit: number = 100): Promise<OrderBookDepth> {
    try {
      const binanceClient = this.client.getClient();
      const result = await binanceClient.book({ symbol, limit });
      logger.debug(`获取订单簿成功: ${symbol}`);
      return result as OrderBookDepth;
    } catch (error) {
      logger.error('获取订单簿失败:', error);
      throw new Error(this.client.formatError(error));
    }
  }

  async getKlines(params: {
    symbol: string;
    interval: '1m' | '3m' | '5m' | '15m' | '30m' | '1h' | '2h' | '4h' | '6h' | '8h' | '12h' | '1d' | '3d' | '1w' | '1M';
    startTime?: number;
    endTime?: number;
    limit?: number;
  }): Promise<KlineData[]> {
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
    } catch (error) {
      logger.error('获取K线数据失败:', error);
      throw new Error(this.client.formatError(error));
    }
  }
}