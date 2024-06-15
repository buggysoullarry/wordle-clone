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
              status = "bg-customGreen text-white ";
            } else if (usedLetters.incorrect.includes(key)) {
              status = "bg-customBlue text-white ";
            } else if (usedLetters.notInWord.includes(key)) {
              status = "bg-zinc-500 text-white ";
            } else {
              status = "bg-zinc-300 text-zinc-500";
            }
            const keyWidth = key === "Enter" || key === "Backspace" ? "md:w-14  w-12" : "md:w-12 w-8";
            return (
              <button key={key} className={`h-10 md:h-12 rounded flex items-center md:text-base text-sm justify-center shadow-sm  ${keyWidth} ${status} focus:outline-none`} onClick={() => onKeyClick(key)}>
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
