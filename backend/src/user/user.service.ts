import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from "./user.entity";
import { Repository} from 'typeorm';
import CreateUserDto from './user.create.dto';
import {ChangeDisplayNameDto} from './dtos/user.changedisplay.dto';
import * as fs from 'fs'

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
			throw new HttpException('Somthing went fucking wrong', HttpStatus.INTERNAL_SERVER_ERROR,);

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

	async getPublicUserData (userID: string) {
		const user = await this.userRepo.query(`SELECT displayname, id, elo FROM public."user" WHERE id = userID`)
		if (user)
			return user;
		throw new HttpException("User with this username does no exist", HttpStatus.NOT_FOUND,);
	}
}
