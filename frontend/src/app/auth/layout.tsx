"use client"
import { useState } from 'react';
import AuthType from './authtype/authtype'
import Api from '../api/api';
import NavBar from '../(component)/navbarLanding/navbarLanding';



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
	<main>
		<NavBar />
		<AuthType />
		{children}
	</main>

  )
}
