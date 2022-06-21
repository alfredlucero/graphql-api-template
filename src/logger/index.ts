import pino from 'pino';
import AppConfig from '../config';

export interface GraphQLAPILogger {
  log: (logLevel: LogLevel, logMessage: string, logData?: Record<string, unknown>) => void;
}

type LogLevel = 'fatal' | 'error' | 'warn' | 'info' | 'debug';

const pinoLogger = pino({
  level: AppConfig.server.logLevel,
  formatters: {
    level: (label: string, levelNumber: number) => {
      return { level: label };
    },
  },
  mixin() {
    return {
      app: AppConfig.server.name,
    };
  },
});

const logger: GraphQLAPILogger = {
  log: (logLevel: LogLevel, logMessage: string, logData: Record<string, unknown> = {}) => {
    pinoLogger[logLevel](logData, logMessage);
  },
};

export default logger;
