"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {getUserInfo, UserAuthResponse} from '../auth/auth.api';
import { isUserLog } from '../(common)/checkLog';
import NavBar from '../(component)/navbarDashboard/navbarDashboard';
import { createContext } from 'vm';
import styles from './dashboard.module.css'
import { Suspense } from 'react';
import LoadinPage from '../(component)/loadingPage/loadingPage';
import { stringify } from 'querystring';
import { getUserData } from '../(common)/getUserData';
import {useQuery} from "react-query";

export default function RootLayout({children,}: {children: React.ReactNode}) {

	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	// IF USER IS CONNECTED REDIRECT TO DASHBOARD
	// const [userDataIsSet, setUserDataIsSet] = useState<boolean>(false);
	// const { push } = useRouter();
	// let userData = {};

	// useEffect(() => {
	// 	if (!userDataIsSet){
		// 		const userDataI = isUserLog();
	// 		userDataI.then(function(data: UserAuthResponse | undefined) {
	// 			if (data === undefined){
	// 				push('/');
	// 			}
	// 			else{
	// 				localStorage.setItem('user', JSON.stringify(data));
	// 				userData = getUserData();
	// 				setUserDataIsSet(true);
	// 			}
	// 		});
	// 	};
	// }, []);
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-
	//GET USER DATA FROM BACKEND AND STORE IN useState
	let [userData, setuserData] = useState<UserAuthResponse>();
	const { push } = useRouter();
	const { isLoading, error, data, refetch } = useQuery('getUserInfo', () =>
		isUserLog().then(res => {
			if (res == undefined)
				push('/');
			setuserData(res);
		}), { refetchInterval: 1000 * 60 * 2, staleTime: 5000}
	);
	useEffect(() => {
		if (userData == undefined) {
			refetch()
		}
	})
	useEffect(() => {
		//for setup action on userData refresh ?
	},[userData])
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-

	return (
		<main className={styles.layoutDiv}>
			<NavBar />
			{children}
		</main>
	)

}