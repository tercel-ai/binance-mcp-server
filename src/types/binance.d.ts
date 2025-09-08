// Binance API Node 类型声明文件
declare module 'binance-api-node' {
  export interface BinanceConfig {
    apiKey: string;
    apiSecret: string;
    testnet?: boolean;
    useServerTime?: boolean;
    [key: string]: any;
  }

  export interface AccountBalance {
    asset: string;
    free: string;
    locked: string;
    total?: any;
  }

  export interface TickerPrice {
    symbol: string;
    price: any;
  }

  export interface SpotOrder {
    symbol: string;
    orderId: number;
    clientOrderId: string;
    price: string;
    origQty: string;
    executedQty: string;
    cummulativeQuoteQty: string;
    status: string;
    type: string;
    side: string;
    transactTime?: number;
    updateTime?: number;
  }

  export interface FuturesPosition {
    symbol: string;
    positionAmt: string;
    entryPrice: string;
    markPrice: string;
    unRealizedProfit: string;
    liquidationPrice: string;
    positionSide: 'BOTH' | 'LONG' | 'SHORT';
    leverage: string;
    marginType: 'isolated' | 'cross';
    notional: string;
  }

  export interface BinanceClient {
    [key: string]: any;
    ping(): Promise<any>;
    accountInfo(): Promise<any>;
    futuresAccountInfo(): Promise<any>;
    futuresPositionInfo(params?: any): Promise<any>;
    order(params: any): Promise<any>;
    futuresOrder(params: any): Promise<any>;
    cancelOrder(params: any): Promise<any>;
    futuresCancelOrder(params: any): Promise<any>;
    prices(params?: any): Promise<any>;
    futuresPrices(params?: any): Promise<any>;
    dailyStats(params?: any): Promise<any>;
    futuresDailyStats(params?: any): Promise<any>;
    book(params: any): Promise<any>;
    futuresBook(params: any): Promise<any>;
    candles(params: any): Promise<any[]>;
    futuresCandles(params: any): Promise<any[]>;
    time(): Promise<{ serverTime: number }>;
    exchangeInfo(): Promise<any>;
    futuresExchangeInfo(): Promise<any>;
    myTrades(params: any): Promise<any[]>;
    futuresUserTrades(params: any): Promise<any[]>;
    openOrders(params?: any): Promise<any>;
    futuresOpenOrders(params?: any): Promise<any>;
  }

  export default function Binance(config: BinanceConfig): BinanceClient;
}