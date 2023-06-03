import React, { useEffect, useState } from 'react'
import styles from "./navbarDashboard.module.css"
import {UserAuthResponse, logout, getUserInfo, getProfilePicture} from '@/app/auth/auth.api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {useQuery} from "react-query";
import Api from "@/app/api/api";
import Image from "next/image";
import { motion } from "framer-motion"



interface NavBarProps {

}

const NavBar: React.FC<NavBarProps> = ({}) => {
	Api.init();
	//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
	//MENU OPEN CLOSE
	const [open, setOpen] = useState<boolean>(false);
	function oncMenu(){
		setOpen(!open)
	};
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	//GET PROFILE IMAGE
	const [profilePicture, setProfilePicture] = useState<string>('');
	const [ppGet, setPpGet] = useState<boolean>(false);
	useEffect(() => {
	if (!ppGet) {
		getProfilePicture().then(
			res => {
				setProfilePicture('data:image/png;base64, ' + res?.data);
			}
		), {refetchInterval: 1000 * 1};
		setPpGet(true);
	}},[])
	useEffect(() => {
		// console.log(profilePicture);
		// if (open)
		// 	setPpGet(false);
	}, [open])
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-

	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-
	//GET USER DATA FROM BACKEND AND STORE IN useState
	let [userData, setuserData] = useState<UserAuthResponse>();
	const { push } = useRouter();
	const { isLoading, error, data, refetch } = useQuery('getUserInfo', () =>
		getUserInfo().then(res => {
			if (res == undefined)
				push('/');
			setuserData(res);
		}), {refetchInterval: 1000 * 60 * 2, refetchOnWindowFocus: false}
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
		oncMenu();
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
			{/*<Link className={styles.linktxt} href="/dashboard/users">users</Link>*/}

		</div>
		<div className={styles.navRight}>
			<p className={styles.displaynametxt}>{userData?.displayname}</p>
			{profilePicture && (<Image className={styles.profilePicture} src={!ppGet ? "/media/logo-login.png" : profilePicture} alt="profile-picture" width={64} height={64} priority={true} onClick={oncMenu}/>)}
			{open && <motion.div className={styles.menu}
								 initial={{opacity: 0}}
								 animate={{opacity: 1}}
								 transition={{duration: 0.4}}
					>
				<Link className={styles.linktxt} href="/dashboard/profile" onClick={oncMenu}>Profile</Link>
				<p className={styles.linktxt} onClick={onSubmit}>Logout</p>
			</motion.div>}
		</div>
	</nav>
  )
}

export default NavBar;
