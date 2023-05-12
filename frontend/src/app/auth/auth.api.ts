import Api from "../api/api";
import Error from "next/error";

export type FormValues = {
	username: string;
	password: string;
};

interface LoginResponse {
	id:string;
	username: string;
}

export const login = async(formInput: FormValues) => {
	const { data } = await Api.post<LoginResponse, FormValues>({
		url: "/auth/login",
		data: formInput,
	});
}