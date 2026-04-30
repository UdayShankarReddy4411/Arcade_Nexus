import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArcadeHub } from './components/ArcadeHub';
import { SnakeGame } from './components/SnakeGame';
import { MemoryMatch } from './components/MemoryMatch';
import { ReactionTest } from './components/ReactionTest';
import { TypingGame } from './components/TypingGame';
import { GameId } from './types';
import { GlitchOverlay } from './components/GlitchOverlay';
import { sound } from './services/audioService';
import { Volume2, VolumeX } from 'lucide-react';

export default function App() {
  const [activeGame, setActiveGame] = useState<GameId | null>(null);
  const [highScores, setHighScores] = useState<Record<string, number>>({});
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('arcade_nexus_scores');
    if (saved) {
      setHighScores(JSON.parse(saved));
    }
  }, []);

  const updateHighScore = (gameId: string, score: number) => {
    setHighScores(prev => {
      const newScores = { ...prev, [gameId]: Math.max(prev[gameId] || 0, score) };
      localStorage.setItem('arcade_nexus_scores', JSON.stringify(newScores));
      return newScores;
    });
  };

  const toggleMute = () => {
    const newState = !isMuted;
    setIsMuted(newState);
    sound.toggle(!newState);
    if (!newState) sound.playPoint();
  };

  const handleSelectGame = (id: GameId) => {
    sound.playClick();
    setActiveGame(id);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-dark-bg selection:bg-neon-magenta selection:text-white">
      <GlitchOverlay />
      
      {/* Global Controls */}
      <div className="fixed top-6 right-6 z-50 flex gap-4">
        <button 
          onClick={toggleMute}
          className="p-3 glass-card hover:border-neon-cyan/50 text-neon-cyan transition-all"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>

      <main className="container mx-auto px-4 py-8 relative z-10">
        <AnimatePresence mode="wait">
          {!activeGame ? (
            <motion.div
              key="hub"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
            >
              <ArcadeHub onSelectGame={handleSelectGame} highScores={highScores} />
            </motion.div>
          ) : (
            <motion.div
              key="game-container"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-4xl mx-auto"
            >
              <button 
                onClick={() => {
                  sound.playClick();
                  setActiveGame(null);
                }}
                className="mb-8 px-6 py-2 glass-card hover:bg-white/20 text-neon-cyan font-display text-sm tracking-widest flex items-center gap-2 group"
              >
                <span className="group-hover:-translate-x-1 transition-transform">←</span> RETURN_TO_HUB
              </button>

              <div className="glass-card p-6 md:p-12 border-neon-cyan/30 shadow-[0_0_30px_-10px_rgba(0,243,255,0.3)]">
                {activeGame === 'snake' && <SnakeGame onGameOver={(s) => updateHighScore('snake', s)} />}
                {activeGame === 'memory' && <MemoryMatch onGameOver={(s) => updateHighScore('memory', s)} />}
                {activeGame === 'reaction' && <ReactionTest onGameOver={(s) => updateHighScore('reaction', s)} />}
                {activeGame === 'typing' && <TypingGame onGameOver={(s) => updateHighScore('typing', s)} />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Decorative pulse background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 -left-1/4 w-full h-full bg-neon-purple/5 blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-1/4 w-full h-full bg-neon-cyan/5 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
    </div>
  );
}
