import { IsNotEmpty } from "class-validator";

export class chanJoinDto {
    @IsNotEmpty()
    id: string;

    @IsNotEmpty()
    password: string;
}

export class newGameDto {
    @IsNotEmpty()
    idGame: string;

    @IsNotEmpty()
    idWinner: string;

    @IsNotEmpty()
    idLoser: string;

    @IsNotEmpty()
    scoreWinner: number;

    @IsNotEmpty()
    scoreLoser: number;

    @IsNotEmpty()
    ranked: boolean;
}

export class chanIdDto {
    @IsNotEmpty()
    id: string;
}

export class chanNewTypeDto {
    @IsNotEmpty()
    id: string;

    @IsNotEmpty()
    type: number;

    @IsNotEmpty()
    password: string;
}

export class inviteToChannelDto {
    @IsNotEmpty()
    id: string;

    @IsNotEmpty()
    chanId: string;
}

export class muteUserDto {
    @IsNotEmpty()
    id: string;

    @IsNotEmpty()
    chanId: string;

    @IsNotEmpty()
    time: number;
}

export class messageReqDto {
    @IsNotEmpty()
    id : string;

    @IsNotEmpty()
    chanId: string;

    @IsNotEmpty()
    time: number;

    @IsNotEmpty()
    displayname: string;

    @IsNotEmpty()
    message: string;

}