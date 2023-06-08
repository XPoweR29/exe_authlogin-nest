import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    disableErrorMessages: false,
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }))

  app.use(cookieParser());

  await app.listen(3001);
}
bootstrap();
