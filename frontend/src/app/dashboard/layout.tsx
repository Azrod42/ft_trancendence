"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserAuthResponse } from '../auth/auth.api';
import { isUserLog } from '../(common)/checkLog';
import NavBar from '../(component)/navbarDashboard/navbarDashboard';
import { createContext } from 'vm';
import styles from './dashboard.module.css'
import { Suspense } from 'react';
import LoadinPage from '../(component)/loadingPage/loadingPage';


export let userData = createContext();


export default function RootLayout({children,}: {children: React.ReactNode}) {

	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	// IF USER IS CONNECTED REDIRECT TO DASHBOARD
	const [userDataIsSet, setUserDataIsSet] = useState<boolean>(false);
	const { push } = useRouter();

	useEffect(() => {
		if (!userDataIsSet){
			userData = isUserLog();
			userData.then(function(data: UserAuthResponse | undefined) {
				if (data === undefined){
					push('/');
				}
				else{
					userData = data;
					setUserDataIsSet(true);
				}
			});
		};
	}, []);
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

	return (
		<main className={styles.layoutDiv}>
			<NavBar />
			{children}
		</main>
	)

}