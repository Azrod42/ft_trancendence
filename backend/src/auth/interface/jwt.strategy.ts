import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { Request } from "express";
import { use } from 'passport';
import TokenPayload from "./tokenPayload.i";

@Injectable()
class JwtStrategy extends PassportStrategy(Strategy) {
	
	constructor (private configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(request: Request) => {
					return request?.cookies?.Authentication;
				},
			]),
			secretOrKey: configService.get("JWT_SECRET"),
			noreExpiration: false,
			});
		};

	async validate(payload: TokenPayload) {
		// console.log(payload.user)
		return payload.user;
	}
}

export default JwtStrategy;