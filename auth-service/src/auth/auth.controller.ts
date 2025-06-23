import {
  Body,
  Controller,
  Post,
  Get,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  /* ---------- SIGN-UP ---------- */
  @Post('signup')
  async signup(
    @Body() dto: { email: string; password: string; name?: string },
  ) {
    return this.auth.signup(dto);
  }

  /* ---------- LOGIN (access + refresh) ---------- */
  @Post('login')
  async login(
    @Body() dto: { email: string; password: string },
  ) {
    const user = await this.auth.validateUser(dto.email, dto.password);
    if (!user) throw new UnauthorizedException();
    return this.auth.login(user.id);
  }

  /* ---------- ROTTA PROTETTA: profilo ---------- */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req: any) {
    return { userId: (req as any).user.userId };
  }

  /* ---------- REFRESH TOKEN ---------- */
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  refresh(@Req() req: any) {
    // req.user.userId viene impostato dalla RefreshTokenStrategy
    return this.auth.login(req.user.userId); // nuovi access + refresh
}
}