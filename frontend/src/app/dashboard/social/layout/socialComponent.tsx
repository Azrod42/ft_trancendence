'use client'
import React, { useState } from 'react';
import styles from './SocialLayout.module.css';

interface DashboardProps {
	children: React.ReactNode;
}

export const Header: React.FC = () => {
	return (
	<div className={styles.staticTop}>
		<h1 className={styles.socialTitle}>Social</h1>
	</div>
	);
};

export const ButtonGroup: React.FC = () => {
	const [activeButton, setActiveButton] = useState('chat');

	const chatButton = activeButton === 'chat'
	? styles.buttonActiveChat
	: styles.buttonInactiveChat;
	const channelsButton = activeButton === 'channels'
	? styles.buttonActiveChannels
	: styles.buttonInactiveChannels;

	return (
	<div className={styles.buttonWrapper}>
		<div className={styles.buttonContainer}>
		<button
			className={chatButton}
			onClick={() => setActiveButton('chat')}
		>
			<span className={styles.buttonText}>Chat</span>
		</button>
		<button
			className={channelsButton}
			onClick={() => setActiveButton('channels')}
		>
			<span className={styles.buttonText}>Channels</span>
		</button>
		</div>
	</div>
	);
};

export const SearchBar: React.FC = () => {
	return (
	<input className={styles.searchBar} type="search" placeholder="Search" />
	);
};

export const TopBar: React.FC = () => {
	return (
		<div className={styles.staticTop}>
			<Header />
			<ButtonGroup />
			<SearchBar />
		</div>
	);
}

export const Sidebar: React.FC<DashboardProps> = ({ children }) => {
	return (
	<div className={styles.sidebar}>
		<TopBar />
		<div className={styles.contacts}>{children}</div>
	</div>
	);
};