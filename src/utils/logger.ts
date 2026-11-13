import winston from 'winston';
import path from 'path';
import { config } from '../config/env';

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp'] }),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf((info) => {
    const { timestamp, level, message, metadata } = info;
    const meta = metadata && Object.keys(metadata as object).length ? JSON.stringify(metadata) : '';
    return `${timestamp} [${level}]: ${message} ${meta}`;
  })
);

export const logger = winston.createLogger({
  level: config.isProd ? 'info' : 'debug',
  format: logFormat,
  defaultMeta: { service: 'api' },
  transports: [
    new winston.transports.File({
      filename: path.join('logs', 'combined.log'),
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new winston.transports.Console({
      format: consoleFormat,
    }),
  ],
});