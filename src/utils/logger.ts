import * as winston from 'winston';
import { Context } from '../middleware/context';
import { LOG_LEVEL } from './environment';

const logger = winston.createLogger({
  level: LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
          return `${timestamp} [${level}]: ${message} ${metaStr}`;
        })
      )
    })
  ]
});

/**
 * Obtiene un logger con contexto de trazabilidad
 * @param ctx - Contexto de la aplicación
 * @returns Logger con información de contexto
 */
export const getLogger = (ctx: Context) => {
  return {
    debug: (message: string, meta?: Record<string, unknown>) => {
      logger.debug(message, { ...meta, ...getContextMeta(ctx) });
    },
    info: (message: string, meta?: Record<string, unknown>) => {
      logger.info(message, { ...meta, ...getContextMeta(ctx) });
    },
    warn: (message: string, meta?: Record<string, unknown>) => {
      logger.warn(message, { ...meta, ...getContextMeta(ctx) });
    },
    error: (message: string, meta?: Record<string, unknown>) => {
      logger.error(message, { ...meta, ...getContextMeta(ctx) });
    }
  };
};

const getContextMeta = (ctx: Context): Record<string, string> => {
  return {
    applicationId: ctx.applicationId,
    transactionId: ctx.transactionId
  };
};

export default logger;
