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
import { FormValuesRegister, UserAuthResponse, register as regist } from '../auth.api'
import { useMutation } from 'react-query'
import Api from '@/app/api/api';
import { useRouter } from 'next/navigation';
import { isUserLog } from '@/app/(common)/checkLog';


//JOI SCHEMA FOR PASSWORD VALIDATION
const schema = Joi.object ({
	email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'fr', 'dev'] } }),
	username: Joi.string()
		.alphanum()
		.min(3)
		.max(30)
		.required(),
	password: Joi.string()
		.pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')),
	passwordRepeat: Joi.ref('password'),
})

//ERROR_DIV_ANIMATION
  const variants = {
	open: {opacity: 1, y: "0"},
	closed: {opacity:0, y: "-30px"},
	translateUp: {marginTop: "-66px"},
	translateDown: {marginTop: "0px"}
  }

//REACT FUNCTIONAL COMPONENT INTERFACE	
interface signUpProps {
}

const useSignUp: React.FC<signUpProps> = ({}) => {
	const popUpDelay = 3000;
	Api.init(); //mandatory to do api call to backend

	//FORM DATA HANDLE
	const Register = useForm<FormValuesRegister>();
	
	//ERROR DIV DISPLAY
	const [isDisplay, setDisplay] = useState(false);
	function toggleDisplayOn() {setDisplay((isDisplay) => isDisplay = true);}
	function toggleDisplayOff() {setDisplay((isDisplay) => isDisplay = false);}


	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-
	//CHECK IF USER IS LOG (REDIRECT DASHBOARD) 
	const Move = useRouter();
	useEffect(() => {
		const data = isUserLog();
		data.then(function(data: UserAuthResponse | undefined) {
			if (data !== undefined){
				Move.push('/dashboard');
			}
		})
	}, [])
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-

	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-
	//CHANGE BACKGOUND LOGIN/SIGN-UP
	useEffect(() => {
		document.getElementById('authtype__left')?.classList.remove("divider__authtype--colorLight");
		document.getElementById('authtype__right')?.classList.remove("divider__authtype--colorDark");
		document.getElementById('authtype__left')?.classList.add("divider__authtype--colorDark");
		document.getElementById('authtype__right')?.classList.add("divider__authtype--colorLight");
	}, []);
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-


	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-
	//LOGIN MUTATION CALL BY onsubmit to resolve api call register
	const {mutate: registerUser} = useMutation(regist, {
		onSuccess: () => {
			Move.push('/auth/login');
		},
		onError: (e: any) => {
			if (e.response.status === 400){
				toggleDisplayOn()
				let errorEl: HTMLElement | null = document.getElementById("error")
				let errorTypeEl: HTMLElement | null = document.getElementById("error-type")
				setTimeout(() => {
					if (errorTypeEl && errorEl){
						errorTypeEl.innerText = "";
						errorEl.innerText = e.response.data.message;
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
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-


	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-
	//FORM ON SUBIMIT HANDLE
	const onSubmit: SubmitHandler<FormValuesRegister> = data => {
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
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-
	return(
		<motion.div className={styles.maindiv}
			initial={{opacity: 0}}
			animate={{opacity: 1}}
			transition={{duration: 0.6}}
		
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
			<motion.form className={styles.form} name="register" onSubmit={Register.handleSubmit(onSubmit)}
				initial={{marginTop: "-66px"}}
				animate={isDisplay ? "translateDown" : "translateUp"}
				variants={variants}
			>
			<div className={styles.inpuetEl}>
		 		<label className={styles.labelText}>Email :
					<input className={styles.inputText} autoComplete='no' value='default@email.com' type="text" {...Register.register("email", {required: true})} />
				</label>
			</div>
			<div className={styles.inpuetEl}>
		 		<label className={styles.labelText}>Username :
					<input className={styles.inputText} autoComplete='no' type="text" {...Register.register("username", {required: true})} />
				</label>
			</div>
			<div className={styles.inpuetEl}>
		 		<label className={styles.labelText}>Password :
					<input className={styles.inputText} type="password" {...Register.register("password", {required: true})} />
				</label>
			</div>
			<div className={styles.inpuetEl}>
		 		<label className={styles.labelText}>Reapeat-password :
					<input className={styles.inputText} autoComplete='no' type="password" {...Register.register("passwordRepeat", {required: true})} />
				</label>
			</div>

				<input className={styles.inputButton} type="submit" />
    		</motion.form>
			<p className={styles.noAcc}>You already have an account ?</p>
			<Link className={styles.link} href="/auth/login">Login</Link>
		</motion.div>
	)
}

export default useSignUp;