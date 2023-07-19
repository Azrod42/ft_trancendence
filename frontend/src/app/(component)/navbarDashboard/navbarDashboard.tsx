import React, { useEffect, useState, useContext } from 'react'
import styles from "./navbarDashboard.module.css"
import {
	UserAuthResponse,
	logout,
	getUserInfo,
	getProfilePicture,
	PublicUserResponse,
	setGameNumber,
	updateWebSocketId
} from '@/app/auth/auth.api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {useQuery} from "react-query";
import Api from "@/app/api/api";
import Image from "next/image";
import { motion } from "framer-motion";
import io from 'socket.io-client';
import {WebSocket} from "@/app/(component)/WebSocket/WebSocket";
import { newWebSocket } from "@/app/auth/auth.api";
import {WebsocketContext} from "@/app/(common)/WebsocketContext";
import uuid from 'react-uuid'

interface MyModalProps {
	isOpen: boolean;
	onClose: () => void;
	children?: React.ReactNode; 
  }
  
  function MyModal({ isOpen, onClose, children }: MyModalProps) {
	if (!isOpen) return null;
  
	return (
	  <div
		style={{
		  position: "fixed",
		  top: 0,
		  left: 0,
		  right: 0,
		  bottom: 0,
		  backgroundColor: "rgba(0,0,0,0.3)",
		  display: "flex",
		  justifyContent: "center",
		  alignItems: "center",
		  zIndex: 1000,
		}}
		onClick={onClose}
	  >
		<div
		  style={{
			backgroundColor: "black",
			color: "white",
			textAlign: "center",
			padding: "1em",
			position: "relative",
			border: "2px solid white",
			zIndex: 1001,
		  }}
		  onClick={(e) => e.stopPropagation()}
		>
		  {children}
		  {/* <button  onClick={onClose}>Close</button> */}
		</div>
	  </div>
	);
  }



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
	const [duelRequest, setDuelRequest] = useState<{ socketId: string, idRoom: string, currentUserId :string, currentUserName: string} | null>(null);
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
	
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==- MISE EN DUEL=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-
	const [socket] = useState(useContext(WebsocketContext))

	useEffect(( )=> {
		if (socket?.id != undefined) {
			updateWebSocketId({id : socket.id}).then((res) => {
				// console.log(res);
			})
		}
	},[socket])

	useEffect(() => {
		const handleDuelRequest = (data: { socketId: string, idRoom: string, currentUserId: string, currentUserName:string}) => {
    		setDuelRequest(data);
		};
	
		socket.on('duelRequest', (data) => handleDuelRequest(data));	
		return () => {
			socket.off('duelRequest', handleDuelRequest);
		};
	}, [socket]);

	useEffect(() => {
		// console.log(duelRequest);
	}, [duelRequest])

	  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==- MISE EN DUEL FIN=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-

	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==- MAJ SOCKET AT RELOAD=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-

	useEffect(() => {
		const handleNewSocket = (data: any) => {
			try {
				newWebSocket(data.socketId).then((res) => {
				})
			} catch (error) {
				console.error('Error while updating new socket', error);
			}
		};
	
		socket.on('newSocket', (data) => handleNewSocket(data));	
		return () => {
			socket.off('newSocket', handleNewSocket);
		};
	}, [socket]);
	

	  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==- MAJ SOCKET AT RELOAD FIN=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-
		
	  const handleDecline = () => {
		setDuelRequest(null);
	}

	const handleAccept = () => {
		setGameNumber(2).then((res) => {
			// console.log(res);
		});
		push(`/dashboard/game/${duelRequest?.idRoom}`);
		setDuelRequest(null);
	}

	//REFRESH TOPBAR DATA eatch 30s
	// setInterval(refetch, 3000);
	return (
		<nav className={styles.container}>
			<div>
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
				{open && 
					<motion.div className={styles.menu}
								initial={{opacity: 0}}
								animate={{opacity: 1}}
								transition={{duration: 0.4}}
					>
						<Link className={styles.linktxt} href="/dashboard/profile" onClick={oncMenu}>Profile</Link>
						<p className={styles.linktxt} onClick={onSubmit}>Logout</p>
					</motion.div>
				}
			</div>
			<MyModal isOpen={duelRequest != null} onClose={handleDecline} >
				{/* <div className={styles.modal}> */}
					<h1>{duelRequest?.currentUserName} vous invite à un duel</h1>
					{/* <h1>On vous invite à un duel</h1> */}
					<p>Accepter?</p>
					<button className={styles.buttonModal} onClick={handleAccept}>Accepter</button>
					<button className={styles.buttonModal} onClick={handleDecline}>Decliner</button>
				{/* </div> */}
			</MyModal>
		</nav>
	)	
}

export default NavBar;
