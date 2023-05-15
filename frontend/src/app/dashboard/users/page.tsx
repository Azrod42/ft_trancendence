import React, { useEffect, useState } from 'react'
import styles from "./users.module.css"


interface UserProps {
}

const User: React.FC<UserProps> = ({}) => {
	
  return (
	<div className={styles.container}>
		<h1>User</h1>
	</div>
  )
}

export default User;
