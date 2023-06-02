import { AuthService } from './auth.service';
import {
	Controller,
	HttpCode,
	Post,
	Body,
	UseGuards,
	Req,
	Res,
	Get,
	HttpException,
	HttpStatus,
	Query, Param
} from '@nestjs/common';
import { LocalAuthenticationGuard } from './localAuth.guard';
import RequestWithUser from './interface/requestWithUser.i';
import { Response } from 'express';
import JwtAuthGuard from './jwtAuth.guard';
import CreateUserDto from 'src/user/user.create.dto';
import {Auth42Service} from "./42auth/42auth.service";
import {UserService} from "../user/user.service";
import * as bcrypt from 'bcrypt';
import { Request } from 'express';



@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService,
				private auth42Service: Auth42Service,
				private userService: UserService,
	) {
	}


	@Post('register')
	async register(@Body() registrationData: CreateUserDto) {
		return this.authService.register(registrationData)
	}

	@HttpCode(200)
	@Post('login')
	@UseGuards(LocalAuthenticationGuard)
	async login(@Req() request: RequestWithUser, @Res() response: Response) {
		const {user} = request;
		const hash = await bcrypt.hash(user.id, 10);
		const rep = {...user, hash: Buffer.from(hash, 'binary').toString('base64')};
		return response.send(rep);
	}

	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	@Get('logout')
	async logOut(@Req() _request: RequestWithUser, @Res() response: Response) {
		response.setHeader('Set-Cookie', this.authService.getCookieForLogout());
		response.send();
	}

	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	@Get("logcheck")
	async logcheck(@Req() request: RequestWithUser, @Res() response: Response) {
		return response.send(request.user);
	}

	@Get("callback")
	async handleToken(@Req() request: Request, @Res() response: Response) {
		const code: string = request['query'].code as string;
		const token = await this.auth42Service.accessToken(code);
		const userInformation = await this.auth42Service.getUserInformation(token['access_token']);
		try {
			const user = await this.userService.findByUsername(userInformation['login']);
			const hash = await bcrypt.hash(user.id, 10);
			await this.authService.redirectUserAuth(response, hash);
		} catch (e) {
			const linkImg = await this.authService.downloadImage(userInformation['image']['link'] as string);
			const newUser: CreateUserDto = {
				username: userInformation['login'],
				password: process.env.PW_42AUTH,
				passwordRepeat: process.env.PW_42AUTH,
				email: userInformation['email'],
				avatar: linkImg as string,
				is2FOn: false,
				secret2F: 'notset',
				displayname: userInformation['login'],
				elo: 800
			}
			await this.authService.register(newUser);
			const user = await this.userService.findByUsername(userInformation['login']);
			const hash = await bcrypt.hash(user.id, 10);
			await this.userService.updateAvatar(user.id, linkImg as string);
			await this.authService.redirectUserAuth(response, hash)
		}
	}

	@Post('2fa/turn-on')
	@UseGuards(JwtAuthGuard)
	async turnOnTwoFactorAuthentication(@Req() request, @Body() body) {
		const userUp = await this.userService.findById(request.user.id);
		const isCodeValid =
			this.authService.isTwoFactorAuthenticationCodeValid(
				body.twoFactorAuthenticationCode as string,
				userUp,
			);
		if (!isCodeValid) {
			throw new HttpException('Wrong authentication code', HttpStatus.UNAUTHORIZED,);
		}
		await this.userService.turnOnTwoFactorAuthentication(request.user.id);
	}

	@Post('2fa/authenticate')
	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	async authenticate(@Req() request, @Body() body) {
		const userUp = await this.userService.findById(request.user.id);
		const isCodeValid = this.authService.isTwoFactorAuthenticationCodeValid(
			body.twoFactorAuthenticationCode,
			userUp,
		);

		if (!isCodeValid) {
			throw new HttpException('Wrong authentication code', HttpStatus.UNAUTHORIZED,);
		}

		return this.authService.loginWith2fa(request.user);
	}

	@Get('2fa/generate')
	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	async generateQrcode(@Req() request, @Res() response) {
		const url = await this.authService.generateTwoFactorAuthenticationSecret(request.user);
		const qrcode = await this.userService.generateQrCodeDataURL(url.otpauthUrl);
		return response.send(qrcode);
	}

	@Post("2fa/login")
	async handle2faToken(@Req() request: Request, @Res() response: Response, @Body() body) {
		if (!body.uniqueIdentifier)
			throw new HttpException('No hashed param', HttpStatus.UNAUTHORIZED,);
		const code = Buffer.from(body.uniqueIdentifier, 'base64').toString('binary');
		const userid = await this.userService.FindUserOnDB(code);
		const user = await this.userService.findById(userid);
		const isCodeValid = this.authService.isTwoFactorAuthenticationCodeValid(
			body.twoFactorAuthenticationCode,
			user,
		);
		if (!isCodeValid)
			throw new HttpException('Wrong authentication code', HttpStatus.UNAUTHORIZED,);
		const cookie = this.authService.getCookieWithJwtToken(user);
		response.setHeader('Set-Cookie',  cookie);
		return response.send(true);
	}
	@Post("2fa/check-on")
	async user2fa(@Req() request: Request, @Res() response: Response, @Body() body) {
		if (!body.hash)
			throw new HttpException('No hashed param', HttpStatus.UNAUTHORIZED,);
		const code = Buffer.from(body.hash, 'base64').toString('binary');
		const userid = await this.userService.FindUserOnDB(code);
		const user = await this.userService.findById(userid);
		if (user.is2FOn)
			return response.send(true);
		const cookie = this.authService.getCookieWithJwtToken(user);
		response.setHeader('Set-Cookie',  cookie);
		return response.send(false);
	}
	@Get("2fa/disable")
	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	async disable2fa(@Req() request, @Res() response) {
		const user = await this.userService.findById(request.user.id);
		if (!await this.userService.turnOffTwoFactorAuthentication(user.id))
			return response.send(false);
		return response.send(true);
	}
}