import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  RefreshTokenResponse,
  SignInRequest,
  SignInResponse,
} from 'src/model/auth.model';
import { WebResponse } from 'src/model/web.model';
import { Public } from 'src/auth/decorator/public.decorator';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Controller('api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  @Public()
  @Post('signIn')
  @HttpCode(200)
  async signIn(
    @Body() request: SignInRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<WebResponse<SignInResponse>> {
    const { accessToken, refreshToken } =
      await this.authService.signIn(request);
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      maxAge: 60 * 1000,
    });
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return {
      message: 'Login success',
    };
  }

  @Post('signOut')
  @HttpCode(200)
  async signOut(
    @Res({ passthrough: true }) res: Response,
  ): Promise<WebResponse<SignInResponse>> {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return {
      message: 'Logout success',
    };
  }

  @Public()
  @Get('token')
  @HttpCode(201)
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<WebResponse<RefreshTokenResponse>> {
    const refreshToken = req.cookies['refresh_token'];

    if (!refreshToken) {
      throw new HttpException('Refresh token is required', 400);
    }
    try {
      const newToken = await this.authService.refreshToken(refreshToken);

      res.cookie('access_token', newToken, {
        httpOnly: true,
        secure: false, // Pertimbangkan untuk mengatur ini menjadi true jika Anda menggunakan HTTPS
        sameSite: 'none',
        maxAge: 60 * 60 * 1000, // Consider increasing this value
      });
      return {
        message: 'New access token created',
      };
    } catch (error) {
      console.error('Error during token refresh:', error);
      throw error;
    }
  }
}
