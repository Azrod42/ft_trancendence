'use client'
import React from 'react'
import styles from "./2fa.module.css"
import {SubmitHandler, useForm} from "react-hook-form";
import {activate2fa, FormOtp, FormOtpPost, login2fa, login2faNeeded} from "@/app/auth/auth.api";
import Api from "@/app/api/api";
import {usePathname, useRouter, useParams} from "next/navigation";


interface TowFaProps {
}

const TowFa: React.FC<TowFaProps> = ({}) => {
    Api.init()
    const uniqueIdentifier = useParams()['2fa'].slice(4);
    const { register, handleSubmit, formState: { errors } } = useForm<FormOtpPost>();
    const { push } = useRouter();


    login2faNeeded({hash: uniqueIdentifier}).then((res) => {
        if (!res?.data)
            push('/dashboard/')
    })
    const onSubmitForm: SubmitHandler<FormOtpPost> = data => {
        data.uniqueIdentifier = uniqueIdentifier;
        login2fa(data).then((rep) => {
            if (rep?.status == 201)
                push('/dashboard/');
        })
    }
    return (
        <div className={styles.container}>
            <h1>2fa</h1>
            <form onSubmit={handleSubmit(onSubmitForm)}>
                <input type="text" placeholder="XXXXXX" {...register("twoFactorAuthenticationCode", {})} />

                <input type="submit" />
            </form>
        </div>
    )
}

export default TowFa;
