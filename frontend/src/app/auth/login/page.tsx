"use client"
import React, {useState} from 'react';
import styles from './login.module.css';
import { useForm, SubmitHandler } from 'react-hook-form';
import Image from 'next/image';
import pitch from '../../../../public/media/logo-login.png'
import Link from 'next/link';
import { sign } from 'crypto';
import * as Joi from 'joi';


const schema = Joi.object ({
	username: Joi.string()
		.alphanum()
		.min(3)
		.max(30)
		.required(),
	password: Joi.string()
		.pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
})

type FormValues = {
	username: string;
	password: string;
  };

interface LoginProps {
}



const Login: React.FC<LoginProps> = ({}) => {
	const { register, handleSubmit } = useForm<FormValues>();
	const [isDisplay, setDisplay] = useState(false);

	function toggleDisplayOn() {setDisplay((isDisplay) => isDisplay = true);}
	function toggleDisplayOff() {setDisplay((isDisplay) => isDisplay = false);}


	const onSubmit: SubmitHandler<FormValues> = data => {
		const value = schema.validate(data);
		if (value.error){
			toggleDisplayOn();
			setTimeout(() => {
				let errorTypeEl: HTMLElement | null = document.getElementById("error-type")
				if (errorTypeEl)
					errorTypeEl.innerText = value.error.details['0'].context?.key!;
			}, 20);
		}else {
			toggleDisplayOff()
		}

	};
	return(
	<div className={styles.maindiv}>
		<Image src={pitch} alt="nintendo" width={95} height={66} priority={true}/>
		{isDisplay &&
		<div className={styles.errorMessage}>
			<span>Incorrect format on </span><span id="error-type"></span>
		</div>
		}
		<form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
			<div className={styles.inpuetEl}>
		 		<label className={styles.labelText}>Username :</label>
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