"use client"
import { useState } from 'react';
import AuthType from './authtype/authtype'
import Api from '../api/api';



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
