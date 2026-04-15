import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDto } from './dto';
import { Request, Response } from 'express';
import { SuccessResponse } from 'src/common/dto/response.dto';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(body);

    // 🔐 Set cookies
    res.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: false, // 👉 true in production
      sameSite: 'lax',
    });

    res.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });

    return new SuccessResponse('Login successful', result.user);
  }

  @Post('register')
  async register(
    @Body() body: SignupDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.register(body);

    // 🔐 Set cookies ONLY if session exists
    if (result.accessToken) {
      res.cookie('access_token', result.accessToken, {
        httpOnly: true,
        secure: false, // 👉 true in production (HTTPS)
        sameSite: 'lax',
      });

      res.cookie('refresh_token', result.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      });
    }

    return new SuccessResponse('User registered successfully', result.user);
  }

  // auth.controller.ts

  @Get('me')
  async me(@Req() req: Request) {
    const token = req.cookies?.access_token;

    if (!token) {
      throw new HttpException(
        {
          message: 'Unauthorized',
          code: 'UNAUTHORIZED',
        },
        401,
      );
    }

    const result = await this.authService.me(token);

    return new SuccessResponse('User fetched successfully', result);
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    const result = this.authService.refresh(refreshToken);

    // 🔐 overwrite old cookies with new tokens
  res.cookie('access_token', (await result).accessToken, {
    httpOnly: true,
    secure: false, // true in production
    sameSite: 'lax',
  });

  res.cookie('refresh_token', (await result).refreshToken, {
    httpOnly: true,
    secure: false, // true in production
    sameSite: 'lax',
  });

  return new SuccessResponse('Session refreshed successfully', (await result).user);
  }
}
