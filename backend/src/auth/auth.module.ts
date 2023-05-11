import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './../user/user.module';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';

@Module({
imports: [UserModule, ConfigModule, JwtModule.registerAsync({
		imports: [ConfigModule],
		inject: [ConfigService],
		useFactory: async(configService: ConfigService) => ({
			secret: configService.get('JWT_SECRET'),
			signOptions: {expiresIn: `${configService.get("JWT_EXIRATION_TIME")}s`
				},
			}),
		}),
	],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy]
})
export class AuthModule {}
