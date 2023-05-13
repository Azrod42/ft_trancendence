import JwtAuthGuard from 'src/auth/jwtAuth.guard';
import { UserService } from './user.service';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';

@Controller('user')
export class UserController {

	constructor(private readonly userService: UserService) {}

	// @Get(":id")
	// async findUser(@Param('id') id: string) {
	// 	return await this.userService.findById(id);
	// }

}
