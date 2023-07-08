import React, { useEffect, useState, useContext } from 'react'
import styles from "./navbarDashboard.module.css"
import {UserAuthResponse, logout, getUserInfo, getProfilePicture, PublicUserResponse} from '@/app/auth/auth.api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {useQuery} from "react-query";
import Api from "@/app/api/api";
import Image from "next/image";
import { motion } from "framer-motion";
import io from 'socket.io-client';
import {WebSocket} from "@/app/(component)/WebSocket/WebSocket";
import {WebsocketContext} from "@/app/(common)/WebsocketContext";



interface NavBarProps {

}

const NavBar: React.FC<NavBarProps> = ({}) => {
	Api.init();
	//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
	//MENU OPEN CLOSE
	const [open, setOpen] = useState<boolean>(false);
	function oncMenu(){
		setOpen(!open)
	};
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	//GET PROFILE IMAGE
	const [profilePicture, setProfilePicture] = useState<string>('');
	const [ppGet, setPpGet] = useState<boolean>(false);
	useEffect(() => {
	if (!ppGet) {
		getProfilePicture().then(
			res => {
				setProfilePicture('data:image/png;base64, ' + res?.data);
			}
		), {refetchInterval: 1000 * 1};
		setPpGet(true);
	}},[])
	useEffect(() => {
		// console.log(profilePicture);
		// if (open)
		// 	setPpGet(false);
	}, [open])
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-

	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-
	//GET USER DATA FROM BACKEND AND STORE IN useState
	let [userData, setuserData] = useState<PublicUserResponse>({id: 'id', avatar: 'avatar', displayname: 'displayname'});
	let [isUserData, setIsUserData] = useState<boolean>(false);
	const { push } = useRouter();
	const { isLoading, error, data, refetch } = useQuery('getUserInfo', () =>
		getUserInfo().then(res => {
			if (res == undefined)
				push('/');
			const userDta: PublicUserResponse = {id: res?.id!, displayname: res?.displayname!, avatar: 'undefine'}
			setuserData(userDta);
			setIsUserData(true)
		}), {refetchInterval: 1000 * 60 * 2, refetchOnWindowFocus: false}
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
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-
	//LOGOUT ON SUBIMIT HANDLE 
	function onSubmit() {
		oncMenu();
		logout();
		push('/');
	}
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-
	const [socket] = useState(useContext(WebsocketContext))

	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==- MISE EN DUEL=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-
 
	useEffect(() => {
    console.log("Début de l'écoute des événements 'duelRequest'");

    console.log(`Socket est connectée : ${socket.connected}`);

    const handleDuelRequest = (data: any) => {
        try {
            console.log("Demande de duel reçue");
            console.log(data);
        } catch (error) {
            console.error('Erreur lors du traitement de la demande de duel : ', error);
        }
    };
  
    socket.on('duelRequest', handleDuelRequest);

	socket.on('connect_error', (error) => {
		console.log('Erreur de connexion :', error);
	  });
    console.log("Écoute des événements 'duelRequest' en cours");
  
    return () => {
        console.log("Arrêt de l'écoute des événements 'duelRequest'");
        socket.off('duelRequest', handleDuelRequest);
    };
}, [socket]);

	  
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==- MISE EN DUEL FIN=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-

	//REFRESH TOPBAR DATA eatch 30s
	// setInterval(refetch, 3000);
  return (
	<nav className={styles.container}>
		<div >
		</div>
		<div className={styles.navLeft}>
			<Link className={styles.linktxt} href="/dashboard/">Home</Link>
			<Link className={styles.linktxt} href="/dashboard/gameStart">Game</Link>
			<Link className={styles.linktxt} href="/dashboard/social/chat-home">Social</Link>
			<Link className={styles.linktxt} href="/dashboard/leaderboard">Leaderboard</Link>
			{/*<Link className={styles.linktxt} href="/dashboard/users">users</Link>*/}
		</div>
		<div className={styles.navRight}>
			{isUserData ? <WebSocket user={userData}/> : <></>}
			<p className={styles.displaynametxt}>{userData?.displayname}</p>
			{profilePicture && (<Image className={styles.profilePicture} src={!ppGet ? "/media/logo-login.png" : profilePicture} alt="profile-picture" width={56} height={56} priority={true} onClick={oncMenu}/>)}
			{open && <motion.div className={styles.menu}
								 initial={{opacity: 0}}
								 animate={{opacity: 1}}
								 transition={{duration: 0.4}}
					>
				<Link className={styles.linktxt} href="/dashboard/profile" onClick={oncMenu}>Profile</Link>
				<p className={styles.linktxt} onClick={onSubmit}>Logout</p>
			</motion.div>}
		</div>
	</nav>
  )
}

export default NavBar;
