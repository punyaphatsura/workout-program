'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Pause, Play, RotateCcw, X, Clock } from 'lucide-react';

type TimerState = 'idle' | 'running' | 'paused';

interface Exercise {
  name: string;
  weight?: string;
  sets: number;
  reps?: string;
  rest: number;
  time?: string;
  progression?: string;
}

interface WorkoutTimerProps {
  isVisible?: boolean;
  onToggleVisibility?: () => void;
  inProgressExercises?: string[];
  currentWorkoutExercises?: Exercise[];
}

const WorkoutTimer = ({ 
  isVisible = true, 
  onToggleVisibility,
  inProgressExercises = [],
  currentWorkoutExercises = []
}: WorkoutTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [lastRestTime, setLastRestTime] = useState<number>(60);
  const [endTimestamp, setEndTimestamp] = useState<number | null>(null);

  // Get the current in-progress exercise and its rest time
  const currentInProgressExercise = inProgressExercises.length > 0 ? inProgressExercises[0] : null;
  const currentExerciseData = currentInProgressExercise 
    ? currentWorkoutExercises.find(ex => ex.name === currentInProgressExercise)
    : null;
  const currentRestTime = currentExerciseData?.rest || 60;
  const hasActiveExercise = currentInProgressExercise !== null;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let interval: NodeJS.Timeout;

    if (timerState === 'running' && endTimestamp) {
      interval = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, Math.ceil((endTimestamp - now) / 1000));
        
        setTimeLeft(remaining);
        
        if (remaining === 0) {
          setTimerState('idle');
          setEndTimestamp(null);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timerState, endTimestamp]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault();
        if (timerState !== 'idle') {
          togglePause();
        } else if (hasActiveExercise) {
          startCurrentExerciseTimer();
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
  }, [lastRestTime, timerState, onToggleVisibility, hasActiveExercise]);

  const startTimer = (seconds: number) => {
    const now = Date.now();
    setLastRestTime(seconds);
    setTimeLeft(seconds);
    setEndTimestamp(now + seconds * 1000);
    setTimerState('running');
  };

  const startCurrentExerciseTimer = () => {
    if (hasActiveExercise && currentExerciseData) {
      startTimer(currentRestTime);
    }
  };

  const togglePause = () => {
    if (timerState === 'running') {
      // Pausing: store remaining time, clear end timestamp
      setTimerState('paused');
      setEndTimestamp(null);
    } else if (timerState === 'paused') {
      // Resuming: set new end timestamp based on remaining time
      const now = Date.now();
      setEndTimestamp(now + timeLeft * 1000);
      setTimerState('running');
    }
  };

  const resetTimer = () => {
    setTimeLeft(0);
    setTimerState('idle');
    setEndTimestamp(null);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Determine timer colors based on state
  const getTimerColors = () => {
    if (timerState === 'running') {
      return {
        containerBg: 'bg-white border-blue-200',
        timerText: 'text-blue-600',
        iconColor: 'text-blue-600',
        headerText: 'text-blue-700',
        buttonBg: 'bg-blue-500 hover:bg-blue-600',
        buttonText: 'text-white',
        smallButtonBg: 'bg-blue-100 hover:bg-blue-200',
        smallButtonText: 'text-blue-700',
        activeBorder: 'border-blue-400',
        buttonBgColor: '#3b82f6', // Actual color value for inline styles
        hoverBgColor: '#2563eb'
      };
    } else if (timerState === 'paused') {
      return {
        containerBg: 'bg-white border-amber-200',
        timerText: 'text-amber-600',
        iconColor: 'text-amber-600',
        headerText: 'text-amber-700',
        buttonBg: 'bg-amber-500 hover:bg-amber-600',
        buttonText: 'text-white',
        smallButtonBg: 'bg-amber-100 hover:bg-amber-200',
        smallButtonText: 'text-amber-700',
        activeBorder: 'border-amber-400',
        buttonBgColor: '#f59e0b', // Actual color value for inline styles
        hoverBgColor: '#d97706'
      };
    } else {
      // 'idle' state = green
      return {
        containerBg: 'bg-white border-emerald-200',
        timerText: 'text-emerald-600',
        iconColor: 'text-emerald-600',
        headerText: 'text-emerald-700',
        buttonBg: 'bg-emerald-500 hover:bg-emerald-600',
        buttonText: 'text-white',
        smallButtonBg: 'bg-emerald-100 hover:bg-emerald-200',
        smallButtonText: 'text-emerald-700',
        activeBorder: 'border-emerald-400',
        buttonBgColor: '#10b981', // Actual color value for inline styles
        hoverBgColor: '#059669'
      };
    }
  };

  const colors = getTimerColors();

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
            className='fixed bottom-4 right-4 text-white p-3 rounded-full shadow-xl transition-colors'
            style={{ backgroundColor: colors.buttonBgColor }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.hoverBgColor}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.buttonBgColor}>
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
            className={`fixed bottom-4 right-4 ${colors.containerBg} rounded-2xl shadow-xl p-4 w-64 border`}>
            <div className='flex items-center justify-between mb-4'>
                              <div className='flex items-center gap-2'>
                  <Timer size={20} className={colors.iconColor} />
                  <div>
                    <h3 className={`font-semibold ${colors.headerText}`}>Rest Timer</h3>
                  {hasActiveExercise && currentExerciseData && (
                    <p className='text-xs text-gray-500 truncate max-w-[120px]'>
                      {currentInProgressExercise}
                    </p>
                  )}
                </div>
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
                  className={`text-4xl font-bold ${colors.timerText}`}
                  animate={{ 
                    scale: timerState === 'running' ? [1, 1.1, 1] : 1 
                  }}
                  transition={{ 
                    duration: 1, 
                    repeat: timerState === 'running' ? Infinity : 0 
                  }}>
                  {formatTime(timeLeft)}
                </motion.div>
              </div>

            <div className='flex gap-2'>
              {timerState === 'idle' ? (
                <>
                  {hasActiveExercise && currentExerciseData ? (
                    // Smart timer for active exercise
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={startCurrentExerciseTimer}
                      className={`w-full ${colors.buttonBg} ${colors.buttonText} py-2 rounded-lg font-medium`}>
                      Start Rest ({currentRestTime}s)
                    </motion.button>
                  ) : (
                    // Original timer buttons when no exercise is active
                    <>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => startTimer(30)}
                        className={`flex-1 ${colors.smallButtonBg} ${colors.smallButtonText} py-2 rounded-lg font-medium ${
                          lastRestTime === 30
                            ? `border-2 border-solid ${colors.activeBorder}`
                            : ''
                        }`}>
                        30s
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => startTimer(60)}
                        className={`flex-1 ${colors.smallButtonBg} ${colors.smallButtonText} py-2 rounded-lg font-medium ${
                          lastRestTime === 60
                            ? `border-2 border-solid ${colors.activeBorder}`
                            : ''
                        }`}>
                        60s
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => startTimer(90)}
                        className={`flex-1 ${colors.smallButtonBg} ${colors.smallButtonText} py-2 rounded-lg font-medium ${
                          lastRestTime === 90
                            ? `border-2 border-solid ${colors.activeBorder}`
                            : ''
                        }`}>
                        90s
                      </motion.button>
                    </>
                  )}
                </>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={togglePause}
                  className={`w-full ${colors.buttonBg} ${colors.buttonText} py-2 rounded-lg font-medium flex items-center justify-center gap-2`}>
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
              <p className='hidden lg:block text-xs text-gray-500 text-center'>
                Shortcuts: <span className='font-medium'>Space</span> - Start/Pause | <span className='font-medium'>R</span> - Reset | <span className='font-medium'>T</span> - Toggle
              </p>
              {hasActiveExercise && currentExerciseData && (
                <p className='text-xs text-emerald-600 text-center mt-1'>
                  🎯 Using {currentInProgressExercise} rest time ({currentRestTime}s)
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default WorkoutTimer;
