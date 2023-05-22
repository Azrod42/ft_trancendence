import Api from "../api/api";
import {FormDisplayName} from "@/app/dashboard/profile/page";
import {blob} from "stream/consumers";

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
	email: string;
	displayname: string;
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
	await Api.post<UserAuthResponse, FormValuesRegister>({
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

export  const changeDisplayName = async(registerInput: FormDisplayName) => {
	let data;
	try {
		data = await Api.post<UserAuthResponse, FormDisplayName>({
			url: '/users/displayname',
			data: registerInput
		});
		return data;
	} catch (e) {
	}
}

export  const getUserInfo = async() => {
	try {
		const {data} = await Api.get<UserAuthResponse>('/users/getuserdata',);
		// console.log(data);
		return data;
	} catch (e) {
		return undefined;
	}
}

export const uploadProfilePicture = async (profilePicture:  FormData) => {
	await Api.post<UserAuthResponse, FormData>({
		url: "/users/upload",
		data: profilePicture,
	});
}

export const getProfilePicture = async () => {
	try {
		const data = await Api.get<any>('/users/profile-picture',)
		return data;
	} catch (e) {
		return undefined;
	}
}