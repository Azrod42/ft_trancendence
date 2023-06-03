'use client'
import React, {useState} from 'react'
import styles from "./2fa.module.css"
import {SubmitHandler, useForm} from "react-hook-form";
import { FormOtpPost, login2fa, login2faNeeded} from "@/app/auth/auth.api";
import Api from "@/app/api/api";
import {useRouter, useParams} from "next/navigation";
import LoadingComponent from "@/app/(component)/loadingPage/loadingPage";


interface TowFaProps {
}

const TowFa: React.FC<TowFaProps> = ({}) => {
    Api.init()
    const uniqueIdentifier = useParams()['2fa'].slice(4);
    const { register, handleSubmit, formState: { errors } } = useForm<FormOtpPost>();
    const { push } = useRouter();
    const [redirect, setRedirect] = useState<boolean>(false)


    login2faNeeded({hash: uniqueIdentifier}).then((res) => {
        if (!res?.data)
            push('/dashboard/')
        else
            setRedirect(true);
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
            {!redirect ?
                <LoadingComponent />
                :
                <form onSubmit={handleSubmit(onSubmitForm)} className={styles.form}>
                <div className={styles.inpuetEl}>
                    <span className={styles.txt}>2FA code</span>
                    <label className={styles.labelText}>
                        <input className={styles.inputText} type="text"
                               placeholder="XXXXXX" {...register("twoFactorAuthenticationCode", {})} />
                    </label>
                    <input type="submit" className={styles.inputButton}/>
                </div>

            </form>
            }
        </div>
    )
}

export default TowFa;
