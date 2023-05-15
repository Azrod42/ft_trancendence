import React, { useEffect, useState } from 'react'
import styles from "./navbarDashboard.module.css"
import { UserAuthResponse, logout } from '@/app/auth/auth.api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';



interface NavBarProps {

}

const NavBar: React.FC<NavBarProps> = ({}) => {
	const { push } = useRouter();
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-
	//GET USER DATA FROM LOCAL STORAGE
	let [userData, setuserData] = useState<UserAuthResponse>();
	const [isUserData, setIsUserData] = useState<boolean>(false);
	useEffect(() => {
		if (!isUserData){
			setuserData(JSON.parse(localStorage.getItem('user')!));
			setIsUserData(true);
		}
	})
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-

	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-
	//LOGOUT ON SUBIMIT HANDLE 
	function onSubmit() {
		logout();
		push('/');
	}
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-
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
