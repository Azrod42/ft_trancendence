import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ChannelModule } from './channel/channel.module';
import JwtStrategy from './auth/interface/jwt.strategy';
import {GatewayModule} from "./gateway/gateway.module";
import {SocketModule} from "./socket/socket.module";

@Module({
  imports: [DatabaseModule, ConfigModule.forRoot(), UserModule, AuthModule, GatewayModule],
  controllers: [AppController, UserController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
