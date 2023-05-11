import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './../user/user.module';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import JwtStrategy from './jwt.strategy';

@Module({
imports: [UserModule, PassportModule, ConfigModule, JwtModule.registerAsync({
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
  providers: [AuthService, LocalStrategy, JwtStrategy]
})
export class AuthModule {}

//configService.get("JWT_EXIRATION_TIME")