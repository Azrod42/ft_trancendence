import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import { Box } from '@mui/system'
import style from '../styles/index.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
   <Box className={style.box}>
		<p className={style.txt}>Hello world !</p>
   </Box>
  )
}
