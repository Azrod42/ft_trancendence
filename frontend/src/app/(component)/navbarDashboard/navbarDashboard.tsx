import React, { useEffect, useState } from 'react'
import styles from "./navbarDashboard.module.css"
import {UserAuthResponse, logout, getUserInfo} from '@/app/auth/auth.api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {useQuery} from "react-query";
import Api from "@/app/api/api";



interface NavBarProps {

}

const NavBar: React.FC<NavBarProps> = ({}) => {
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-
	//GET USER DATA FROM BACKEND AND STORE IN useState
	let [userData, setuserData] = useState<UserAuthResponse>();
	const { push } = useRouter();
	Api.init();
	const { isLoading, error, data, refetch } = useQuery('getUserInfo', () =>
		getUserInfo().then(res => {
			if (res == undefined)
				push('/');
			setuserData(res);
		}), {refetchInterval: 1000 * 15, refetchOnWindowFocus: false}
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
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-
	//LOGOUT ON SUBIMIT HANDLE 
	function onSubmit() {
		logout();
		push('/');
	}
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-
	//REFRESH TOPBAR DATA eatch 30s
	// setInterval(refetch, 3000);
  return (
	<nav className={styles.container}>
		<div className={styles.navLeft}>
			<Link className={styles.linktxt} href="/dashboard/">Home</Link>
			<Link className={styles.linktxt} href="/dashboard/game">Game</Link>
			<Link className={styles.linktxt} href="/dashboard/social">Social</Link>
			<Link className={styles.linktxt} href="/dashboard/leaderboard">Leaderboard</Link>
		</div>
		<div className={styles.navRight}>
			<Link className={styles.linktxt} href="/dashboard/profile">{userData?.displayname}</Link>
			<p className={styles.linktxt} onClick={onSubmit}>Logout</p>
		</div>
	</nav>
  )
}

export default NavBar;
