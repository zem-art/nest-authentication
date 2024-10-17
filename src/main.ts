import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get an instance of ConfigService
  const configService = app.get(ConfigService);
  const host = configService.get<string>('app.host', '127.0.0.1'); // Get host from env or default to '127.0.0.1'
  const port = configService.get<number>('app.port', 3000);
  const appPrefix = configService.get<string>('app.prefix', '/api/v1');

  // setPrefix url
  app.setGlobalPrefix(appPrefix)

  // setValidator Global
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port, host);
}
bootstrap();
