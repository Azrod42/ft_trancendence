"use client"
import React, {ChangeEvent, useEffect, useState} from 'react'
import styles from "./profile.module.css"
import stylesGrid from "./grid.module.css"
import Image from 'next/image'
import {
	changeDisplayName, getProfilePicture,
	getUserInfo, uploadProfilePicture,
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
	Api.init();

	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	//GET PROFILE IMAGE
	const [profilePicture, setProfilePicture] = useState<string>('');
	const [ppGet, setPpGet] = useState<boolean>(false);
	if (!ppGet) {
		getProfilePicture().then(
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
	//GET USER DATA FROM BACKEND AND STORE IN useState
	let [userData, setuserData] = useState<UserAuthResponse>();
	const { push } = useRouter();
	const { isLoading, error, data, refetch } = useQuery('getUserInfo', () =>
		getUserInfo().then(res => {
			if (res == undefined)
				push('/');
			setuserData(res);
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
	//UPLOAD FILE ON USER ADD ONE
	const onFileUploadChange = (e: ChangeEvent<HTMLInputElement>) => {
		const fileInput = e.target;

		if (!fileInput.files) {
			alert("No file was chosen");
			return;
		}
		if (!fileInput.files || fileInput.files.length === 0) {
			alert("Files list is empty");
			return;
		}
		const file = fileInput.files[0];

		if (!file.type.startsWith("image")) {
			alert("Please select a valide image");
			return;
		}
		const formData = new FormData();
		formData.append('file', file);
		mutationProfilePicture.mutate(formData);
	};
	const mutationProfilePicture = useMutation({
		mutationFn: (data:  FormData) => {
			Api.init();
			return uploadProfilePicture(data);
		},
		onSuccess: (rep) => {
			setTimeout(() => {
				refetch();
				setPpGet(false);
			}, 100);
		}
	})
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	return (
	<div className={stylesGrid.container}>
		<div className={stylesGrid.section_a}>
			<div className={styles.section_a_containerTop}>
				<div className={styles.section_a_userHeader}>
					{profilePicture && (<Image className={styles.section_a_userHeaderImg} src={!ppGet ? "/media/logo-login.png" : profilePicture} alt="profile-picture" width={128} height={128} priority={true}/>)}
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
					<span className={styles.itemProfileInfo}>
						<span className={styles.itemTitleProfileInfo}>Change avatar:</span>
						<form action="">
							<input className={styles.itemFileInputProfileInfo} name="file" type="file" onChange={onFileUploadChange}  />
						</form>
					</span>
				</div>
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

export default Profile;