import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from "./user.entity";
import { Repository} from 'typeorm';
import CreateUserDto from './user.create.dto';
import {ChangeDisplayNameDto} from './dtos/user.changedisplay.dto';
import { toDataURL } from 'qrcode';
import * as bcrypt from 'bcrypt';
import {response} from "express";




@Injectable()
export class UserService {

	constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

	async findById (id: string){
		const user = await this.userRepo.findOneBy({id});
		if (user) {
			user.password = undefined;
			return user;
		}
			throw new HttpException("User with this id does no exist", HttpStatus.NOT_FOUND,);
	}
	async findByUsername (username: string){
		const user = await this.userRepo.findOneBy({username});
		if (user)
			return user;
			throw new HttpException("User with this username does no exist", HttpStatus.NOT_FOUND,);
	}
	async  create(userData: CreateUserDto) {
		const newUser = await this.userRepo.create(userData);
		await this.userRepo.save(newUser);
		return newUser;
	}

	async updateDisplayName(id: string, registerData: ChangeDisplayNameDto) {
		try {
			const user = await this.findById(id);
			(await user).displayname = registerData.displayname;
			await this.userRepo.save(user);
		} catch (e) {
			throw new HttpException('Somthing went wrong', HttpStatus.INTERNAL_SERVER_ERROR,);

		}
	}

	async updateAvatar(id: string, path: string) {
		try {
			const user = await this.findById(id);
			(await user).avatar = path;
			await this.userRepo.save(user);
			return user;
		} catch (e) {
			throw new HttpException('Somthing went fucking wrong', HttpStatus.INTERNAL_SERVER_ERROR,);
		}
		return undefined;
	}

	async getAvatarID(id: string) {
		try {
			const user = await this.findById(id);
			return user.avatar;
		} catch (e) {
			throw new HttpException('Somthing went fucking wrong', HttpStatus.INTERNAL_SERVER_ERROR,);
		}
		return undefined;
	}

	async GetAllUserFromDB (){
		const user = await this.userRepo.query(`SELECT displayname, id, elo FROM public."user"`)
		if (user)
			return user;
		throw new HttpException("User with this username does no exist", HttpStatus.NOT_FOUND,);
	}

	async FindUserOnDB (hash: string): Promise<string> {
		const user = await this.userRepo.query(`SELECT id FROM public."user"`)
		if (!user)
			return undefined;
		for (let i = 0; user[i]; i++){
			if (await bcrypt.compare((user[i].id), hash))
				return user[i].id;
		}
		throw new HttpException("User with this username does no exist", HttpStatus.NOT_FOUND,);
	}

	async getPublicUserData (userID: string) {
		const user = await this.userRepo.query(`SELECT displayname, id, elo FROM public."user" WHERE id = userID`)
		if (user)
			return user;
		throw new HttpException("User with this username does no exist", HttpStatus.NOT_FOUND,);
	}

	async setTwoFactorAuthenticationSecret(secret: string, userId: string) {
		try {
			const user = await this.findById(userId);
			(await user).secret2F = secret;
			await this.userRepo.save(user);
			return user;
		} catch (e) {
			throw new HttpException('Somthing went fucking wrong', HttpStatus.INTERNAL_SERVER_ERROR,);
		}
		return undefined;
	}
	async turnOnTwoFactorAuthentication(userId: string) {
		try {
			const user = await this.findById(userId);
			(await user).is2FOn = true;
			await this.userRepo.save(user);
			return user;
		} catch (e) {
			throw new HttpException('Somthing went wrong', HttpStatus.INTERNAL_SERVER_ERROR,);
		}
		return undefined;
	}

	async turnOffTwoFactorAuthentication(userId: string) {
		try {
			const user = await this.findById(userId);
			(await user).is2FOn = false;
			await this.userRepo.save(user);
			return user;
		} catch (e) {
			throw new HttpException('Somthing went wrong', HttpStatus.INTERNAL_SERVER_ERROR,);
		}
		return undefined;
	}
	async generateQrCodeDataURL(otpAuthUrl: string) {
		return toDataURL(otpAuthUrl);
	}

	async updateChatList(idTriger: string, data: string) {
		try {
			const user = await this.findById(idTriger);
			(await user).chat = data;
			await this.userRepo.save(user);
		} catch (e) {
			throw new HttpException('Somthing went wrong', HttpStatus.INTERNAL_SERVER_ERROR,);
		}
	}

	async updateFriendList(idTriger: string, data: string) {
		try {
			const user = await this.findById(idTriger);
			(await user).friends = data;
			await this.userRepo.save(user);
		} catch (e) {
			throw new HttpException('Somthing went wrong', HttpStatus.INTERNAL_SERVER_ERROR,);
		}
	}

	async updateBlockedList(idTriger: string, data: string) {
		try {
			const user = await this.findById(idTriger);
			(await user).blocked = data;
			await this.userRepo.save(user);
		} catch (e) {
			throw new HttpException('Somthing went wrong', HttpStatus.INTERNAL_SERVER_ERROR,);
		}
	}

	async checkUserIn(id: string, dataI: string) : Promise<boolean> {
		if (dataI == '')
			return false;
		const data = await JSON.parse(dataI);
		let i = 0;
		while (i < data.length){
			if (data[i]?.id == id)
				return true;
			i++;
		}
		return false;
	}
	async getChatList (id: string){
		try {
			const user = await this.findById(id);
			return (await user).chat;
		} catch (e) {
			throw new HttpException('Somthing went fucking wrong', HttpStatus.INTERNAL_SERVER_ERROR,);
		}
		return undefined;
	}

	async getFriendList (id: string){
		try {
			const user = await this.findById(id);
			return (await user).friends;
		} catch (e) {
			throw new HttpException('Somthing went fucking wrong', HttpStatus.INTERNAL_SERVER_ERROR,);
		}
		return undefined;
	}

	async getBlockList (id: string){
		try {
			const user = await this.findById(id);
			return (await user).blocked;
		} catch (e) {
			throw new HttpException('Somthing went fucking wrong', HttpStatus.INTERNAL_SERVER_ERROR,);
		}
		return undefined;
	}

	async newGameLose(user: User) {
		user.gameLose = user.gameLose + 1;
		await this.userRepo.save(user);
	}
}
