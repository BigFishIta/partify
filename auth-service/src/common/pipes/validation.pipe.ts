import {
  BadRequestException,
  ValidationPipe as NestValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';

export class ValidationPipe extends NestValidationPipe {
  constructor(options?: ValidationPipeOptions) {
    super({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const messages = errors.map(err => {
          const constraints = err.constraints
            ? Object.values(err.constraints).join(', ')
            : 'Errore di validazione.';
          return `${err.property}: ${constraints}`;
        });
        return new BadRequestException(messages);
      },
      ...options,
    });
  }
}
