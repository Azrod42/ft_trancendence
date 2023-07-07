"use client"
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from "react-query/devtools"
import styles from './globals.module.css'
import backgound from '../../public/background/main-backgound.jpg'
import React from 'react';



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
			}}>
				<QueryClientProvider client={queryClient}>
					{children}
					<ReactQueryDevtools />
				</QueryClientProvider>
			</body>
    </html>
  )
}
