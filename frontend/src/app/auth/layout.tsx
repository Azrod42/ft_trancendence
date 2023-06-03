"use client"
import AuthType from '../(component)/navLoginRegister/authtype'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
	<main>
		<AuthType />
		{children}
	</main>

  )
}
