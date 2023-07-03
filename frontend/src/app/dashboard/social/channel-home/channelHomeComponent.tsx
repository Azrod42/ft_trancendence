'use client'
import React, {useEffect, useState} from 'react';
import { Category } from '@/app/dashboard/social/chat-home/chatHomeComponent';
import styles from "@/app/dashboard/social/chat-home/chatHome.module.css"
import {getUserChannel} from "@/app/dashboard/social/social.api";
import {useQuery} from "react-query";
import {useRouter} from "next/navigation";
import {useTransform} from "framer-motion";

export const ChannelCategory: React.FC = () => {
	const {push} = useRouter();
	const [userChannel, setUserChannel] = useState<any>();

	const { isLoading, error, data, refetch } = useQuery('getUserChannel', () =>
		getUserChannel().then(res => {
			const dta = JSON.parse(JSON.stringify(res.data!));
			setUserChannel(res.data!);
		}), { staleTime: 5000, refetchInterval: 1000 * 5, refetchOnWindowFocus: false}
	);
	useEffect(() => {
		let htmlPu: string = `
							<style>
								.styleItem{
								display: flex;
								flex-direction: row;
								gap: 15px;
								justify-content: flex-start;
								align-items: center;
								}
							</style>`;
		let htmlPr: string = htmlPu;
		let htmlPro: string = htmlPu;
		let nuPu = 0, nuPr = 0, nuPro = 0;

		if (!userChannel)
			return
		for(let i = 0; userChannel[i]; i++) {
			if (userChannel[i].type == 1) {
				nuPu += 1;
				htmlPu += ` 
							<div class='styleItem' id='${userChannel[i].id}'>
							<Image src='/media/logo42_32x32.png' alt='logo-channel' width={32} height={32}/>
							<div>${userChannel[i].channelname}</div>
							</div>`
			}
			if (userChannel[i].type == 2) {
				nuPr += 1;
				htmlPr += `
							<div class='styleItem' id='${userChannel[i].id}'>
							<Image src='/media/logo42_32x32.png' alt='logo-channel' width={32} height={32}/>
							<div>${userChannel[i].channelname}</div>
							</div>`
			}
			if (userChannel[i].type == 3) {
				nuPro += 1;
				htmlPro += `
							<div class='styleItem' id='${userChannel[i].id}'>
							<Image src='/media/logo42_32x32.png' alt='logo-channel' width={32} height={32}/>
							<div>${userChannel[i].channelname}</div>
							</div>`
			}

		}
		if (htmlPu != '') {
			const elDiv = document.getElementById('htmlPublic');
			const el1Div = document.getElementById('htmlPrivate');
			const el2Div = document.getElementById('htmlProtected');
			if (elDiv)
				elDiv.innerHTML = htmlPu;
			if (el1Div)
				el1Div.innerHTML= htmlPr;
			if (el2Div)
				el2Div.innerHTML = htmlPro;
			const elDivnu = document.getElementById('htmlPublicnu');
			const el1Divnu = document.getElementById('htmlPrivatenu');
			const el2Divnu = document.getElementById('htmlProtectednu');
			if (elDivnu)
				elDivnu.innerText = '(' + nuPu.toString() + ')';
			if (el1Divnu)
				el1Divnu.innerText= '(' + nuPr.toString() + ')';
			if (el2Divnu)
				el2Divnu.innerText = '(' + nuPro.toString() + ')';
		}
		for (let i = 0; userChannel[i]; i++) {
			let mySelectedElement = document.getElementById(userChannel[i].id);
			mySelectedElement?.addEventListener("click",  function getHtml(){
				push(`/dashboard/social/channel/${userChannel[i].id}`)
			})
		}
	}, [userChannel])


	return (
		<div className={styles.container} >
			<Category title="Private Channels" count={0} type={'htmlPrivate'} />
			<Category title="Public Channels" count={0} type={'htmlPublic'}/>
			<Category title="Protected Channels" count={0} type={'htmlProtected'}/>
		</div>
	)
}
