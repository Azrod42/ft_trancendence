'use client'
import React, {useEffect, useState} from 'react';
import styles from './page.module.css'
import styles2 from './globals.module.css'
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion'
import Image from "next/image";
import {socket, WebsocketContext, WebSocketProvider} from "@/app/(common)/WebsocketContext";
import {WebSocket} from "@/app/(component)/WebSocket/WebSocket";
import {UserAuthResponse} from "@/app/auth/auth.api";
import {useQuery} from "react-query";
import {isUserLog} from "@/app/(common)/checkLog";

 
export default function Home() {

	//GET USER DATA FROM BACKEND AND STORE IN useState
	let [userData, setuserData] = useState<UserAuthResponse>();
	const { push, prefetch } = useRouter();
	const { isLoading, error, data, refetch } = useQuery('getUserInfo', () =>
		isUserLog().then(res => {
			if (res !== undefined)
				push('/dashboard');
			setuserData(res);
		}), { refetchInterval: 1000 * 5, refetchOnWindowFocus: false, staleTime: 5000 }
	);
	useEffect(() => {
		prefetch('/auth/login');
		prefetch('/auth/sign-up');
		prefetch('/dashboard');
	}, []);
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-
  return (
    <main className={styles2.main}>
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
