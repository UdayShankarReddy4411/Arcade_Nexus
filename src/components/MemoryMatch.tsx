import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../services/audioService';

const SYMBOLS = ['⚡', '🧠', '🐍', '⌨️', '💾', '🛰️', '🕹️', '📡'];
const CARDS = [...SYMBOLS, ...SYMBOLS];

interface MemoryMatchProps {
  onGameOver: (score: number) => void;
}

export const MemoryMatch: React.FC<MemoryMatchProps> = ({ onGameOver }) => {
  const [shuffledCards, setShuffledCards] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [solved, setSolved] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    setShuffledCards([...CARDS].sort(() => Math.random() - 0.5));
  }, []);

  const handleClick = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || solved.includes(index)) return;

    sound.playClick();
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      if (shuffledCards[newFlipped[0]] === shuffledCards[newFlipped[1]]) {
        sound.playSuccess();
        setSolved([...solved, ...newFlipped]);
        setFlipped([]);
        if (solved.length + 2 === CARDS.length) {
          setIsGameOver(true);
          // Score = Inverse of moves (example: 1000 - moves * 10)
          onGameOver(Math.max(0, 1000 - (moves + 1) * 20));
        }
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  const reset = () => {
    sound.playClick();
    setShuffledCards([...CARDS].sort(() => Math.random() - 0.5));
    setFlipped([]);
    setSolved([]);
    setMoves(0);
    setIsGameOver(false);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-6 px-4">
        <h2 className="text-2xl font-display text-neon-purple">NEURAL_LINK</h2>
        <div className="font-mono text-sm">
          CYCLES: <span className="text-neon-magenta">{moves}</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 w-full max-w-[400px]">
        {shuffledCards.map((symbol, index) => {
          const isFlipped = flipped.includes(index) || solved.includes(index);
          return (
            <motion.div
              key={index}
              onClick={() => handleClick(index)}
              className="aspect-square perspective-1000 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="w-full h-full relative preserve-3d"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              >
                {/* Front (Hidden) */}
                <div className="absolute inset-0 backface-hidden glass-card border-neon-purple/20 flex items-center justify-center bg-white/5">
                  <span className="text-neon-purple/20 text-2xl font-display">?</span>
                </div>

                {/* Back (Visible) */}
                <div 
                  className="absolute inset-0 backface-hidden rotate-y-180 glass-card bg-neon-purple/10 border-neon-purple flex items-center justify-center"
                >
                  <span className="text-3xl">{symbol}</span>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {isGameOver && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm z-20"
          >
            <h3 className="text-4xl font-display text-neon-purple mb-4 glitch-text">NEURAL_SYNC_COMPLETE</h3>
            <p className="font-mono text-xs mb-8 text-slate-400">CYCLES_OPTIMIZED: {moves}</p>
            <button 
              onClick={reset}
              className="px-8 py-3 bg-white/10 hover:bg-neon-purple hover:text-white font-display text-sm transition-all rounded uppercase"
            >
              Recalibrate_Sensors
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};
