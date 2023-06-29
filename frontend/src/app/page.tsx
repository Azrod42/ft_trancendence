'use client'
import React, {useEffect} from 'react';
import styles from './page.module.css'
import styles2 from './globals.module.css'
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion'
import Image from "next/image";
import {getMyData} from "@/app/api/fetchData";

 
export default function Home() {
	//GET USER DATA FROM BACKEND
	const { push, prefetch } = useRouter();
	getMyData().then(res => {
		if (res !== undefined)
			push('/dashboard');
	});
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-
	//PRELOAD ALL HOME PAGES
	useEffect(() => {
		prefetch('/auth/login');
		prefetch('/auth/sign-up');
		prefetch('/dashboard');
	}, []);
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-
  return (
    <main className={styles2.main}>
			{/*<NavBar />*/}
			<div className={styles.wrapper}>
				<motion.div className={styles.content}
					initial={{y: -40}}
					animate={{y: 0}}
					>
					<Image src="/media/logo-transcendence.png" alt="profile-picture" width={628} height={134} priority={true}/>
					<div className={styles.containerLoginRegister}>
						<div className={styles.loginBtn} onClick={() => { push('/auth/login')}}>Login</div>
						<div className={styles.registerBtn} onClick={() => { push('/auth/sign-up')}}>Register</div>
					</div>
				</motion.div>
			</div>
    </main>
  )
}
