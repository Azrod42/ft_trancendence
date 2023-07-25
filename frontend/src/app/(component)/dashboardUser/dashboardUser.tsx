'use client'
import React, {useEffect, useRef, useState} from 'react'
import styles from "./dashboardUser.module.css"
import {useRouter} from "next/navigation";
import {getUserInfo, postProfilePicture} from "@/app/auth/auth.api";
import Image from "next/image";
import Link from "next/link";


interface DashboardUserProps {

}

const DashboardUser: React.FC<DashboardUserProps> = ({}) => {
    const [userData, setUserData] = useState<any>();
    const [profilePicture, setProfilePicture] = useState<string>();


    useEffect(() => {
       getUserInfo().then((data) => {
           if (data) {
               setUserData(data);
               postProfilePicture(data.id).then((img) => {
                   if (img)
                       setProfilePicture(`data:image/png;base64,${img?.data}`);
                   else
                       setProfilePicture('/media/default-img-profile.png')

               })
           }
       })
    },[])
  return (
		<div className={styles.container} >
            <p className={styles.smallTxt}>Welcome back,</p>
            <p className={styles.bigTxt}>{userData?.displayname}</p>
            <p className={styles.smallTxt}>Glad to see you again</p>
            <Link className={styles.smallLinkTxt} href={'/dashboard/profile'}>Acess profile</Link>
            <Image className={styles.img} src={profilePicture ? profilePicture : '/media/default-img-profile.png'} alt='profile picture' width={256} height={256} priority={true}/>
		</div>
  )
}
export default DashboardUser;
