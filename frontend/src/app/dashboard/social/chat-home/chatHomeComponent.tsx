'use client'
import React, {useEffect, useState} from 'react';
import { useRouter } from 'next/navigation'
import styles from './chatHome.module.css';
import LoadingPage from "@/app/(component)/loadingPage/loadingPage";
import '../channel-create/style.css'

interface CategoryProps {
	title: string,
	count: number,
	type: string
}

export const Category: React.FC<CategoryProps> = ({ title, count, type}) => {
	const [isOpen, setIsOpen] = useState(false);
	const {push} = useRouter();

	useEffect(() => {
		const Elem = document.getElementById(type);
		if (isOpen == false) {
			Elem?.classList.add('hide');
		} else  {
			Elem?.classList.remove('hide');
		}
	}, [isOpen])
	return (
		<>
			<div className={styles.category} onClick={() => setIsOpen(!isOpen)}>
				<div className={styles.name}>
					<p>{title}</p><p id={type + 'nu'}></p>
				</div>
				<img className={styles.arrow}
					src="/media/arrow.png"
					alt="arrow"
					style={{ transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)" }}
				/>
			</div>
			<div id={type} className={styles.channelUnit}>
				<LoadingPage />
			</div>
		</>
	);
}

export const ChatCategory: React.FC = () => {
	return (
		<div className={styles.container}>
			<Category title="My friends" count={0} type={'friendDiv'}/>
			<Category title="Others" count={0} type={'othersDiv'}/>
			<Category title="Blocked" count={0} type={'blockedDiv'} />
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
