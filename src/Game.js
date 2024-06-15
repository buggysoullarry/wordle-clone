import React, { useState, useEffect, useRef } from "react";
import StatusBar from "./components/StatusBar";
import { FaPuzzlePiece } from "react-icons/fa";
import { notify } from "./notification"; // Import the notify function
import Keyboard from "./components/Keyboard";
import { validWords } from "./validWords";
import { possibleAnswers } from "./possibleAnswers";
import { getStats, updateStats, resetStats, getAverageGuesses } from "./utils/stats";

import EndGameModal from "./components/EndGameModal";

const Game = () => {
  const [grid, setGrid] = useState(
    Array(6)
      .fill("")
      .map(() => Array(5).fill({ letter: "", color: "" }))
  );
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  const [currentWord, setCurrentWord] = useState("");
  const [stats, setStats] = useState(getStats());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [solution, setSolution] = useState("");
  const [gameStatus, setGameStatus] = useState("");
  const [usedLetters, setUsedLetters] = useState({ correct: [], incorrect: [], notInWord: [] });
  const [animatingCells, setAnimatingCells] = useState([]); // State to track animating cells
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
    setUsedLetters({ correct: [], incorrect: [], notInWord: [] }); // Reset usedLetters
    setSolution(possibleAnswers[Math.floor(Math.random() * possibleAnswers.length)]);
    gridRef.current.focus();
  };

  useEffect(() => {
    setSolution(possibleAnswers[Math.floor(Math.random() * possibleAnswers.length)]);
  }, []);

  useEffect(() => {
    console.log(solution);
  }, [solution]);

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
          animateRow(currentRow, currentWord);
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

  const animateRow = (rowIndex, word) => {
    const updatedGrid = [...grid];
    const newUsedLetters = { ...usedLetters };
    let isCorrect = true;

    const animateCell = (colIndex) => {
      if (colIndex < 5) {
        const letter = word[colIndex];
        setAnimatingCells((prev) => [...prev, { row: rowIndex, col: colIndex }]);
        setTimeout(() => {
          if (letter === solution[colIndex]) {
            updatedGrid[rowIndex][colIndex].color = "bg-customGreen text-white";
            newUsedLetters.correct.push(letter);
          } else if (solution.includes(letter)) {
            updatedGrid[rowIndex][colIndex].color = "bg-customBlue text-white";
            newUsedLetters.incorrect.push(letter);
            isCorrect = false;
          } else {
            updatedGrid[rowIndex][colIndex].color = "bg-zinc-500 text-white";
            newUsedLetters.notInWord.push(letter);
            isCorrect = false;
          }
          setAnimatingCells((prev) => prev.filter((cell) => !(cell.row === rowIndex && cell.col === colIndex)));
          setGrid(updatedGrid);
        }, 300); // Delay for the color change to align with the flip animation

        setTimeout(() => {
          animateCell(colIndex + 1);
        }, 400); // Delay for the next cell animation
      } else {
        setUsedLetters(newUsedLetters);
        if (isCorrect) {
          setCurrentRow((prevRow) => prevRow + 1); // Increment the row to reflect the winning attempt
          setGameStatus("You win!");
          updateStats(currentRow + 1, true); // Update the stats with the number of guesses
          setStats(getStats()); // update the stats state
          setIsModalOpen(true); // Open the modal
        } else if (currentRow === 5) {
          setGameStatus(`You lost! The word was ${solution}.`);
          updateStats(currentRow + 1, false); // Update stats with loss status
          setStats(getStats()); // Refresh the stats state
          setIsModalOpen(true); // Open the modal
          setCurrentRow((prevRow) => prevRow + 1);
        } else {
          setCurrentRow((prevRow) => prevRow + 1);
          setCurrentCol(0);
          setCurrentWord("");
        }
      }
    };

    animateCell(0);
  };

  return (
    <div className="flex flex-col items-center justify-center bg-indigo-50">
          {gameStatus ? (
        <div className="flex  md:text-sm text-xs gap-2 pt-1">
          <a href={`https://www.dictionary.com/browse/${solution}`} target="_blank" rel="noreferrer" >
            Answer: <span className="underline ml-1"> {solution}</span>
          </a>
          <button onClick={() => resetGame()} className="md:text-sm text-xs text-customBlue">
            play again?
          </button>
        </div>
      ) : null}
      <StatusBar currentRow={currentRow} gameStatus={gameStatus} />
      <div className=" text-xs">{solution}</div>
    

      <div ref={gridRef} className="grid gap-1 focus:outline-none" tabIndex={0} onKeyDown={(e) => handleKeyPress(e.key)} onFocus={(e) => e.target.focus()}>
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`md:size-16 size-8 border-black border  ${cell.color} flex items-center justify-center md:text-2xl text-lg font-bold ${
                  animatingCells.some((c) => c.row === rowIndex && c.col === colIndex) ? "flip" : ""
                }`}
              >
                {cell.letter}
              </div>
            ))}
          </div>
        ))}
      </div>
      <Keyboard usedLetters={usedLetters} onKeyClick={handleKeyPress} />
      <EndGameModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        gameStatus={gameStatus}
        stats={stats}
        resetGame={() => {
          setIsModalOpen(false);
          resetGame();
        }}
      />
    </div>
  );
};

export default Game;
