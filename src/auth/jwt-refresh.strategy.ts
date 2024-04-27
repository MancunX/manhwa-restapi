import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
import { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtRefreshStrategy.extractJWTFromCookie,
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.refreshSecret,
      // passReqToCallback: true,
    });
  }

  private static extractJWTFromCookie(req: Request): string | null {
    if (req.cookies?.refresh_token) {
      return req.cookies.refresh_token;
    }
    return null;
  }

  async validate(payload: any) {
    return { sub: payload.sub };
  }
}
