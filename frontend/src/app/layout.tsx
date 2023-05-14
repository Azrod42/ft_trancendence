"use client"
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from "react-query/devtools"
import NavBar from './(component)/navbarLanding/navbarLanding'
import './globals.css'
import { Barlow } from 'next/font/google'
import queryClient from '@/app/(common)/reactQueryClient';
import backgound from '../../public/background/bg-2.jpeg'
import React from 'react';

const font = Barlow({ 
	weight: ['400', '700', '100', '200'],
	style: ['normal', 'italic'],
	subsets: ['latin']
});

export const metadata = {
  title: 'ft_trancendence',
  description: 'Last 42 project',
}

//QUERY CLIENT dont touch for now
const queryClient2 = new QueryClient({});

//
export var MyContext = React.createContext("pas log");


export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {

return (
    <html lang="en">
			<body className={font.className} style={{
				backgroundImage: `url(${backgound.src})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
				backgroundRepeat: "no-repeat",
				height: "96vh"
				}}>

				<QueryClientProvider client={queryClient2}>
					{children}
					<ReactQueryDevtools initialIsOpen={false}/>
				</QueryClientProvider>
			</body>
    </html>
  )
}
