'use client'
import React from 'react'
import styles from "./loadingPage.module.css"
import { motion } from "framer-motion";

interface LoadingComponentProps {

}

const LoadingComponent: React.FC<LoadingComponentProps> = ({}) => {

  return (
	  <motion.div className={styles.ldshourglass}
                  initial={{rotate: 0}}
                  animate={{rotate: 360}}
                  transition={{  duration: 0.7, repeat: Infinity }}
      >
      </motion.div>
  )
}

export default LoadingComponent;
