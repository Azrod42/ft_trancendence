'use client'
import React, {useEffect, useState, useRef} from 'react';
import {useParams, useRouter} from "next/navigation";
import styles from './channelMessage.module.css'
import {SubmitHandler, useForm} from "react-hook-form";
import {FormValueJoinChannel, getPublicUserInfo} from "@/app/auth/auth.api";
import {
    addAdministrator,
    banUserChan, blockUserApi,
    changeChanType,
    createChannel,
    fetchChannelInfo,
    FormChangeChanType,
    FormValueInviteUser,
    FormValueMuteUser,
    FormValueSendMessage,
    inviteUserChan,
    joinChannel,
    kickUserChan,
    leaveChannel,
    muteUserPost,
    removeAdministrator,
    unbanUserChan,

} from "@/app/dashboard/social/social.api";
import {useMutation, useQuery} from "react-query";
import LoadingPage from "@/app/(component)/loadingPage/loadingPage";
import ErrorNotification from "@/app/(component)/errorNotification/errorNotification";
import {mockSession} from "next-auth/client/__tests__/helpers/mocks";
import user = mockSession.user;

interface ChannelProps {
}

const Channel: React.FC<ChannelProps> = ({}) => {
    const {push} = useRouter();
    let userRef: any = useRef(this);
    const uniqueIdentifier = useParams()['channel'].slice(8);
    const [chanData, setChanData] = useState<any>(undefined);
    const [popup, setPopup] = useState<boolean>(false)
    const [displayPw, setDisplayPw] = useState<boolean>(false);
    const [displayBlockUser, setDisplayBlockUser] = useState<boolean>(false);
    const [changeTypeData, setChangeTypeData] = useState<FormChangeChanType>({id: "undefine", password: 'undefine', type: 0});
    const registerPw = useForm<FormValueJoinChannel>();
    const inviteUsr= useForm<FormValueInviteUser>();
    const sendMsg = useForm<FormValueSendMessage>();
    const kickUsr= useForm<FormValueInviteUser>();
    const banUsr= useForm<FormValueInviteUser>();
    const unbanUsr= useForm<FormValueInviteUser>();
    const addAdmin= useForm<FormValueInviteUser>();
    const removeAdmin= useForm<FormValueInviteUser>();
    const muteUser= useForm<FormValueMuteUser>();
    const blockUser= useForm<FormValueInviteUser>();


    //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    //HANDLE ERROR NOTIFICATION
    const [errorDisplay, setError] = useState<boolean>(false);
    const [headerError, setHeaderError] = useState<string>('');
    const [errorMsg, setErrorMsg] = useState<string>('');
    //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    //GET CHANNEL DATA
    const { isLoading, error, data, refetch } = useQuery('fetchChannelInfo', () =>
        fetchChannelInfo({id: uniqueIdentifier}).then(res => {
            setChanData(res.data);
        }), { staleTime: 5000, refetchOnWindowFocus: false, refetchInterval: 5000}
    );
    useEffect(() => {
        if (!chanData)
            refetch();
        if (chanData) {
            if (chanData.channelusers == '')
                push('/dashboard/social/channel-home');
            const users = JSON.parse(chanData.channelusers);
            let i = -1;
            let userIn =false;
            while (users[++i]) {
                if (users[i].id == chanData.password)
                    userIn = true
            }
            if (!userIn)
                push('/dashboard/social/channel-home');
        }
        const userIds: any[] = []
        if (chanData?.channelusers) {
            const userList = JSON.parse(chanData?.channelusers);
            let htmlUser = `<style></style>`;
            for (let i = 0; userList[i]; i++) {
                getPublicUserInfo(userList[i].id).then((res: any) => {
                    htmlUser += `
                    <span id='${res?.data.id}'>${res?.data.displayname}</span>
                `
                    userRef.current.innerHTML! = htmlUser;
                    userIds.push({id: res?.data.id});
                });
            }
            setTimeout(() => {
                for (let i = 0; i < userIds.length; i++) {
                    let mySelectedElement = document.getElementById(userIds[i].id);
                    mySelectedElement?.addEventListener("click", function getHtml() {
                        push(`/dashboard/user/${userIds[i].id}`)
                    })
                }
            }, 1000);
        } else
            refetch()
    }, [chanData])
    //=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    //MUTATION  CHANGE CHANNEL TYPE
    const {mutate: updateType} = useMutation(changeChanType, {
        onSuccess: (res: any) => {
            if (res.status == false){
                setHeaderError('Error :');
                setErrorMsg(res.error);
                setError(true);
                setTimeout (() => {
                    setError(false)
                },3000);
            }
            else
                refetch();
        },
    });
    const onSubmitChannelTypePw: SubmitHandler<FormValueJoinChannel> = (data) => {
        setDisplayPw(false);
        const newData: FormChangeChanType = changeTypeData;
        newData.password = data.password;
        updateType(newData);
    }
    function onSubmitChangeType(type: number) {
        setPopup(false);
        setChangeTypeData({id: uniqueIdentifier, password: 'unset', type: type})
        if (type == 3)
            setDisplayPw(true);
        else {
            const data: FormChangeChanType = {id: uniqueIdentifier, password: 'unset', type: type}
            updateType(data);
        }
    }
    //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    //INVITE USER IN CHANNEL
    const onSubmitInviteUsr: SubmitHandler<FormValueInviteUser> = (data) => {
        setPopup(false);
        data.chanId = uniqueIdentifier;
        inviteUserChan(data).then((res) => {
            if (!res.status){
                setHeaderError('Error :');
                setErrorMsg(res.error);
                setError(true);
                setTimeout (() => {
                    setError(false)
                },3000);
            }
            else
                refetch();
            inviteUsr.reset();
        });
    }
    //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    //KICK USER IN CHANNEL
    const onSubmitKickUsr: SubmitHandler<FormValueInviteUser> = (data) => {
        setPopup(false);
        data.chanId = uniqueIdentifier;
        kickUserChan(data).then((res) => {
            if (!res.status){
                setHeaderError('Error :');
                setErrorMsg(res.error);
                setError(true);
                setTimeout (() => {
                    setError(false)
                },3000);
            }
            else
                refetch();
            kickUsr.reset();
        });
    }
    //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    //BAN USER IN CHANNEL
    const onSubmitBanUsr: SubmitHandler<FormValueInviteUser> = (data) => {
        setPopup(false);
        data.chanId = uniqueIdentifier;
        banUserChan(data).then((res) => {
            if (!res.status){
                setHeaderError('Error :');
                setErrorMsg(res.error);
                setError(true);
                setTimeout (() => {
                    setError(false)
                },3000);
            }
            else
                refetch();
            banUsr.reset();
        });
    }
    //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    //UNBAN USER IN CHANNEL
    const onSubmitUnbanUsr: SubmitHandler<FormValueInviteUser> = (data) => {
        setPopup(false);
        data.chanId = uniqueIdentifier;
        unbanUserChan(data).then((res) => {
            if (!res.status){
                setHeaderError('Error :');
                setErrorMsg(res.error);
                setError(true);
                setTimeout (() => {
                    setError(false)
                },3000);
            }
            else
                refetch();
            unbanUsr.reset();
        });
    }
    //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    //UNBAN USER IN CHANNEL
    function onSubmitLeaveChannel() {
        leaveChannel({id: uniqueIdentifier}).then((res) => {
            if (!res.status){
                setHeaderError('Error :');
                setErrorMsg(res.error);
                setError(true);
                setTimeout (() => {
                    setError(false)
                },3000);
            }
            else
                refetch();
        });
    }
    //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    //ADD ADMIN USER IN CHANNEL
    const onSubmitAddAdmin: SubmitHandler<FormValueInviteUser> = (data) => {
        setPopup(false);
        data.chanId = uniqueIdentifier;
        addAdministrator(data).then((res) => {
            if (!res.status){
                setHeaderError('Error :');
                setErrorMsg(res.error);
                setError(true);
                setTimeout (() => {
                    setError(false)
                },3000);
            }
            else
                refetch();
            addAdmin.reset();
        });
    }
    //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    //ADD ADMIN USER IN CHANNEL
    const onSubmitRemoveAdmin: SubmitHandler<FormValueInviteUser> = (data) => {
        setPopup(false);
        data.chanId = uniqueIdentifier;
        removeAdministrator(data).then((res) => {
            if (!res.status){
                setHeaderError('Error :');
                setErrorMsg(res.error);
                setError(true);
                setTimeout (() => {
                    setError(false)
                },3000);
            }
            else
                refetch();
            removeAdmin.reset();
        });
    }
    //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    //ADD ADMIN USER IN CHANNEL
    const onSubmitMuteUser: SubmitHandler<FormValueMuteUser> = (data) => {
        setPopup(false);
        const date = new Date();
        data.time = date.getTime() + (data.time * 1000)
        data.chanId = uniqueIdentifier;
        muteUserPost(data).then((res) => {
            if (!res.status){
                setHeaderError('Error :');
                setErrorMsg(res.error);
                setError(true);
                setTimeout (() => {
                    setError(false)
                },3000);
            }
            else
                refetch();
            muteUser.reset();
        });
    }
    //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    //BLOCK USER
    function onSubmitBlockUser() {
        setDisplayBlockUser(true);
    }
    const onSubmitBlockUserForm: SubmitHandler<FormValueInviteUser> = (data) => {
        setPopup(false);
        data.chanId = uniqueIdentifier;
        blockUserApi(data).then((res) => {
            if (!res.status){
                setHeaderError('Error :');
                setErrorMsg(res.error);
                setError(true);
                setTimeout (() => {
                    setError(false)
                },3000);
            }
            else
                refetch();
            removeAdmin.reset();
        });
    }
    //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=


    const onSubmitSendMessage: SubmitHandler<FormValueSendMessage> = (data) => {
        console.log(data);
    }


    return (
        <div className={styles.container}>
            <div className={styles.left}>
                {errorDisplay ? <ErrorNotification headerText={headerError} error={errorMsg} /> : <></>}
                <div className={styles.chatWindow}>
                    {uniqueIdentifier}
                </div>
                <form className={styles.containerInForm} onSubmit={sendMsg.handleSubmit(onSubmitSendMessage)}>
                    <input className={styles.input} type="text" placeholder="" {...sendMsg.register('message', {required: true})} />
                    <input className={styles.buttonSend} type="submit" value='send'/>
                </form>
            </div>
            <div className={styles.right}>
                <h1 className={styles.h1}>{chanData?.channelname}</h1>
                <div className={styles.buttonConfig} onClick={() => setPopup(true)}>Channel Options</div>
                <div className={styles.buttonConfig} onClick={() => onSubmitBlockUser()}>User Option</div>
                <div className={styles.buttonConfig} onClick={() => onSubmitLeaveChannel()}>Leave Channel</div>
                <hr className={styles.hr}/>
                {/*<p>channel owner : {chanData?.owner}</p>*/}
                <p>Users :</p>
                <div ref={userRef} className={styles.htmlInput}> <LoadingPage /></div>
            </div>
            {popup ?
                <>
                    <div className={styles.layer} onClick={() => setPopup(false)}></div>
                    <div className={styles.containerLayer}>
                        <p className={styles.p}>Change channel type:</p>
                        <div className={styles.changeType}>
                            <div className={styles.buttonGlobal} onClick={() => onSubmitChangeType(1)}>Public</div>
                            <div className={styles.buttonGlobal} onClick={() => onSubmitChangeType(2)}>Private</div>
                            <div className={styles.buttonGlobal} onClick={() => onSubmitChangeType(3)}>Protected</div>
                        </div>
                        {chanData?.type == 2 ?
                            <>
                                <p className={styles.p}>Invite user:</p>
                                <form className={styles.containerInForm3} onSubmit={inviteUsr.handleSubmit(onSubmitInviteUsr)}>
                                    <input className={styles.input} type="text" placeholder="" {...inviteUsr.register('id', {required: true})} />
                                    <input className={styles.buttonSend2} type="submit" value='Invite'/>
                                </form>
                            </>: <></> }
                        <p className={styles.p}>Kick user:</p>
                        <form className={styles.containerInForm3} onSubmit={kickUsr.handleSubmit(onSubmitKickUsr)}>
                            <input className={styles.input} type="text" placeholder="" {...kickUsr.register('id', {required: true})} />
                            <input className={styles.buttonSend2} type="submit" value='Kick'/>
                        </form>
                        <p className={styles.p}>Ban user:</p>
                        <form className={styles.containerInForm3} onSubmit={banUsr.handleSubmit(onSubmitBanUsr)}>
                            <input className={styles.input} type="text" placeholder="" {...banUsr.register('id', {required: true})} />
                            <input className={styles.buttonSend2} type="submit" value='Ban'/>
                        </form>
                        <p className={styles.p}>Unban user:</p>
                        <form className={styles.containerInForm3} onSubmit={unbanUsr.handleSubmit(onSubmitUnbanUsr)}>
                            <input className={styles.input} type="text" placeholder="" {...unbanUsr.register('id', {required: true})} />
                            <input className={styles.buttonSend2} type="submit" value='Unban'/>
                        </form>
                        <p className={styles.p}>Add administrator:</p>
                        <form className={styles.containerInForm3} onSubmit={addAdmin.handleSubmit(onSubmitAddAdmin)}>
                            <input className={styles.input} type="text" placeholder="" {...addAdmin.register('id', {required: true})} />
                            <input className={styles.buttonSend2} type="submit" value='Add'/>
                        </form>
                        <p className={styles.p}>Remove administrator:</p>
                        <form className={styles.containerInForm3} onSubmit={removeAdmin.handleSubmit(onSubmitRemoveAdmin)}>
                            <input className={styles.input} type="text" placeholder="" {...removeAdmin.register('id', {required: true})} />
                            <input className={styles.buttonSend2} type="submit" value='Remove'/>
                        </form>
                        <p className={styles.p}>Mute user:</p>
                        <form className={styles.containerInForm3} onSubmit={muteUser.handleSubmit(onSubmitMuteUser)}>
                            <input className={styles.input} type="text" placeholder="" {...muteUser.register('id', {required: true})} />
                            <input className={styles.input2} type="number" placeholder="time in s" {...muteUser.register('time', {required: true})} />
                            <input className={styles.buttonSend2} type="submit" value='Mute'/>
                        </form>
                    </div>
                </>: <></>}
            {displayPw ?
                <>
                    <div className={styles.layer} onClick={() => setDisplayPw(false)}></div>
                    <div className={styles.getPassword} onClick={() => setDisplayPw(true)}>
                        <h2 className={styles.h2}>Channel Password</h2>
                        <form className={styles.containerInForm2} onSubmit={registerPw.handleSubmit(onSubmitChannelTypePw)}>
                            <div className={styles.inputDiv}>
                                <input className={styles.input} type="password" placeholder="" {...registerPw.register('password', {required: true})} />
                            </div>
                            <input className={styles.buttonSend} type="submit" value='Join'/>
                        </form>
                    </div>
                </> : <div></div>}
            {displayBlockUser ?
                <>
                    <div className={styles.layer} onClick={() => setDisplayBlockUser(false)}></div>
                    <div className={styles.getPassword} onClick={() => setDisplayBlockUser(true)}>
                        <h2 className={styles.h2}>Block User</h2>
                        <form className={styles.containerInForm3} onSubmit={blockUser.handleSubmit(onSubmitBlockUserForm)}>
                            <div className={styles.inputDiv}>
                                <input className={styles.input} type="text" placeholder="" {...blockUser.register('id', {required: true})} />
                            </div>
                            <input className={styles.buttonSend} type="submit" value='Block'/>
                        </form>

                    </div>
                </> : <div></div>}
        </div>
    )
}

export default Channel;
