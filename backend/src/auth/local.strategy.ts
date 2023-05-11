import {  Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "./auth.service";
import User from "src/user/user.entity";

@Injectable()
	export class LocalStrategy extends PassportStrategy(Strategy) {
		constructor(private readonly authService: AuthService) {
			super ({
				usernameField: "username",
			});
		}

		async validate(username: string, passport:string) : Promise<User> {
			return this.authService.getAutenticatedUser(username, passport);
		}
}