import { Body, Controller, HttpException, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto';
import { Response } from 'express';
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
      secure: true, // 👉 true in production
      sameSite: 'strict',
    });

    res.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
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
        secure: true, // 👉 true in production (HTTPS)
        sameSite: 'strict',
      });

      res.cookie('refresh_token', result.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
      });
    }

    return new SuccessResponse('User registered successfully', result.user);
  }
}
