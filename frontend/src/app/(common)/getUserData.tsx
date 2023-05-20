import { UserAuthResponse } from "../auth/auth.api";

export function getUserData() : UserAuthResponse {
	return JSON.parse(localStorage.getItem('user')!)
}
