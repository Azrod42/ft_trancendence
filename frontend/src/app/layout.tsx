import NavBar from './(component)/navbar/page'
import './globals.css'
import { Barlow } from 'next/font/google'

const font = Barlow({ 
	weight: ['200', '400', '700'],
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
    	<body className={font.className}>
			<NavBar />
			{children}
		</body>
    </html>
  )
}
