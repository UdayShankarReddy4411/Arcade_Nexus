import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { sound } from '../services/audioService';

type State = 'idle' | 'waiting' | 'ready' | 'result';

interface ReactionTestProps {
  onGameOver: (score: number) => void;
}

export const ReactionTest: React.FC<ReactionTestProps> = ({ onGameOver }) => {
  const [state, setState] = useState<State>('idle');
  const [time, setTime] = useState<number | null>(null);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const startTime = useRef<number>(0);
  const timeoutRef = useRef<number | null>(null);

  const startTest = () => {
    sound.playClick();
    setState('waiting');
    const delay = 2000 + Math.random() * 3000;
    timeoutRef.current = window.setTimeout(() => {
      setState('ready');
      startTime.current = performance.now();
    }, delay);
  };

  const handleClick = () => {
    if (state === 'waiting') {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setState('idle');
      alert("TOO_EARLY. SYSTEM_REJECTED.");
    } else if (state === 'ready') {
      sound.playSuccess();
      const reactionTime = Math.round(performance.now() - startTime.current);
      setTime(reactionTime);
      setBestTime(prev => (prev === null || reactionTime < prev ? reactionTime : prev));
      setState('result');
      // Score = 10000 / time (example)
      onGameOver(Math.round(1000000 / reactionTime));
    } else if (state === 'idle' || state === 'result') {
      startTest();
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
       <div className="w-full flex justify-between items-center mb-6 px-4">
        <h2 className="text-2xl font-display text-neon-cyan">SYNAPSE_PULSE</h2>
        <div className="font-mono text-sm">
          BEST_LATENCY: <span className="text-neon-magenta">{bestTime ? `${bestTime}ms` : '---'}</span>
        </div>
      </div>

      <motion.div
        onClick={handleClick}
        className={`w-full max-w-[500px] h-64 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 ${
          state === 'idle' ? 'bg-white/5 border border-white/10' :
          state === 'waiting' ? 'bg-neon-magenta/20 border border-neon-magenta' :
          state === 'ready' ? 'bg-neon-cyan shadow-[0_0_50px_rgba(0,243,255,0.5)]' :
          'bg-white/10'
        }`}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="text-center p-8">
          {state === 'idle' && (
            <>
              <h3 className="text-2xl font-display mb-4">INITIALIZE_PROBE</h3>
              <p className="font-mono text-xs text-slate-400">Click anywhere to begin measurement</p>
            </>
          )}
          {state === 'waiting' && (
            <>
              <h3 className="text-2xl font-display mb-4 text-neon-magenta animate-pulse">WAITING_FOR_SIGNAL...</h3>
              <p className="font-mono text-xs text-slate-400 uppercase">Click when screen turns cyan</p>
            </>
          )}
          {state === 'ready' && (
            <h3 className="text-5xl font-display text-black font-bold italic tracking-widest">CLICK_NOW!</h3>
          )}
          {state === 'result' && (
            <>
              <h3 className="text-4xl font-display mb-4 text-neon-cyan">{time}ms</h3>
              <p className="font-mono text-xs text-slate-400 mb-6 uppercase">Efficiency rating recorded</p>
              <button className="px-6 py-2 border border-neon-cyan text-neon-cyan text-xs font-display hover:bg-neon-cyan hover:text-black transition-all">RETEST_LATENCY</button>
            </>
          )}
        </div>
      </motion.div>

      <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-[500px]">
        <div className="glass-card p-4 text-center">
          <span className="block text-[10px] font-mono text-slate-500 uppercase">Pro Rank</span>
          <span className="text-xl font-display text-neon-magenta">{"< 200ms"}</span>
        </div>
        <div className="glass-card p-4 text-center">
          <span className="block text-[10px] font-mono text-slate-500 uppercase">Status</span>
          <span className="text-xl font-display text-neon-cyan">ACTIVE</span>
        </div>
      </div>
    </div>
  );
};
