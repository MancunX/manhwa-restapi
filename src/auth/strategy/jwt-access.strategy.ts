import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from '../constants';
import { Request } from 'express';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtAccessStrategy.extractJWTFromCookie,
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.accessSecret,
    });
  }

  private static extractJWTFromCookie(req: Request): string | null {
    if (req.cookies?.access_token) {
      return req.cookies.access_token;
    }
    return null;
  }

  async validate(payload: any) {
    return { id: payload.id, role: payload.role };
  }
}
