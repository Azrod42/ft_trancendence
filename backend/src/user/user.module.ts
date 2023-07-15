import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import Users from './user.entity';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import JwtStrategy from 'src/auth/interface/jwt.strategy';

@Module({
	imports: [TypeOrmModule.forFeature([Users]), PassportModule, ConfigModule, JwtModule.registerAsync({
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
	controllers: [UserController],
	providers: [UserService, JwtStrategy],
	exports: [UserService],
})
export class UserModule {}
