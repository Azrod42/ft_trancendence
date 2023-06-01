import React from 'react'
import styles from "./social.module.css"


interface SocialProps {
}

const Social: React.FC<SocialProps> = ({}) => {
	
  return (
	<div className={styles.container}>
		<h1>Social</h1>
	</div>
  )
}

export default Social;
