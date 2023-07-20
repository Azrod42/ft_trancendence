'use client'

import React, { useEffect, useState, useRef, useContext } from 'react';
import styles from './matchmakingunranked.module.css';
import LoadingPage from "@/app/(component)/loadingPage/loadingPage";
import {getUserInfo, UserAuthResponse} from "@/app/auth/auth.api";
import {useRouter} from "next/navigation";
import {useQuery} from "react-query";
import { socket as sock } from '@/app/socket'



const socket = sock.connect();


interface MatchMakingRankedProps {}

const MatchMakingRanked: React.FC<MatchMakingRankedProps> = ({}) => {
    let [userData, setuserData] = useState<UserAuthResponse>();
    const { push, refresh } = useRouter();
    const { refetch } = useQuery('getUserInfo', () =>
        getUserInfo().then(res => {
            if (res == undefined)
                push('/');
            setuserData(res);
        }), { staleTime: 5000 }
    );
    useEffect(() => {
        if (userData?.id == undefined) {
            refetch()
        }
    })

    const [inter, setInter] = useState<boolean>(false);
    useEffect(() => {
        let inter: any;
        if (userData?.displayname && !inter) {
            setInter(true);
            inter = setInterval(() => {
                socket.emit(`mmU`, {id: userData?.id, data: {status: 'ready', data: true}});
            }, 2000);
        }
        return () => clearInterval(inter);
    },[userData])

    useEffect(() => {
        socket.on(`lunchU`, (data : any) => {
            pushRoom(data?.player1, data?.player2, data?.roomID);
        });
        return () => {
            socket.off('lunchU');
        }
    }, [])

    function pushRoom(p1: string, p2: string, roomID: string) {
        getUserInfo().then(res => {
            console.log(p1, res?.id, p2);
            if (p1 == res?.id) {
                push(`/dashboard/game/U${roomID}1`);
            } else if (p2 == res?.id) {
                push(`/dashboard/game/U${roomID}2`);
            }
        });
    }
    return (
        <div className={styles.container}>
            <p>Waiting for player</p>
            <LoadingPage />
        </div>
    );
};


export default MatchMakingRanked;
