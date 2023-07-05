import React from "react";
import {motion} from "framer-motion";
import styles from "./error.module.css";

interface ErrorNotificationProps {
    headerText: string;
    error: string;

}

const ErrorNotification: React.FC<ErrorNotificationProps> = ({headerText, error}) => {

    return (
        <motion.div className={styles.container}
                    initial={{x: +200}}
                    animate={{x: 0}}
                    transition={{duration: 0.3}}
        >
            <h1 className={styles.h1}>{headerText}</h1>
            <span className={styles.span}>{error}</span>
        </motion.div>
    )
}

export default ErrorNotification;