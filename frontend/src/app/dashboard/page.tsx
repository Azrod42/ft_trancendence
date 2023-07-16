'use client'
import React from 'react'
import styles from "./dashboard.module.css"
import Link from 'next/link';
import {WebSocket} from "@/app/(component)/WebSocket/WebSocket";
import ConnectedUser from "@/app/(component)/connectedUser/connectedUser";
import DashboardUser from "@/app/(component)/dashboardUser/dashboardUser";
import {postGameData} from "@/app/dashboard/social/social.api";


interface DashboardProps {
}

export type DataEndGameDB = {
	idGame: string;
	idWinner: string;
	idLoser: string;
	scoreWinner: number;
	scoreLoser: number;
	ranked: boolean;
};
const Dashboard: React.FC<DashboardProps> = ({}) => {
	function testRequest() {
		const data : DataEndGameDB = {
			idGame: 'e8e878c7-ds3c-461b-a7cf-bbefed7b87de',
			idWinner: '786cf0bd-f2e0-443e-8e79-cc3d6b6e5201',
			idLoser: '878c2f45-6307-465a-8e78-948acc556f87',
			scoreLoser: 2,
			scoreWinner: 3,
			ranked: true
		};
		postGameData(data).then((res) =>{
			console.log(res);
		});
	};

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
		<div className={styles.containerchild}><button onClick={testRequest}>CLIC CLIC</button></div>
	</div>
  )
}

export default Dashboard;
