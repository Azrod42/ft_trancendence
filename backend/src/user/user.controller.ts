import JwtAuthGuard from 'src/auth/jwtAuth.guard';
import { UserService } from './user.service';
import {Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards} from '@nestjs/common';
import {ChangeDisplayName, ChangeDisplayNameDto} from './dtos/user.changedisplay.dto';
import RequestWithUser from 'src/auth/interface/requestWithUser.i';
import {Response} from "express";
import {validate} from "class-validator";

@Controller('users')
export class UserController {

	constructor(private readonly userService: UserService) {}

	// @Get(":id")
	// async findUser(@Param('id') id: string) {
	// 	return await this.userService.findById(id);
	// }

	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	@Get('getuserdata')
	async getuserdata(@Req() request: RequestWithUser, @Res() response: Response) {
		const userData = await this.userService.findById(request.user.id)
		return response.send(userData);
	}

	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	@Post('displayname')
	async changeDisplayName(@Req() request: RequestWithUser, @Body() newData: ChangeDisplayName) {
		let ret = {};
		let data: ChangeDisplayNameDto = new ChangeDisplayNameDto;
		data.displayname = newData.displayname;
		 await validate(data).then(errors => {
			console.log(errors)
			if (errors.length > 0) {
				console.log(errors)
				ret = errors;
			} else {
				ret = data;
				this.userService.updateDisplayName(request?.user.id, newData);
			}
		})
		return ret;
	}
}
