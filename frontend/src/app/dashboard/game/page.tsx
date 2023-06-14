'use client'
import React, {useEffect} from 'react'
import styles from "./game.module.css"


interface GameProps {
}

const Game: React.FC<GameProps> = ({}) => {
	useEffect( ( ) => {
		console.log("test");
	}, [])
	return(
	<div className={styles.container}>
		<h1>Game</h1>
	</div>
  )
}

export default Game;
