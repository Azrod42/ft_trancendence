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

interface UserAuthResponse {
	id:string;
	username: string;
}

export const login = async(formInput: FormValues) => {
	const { data } = await Api.post<UserAuthResponse, FormValues>({
		url: "/auth/login",
		data: formInput,
	});
}

export const register = async (registerInput: FormValuesRegister) => {
	const { data } = await Api.post<UserAuthResponse, FormValues>({
		url: "/auth/register",
		data: registerInput,
	});
	console.log(data);
}