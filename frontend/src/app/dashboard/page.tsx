import React from 'react'
import styles from "./dashboard.module.css"
import Link from 'next/link';


interface DashboardProps {
}

const Dashboard: React.FC<DashboardProps> = ({}) => {
	
  return (
	<div className={styles.container}>
		<div className={styles.containerchild}>content</div>
		<div className={styles.containerchild}>content</div>
		<div className={styles.containerchild}>content</div>
		<div className={styles.containerchild}>content</div>
		<div className={styles.containerchild}>content</div>
	</div>
  )
}

export default Dashboard;
