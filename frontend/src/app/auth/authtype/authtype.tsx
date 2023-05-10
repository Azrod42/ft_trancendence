'use client'
import React, { useState } from 'react'
import './authtype.css'
import Link from 'next/link';

interface AuthTypeProps {

}

const AuthType: React.FC<AuthTypeProps> = () => {
	const left = () => {
		document.getElementById('authtype__left')?.classList.remove("divider__authtype--colorDark");
		document.getElementById('authtype__right')?.classList.remove("divider__authtype--colorLight");
		document.getElementById('authtype__left')?.classList.add("divider__authtype--colorLight");
		document.getElementById('authtype__right')?.classList.add("divider__authtype--colorDark");

	}
	const right = () => {
		document.getElementById('authtype__left')?.classList.remove("divider__authtype--colorLight");
		document.getElementById('authtype__right')?.classList.remove("divider__authtype--colorDark");
		document.getElementById('authtype__left')?.classList.add("divider__authtype--colorDark");
		document.getElementById('authtype__right')?.classList.add("divider__authtype--colorLight");
	}
  	return (
	<div className='container_authtype'>
		<div className='divider__authtype divider__authtype--colorLight' onClick={left} id="authtype__left">
			<Link className='link__authtype--txt' href='/auth/login'>Login</Link>
		</div>
		<div className='divider__authtype' onClick={right} id="authtype__right">
			<Link className='link__authtype--txt' href="/auth/sign-up">Sign-up</Link>
		</div>
	</div>
  )
}

export default AuthType;
