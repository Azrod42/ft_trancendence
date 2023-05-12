"use client"
import React, {useState, useEffect} from 'react';
import Link from 'next/link';
import styles from '../login/login.module.css';
import styles2 from'./singup.module.css';
import { motion } from "framer-motion";
import Image from 'next/image';
import logo_register from '/public/media/logo-register.png';
import { SubmitHandler, useForm } from 'react-hook-form';
import Joi from 'joi';
import { FormValuesRegister, register as regist } from '../auth.api'
import { useMutation } from 'react-query'




const schema = Joi.object ({
	email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'fr', 'dev'] } }),
	username: Joi.string()
		.alphanum()
		.min(3)
		.max(30)
		.required(),
	password: Joi.string()
		.pattern(new RegExp('^[a-zA-Z0-9]{5,30}$')),
	passwordRepeat: Joi.ref('password'),
})

  //ERROR_DIV_ANIMATION
  const variants = {
	open: {opacity: 1, y: "0"},
	closed: {opacity:0, y: "-30px"},
	translateUp: {marginTop: "-66px"},
	translateDown: {marginTop: "0px"}
  }

interface signUpProps {

}

const signUp: React.FC<signUpProps> = ({}) => {
	const popUpDelay = 3000;
	// console.log(window.location.href.split('/').pop());
	useEffect(() => {
		document.getElementById('authtype__left')?.classList.remove("divider__authtype--colorLight");
		document.getElementById('authtype__right')?.classList.remove("divider__authtype--colorDark");
		document.getElementById('authtype__left')?.classList.add("divider__authtype--colorDark");
		document.getElementById('authtype__right')?.classList.add("divider__authtype--colorLight");
	}, []);
	

	const [isDisplay, setDisplay] = useState(false);
	const { register, handleSubmit, formState: { errors } } = useForm<FormValuesRegister>();

	function toggleDisplayOn() {setDisplay((isDisplay) => isDisplay = true);}
	function toggleDisplayOff() {setDisplay((isDisplay) => isDisplay = false);}

	const {mutate: registerUser} = useMutation(regist, {
		onSuccess: () => {
			console.log("Register Done");
		},
		onError: (e: any) => {
			console.log(e);
		}
	});

	const onSubmit: SubmitHandler<FormValuesRegister> = data => {
		console.log(data);
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
			registerUser(data);
		}
	};

	const defaultValue= true;
	return(
		<motion.div className={styles.maindiv}
			initial={{y: "-40px"}}
			animate={{y: "0px"}}
		>
			<Image src={logo_register} alt="nintendo" width={85} height={85} priority={true}/>
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
		 		<label className={styles.labelText}>Email :</label>
				<input className={styles.inputText} autoComplete='no' value='default@email.com' type="text" {...register("email", {required: true})} />
			</div>
			<div className={styles.inpuetEl}>
		 		<label className={styles.labelText}>Username :</label>
				<input className={styles.inputText} autoComplete='no' value='XxAzrodxX' type="text" {...register("username", {required: true})} />
			</div>
			<div className={styles.inpuetEl}>
		 		<label className={styles.labelText}>Password :</label>
				<input className={styles.inputText} type="password" value='test1' {...register("password", {required: true})} />
			</div>
			<div className={styles.inpuetEl}>
		 		<label className={styles.labelText}>Reapeat-password :</label>
				<input className={styles.inputText} autoComplete='no' type="password" value='test1' {...register("passwordRepeat", {required: true})} />
			</div>

				<input className={styles.inputButton} type="submit" value="Register" />
    		</motion.form>
			<p className={styles.noAcc}>You already have an account ?</p>
			<Link className={styles.link} href="/auth/login">Login</Link>
		</motion.div>
	)
}

export default signUp;