'use client'
import React, {useEffect, useState} from 'react';
import styles from "./channelCreate.module.css"
import './style.css'
import { useRouter } from 'next/navigation';
import {getMyData} from "@/app/api/fetchData";
import {FormValuesCreateChannel, UserAuthResponse} from "@/app/auth/auth.api";
import { SubmitHandler, useForm } from 'react-hook-form';
import {createChannel} from "@/app/dashboard/social/social.api";
import ErrorNotification from "@/app/(component)/errorNotification/errorNotification";
import {useMutation} from "react-query";

interface ChannelCreateProps {
}

const ChannelCreate: React.FC<ChannelCreateProps> = ({}) => {
	//TYPE SELECTION =-=-=-=-=-=-=-=-=-=-=
	const [type, setType] = useState<number>(1);
	useEffect(() => {
		document.getElementById('button1')?.classList.remove('background');
		document.getElementById('button2')?.classList.remove('background');
		document.getElementById('button3')?.classList.remove('background');
		document.getElementById(`button${type}`)?.classList.add('background');
	},[type])
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	//GET USER DATA FROM BACKEND
	const [userData, setUserData] = useState<UserAuthResponse | undefined>(undefined);
	const { push } = useRouter();
	useEffect(() => {
		getMyData().then(res => {
			if (res === undefined)
				push('/');
			setUserData(res);
		});
	}, []);
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-
	//FORM HANDLE DATA
	const { register, handleSubmit, formState: { errors } } = useForm<FormValuesCreateChannel>();
	const onSubmitCreateChannel: SubmitHandler<FormValuesCreateChannel> = (data) => {
		if (type == 1 || type == 2)
			data.password = 'undefined';
		data.type = type;
		data.owners = userData?.id!
		registerChannel(data);
	}
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	//HANDLE ERROR NOTIFICATION
	const [error, setError] = useState<boolean>(false);
	const [headerError, setHeaderError] = useState<string>('');
	const [errorMsg, setErrorMsg] = useState<string>('');
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	//MUTATION API CALL CREATE CHANNEL
	const {mutate: registerChannel} = useMutation(createChannel, {
		onSuccess: (res: any) => {
			if (res.status == false) {
				setHeaderError('Error :');
				setErrorMsg(res.error);
				if (!res.error)
					setErrorMsg("Channel with this name already exist");
				setError(true);
				setTimeout (() => {
					setError(false);
				}, 5000);
			} else {
				push(`/dashboard/social/channel/${res.data.id}`);
			}
		},
	});
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

	return (
		<div className={styles.container}>
			{error ? <ErrorNotification headerText={headerError} error={errorMsg}/> : <div></div>}
			<h1 className={styles.h1}>Create channel</h1>
			<div className={styles.containerChannelType}>
				<div id='button1' className={styles.button} onClick={() => setType(1)}>Public</div>
				<div id='button2' className={styles.button} onClick={() => setType(2)}>Private</div>
				<div id='button3' className={styles.button} onClick={() => setType(3)}>Protected</div>
			</div>
			<div className={styles.containerForm}>
				{type == 1 || type == 2 ?
					<form className={styles.containerInForm} onSubmit={handleSubmit(onSubmitCreateChannel)}>
						<div className={styles.inputDiv}>
							<span>Channel name</span>
							<input className={styles.input} type="text" placeholder="" {...register('channelname')} />
						</div>
						<input className={styles.buttonSend} type="submit"/>
					</form> : <div></div>}
				{type == 3 ?
					<form className={styles.containerInForm} onSubmit={handleSubmit(onSubmitCreateChannel)}>
						<div className={styles.inputDiv}>
							<span>Channel name</span>
							<input className={styles.input} type="text" placeholder="" {...register('channelname', {required: true})} />
						</div>
						<div className={styles.inputDiv}>
							<span>Channel password</span>
							<input className={styles.input} type="password" placeholder="" {...register('password', {required: true})} />
						</div>
						<input className={styles.buttonSend} type="submit"/>
					</form> : <div></div>}

			</div>
		</div>
	)
}

export default ChannelCreate;
