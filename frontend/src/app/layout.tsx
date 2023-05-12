"use client"
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from "react-query/devtools"
import NavBar from './(component)/navbar/page'
import './globals.css'
import { Barlow } from 'next/font/google'
import queryClient from '@/app/(common)/reactQueryClient';
import backgound from '../../public/background/bg-2.jpeg'

const font = Barlow({ 
	weight: ['400', '700', '100', '200'],
	style: ['normal', 'italic'],
	subsets: ['latin']
});

export const metadata = {
  title: 'ft_trancendence',
  description: 'Last 42 project',
}

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
				width: '100%',
				height: '98vh',
				margin: '0',
				border: 'none',
				}}>

				<QueryClientProvider client={queryClient}>
					<NavBar />
					{children}
					<ReactQueryDevtools initialIsOpen={false}/>
				</QueryClientProvider>
			</body>
    </html>
  )
}
