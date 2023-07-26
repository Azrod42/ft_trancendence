import {IsString, IsNotEmpty, MinLength, MaxLength} from "class-validator";

export class ChangeDisplayNameDto {
	@IsString()
	@IsNotEmpty()
	@MinLength(3)
	displayname: string;
}


export class ChangeDisplayName {
	@IsNotEmpty()
	@MaxLength(10)
	displayname: string;
}

export class UserId {
	@IsNotEmpty()
	id: string;
}
export class socketId {
	@IsNotEmpty()
	id: string;
}

export class messageUser {
	@IsNotEmpty()
	idSender : string;

	@IsNotEmpty()
	idTarget: string;

	@IsNotEmpty()
	time: number;

	@IsNotEmpty()
	displaynameSender: string;

	@IsNotEmpty()
	message: string;

}
