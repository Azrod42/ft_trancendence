import { IsNotEmpty } from "class-validator";

export class chanJoinDto {
    @IsNotEmpty()
    id: string;

    @IsNotEmpty()
    password: string;
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