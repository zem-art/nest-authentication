import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appPrefix = '/api/v1'

  app.setGlobalPrefix(appPrefix)

  await app.listen(3000);
}
bootstrap();
