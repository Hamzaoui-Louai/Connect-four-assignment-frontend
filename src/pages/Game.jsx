import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import PlayerGameCard from "../components/PlayerGameCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createGameSocket } from "../api/gameSocket";

function hasWinner(grid, token) {
  const directions = [
    [1, 0],
    [0, 1],
    [1, 1],
    [1, -1],
  ];

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col] !== token) {
        continue;
      }

      for (const [dr, dc] of directions) {
        let streak = 1;

        for (let step = 1; step < 4; step++) {
          const nextRow = row + dr * step;
          const nextCol = col + dc * step;

          if (
            nextRow < 0 ||
            nextRow >= grid.length ||
            nextCol < 0 ||
            nextCol >= grid[row].length ||
            grid[nextRow][nextCol] !== token
          ) {
            break;
          }

          streak++;
        }

        if (streak === 4) {
          return true;
        }
      }
    }
  }

  return false;
}

function ConnectFourBoard() {
  return (
    <svg
      viewBox="0 0 740 680"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        maxWidth: '95vw',
        maxHeight: '95vh',
        zIndex: 1,
      }}
    >
      <defs>
        <linearGradient id="boardGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0077e6" />
          <stop offset="100%" stopColor="#0044aa" />
        </linearGradient>

        <mask id="holes">
          <rect x="0" y="0" width="740" height="680" fill="white" />
          {/* Row 0 */}
          <circle cx="70" cy="70" r="42" /><circle cx="170" cy="70" r="42" /><circle cx="270" cy="70" r="42" />
          <circle cx="370" cy="70" r="42" /><circle cx="470" cy="70" r="42" /><circle cx="570" cy="70" r="42" /><circle cx="670" cy="70" r="42" />
          {/* Row 1 */}
          <circle cx="70" cy="170" r="42" /><circle cx="170" cy="170" r="42" /><circle cx="270" cy="170" r="42" />
          <circle cx="370" cy="170" r="42" /><circle cx="470" cy="170" r="42" /><circle cx="570" cy="170" r="42" /><circle cx="670" cy="170" r="42" />
          {/* Row 2 */}
          <circle cx="70" cy="270" r="42" /><circle cx="170" cy="270" r="42" /><circle cx="270" cy="270" r="42" />
          <circle cx="370" cy="270" r="42" /><circle cx="470" cy="270" r="42" /><circle cx="570" cy="270" r="42" /><circle cx="670" cy="270" r="42" />
          {/* Row 3 */}
          <circle cx="70" cy="370" r="42" /><circle cx="170" cy="370" r="42" /><circle cx="270" cy="370" r="42" />
          <circle cx="370" cy="370" r="42" /><circle cx="470" cy="370" r="42" /><circle cx="570" cy="370" r="42" /><circle cx="670" cy="370" r="42" />
          {/* Row 4 */}
          <circle cx="70" cy="470" r="42" /><circle cx="170" cy="470" r="42" /><circle cx="270" cy="470" r="42" />
          <circle cx="370" cy="470" r="42" /><circle cx="470" cy="470" r="42" /><circle cx="570" cy="470" r="42" /><circle cx="670" cy="470" r="42" />
          {/* Row 5 */}
          <circle cx="70" cy="570" r="42" /><circle cx="170" cy="570" r="42" /><circle cx="270" cy="570" r="42" />
          <circle cx="370" cy="570" r="42" /><circle cx="470" cy="570" r="42" /><circle cx="570" cy="570" r="42" /><circle cx="670" cy="570" r="42" />
        </mask>
      </defs>

      {/* Legs */}
      <rect x="80" y="620" width="60" height="40" rx="4" fill="#003380" />
      <rect x="600" y="620" width="60" height="40" rx="4" fill="#003380" />
      <rect x="60" y="655" width="620" height="15" rx="5" fill="#002255" />

      {/* Board face */}
      <rect
        x="20"
        y="20"
        width="700"
        height="600"
        rx="40"
        fill="url(#boardGrad)"
        mask="url(#holes)"
        stroke="#003380"
        strokeWidth="8"
      />

      {/* Plastic sheen highlight */}
      <rect
        x="28"
        y="28"
        width="684"
        height="584"
        rx="32"
        fill="none"
        stroke="#4d94ff"
        strokeWidth="2"
        opacity="0.35"
      />
    </svg>
  );
};

function ConnectFourPiece({ color, x, y }) {
    const playSound = () => {
        const audio = new Audio('/Clicking sound.mp3');
        audio.play();
    };

    return (
        <div onAnimationEnd={playSound} className="piece-drop-animation" style={{ position: 'absolute', left: x - 42, top: y - 40, width: 55, height: 55 }}>
            <div style={{ width: '100%', height: '100%', backgroundColor: color, borderRadius: '50%' }} />
        </div>
    );
}

function ConnectFourGrid({ grid }) {
    return (
        <>
        {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) =>
                cell !== 0 ? (
                    <ConnectFourPiece
                        key={`${rowIndex}-${colIndex}`}
                        color={cell === 1 ? '#dd1111' : '#dddd11'}
                      x={200 + colIndex * 65}
                      y={464 - rowIndex * 65}
                    />
                ) : null
            )
        )}
        </>
    )
}

function ConnectFourClickable({play1, play2, play3, play4, play5, play6, play7}) {
    return (
        <div className="absolute left-39 z-20 top-22 flex flex-row justify-between items-center w-md h-100">
            <div className="w-14 cursor-pointer h-100" onClick={play1}></div>
            <div className="w-14 cursor-pointer h-100" onClick={play2}></div>
            <div className="w-14 cursor-pointer h-100" onClick={play3}></div>
            <div className="w-14 cursor-pointer h-100" onClick={play4}></div>
            <div className="w-14 cursor-pointer h-100" onClick={play5}></div>
            <div className="w-14 cursor-pointer h-100" onClick={play6}></div>
            <div className="w-14 cursor-pointer h-100" onClick={play7}></div>
        </div>
    )
}

function Game() {
  const navigate = useNavigate();
  const [grid, setGrid] = useState([[0,0,0,0,0,0,0], [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], [0,0,0,0,0,0,0]]); // 6 rows, 7 columns
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);
  const socketRef = useRef(null);
  const gameOverRef = useRef(false);

  const finishGame = (winnerLabel) => {
    if (gameOverRef.current) {
      return;
    }

    gameOverRef.current = true;
    setIsGameOver(true);
    setIsPlayerTurn(false);
    socketRef.current?.cancelReminder();

    toast.success(`${winnerLabel} wins!`, {
      autoClose: 2200,
      onClose: () => {
        navigate("/");
      },
    });
  };

  useEffect(() => {
    const socketClient = createGameSocket({
      onOpen: () => {
        toast.success("Connected to game server.");
      },
      onClose: () => {
        toast.info("Disconnected from game server.");
      },
      onError: () => {
        toast.error("Socket error while syncing game.");
      },
      onMessage: (message) => {
        if (gameOverRef.current) {
          return;
        }

        if (!message || typeof message !== "object") {
          return;
        }

        if (message.counter === 2 && Array.isArray(message.grid)) {
          socketRef.current?.cancelReminder();
          setGrid(message.grid);

          if (hasWinner(message.grid, 1)) {
            finishGame("Bot");
            return;
          }

          setIsPlayerTurn(true);
        }
      },
    });

    socketRef.current = socketClient;
    socketClient.connect();

    return () => {
      socketClient.disconnect();
      socketRef.current = null;
    };
  }, []);

  function playMove(col) {
      if (isGameOver || gameOverRef.current) {
        return;
      }

      if (!isPlayerTurn) {
        toast.info("It's not your turn!");
        return;
      }

        const colIndex = col - 1;
        
        if (colIndex < 0 || colIndex > 6) {
          throw new Error(`Invalid column ${col}. Column must be between 1 and 7.`);
        }

        const nextGrid = grid.map((row) => [...row]);
        let placed = false;

        for (let rowIndex = 0; rowIndex < nextGrid.length; rowIndex++) {
            if (nextGrid[rowIndex][colIndex] === 0) {
                nextGrid[rowIndex][colIndex] = 2;
                placed = true;
                break;
            }
        }

        if (!placed) {
            toast.error(`Column ${col} is full.`);
            return;
        }

        setGrid(nextGrid);

        if (hasWinner(nextGrid, 2)) {
          finishGame("Player");
          return;
        }

        setIsPlayerTurn(false);

        const payload = { grid: nextGrid, counter: 1 };
        const sent = socketRef.current?.sendGridUpdate(payload);

        if (!sent) {
            toast.error("Unable to send move. Socket is not connected.");
          setIsPlayerTurn(true);
            return;
        }

        socketRef.current?.scheduleReminder({
            ...payload,
            delayMs: 4000,
            onReminderSent: () => {
                toast.info("Reminder sent to server.");
            },
        });
        }

    return (
    <main className="absolute left-0 top-0 flex h-screen w-screen items-center justify-center p-4 backdrop-blur-sm">
        <div className="flex items-center justify-end h-full w-2/10">
            <PlayerGameCard isPlayer={false} isOnTurn={!isPlayerTurn} />
        </div>
        <div className="flex items-center justify-center h-full w-8/10 ">
            <section className="relative flex h-8/10 w-7/10 flex-col gap-10 items-center justify-center rounded-4xl bg-[#1e1e1e] p-20">
	    	    <ConnectFourBoard />
                <ConnectFourGrid grid={grid} />
                <ConnectFourClickable 
                    play1={() => playMove(1)}
                    play2={() => playMove(2)}
                    play3={() => playMove(3)}
                    play4={() => playMove(4)}
                    play5={() => playMove(5)}
                    play6={() => playMove(6)}
                    play7={() => playMove(7)}
                />
	        </section>
        </div>
        <div className="flex items-center justify-start h-full w-2/10">
            <PlayerGameCard isPlayer={true} isOnTurn={isPlayerTurn} />
        </div>
    	    <ToastContainer position="top-center" autoClose={1800} theme="dark" />
	</main>
    )
}

export default Game;