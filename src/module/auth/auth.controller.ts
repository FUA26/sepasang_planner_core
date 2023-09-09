import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Res,
  Req,
  Version,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Response } from 'express';
import { JwtRefreshGuard } from 'src/utils/guard/jwt-refresh.guard';

import { AuthService } from './auth.service';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
import { ResponseDto } from './dto/login-response.dto';
import { maxAge } from 'src/const/auth';

@Controller({
  path: 'auth',
})
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Version('1')
  @Post('register')
  async register(@Body() registerDto: AuthRegisterLoginDto): Promise<any> {
    return await this.authService.register(registerDto);
  }

  @Version('1')
  @Post('login')
  async login(
    @Body() loginDto: AuthEmailLoginDto,
    @Res() res,
  ): Promise<ResponseDto> {
    console.log(loginDto);
    const userData = await this.authService.validateLogin(loginDto);
    res.cookie('RefreshToken', userData.refreshToken, {
      httpOnly: true,
      maxAge: maxAge,
    });

    return res.send({
      user: userData.data,
      accessToken: userData.accessToken,
    });
  }

  @Version('1')
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

  @Version('1')
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

  @Version('2')
  @Post('login')
  async login2(
    @Body() loginDto: AuthEmailLoginDto,
    @Res() res,
  ): Promise<ResponseDto> {
    const userData = await this.authService.validateLogin(loginDto);

    // res.cookie('RefreshToken', userData.refreshToken, {
    //   httpOnly: true,
    //   maxAge: 24 * 60 * 60 * 1000,
    // });

    return res.send({
      user: userData.data,
      credential: {
        accessToken: userData.accessToken,
        refreshToken: userData.refreshToken,
        exp: new Date().setTime(new Date().getTime() + maxAge),
      },
    });
  }
}
