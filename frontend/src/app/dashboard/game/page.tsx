"use client"

import React, { useEffect, useRef, useState } from 'react';
import styles from "./game.module.css";
import { gameLose } from "@/app/auth/auth.api";
import { io } from 'socket.io-client';


interface GameProps {
}

const Game: React.FC<GameProps> = () => {
const canvasRef = useRef<HTMLCanvasElement | null>(null);

const [paddleY, setPaddleY] = useState(200); // Position initiale de la raquette
const [paddle2Y, setPaddle2Y] = useState(200); // Position initiale de la raquette du joueur 2

const [playerScore, setPlayerScore] = useState(0); 
const [player2Score, setPlayer2Score] = useState(0); 

const [ballPosition, setBallPosition] = useState({x: 400, y: 200}); // Initial ball position
const [ballSpeed, setBallSpeed] = useState({dx: 5, dy: 0}); // Initial ball speed

const [gameStatus, setGameStatus] = useState("notStarted"); // New state to control the game status
  
  const startGame = () => {
  setGameStatus("running");
  };

const resetGame = () => {
  setBallPosition({x: 350, y: 200});
  setBallSpeed({dx: 5, dy: 0});
  }

const resetWholeGame = () => {
  setBallPosition({x: 350, y: 200});
  setBallSpeed({dx: 5, dy: 0});
  setGameStatus("running");
  setPlayerScore(0);
  setPlayer2Score(0);
  }

  useEffect(() => {

  if(gameStatus === "notStarted" || gameStatus === "finished") {
    return; 
    }
    const interval = setInterval(() => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;

    let newX = ballPosition.x + ballSpeed.dx;
        let newY = ballPosition.y + ballSpeed.dy;
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
      resetGame();
    }
    else if (newX + ballSpeed.dx < 10) //but player 2
    {
      setPlayer2Score(player2Score + 1);
      resetGame();
    }
    else if (newX + ballSpeed.dx > canvas.width-10 || newX + ballSpeed.dx < 10) //collision mur
      setBallSpeed(prev => ({ dx: -prev.dx, dy: prev.dy }));
    else if (newY + ballSpeed.dy > canvas.height-10 || newY + ballSpeed.dy < 10)
      setBallSpeed(prev => ({ dx: prev.dx, dy: -prev.dy }));
  
    // Player 2 follows the ball
    setPaddle2Y(ballPosition.y - 50);

    if (playerScore >= 10 || player2Score >= 10) {
      if (player2Score >= 10)
        gameLose().then((res) => {
          console.log(res);
        });
      setGameStatus("finished");
      clearInterval(interval);
      }
    }
  }, 10);
  return () => {
    clearInterval(interval);
    };
  }, [ballPosition, ballSpeed, paddleY, gameStatus]);


useEffect(() => { // mouvements souris 
    const handleMouseMove = (event: MouseEvent) => {
      let newY = event.clientY - 280; // -280 pour aligner la souris et la barre, trouvaille empirique
      
      if (canvasRef.current) {
        // Ne depasse pas les rebords
        newY = Math.max(newY, 10);
        newY = Math.min(newY, canvasRef.current.height - 110);
      }
      setPaddleY(newY);
    };

  //recupere input souris
    if (canvasRef.current) { 
      canvasRef.current.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (canvasRef.current) {
        canvasRef.current.removeEventListener('mousemove', handleMouseMove); // nettoyage
      }
    };
  }, [gameStatus]);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
    context.clearRect(0, 0, canvas.width, canvas.height); // nettoie le canvas pour actualiser les positions
        // Dessine le contour du terrain
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
    context.arc(ballPosition.x, ballPosition.y, 10, 0, Math.PI * 2, false);
    context.fill();

        // Réinitialise les paramètres de ligne pour les prochains dessins
        context.setLineDash([]); //contour plein et non pointillé
      }
    }
  }, [paddleY, ballPosition]);

  useEffect(() => {
	  setInterval(() => {
		  let vw = Math.max(window.innerWidth);
		  let scale = vw / 1000 > 0.99 ? 1 : vw / 1000;
		  console.log(vw, scale)
		  canvasRef.current ? canvasRef.current.style.transform = String('scale(' + scale  + ')') : undefined;
	  }, 1500);
  },[])

  return (
    <div className={styles.container}>
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
          <>
            {gameStatus !== "running" && (
              <button
                className={styles.buttonGame}
                onClick={startGame}
                disabled={gameStatus === "running"}
              >
              Start Game
              </button>
            )}
            {gameStatus === "running" && (
              <div className={styles.scoreBoard}>
                <div>Player 1 Score: {playerScore}</div>
                <div>Player 2 Score: {player2Score}</div>
        <div>Ball x: {ballSpeed.dx} Ball y: {ballSpeed.dy} </div>
              </div>
            )}
            <canvas ref={canvasRef}  width={800} height={400} className={styles.canvas}/>
          </>
        )}
      </div>
    </div>
  );
};

export default Game;