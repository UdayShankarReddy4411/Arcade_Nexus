import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { sound } from '../services/audioService';

const SENTENCES = [
  "the digital horizon bleeds neon across the substrate",
  "cybernetic entities dream of simulated electric rain",
  "encryption keys fragments found in the neural archives",
  "rebooting the system into safe mode via terminal focus",
  "data streams flow like liquid crystal through the mesh",
  "automated protocols initiating the final uplink sequence"
];

interface TypingGameProps {
  onGameOver: (score: number) => void;
}

export const TypingGame: React.FC<TypingGameProps> = ({ onGameOver }) => {
  const [targetText, setTargetText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTargetText(SENTENCES[Math.floor(Math.random() * SENTENCES.length)]);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!startTime && value.length > 0) {
      setStartTime(performance.now());
    }

    setUserInput(value);
    sound.playPoint();

    // Calculate real-time WPM
    if (startTime && value.length > 0) {
      const timeInMinutes = (performance.now() - startTime) / 60000;
      const wordCount = value.length / 5;
      setWpm(Math.round(wordCount / timeInMinutes));
    }

    if (value === targetText) {
      sound.playSuccess();
      setIsFinished(true);
      const finalTime = (performance.now() - (startTime || performance.now())) / 60000;
      const finalWpm = Math.round((targetText.length / 5) / finalTime);
      onGameOver(finalWpm);
    }
  };

  const reset = () => {
    sound.playClick();
    setTargetText(SENTENCES[Math.floor(Math.random() * SENTENCES.length)]);
    setUserInput("");
    setStartTime(null);
    setWpm(0);
    setIsFinished(false);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-6 px-4">
        <h2 className="text-2xl font-display text-blue-400">CODE_BREAKER</h2>
        <div className="font-mono text-sm">
          VELOCITY: <span className="text-neon-magenta">{wpm} WPM</span>
        </div>
      </div>

      <div className="w-full bg-black/40 p-8 rounded-xl border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 h-1 bg-blue-500 transition-all duration-300" style={{ width: `${(userInput.length / targetText.length) * 100}%` }} />
        
        <div className="text-xl md:text-2xl font-mono mb-8 leading-relaxed tracking-tight relative">
          <span className="text-blue-400 opacity-30 select-none">{targetText}</span>
          <div className="absolute top-0 left-0 flex flex-wrap">
            {userInput.split("").map((char, i) => (
              <span key={i} className={char === targetText[i] ? "text-blue-400" : "bg-red-500/50 text-white"}>
                {char}
              </span>
            ))}
          </div>
        </div>

        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={handleChange}
          disabled={isFinished}
          className="w-full bg-white/5 border-b-2 border-blue-500/30 focus:border-blue-500 outline-none p-4 font-mono text-xl text-white transition-all rounded-t-lg"
          placeholder="TYPE_COMMAND_TO_EXECUTE..."
          autoFocus
        />
      </div>

      <div className="mt-8 flex gap-4 w-full justify-center">
        {isFinished && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center"
          >
            <p className="text-neon-cyan font-display mb-4 tracking-[0.2em]">DATA_UPLOAD_SUCCESSFUL</p>
            <button 
              onClick={reset}
              className="px-8 py-3 bg-blue-500 hover:bg-blue-400 text-black font-display text-sm transition-all rounded uppercase"
            >
              NEXT_SEQUENCE
            </button>
          </motion.div>
        )}
      </div>

      <div className="mt-12 w-full max-w-md">
        <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase mb-2">
          <span>Integrity Scan</span>
          <span>{Math.round((userInput.length / targetText.length) * 100)}%</span>
        </div>
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-neon-magenta/50"
            animate={{ width: `${(userInput.length / targetText.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
