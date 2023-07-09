'use client'
import React, {useEffect, useRef, useState} from 'react'
import styles from "./leaderbard.module.css"
import { useRouter } from 'next/navigation';
import {useQuery} from "react-query";
import {getAllUsers} from "@/app/auth/auth.api";

interface LeaderboardProps {}

const Leaderboard: React.FC<LeaderboardProps> = ({}) => {
	const divRef: React.MutableRefObject<any> = useRef();
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-
	// GET DATA FROM BACKEND AND STORE IN useState
	let [userData, setuserData] = useState<any>();
	const { push } = useRouter();
	const { refetch } = useQuery('getUserInfo', () =>
		getAllUsers().then(res => {
			setuserData(res?.data);
			// console.log(JSON.stringify(res?.data));
		}), { staleTime: 1000 * 60 * 2}
	);
	useEffect(() => {
		if (userData == undefined) {
			refetch()
		}
	})
	useEffect(() => {
		let html: string = `<style>
								.containerLeader {
									width: 100%;
									margin: 0;
									display: flex;
									flex-direction: row;
									background-color: #060B26aa;
								}
								.usernameLeader {
									width: 300px;
									border: 1px solid;
									border-collapse: collapse;
									cursor: pointer;
									margin: 0;
								}
								.eloLeader {
									width: 60px;
									border: 0.5px solid;
									border-collapse: collapse;
									margin: 0;
								}
							</style>`;
		let link: string = '';
		for (let i = 0; i < userData?.length; i++) {
			link = `/dashboard/users/${userData[i].id}`
			html += `
				<div class='containerLeader'>
					<p class='usernameLeader' id='${userData[i].id}'>${userData[i].displayname}</p>
					<p class='eloLeader'>${userData[i].elo}</p>
				</div>
			`;
		}
		if (divRef.current)
			divRef.current.innerHTML = html;
		setTimeout(() => {
			for (let i = 0; i < userData?.length; i++) {
				let mySelectedElement = document.getElementById(userData[i].id);
				mySelectedElement?.addEventListener("click", function getHtml() {
					push(`/dashboard/user/${userData[i].id}`)
				})
			}
		}, 1000);
	},[userData])
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-

	return (
		<div className={styles.container}>
			<div className={styles.header}>
					<p className={styles.username}>Username</p>
					<p className={styles.elo}>Elo</p>
			</div>
			<div ref={divRef}>

			</div>
		</div>
	)
}
export default Leaderboard;
