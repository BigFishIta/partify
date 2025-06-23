import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { ConfigModule } from '@nestjs/config';
import { envSchema } from './common/config/env.validation';            // ⬅️ nuovo

import { AllExceptionsFilter } from './common/filters/all-exceptions.filter'; // ⬅️ nuovo

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule }   from './auth/auth.module';

import { AppController } from './app.controller';
import { AppService }    from './app.service';
import { LoggerModule } from './common/logger/logger.module';

@Module({
  imports: [
    /* 1️⃣  Config globale con validazione Joi */
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envSchema,
      cache: true,
    }),

    /* 2️⃣  Moduli applicativi */
    LoggerModule,
    PrismaModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,

    /* 3️⃣  Filtro globale per uniformare gli errori */
    {
      provide : APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
