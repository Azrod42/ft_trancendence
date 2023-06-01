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
import {ChangeDisplayName, ChangeDisplayNameDto, UserId} from './dtos/user.changedisplay.dto';
import RequestWithUser from 'src/auth/interface/requestWithUser.i';
import { Response} from "express";
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

	// @Get("hello")
	// async findUser() {
	// 	return "hello world";
	// }

	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	@Get('getuserdata')
	async getuserdata(@Req() request: RequestWithUser, @Res() response: Response) {
		const userData = await this.userService.findById(request.user.id)
		return response.send(userData);
	}

	@HttpCode(200)
	// @UseGuards(JwtAuthGuard)
	@Post('displayname')
	async changeDisplayName(@Req() request: RequestWithUser, @Body() newData: ChangeDisplayName) {
		let ret = {};
		const data: ChangeDisplayNameDto = new ChangeDisplayNameDto;
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
		//remove image if user already have one
		const userProfile = await this.userService.findById(request.user.id)
		fs.unlink(process.cwd() + '\\' + userProfile.avatar, (err) => {
			if (err) {
				console.log(err);
			}
		})
		//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
		return this.userService.updateAvatar(request.user.id, file.path);
	}
	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	@Get('profile-picture')
	async findProfileImage(@Req() request: RequestWithUser, @Res() res) {
		if (!request.user)
			throw new HttpException('Somthing went wrong', HttpStatus.INTERNAL_SERVER_ERROR,);
		const id: string = await this.userService.getAvatarID(request.user.id)
		//transform img to base64 (see frontend profile page use)
		let bitmaps;
		try {
			 bitmaps = fs.readFileSync(process.cwd() + '/' + id);
		}catch (e) {
			 bitmaps = fs.readFileSync(process.cwd() + '/uploads/default-avatar.jpeg');
		}
		//-=-=-=-=-=-=-=-=-=-=-=-=
		return res.send(((bitmaps).toString('base64')));
	}

	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	@Post('post-profile-picture')
	async postProfilePicture(@Req() request: RequestWithUser, @Res() res, @Body() userId: UserId) {
		const id: string = await this.userService.getAvatarID(userId?.id);
		//transform img to base64 (see frontend profile page use)
		let bitmaps;
		try {
			bitmaps = fs.readFileSync(process.cwd() + '/' + id);
		}catch (e) {
			bitmaps = fs.readFileSync(process.cwd() + '/uploads/default-avatar.jpeg');
		}
		//-=-=-=-=-=-=-=-=-=-=-=-=
		return res.send(((bitmaps).toString('base64')));
	}

	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	@Get('get-all-user')
	async getAllUser(@Req() request: RequestWithUser, @Res() res) {
		return res.send(await this.userService.GetAllUserFromDB());
	}

	@HttpCode(200)
	@Post('post-public-userdata')
	// @UseGuards(JwtAuthGuard)
	async getPublicUserData(@Req() request: RequestWithUser, @Res() res) {
		return res.send(await this.userService.GetAllUserFromDB());
	}
}