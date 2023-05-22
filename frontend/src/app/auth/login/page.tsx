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
import { FormValues, UserAuthResponse, login } from '../auth.api';
import { useRouter } from 'next/navigation';
import { isUserLog } from '@/app/(common)/checkLog';

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
	Api.init() //mandatory to do api call to backend

	//FORM DATA HANDLE
	const { register, handleSubmit } = useForm<FormValues>();
	
	//ERROR DIV DISPLAY
	const [isDisplay, setDisplay] = useState(false);
	function toggleDisplayOn() {setDisplay((isDisplay) => isDisplay = true);}
	function toggleDisplayOff() {setDisplay((isDisplay) => isDisplay = false);}
	
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-
	//CHECK IF USER IS LOG (REDIRECT DASHBOARD) 
	const { push } = useRouter();
	useEffect(() => {
		const data = isUserLog();
		data.then(function(data: UserAuthResponse | undefined) {
			if (data !== undefined){
				push('/dashboard');
			}
		})
	}), [];
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-

	
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-
	//CHANGE BACKGOUND LOGIN/SIGN-UP
	useEffect(() => {
		document.getElementById('authtype__left')?.classList.remove("divider__authtype--colorDark");
		document.getElementById('authtype__right')?.classList.remove("divider__authtype--colorLight");
		document.getElementById('authtype__left')?.classList.add("divider__authtype--colorLight");
		document.getElementById('authtype__right')?.classList.add("divider__authtype--colorDark");
	}, [])
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-

	
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-
	//LOGIN MUTATION CALL BY onsubmit to resolve api call login
	const loginMutation = useMutation(login, {
		onSuccess: (user: any) => {
			if (user !== undefined) {
			let errorEl: HTMLElement | null = document.getElementById("error")

			toggleDisplayOn()
			document.getElementById('alert-box')?.setAttribute("style", "background-color: green;");
			if (errorEl)
				errorEl.innerText = `Wellcome ${user.username}`;
			setTimeout(() => {
				toggleDisplayOff()
				// push('/');
				document.getElementById('alert-box')?.setAttribute("style", "background-color: rgb(153, 14, 14);");
			}, popUpDelay / 1.5);
		} else { //HANDLE API 401 error
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
		},
		onError: (e: any) => {
			 console.log("Login error", e);
		}
	});
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-


	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-
	//FORM ON SUBIMIT HANDLE
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
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-


	};
	return(
	<motion.div className={styles.maindiv}
		initial={{opacity: 0}}
		animate={{opacity: 1}}
		transition={{duration: 0.6}}
	>
		<Image src={loginImage} alt="nintendo" width={85} height={85} priority={true}/>
		<motion.div 
			initial={{opacity:0}}
			animate={isDisplay ? "open" : "closed"}
			variants={variants}
		>
			<div className={styles.errorMessage} id="alert-box">
				<span id="error">Incorrect format on </span><span id="error-type" ></span>
			</div>
		</motion.div>
		<motion.form className={styles.form} name="login" onSubmit={handleSubmit(onSubmit)}
			initial={{marginTop: "-66px"}}
			animate={isDisplay ? "translateDown" : "translateUp"}
			variants={variants}
		>
			<div className={styles.inpuetEl}>
		 		<label className={styles.labelText}>Username :
    				<input className={styles.inputText} autoComplete='no' {...register("username")} />
				</label>
			</div>
			<div className={styles.inpuetEl}>
				<label className={styles.labelText}>Password :
					<input className={styles.inputText}type="password" {...register("password")} />
				</label>
			</div>
    		<input className={styles.inputButton} type="submit" value="Connect"/>
   		</motion.form>
		<p className={styles.noAcc}>You do not have an account ?</p>
		<Link className={styles.link} href="/auth/sign-up">Create an account</Link>
	</motion.div>
	)
}

export default Login;
