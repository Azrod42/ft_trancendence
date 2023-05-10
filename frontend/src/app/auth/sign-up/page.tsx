import React from 'react'
import styles from'./singup.module.css'

interface signUpProps {

}

const signUp: React.FC<signUpProps> = ({}) => {
	return(<div className={styles.maindiv}>
			<p className={styles.text}>Sign-up here</p>
		</div>
	)
}

export default signUp;