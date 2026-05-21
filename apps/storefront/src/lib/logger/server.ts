import 'server-only';

import { type Logger, type LoggerOptions, pino } from 'pino';

import { env } from '@/env';

function buildOptions(): LoggerOptions {
  const base: LoggerOptions = {
    level: env.NODE_ENV === 'production' ? 'info' : 'debug',
    formatters: { level: (label) => ({ level: label }) },
    redact: {
      paths: [
        'password',
        'token',
        'cookie',
        '*.password',
        '*.token',
        'headers.cookie',
        'headers.authorization',
      ],
      censor: '[REDACTED]',
    },
  };

  if (env.NODE_ENV !== 'production') {
    return {
      ...base,
      transport: {
        target: 'pino-pretty',
        options: { colorize: true, translateTime: 'SYS:HH:MM:ss.l' },
      },
    };
  }

  return base;
}

let cached: Logger | undefined;

export function getLogger(): Logger {
  cached ??= pino(buildOptions());
  return cached;
}

export const logger = getLogger();
