'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'
import styles from './chatHome.module.css';

interface CategoryProps {
	title: string,
	count: number
}

export const Category: React.FC<CategoryProps> = ({ title, count}) => {
	const [isOpen, setIsOpen] = useState(true);

	return (
		<div className={styles.category} onClick={() => setIsOpen(!isOpen)}>
			<div className={styles.name}>
				<p>{title} ({count})</p>
			</div>
			<img className={styles.arrow}
				src="/media/arrow.png"
				alt="arrow"
				style={{ transform: isOpen ? "rotate(0deg)" : "rotate(270deg)" }}
			/>
		</div>
	);
}

export const ChatCategory: React.FC = () => {
	return (
		<div className={styles.container}>
			<Category title="My friends" count={0} />
			<Category title="Others" count={0} />
			<Category title="Blocked" count={0} />
		</div>
	)
}

interface ButtonsProps {
	firstButtonText: string,
	firstButtonUrl: string,
	secondButtonText: string,
	secondButtonUrl: string
}

export const HomeButtons: React.FC<ButtonsProps> = ({ firstButtonText, firstButtonUrl, secondButtonText, secondButtonUrl }) => {
	const { push } = useRouter();

	const	handleFirstButton = () => {
		push(firstButtonUrl)
	}

	const	handleSecondButton = () => {
		push(secondButtonUrl)
	}

	return (
		<div className={styles.buttonsContainer}>
			<button
				className={styles.firstButton}
				onClick={handleFirstButton}
			>
				{firstButtonText}
			</button>
			<div className={styles.separator}>or</div>
			<button
				className={styles.secondButton}
				onClick={handleSecondButton}
			>
				{secondButtonText}
			</button>
		</div>
	)
}
