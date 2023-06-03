"use client"
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from "react-query/devtools"
import styles from './globals.module.css'
import { Barlow } from 'next/font/google'
import backgound from '../../public/background/main-backgound.jpg'
import React from 'react';
import {inspect} from "util";

const font = Barlow({ 
	weight: ['400', '700', '100', '200'],
	style: ['normal', 'italic'],
	subsets: ['latin']
});

// export const metadata = {
//   title: 'ft_trancendence',
//   description: 'Last 42 project',
// }

//QUERY CLIENT don't touch for now
const queryClient = new QueryClient({});

export default function RootLayout({children}: { children: React.ReactNode }) {
return (
    <html lang="en" className={styles.html}>
			<body style={{
				backgroundImage: `url(${backgound.src})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
				backgroundRepeat: "repeat",
				backgroundAttachment: "fixed",
				height: "96vh"
				}} className={font.className}>

				<QueryClientProvider client={queryClient}>
					{children}
					<ReactQueryDevtools />
				</QueryClientProvider>
			</body>
    </html>
  )
}
