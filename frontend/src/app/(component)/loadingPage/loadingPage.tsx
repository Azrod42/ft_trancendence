import React, { useEffect, useState } from 'react'
import styles from "./loadingPage.module.css"



interface LoadinPageProps {

}

const LoadinPage: React.FC<LoadinPageProps> = ({}) => {

  return (
	<div className={styles.loadingDiv} >
		Loading ...
	</div>
  )
}

export default LoadinPage;
