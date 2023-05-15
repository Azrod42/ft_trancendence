import JwtAuthGuard from 'src/auth/jwtAuth.guard';
import { UserService } from './user.service';
import { Body, Controller, Get, HttpCode, Param, Post, Req, UseGuards } from '@nestjs/common';
import ChangeDisplayNameDto from './dtos/user.changedisplay.dto';
import RequestWithUser from 'src/auth/interface/requestWithUser.i';
@Controller('user')
export class UserController {

	constructor(private readonly userService: UserService) {}

	// @Get(":id")
	// async findUser(@Param('id') id: string) {
	// 	return await this.userService.findById(id);
	// }

	@HttpCode(200)
	@Post('displayname')
	async changeDisplayName(@Req() request: RequestWithUser, @Body() newData: ChangeDisplayNameDto) {
		return this.userService.updateDisplayName(request.user.id, newData)
	}
}
