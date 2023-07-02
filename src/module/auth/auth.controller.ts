import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Res,
  Req,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Response } from 'express';
import { JwtRefreshGuard } from 'src/utils/guard/jwt-refresh.guard';

import { AuthService } from './auth.service';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
import { ResponseDto } from './dto/login-response.dto';

@Controller({
  path: 'Auth',
  version: '1',
})
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  async register(@Body() registerDto: AuthRegisterLoginDto): Promise<any> {
    return await this.authService.register(registerDto);
  }

  @Post('login')
  async login(
    @Body() loginDto: AuthEmailLoginDto,
    @Res() res,
  ): Promise<ResponseDto> {
    const userData = await this.authService.validateLogin(loginDto);
    res.cookie('RefreshToken', userData.refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.send({
      user: userData.data,
      accessToken: userData.accessToken,
    });
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refresh(@Req() req, @Res() res) {
    const user = req.user;
    const token = await this.authService.validateRefreshToken(
      user.sub,
      req.cookies['RefreshToken'],
    );
    // res.cookie('RefreshToken', token.accessToken, {
    //   httpOnly: true,
    //   maxAge: 24 * 60 * 60 * 1000,
    // });
    return res.send({ accessToken: token.accessToken });
  }

  @ApiBearerAuth()
  @UseGuards(JwtRefreshGuard)
  @Post('logout')
  async logout(@Req() req, @Res() res: Response): Promise<any> {
    const user = req.user;
    await this.authService.removeRefreshToken(user.sub);
    res.clearCookie('RefreshToken', {
      httpOnly: true,
      maxAge: 0,
    });

    return res.status(200).send({ message: 'Logout successful' });
  }
}
