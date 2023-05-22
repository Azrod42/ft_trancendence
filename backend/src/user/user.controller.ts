import JwtAuthGuard from 'src/auth/jwtAuth.guard';
import { UserService } from './user.service';
import {
	Body,
	Controller,
	Get,
	HttpCode, HttpException, HttpStatus, Param,
	Post,
	Req,
	Res,
	UploadedFile,
	UseGuards,
	UseInterceptors
} from '@nestjs/common';
import {ChangeDisplayName, ChangeDisplayNameDto} from './dtos/user.changedisplay.dto';
import RequestWithUser from 'src/auth/interface/requestWithUser.i';
import {response, Response} from "express";
import {validate} from "class-validator";
import {FileInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import {v4 as uuidv4} from 'uuid';
import * as path from "path";
import * as process from "process";
import * as fs from 'fs'
import User from "./user.entity";

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

	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	@Post('upload')
	@UseInterceptors(FileInterceptor('file', {
		storage: diskStorage({
			destination: './uploads/profileimage',
			filename(req, file: Express.Multer.File, callback: (error: (Error | null), filename: string) => void) {
				const filename: string = uuidv4();
				const extension: string = path.parse(file.originalname).ext;
				callback(null, `${filename}${extension}`)
			}
		})
	}))
	async uploadFile(@Req() request: RequestWithUser, @UploadedFile() file) {
		if (!request.user || !file)
			return;
		//TODO
		// try {
		// 	const userProfile = await this.userService.findById(request.user.id)
		// 	fs.unlinkSync('/uploads/profileimage/' + userProfile.avatar)
		// } catch (e) {
		// 	console.error(e);
		// }
		const user: Promise<User> = this.userService.updateAvatar(request.user.id, file.path);
		return user;
	}
	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	@Get('profile-picture')
	async findProfileImage(@Req() request: RequestWithUser, @Res() res) {
		if (!request.user)
			throw new HttpException('Somthing went fucking wrong', HttpStatus.INTERNAL_SERVER_ERROR,);
		const id: string = await this.userService.getAvatarID(request.user.id)
		var bitmaps;
		try {
			 bitmaps = fs.readFileSync(process.cwd() + '/' + id);
		}catch (e) {
			 bitmaps = fs.readFileSync(process.cwd() + '/uploads/default-avatar.jpeg');
		}
		return res.send(((bitmaps).toString('base64')));
	}
}