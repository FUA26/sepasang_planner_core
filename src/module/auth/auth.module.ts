import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtAuthStrategy } from './strategies/jwt-auth-token.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh-token.strategy';
import { PrismaModule } from 'prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('auth.secret'),
        signOptions: {
          expiresIn: configService.get('auth.expires'),
        },
      }),
    }),
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthStrategy, JwtRefreshStrategy],
})
export class AuthModule {}
