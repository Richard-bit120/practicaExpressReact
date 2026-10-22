export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
}

export interface ILogQuery {
  level?: LogLevel;
  startDate?: string;
  endDate?: string;
  limit?: number;
}