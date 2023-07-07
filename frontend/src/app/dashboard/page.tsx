import React from 'react'
import styles from "./dashboard.module.css"
import Link from 'next/link';
import {WebSocket} from "@/app/(component)/WebSocket/WebSocket";
import ConnectedUser from "@/app/(component)/connectedUser/connectedUser";
import DashboardUser from "@/app/(component)/dashboardUser/dashboardUser";


interface DashboardProps {
}

const Dashboard: React.FC<DashboardProps> = ({}) => {
	
  return (
	<div className={styles.container}>
		<div className={styles.containerchild}>
			<DashboardUser />
		</div>
		<div className={styles.containerchild}>
			<h2 className={styles.h2ConUsr}>Connected users:</h2>
			<ConnectedUser />
		</div>
		<div className={styles.containerchild}>Need Game and Chat</div>
		<div className={styles.containerchild}>Need Game and Chat</div>
		<div className={styles.containerchild}>Need Game and Chat</div>
	</div>
  )
}

export default Dashboard;
