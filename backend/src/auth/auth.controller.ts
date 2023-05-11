import { AuthService } from './auth.service';
import { Controller, HttpCode, Post, Body, UseGuards, Req, Res } from '@nestjs/common';
import { LocalAuthenticationGuard } from './localAuth.guard';
import RequestWithUser from './interface/requestWithUser.i';
import { JwtAuthGuard } from './jwtAuth.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
	constructor (private authService: AuthService) {}


	@Post('register')
	async register(@Body('username') username : string, @Body("password") password: string) {
		return this.authService.register({username, password})
	}


	@HttpCode(200)
	@Post('login')
	@UseGuards(LocalAuthenticationGuard)
	async login(@Req() request: RequestWithUser) {
		const { user } = request; 
		const cookie = this.authService.getCookieWithJwtToken(user);
		request.res.setHeader('Set-Cookie',  cookie);
		return request.res.send(user);
	}


	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	@Post('logout')
	async logOut(@Req() _request: RequestWithUser, @Res() response: Response) {
		response.setHeader('Set-Cookie', this.authService.getCookieForLogout());
		response.send();
	}
}
