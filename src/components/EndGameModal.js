import { Fragment } from "react";
import { Dialog, DialogPanel, DialogTitle, TransitionChild, Transition } from "@headlessui/react";

import { VscDebugRestartFrame } from "react-icons/vsc";
import { AiOutlineCloseCircle } from "react-icons/ai";

const EndGameModal = ({ isOpen, closeModal, gameStatus, stats = {}, resetGame }) => {
  const { played = 0, wins = 0, streak = 0, maxStreak = 0, guesses = [] } = stats;
  const winPercentage = played > 0 ? ((wins / played) * 100).toFixed(0) : 0;
  const guessDistribution = guesses.reduce((acc, guess) => {
    acc[guess] = (acc[guess] || 0) + 1;
    return acc;
  }, {});

  const getStreakMessage = (gameStatus, streak, maxStreak) => {
    if (gameStatus === "You win!") {
      return `You're on a streak of ${streak}`;
    } else if (streak > 0) {
      return `You're on a streak of ${streak}`;
    } else if (maxStreak > 0) {
      return `You had a streak of ${maxStreak}`;
    } else {
      return `No current streak`;
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <TransitionChild as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none">
                  <AiOutlineCloseCircle className="h-8 w-8" />
                </button>
                <DialogTitle as="h3" className="text-lg font-extrabold leading-6 text-gray-900 text-center">
                  {gameStatus}
                </DialogTitle>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">{getStreakMessage(gameStatus, streak, maxStreak)}</p>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{played}</p>
                      <p className="text-sm">Played</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{winPercentage}</p>
                      <p className="text-sm">Win %</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{streak}</p>
                      <p className="text-sm">Current Streak</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{maxStreak}</p>
                      <p className="text-sm">Max Streak</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <h4 className="text-lg font-medium leading-6 text-gray-900">Guess Distribution</h4>
                    <div className="mt-2">
                      {Object.keys(guessDistribution).map((guess, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-4 text-gray-500">{guess}</div>
                          <div className="flex-1 bg-gray-200 h-4 mx-2">
                            <div className={`bg-customGreen h-full`} style={{ width: `${(guessDistribution[guess] / played) * 100}%` }}></div>
                          </div>
                          <div className="w-4 text-gray-500">{guessDistribution[guess]}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    className="text-zinc-700 bg-customYellow hover:bg-[#e9c46a] focus:ring-4 focus:outline-none focus:ring-customYellow font-bold rounded-lg px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-customYellow logofont"
                    onClick={resetGame}
                  >
                    <VscDebugRestartFrame className="h-6 w-6 mr-2 " />
                    {gameStatus ? "Play Again" : "Start New Game"}
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EndGameModal;
