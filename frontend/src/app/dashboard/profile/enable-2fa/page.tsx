'use client'
import React, {useRef, useState} from 'react'
import styles from "./enable-2fa.module.css"
import {activate2fa, FormOtp, generateQr, getUserInfo} from "@/app/auth/auth.api";
import {SubmitHandler, useForm} from "react-hook-form";
import {useRouter} from "next/navigation";


interface Enable2faProps {
}

const Enable2fa: React.FC<Enable2faProps> = ({}) => {
    const { register, handleSubmit } = useForm<FormOtp>();
    const [getQR, setGetQR] = useState<boolean>(false)
    const { push } = useRouter();
    const refQr: React.MutableRefObject<any> | undefined = useRef();
    if (!getQR) {
        setGetQR(true);
        getUserInfo().then((res) => {
            if (res?.is2FOn == true)
                push('/dashboard/profile');
            else {
                generateQr().then((res) => {
                    const htmlToPush = `
            <Image src="${res?.data}" alt="2faQrCode" width={256} height={256} priority={true}/>
            `
                    if (refQr.current)
                        refQr.current.innerHTML = htmlToPush;
                })
            }
        })
    }
    const onSubmitForm: SubmitHandler<FormOtp> = data => {
        activate2fa(data).then((rep) => {
            if (rep?.status == 201)
                push('/dashboard/profile');
        })
    }
    return (
        <div className={styles.container}>
            <div ref={refQr}></div>
            <p>Scan the QR Code with Google Authenticator and enter the code to confirm</p>
            <form onSubmit={handleSubmit(onSubmitForm)}>
                <input type="text" placeholder="XXXXXX" {...register("twoFactorAuthenticationCode", {})} />

                <input type="submit" />
            </form>
        </div>
    )
}

export default Enable2fa;
