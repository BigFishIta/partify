import { NestFactory } from '@nestjs/core';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: ['http://localhost:3000'],
      credentials: true,
    },
  });

  // ───── ValidationPipe globale con messaggi chiari ─────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      exceptionFactory: (errors) => {
        const messages = errors.map((err) => {
          const constraints = err.constraints
            ? Object.values(err.constraints).join(', ')
            : 'Errore di validazione.';
          return `${err.property}: ${constraints}`;
        });
        return new BadRequestException(messages);
      },
    }),
  );

  // ───── Configura porta da .env o default 3000 ─────
  const config = app.get(ConfigService);
  const port = config.get<number>('PORT') ?? 3000;

  await app.listen(port);
  console.log(`🚀 Auth-service listening on http://localhost:${port}`);
}
bootstrap();

