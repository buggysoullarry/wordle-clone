import React from "react";
import { FaFaceSmile, FaFaceMeh, FaFaceFrown, FaFaceSadTear, FaFaceAngry, FaFaceSurprise, FaXmark, FaFaceFrownOpen } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";

const StatusBar = ({ currentRow, gameStatus }) => {
  const maxTries = 6;
  const triesLeft = maxTries - currentRow;
  const faceIcons = [
    <FaFaceSmile className="text-customGreen size-10  md:size-16 " />,
    <FaFaceMeh className="text-customYellow size-10 md:size-16" />,
    <FaFaceSurprise className="text-purple-500 size-10 md:size-14" />,
    <FaFaceFrown className="text-orange-500 size-10 md:size-14" />,
    <FaFaceSadTear className="text-red-500 size-10 md:size-14" />,
    <FaFaceAngry className="text-red-700 size-10 md:size-14" />,
    <FaFaceFrownOpen className="text-gray-700 size-10 md:size-14" />,
  ];

  const message = gameStatus === "You win!" ? `You won in ${currentRow} tries!` : currentRow === maxTries ? "You lost" : `${triesLeft} tries left`;

  return (
    <div className="p-1 m-2 border-b-2 border-gray-200 bg-slate-200 rounded-xl mb-4  max-w-xl mx-auto flex justify-between align-middle items-center">
      <div>
        <p className="mb-1 text-center text-zinc-600 md:text-base text-xs ">{message}</p>
        <ol className="flex items-center space-x-2">
          {[...Array(maxTries)].map((_, index) => (
            <li key={index} className="relative flex-1">
              <div
                className={`flex items-center justify-center size-8 rounded-full md:size-10 ${
                  index < currentRow ? (index === currentRow - 1 && gameStatus === "You win!" ? "bg-customGreen" : "bg-rose-800") : "bg-gray-100 dark:bg-gray-700"
                } shrink-0`}
              >
                {index < currentRow &&
                  (index === currentRow - 1 && gameStatus === "You win!" ? (
                    <FaCheckCircle className="w-3 h-3 text-white md:w-4 md:h-4 dark:text-white" />
                  ) : (
                    <FaXmark className="w-3 h-3 text-white md:w-4 md:h-4 dark:text-white" />
                  ))}
              </div>
              {index < maxTries - 1 && (
                <div
                  className={`absolute top-1/2 transform -translate-y-1/2 left-full md:h-2 h-1 w-full border-b-4 ${
                    index < currentRow
                      ? index === currentRow - 1 && gameStatus === "You win!"
                        ? "border-customGreen dark:border-customGreen"
                        : "border-rose-800 dark:border-rose-800"
                      : "border-gray-100 dark:border-gray-700"
                  }`}
                />
              )}
            </li>
          ))}
        </ol>
      </div>
      <div className="flex px-1 items-center text-center">{gameStatus === "You win!" ? faceIcons[0] : faceIcons[Math.min(currentRow, faceIcons.length - 1)]}</div>
    </div>
  );
};

export default StatusBar;
