import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { Request } from "express";
import TokenPayload from "./interface/tokenPayload.i";

@Injectable()
class JwtStrategy extends PassportStrategy(Strategy) {
	constructor (private readonly configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
			(request: Request) => {
				console.log(request.cookies);
				return request?.cookies?.Authentication;
			},
			]),
			secretOrKey: configService.get("JWT_SECRET"),
		})
	}

	async validate (payload: TokenPayload) {
		return payload.user;
	}
}

export default JwtStrategy;