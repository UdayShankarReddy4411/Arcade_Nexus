import React from 'react';
import { motion } from 'motion/react';
import { GAMES, GameId } from '../types';
import { sound } from '../services/audioService';

interface ArcadeHubProps {
  onSelectGame: (id: GameId) => void;
  highScores: Record<string, number>;
}

export const ArcadeHub: React.FC<ArcadeHubProps> = ({ onSelectGame, highScores }) => {
  return (
    <div className="flex flex-col items-center">
      <header className="text-center mb-16 relative">
        <motion.h1 
          className="text-6xl md:text-8xl font-display font-bold tracking-tighter mb-4 glitch-text"
          initial={{ letterSpacing: '0.5em', opacity: 0 }}
          animate={{ letterSpacing: '-0.05em', opacity: 1 }}
        >
          ARCADE_NEXUS
        </motion.h1>
        <p className="text-neon-cyan font-mono text-sm tracking-[0.3em] uppercase opacity-80">
          Digital Substrate // System Status: NORMAL
        </p>
        
        {/* Decorative scanning line */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-1 bg-neon-magenta shadow-[0_0_10px_#ff00ff]" />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {GAMES.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            onHoverStart={() => sound.playClick()}
            className="group relative"
          >
            <div className={`glass-card p-6 h-full flex flex-col border-white/5 hover:border-white/20 overflow-hidden`}>
              {/* Background Glow */}
              <div className={`absolute -right-10 -top-10 w-24 h-24 rounded-full bg-gradient-to-br ${game.color} blur-3xl opacity-20 group-hover:opacity-40 transition-opacity`} />
              
              <div className="text-4xl mb-4">{game.icon}</div>
              
              <h3 className="text-xl font-display font-bold mb-2 group-hover:text-neon-cyan transition-colors">
                {game.title}
              </h3>
              
              <p className="text-xs text-slate-400 font-mono mb-6 flex-grow">
                {game.description}
              </p>

              <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-end">
                <div>
                  <span className="text-[10px] font-mono text-slate-500 block uppercase">High Score</span>
                  <span className="text-lg font-display text-neon-magenta">
                    {highScores[game.id] || 0}
                  </span>
                </div>
                
                <button
                  onClick={() => onSelectGame(game.id)}
                  className="px-4 py-2 text-xs font-display bg-white/10 hover:bg-neon-cyan hover:text-black transition-all rounded"
                >
                  INITIALIZE
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <footer className="mt-24 text-[10px] font-mono text-slate-600 uppercase tracking-widest text-center">
        Built in the Void // Version 4.0.2 // Encrypted connection verified
      </footer>
    </div>
  );
};
