import React, { useEffect, useState } from 'react'
import styles from "./navbar.module.css"
import Link from 'next/link';
import { userData } from '@/app/dashboard/layout';
import { logout } from '@/app/auth/auth.api';
import { useMutation } from 'react-query';
import { useRouter } from 'next/navigation';



interface NavBarProps {

}

const NavBar: React.FC<NavBarProps> = ({}) => {
	const { push } = useRouter();

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
			<p className={styles.linktxt}>{userData.username} 1m26 et toutes ses dents</p>
		</div>
		<div className={styles.navRight}>
			<p className={styles.linktxt} onClick={onSubmit}>Logout</p>
		</div>
	</nav>
  )
}

export default NavBar;
