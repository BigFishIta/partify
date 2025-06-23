import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService }  from '@nestjs/jwt';
import * as bcrypt     from 'bcrypt';
import { randomBytes } from 'crypto';
import { addMinutes }  from 'date-fns';

import { PrismaService } from '../prisma/prisma.service';
import { MailService }   from '../mail/mail.service';
import { sha256 }        from '../utils/crypto';       // ⬅️ nuovo import

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private mail: MailService,
  ) {}

  /* ---------- SIGN-UP ---------- */
  async signup(dto: { email: string; password: string; name?: string }) {
    /* 1️⃣ e-mail già presente? */
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (exists) throw new BadRequestException('Email already registered');

    /* 2️⃣ hash pwd e creazione utente */
    const pwdHash = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: pwdHash,
        name: dto.name,
        emailVerified: false,
      },
    });

    /* 3️⃣ token di verifica: raw + hash SHA-256 */
    const rawToken  = randomBytes(32).toString('hex');
    const tokenHash = sha256(rawToken);
    const expires   = addMinutes(new Date(), 60);      // valido 60 min

    await this.prisma.emailVerification.create({
      data: {
        userId:    user.id,
        tokenHash: tokenHash,
        expiresAt: expires,
      },
    });

    /* 4️⃣ invio mail con link di conferma */
    const link = `${process.env.FRONTEND_URL}/verify-email?token=${rawToken}&id=${user.id}`;
    await this.mail.sendVerification(user.email, link);

    /* 5️⃣ risposta (niente JWT finché non verifica) */
    return { message: 'Check your mailbox to verify the account' };
  }

  /* ---------- VALIDATE USER (login) ---------- */
  async validateUser(email: string, plain: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) return null;

    if (!user.emailVerified)
      throw new UnauthorizedException('E-mail not verified');

    const ok = await bcrypt.compare(plain, user.password);
    return ok ? user : null;
  }

  /* ---------- LOGIN ---------- */
  async login(userId: string) {
    return this.issueTokens(userId);
  }

  /* ---------- PRIVATE helper ---------- */
  private issueTokens(uid: string) {
    const access = this.jwt.sign({ sub: uid }, { expiresIn: '5m' });
    const refresh = this.jwt.sign(
      { sub: uid, typ: 'refresh' },
      { expiresIn: '30d' },
    );
    return { access, refresh };
  }
}

