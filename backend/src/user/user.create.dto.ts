import { NONAME } from "dns";

class CreateUserDto {
	password:string;
	username:string;
	email: string;
	avatar: string;
	is2FOn: boolean;
	secret2F: string;
}

export default CreateUserDto;
