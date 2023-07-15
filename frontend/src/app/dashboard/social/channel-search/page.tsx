'use client'
import React, {useEffect, useState} from 'react';
import styles from "./search.module.css";
import {getChannelWithoutUser, joinChannel} from "@/app/dashboard/social/social.api";
import {useRouter} from "next/navigation";
import {SubmitHandler, useForm} from "react-hook-form";
import {FormValueJoinChannel} from "@/app/auth/auth.api";
import ErrorNotification from "@/app/(component)/errorNotification/errorNotification";

interface ChannelSearchProps {
}

const ChannelHome: React.FC<ChannelSearchProps> = ({}) => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormValueJoinChannel>();
    const [join, setJoin] = useState<string>('')
    const [chanData, setChanData] = useState<any>();
    const [displayPw, setDisplayPw] = useState<boolean>(false);
    const {push} = useRouter();

    //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    //HANDLE ERROR NOTIFICATION
    const [error, setError] = useState<boolean>(false);
    const [headerError  , setHeaderError] = useState<string>('');
    const [errorMsg, setErrorMsg] = useState<string>('');
    //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=


    useEffect(() => {
        getChannelWithoutUser().then((res) => {
            if (res?.status == true)
                setChanData(JSON.parse(JSON.stringify(res.data)))
        })
    },[]);

    useEffect(() => {
        if (!chanData)
            return;
        let htmlDiv = `
                <style>
                    .item{
                    display: flex;
                    flex-direction: row;
                    gap: 100px;
                    justify-content: space-between;
                    align-items: center;
                    border: 1px solid white;
                    width: 600px;
                    padding-left: 10px;
                    padding-right: 10px;
                    border-radius: 5px;
                    margin-bottom: 10px;
                }
                    .styleStatus {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    width: 40px;
                    }
                    .button {
                        background-color: #2C0EB0;
                        width: 60px;
                        height: 30px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 5px;
                    }
                    .p{
                        width: 100px;
                    }
                </style>`;
        for (let i = 0; chanData[i]; i++) {
            htmlDiv += `
                <div class='item' id='${chanData[i].id}'>
                    <p class='p'>${chanData[i].channelname}</p>`
                    if (chanData[i].type == 1)
                        htmlDiv += "<p>Public</p>"
                    else
                        htmlDiv += "<div class='styleStatus'><Image src='/media/lock-icon.png' alt='lock-icon' with={12} height={12} /><p>Protected</p></div>"
            htmlDiv +=
            `    <p>${chanData[i].channelusers} users</p>
                 <div class="button" id='${chanData[i].id}'>JOIN</div>
             </div>
            `
        }
        const elContainer = document.getElementById('containerItem')
        if (elContainer)
            elContainer.innerHTML = htmlDiv;
        for (let i = 0; chanData[i]; i++) {
            let mySelectedElement = document.getElementById(chanData[i].id);
            mySelectedElement?.addEventListener("click",  function getHtml(){
                setJoin(chanData[i].id);
                if (chanData[i].type == 1) {
                    onSubmitJoinChannel({id: chanData[i].id, password: 'undef'});
                }
                else
                    setDisplayPw(true);
            })
        }

    },[chanData]);

    const onSubmitJoinChannel: SubmitHandler<FormValueJoinChannel> = (data) => {
        setDisplayPw(false);
        const joinChanData : FormValueJoinChannel = {
            id: join,
            password: data.password,
        }
        if (data.id)
            joinChanData.id = data.id;
        joinChannel(joinChanData).then((res) => {
            if (res.status == false){
                setHeaderError('Error :')
                setErrorMsg(res.error);
                setError(true);
                setTimeout(() => {
                    setError(false);
                }, 3000);
            }
            else {
                push(`/dashboard/social/channel/${res.data}`);
            }
        })
    }
    return (
        <div className={styles.topContainer}>
            <div className={styles.container}>
            <div id='containerItem'></div>
                {error ? <ErrorNotification headerText={headerError} error={errorMsg} /> : <div></div>}
                {displayPw ?
                <>
                    <div className={styles.layer} onClick={() => setDisplayPw(false)}></div>
                    <div className={styles.getPassword} onClick={() => setDisplayPw(true)}>
                        <h2 className={styles.h2}>Channel Password</h2>
                        <form className={styles.containerInForm} onSubmit={handleSubmit(onSubmitJoinChannel)}>
                            <div className={styles.inputDiv}>
                                <input className={styles.input} type="password" placeholder="" {...register('password', {required: true})} />
                            </div>
                            <input className={styles.buttonSend} type="submit" value='Join'/>
                        </form>
                    </div>
                </> : <div></div>}
            </div>
        </div>
    )
}

export default ChannelHome;