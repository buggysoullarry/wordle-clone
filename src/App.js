import React, { useState, useEffect } from "react";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { BiBarChartAlt2 } from "react-icons/bi";

import { getStats } from "./utils/stats";
import Cookies from "js-cookie";
import Dropdown from "./components/DropDown";
import EndGameModal from "./components/EndGameModal";
import Game from "./Game";

function App() {
  const [flipped, setFlipped] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState(getStats());
  const [gameStatus, setGameStatus] = useState("");
  const [isHardMode, setIsHardMode] = useState(() => {
    const savedMode = Cookies.get("hardMode");
    return savedMode === "true";
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setFlipped(true);
    }, 1500); // Flip after 1 second

    return () => clearTimeout(timer);
  }, []);

  const resetGame = () => {
    // You may need to pass this down to the Game component if it handles game reset logic
    setGameStatus("");
    setStats(getStats());
    // You can add additional logic here if needed to reset the game state
  };

  const toggleHardMode = () => {
    setIsHardMode(!isHardMode);
    Cookies.set("hardMode", !isHardMode, { expires: 365 }); // Save the hard mode setting in cookies
  };

  return (
    <div className="min-h-svh flex flex-col items-center justify-center bg-indigo-50">
      <ToastContainer className="mt-4" />
      <header className="bg-white text-zinc-700 w-full px-4 py-1 text-center flex items-center justify-between border-b-2 border-zinc-500">
        <div className="text-lg font-extrabold logofont bounce-in-right">
          <span className={`fliplogo ${flipped ? "grid-box" : ""}`}>{flipped ? "M" : "W"}</span>
          ordle <span className="fade-out">for Mary</span>
        </div>
        <div className="flex gap-3 mr-2">
          <BiBarChartAlt2 className="w-5 h-5 cursor-pointer" onClick={() => setIsModalOpen(true)} />
          <Dropdown toggleHardMode={toggleHardMode} isHardMode={isHardMode} />
        </div>
      </header>
      <main className="flex flex-col grow items-center justify-center">
        <Game setStats={setStats} setIsModalOpen={setIsModalOpen} setGameStatus={setGameStatus} gameStatus={gameStatus} isHardMode={isHardMode} />
      </main>
      <footer className="w-full p-2 text-center bg-gray-800 text-white text-sm logofont">
        <p>© Larry's Wordle for Mary Harmon</p>
      </footer>

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
}

export default App;
