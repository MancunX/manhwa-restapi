import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Post,
  Req,
  Request as NestReq,
  Res,
  UnauthorizedException,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthChangePasswordRequest,
  AuthProfileResponse,
  SignInRequest,
  SignInResponse,
} from 'src/model/auth.model';
import { WebResponse } from 'src/model/web.model';
import { Public } from 'src/auth/decorator/public.decorator';
import { Response, Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from './decorator/role.decorator';

@Controller('api/auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('profile')
  @HttpCode(200)
  async profile(
    @NestReq() req: Request,
  ): Promise<WebResponse<AuthProfileResponse>> {
    const token = req.cookies['access_token'];
    if (!token) {
      throw new HttpException(
        'Access token is missing',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const profile = await this.authService.profile(token);
    return {
      data: profile,
    };
  }

  @Roles('super', 'admin')
  @Patch('profile/change-password')
  @HttpCode(201)
  async changePassword(
    @Req() req: Request,
    @Body() changePassword: AuthChangePasswordRequest,
  ): Promise<any> {
    const accessToken = req.cookies['access_token'];
    if (!accessToken) {
      throw new HttpException(
        'Access token is missing',
        HttpStatus.UNAUTHORIZED,
      );
    }
    await this.authService.changePassword(accessToken, changePassword);
    return {
      message: 'Password changed successfully',
    };
  }

  @Public()
  @Post('signIn')
  @HttpCode(200)
  async signIn(
    @Body() request: SignInRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<WebResponse<SignInResponse>> {
    const { accessToken } = await this.authService.signIn(request);
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      maxAge: 60 * 1000,
    });
    return {
      message: 'Login success',
    };
  }

  @Roles('super', 'admin')
  @Post('signOut')
  @HttpCode(200)
  async signOut(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
    @Body('refreshToken') refreshToken: string,
  ): Promise<any> {
    await this.authService.signOut(refreshToken);
    const accessToken = req.cookies['access_token'];
    if (!accessToken) {
      throw new UnauthorizedException();
    }
    res.clearCookie('access_token');
    return {
      message: 'Logout success',
    };
  }

  @Roles('super', 'admin')
  @Post('refresh-token')
  @HttpCode(201)
  async refreshToken(
    @Body('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    try {
      const newAccessToken = await this.authService.refreshToken(refreshToken);
      res.cookie('access_token', newAccessToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'none',
        maxAge: 30 * 60 * 1000,
      });
      return {
        message: 'New access token created',
      };
    } catch (err: any) {
      return { error: err.message };
    }
  }
}
