import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../jwt.constants';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConstants.secret,
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  validate(req: any, payload: { sub: string; typ?: string }) {
    if (payload.typ !== 'refresh') throw new UnauthorizedException();
    // il token è refresh: salvo l’id utente
    req.user = { userId: payload.sub };
    return payload;
  }
}