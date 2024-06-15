import React from 'react';
import Game from './Game';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-indigo-50">
      <ToastContainer className="mt-4" />
      <header className="bg-indigo-800 text-slate-400 w-full p-4 text-center">
        <h1 className="text-3xl font-extrabold">Mary's Wordle</h1>
      </header>
      <main className=" flex flex-col  grow items-center justify-center">
        <Game />
      </main>
      <footer className="w-full p-4 text-center bg-gray-800 text-white ">
        <p>© Larry's Wordle for Mary Harmon </p>
      </footer>
    </div>
  );
}

export default App;
