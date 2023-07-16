"use client"
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from "react-query/devtools"
import styles from './globals.module.css'
import backgound from '../../public/background/main-backgound.jpg'
import React, {useState, useEffect} from 'react';
// import * as io from 'socket.io-client';
//
//
// const socket = io.io("http://localhost:4001");

//QUERY CLIENT don't touch for now
const queryClient = new QueryClient({});



export default function RootLayout({children}: { children: React.ReactNode }) {
	// const socket = io();


	return (
    <html lang="en" className={styles.html}>
			<body style={{
					backgroundImage: `url(${backgound.src})`,
					backgroundSize: "cover",
					backgroundPosition: "center",
					backgroundRepeat: "repeat",
					backgroundAttachment: "fixed",
					height: "96vh"
			}}>
				<QueryClientProvider client={queryClient}>
					{children}
					<ReactQueryDevtools />
				</QueryClientProvider>
			</body>
    </html>
  )
}
