import { ConfigService } from '@nestjs/config';
import {HttpException, HttpStatus, Injectable, Res} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import User from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import TokenPayload from './interface/tokenPayload.i';
import * as bcrypt from 'bcrypt';
import CreateUserDto from 'src/user/user.create.dto';
import { Response } from "express";
import postgresErrorCode from 'src/database/postgresErrorCodes';
import {HttpService} from "@nestjs/axios";
import {v4 as uuidv4} from 'uuid';
import * as fs from "fs";
import * as process from "process";
import {authenticator} from 'otplib'




@Injectable()
export class AuthService {
	constructor(private usersService: UserService,
				private jwtService: JwtService,
				private readonly configService: ConfigService,
				private readonly httpService: HttpService) {}


	async register(registerData: CreateUserDto) {

		try {
			const hashoedPassword = await bcrypt.hash(registerData.password, 12);
			const user = await this.usersService.create({
				username: registerData.username,
				displayname: registerData.username,
				email: registerData.email,
				password: hashoedPassword,
				passwordRepeat: '',
				is2FOn: false,
				secret2F: "undefine",
				avatar: "notset",
				elo: 800,
				chat: '',
				blocked: '',
				friends: '',
				msgHist: '',
				idWebSocket: '',
				gameNumber: 0,
				gameWin: 0,
				gameLose: 0,
				winLoseRate: '',
				totalPointGet: 0,
				totalPointTake: 0,
				pointGetTakeRate: '',
				winStreak: 0,
				gameHist: '',
				xp: 0,
				totalGame: 0,
				socketID: '',
				slot: 0,
				inGame: false,
			});
			user.password = undefined;
			return user;
		} catch (e) {
			if (e?.code === postgresErrorCode.UniqueViolation) {
				throw new HttpException('Username is already taken', HttpStatus.BAD_REQUEST);
			}
			console.log(e);
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
		return `Authentication=${token}; domain: '` + process.env.SITE_NAME + `'; HttpOnly; Path=/; Secure; Max-Age=99999`
	}

	public getCookieForLogout() {
		return ('Authentication=; HttpOnly; Path=/; Max-Age:0')
	}

	async redirectUserAuth(@Res() response: Response, hash: string) {
			const hash64 = Buffer.from(hash, 'binary').toString('base64');
			response.redirect(301, process.env.SITE_URL +`:3000/auth/2fa/${hash64}`);
	}

	async downloadImage(url: string) {
		const imgLink: string = `/uploads/profileimage/${uuidv4()}.png` as string;
		const writer = fs.createWriteStream(process.cwd() + imgLink);

		const response = await  this.httpService.axiosRef({
			url: url,
			method: 'GET',
			responseType: 'stream',
		});

		response.data.pipe(writer);
		return imgLink;
	}

	async generateTwoFactorAuthenticationSecret(user: User) {
		const secret = authenticator.generateSecret();

		const otpauthUrl = authenticator.keyuri(user.email, 'ft_transcendence', secret);

		await this.usersService.setTwoFactorAuthenticationSecret(secret, user.id);
		return {
			secret,
			otpauthUrl
		}
	}

	isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, user: User) {
		return authenticator.verify({
			token: twoFactorAuthenticationCode,
			secret: user.secret2F,
		});
	}

	async loginWith2fa(userWithoutPsw: Partial<User>) {
		const payload = {
			username: userWithoutPsw.username,
			isTwoFactorAuthenticationEnabled: !!userWithoutPsw.is2FOn,
			isTwoFactorAuthenticated: true,
		};
		return {
			email: payload.username,
			access_token: this.jwtService.sign(payload),
		};
	}
}
