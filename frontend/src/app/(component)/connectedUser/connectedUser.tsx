'use client'
import React, {useEffect, useRef, useState} from 'react'
import styles from "./connectedUser.module.css"
import {useRouter} from "next/navigation";
import {getProfilePicture, postProfilePicture} from "@/app/auth/auth.api";
import LoadingPage from "@/app/(component)/loadingPage/loadingPage";



interface connectedUserProps {

}

const ConnectedUser: React.FC<connectedUserProps> = ({}) => {
    let userLog: any[] = [];
    const divRef:  React.MutableRefObject<any> = useRef();
    const {push , refresh} = useRouter();
    const [newData, setNewData] = useState<number>(0);

    useEffect(() => {
        setInterval(() => {
            setNewData(newData + 1);
        }, 5000)
    }, []);

    useEffect(() => {
        const local = localStorage.getItem('connectedUser');
        let html = ` <style>
                          .userlogp {
                            font-size: 1.1rem;
                            font-weight: 500;
                          }
                          .userlogcontainer {
                            display: flex;
                            flex-direction: row;
                            gap: 10px;
                            cursor: pointer;
                          }
                          .img {
                            width: 50px;
                            height: 50px;
                            object-fit: cover;
                            border-radius: 50px;
                          }
                        </style>`;
        if (window != undefined && local) {
            userLog = JSON.parse(localStorage.getItem('connectedUser')!);
            for (let i = 0; userLog[i]; i++) {
                postProfilePicture(userLog[i].id).then((img) => {
                    html += `<div class="userlogcontainer" id="${userLog[i].id}">
                                <Image class="img" src='data:image/png;base64,${img?.data}'/>
                                <p class="userlogp">${userLog[i].displayname}</p>
                            </div>`;
                });
            }
            setTimeout(() => {
                if (divRef.current)
                    divRef.current.innerHTML = html;
                setTimeout(() => {
                    for (let i = 0; i < userLog.length; i++) {
                        let mySelectedElement = document.getElementById(userLog[i].id);
                        mySelectedElement?.addEventListener("click", function getHtml() {
                            push(`/dashboard/user/${userLog[i].id}`)
                        })
                    }
                }, 1000);
            },2000);
        } else {
            setTimeout(() => {
                refresh();
            }, 5000);
        }
    },[newData]);
  return (
		<div className={styles.container} ref={divRef}>
            <LoadingPage />
		</div>
  )
}

export default ConnectedUser;
