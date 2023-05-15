"use client"
import React, { useEffect, useState } from 'react'
import styles from "./profile.module.css"
import stylesGrid from "./grid.module.css"
import Image from 'next/image'
import { UserAuthResponse } from '@/app/auth/auth.api'
import { getUserData } from '@/app/(common)/getUserData'


interface ProfileProps {
}

const Profile: React.FC<ProfileProps> = ({}) => {
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-
	//GET USER DATA FROM LOCALSTORAGE AND STORE IN useState
	let [userData, setuserData] = useState<UserAuthResponse>();
	const [isUserData, setIsUserData] = useState<boolean>(false);
	useEffect(() => {
		if (!isUserData){
			setuserData(getUserData());
			setIsUserData(true);
		}
	})
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-
	
  return (
	<div className={stylesGrid.container}>
		<div className={stylesGrid.section_a}>
			<div className={styles.section_a_container}>
				<div className={styles.section_a_userHeader}>
					<Image src="/media/logo-login.png" alt="profile-picture" width={85} height={85} priority={true}/>
					<p className={styles.userHeader_displayname}>{userData?.displayname}</p>
				</div>
			</div>
		</div>
		<div className={stylesGrid.section_b}>

		</div>
		<div className={stylesGrid.section_c}>

		</div>
		<div className={stylesGrid.section_d}>

		</div>
	</div>
  )
}

export default Profile;