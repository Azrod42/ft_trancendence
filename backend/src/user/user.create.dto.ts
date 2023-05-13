import { IsEmail,IsString,IsNotEmpty,MinLength,IsBoolean } from "class-validator";
import { NONAME } from "dns";

class CreateUserDto {
	@IsString()
	@IsNotEmpty()
	@MinLength(6)
	password:string;
	
	@IsString()
	@IsNotEmpty()
	username:string;
	
	@IsEmail()
	email: string;

	avatar: string;

	passwordRepeat: string;

	is2FOn: boolean;
	
	secret2F: string;
}

export default CreateUserDto;
