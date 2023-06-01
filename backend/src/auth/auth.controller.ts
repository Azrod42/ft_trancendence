import { AuthService } from './auth.service';
import { Controller, HttpCode, Post, Body, UseGuards, Req, Res, Get } from '@nestjs/common';
import { LocalAuthenticationGuard } from './localAuth.guard';
import RequestWithUser from './interface/requestWithUser.i';
import { Response } from 'express';
import JwtAuthGuard from './jwtAuth.guard';
import CreateUserDto from 'src/user/user.create.dto';
import {Auth42Service} from "./42auth/42auth.service";
import {UserService} from "../user/user.service";

@Controller('auth')
export class AuthController {
	constructor (private authService: AuthService,
				 private auth42Service: Auth42Service,
				 private userService: UserService,
	) {}


	@Post('register')
	async register(@Body() registrationData: CreateUserDto) {
		return this.authService.register(registrationData)
	}

	@HttpCode(200)
	@Post('login')
	@UseGuards(LocalAuthenticationGuard)
	async login(@Req() request: RequestWithUser, @Res() response: Response) {
		const { user } = request;
		const cookie = this.authService.getCookieWithJwtToken(user);
		request.res.setHeader('Set-Cookie',  cookie);
		return response.send(user);
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
			const cookie = this.authService.getCookieWithJwtToken(user);
			response.setHeader('Set-Cookie',  cookie);
			await this.authService.redirectUserAuth(response)
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
			await this.userService.updateAvatar(user.id, linkImg as string);
			const cookie = this.authService.getCookieWithJwtToken(user);
			await response.setHeader('Set-Cookie',  cookie);
			await this.authService.redirectUserAuth(response)
		}
	}
}
