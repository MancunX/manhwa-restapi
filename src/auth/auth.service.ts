import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  AuthChangePasswordRequest,
  AuthProfileResponse,
  SignInRequest,
} from 'src/model/auth.model';
import { ValidationService } from 'src/validation/validation.service';
import { AuthValidation } from './auth.validation';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Users } from '@prisma/client';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  private readonly ACCESS_TOKEN_EXPIRATION = '30m';
  private readonly REFRESH_TOKEN_EXPIRATION = '7d';

  constructor(
    private validationService: ValidationService,
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async profile(accessToken: string): Promise<AuthProfileResponse> {
    try {
      const decoded = this.jwtService.verify(accessToken, {
        secret: jwtConstants.ACCESS_SECRET_KEY,
      });
      const userId = decoded.id;
      const user = await this.prisma.users.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isOnline: true,
        },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (err: any) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async changePassword(
    accessToken: string,
    changePassword: AuthChangePasswordRequest,
  ): Promise<any> {
    const changePasswordRequest: AuthChangePasswordRequest =
      await this.validationService.validate(
        AuthValidation.CHANGEPASSWORD,
        changePassword,
      );
    const decoded = this.jwtService.verify(accessToken, {
      secret: jwtConstants.ACCESS_SECRET_KEY,
    });
    const userId = decoded.id;
    const user = await this.prisma.users.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    try {
      const isPasswordValid = await bcrypt.compare(
        changePasswordRequest.oldPassword,
        user.password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('Old password is incorrect');
      }
      if (
        changePasswordRequest.newPassword !==
        changePasswordRequest.confirmNewPassword
      ) {
        throw new BadRequestException(
          'New password and confirmation new password do not match',
        );
      }
      const hashedNewPassword = await bcrypt.hash(
        changePasswordRequest.newPassword,
        12,
      );
      await this.prisma.users.update({
        where: {
          id: userId,
        },
        data: {
          password: hashedNewPassword,
        },
      });
    } catch (err: any) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: err.message,
          error: 'Bad Request',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async signIn(signIn: SignInRequest): Promise<any> {
    const signInRequest: SignInRequest = this.validationService.validate(
      AuthValidation.SIGNIN,
      signIn,
    );
    try {
      let user: Users;
      if (signInRequest.username.includes('@')) {
        user = await this.prisma.users.findFirst({
          where: {
            email: signInRequest.username,
          },
        });
      } else {
        user = await this.prisma.users.findFirst({
          where: {
            username: signInRequest.username,
          },
        });
      }

      if (!user) {
        if (signInRequest.username.includes('@')) {
          throw new NotFoundException(
            `Email ${signInRequest.username} not found.`,
          );
        } else {
          throw new NotFoundException(
            `Username ${signInRequest.username} not found.`,
          );
        }
      }
      const isPasswordValid = await bcrypt.compare(
        signInRequest.password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Password is invalid');
      }
      const accessPayload = {
        id: user.id,
        role: user.role,
      };
      const refreshPayload = {
        id: user.id,
      };
      const accessToken = this.jwtService.sign(accessPayload, {
        expiresIn: '1m',
        secret: jwtConstants.ACCESS_SECRET_KEY,
      });
      const refreshToken = this.jwtService.sign(refreshPayload, {
        expiresIn: this.REFRESH_TOKEN_EXPIRATION,
        secret: jwtConstants.REFRESH_SECRET_KEY,
      });
      await this.prisma.users.update({
        where: {
          id: user.id,
        },
        data: {
          isOnline: true,
          refreshToken: refreshToken,
        },
      });
      return { accessToken, refreshToken };
    } catch (err: any) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: err.message,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async refreshToken(refreshToken: string): Promise<string> {
    try {
      const refreshTokenData = await this.findRefreshToken(refreshToken);
      const decoded = this.decodeRefreshToken(refreshTokenData.refreshToken);
      this.checkTokenExpiration(decoded.exp);
      const payload = { id: refreshTokenData.id, role: refreshTokenData.role };
      const newAccessToken = this.jwtService.sign(payload, {
        secret: jwtConstants.ACCESS_SECRET_KEY,
        expiresIn: this.ACCESS_TOKEN_EXPIRATION,
      });
      return newAccessToken;
    } catch (error) {
      throw new UnauthorizedException(
        'Refresh token invalid or expired, please sign in again',
      );
    }
  }

  decodeRefreshToken(refreshToken: string): any {
    try {
      return this.jwtService.verify(refreshToken, {
        secret: jwtConstants.REFRESH_SECRET_KEY,
      });
    } catch (error) {
      throw new UnauthorizedException(
        'Refresh token invalid or expired, please sign in again',
      );
    }
  }

  async findRefreshToken(refreshToken: string): Promise<any> {
    const refreshTokenData = await this.prisma.users.findFirst({
      where: {
        refreshToken: refreshToken,
      },
    });
    if (!refreshTokenData) {
      throw new NotFoundException('Refresh token not found');
    }
    return refreshTokenData;
  }

  checkTokenExpiration(expirationTime: number): void {
    const expirationDate = new Date(expirationTime * 1000);
    const currentTime = new Date();
    if (expirationDate < currentTime) {
      throw new UnauthorizedException(
        'Refresh token expired, please sign in again',
      );
    }
  }

  async signOut(refreshToken: string): Promise<any> {
    try {
      const refreshTokenData = await this.findRefreshToken(refreshToken);

      await this.prisma.users.update({
        where: {
          id: refreshTokenData.id,
        },
        data: {
          isOnline: false,
          refreshToken: null,
        },
      });

      return { message: 'User successfully logged out' };
    } catch (err: any) {
      throw new Error('Failed to logout user: ' + err.message);
    }
  }
}
