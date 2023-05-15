import { IsEmail,IsString,IsNotEmpty,MinLength,IsBoolean } from "class-validator";
import { NONAME } from "dns";

class ChangeDisplayNameDto {
	@IsString()
	@IsNotEmpty()
	@MinLength(3)
	displayname: string;
	
	@IsNotEmpty()
	id: string;
}

export default ChangeDisplayNameDto;
