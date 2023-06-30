import { Module } from '@nestjs/common';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import Channel from "./channel.entity";
import {PassportModule} from "@nestjs/passport";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {JwtModule} from "@nestjs/jwt";
import JwtStrategy from "../auth/interface/jwt.strategy";
import {UserModule} from "../user/user.module";
import {HttpModule} from "@nestjs/axios";

@Module({
  imports: [HttpModule, UserModule, TypeOrmModule.forFeature([Channel]), PassportModule, ConfigModule, JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async(configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get("JWT_EXIRATION_TIME")}s`,
        },
      }),
    }),
  ],
  controllers: [ChannelController],
  providers: [ChannelService, JwtStrategy],
})
export class ChannelModule {}
