import { NestFactory } from '@nestjs/core';
import { ValidationPipe, BadRequestException } from '@nestjs/common';

import { AppModule } from './app.module';
import * as cookieParser from "cookie-parser";
import * as bodyParser from 'body-parser';
import * as process from "process";
import * as sockjs from 'sockjs';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useWebSocketAdapter(new sockjs.Server({}));
  app.useGlobalPipes(new ValidationPipe({
	exceptionFactory: (errors) => new BadRequestException(errors),
  }));
  app.enableCors({credentials:true, origin: 'http://localhost:3000',})
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
  app.use(cookieParser());

  await app.listen(process.env.BACK_PORT);
}
bootstrap();
