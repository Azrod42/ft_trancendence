import Api from "@/app/api/api";
import {FormValueJoinChannel, FormValuesCreateChannel} from "@/app/auth/auth.api";

export type userChannelType = {
    id: string;
    channelname: string;
    channeluser: string;
    type: number;
    length: number
};
export const createChannel = async (formData: FormValuesCreateChannel) => {
    try {
        const data = await Api.post<string, FormValuesCreateChannel>({
            url: '/channel/register-channel',
            data: formData
        },)
        return {status: true, data : data.data};
    } catch (e: any) {
        return {status: false, error: e.response.data.message['0'].constraints?.minLength};
    }
}

export const getUserChannel = async () => {
    try {
        const data = await Api.get<string>('/channel/user-channel',)
        return {status: true, data: data.data};
    } catch (e: any) {
        return {status: false, error: e};
    }
}

export const getChannelWithoutUser = async () => {
    try {
        const data = await Api.get<string>('/channel/channel-without-user',)
        return {status: true, data: data.data};
    } catch (e: any) {
        return {status: false, error: e};
    }
}

export const joinChannel = async (formData: FormValueJoinChannel) => {
    try {
        const data = await Api.post<string, FormValueJoinChannel>({
            url: '/channel/user-join-channel',
            data: formData
        },)
        return {status: true, data : data.data};
    } catch (e: any) {
        return {status: false, error: e};
    }
}