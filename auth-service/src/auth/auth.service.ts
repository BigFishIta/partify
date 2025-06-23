import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService
  ) {}

  /* ---------- SIGN-UP ---------- */
  async signup(dto: { email: string; password: string; name?: string }) {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email }
    });
    if (exists) throw new BadRequestException('Email already registered');

    const hash = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hash,
        name: dto.name
      }
    });

    return this.issueTokens(user.id);
  }

  /* ---------- VALIDATE USER ---------- */
  async validateUser(email: string, plain: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) return null;

    const ok = await bcrypt.compare(plain, user.password);
    return ok ? user : null;
  }

  /* ---------- LOGIN (issue tokens) ---------- */
  async login(userId: string) {
    return this.issueTokens(userId);
  }

  /* ---------- PRIVATE helper ---------- */
  private issueTokens(uid: string) {
    const access = this.jwt.sign({ sub: uid }, { expiresIn: '5m' });
    const refresh = this.jwt.sign(
      { sub: uid, typ: 'refresh' },
      { expiresIn: '30d' }
    );
    return { access, refresh };
  }
}