import React, { useEffect, useState } from 'react'
import styles from "./navbar.module.css"
import Link from 'next/link';
import { userData } from '@/app/dashboard/layout';



interface NavBarProps {

}

const NavBar: React.FC<NavBarProps> = ({}) => {
	useEffect (() =>{
		console.log(userData);
	});

  return (
	<nav className={styles.container}>
		<p className={styles.linktxt}>{userData.username} 1m26 et toutes ses dents</p>
	</nav>
  )
}

export default NavBar;
