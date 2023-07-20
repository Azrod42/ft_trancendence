"use client"

import React, {useContext, useEffect, useRef, useState} from 'react';
import styles from "./room.module.css";
import {useParams, useRouter} from "next/navigation";
import {WebsocketContext} from "@/app/(common)/WebsocketContext";
import {getPlayerSlot, getSlot, getUserInfo, PublicUserResponse, UserAuthResponse} from "@/app/auth/auth.api";
import {useQuery} from "react-query";
import {mockSession} from "next-auth/client/__tests__/helpers/mocks";
import { gameLose } from "@/app/auth/auth.api";
import {createContext} from 'react';
import { Socket} from 'socket.io-client';
import * as io from 'socket.io-client';
import { socket as sock } from '@/app/socket'


const socket = sock.connect();

interface RoomProps {
}

export type DataEndGame = {
  idGame: string;
  idWinner: string;
  idLoser: string;
  scoreWinner: number;
  scoreLoser: number;
};

const Room: React.FC<RoomProps> = () => {
  const refDiv: React.MutableRefObject<any> = useRef();

  const refAll: React.MutableRefObject<any> = useRef();

  const [initRoom, setinitRoom] = useState<boolean>(false);
  const [initMouse, setinitMouse] = useState<number>(0);

  const uniqueIdentifier = useParams()['room'][0];

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [mainPlayer, setMainPlayer] = useState<string | null>(null);
  const [count, setCount] = useState(0);
  const [playerSlot, setPlayerSlot] = useState<number>(0);


  const [paddleY, setPaddleY] = useState(200); // Position initiale de la raquette
  const [paddle2Y, setPaddle2Y] = useState(200); // Position initiale de la raquette du joueur 2
  const [inputData, setInputData] = useState<{ socketId: string, idRoom: string, currentUserId :string, currentUserName: string} | null>(null);
  const [playerScore, setPlayerScore] = useState(0); 
  const [player2Score, setPlayer2Score] = useState(0); 
  
  const [ballPosition, setBallPosition] = useState({x: 400, y: 200}); // Initial ball position
  const [ballSpeed, setBallSpeed] = useState({dx: 5, dy: 2}); // Initial ball speed
  
  const [gameStatus, setGameStatus] = useState("notStarted"); // New state to control the game status
  const [isBlack, setIsBlack] = useState(false);
  const [ballForm, setBallForm] = useState(false);


  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-
  //GET USERS DATA FROM BACKEND AND DISPLAY IT
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
    if (userData == undefined) {
      refetch()
    }
    // console.log(`This is userData.gameNumber = ${userData?.gameNumber}`)
  })
  useEffect(() => {
      getSlot().then((res) => {
        const slot: any =  res?.data['slot'];
        // console.log(slot);
        if (slot == 1 || slot == 2)
          setPlayerSlot(res?.data['slot']);
      })
  },[])
  useEffect(() => {
    console.log(playerSlot);
  }, [playerSlot])
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-
  useEffect(() => {
    console.log(socket)
  },[socket]);

  useEffect(() => {
    if (!initRoom && socket.connected) {
      setinitRoom(true);
        // socket.emit('gameRoom', `${uniqueIdentifier}`);
        socket.on(`global`, (data) => {
          console.log(playerSlot, data);
          if (data?.roomID == uniqueIdentifier) {
            if (data?.data?.status == 'ready') {
              console.log('ready');
            }
            if (data?.status == 'ready')
              console.log('A player is ready')
            if (data?.status == 'game') {
              console.log(data?.game);
              setGameStatus("running");
            }
            if (playerSlot == 2 && data?.data?.status == 'ballPosition') {
              console.log("ballPosition");
              setBallPosition(data?.data?.ballPosition);
            }
            if (playerSlot == 2 && data?.data?.status == 'paddleY') {
              setPaddleY(data?.data?.paddleY);
            }
            if (playerSlot == 1 && data?.data?.status == 'paddle2Y') {
              setPaddle2Y(data?.data?.paddle2Y);
            }
            return () => {
              socket.off("global");
            }
          }
      })

      if (canvasRef.current && initMouse < 1) {
        // console.log("MOUSE TRACK")
        setinitMouse(initMouse + 1);
        canvasRef.current.addEventListener('mousemove', (data: any) => {
          if (userData?.username) {
            // console.log("SEND", uniqueIdentifier, userData?.username, data.screenY)
            socket.emit('move', {idRoom: uniqueIdentifier, user: userData?.username, y: data?.screenY})
          }
          let newY = data?.screenY - 350;
          if (canvasRef.current) {
            // Ne depasse pas les rebords
            newY = Math.max(newY, 10);
            newY = Math.min(newY, canvasRef.current.height - 110);
          }
          if (playerSlot === 1)
            setPaddleY(newY);
          else if (playerSlot === 2)
            setPaddle2Y(newY);
        });
      }
    }
  },[socket]);
// useEffect(() => {
//     // return () => {
//     //   socket.off("global");
// }},[])


  useEffect(() => {
    if (playerSlot == 1) {
      console.log('upd');
      socket.emit(`room-data`, {id: uniqueIdentifier, data: {status: 'ballPosition', ballPosition: ballPosition}});
    }
  },[ballPosition]);

  // useEffect(() => { // mouvements souris
  //
  //   if (canvasRef.current && initMouse < 1) {
  //     // console.log("MOUSE TRACK")
  //     setinitMouse(initMouse + 1);
  //     canvasRef.current.addEventListener('mousemove', (data: any) => {
  //         if (userData?.username) {
  //           // console.log("SEND", uniqueIdentifier, userData?.username, data.screenY)
  //           socket.emit('move', {idRoom: uniqueIdentifier, user: userData?.username, y: data?.screenY})
  //         }
  //         let newY = data?.screenY - 350;
  //         if (canvasRef.current) {
  //           // Ne depasse pas les rebords
  //           newY = Math.max(newY, 10);
  //           newY = Math.min(newY, canvasRef.current.height - 110);
  //         }
  //         if (playerSlot === 1)
  //           setPaddleY(newY);
  //         else if (playerSlot === 2)
  //           setPaddle2Y(newY);
  //   });
  //   }
  // });


  ////////////////////////////////////////////////////////
  
  function debounce(fn: (...args: any[]) => void, delay: number): (...args: any[]) => void {
    let timer: NodeJS.Timeout | null = null;
    return function(...args: any[]) {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  }
  
  const setDebouncedPaddleY = debounce(setPaddleY, 20);
  const setDebouncedPaddle2Y = debounce(setPaddle2Y, 20);

  

    const startGame = () => {
    setGameStatus("running");
    };
    const ready = () => {
      socket.emit(`room-data`, {id: uniqueIdentifier, status: 'ready', data: {ready: userData?.id}});
    };
  
  const resetGame = (num: number) => {
    setBallPosition({x: 350, y: generateRandomHeighStart()});
    if (num === 2)
      setBallSpeed({dx: -5, dy: generateRandomYDirection()});
    else
      setBallSpeed({dx: 5, dy: generateRandomYDirection()});
    }
  
  const resetWholeGame = () => {
    setBallPosition({x: 350, y: 200});
    setBallSpeed({dx: 5, dy: generateRandomYDirection()});
    setGameStatus("running");
    setPlayerScore(0);
    setPlayer2Score(0);
    }

    const generateRandomYDirection = () => {
      let randomY = Math.random() * 10 - 5; // -5 a 5
    
      // Arrondit à deux décimales
      randomY = Math.round(randomY * 100) / 100;
    
      return randomY;
    };
    const generateRandomHeighStart = () => {
      let randomY = Math.random() * 400; // 0 a 400;
      randomY = Math.round(randomY * 100) / 100;
      return randomY;
    };
  
    useEffect(() => {
  
    if(gameStatus === "notStarted" || gameStatus === "finished") {
      return; 
      }
      const interval = setInterval(() => {
        if (canvasRef.current) {
          const canvas = canvasRef.current;
  
      let newX = ballPosition.x + ballSpeed.dx;
          let newY = ballPosition.y + ballSpeed.dy;
          if (playerSlot == 1)
          setBallPosition({x: newX, y: newY});
  
          if (newX < 40 && newY > paddleY - 10 && newY < paddleY + 120) // player 1 rebond
      {
        const hitLocation = newY - (paddleY + 50);
        let increasedSpeedX = Math.abs(ballSpeed.dx);
        if (increasedSpeedX < 35)
          increasedSpeedX = Math.abs(ballSpeed.dx) * 1.15;
        setBallSpeed({ dx: increasedSpeedX, dy: hitLocation / 5 });
      }
      else if (newX > canvas.width - 40 && newY > paddle2Y && newY < paddle2Y + 100) // player 2 rebond
      {
        const hitLocation = newY - (paddle2Y + 50);
        let increasedSpeedX = -Math.abs(ballSpeed.dx);
        if (increasedSpeedX > -35)
          increasedSpeedX = -Math.abs(ballSpeed.dx) * 1.15;
        setBallSpeed({ dx: increasedSpeedX, dy: hitLocation / 5 });
      }
      else if (newX + ballSpeed.dx > canvas.width-10) //but player 1
      {
        setPlayerScore(playerScore + 1);
        resetGame(1);
      }
      else if (newX + ballSpeed.dx < 10) //but player 2
      {
        setPlayer2Score(player2Score + 1);
        resetGame(2);
      }
      else if (newX + ballSpeed.dx > canvas.width-10 || newX + ballSpeed.dx < 10) //collision mur
        setBallSpeed(prev => ({ dx: -prev.dx, dy: prev.dy }));
      else if (newY + ballSpeed.dy > canvas.height-10 || newY + ballSpeed.dy < 10)
        setBallSpeed(prev => ({ dx: prev.dx, dy: -prev.dy }));
    
      // Player 2 follows the ball de maniere automatique
      // setPaddle2Y(ballPosition.y - 50);
  
      if (playerScore >= 5 || player2Score >= 5) {
        if (player2Score >= 5)
          gameLose().then((res) => {
            // console.log(res);
          });
        setGameStatus("finished");
        clearInterval(interval);
        }
      }
    }, 10);
    return () => {
      clearInterval(interval);
      };
    }, [ballPosition, ballSpeed, paddleY, paddle2Y, gameStatus]);

  
    useEffect(() => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
  
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height); // nettoie le canvas pour actualiser les positions
      if (isBlack) {
        context.fillStyle = '#000000'; 
        context.fillRect(0, 0, canvas.width, canvas.height);
      }

        context.strokeStyle = 'white'; // couleur contour
        context.strokeRect(0, 0, canvas.width, canvas.height); // contour
          
          //ligne de séparation du terrain
          context.beginPath();
          context.setLineDash([10, 5]);
          context.moveTo(canvas.width / 2, 0);
          context.lineTo(canvas.width / 2, canvas.height);
          context.stroke();
  
          // Raquette joueur 1
          context.fillStyle = '#FFFFFF';
      context.fillRect(20, paddleY, 15, 100);
  
      // Raquette joueur 2
      context.fillRect(canvas.width - 35, paddle2Y, 15, 100);
  
      //balle
          context.beginPath();
      if(ballForm)
          context.fillRect(ballPosition.x -7, ballPosition.y - 7, 15, 15);
      else
          context.arc(ballPosition.x, ballPosition.y, 10, 0, Math.PI * 2, false);

      context.fill();
  
          // Réinitialise les paramètres de ligne pour les prochains dessins
          context.setLineDash([]); //contour plein et non pointillé
        }
      }
    }, [paddleY, paddle2Y, ballPosition, isBlack, ballForm]);

  ////////////////////////////////////////////////////////////////////////////////////

//   useEffect(() => {
//     setInterval(() => {
//         let vw = Math.max(canvasRef.current?.clientWidth || 0,  window.innerWidth || 0);
//         let scale = vw / 1000 > 0.99 ? 1 : vw / 1000;
//         console.log(vw, scale)
//         canvasRef.current ? canvasRef.current.style.transform = String('scale(' + scale  + ')') : undefined;
//     }, 2000);
// },[])

  return (
    <div className={styles.container} ref={refDiv}>
      <h1>Game</h1>
      <div className={styles.contentGame}>
        {gameStatus === "finished" ? (
      <>
        <h2>Bravo à {playerScore == 3 ? (<h4>Player 1</h4>) : (<h4>Player 2</h4>)}</h2>
        <button
            className={styles.buttonGame}
            onClick={resetWholeGame}
            // disabled={gameStatus === "running"}
        >
        Rejouer ?
        </button>
      </>
        ) : (
          <div className={styles.containerCanvas}>

            {gameStatus !== "running" && (
                <>
                  <button
                    className={styles.buttonGame}
                    onClick={startGame}
                    disabled={gameStatus === "running"}
                  >
                  Start Game
                  </button>
                  <button
                      className={styles.buttonGame}
                      onClick={ready}
                      disabled={gameStatus === "running"}
                  >
                    Ready
                  </button>
                </>
            )}
            {gameStatus === "running" && (
              <div className={styles.scoreBoard}>
                <div>Player 1 Score: {playerScore}</div>
                <div>Player 2 Score: {player2Score}</div>
              </div>
            )}
            <canvas className={styles.canvas} ref={canvasRef} width={800} height={400} />
            <div className={styles.buttonMode}>
              <button className={styles.buttonGameMode} onClick={() => setIsBlack(!isBlack)}>Change Background</button>
              <button className={styles.buttonGameMode} onClick={() => setBallForm(!ballForm)}>Change Ball Form</button>
            </div>
            <div style={{ marginBottom: '200px' }}></div>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default Room;