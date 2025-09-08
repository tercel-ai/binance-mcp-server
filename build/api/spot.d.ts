import { BinanceClient } from './client.js';
import { SpotOrder, AccountBalance, TickerPrice, OrderBookDepth, KlineData } from '../utils/types.js';
export declare class SpotAPI {
    private client;
    constructor(client: BinanceClient);
    getAccountInfo(): Promise<any>;
    getBalances(): Promise<AccountBalance[]>;
    placeOrder(params: {
        symbol: string;
        side: 'BUY' | 'SELL';
        type: 'MARKET' | 'LIMIT' | 'STOP_LOSS' | 'STOP_LOSS_LIMIT' | 'TAKE_PROFIT' | 'TAKE_PROFIT_LIMIT' | 'LIMIT_MAKER';
        quantity: number;
        price?: number;
        timeInForce?: 'GTC' | 'IOC' | 'FOK';
        stopPrice?: number;
    }): Promise<SpotOrder>;
    cancelOrder(symbol: string, orderId: number): Promise<SpotOrder>;
    getOpenOrders(symbol?: string): Promise<SpotOrder[]>;
    getOrderHistory(params: {
        symbol: string;
        orderId?: number;
        startTime?: number;
        endTime?: number;
        limit?: number;
    }): Promise<SpotOrder[]>;
    getTrades(params: {
        symbol: string;
        startTime?: number;
        endTime?: number;
        fromId?: number;
        limit?: number;
    }): Promise<any>;
    getPrice(symbol: string): Promise<TickerPrice>;
    getAllPrices(): Promise<TickerPrice[]>;
    getOrderBook(symbol: string, limit?: number): Promise<OrderBookDepth>;
    getKlines(params: {
        symbol: string;
        interval: '1m' | '3m' | '5m' | '15m' | '30m' | '1h' | '2h' | '4h' | '6h' | '8h' | '12h' | '1d' | '3d' | '1w' | '1M';
        startTime?: number;
        endTime?: number;
        limit?: number;
    }): Promise<KlineData[]>;
}
//# sourceMappingURL=spot.d.ts.map