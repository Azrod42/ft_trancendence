"use client";
import React, {useEffect, useRef, useState} from "react";
import { Category } from "@/app/dashboard/social/chat-home/chatHomeComponent";
import styles from "@/app/dashboard/social/chat-home/chatHome.module.css";
import { getUserChannel } from "@/app/dashboard/social/social.api";
import { useQuery } from "react-query";
import { useRouter } from "next/navigation";
import { useTransform } from "framer-motion";
import Image from "next/image";

export const ChannelCategory: React.FC = () => {
  const { push } = useRouter();
  const [userChannel, setUserChannel] = useState<any>();

  const { isLoading, error, data, refetch } = useQuery(
    "getUserChannel",
    () =>
      getUserChannel().then((res) => {
        const dta = JSON.parse(JSON.stringify(res.data!));
        setUserChannel(res.data!);
      }),
    { staleTime: 5000, refetchInterval: 1000 * 2, refetchOnWindowFocus: false }
  );
  useEffect(() => {
    if (refPublic.current) {
      let htmlPu: string = `
							<style>
								.styleItem{
								display: flex;
								flex-direction: row;
								gap: 15px;
								justify-content: flex-start;
								align-items: center;
								}
							</style>`;
      let htmlPr: string = htmlPu;
      let htmlPro: string = htmlPu;
      let nuPu = 0,
          nuPr = 0,
          nuPro = 0;

      if (!userChannel) return;
      for (let i = 0; userChannel[i]; i++) {
        if (userChannel[i].type == 1) {
          nuPu += 1;
          htmlPu += ` 
							<div class='styleItem' id='${userChannel[i].id}'>
							<Image src='/media/logo42_32x32.png' alt='logo-channel' width={32} height={32}/>
							<div>${userChannel[i].channelname}</div>
							</div>`;
        }
        if (userChannel[i].type == 2) {
          nuPr += 1;
          htmlPr += `
							<div class='styleItem' id='${userChannel[i].id}'>
							<Image src='/media/logo42_32x32.png' alt='logo-channel' width={32} height={32}/>
							<div>${userChannel[i].channelname}</div>
							</div>`;
        }
        if (userChannel[i].type == 3) {
          nuPro += 1;
          htmlPro += `
							<div class='styleItem' id='${userChannel[i].id}'>
							<Image src='/media/logo42_32x32.png' alt='logo-channel' width={32} height={32}/>
							<div>${userChannel[i].channelname}</div>
							</div>`;
        }
      }
      if (htmlPu != "") {
          refPublic.current.innerHTML! = htmlPu;
          refPublicNu.current.innerText! = "(" + nuPu.toString() + ")";

          refProtected.current.innerHTML! = htmlPro;
          refProtectedNu.current.innerText! = "(" + nuPro.toString() + ")";;

          refPrivate.current.innerHTML! = htmlPr;
          refPrivateNu.current.innerText = "(" + nuPr.toString() + ")";

      }
      setTimeout(() => {
        for (let i = 0; userChannel[i]; i++) {
          let mySelectedElement = document.getElementById(userChannel[i].id);
          mySelectedElement?.addEventListener("click", function getHtml() {
            push(`/dashboard/social/channel/${userChannel[i].id}`);
          });
        }
      },500)
    }
  }, [userChannel]);


  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isOpen3, setIsOpen3] = useState(false);


  const refPublic:  React.MutableRefObject<any> = useRef();
  const refPublicNu:  React.MutableRefObject<any> = useRef();
  const refProtected:  React.MutableRefObject<any> = useRef();
  const refProtectedNu:  React.MutableRefObject<any> = useRef();
  const refPrivate:  React.MutableRefObject<any> = useRef();
  const refPrivateNu:  React.MutableRefObject<any> = useRef();


    return (
    <div className={styles.container}>
      <div className={styles.category} onClick={() => setIsOpen(!isOpen)}>
        <div className={styles.name}>
          <p>Public Channels</p>
          <p ref={refPublicNu}>(0)</p>
        </div>
        <Image
            className={styles.arrow}
            src="/media/arrow.png"
            width={13}
            height={7}
            alt="arrow"
            style={{ transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)" }}
        />
      </div>
      <div className={styles.channelUnit}>
        {isOpen && (
            <div ref={refPublic}>
            </div>
        )}
      </div>
      <div className={styles.category} onClick={() => setIsOpen2(!isOpen2)}>
        <div className={styles.name}>
          <p>Protected Channels</p>
          <p ref={refProtectedNu}>(0)</p>
        </div>
        <Image
            className={styles.arrow}
            src="/media/arrow.png"
            width={13}
            height={7}
            alt="arrow"
            style={{ transform: isOpen2 ? "rotate(0deg)" : "rotate(-90deg)" }}
        />
      </div>
      <div className={styles.channelUnit}>
        {isOpen2 && (
            <div ref={refProtected}>
            </div>
        )}
      </div>
      <div className={styles.category} onClick={() => setIsOpen3(!isOpen3)}>
        <div className={styles.name}>
          <p>Private Channels</p>
          <p ref={refPrivateNu}>(0)</p>
        </div>
        <Image
            className={styles.arrow}
            src="/media/arrow.png"
            width={13}
            height={7}
            alt="arrow"
            style={{ transform: isOpen3 ? "rotate(0deg)" : "rotate(-90deg)" }}
        />
      </div>
      <div className={styles.channelUnit}>
        {isOpen3 && (
            <div ref={refPrivate}>
            </div>
        )}
      </div>
    </div>
  );
};
