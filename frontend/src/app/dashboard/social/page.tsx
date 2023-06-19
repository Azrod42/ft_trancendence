import React from 'react'
import styles from "./social.module.css"
import Layout from "./layout/SocialLayout"


interface SocialProps {
}

const Social: React.FC<SocialProps> = ({}) => {

  return (
	<Layout>
		<div className={styles.container}>
		</div>
	</Layout>
  )
}

export default Social;
