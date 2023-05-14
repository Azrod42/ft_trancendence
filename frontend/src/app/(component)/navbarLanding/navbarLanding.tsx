import {useState } from 'react'
import styles from "./navbar.module.css"
import Link from 'next/link';
import { set } from 'react-hook-form';


interface NavBarProps {

}

const NavBar: React.FC<NavBarProps> = ({}) => {
  return (
	  <nav className={styles.container}>
		<div className={styles.navLeft}>
			<Link className={styles.linkTxt} href='/'>Home</Link>
			<Link className={styles.linkTxt} href='/auth/login'>Login</Link>
			<p className={styles.linkTxt} id='username'></p>
		</div>
		<div className={styles.navRight}>
			<p className={styles.linkTxt}>lalalalala</p>
		</div>
	</nav>
  )
}

export default NavBar;
