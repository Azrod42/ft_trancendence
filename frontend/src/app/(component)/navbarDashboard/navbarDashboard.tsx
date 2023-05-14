import React, { useEffect, useState } from 'react'
import styles from "./navbarDashboard.module.css"
import { UserAuthResponse, logout } from '@/app/auth/auth.api';
import { useRouter } from 'next/navigation';



interface NavBarProps {

}

const NavBar: React.FC<NavBarProps> = ({}) => {
	const { push } = useRouter();
	let [userData, setuserData] = useState<UserAuthResponse>();
	const [isUserData, setIsUserData] = useState<boolean>(false);
	useEffect(() => {
		if (!isUserData){
			setuserData(JSON.parse(localStorage.getItem('user')!));
			setIsUserData(true);
		}
	})


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
			<p className={styles.linktxt}>{userData?.username} 1m26 et toutes ses dents</p>
		</div>
		<div className={styles.navRight}>
			<p className={styles.linktxt} onClick={onSubmit}>Logout</p>
		</div>
	</nav>
  )
}

export default NavBar;
