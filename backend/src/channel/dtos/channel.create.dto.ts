import {IsString, IsNotEmpty, MinLength, IsEmpty, IsNumber} from "class-validator";
import {Column} from "typeorm";
class CreateChannelDto {
	@IsString()
	@IsNotEmpty()
	owners: string

	@IsString()
	@IsNotEmpty()
	@MinLength(3)
	channelname: string

	@IsString()
	password: string

	@IsNumber()
	@IsNotEmpty()
	type: number;

	@IsEmpty()
	msghist: string;

	@IsEmpty()
	mutedusers: string;

	@IsEmpty()
	bannedusers: string;

	@IsEmpty()
	channelusers: string;

	@IsEmpty()
	owner: string;
}

export default CreateChannelDto;
