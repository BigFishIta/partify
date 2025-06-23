import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshTokenStrategy } from './strategies/refresh.strategy';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

import { jwtConstants } from './jwt.constants';   // <── aggiungi
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module'; // già esistente
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    MailModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '5m' }
    })
  ],
  providers: [AuthService,JwtStrategy, JwtAuthGuard, RefreshTokenStrategy,
    JwtRefreshGuard,],
  controllers: [AuthController]
})
export class AuthModule {}
