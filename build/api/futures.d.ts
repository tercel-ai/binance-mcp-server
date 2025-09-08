import { BinanceClient } from './client.js';
import { FuturesOrder, PortfolioMarginAccount, PortfolioPosition, KlineData, TickerPrice } from '../utils/types.js';
export declare class FuturesAPI {
    private client;
    constructor(client: BinanceClient);
    getPortfolioAccount(): Promise<PortfolioMarginAccount>;
    getPositions(symbol?: string): Promise<PortfolioPosition[]>;
    changeLeverage(symbol: string, leverage: number): Promise<any>;
    placeOrder(params: {
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
    }): Promise<FuturesOrder>;
    cancelOrder(symbol: string, orderId: number): Promise<FuturesOrder>;
    getOpenOrders(symbol?: string): Promise<FuturesOrder[]>;
    getOrderHistory(params: {
        symbol: string;
        orderId?: number;
        startTime?: number;
        endTime?: number;
        limit?: number;
    }): Promise<FuturesOrder[]>;
    getUserTrades(params: {
        symbol: string;
        startTime?: number;
        endTime?: number;
        fromId?: number;
        limit?: number;
    }): Promise<any>;
    getPrice(symbol: string): Promise<TickerPrice>;
    getAllPrices(): Promise<TickerPrice[]>;
    getKlines(params: {
        symbol: string;
        interval: '1m' | '3m' | '5m' | '15m' | '30m' | '1h' | '2h' | '4h' | '6h' | '8h' | '12h' | '1d' | '3d' | '1w' | '1M';
        startTime?: number;
        endTime?: number;
        limit?: number;
    }): Promise<KlineData[]>;
    setMarginType(symbol: string, marginType: 'ISOLATED' | 'CROSSED'): Promise<any>;
}
//# sourceMappingURL=futures.d.ts.map