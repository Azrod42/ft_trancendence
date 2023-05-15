import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from "./user.entity";
import { Repository} from 'typeorm';
import CreateUserDto from './user.create.dto';
import postgresErrorCode from 'src/database/postgresErrorCodes';
import { error } from 'console';
import ChangeDisplayNameDto from './dtos/user.changedisplay.dto';

@Injectable()
export class UserService {

	constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

	async findById (id: string){
		const user = await this.userRepo.findOneBy({id});
		if (user)
			return user;
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
			console.log(e);
			throw new HttpException('Somthing went fucking wrong', HttpStatus.INTERNAL_SERVER_ERROR,);

		}
	}
}
