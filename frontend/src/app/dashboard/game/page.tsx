import React from 'react'
import styles from "./game.module.css"


interface GameProps {
}

const Game: React.FC<GameProps> = ({}) => {
	
  return (
	<div className={styles.container}>
		<h1>Game</h1>
	</div>
  )
}

export default Game;
