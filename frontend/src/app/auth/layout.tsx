import AuthType from './authtype/authtype'



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
	<div>
		<AuthType />
		{children}
	</div>

  )
}
