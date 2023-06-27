import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from './module/auth/auth.module';
import { CategoryModule } from './module/category/category.module';
import appConfig from './configs/app.config';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: ['.env'],
    }),
    AuthModule,
    CategoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
