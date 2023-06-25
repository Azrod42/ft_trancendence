"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {getUserInfo, UserAuthResponse} from '../auth/auth.api';
import { isUserLog } from '../(common)/checkLog';
import NavBar from '../(component)/navbarDashboard/navbarDashboard';
import styles from './dashboard.module.css'
import {useQuery} from "react-query";

export default function RootLayout({children,}: {children: React.ReactNode}) {
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
