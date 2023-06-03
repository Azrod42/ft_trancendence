'use client'
import React, {useEffect, useState} from 'react';
import styles from './page.module.css'
import styles2 from './globals.module.css'


import { isUserLog } from './(common)/checkLog';
import { useRouter } from 'next/navigation';
import { UserAuthResponse } from './auth/auth.api';
import { motion } from 'framer-motion'
import {useQuery} from "react-query";
import Image from "next/image";

 
export default function Home() {
	//GET USER DATA FROM BACKEND AND STORE IN useState
	let [userData, setuserData] = useState<UserAuthResponse>();
	const { push } = useRouter();
	const { isLoading, error, data, refetch } = useQuery('getUserInfo', () =>
		isUserLog().then(res => {
			if (res !== undefined)
				push('/dashboard');
			setuserData(res);
		}), { refetchInterval: 1000 * 5, refetchOnWindowFocus: false, staleTime: 5000 }
	);
	useEffect(() => {
		//for setup action on userData refresh ?
	},[userData])
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
					{/*<div className={styles.div42Login}>*/}
					{/*	<a className={styles.name} target='blank' href="https://profile.intra.42.fr/users/tsorabel">tsorabel</a>*/}
					{/*	<a className={styles.name} target='blank' href="https://profile.intra.42.fr/users/alevasse">alevasse</a>*/}
					{/*	<a className={styles.name} target='blank' href="https://profile.intra.42.fr/users/rthomas">rthomas</a>*/}
					{/*</div>*/}
					<div className={styles.containerLoginRegister}>
						<div className={styles.loginBtn} onClick={() => { push('/auth/login')}}>Login</div>
						<div className={styles.registerBtn} onClick={() => { push('/auth/sign-up')}}>Register</div>
					</div>
				</motion.div>
				{/*<div className={styles.backgroundDIV}>*/}
				{/*	/!*<iframe className={styles.sketchfabembedwrapper} title="Ping Pong - (Photosensitivity)" frameBorder="0" allowFullScreen allow="autoplay; fullscreen; xr-spatial-tracking"  src="https://sketchfab.com/models/2ffc655793e44e2f962e8a12b9c7757c/embed?autostart=1&camera=0&ui_animations=0&ui_infos=0&ui_stop=0&ui_inspector=0&ui_watermark_link=0&ui_watermark=0&ui_hint=0&ui_ar=0&ui_help=0&ui_settings=0&preload=1&transparent=1&ui_vr=0&ui_fullscreen=0&ui_annotations=0"> </iframe>*!/*/}
				{/*</div>*/}
			</div>
    </main>
  )
}
