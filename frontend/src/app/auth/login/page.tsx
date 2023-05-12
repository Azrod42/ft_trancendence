"use client"
import React, {useEffect, useState} from 'react';
import styles from './login.module.css';
import { useForm, SubmitHandler } from 'react-hook-form';
import Image from 'next/image';
import loginImage from '/public/media/logo-login.png'
import Link from 'next/link';
import * as Joi from 'joi';
import { motion } from "framer-motion"
import { useMutation } from 'react-query'
import Api from '@/app/api/api';
import { FormValues, login } from '../auth.api';

//JOI SCHEMA FOR PASSWORD VALIDATION
const schema = Joi.object ({
	username: Joi.string()
		.alphanum()
		.min(3)
		.max(30)
		.required(),
	password: Joi.string()
		.pattern(new RegExp('^[a-zA-Z0-9]{5,30}$')),
})
  
  //ERROR_DIV_ANIMATION
  const variants = {
	  open: {opacity: 1, y: "0"},
	  closed: {opacity:0, y: "-30px"},
	  translateUp: {marginTop: "-66px"},
	  translateDown: {marginTop: "0px"}
	}
	
//REACT FUNCTIONAL COMPONENT INTERFACE	
interface LoginProps {
}

const Login: React.FC<LoginProps> = ({}) => {
	const popUpDelay = 3000;
	Api.init()

	useEffect(() => {
		document.getElementById('authtype__left')?.classList.remove("divider__authtype--colorDark");
		document.getElementById('authtype__right')?.classList.remove("divider__authtype--colorLight");
		document.getElementById('authtype__left')?.classList.add("divider__authtype--colorLight");
		document.getElementById('authtype__right')?.classList.add("divider__authtype--colorDark");
	}, [])

	const { register, handleSubmit } = useForm<FormValues>();
	const [isDisplay, setDisplay] = useState(false);

	function toggleDisplayOn() {setDisplay((isDisplay) => isDisplay = true);}
	function toggleDisplayOff() {setDisplay((isDisplay) => isDisplay = false);}

	const loginMutation = useMutation(login, {
		onSuccess: () => {
			console.log("Login Done");
		},
		onError: (e: any) => {
			if ( e.response.status == 401) {
				toggleDisplayOn()
				let errorEl: HTMLElement | null = document.getElementById("error")
				let errorTypeEl: HTMLElement | null = document.getElementById("error-type")
				setTimeout(() => {
					if (errorTypeEl && errorEl){
						errorTypeEl.innerText = "";
						errorEl.innerText = "Sorry, the data you are using is invalid"
					}
					setTimeout(() => {
						if (errorEl)
							errorEl.innerText = "Incorrect format on"
					}, popUpDelay + 1000)
				}, 20);
				setTimeout(() => {
					toggleDisplayOff()
				}, popUpDelay);
			}
		}
	});

	const onSubmit: SubmitHandler<FormValues> = data => {
		const value = schema.validate(data);
		if (value.error){
			toggleDisplayOn();
			setTimeout(() => {
				let errorTypeEl: HTMLElement | null = document.getElementById("error-type")
				if (errorTypeEl)
					errorTypeEl.innerText = value.error.details['0'].context?.key!;
			}, 20);
			setTimeout(() => {
				toggleDisplayOff()
			}, popUpDelay);
		}else {
			toggleDisplayOff()
			loginMutation.mutate(data);
		}

	};
	return(
	<motion.div className={styles.maindiv}
		initial={{y: "-40px"}}
		animate={{y: "0px"}}
	>
		<Image src={loginImage} alt="nintendo" width={85} height={85} priority={true}/>
		<motion.div 
			initial={{opacity:0}}
			animate={isDisplay ? "open" : "closed"}
			variants={variants}
		>
			<div className={styles.errorMessage}>
				<span id="error">Incorrect format on </span><span id="error-type" ></span>
			</div>
		</motion.div>
		<motion.form className={styles.form} onSubmit={handleSubmit(onSubmit)}
			initial={{marginTop: "-66px"}}
			animate={isDisplay ? "translateDown" : "translateUp"}
			variants={variants}
		>
			<div className={styles.inpuetEl}>
		 		<label className={styles.labelText}>Username :</label>
    			<input className={styles.inputText} autoComplete='no' {...register("username")} />
			</div>
			<div className={styles.inpuetEl}>
				<label className={styles.labelText}>Password :</label>
				<input className={styles.inputText}type="password" {...register("password")} />
			</div>
    		<input className={styles.inputButton} type="submit" value="Connect"/>
   		</motion.form>
		<p className={styles.noAcc}>You do not have an account ?</p>
		<Link className={styles.link} href="/auth/sign-up">Create an account</Link>
	</motion.div>
	)
}

export default Login;

//frontend\src\app\auth\login\page.tsx


// Api.init();
// setIsApiReady(true);
// if (!isReady)
// 	return (<div>Loading ...</div>)
// const [isReady, setIsApiReady] = useState(false);
