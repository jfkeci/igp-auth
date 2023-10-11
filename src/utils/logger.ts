import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const colors = {
  error: 'red',
  warn: 'yellow',
  debug: 'green',
  verbose: 'white',
  http: 'magenta',
};

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'dd-mm-YYYY hh:MM:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.colorize({ colors }),
    winston.format.printf(({ timestamp, level, message, label, stack }) => {
      return `${timestamp} [${label || 'iGP Auth'}] ${level}: ${message}${
        stack ? '\n' + stack : ''
      }`;
    }),
  ),
  transports: [
    new winston.transports.Console(),
    new DailyRotateFile({
      dirname: 'logs',
      filename: 'application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
});
