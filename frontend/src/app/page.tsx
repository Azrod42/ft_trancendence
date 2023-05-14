'use client'
import {useState} from 'react';
import { createContext } from 'vm';
import styles from './page.module.css'
import { isPromise, isUserLog } from './(common)/checkLog';
import NavBar from './(component)/navbarLanding/navbarLanding';
import { useRouter } from 'next/navigation';
import { UserAuthResponse } from './auth/auth.api';
import Home3D from './(component)/homePage3D/home3dAsset';


export let userData2 = createContext();

export default function Home() {
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	// IF USER IS CONNECTED REDIRECT TO DASHBOARD
	const [userDataIsSet, setUserDataIsSet] = useState<boolean>(false);
	const { push } = useRouter();

	useState(() => {
		if (!userDataIsSet){
		userData2 = isUserLog();
		userData2.then(function(data: UserAuthResponse | undefined) {
			if (data !== undefined){
				userData2 = data;
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
				<div className={styles.content}>
					<p>Welcome to ft_trancendence</p>
					<p>by</p>
					<p className={styles.name}>tsorabel lfantine alevasse</p>
				</div>
				<div className={styles.backgroundDIV}>
					<Home3D />
				</div>
			</div>
    </main>
  )
}
