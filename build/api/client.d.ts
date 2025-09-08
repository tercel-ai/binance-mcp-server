import { BinanceConfig } from '../utils/types.js';
export declare class BinanceClient {
    private client;
    private config;
    constructor(config: BinanceConfig);
    getClient(): any;
    isTestnet(): boolean;
    testConnectivity(): Promise<boolean>;
    getServerTime(): Promise<number>;
    getExchangeInfo(): Promise<any>;
    formatError(error: any): string;
}
//# sourceMappingURL=client.d.ts.map