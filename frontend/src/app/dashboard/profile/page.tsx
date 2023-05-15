import React, { useEffect, useState } from 'react'
import styles from "./profile.module.css"


interface ProfileProps {
}

const Profile: React.FC<ProfileProps> = ({}) => {
	
  return (
	<div className={styles.container}>
		<h1>Profile</h1>
	</div>
  )
}

export default Profile;