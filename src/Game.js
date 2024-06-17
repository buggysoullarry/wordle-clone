import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle, useCallback, useReducer } from "react";
import StatusBar from "./components/StatusBar";
import { notify } from "./notification";
import Keyboard from "./components/Keyboard";
import { validWords } from "./validWords";
import { possibleAnswers } from "./possibleAnswers";
import { getStats, updateStats } from "./utils/stats";
import Cookies from "js-cookie";

import { MdMenuBook } from "react-icons/md";

const lettersReducer = (state, action) => {
  switch (action.type) {
    case "addCorrect":
      return { ...state, correct: [...state.correct, action.payload] };
    case "addIncorrect":
      return { ...state, incorrect: [...state.incorrect, action.payload] };
    case "addNotInWord":
      return { ...state, notInWord: [...state.notInWord, action.payload] };
    case "RESET":
      return { correct: [], incorrect: [], notInWord: [] };
    case "RESTORE_STATE":
      return action.payload;
    default:
      throw new Error();
  }
};

// Function to create an empty grid
const createEmptyGrid = () =>
  Array(6)
    .fill("")
    .map(() => Array(5).fill({ letter: "", color: "" }));

const Game = forwardRef(({ setStats, setIsModalOpen, setGameStatus, isHardMode, gameStatus }, ref) => {
  const [usedLetters, dispatch] = useReducer(lettersReducer, { correct: [], incorrect: [], notInWord: [] });
  const [grid, setGrid] = useState(createEmptyGrid());
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  const [currentWord, setCurrentWord] = useState("");
  const [solution, setSolution] = useState("");

  const [animatingCells, setAnimatingCells] = useState([]); // State to track animating cells
  const gridRef = useRef(null);

  useImperativeHandle(ref, () => ({
    resetGame,
  }));

  const resetGame = useCallback(() => {
    setGrid(createEmptyGrid);
    setCurrentRow(0);
    setCurrentCol(0);
    setCurrentWord("");
    setGameStatus("");
    dispatch({ type: "RESET" }); // Reset usedLetters
    setSolution(possibleAnswers[Math.floor(Math.random() * possibleAnswers.length)]);
    gridRef.current.focus();
  }, [dispatch, gridRef, setGameStatus]); //Add dependencies if any variables used inside resetGame change over time

  useEffect(() => {
    const setNewSolution = () => {
      setSolution(possibleAnswers[Math.floor(Math.random() * possibleAnswers.length)]);
    };

    const restoreGameState = (state) => {
      setSolution(state.solution);
      setGrid(state.grid);
      setCurrentRow(state.currentRow);
      setCurrentCol(state.currentCol);
      setCurrentWord(state.currentWord);
      setGameStatus(state.gameStatus);
      dispatch({ type: "RESTORE_STATE", payload: state.usedLetters });
    };

    const savedState = Cookies.get("gameState");

    if (savedState) {
      const state = JSON.parse(savedState);
      state.solution === "" ? setNewSolution() : restoreGameState(state);
    } else {
      setNewSolution();
    }
  }, [setGameStatus]);

  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.focus();
    }
  }, [solution, grid, currentRow, currentCol, currentWord, usedLetters, animatingCells]);

  //validation for hard mode
  const validateHardMode = (word) => {
    // Check if the word includes all known correct letters in the correct positions
    for (let i = 0; i < currentRow; i++) {
      for (let j = 0; j < 5; j++) {
        if (grid[i][j].color === "bg-customGreen text-white" && word[j] !== grid[i][j].letter) {
          notify("Must include the correct letters in the correct positions.");

          return false;
        }
        if (grid[i][j].color === "bg-customBlue text-white" && !word.includes(grid[i][j].letter)) {
          notify("Must include the known letters.");

          return false;
        }
      }
    }
    // Check if the word includes any known incorrect letters
    for (let letter of usedLetters.notInWord) {
      if (word.includes(letter)) {
        notify("Cannot use letters that are not in the word.");
        return false;
      }
    }
    return true;
  };

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
          if (isHardMode && !validateHardMode(currentWord)) {
            return;
          }

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
    // const newUsedLetters = { ...usedLetters };
    let isCorrect = true;

    const animateCell = (colIndex) => {
      if (colIndex < 5) {
        const letter = word[colIndex];
        setAnimatingCells((prev) => [...prev, { row: rowIndex, col: colIndex }]);
        setTimeout(() => {
          if (letter === solution[colIndex]) {
            updatedGrid[rowIndex][colIndex].color = "bg-customGreen text-white";
            dispatch({ type: "addCorrect", payload: letter });
          } else if (solution.includes(letter)) {
            updatedGrid[rowIndex][colIndex].color = "bg-customBlue text-white";

            dispatch({ type: "addIncorrect", payload: letter });
            isCorrect = false;
          } else {
            updatedGrid[rowIndex][colIndex].color = "bg-zinc-500 text-white";

            dispatch({ type: "addNotInWord", payload: letter });
            isCorrect = false;
          }
          setAnimatingCells((prev) => prev.filter((cell) => !(cell.row === rowIndex && cell.col === colIndex)));
          setGrid(updatedGrid);
        }, 300); // Delay for the color change to align with the flip animation

        setTimeout(() => {
          animateCell(colIndex + 1);
        }, 400); // Delay for the next cell animation
      } else {
        // setUsedLetters(newUsedLetters);
        if (isCorrect) {
          setCurrentRow((prevRow) => prevRow + 1); // Increment the row to reflect the winning attempt
          setGameStatus("You win!");
          updateStats(currentRow + 1, true); // Update the stats with the number of guesses
          setStats(getStats()); // Update the stats state
          setIsModalOpen(true); // Open the modal
          saveGameState(currentRow + 1, "You win!");
        } else if (currentRow === 5) {
          setGameStatus(`You lost! The word was ${solution}.`);
          updateStats(currentRow + 1, false); // Update stats with loss status
          setStats(getStats()); // Refresh the stats state
          setIsModalOpen(true); // Open the modal
          setCurrentRow((prevRow) => prevRow + 1);
          saveGameState(currentRow + 1, `You lost The word was ${solution}.`);
        } else {
          setCurrentRow((prevRow) => prevRow + 1);
          setCurrentCol(0);
          setCurrentWord("");
          saveGameState(currentRow + 1, "");
        }
      }
    };

    animateCell(0);
  };

  // Save state of game to cookies
  const saveGameState = (row, game_Status) => {
    const state = {
      grid,
      currentRow: row, // Save the current row for the next game
      currentCol: 0, // Reset current column to 0 when saving state
      currentWord: "",
      gameStatus: game_Status,
      usedLetters,
      solution,
    };
    Cookies.set("gameState", JSON.stringify(state), { expires: 365 });
  };

  return (
    <div className="flex flex-col items-center justify-center bg-indigo-50">
      {gameStatus ? (
        <div className="flex md:text-sm text-xs gap-2 pt-1 ">
          <a href={`https://www.dictionary.com/browse/${solution}`} className="flex items-center  align-middle no-wrap" target="_blank" rel="noreferrer">
            Answer:{" "}
            <span className="underline ml-1 flex items-center">
              <MdMenuBook className="size-5 mx-2" style={{ marginTop: "-5" }} /> {solution}
            </span>
          </a>

          <button onClick={() => resetGame()} className="md:text-sm text-xs text-customBlue">
            play again?
          </button>
        </div>
      ) : null}
      <StatusBar currentRow={currentRow} gameStatus={gameStatus} />
      {/* <div className="text-xs">{solution}</div> */}

      <div ref={gridRef} className="grid gap-1 focus:outline-none" tabIndex={0} onKeyDown={(e) => handleKeyPress(e.key)} onFocus={(e) => e.target.focus()}>
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`md:size-16 size-8 border-black border ${cell.color} flex items-center justify-center md:text-2xl text-lg font-bold ${
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
    </div>
  );
});

export default Game;
