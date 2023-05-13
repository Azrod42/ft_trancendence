import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import User from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import TokenPayload from './interface/tokenPayload.i';
import * as bcrypt from 'bcrypt';
import CreateUserDto from 'src/user/user.create.dto';
import postgresErrorCode from 'src/database/postgresErrorCodes';



@Injectable()
export class AuthService {
	constructor(private usersService: UserService, private jwtService: JwtService, 	private readonly configService: ConfigService) {}


	async register(registerData: CreateUserDto) {

		try {
			const hashoedPassword = await bcrypt.hash(registerData.password, 12);
			const user = await this.usersService.create({
				username: registerData.username,
				email: registerData.email,
				password: hashoedPassword,
				passwordRepeat: "",
				is2FOn: false,
				secret2F: "undefine",
				avatar: "undefine",
			});
			user.password = undefined;
			return user;
		} catch (e) {
			if (e?.code === postgresErrorCode.UniqueViolation) {
				throw new HttpException('Username is already taken', HttpStatus.BAD_REQUEST);
			}
			throw new HttpException('Somthing went fucking wrong', HttpStatus.INTERNAL_SERVER_ERROR,);

		}
	}

	public async getAutenticatedUser(username: string, plainTextPassword:string) {
		try {
			const user = await this.usersService.findByUsername(username);
			await this.verifyPassword(plainTextPassword, user.password);
			user.password = undefined;
			return user
		} catch (e) {

		}
	}
	private async verifyPassword(plainTextPassword: string, hashoedPassword: string) {
		const arePasswordMatching = await bcrypt.compare(plainTextPassword, hashoedPassword);
		if (!arePasswordMatching) {
			throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
		}
	}

	public getCookieWithJwtToken(user: User) {
		const payload: TokenPayload = {user};
		const token = this.jwtService.sign(payload);
		return `Authentication=${token}; domain: 'localhost'; HttpOnly; Path=/; Secure; Max-Age=3600`
	}

	public getCookieForLogout() {
		return ('Authentication=; HttpOnly; Path=/; Max-Age:0')
	}
}