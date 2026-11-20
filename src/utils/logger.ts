import winston from "winston";
import path from "path";
import fs from "fs";
import { config } from "../config/env";

const logDir = path.resolve("logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss",
  }),
  winston.format.errors({
    stack: true,
  }),
  winston.format.metadata({
    fillExcept: ["message", "level", "timestamp"],
  }),
  winston.format.json(),
);

// 👇 Replace your old consoleFormat with this
const consoleFormat = winston.format.combine(
  winston.format.timestamp({
    format: "HH:mm:ss",
  }),
  winston.format.metadata({
    fillExcept: ["message", "level", "timestamp"],
  }),
  winston.format.printf(({ timestamp, level, message, metadata }) => {
    const metaObj = (metadata ?? {}) as Record<string, unknown>;
    const { context, service, ...rest } = metaObj;

    const ctx = context ? `[${String(context)}] ` : "";
    const extraMeta = Object.keys(rest).length ? ` ${JSON.stringify(rest)}` : "";

    return `${timestamp} [${level}]: ${ctx}${message}${extraMeta}`;
  }),
  winston.format.colorize(),
);

export const logger = winston.createLogger({
  level: config.isProd ? "info" : "debug",
  format: logFormat,
  defaultMeta: {
    service: "api",
  },
  transports: [
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
  exitOnError: false,
});

if (config.isDev) {
  logger.add(
    new winston.transports.Console({
      format: consoleFormat,
    }),
  );
}

export const createLogger = (context: string) => {
  return logger.child({ context });
};