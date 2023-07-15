import { IsEmail,IsString,IsNotEmpty,MinLength } from "class-validator";
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

	@IsNotEmpty()
	passwordRepeat: string;

	is2FOn: boolean;

	secret2F: string;

	elo: number;

	displayname: string;

	friends: string;

	blocked: string;

	chat: string;

	gameLose: number;

	idWebSocket: string;

	gameNumber : number;

}

export default CreateUserDto;
