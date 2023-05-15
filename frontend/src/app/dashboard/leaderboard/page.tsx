import React, { useEffect, useState } from 'react'
import styles from "./leaderbard.module.css"


interface LeaderboardProps {
}

const Leaderboard: React.FC<LeaderboardProps> = ({}) => {
	
  return (
	<div className={styles.container}>
		<h1>Leaderboard</h1>
	</div>
  )
}

export default Leaderboard;
