import NavBar from './(component)/navbar/page'
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

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
    	<body className={inter.className}>
			<NavBar />
			{children}
		</body>
    </html>
  )
}
