import { Injectable, LoggerService } from '@nestjs/common';
import { createLogger, transports, format, Logger } from 'winston';

@Injectable()
export class AppLogger implements LoggerService {
  private logger: Logger;

  constructor() {
    this.logger = createLogger({
      level: 'info',
      format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.json()
      ),
      transports: [
        new transports.Console(),
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/combined.log' }),
      ],
    });
  }

  log(message: string) {
    this.logger.info({ message });
  }

  error(message: string, trace?: string) {
    this.logger.error({ message, trace });
  }

  warn(message: string) {
    this.logger.warn({ message });
  }

  debug(message: string) {
    this.logger.debug({ message });
  }

  verbose(message: string) {
    this.logger.verbose({ message });
  }
}


