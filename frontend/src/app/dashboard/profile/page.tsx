"use client"
import React, { useEffect, useState } from 'react'
import styles from "./profile.module.css"
import stylesGrid from "./grid.module.css"
import Image from 'next/image'
import {
	changeDisplayName,
	getUserInfo,
	UserAuthResponse
} from '@/app/auth/auth.api'
import {AiOutlineEdit} from 'react-icons/ai'
import {FiCheck} from 'react-icons/fi'
import {SubmitHandler, useForm} from "react-hook-form";
import {useMutation, useQuery} from "react-query";
import Api from "@/app/api/api";
import {useRouter} from "next/navigation";

export type FormDisplayName = {
	displayname: string;
}

interface ProfileProps {
}

const Profile: React.FC<ProfileProps> = ({}) => {
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-
	//GET USER DATA FROM BACKEND AND STORE IN useState
	let [userData, setuserData] = useState<UserAuthResponse>();
	const { push } = useRouter();
	Api.init();
	const { isLoading, error, data, refetch } = useQuery('getUserInfo', () =>
		getUserInfo().then(res => {
			if (res == undefined)
				push('/');
			setuserData(res);
		}), { staleTime: 5000, }
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

	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==
	//HANDLE CHANGE DISPLAY NAME RENAME
	const { register, handleSubmit, formState: { errors } } = useForm<FormDisplayName>();
	const [upDisplayName, setUpDisplayName] = useState<boolean>(false);
	function btnDisplayName() : void {
		setUpDisplayName(!upDisplayName)
	}
	const onSubmit: SubmitHandler<FormDisplayName> = data => {
		if (upDisplayName)
			setUpDisplayName(!upDisplayName)
		mutation.mutate(data);

	}
	//QUERY TO MAKE API CALL TO BACKEND (rename)
	const mutation = useMutation({
		mutationFn: (data: FormDisplayName) => {
			Api.init();
			return changeDisplayName(data);
		},
		onSuccess: (rep) => {
			setTimeout(() => {
				refetch();
			}, 100);

		}
	})
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==
	return (
	<div className={stylesGrid.container}>
		<div className={stylesGrid.section_a}>
			<div className={styles.section_a_container}>
				<div className={styles.section_a_userHeader}>
					<Image src="/media/logo-login.png" alt="profile-picture" width={128} height={128} priority={true}/>
					<p className={styles.userHeader_displayname}>{userData?.displayname}</p>
				</div>
				<hr className={styles.hr}/>
				<div className={styles.userHeader_profileInfo}>
					<span className={styles.itemProfileInfo}>
						<span className={styles.itemTitleProfileInfo}>Display Name :</span>
						{ upDisplayName ?
							<span className={styles.flexRow}>
								<form onSubmit={handleSubmit(onSubmit)}>
									<input type={"text"} {...register("displayname", { required: true })} ></input>
								</form>
									<FiCheck className={styles.AiOutlineEdit} onClick={handleSubmit(onSubmit)} />
							</span>
							:
							<span >{userData?.displayname} <AiOutlineEdit className={styles.AiOutlineEdit} onClick={btnDisplayName} /> </span>
						}
						</span>
					<span className={styles.itemProfileInfo}>
						<span className={styles.itemTitleProfileInfo}>Username :</span>
						<span>{userData?.username}</span>
					</span>
					<span className={styles.itemProfileInfo}>
						<span className={styles.itemTitleProfileInfo}>Email :</span>
						<span>{userData?.email}</span>
					</span>

				</div>
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

export default Profile;