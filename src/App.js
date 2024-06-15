import React from "react";
import Game from "./Game";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCog } from "react-icons/fa";
import { BiBarChartAlt2 } from "react-icons/bi";

function App() {
  return (
    <div className="min-h-svh flex flex-col items-center justify-center bg-indigo-50">
      <ToastContainer className="mt-4" />
      <header className="bg-white text-zinc-700 w-full px-4 py-1 text-center flex items-center justify-between border-b-2 border-zinc-500   ">
        <div className="text-lg font-extrabold logofont">Mary's Wordle</div>
        <div className="flex gap-3 mr-2"><BiBarChartAlt2 className=" w-5 h-5" /><FaCog className=" w-5 h-5" /></div>
      </header>
      <main className=" flex flex-col  grow items-center justify-center">
        <Game />
      </main>
      <footer className="w-full p-2 text-center bg-gray-800 text-white text-sm logofont">
        <p>© Larry's Wordle for Mary Harmon </p>
      </footer>
    </div>
  );
}

export default App;
