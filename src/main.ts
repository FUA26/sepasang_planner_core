import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllConfigType } from './configs/config.type';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService) as ConfigService<AllConfigType>;
  await app.listen(configService.get('app.port', { infer: true }));
}
bootstrap();
