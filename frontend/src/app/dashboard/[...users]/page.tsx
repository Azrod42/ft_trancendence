'use client'
import React, {useContext, useEffect, useState} from 'react'
import styles from "./users.module.css"
import {useMutation, useQuery} from "react-query";
import Api from "@/app/api/api";
import {
	getAllUsers, getPublicUserInfo,
	getUserInfo,
	postProfilePicture,
	uploadProfilePicture,
	UserAuthResponse
} from "@/app/auth/auth.api";
import {useRouter} from "next/router";
import Image from "next/image";
import {FiCheck} from "react-icons/fi";
import {AiOutlineEdit} from "react-icons/ai";
import {GetServerSideProps} from "next";
import {usePathname} from "next/navigation";
import stylesGrid from "./grid.module.css"



interface UserProps {
}
interface MyPageProps {
	id: string;
}


const User: React.FC<UserProps> = ({}) => {
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	//GET PROFILE IMAGE
	const urlParam: string = usePathname().split('/').pop()!;
	const [profilePicture, setProfilePicture] = useState<string>('');
	const [ppGet, setPpGet] = useState<boolean>(false);
	if (!ppGet) {
		postProfilePicture(urlParam).then(
			res => {
				setProfilePicture('data:image/png;base64, ' + res?.data);
			}
		);
		setPpGet(true);
	}
	useEffect(() => {
		// console.log(profilePicture);
	}, [profilePicture])
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-
	//GET PUBLIC USERS DATA FROM BACKEND AND DISPLAY IT
	let [userData, setuserData] = useState<any>();
	const { isLoading, error, data, refetch } = useQuery('getUserInfo', () =>
		getPublicUserInfo(urlParam).then(res => {
			setuserData(res?.data['0']);
		}), { staleTime: 5000 }
	);
	useEffect(() => {
		if (userData == undefined) {
			refetch()
		}
	})
	useEffect(() => {
		//for setup action on userData refresh ?
	},[userData])
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-
  return (
	  <div className={stylesGrid.container}>
		  <div className={stylesGrid.section_a}>
			  <div className={styles.section_a_containerTop}>
				  <div className={styles.section_a_userHeader}>
					  {profilePicture && (<Image className={styles.section_a_userHeaderImg} src={!ppGet ? "/media/logo-login.png" : profilePicture} alt="profile-picture" width={128} height={128} priority={true}/>)}
					  <p className={styles.userHeader_displayname}>{userData?.displayname}</p>
				  </div>
				  <hr className={styles.hr}/>
			  </div>
			  <div className={styles.section_a_containerBottom}>
				  <h1 className={styles.h1_section_a}>Rank:</h1>
				  <Image className={styles.img_section_a} src='/media/logo-login.png' alt='rank-image' width={128} height={128}/>
				  <p className={styles.p_section_a}>ADD SOME STATS HERE</p>
			  </div>
		  </div>
		  <div className={stylesGrid.section_b}>

		  </div>
		  <div className={stylesGrid.section_c}>

		  </div>
		  <div className={stylesGrid.section_d}>
			  <div className={styles.section_d_container}>
				  <h1 className={styles.section_d_h1}>Last games</h1>
				  <hr className={styles.hr} />
				  <div className={styles.section_d_games}>
					  <div className={styles.section_d_gamesitems}>Game 1</div>
					  <div className={styles.section_d_gamesitems}>Game 2</div>
					  <div className={styles.section_d_gamesitems}>Game 3</div>
					  <div className={styles.section_d_gamesitems}>Game 4</div>
				  </div>
			  </div>
		  </div>
	  </div>
  )
}

export default User;
