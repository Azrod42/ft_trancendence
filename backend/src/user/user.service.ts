import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from "./user.entity";
import { Repository} from 'typeorm';
import CreateUserDto from './user.create.dto';

@Injectable()
export class UserService {

	constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

	async findById (id: string){
		const user = await this.userRepo.findOneBy({id});
		if (user)
			return user;
			throw new HttpException("User with this id does no exist", HttpStatus.NOT_FOUND,);
	}

	async  create(userData: CreateUserDto) {
		const newUser = await this.userRepo.create(userData);
		await this.userRepo.save(newUser);
		return newUser;
	}
}
