import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'prisma/prisma.service';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
import { Excluder } from 'src/helper/exluder.helper';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(
    createDto: AuthRegisterLoginDto,
  ): Promise<Omit<User, 'password' | 'hashToken'>> {
    const checkUser = await this.prisma.user.findFirst({
      where: { email: createDto.email },
    });

    if (checkUser) {
      // console.log(checkUser);
      throw new HttpException('message', HttpStatus.BAD_REQUEST, {
        cause: new Error('User already exists'),
      });
    }

    const hashedPassword = await bcrypt.hash(createDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        firstName: createDto.firstName,
        lastName: createDto.lastName,
        email: createDto.email,
        password: hashedPassword,
        hashToken: '',
        role: 'USER',
      },
    });
    const clientClean = Excluder(user, ['password', 'hashToken']);
    return clientClean;
  }

  async validateLogin(loginDto: AuthEmailLoginDto): Promise<any> {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    const payload = {
      sub: user.id,
      firdtName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    };
    const token = await this.getJwtToken(payload);
    const hashedToken = await bcrypt.hash(token.refreshToken, 10);
    const updatedUser = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        hashToken: hashedToken,
      },
    });
    return {
      data: Excluder(updatedUser, ['password', 'hashToken']),
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const getUser = await this.prisma.user.findFirst({
      where: { email },
    });
    // console.log(getUser);
    if (!getUser) {
      throw new HttpException(
        'Email dan Kata Sandi Tidak Sesuai',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isValidPassword = await bcrypt.compare(password, getUser.password);

    if (!isValidPassword) {
      throw new HttpException(
        'Email dan Kata Sandi Tidak Sesuai',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return getUser;
  }

  async validateRefreshToken(sub, token): Promise<any> {
    const user = await this.prisma.user.findFirst({
      where: { id: sub },
    });

    const isValidToken = await bcrypt.compare(token, user.hashToken);
    // console.log(isValidToken);

    if (!isValidToken) {
      throw new HttpException('message', HttpStatus.BAD_REQUEST, {
        cause: new Error('Token Expired'),
      });
    }

    const payload = {
      sub: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    };

    const tokens = await this.getJwtToken(payload);
    return {
      accessToken: tokens.accessToken,
    };
  }

  async getJwtToken(user: any) {
    const payload = {
      ...user,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.sign(payload),
      this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: this.configService.get('auth.refresh_exp'),
      }),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  async removeRefreshToken(sub) {
    return await this.prisma.user.update({
      where: { id: sub },
      data: {
        hashToken: null,
      },
    });
  }
}
