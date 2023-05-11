"use client"
import React from 'react';
import styles from './login.module.css';
import { useForm, SubmitHandler } from 'react-hook-form';
import Image from 'next/image';
import pitch from '../../../../public/media/logo-login.png'
import Link from 'next/link';
import { sign } from 'crypto';


type FormValues = {
	username: string;
	password: string;
  };

interface LoginProps {

}

const Login: React.FC<LoginProps> = ({}) => {
	const { register, handleSubmit } = useForm<FormValues>();
	const onSubmit: SubmitHandler<FormValues> = data => (
		console.log(data)
	);
	return(
	<div className={styles.maindiv}>
		<Image src={pitch} alt="nintendo" width={95} height={66} priority={true}/>
		<form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
			<div className={styles.inpuetEl}>
		 		<label className={styles.labelText}>Nickname :</label>
    			<input className={styles.inputText} {...register("username")} />
			</div>
			<div className={styles.inpuetEl}>
				<label className={styles.labelText}>Password :</label>
				<input className={styles.inputText}type="password" {...register("password")} />
			</div>
    		<input className={styles.inputButton} type="submit" value="Connect"/>
   		</form>
		<p className={styles.noAcc}>You do not have an account ?</p>
		<Link className={styles.link} href="/auth/sign-up">Create an account</Link>
	</div>
	)
}

export default Login;

//frontend\src\app\auth\login\page.tsx