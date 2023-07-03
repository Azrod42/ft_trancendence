'use client'
import React from 'react'
import { HomeButtons } from '@/app/dashboard/social/chat-home/chatHomeComponent'
import styles from "@/app/dashboard/social/chat-home/chatHome.module.css"
import {useRouter} from "next/navigation";


interface ChannelHomeProps {
}

const ChannelHome: React.FC<ChannelHomeProps> = ({}) => {

	return (
			<div className={styles.middleContainer}>
				<HomeButtons
					firstButtonText="Join a channel"
					firstButtonUrl="/dashboard/social/channel-search/"
					secondButtonText="Create new channel"
					secondButtonUrl="/dashboard/social/channel-create/"
				/>
			</div>
	)
}

export default ChannelHome;
