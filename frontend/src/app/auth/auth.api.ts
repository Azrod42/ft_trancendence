import Api from "../api/api";
import {FormDisplayName} from "@/app/dashboard/profile/page";

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

export type FormValuesCreateChannel = {
	channelname: string;
	password: string;
	type: number
	owners: string;
};

export type FormValueJoinChannel = {
	id: string;
	password: string;
};

export type UserId = {
	id: string;
};

export type FormOtp = {
	twoFactorAuthenticationCode: string;
};

export type FormOtpPost = {
	twoFactorAuthenticationCode: string;
	uniqueIdentifier: string;
};

export interface UserAuthResponse {
	id:string;
	username: string;
	email: string;
	displayname: string;
	is2FOn: boolean;
}

export interface PublicUserResponse {
	id:string;
	avatar: string;
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

export const getPublicUserInfo = async (id: any) => {
	try {
		const userId: UserId = { id: id};
		const data = await Api.post<string, UserId>({
			url: '/users/post-public-userdata',
			data: userId
		},)
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

export const postProfilePicture = async (id: string) => {
	try {
		const userId: UserId = { id: id};
		const data = await Api.post<string, UserId>({
			url: '/users/post-profile-picture',
			data: userId
		},)
		return data;
	} catch (e) {
		return undefined;
	}
}
export const getAllUsers = async () => {
	try {
		const data = await Api.get<any>('/users/get-all-user',)
		return data;
	} catch (e) {
		return undefined;
	}
}

export const generateQr = async () => {
	try {
		const data = await Api.get<any>('/auth/2fa/generate',)
		return data;
	} catch (e) {
		return undefined;
	}
}

export const activate2fa = async (form: FormOtp) => {
	try {
		const data = await Api.post<string, FormOtp>({
			url: '/auth/2fa/turn-on',
			data: form
		},)
		return data;
	} catch (e) {
		return undefined;
	}
}

export const login2fa = async (form: FormOtpPost) => {
	try {
		const data = await Api.post<string, FormOtpPost>({
			url: '/auth/2fa/login',
			data: form
		},)
		return data;
	} catch (e) {
		return undefined;
	}
}

export const login2faNeeded = async (hash: any) => {
	try {
		const data = await Api.post<string, any>({
			url: '/auth/2fa/check-on',
			data: hash
		},)
		return data;
	} catch (e) {
		return undefined;
	}
}

export const disable2fa = async () => {
	try {
		const data = await Api.get<any>('/auth/2fa/disable',)
		return data;
	} catch (e) {
		return undefined;
	}
}

export const addChat = async (id: any) => {
	try {
		const data = await Api.post<string, any>({
			url: '/users/add-chat-list',
			data: id
		},)
		return data;
	} catch (e) {
		return undefined;
	}
}

export const removeChat = async (id: any) => {
	try {
		const data = await Api.post<string, any>({
			url: '/users/remove-chat-list',
			data: id
		},)
		return data;
	} catch (e) {
		return undefined;
	}
}

export const addFriend = async (id: any) => {
	try {
		const data = await Api.post<string, any>({
			url: '/users/add-friend-list',
			data: id
		},)
		return data;
	} catch (e) {
		return undefined;
	}
}

export const removeFriend = async (id: any) => {
	try {
		const data = await Api.post<string, any>({
			url: '/users/remove-friend-list',
			data: id
		},)
		return data;
	} catch (e) {
		return undefined;
	}
}

export const addBlock = async (id: any) => {
	try {
		const data = await Api.post<string, any>({
			url: '/users/add-block-list',
			data: id
		},)
		return data;
	} catch (e) {
		return undefined;
	}
}

export const removeBlock = async (id: any) => {
	try {
		const data = await Api.post<string, any>({
			url: '/users/remove-block-list',
			data: id
		},)
		return data;
	} catch (e) {
		return undefined;
	}
}

export const getChatList = async () => {
	try {
		const data = await Api.get<any>('/users/get-chat-list',)
		return data;
	} catch (e) {
		return undefined;
	}
}

export const getFriendList = async () => {
	try {
		const data = await Api.get<any>('/users/get-friend-list',)
		return data;
	} catch (e) {
		return undefined;
	}
}

export const getBlockList = async () => {
	try {
		const data = await Api.get<any>('/users/get-block-list',)
		return data;
	} catch (e) {
		return undefined;
	}
}

export const gameLose = async () => {
	try {
		const data = await Api.get<any>('/users/game-lose',)
		return data;
	} catch (e) {
		return undefined;
	}
}