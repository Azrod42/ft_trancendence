"use client"
import React from 'react'
import styles from'./singup.module.css'

interface signUpProps {

}

const signUp: React.FC<signUpProps> = ({}) => {
	// console.log(window.location.href.split('/').pop());
	if (window.location.href.split('/').pop() == "login"){
		document.getElementById('authtype__left')?.classList.remove("divider__authtype--colorLight");
		document.getElementById('authtype__right')?.classList.remove("divider__authtype--colorDark");
		document.getElementById('authtype__left')?.classList.add("divider__authtype--colorDark");
		document.getElementById('authtype__right')?.classList.add("divider__authtype--colorLight");
	}

	return(<div className={styles.maindiv}>
			<p className={styles.text}>Sign-up here</p>
		</div>
	)
}

export default signUp;