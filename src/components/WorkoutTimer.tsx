'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Pause, Play, RotateCcw, X, Clock } from 'lucide-react';

type TimerState = 'idle' | 'running' | 'paused';

interface WorkoutTimerProps {
  isVisible?: boolean;
  onToggleVisibility?: () => void;
}

const WorkoutTimer = ({ isVisible = true, onToggleVisibility }: WorkoutTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [lastRestTime, setLastRestTime] = useState<number>(60);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let interval: NodeJS.Timeout;

    if (timerState === 'running' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerState('idle');
    }

    return () => clearInterval(interval);
  }, [timeLeft, timerState]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault();
        if (timerState !== 'idle') {
          togglePause();
        } else {
          startTimer(lastRestTime);
        }
      } else if (event.code === 'KeyR') {
        event.preventDefault();
        resetTimer();
      } else if (event.code === 'KeyT') {
        event.preventDefault();
        onToggleVisibility?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lastRestTime, timerState, onToggleVisibility]);

  const startTimer = (seconds: number) => {
    setLastRestTime(seconds);
    setTimeLeft(seconds);
    setTimerState('running');
  };

  const togglePause = () => {
    setTimerState((prev) => (prev === 'running' ? 'paused' : 'running'));
  };

  const resetTimer = () => {
    setTimeLeft(0);
    setTimerState('idle');
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* Toggle button when timer is hidden */}
      <AnimatePresence>
        {!isVisible && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggleVisibility}
            className='fixed bottom-4 right-4 bg-emerald-500 text-white p-3 rounded-full shadow-xl hover:bg-emerald-600 transition-colors'>
            <Clock size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Timer component */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className='fixed bottom-4 right-4 bg-white rounded-2xl shadow-xl p-4 w-64 border border-gray-100'>
            <div className='flex items-center justify-between mb-4'>
              <div className='flex items-center gap-2'>
                <Timer size={20} className='text-emerald-600' />
                <h3 className='font-semibold text-gray-700'>Rest Timer</h3>
              </div>
              <div className='flex gap-1'>
                {timerState !== 'idle' && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={resetTimer}
                    className='text-gray-500 hover:text-gray-700 p-1'>
                    <RotateCcw size={16} />
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onToggleVisibility}
                  className='text-gray-500 hover:text-gray-700 p-1'>
                  <X size={16} />
                </motion.button>
              </div>
            </div>

            <div className='flex justify-center mb-4'>
              <motion.div
                className='text-4xl font-bold text-emerald-600'
                animate={{ scale: timeLeft > 0 ? [1, 1.1, 1] : 1 }}
                transition={{ duration: 1, repeat: timeLeft > 0 ? Infinity : 0 }}>
                {formatTime(timeLeft)}
              </motion.div>
            </div>

            <div className='flex gap-2'>
              {timerState === 'idle' ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => startTimer(30)}
                    className={`flex-1 bg-emerald-100 text-emerald-700 py-2 rounded-lg font-medium hover:bg-emerald-200 ${
                      lastRestTime === 30
                        ? 'border-2 border-solid border-emerald-400'
                        : ''
                    }`}>
                    30s
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => startTimer(60)}
                    className={`flex-1 bg-emerald-100 text-emerald-700 py-2 rounded-lg font-medium hover:bg-emerald-200 ${
                      lastRestTime === 60
                        ? 'border-2 border-solid border-emerald-400'
                        : ''
                    }`}>
                    60s
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => startTimer(90)}
                    className={`flex-1 bg-emerald-100 text-emerald-700 py-2 rounded-lg font-medium hover:bg-emerald-200 ${
                      lastRestTime === 90
                        ? 'border-2 border-solid border-emerald-400'
                        : ''
                    }`}>
                    90s
                  </motion.button>
                </>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={togglePause}
                  className='w-full bg-emerald-500 text-white py-2 rounded-lg font-medium hover:bg-emerald-600 flex items-center justify-center gap-2'>
                  {timerState === 'running' ? (
                    <>
                      <Pause size={18} /> Pause
                    </>
                  ) : (
                    <>
                      <Play size={18} /> Resume
                    </>
                  )}
                </motion.button>
              )}
            </div>

            {/* Keyboard shortcuts hint */}
            <div className='mt-3 pt-3 border-t border-gray-100'>
              <p className='text-xs text-gray-500 text-center'>
                Shortcuts: <span className='font-medium'>Space</span> - Start/Pause | <span className='font-medium'>R</span> - Reset | <span className='font-medium'>T</span> - Toggle
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default WorkoutTimer;
