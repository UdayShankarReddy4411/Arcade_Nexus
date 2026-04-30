import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'motion/react';
import { sound } from '../services/audioService';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const TICK_RATE_BASE = 150;

interface SnakeGameProps {
  onGameOver: (score: number) => void;
}

export const SnakeGame: React.FC<SnakeGameProps> = ({ onGameOver }) => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const nextDirection = useRef(INITIAL_DIRECTION);
  const snakeRef = useRef(INITIAL_SNAKE);
  const hasReportedGameOver = useRef(false);

  const generateFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Don't spawn on snake
      if (!snakeRef.current.some(segment => segment.x === newFood!.x && segment.y === newFood!.y)) break;
    }
    return newFood;
  }, []);

  const moveSnake = useCallback(() => {
    if (isGameOver) return;

    const head = snakeRef.current[0];
    const newHead = {
      x: (head.x + nextDirection.current.x + GRID_SIZE) % GRID_SIZE,
      y: (head.y + nextDirection.current.y + GRID_SIZE) % GRID_SIZE,
    };

    // Check self collision
    if (snakeRef.current.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
      setIsGameOver(true);
      return;
    }

    const newSnake = [newHead, ...snakeRef.current];

    // Check food
    if (newHead.x === food.x && newHead.y === food.y) {
      setScore(s => s + 10);
      setFood(generateFood());
      sound.playPoint();
    } else {
      newSnake.pop();
    }

    snakeRef.current = newSnake;
    setSnake(newSnake);
  }, [food, isGameOver, generateFood]);

  useEffect(() => {
    if (isGameOver && !hasReportedGameOver.current) {
      onGameOver(score);
      hasReportedGameOver.current = true;
      sound.playGameOver();
    }
  }, [isGameOver, score, onGameOver]);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction.y === 0) nextDirection.current = { x: 0, y: -1 }; break;
        case 'ArrowDown': if (direction.y === 0) nextDirection.current = { x: 0, y: 1 }; break;
        case 'ArrowLeft': if (direction.x === 0) nextDirection.current = { x: -1, y: 0 }; break;
        case 'ArrowRight': if (direction.x === 0) nextDirection.current = { x: 1, y: 0 }; break;
      }
      setDirection(nextDirection.current);
    };

    window.addEventListener('keydown', handleKeydown);
    const tick = setInterval(moveSnake, Math.max(50, TICK_RATE_BASE - score / 5));
    
    return () => {
      window.removeEventListener('keydown', handleKeydown);
      clearInterval(tick);
    };
  }, [moveSnake, direction, score]);

  const reset = () => {
    sound.playClick();
    const freshSnake = INITIAL_SNAKE;
    snakeRef.current = freshSnake;
    setSnake(freshSnake);
    setDirection(INITIAL_DIRECTION);
    nextDirection.current = INITIAL_DIRECTION;
    setFood({ x: 15, y: 15 });
    setIsGameOver(false);
    setScore(0);
    hasReportedGameOver.current = false;
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-6 px-4">
        <h2 className="text-2xl font-display text-neon-cyan">SNAKE_AI</h2>
        <div className="font-mono text-sm">
          SCORE: <span className="text-neon-magenta">{score}</span>
        </div>
      </div>

      <div 
        className="relative bg-black/40 border border-white/5 rounded overflow-hidden"
        style={{ 
          width: 'min(90vw, 400px)', 
          height: 'min(90vw, 400px)',
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {snake.map((segment, i) => (
          <motion.div
            key={`${i}-${segment.x}-${segment.y}`}
            className={`${i === 0 ? 'bg-neon-cyan shadow-[0_0_8px_rgba(0,243,255,1)] z-10' : 'bg-neon-cyan/40'} rounded-sm`}
            style={{ 
              gridColumnStart: segment.x + 1, 
              gridRowStart: segment.y + 1 
            }}
          />
        ))}

        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 180] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="bg-neon-magenta shadow-[0_0_10px_rgba(255,0,255,1)] rounded-full m-1"
          style={{ 
            gridColumnStart: food.x + 1, 
            gridRowStart: food.y + 1 
          }}
        />

        {isGameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm z-20">
            <h3 className="text-4xl font-display text-neon-magenta mb-4 glitch-text">SEGMENT_FAULT</h3>
            <p className="font-mono text-xs mb-8 text-slate-400">MEMORY CORRUPT: {score} UNITS RECORDED</p>
            <button 
              onClick={reset}
              className="px-8 py-3 bg-white/10 hover:bg-neon-cyan hover:text-black font-display text-sm transition-all rounded"
            >
              REBOOT_SYSTEM
            </button>
          </div>
        )}
      </div>

      <p className="mt-6 text-[10px] font-mono text-slate-500 uppercase">Use arrow keys to navigate the void</p>
    </div>
  );
};
