'use client'
import React from 'react';
import {useParams} from "next/navigation";
import styles from './channelMessage.module.css'

interface ChannelProps {
}

const Channel: React.FC<ChannelProps> = ({}) => {
    const uniqueIdentifier = useParams()['channel'].slice(8);

    return (
        <div className={styles.container}>
            {uniqueIdentifier}
        </div>
    )
}

export default Channel;
