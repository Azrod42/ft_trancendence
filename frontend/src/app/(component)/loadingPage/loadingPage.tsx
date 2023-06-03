import React from 'react'
import styles from "./loadingPage.module.css"



interface LoadingComponentProps {

}

const LoadingComponent: React.FC<LoadingComponentProps> = ({}) => {

  return (
	  <div className={styles.ldsdualring}></div>
  )
}

export default LoadingComponent;
