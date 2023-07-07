"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {getUserInfo, UserAuthResponse} from '../auth/auth.api';
import { isUserLog } from '../(common)/checkLog';
import NavBar from '../(component)/navbarDashboard/navbarDashboard';
import styles from './dashboard.module.css'
import {useQuery} from "react-query";
import { io } from 'socket.io-client';
import { idWebSocket } from "@/app/auth/auth.api";

export default function RootLayout({children,}: {children: React.ReactNode}) {
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-
	//GET USER DATA FROM BACKEND AND STORE IN useState
	let [userData, setuserData] = useState<UserAuthResponse>();
	const { push } = useRouter();
	const { isLoading, error, data, refetch } = useQuery('getUserInfo', () =>
		isUserLog().then(res => {
			if (res == undefined)
				push('/');
			setuserData(res);
		}), { refetchInterval: 1000 * 60 * 2, staleTime: 5000}
	);
	useEffect(() => {
		if (userData == undefined) {
			refetch()
		}
	})
	useEffect(() => {
		//for setup action on userData refresh ?
	},[userData])
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==- WEBSOCKET =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-

	useEffect(() => {
		const socket = io('http://localhost:3003');  // Établit une connexion WebSocket avec le serveur
	
		socket.on('connect', () => {
			console.log('Connected to the server');
			fetch('/users/id-web-socket', {
				method: 'POST',
				headers: {
				  'Content-Type': 'application/json',
				  // N'oubliez pas d'inclure les en-têtes d'autorisation si nécessaire
				},
				body: JSON.stringify({ userId: userData?.id, socketId: socket.id }),  // Envoyez l'ID du socket dans le corps de la requête
			  })
				.then(response => response.json())
				.then(data => {
				  console.log('WebSocket ID updated successfully:', data);
				})
				.catch((error) => {
				  console.error('Error updating WebSocket ID:', error);
				});
			  
		  });
	
		socket.on('disconnect', () => {
		  console.log('Disconnected from the server');
		  // Effectuez des opérations supplémentaires lors de la déconnexion, si nécessaire
		});
	
		return () => {
		  socket.disconnect(); // Déconnecte le socket lorsque le composant est démonté
		};
	  }, []);
	  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==- WEBSOCKET FIN =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-


	return (
		<main className={styles.layoutDiv}>
			<NavBar />
			{children}
		</main>
	)
}
