'use client'
import {useState} from 'react';
import styles from './page.module.css'
import { isUserLog } from './(common)/checkLog';
import NavBar from './(component)/navbarLanding/navbarLanding';
import { useRouter } from 'next/navigation';
import { UserAuthResponse } from './auth/auth.api';
import { motion } from 'framer-motion'

 
export default function Home() {
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	// IF USER IS CONNECTED REDIRECT TO DASHBOARD
	const [userDataIsSet, setUserDataIsSet] = useState<boolean>(false);
	const { push } = useRouter();

	useState(() => {
		if (!userDataIsSet){
		let userData: any = isUserLog();
		userData.then(function(data: UserAuthResponse | undefined) {
			if (data !== undefined){
				userData = data;
				setUserDataIsSet(true);
				setTimeout(() => { 
					push('/dashboard');
				}, 20);
			}
		})
		}else {
			push('/dashboard');
		}
	});
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

  return (
    <main>
			<NavBar />
			<div className={styles.wrapper}>
				<motion.div className={styles.content}
					initial={{y: -40}}
					animate={{y: 0}}
					transition={{delay: 1.5}}
					>
					<h1>trancendence</h1>
					<div className={styles.div42Login}>
						<a className={styles.name} target='blank' href="https://profile.intra.42.fr/users/tsorabel">tsorabel</a>
						<a className={styles.name} target='blank' href="https://profile.intra.42.fr/users/lfantine">lfantine</a>
						<a className={styles.name} target='blank' href="https://profile.intra.42.fr/users/alevasse">alevasse</a>
					</div>
				</motion.div>
				<div className={styles.backgroundDIV}>
					<iframe className={styles.sketchfabembedwrapper} title="Ping Pong - (Photosensitivity)" frameBorder="0" allowFullScreen allow="autoplay; fullscreen; xr-spatial-tracking"  src="https://sketchfab.com/models/2ffc655793e44e2f962e8a12b9c7757c/embed?autostart=1&camera=0&ui_animations=0&ui_infos=0&ui_stop=0&ui_inspector=0&ui_watermark_link=0&ui_watermark=0&ui_hint=0&ui_ar=0&ui_help=0&ui_settings=0&preload=1&transparent=1&ui_vr=0&ui_fullscreen=0&ui_annotations=0"> </iframe>
					</div>
			</div>
    </main>
  )
}
