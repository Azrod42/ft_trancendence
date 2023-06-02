'use client'
import React, { useEffect, useState } from 'react'
import styles from "./leaderbard.module.css"
import { useRouter } from 'next/navigation';
import {useQuery} from "react-query";
import {getAllUsers} from "@/app/auth/auth.api";
import Link from 'next/link';

interface LeaderboardProps {}

const Leaderboard: React.FC<LeaderboardProps> = ({}) => {
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-
	// GET DATA FROM BACKEND AND STORE IN useState
	let [userData, setuserData] = useState<any>();
	const { push } = useRouter();
	const { isLoading, error, data, refetch } = useQuery('getUserInfo', () =>
		getAllUsers().then(res => {
			setuserData(res?.data)
		}), { staleTime: 1000 * 60 * 2}
	);
	useEffect(() => {
		if (userData == undefined) {
			refetch()
		}
	})
	useEffect(() => {
		let html: string = '';
		let link: string = '';
		for (let i = 0; i < userData?.length; i++) {
			link = `/dashboard/users/${userData[i].id}`
			html += `
				<tr className={styles.tr}>
					<td className={styles.username}>${userData[i].displayname}</td>
					<td className={styles.elo}>${userData[i].elo}</td>
					<td className={styles.elo}><a href="${link}" style='text-decoration: none; color: gold'>acess</a></td>
				</tr>
			`;
		}
		document.getElementById('data-table-users')!.innerHTML = html;
	},[userData])
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-

	return (
		<div className={styles.container}>
			<table className={styles.tablestyle}>
				<thead>
				<tr className={styles.tr}>
					<th className={styles.username}>Username</th>
					<th className={styles.elo}>Elo</th>
					<th className={styles.elo}>Profile</th>
				</tr>
				</thead>
				<tbody id='data-table-users'>

				</tbody>
			</table>
		</div>
	)
}

export default Leaderboard;
