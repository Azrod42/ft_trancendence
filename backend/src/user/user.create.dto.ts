import { IsEmail,IsString,IsNotEmpty,MinLength,IsBoolean } from "class-validator";
import { NONAME } from "dns";

class CreateUserDto {
	@IsString()
	@IsNotEmpty()
	@MinLength(7)
	password:string;
	
	@IsString()
	@IsNotEmpty()
	username:string;
	
	@IsEmail()
	email: string;

	@IsString()
	avatar: string;

	@IsBoolean()
	is2FOn: boolean;
	
	@IsString()
	secret2F: string;
}

export default CreateUserDto;
