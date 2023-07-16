import { IsEmail,IsString,IsNotEmpty,MinLength } from "class-validator";
import {Column} from "typeorm";
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

	msgHist: string;

	idWebSocket: string;

	gameNumber : number;

	gameWin: number;

	gameLose:number;

	winLoseRate: string;

	totalPointGet: number;

	totalPointTake: number;

	pointGetTakeRate: string;

	winStreak: number;

	gameHist: string;

	xp: number;

	totalGame: number;
}

export default CreateUserDto;
