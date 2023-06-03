'use client'
import React from 'react'
import styles from './authtype.module.css'
import Image from "next/image";
import {useRouter} from "next/navigation";

interface AuthTypeProps {

}

const AuthType: React.FC<AuthTypeProps> = () => {
	const { push } = useRouter();

	return (
		  <div className={styles.container}>
			  <Image className={styles.logo} src="/media/logo-transcendence.png" alt="profile-picture" width={628} height={134} priority={true} onClick={() => (push('/'))}/>
			  <div className={styles.containerLoginRegister}>
				  <div className={styles.loginBtn} onClick={() => { push('/auth/login')}}>Login</div>
				  <div className={styles.registerBtn} onClick={() => { push('/auth/sign-up')}}>Register</div>
			  </div>
		  </div>
  )
}

export default AuthType;
