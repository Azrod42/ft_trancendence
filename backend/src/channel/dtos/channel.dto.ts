import { IsNotEmpty } from "class-validator";

export class chanJoinDto {
    @IsNotEmpty()
    id: string;

    @IsNotEmpty()
    password: string;
}