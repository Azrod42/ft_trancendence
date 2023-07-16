'use client'
import React from 'react'
import styles from "./dashboard.module.css"
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
			idWinner: 'ad807ef0-9179-422b-a506-44327228a569',
			idLoser: 'efad3a20-be3b-40e0-b118-4e96d08039a2',
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
