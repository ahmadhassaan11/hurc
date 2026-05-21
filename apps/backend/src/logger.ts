import pino, { type LoggerOptions } from 'pino';

import { env } from './env.js';

const redactPaths = [
  'cookie',
  'authorization',
  'email',
  '*.cookie',
  '*.authorization',
  '*.email',
  'req.headers.cookie',
  'req.headers.authorization',
  'res.headers["set-cookie"]',
];

const baseOptions: LoggerOptions = {
  level: env.LOG_LEVEL,
  base: { app: 'hurc-backend', env: env.APP_ENV },
  redact: { paths: redactPaths, remove: true },
};

const devOptions: LoggerOptions = {
  ...baseOptions,
  transport: {
    target: 'pino-pretty',
    options: { colorize: true, singleLine: true, translateTime: 'HH:MM:ss.l' },
  },
};

// Better Stack (Logtail) HTTP transport is wired in a later sub-task once
// LOGTAIL_SOURCE_TOKEN_BACKEND is provisioned in Doppler. Until then prod logs
// are JSON to stdout — every PaaS we use can ingest that.
export const logger = pino(env.NODE_ENV === 'development' ? devOptions : baseOptions);
