import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from './module/auth/auth.module';
import { CategoryModule } from './module/category/category.module';
import { UserModule } from './module/user/user.module';
import appConfig from './configs/app.config';
import authConfig from './configs/auth.config';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authConfig],
      envFilePath: ['.env'],
    }),
    AuthModule,
    CategoryModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
