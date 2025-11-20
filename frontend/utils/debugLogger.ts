/**
 * Comprehensive Debug Logger for NFT Minting
 * Logs all operations with timestamps and context
 */

type LogLevel = 'info' | 'warn' | 'error' | 'success' | 'debug';

interface LogContext {
  component?: string;
  action?: string;
  data?: any;
  error?: any;
}

class DebugLogger {
  private enabled: boolean;
  private logs: Array<{ timestamp: string; level: LogLevel; message: string; context?: LogContext }> = [];

  constructor() {
    // Enable in development or if explicitly set
    this.enabled = process.env.NODE_ENV === 'development' || 
                   typeof window !== 'undefined' && (window as any).__DEBUG_NFT__ === true;
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const emoji = {
      info: 'ℹ️',
      warn: '⚠️',
      error: '❌',
      success: '✅',
      debug: '🔍',
    }[level];

    let logMessage = `${emoji} [${timestamp}] ${message}`;
    
    if (context) {
      logMessage += '\n   Context:';
      if (context.component) logMessage += `\n     Component: ${context.component}`;
      if (context.action) logMessage += `\n     Action: ${context.action}`;
      if (context.data) {
        logMessage += `\n     Data: ${JSON.stringify(context.data, null, 2)}`;
      }
      if (context.error) {
        logMessage += `\n     Error: ${context.error.message || context.error}`;
        if (context.error.stack) {
          logMessage += `\n     Stack: ${context.error.stack}`;
        }
      }
    }

    return logMessage;
  }

  log(level: LogLevel, message: string, context?: LogContext) {
    if (!this.enabled) return;

    const formatted = this.formatMessage(level, message, context);
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
    };

    this.logs.push(logEntry);

    // Keep only last 100 logs
    if (this.logs.length > 100) {
      this.logs.shift();
    }

    // Output to console
    switch (level) {
      case 'error':
        console.error(formatted);
        break;
      case 'warn':
        console.warn(formatted);
        break;
      case 'success':
        console.log(`%c${formatted}`, 'color: green; font-weight: bold');
        break;
      default:
        console.log(formatted);
    }
  }

  info(message: string, context?: LogContext) {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext) {
    this.log('warn', message, context);
  }

  error(message: string, context?: LogContext) {
    this.log('error', message, context);
  }

  success(message: string, context?: LogContext) {
    this.log('success', message, context);
  }

  debug(message: string, context?: LogContext) {
    this.log('debug', message, context);
  }

  // Price fetching
  logPriceFetch(status: 'start' | 'success' | 'error', data?: any) {
    if (status === 'start') {
      this.debug('Fetching mint price from contract', {
        component: 'PriceFetch',
        action: 'fetch',
        data: { contractAddress: data?.contractAddress },
      });
    } else if (status === 'success') {
      this.success('Mint price fetched successfully', {
        component: 'PriceFetch',
        action: 'success',
        data: { price: data?.price, formatted: data?.formatted },
      });
    } else {
      this.error('Failed to fetch mint price', {
        component: 'PriceFetch',
        action: 'error',
        error: data?.error,
      });
    }
  }

  // Contract reads
  logContractRead(functionName: string, status: 'start' | 'success' | 'error', data?: any) {
    if (status === 'start') {
      this.debug(`Reading contract function: ${functionName}`, {
        component: 'ContractRead',
        action: functionName,
      });
    } else if (status === 'success') {
      this.success(`Contract read successful: ${functionName}`, {
        component: 'ContractRead',
        action: functionName,
        data: { result: data?.result },
      });
    } else {
      this.error(`Contract read failed: ${functionName}`, {
        component: 'ContractRead',
        action: functionName,
        error: data?.error,
      });
    }
  }

  // Transaction flow
  logTransaction(step: 'prepare' | 'send' | 'confirm' | 'success' | 'error', data?: any) {
    const messages = {
      prepare: 'Preparing transaction',
      send: 'Sending transaction to wallet',
      confirm: 'Transaction sent, waiting for confirmation',
      success: 'Transaction confirmed successfully',
      error: 'Transaction failed',
    };

    if (step === 'error') {
      this.error(messages[step], {
        component: 'Transaction',
        action: step,
        error: data?.error,
        data: { hash: data?.hash },
      });
    } else if (step === 'success') {
      this.success(messages[step], {
        component: 'Transaction',
        action: step,
        data: { hash: data?.hash, blockNumber: data?.blockNumber },
      });
    } else {
      this.info(messages[step], {
        component: 'Transaction',
        action: step,
        data,
      });
    }
  }

  // Metadata creation
  logMetadata(status: 'start' | 'success' | 'error', data?: any) {
    if (status === 'start') {
      this.debug('Creating NFT metadata', {
        component: 'Metadata',
        action: 'create',
        data: { name: data?.name, hasImage: data?.hasImage, attributesCount: data?.attributesCount },
      });
    } else if (status === 'success') {
      this.success('Metadata created successfully', {
        component: 'Metadata',
        action: 'success',
        data: { uriLength: data?.uriLength },
      });
    } else {
      this.error('Failed to create metadata', {
        component: 'Metadata',
        action: 'error',
        error: data?.error,
      });
    }
  }

  // Get all logs
  getLogs() {
    return this.logs;
  }

  // Clear logs
  clearLogs() {
    this.logs = [];
  }

  // Export logs as JSON
  exportLogs() {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const logger = new DebugLogger();

// Enable debug mode in browser console
if (typeof window !== 'undefined') {
  (window as any).__DEBUG_NFT__ = true;
  (window as any).__NFT_LOGGER__ = logger;
}

