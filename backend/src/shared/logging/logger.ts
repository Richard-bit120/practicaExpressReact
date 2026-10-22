import { LogStorage } from './log-storage';

export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
}

export class Logger {
  private static async log(level: LogLevel, event: string, message: string) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level}] [${event}]: ${message}`);
    try {
      await LogStorage.saveLog(level, event, message);
    } catch (err) {
      console.error('Failed to persist log to database:', err);
    }
  }

  static info(event: string, message: string) {
    this.log(LogLevel.INFO, event, message);
  }

  static warn(event: string, message: string) {
    this.log(LogLevel.WARN, event, message);
  }

  static error(event: string, message: string) {
    this.log(LogLevel.ERROR, event, message);
  }

  static debug(event: string, message: string) {
    if (process.env.NODE_ENV === 'development') {
      this.log(LogLevel.DEBUG, event, message);
    }
  }
}