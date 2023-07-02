import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: configService.get('auth.secret'),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          //console.log(request?.cookies?.['RefreshToken']);
          // eslint-disable-next-line prettier/prettier
          return request?.cookies?.['RefreshToken'];
        },
      ]),
    });
  }

  async validate(request: Request, payload: any) {
    if (!payload) {
      throw new BadRequestException('invalid jwt token');
    }
    const data = request?.cookies['RefreshToken'];
    if (!data) {
      throw new BadRequestException('invalid refresh token');
    }

    return payload;
  }
}
