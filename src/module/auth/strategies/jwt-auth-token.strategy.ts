import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(
  Strategy,
  'jwt-auth-token',
) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          const bearerToken = request.headers.authorization;
          if (bearerToken && bearerToken.startsWith('Bearer ')) {
            return bearerToken.split(' ')[1];
          }
          return null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('auth.secret'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: any) {
    console.log('validate', payload);
    if (payload === null) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}
