"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {getUserInfo, setWebSocketId, UserAuthResponse} from '../auth/auth.api';
import { isUserLog } from '../(common)/checkLog';
import NavBar from '../(component)/navbarDashboard/navbarDashboard';
import styles from './dashboard.module.css'
import {useQuery} from "react-query";
import { io } from 'socket.io-client';
import { idWebSocket } from "@/app/auth/auth.api";
import {socket, WebSocketProvider} from "@/app/(common)/WebsocketContext";
import {Barlow} from "next/font/google";

const font = Barlow({
	weight: ['400', '700', '100', '200'],
	style: ['normal', 'italic'],
	subsets: ['latin']
});

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
		const socket = io('http://localhost:4001');  // Établit une connexion WebSocket avec le serveur
	
		socket.on('connect', () => {
			console.log('Connected to the server');
			setWebSocketId({id: socket.id}).then(data => {
				  console.log('WebSocket ID updated successfully:', data);
				})
			  
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
			<div className={font.className}>
				<NavBar />
				{children}
			</div>
		</main>
	)
}
