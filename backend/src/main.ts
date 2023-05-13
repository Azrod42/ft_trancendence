import { NestFactory } from '@nestjs/core';
import { ValidationPipe, BadRequestException } from '@nestjs/common';

import { AppModule } from './app.module';
import * as cookieParser from "cookie-parser";
import { error } from 'console';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
	exceptionFactory: (errors) => new BadRequestException(errors),
  }));
  app.enableCors({credentials:true, origin: 'http://localhost:3000',});
  app.use(cookieParser());
  await app.listen(4000);
}
bootstrap();
