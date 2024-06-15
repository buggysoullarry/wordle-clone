import React, { useState, useEffect, useRef } from "react";
import StatusBar from "./components/StatusBar";
import { FaPuzzlePiece } from "react-icons/fa";
import { notify } from "./notification"; // Import the notify function
import Keyboard from "./Keyboard";

const Game = () => {
  const [grid, setGrid] = useState(
    Array(6)
      .fill("")
      .map(() => Array(5).fill({ letter: "", color: "" }))
  );
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  const [currentWord, setCurrentWord] = useState("");
  const [validWords, setValidWords] = useState([]);
  const [solution, setSolution] = useState("");
  const [gameStatus, setGameStatus] = useState("");
  const [usedLetters, setUsedLetters] = useState({ correct: [], incorrect: [], notInWord: [] });
  //const [animatingCells, setAnimatingCells] = useState([]);
  const gridRef = useRef(null);

  const resetGame = () => {
    setGrid(
      Array(6)
        .fill("")
        .map(() => Array(5).fill({ letter: "", color: "" }))
    );
    setCurrentRow(0);
    setCurrentCol(0);
    setCurrentWord("");
    setGameStatus("");
    setSolution(validWords[Math.floor(Math.random() * validWords.length)]);
    //setSolution("STAGE");
    gridRef.current.focus();
  };

  useEffect(() => {
    fetch("/wordlist.txt")
      .then((response) => response.text())
      .then((data) => {
        const wordsArray = data.split("\n").map((word) => word.trim().toUpperCase());
        setValidWords(wordsArray);
        setSolution(wordsArray[Math.floor(Math.random() * wordsArray.length)]); // Select a random word as the solution
        //setSolution("STAGE");
      });
  }, []);

  useEffect(() => {
    gridRef.current.focus();
    console.log(solution);
  }, [solution]);

  const handleKeyPress = (key) => {
    if (gameStatus) return;

    if (key.match(/^[a-zA-Z]$/) && currentCol < 5) {
      const updatedGrid = [...grid];
      updatedGrid[currentRow][currentCol] = { letter: key.toUpperCase(), color: "" };
      setGrid(updatedGrid);
      setCurrentCol((prevCol) => prevCol + 1);
      setCurrentWord((prevWord) => prevWord + key.toUpperCase());
    } else if (key === "Enter") {
      if (currentCol === 5) {
        if (validWords.includes(currentWord)) {
          const updatedGrid = [...grid];
          const newUsedLetters = { ...usedLetters };
          let isCorrect = true;
          for (let i = 0; i < 5; i++) {
            if (currentWord[i] === solution[i]) {
              updatedGrid[currentRow][i].color = "bg-green-600 text-white";
              newUsedLetters.correct.push(currentWord[i]);
            } else if (solution.includes(currentWord[i])) {
              updatedGrid[currentRow][i].color = "bg-indigo-700 text-white";
              newUsedLetters.incorrect.push(currentWord[i]);
              isCorrect = false;
            } else {
              updatedGrid[currentRow][i].color = "bg-gray-500 text-white";
              newUsedLetters.notInWord.push(currentWord[i]);
              isCorrect = false;
            }
          }
          setGrid(updatedGrid);
          setUsedLetters(newUsedLetters);
          if (isCorrect) {
            setCurrentRow((prevRow) => prevRow + 1); // Increment the row to reflect the winning attempt
            setGameStatus("You win!");
          } else if (currentRow === 5) {
            setGameStatus(`You lost! The word was ${solution}.`);
          } else {
            setCurrentRow((prevRow) => prevRow + 1);
            setCurrentCol(0);
            setCurrentWord("");
          }
        } else {
          notify("Invalid word");
        }
      }
    } else if (key === "Backspace") {
      if (currentCol > 0) {
        const updatedGrid = [...grid];
        updatedGrid[currentRow][currentCol - 1] = { letter: "", color: "" };
        setGrid(updatedGrid);
        setCurrentCol((prevCol) => prevCol - 1);
        setCurrentWord((prevWord) => prevWord.slice(0, -1));
      }
    }
  };

  return (
    <div className=" flex flex-col items-center justify-center bg-indigo-50">
      <StatusBar currentRow={currentRow} gameStatus={gameStatus} />

      {gameStatus && (
        <div className="mt-2 text-center">
          <p className="text-lg font-bold">{gameStatus}</p>
          <button
            type="button"
            className="text-green-800 bg-[#F7BE38] hover:bg-[#F7BE38]/90 focus:ring-4 focus:outline-none focus:ring-[#F7BE38]/50 font-bold rounded-lg  px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#F7BE38]/50 mb-1 "
            onClick={resetGame}
          >
            <FaPuzzlePiece className="h-5 w-6 mr-1" />
            Play Again
          </button>
        </div>
      )}
      <div ref={gridRef} className="grid gap-2 focus:outline-none" tabIndex={0} onKeyDown={(e) => handleKeyPress(e.key)} onFocus={(e) => e.target.focus()}>
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1">
            {row.map((cell, colIndex) => (
              <div key={colIndex} className={`w-16 h-16 border ${cell.color} border-black flex items-center justify-center text-2xl font-bold `}>
                {cell.letter}
              </div>
            ))}
          </div>
        ))}
      </div>
      <Keyboard usedLetters={usedLetters} onKeyClick={handleKeyPress} />
    </div>
  );
};

export default Game;
