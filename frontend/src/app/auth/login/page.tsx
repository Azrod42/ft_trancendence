"use client"
import React, {useState} from 'react';
import styles from './login.module.css';
import { useForm, SubmitHandler } from 'react-hook-form';
import Image from 'next/image';
import pitch from '../../../../public/media/logo-login.png'
import Link from 'next/link';
import * as Joi from 'joi';
import { motion, AnimatePresence } from "framer-motion"

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

//INPUT ASK IN FORM
type FormValues = {
	username: string;
	password: string;
  };


  
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
			console.log(data)
		}

	};
	return(
	<div className={styles.maindiv}>
		<Image src={pitch} alt="nintendo" width={95} height={66} priority={true}/>
		<motion.div 
			initial={{opacity:0}}
			animate={isDisplay ? "open" : "closed"}
			variants={variants}
		>
			<div className={styles.errorMessage}>
				<span>Incorrect format on </span><span>password</span>
			</div>
		</motion.div>
		<motion.form className={styles.form} onSubmit={handleSubmit(onSubmit)}
			initial={{marginTop: "-66px"}}
			animate={isDisplay ? "translateDown" : "translateUp"}
			variants={variants}
		>
			<div className={styles.inpuetEl}>
		 		<label className={styles.labelText}>Username :</label>
    			<input className={styles.inputText} {...register("username")} />
			</div>
			<div className={styles.inpuetEl}>
				<label className={styles.labelText}>Password :</label>
				<input className={styles.inputText}type="password" {...register("password")} />
			</div>
    		<input className={styles.inputButton} type="submit" value="Connect"/>
   		</motion.form>
		<p className={styles.noAcc}>You do not have an account ?</p>
		<Link className={styles.link} href="/auth/sign-up">Create an account</Link>
	</div>
	)
}

export default Login;

//frontend\src\app\auth\login\page.tsx