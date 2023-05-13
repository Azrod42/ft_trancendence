import React, { useEffect, useState } from 'react'
import "./navbar.css"
import Link from 'next/link';


interface NavBarProps {

}

const NavBar: React.FC<NavBarProps> = ({}) => {
	const [isLogin, setisLogin] = useState<boolean>(false);

	

  return (
	<nav className="container">
		<Link className="link--txt" href='/'>Home</Link>
		<Link className="link--txt" href='/auth/login'>Login</Link>
		<p className="link--txt" id='username'></p>
	</nav>
  )
}

export default NavBar;
