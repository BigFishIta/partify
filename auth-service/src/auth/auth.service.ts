import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { addMinutes } from 'date-fns';

import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { sha256 } from '../utils/crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private mail: MailService,
  ) {}

  /* ---------- SIGN-UP ---------- */
  async signup(dto: { email: string; password: string; name?: string }) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) throw new BadRequestException('Email already registered');

    const pwdHash = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: pwdHash,
        name: dto.name,
        emailVerified: false,
      },
    });

    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = sha256(rawToken);
    const expires = addMinutes(new Date(), 60);

    await this.prisma.emailVerification.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: expires,
      },
    });

    const link = `${process.env.FRONTEND_URL}/verify-email?token=${rawToken}&id=${user.id}`;
    await this.mail.sendVerification(user.email, link);

    return { message: 'Check your mailbox to verify the account' };
  }

  /* ---------- VALIDATE USER (login) ---------- */
  async validateUser(email: string, plain: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      
      
    });

    if (!user || !user.password) return null;

    if (!user.emailVerified)
      throw new UnauthorizedException('E-mail not verified');

    const ok = await bcrypt.compare(plain, user.password);
    return ok ? user : null;
  }

  /* ---------- LOGIN ---------- */
  async login(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: { role: true },
        },
      },
    });

    if (!user) throw new UnauthorizedException();

    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles.map((r) => r.role.name),
    };

    const accessToken = await this.jwt.signAsync(payload, {
      expiresIn: '5m',
    });

    const refreshToken = await this.jwt.signAsync(
      { ...payload, typ: 'refresh' },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '30d',
      },
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        roles: payload.roles,
      },
    };
  }

  /* ---------- ISSUE TOKENS HELPER ---------- */
  private issueTokens(uid: string) {
    const access = this.jwt.sign({ sub: uid }, { expiresIn: '5m' });
    const refresh = this.jwt.sign(
      { sub: uid, typ: 'refresh' },
      { expiresIn: '30d' },
    );
    return { access, refresh };
  }
}
