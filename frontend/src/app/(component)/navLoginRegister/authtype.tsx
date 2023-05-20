'use client'
import React from 'react'
import './authtype.css'
import Link from 'next/link';

interface AuthTypeProps {

}

const AuthType: React.FC<AuthTypeProps> = () => {
  	return (
	<div className='container_authtype'>
		<div className='divider__authtype divider__authtype--colorLight' id="authtype__left">
			<Link className='link__authtype--txt' href='/auth/login'>Login</Link>
		</div>
		<div className='divider__authtype' id="authtype__right">
			<Link className='link__authtype--txt' href="/auth/sign-up">Register</Link>
		</div>
	</div>
  )
}

export default AuthType;
