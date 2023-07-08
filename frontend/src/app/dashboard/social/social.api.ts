import Api from "@/app/api/api";
import {
  FormValueJoinChannel,
  FormValuesCreateChannel,
} from "@/app/auth/auth.api";
import { Simulate } from "react-dom/test-utils";
import error = Simulate.error;

export type userChannelType = {
  id: string;
  channelname: string;
  channeluser: string;
  type: number;
  length: number;
};
export type FormValueInviteUser = {
  id: string;
  chanId: string;
};

export type FormValueMuteUser = {
  id: string;
  chanId: string;
  time: number;
};

export type FormValueIdChannel = {
  id: string;
};

export type FormValueSendMessage = {
  id: string;
  chanId: string;
  time: number;
  message: string;
  displayname: string;
};

export type FormValueUserSendMessage = {
  idSender: string;
  idTarget: string;
  time: number;
  displaynameSender: string;
  message: string;
};

export type FormChangeChanType = {
  id: string;
  password: string;
  type: number;
};
export const createChannel = async (formData: FormValuesCreateChannel) => {
  try {
    const data = await Api.post<string, FormValuesCreateChannel>({
      url: "/channel/register-channel",
      data: formData,
    });
    return { status: true, data: data.data };
  } catch (e: any) {
    return {
      status: false,
      error: e.response.data.message["0"].constraints?.minLength,
    };
  }
};

export const getUserChannel = async () => {
  try {
    const data = await Api.get<string>("/channel/user-channel");
    return { status: true, data: data.data };
  } catch (e: any) {
    return { status: false, error: e };
  }
};

export const getChannelWithoutUser = async () => {
  try {
    const data = await Api.get<string>("/channel/channel-without-user");
    return { status: true, data: data.data };
  } catch (e: any) {
    return { status: false, error: e };
  }
};

export const joinChannel = async (formData: FormValueJoinChannel) => {
  try {
    const data = await Api.post<string, FormValueJoinChannel>({
      url: "/channel/user-join-channel",
      data: formData,
    });
    return { status: true, data: data.data };
  } catch (e: any) {
    if (e.name == "AxiosError")
      return { status: false, error: e.response.data.message };
    return { status: false, error: e };
  }
};

export const fetchChannelInfo = async (formData: FormValueIdChannel) => {
  try {
    const data = await Api.post<string, FormValueIdChannel>({
      url: "/channel/fetch-channel-info",
      data: formData,
    });
    return { status: true, data: data.data };
  } catch (e: any) {
    return { status: false, error: e };
  }
};

export const changeChanType = async (formData: FormChangeChanType) => {
  try {
    const data = await Api.post<string, FormChangeChanType>({
      url: "/channel/channel-new-type",
      data: formData,
    });
    return { status: true, data: data.data };
  } catch (e: any) {
    if (e.name == "AxiosError")
      return { status: false, error: e.response.data.message };
    return { status: false, error: e };
  }
};

export const inviteUserChan = async (formData: FormValueInviteUser) => {
  try {
    const data = await Api.post<string, FormValueInviteUser>({
      url: "/channel/invite-user-channel",
      data: formData,
    });
    return { status: true, data: data.data };
  } catch (e: any) {
    if (e.name == "AxiosError")
      return { status: false, error: e.response.data.message };
    return { status: false, error: e };
  }
};

export const kickUserChan = async (formData: FormValueInviteUser) => {
  try {
    const data = await Api.post<string, FormValueInviteUser>({
      url: "/channel/kick-user",
      data: formData,
    });
    return { status: true, data: data.data };
  } catch (e: any) {
    if (e.name == "AxiosError")
      return { status: false, error: e.response.data.message };
    return { status: false, error: e };
  }
};

export const banUserChan = async (formData: FormValueInviteUser) => {
  try {
    const data = await Api.post<string, FormValueInviteUser>({
      url: "/channel/ban-user",
      data: formData,
    });
    return { status: true, data: data.data };
  } catch (e: any) {
    if (e.name == "AxiosError")
      return { status: false, error: e.response.data.message };
    return { status: false, error: e };
  }
};

export const unbanUserChan = async (formData: FormValueInviteUser) => {
  try {
    const data = await Api.post<string, FormValueInviteUser>({
      url: "/channel/unban-user",
      data: formData,
    });
    return { status: true, data: data.data };
  } catch (e: any) {
    if (e.name == "AxiosError")
      return { status: false, error: e.response.data.message };
    return { status: false, error: e };
  }
};

export const leaveChannel = async (formData: FormValueIdChannel) => {
  try {
    const data = await Api.post<string, FormValueIdChannel>({
      url: "/channel/leave-channel",
      data: formData,
    });
    return { status: true, data: data.data };
  } catch (e: any) {
    if (e.name == "AxiosError")
      return { status: false, error: e.response.data.message };
    return { status: false, error: e };
  }
};

export const addAdministrator = async (formData: FormValueIdChannel) => {
  try {
    const data = await Api.post<string, FormValueIdChannel>({
      url: "/channel/add-administrator",
      data: formData,
    });
    return { status: true, data: data.data };
  } catch (e: any) {
    if (e.name == "AxiosError")
      return { status: false, error: e.response.data.message };
    return { status: false, error: e };
  }
};

export const removeAdministrator = async (formData: FormValueIdChannel) => {
  try {
    const data = await Api.post<string, FormValueIdChannel>({
      url: "/channel/remove-administrator",
      data: formData,
    });
    return { status: true, data: data.data };
  } catch (e: any) {
    if (e.name == "AxiosError")
      return { status: false, error: e.response.data.message };
    return { status: false, error: e };
  }
};

export const muteUserPost = async (formData: FormValueMuteUser) => {
  try {
    const data = await Api.post<string, FormValueMuteUser>({
      url: "/channel/mute-user",
      data: formData,
    });
    return { status: true, data: data.data };
  } catch (e: any) {
    if (e.name == "AxiosError")
      return { status: false, error: e.response.data.message };
    return { status: false, error: e };
  }
};

export const blockUserApi = async (formData: FormValueInviteUser) => {
  try {
    const data = await Api.post<string, FormValueInviteUser>({
      url: "/users/block-user",
      data: formData,
    });
    return { status: true, data: data.data };
  } catch (e: any) {
    if (e.name == "AxiosError")
      return { status: false, error: e.response.data.message };
    return { status: false, error: e };
  }
};

export const unblockUserApi = async (formData: FormValueInviteUser) => {
  try {
    const data = await Api.post<string, FormValueInviteUser>({
      url: "/users/unblock-user",
      data: formData,
    });
    return { status: true, data: data.data };
  } catch (e: any) {
    if (e.name == "AxiosError")
      return { status: false, error: e.response.data.message };
    return { status: false, error: e };
  }
};

export const sendMessageApi = async (formData: FormValueSendMessage) => {
  try {
    const data = await Api.post<string, FormValueSendMessage>({
      url: "/channel/new-message",
      data: formData,
    });
    return { status: true, data: data.data };
  } catch (e: any) {
    if (e.name == "AxiosError")
      return { status: false, error: e.response.data.message };
    return { status: false, error: e };
  }
};

export const getChannelMessageApi = async (formData: FormValueInviteUser) => {
  try {
    const data = await Api.post<string, FormValueInviteUser>({
      url: "/channel/get-msg-hist",
      data: formData,
    });
    return { status: true, data: data.data };
  } catch (e: any) {
    if (e.name == "AxiosError")
      return { status: false, error: e.response.data.message };
    return { status: false, error: e };
  }
};

export const sendUserMessageApi = async (formData: FormValueUserSendMessage) => {
  try {
    const data = await Api.post<string, FormValueUserSendMessage>({
      url: "/users/new-message",
      data: formData,
    });
    return { status: true, data: data.data };
  } catch (e: any) {
    if (e.name == "AxiosError")
      return { status: false, error: e.response.data.message };
    return { status: false, error: e };
  }
};

export const getUserMessageApi = async (formData: FormValueIdChannel) => {
  try {
    const data = await Api.post<string, FormValueIdChannel>({
      url: "/users/get-msg-hist",
      data: formData,
    });
    return { status: true, data: data.data };
  } catch (e: any) {
    if (e.name == "AxiosError")
      return { status: false, error: e.response.data.message };
    return { status: false, error: e };
  }
};