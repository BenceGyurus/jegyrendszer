import { Injectable } from '@nestjs/common';
import { createLogger, format, transports } from 'winston';
import LokiTransport from 'winston-loki';

@Injectable()
export class LokiLogger {
  constructor() {}
  static initLogger = () => {
    if (process.env.NODE_ENV == 'production')
      return createLogger({
        transports: [
          new LokiTransport({
            host: process.env.LOKI_URL,
            labels: { app: 'mail' },
            json: true,
            format: format.json(),
            replaceTimestamp: true,
            onConnectionError: (err) => console.error(err),
          }),
          new transports.Console({
            format: format.combine(format.simple(), format.colorize()),
          }),
        ],
      });
    else
      return createLogger({
        transports: [
          new transports.Console({
            format: format.combine(format.simple(), format.colorize()),
          }),
        ],
      });
  };
}
