import { BinanceClient } from './client.js';
import { FuturesOrder, PortfolioMarginAccount, PortfolioPosition, KlineData, TickerPrice } from '../utils/types.js';
import { logger } from '../utils/logger.js';

export class FuturesAPI {
  private client: BinanceClient;

  constructor(client: BinanceClient) {
    this.client = client;
  }

  async getPortfolioAccount(): Promise<PortfolioMarginAccount> {
    try {
      const binanceClient = this.client.getClient();
      const result = await binanceClient.futuresAccountInfo();
      logger.debug('获取统一账户信息成功');
      return result as PortfolioMarginAccount;
    } catch (error) {
      logger.error('获取统一账户信息失败:', error);
      throw new Error(this.client.formatError(error));
    }
  }

  async getPositions(symbol?: string): Promise<PortfolioPosition[]> {
    try {
      const binanceClient = this.client.getClient();
      const result = await binanceClient.futuresPositionRisk(symbol ? { symbol } : {});
      const positions = (result as any[]).filter(pos => parseFloat(pos.positionAmt) !== 0);
      logger.debug(`获取合约持仓成功: ${positions.length}个持仓`);
      return positions as PortfolioPosition[];
    } catch (error) {
      logger.error('获取合约持仓失败:', error);
      throw new Error(this.client.formatError(error));
    }
  }

  async changeLeverage(symbol: string, leverage: number): Promise<any> {
    try {
      const binanceClient = this.client.getClient();
      const result = await binanceClient.futuresLeverage({ symbol, leverage });
      logger.info(`修改杠杆倍数成功: ${symbol} ${leverage}x`);
      return result;
    } catch (error) {
      logger.error('修改杠杆倍数失败:', error);
      throw new Error(this.client.formatError(error));
    }
  }

  async placeOrder(params: {
    symbol: string;
    side: 'BUY' | 'SELL';
    positionSide?: 'BOTH' | 'LONG' | 'SHORT';
    type: 'MARKET' | 'LIMIT' | 'STOP' | 'TAKE_PROFIT' | 'STOP_MARKET' | 'TAKE_PROFIT_MARKET';
    quantity: number;
    price?: number;
    timeInForce?: 'GTC' | 'IOC' | 'FOK' | 'GTX';
    reduceOnly?: boolean;
    stopPrice?: number;
    closePosition?: boolean;
  }): Promise<FuturesOrder> {
    try {
      const binanceClient = this.client.getClient();
      const orderParams: any = {
        symbol: params.symbol,
        side: params.side,
        type: params.type,
        quantity: params.quantity.toString(),
      };

      if (params.positionSide) {
        orderParams.positionSide = params.positionSide;
      }

      if (params.price) {
        orderParams.price = params.price.toString();
      }

      if (params.timeInForce) {
        orderParams.timeInForce = params.timeInForce;
      }

      if (params.reduceOnly !== undefined) {
        orderParams.reduceOnly = params.reduceOnly;
      }

      if (params.stopPrice) {
        orderParams.stopPrice = params.stopPrice.toString();
      }

      if (params.closePosition !== undefined) {
        orderParams.closePosition = params.closePosition;
      }

      const result = await binanceClient.futuresOrder(orderParams);
      logger.info(`合约订单创建成功: ${params.symbol} ${params.side} ${params.quantity}`);
      return result as FuturesOrder;
    } catch (error) {
      logger.error('合约下单失败:', error);
      throw new Error(this.client.formatError(error));
    }
  }

  async cancelOrder(symbol: string, orderId: number): Promise<FuturesOrder> {
    try {
      const binanceClient = this.client.getClient();
      const result = await binanceClient.futuresCancelOrder({
        symbol,
        orderId,
      });
      logger.info(`合约订单取消成功: ${symbol} #${orderId}`);
      return result as FuturesOrder;
    } catch (error) {
      logger.error('取消合约订单失败:', error);
      throw new Error(this.client.formatError(error));
    }
  }

  async getOpenOrders(symbol?: string): Promise<FuturesOrder[]> {
    try {
      const binanceClient = this.client.getClient();
      const result = await binanceClient.futuresOpenOrders(symbol ? { symbol } : {});
      logger.debug(`获取合约委托订单成功: ${result.length}个订单`);
      return result as FuturesOrder[];
    } catch (error) {
      logger.error('获取合约委托订单失败:', error);
      throw new Error(this.client.formatError(error));
    }
  }

  async getOrderHistory(params: {
    symbol: string;
    orderId?: number;
    startTime?: number;
    endTime?: number;
    limit?: number;
  }): Promise<FuturesOrder[]> {
    try {
      const binanceClient = this.client.getClient();
      const result = await binanceClient.futuresAllOrders(params);
      logger.debug(`获取合约订单历史成功: ${result.length}个订单`);
      return result as FuturesOrder[];
    } catch (error) {
      logger.error('获取合约订单历史失败:', error);
      throw new Error(this.client.formatError(error));
    }
  }

  async getUserTrades(params: {
    symbol: string;
    startTime?: number;
    endTime?: number;
    fromId?: number;
    limit?: number;
  }) {
    try {
      const binanceClient = this.client.getClient();
      const result = await binanceClient.futuresUserTrades(params);
      logger.debug(`获取合约交易历史成功: ${result.length}条记录`);
      return result;
    } catch (error) {
      logger.error('获取合约交易历史失败:', error);
      throw new Error(this.client.formatError(error));
    }
  }

  async getPrice(symbol: string): Promise<TickerPrice> {
    try {
      const binanceClient = this.client.getClient();
      const result = await binanceClient.futuresPrices({ symbol });
      return { symbol, price: result[symbol] };
    } catch (error) {
      logger.error('获取合约价格信息失败:', error);
      throw new Error(this.client.formatError(error));
    }
  }

  async getAllPrices(): Promise<TickerPrice[]> {
    try {
      const binanceClient = this.client.getClient();
      const result = await binanceClient.futuresPrices();
      return Object.entries(result).map(([symbol, price]) => ({ symbol, price: String(price) })) as any;
    } catch (error) {
      logger.error('获取所有合约价格信息失败:', error);
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
      const result = await binanceClient.futuresCandles(params);
      logger.debug(`获取合约K线数据成功: ${params.symbol} ${params.interval}`);
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
      logger.error('获取合约K线数据失败:', error);
      throw new Error(this.client.formatError(error));
    }
  }

  async setMarginType(symbol: string, marginType: 'ISOLATED' | 'CROSSED'): Promise<any> {
    try {
      const binanceClient = this.client.getClient();
      const result = await binanceClient.futuresMarginType({ symbol, marginType });
      logger.info(`设置保证金模式成功: ${symbol} ${marginType}`);
      return result;
    } catch (error) {
      logger.error('设置保证金模式失败:', error);
      throw new Error(this.client.formatError(error));
    }
  }
}