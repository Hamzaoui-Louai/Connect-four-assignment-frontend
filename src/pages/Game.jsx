import { useState } from "react";
import PlayerGameCard from "../components/PlayerGameCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    const [grid, setGrid] = useState([[0,0,0,0,0,0,0], [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], [0,0,0,0,0,0,0]]); // 6 rows, 7 columns
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);

    function playMove(col) {
        const colIndex = col - 1;
        
        if (colIndex < 0 || colIndex > 6) {
          throw new Error(`Invalid column ${col}. Column must be between 1 and 7.`);
        }
    
        setIsPlayerTurn(false);
        setGrid((prevGrid) => {
          const nextGrid = prevGrid.map((row) => [...row]);
        
          for (let rowIndex = 0; rowIndex < nextGrid.length; rowIndex++) {
            if (nextGrid[rowIndex][colIndex] === 0) {
              nextGrid[rowIndex][colIndex] = 2;
              return nextGrid;
            }
          }

          toast.error(`Column ${col} is full.`);
          return prevGrid;
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
                    play1={()=>{if (isPlayerTurn) playMove(1);else toast.info("It's not your turn!");}}
                    play2={()=>{if (isPlayerTurn) playMove(2);else toast.info("It's not your turn!");}}
                    play3={()=>{if (isPlayerTurn) playMove(3);else toast.info("It's not your turn!");}}
                    play4={()=>{if (isPlayerTurn) playMove(4);else toast.info("It's not your turn!");}}
                    play5={()=>{if (isPlayerTurn) playMove(5);else toast.info("It's not your turn!");}}
                    play6={()=>{if (isPlayerTurn) playMove(6);else toast.info("It's not your turn!");}}
                    play7={()=>{if (isPlayerTurn) playMove(7);else toast.info("It's not your turn!");}}
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