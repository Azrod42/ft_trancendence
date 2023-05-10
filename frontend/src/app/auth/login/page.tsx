import React from 'react'
import styles from './login.module.css'

interface LoginProps {

}

const Login: React.FC<LoginProps> = ({}) => {
	return(<div className={styles.maindiv}>
			<p className={styles.text}>Login here</p>
		</div>
	)
}

export default Login;