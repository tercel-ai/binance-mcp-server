import { logger } from './logger.js';

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
export class ParameterValidator {
  
  /**
   * 验证交易对参数
   */
  static validateSymbol(symbol?: string, required: boolean = true): ValidationResult {
    if (!symbol) {
      if (required) {
        return {
          valid: false,
          error: '交易对参数为必填项，请提供如"BTCUSDT"、"ETHUSDT"等有效交易对。',
          suggestions: [
            '主流交易对：BTCUSDT, ETHUSDT, BNBBUSD',
            '山寨币交易对：ADAUSDT, DOTUSDT, LINKUSDT',
            '请确保交易对格式正确，如：基础币种+计价币种'
          ]
        };
      }
      return { valid: true, data: null };
    }

    // 验证交易对格式
    const symbolPattern = /^[A-Z]{2,10}USDT?$|^[A-Z]{2,10}BTC$|^[A-Z]{2,10}ETH$|^[A-Z]{2,10}BNB$/;
    if (!symbolPattern.test(symbol.toUpperCase())) {
      return {
        valid: false,
        error: `交易对格式不正确: "${symbol}"。请使用标准格式，如BTCUSDT。`,
        suggestions: [
          '标准格式：基础币种 + 计价币种',
          '常用计价币：USDT, BTC, ETH, BNB',
          '示例：BTCUSDT（比特币兑USDT）, ETHBTC（以太坊兑比特币）'
        ]
      };
    }

    return { 
      valid: true, 
      data: symbol.toUpperCase(),
      warnings: symbol !== symbol.toUpperCase() ? ['已自动转换为大写格式'] : undefined
    };
  }

  /**
   * 验证价格参数
   */
  static validatePrice(price?: number, required: boolean = true): ValidationResult {
    if (price === undefined || price === null) {
      if (required) {
        return {
          valid: false,
          error: '价格参数为必填项，请提供有效的价格数值。',
          suggestions: [
            '价格必须为正数，如：43250.50',
            '支持小数点，精度根据交易对而定',
            '建议参考当前市价设置合理价格'
          ]
        };
      }
      return { valid: true, data: null };
    }

    if (typeof price !== 'number' || price <= 0) {
      return {
        valid: false,
        error: `价格必须为正数，当前值: ${price}`,
        suggestions: [
          '价格必须大于0',
          '请检查数值格式，确保为有效数字',
          '避免使用负数或零作为价格'
        ]
      };
    }

    if (price > 10000000) {
      return {
        valid: false,
        error: `价格过高: ${price}，请检查是否输入正确。`,
        warnings: ['价格异常高，请确认是否正确']
      };
    }

    return { valid: true, data: price };
  }

  /**
   * 验证数量参数
   */
  static validateQuantity(quantity?: number, required: boolean = true): ValidationResult {
    if (quantity === undefined || quantity === null) {
      if (required) {
        return {
          valid: false,
          error: '数量参数为必填项，请提供有效的交易数量。',
          suggestions: [
            '数量必须为正数，如：0.1, 1.5, 100',
            '注意各交易对的最小下单量限制',
            '建议查看交易对规则确定合适数量'
          ]
        };
      }
      return { valid: true, data: null };
    }

    if (typeof quantity !== 'number' || quantity <= 0) {
      return {
        valid: false,
        error: `数量必须为正数，当前值: ${quantity}`,
        suggestions: [
          '数量必须大于0',
          '请检查数值格式，确保为有效数字',
          '避免使用负数或零作为数量'
        ]
      };
    }

    if (quantity < 0.000001) {
      return {
        valid: false,
        error: `数量过小: ${quantity}，可能低于最小交易限制。`,
        suggestions: [
          '检查交易对的最小下单量要求',
          '建议使用binance_check_order_precision工具验证'
        ]
      };
    }

    return { valid: true, data: quantity };
  }

  /**
   * 验证杠杆倍数
   */
  static validateLeverage(leverage?: number): ValidationResult {
    if (leverage === undefined || leverage === null) {
      return { 
        valid: true, 
        data: 1,
        warnings: ['未指定杠杆倍数，默认使用1倍（无杠杆）']
      };
    }

    if (typeof leverage !== 'number' || leverage < 1 || leverage > 125) {
      return {
        valid: false,
        error: `杠杆倍数必须在1-125之间，当前值: ${leverage}`,
        suggestions: [
          '新手建议使用1-5倍杠杆',
          '专业交易者可使用10-20倍',
          '高风险操作可使用更高杠杆，但需严格风控'
        ]
      };
    }

    const warnings = [];
    if (leverage > 20) {
      warnings.push('⚠️ 高杠杆风险：超过20倍杠杆风险极高，请谨慎使用');
    } else if (leverage > 10) {
      warnings.push('⚠️ 中高风险：超过10倍杠杆，建议加强风险管理');
    }

    return { 
      valid: true, 
      data: leverage,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }

  /**
   * 验证订单类型
   */
  static validateOrderType(type?: string): ValidationResult {
    const validTypes = ['MARKET', 'LIMIT', 'STOP_LOSS', 'STOP_LOSS_LIMIT', 'TAKE_PROFIT', 'TAKE_PROFIT_LIMIT'];
    
    if (!type) {
      return { 
        valid: true, 
        data: 'MARKET',
        warnings: ['未指定订单类型，默认使用市价单(MARKET)']
      };
    }

    const upperType = type.toUpperCase();
    if (!validTypes.includes(upperType)) {
      return {
        valid: false,
        error: `无效的订单类型: ${type}`,
        suggestions: [
          'MARKET: 市价单（立即成交）',
          'LIMIT: 限价单（指定价格）',
          'STOP_LOSS: 止损单',
          'STOP_LOSS_LIMIT: 限价止损单',
          'TAKE_PROFIT: 止盈单',
          'TAKE_PROFIT_LIMIT: 限价止盈单'
        ]
      };
    }

    return { 
      valid: true, 
      data: upperType,
      warnings: type !== upperType ? ['已自动转换为大写格式'] : undefined
    };
  }

  /**
   * 验证交易方向
   */
  static validateSide(side?: string, required: boolean = true): ValidationResult {
    if (!side) {
      if (required) {
        return {
          valid: false,
          error: '交易方向为必填项，请指定BUY或SELL。',
          suggestions: [
            'BUY: 买入/做多',
            'SELL: 卖出/做空',
            '现货交易：BUY买入，SELL卖出',
            '合约交易：BUY做多，SELL做空'
          ]
        };
      }
      return { valid: true, data: null };
    }

    const validSides = ['BUY', 'SELL'];
    const upperSide = side.toUpperCase();
    
    if (!validSides.includes(upperSide)) {
      return {
        valid: false,
        error: `无效的交易方向: ${side}`,
        suggestions: [
          'BUY: 买入/做多',
          'SELL: 卖出/做空',
          '请确保拼写正确'
        ]
      };
    }

    return { 
      valid: true, 
      data: upperSide,
      warnings: side !== upperSide ? ['已自动转换为大写格式'] : undefined
    };
  }

  /**
   * 验证时间间隔
   */
  static validateInterval(interval?: string): ValidationResult {
    const validIntervals = ['1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d', '3d', '1w', '1M'];
    
    if (!interval) {
      return { 
        valid: true, 
        data: '1h',
        warnings: ['未指定时间间隔，默认使用1小时(1h)']
      };
    }

    if (!validIntervals.includes(interval)) {
      return {
        valid: false,
        error: `无效的时间间隔: ${interval}`,
        suggestions: [
          '分钟级：1m, 3m, 5m, 15m, 30m',
          '小时级：1h, 2h, 4h, 6h, 8h, 12h',
          '天级：1d, 3d',
          '周月级：1w, 1M'
        ]
      };
    }

    return { valid: true, data: interval };
  }

  /**
   * 综合参数验证
   */
  static validateParameters(params: any, rules: { [key: string]: { required?: boolean, type?: string } }): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];
    const validatedData: any = {};

    for (const [key, rule] of Object.entries(rules)) {
      const value = params[key];
      let result: ValidationResult;

      switch (rule.type) {
        case 'symbol':
          result = this.validateSymbol(value, rule.required);
          break;
        case 'price':
          result = this.validatePrice(value, rule.required);
          break;
        case 'quantity':
          result = this.validateQuantity(value, rule.required);
          break;
        case 'leverage':
          result = this.validateLeverage(value);
          break;
        case 'orderType':
          result = this.validateOrderType(value);
          break;
        case 'side':
          result = this.validateSide(value, rule.required);
          break;
        case 'interval':
          result = this.validateInterval(value);
          break;
        default:
          result = { valid: true, data: value };
      }

      if (!result.valid) {
        errors.push(`${key}: ${result.error}`);
        if (result.suggestions) {
          suggestions.push(...result.suggestions);
        }
      } else {
        validatedData[key] = result.data;
        if (result.warnings) {
          warnings.push(...result.warnings);
        }
      }
    }

    if (errors.length > 0) {
      return {
        valid: false,
        error: errors.join('\n'),
        suggestions: suggestions.length > 0 ? suggestions : undefined
      };
    }

    return {
      valid: true,
      data: validatedData,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }

  /**
   * 格式化验证错误消息
   */
  static formatValidationError(result: ValidationResult): string {
    let message = `❌ 参数验证失败:\n\n${result.error}`;
    
    if (result.suggestions && result.suggestions.length > 0) {
      message += '\n\n💡 参数建议:\n';
      result.suggestions.forEach(suggestion => {
        message += `• ${suggestion}\n`;
      });
    }
    
    return message;
  }

  /**
   * 格式化验证警告消息
   */
  static formatValidationWarnings(warnings: string[]): string {
    if (!warnings || warnings.length === 0) return '';
    
    let message = '⚠️ 参数提醒:\n';
    warnings.forEach(warning => {
      message += `• ${warning}\n`;
    });
    
    return message;
  }
}