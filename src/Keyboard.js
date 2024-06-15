import React from "react";

const keys = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Enter", "Z", "X", "C", "V", "B", "N", "M", "Backspace"],
];

const Keyboard = ({ usedLetters, onKeyClick }) => {
  return (
    <div className="flex flex-col items-center mt-4">
      {keys.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center space-x-1 mb-1">
          {row.map((key) => {
            let status = "";
            if (usedLetters.correct.includes(key)) {
              status = "bg-green-600 ";
            } else if (usedLetters.incorrect.includes(key)) {
              status = "bg-indigo-800 ";
            } else if (usedLetters.notInWord.includes(key)) {
              status = "bg-gray-500 ";
            } else {
              status = "bg-gray-900 ";
            }
            const keyWidth = key === "Enter" || key === "Backspace" ? "w-16" : "w-10";
            return (
              <button key={key} className={`h-10 rounded flex items-center font-medium text-white justify-center ${keyWidth} ${status} focus:outline-none`} onClick={() => onKeyClick(key)}>
                {key === "Backspace" ? "⌫" : key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
