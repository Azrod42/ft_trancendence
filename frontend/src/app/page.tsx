import Image from 'next/image'
import styles from './page.module.css'


export default function Home() {
  return (
    <main className={styles.container}>
		<p>Welcome to ft_trancendence</p>
		<p>by</p>
		<p className={styles.name}>tsorabel lfantine alevasse</p>
    </main>
  )
}
