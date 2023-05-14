import Api from "../api/api";
import Error from "next/error";

export type FormValues = {
	username: string;
	password: string;
};

export type FormValuesRegister = {
	email: string;
	username: string;
	password: string;
	passwordRepeat: string;
};

export interface UserAuthResponse {
	id:string;
	username: string;
}

export const login = async(loginInput: FormValues) => {
	try {
		const { data } = await Api.post<UserAuthResponse, FormValues>({
			url: "/auth/login",
			data: loginInput,
		});
		return(data);
	} catch (e) {
		return undefined;
	}
}

export const register = async (registerInput: FormValuesRegister) => {
	const { data } = await Api.post<UserAuthResponse, FormValuesRegister>({
		url: "/auth/register",
		data: registerInput,
	});
}

export const islog = async() => {
	try {
	const { data } = await Api.get<UserAuthResponse>("/auth/logcheck",);
		return (data);
	} catch (e) {
		return undefined;
	}
}

export const logout = async() => {
	try {
	const { data } = await Api.get<UserAuthResponse>("/auth/logout",);
		return (data);
	} catch (e) {
		return undefined;
	}
}