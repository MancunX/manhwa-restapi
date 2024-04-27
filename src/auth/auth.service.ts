import { HttpException, Injectable } from '@nestjs/common';
import { SignInRequest } from 'src/model/auth.model';
import { ValidationService } from 'src/validation/validation.service';
import { AuthValidation } from './auth.validation';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from './constants';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private validationService: ValidationService,
    private prisma: PrismaService,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async signIn(request: SignInRequest): Promise<any> {
    const signInRequest: SignInRequest = this.validationService.validate(
      AuthValidation.SIGNIN,
      request,
    );

    const user = await this.prisma.users.findUnique({
      where: {
        username: signInRequest.username,
      },
    });

    if (!user) {
      throw new HttpException('User is invalid', 401);
    }

    const isPasswordValid = await bcrypt.compare(
      signInRequest.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException('Password is invalid', 401);
    }
    const accessPayload = { sub: user.id, username: user.username };
    const accessToken = this.jwtService.sign(accessPayload, {
      expiresIn: '1m',
      secret: jwtConstants.accessSecret,
    });

    const refreshTokenPayload = { sub: user.id };
    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      expiresIn: '7d',
      secret: jwtConstants.refreshSecret,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string): Promise<any> {
    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: jwtConstants.refreshSecret,
      });
      const user = await this.usersService.getById(decoded.sub);
      if (!user) {
        throw new Error('User not found');
      }

      const payload = { username: user.username, sub: user.id };
      const newAccessToken = this.jwtService.sign(payload, {
        secret: jwtConstants.accessSecret,
        expiresIn: '1h',
      });
      return newAccessToken;
    } catch (e: any) {
      throw new Error('Refresh token invalid or expired, please sign in again');
    }
  }
}
