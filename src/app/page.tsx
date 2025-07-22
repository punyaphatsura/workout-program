'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Copy, RefreshCw } from 'lucide-react';
import WorkoutTimer from '@/components/WorkoutTimer';
import WorkoutCooldown from '@/components/WorkoutCooldown';

const program = {
  Monday: 'Upper #1',
  Tuesday: 'Lower #1', 
  Wednesday: 'Rest Day',
  Thursday: 'Upper #2',
  Friday: 'Lower #2',
  Saturday: 'Rest Day',
  Sunday: 'Rest Day',
};

type Exercise = {
  name: string;
  weight?: string;
  sets: number;
  reps?: string;
  rest: number;
  time?: string;
  progression?: string;
};

const upper1Workout: Exercise[] = [
  {
    name: 'Bench Press / Machine Press',
    weight: '25 kg',
    sets: 4,
    reps: '8–10',
    rest: 180,
    progression: 'Heavy but controlled weight',
  },
  {
    name: 'Lat Pulldown / Pull-Up Assist',
    weight: '23 kg',
    sets: 4,
    reps: '12',
    rest: 120,
    progression: 'Focus on middle back',
  },
  {
    name: 'Dumbbell Shoulder Press',
    weight: '5 kg each',
    sets: 3,
    reps: '12',
    rest: 90,
    progression: 'Front shoulders + good balance',
  },
  {
    name: 'Cable Row / Barbell Row',
    weight: '23 kg',
    sets: 4,
    reps: '12',
    rest: 90,
    progression: 'Focus on back + squeeze shoulder blades at end of set',
  },
  {
    name: 'Tricep Pushdown',
    weight: '8-13 kg',
    sets: 3,
    reps: '12',
    rest: 60,
    progression: 'Back of arms',
  },
  {
    name: 'Bicep Curl (DB / EZ Bar)',
    weight: '5 kg each',
    sets: 3,
    reps: '12',
    rest: 60,
    progression: 'Front of arms',
  },
  {
    name: 'Plank Hold',
    weight: 'Bodyweight',
    sets: 3,
    time: '45 seconds',
    rest: 60,
    progression: 'Six-pack starts here',
  },
];

const lower1Workout: Exercise[] = [
  {
    name: 'Barbell Back Squat',
    weight: 'Start light, use Smith Machine if new',
    sets: 4,
    reps: '10',
    rest: 180,
    progression: 'If new, use Smith Machine',
  },
  {
    name: 'Romanian Deadlift (DB)',
    weight: 'Moderate dumbbells',
    sets: 3,
    reps: '10',
    rest: 120,
    progression: 'Back thigh + glutes definition',
  },
  {
    name: 'Walking Lunge',
    weight: 'Bodyweight or light dumbbells',
    sets: 3,
    reps: '10 per side',
    rest: 90,
    progression: 'Glutes + core',
  },
  {
    name: 'Leg Curl (Machine)',
    weight: 'Machine weight',
    sets: 3,
    reps: '12',
    rest: 90,
    progression: 'Back thigh',
  },
  {
    name: 'Leg Extension (Machine)',
    weight: 'Machine weight',
    sets: 3,
    reps: '12',
    rest: 90,
    progression: 'Front thigh',
  },
  {
    name: 'Calf Raise',
    weight: 'Bodyweight or machine',
    sets: 3,
    reps: '20',
    rest: 60,
    progression: 'Tight front shins',
  },
  {
    name: 'Hanging Leg Raise / Sit-up',
    weight: 'Bodyweight',
    sets: 3,
    reps: '15',
    rest: 60,
    progression: 'Lower abs',
  },
];

const upper2Workout: Exercise[] = [
  {
    name: 'Incline Bench Press',
    weight: 'Moderate weight',
    sets: 4,
    reps: '8–10',
    rest: 180,
    progression: 'Upper chest',
  },
  {
    name: 'Arnold Press (Dumbbell)',
    weight: 'Light to moderate dumbbells',
    sets: 3,
    reps: '10',
    rest: 90,
    progression: 'Front + side shoulders',
  },
  {
    name: 'One-arm Dumbbell Row',
    weight: 'Moderate dumbbell',
    sets: 3,
    reps: '12',
    rest: 90,
    progression: 'Side back',
  },
  {
    name: 'Face Pull / Reverse Fly',
    weight: 'Light weight',
    sets: 3,
    reps: '15',
    rest: 60,
    progression: 'Rear shoulders to prevent slouching',
  },
  {
    name: 'Cable Lateral Raise',
    weight: 'Light weight',
    sets: 3,
    reps: '15',
    rest: 60,
    progression: 'Beautiful side shoulders',
  },
  {
    name: 'Hammer Curl + Tricep Dip (Super Set)',
    weight: 'Light dumbbells + bodyweight',
    sets: 3,
    reps: '12',
    rest: 90,
    progression: 'End the day with solid arms',
  },
  {
    name: 'Side Plank',
    weight: 'Bodyweight',
    sets: 3,
    time: '30 seconds per side',
    rest: 60,
    progression: 'Create a beautiful waist',
  },
];

const lower2Workout: Exercise[] = [
  {
    name: 'Bulgarian Split Squat',
    weight: 'Bodyweight or light dumbbells',
    sets: 3,
    reps: '8 per side',
    rest: 120,
    progression: 'Difficult but super worth it',
  },
  {
    name: 'Glute Bridge / Hip Thrust',
    weight: 'Bodyweight or barbell',
    sets: 4,
    reps: '10',
    rest: 90,
    progression: 'Rock solid glutes',
  },
  {
    name: 'Dumbbell Step Up',
    weight: 'Light to moderate dumbbells',
    sets: 3,
    reps: '12',
    rest: 90,
    progression: 'Thighs + balance',
  },
  {
    name: 'Sumo Squat',
    weight: 'Bodyweight or dumbbell',
    sets: 3,
    reps: '12',
    rest: 90,
    progression: 'Wide stance, focus inner thigh + glutes',
  },
  {
    name: 'Mountain Climbers',
    weight: 'Bodyweight',
    sets: 3,
    time: '30 seconds',
    rest: 60,
    progression: 'Core + fat burning',
  },
  {
    name: 'Hanging Leg Raise',
    weight: 'Bodyweight',
    sets: 3,
    reps: '15',
    rest: 60,
    progression: 'Lower abs',
  },
];

const workouts: { [key: string]: Exercise[] } = {
  'Upper #1': upper1Workout,
  'Lower #1': lower1Workout,
  'Upper #2': upper2Workout,
  'Lower #2': lower2Workout,
};

export default function Home() {
  const [currentWorkout, setCurrentWorkout] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [isManualMode, setIsManualMode] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [inProgressExercises, setInProgressExercises] = useState<string[]>([]);
  const [showCooldown, setShowCooldown] = useState(false);
  const [isTimerVisible, setIsTimerVisible] = useState(true);
  // const [copiedExercise, setCopiedExercise] = useState<string | null>(null);

  useEffect(() => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const defaultWorkout = program[today as keyof typeof program] || 'Rest Day';
    setCurrentWorkout(defaultWorkout);
    setSelectedDay(today);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // const copyToClipboard = (text: string) => {
  //   navigator.clipboard
  //     .writeText(text)
  //     .then(() => {
  //       setCopiedExercise(text);
  //       setTimeout(() => setCopiedExercise(null), 3000); // Reset after 3 seconds
  //     })
  //     .catch((err) => {
  //       console.error('Failed to copy:', err);
  //     });
  // };

  const toggleTimerVisibility = () => {
    setIsTimerVisible((prev) => !prev);
  };

  const handleFinishCooldown = () => {
    // Reset to auto-detect mode and clear completed exercises
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const defaultWorkout = program[today as keyof typeof program] || 'Rest Day';
    setCurrentWorkout(defaultWorkout);
    setSelectedDay(today);
    setIsManualMode(false);
    setCompletedExercises([]);
    setInProgressExercises([]);
    setShowCooldown(false);
  };

  const handleDaySelect = (day: string) => {
    setSelectedDay(day);
    setIsManualMode(true);
    setCurrentWorkout(program[day as keyof typeof program] || 'Rest Day');
    // Reset completed and in progress exercises when changing workout
    setCompletedExercises([]);
    setInProgressExercises([]);
  };

  const toggleAutoDetect = () => {
    if (isManualMode) {
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
      const defaultWorkout =
        program[today as keyof typeof program] || 'Rest Day';
      setCurrentWorkout(defaultWorkout);
      setSelectedDay(today);
      setIsManualMode(false);
      // Reset completed and in progress exercises
      setCompletedExercises([]);
      setInProgressExercises([]);
    }
  };

  const toggleExerciseState = (exerciseName: string) => {
    const isCompleted = completedExercises.includes(exerciseName);
    const isInProgress = inProgressExercises.includes(exerciseName);

    if (isCompleted) {
      // Completed → To Do (remove from completed)
      setCompletedExercises((prev) => prev.filter((name) => name !== exerciseName));
    } else if (isInProgress) {
      // In Progress → Completed (remove from progress, add to completed)
      setInProgressExercises((prev) => prev.filter((name) => name !== exerciseName));
      setCompletedExercises((prev) => [...prev, exerciseName]);
    } else {
      // To Do → In Progress (clear all in progress, then add this one)
      setInProgressExercises([exerciseName]);
    }
  };

  const finishWorkout = () => {
    // Reset to auto-detect mode and clear completed exercises
    setShowCooldown(true);
  };

  const isFinishable =
    currentWorkout !== 'Rest Day' &&
    workouts[currentWorkout as keyof typeof workouts]?.some((exercise) =>
      completedExercises.includes(exercise.name) || inProgressExercises.includes(exercise.name)
    );

  return (
    <div className='bg-gradient-to-br overflow-visible from-gray-100 to-gray-200 min-h-screen flex items-center justify-center p-4'>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className='w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden'>
        <div className='bg-gradient-to-r from-emerald-500 to-green-600 p-6'>
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className='text-center text-3xl font-extrabold text-white tracking-tight'>
            Weight Training (Upper / Lower Split)
          </motion.h1>
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className='text-center text-xl font-semibold text-white/90 mt-2'>
            Today: {currentWorkout}
          </motion.h2>
        </div>
        {currentWorkout !== 'Rest Day' && (
          <WorkoutTimer 
            isVisible={isTimerVisible} 
            onToggleVisibility={toggleTimerVisibility}
            inProgressExercises={inProgressExercises}
            currentWorkoutExercises={workouts[currentWorkout as keyof typeof workouts] || []}
          />
        )}
        {/* Day Selection Section */}
        <div className='p-4 bg-gray-50 flex flex-wrap justify-center gap-2'>
          {Object.keys(program).map((day) => (
            <motion.button
              key={day}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDaySelect(day)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                ${
                  selectedDay === day
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                }
              `}>
              {day}
            </motion.button>
          ))}

          {/* Auto Detect Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleAutoDetect}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
              ${
                !isManualMode
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
              }
            `}>
            Today
          </motion.button>
        </div>

        <div className='p-6'>
          <AnimatePresence mode='wait'>
            {currentWorkout !== 'Rest Day' &&
              workouts[currentWorkout as keyof typeof workouts] && (
                <motion.div
                  key='workout'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}>
                  <div className='flex justify-between items-center mb-4'>
                    <h3 className='text-lg font-semibold text-gray-700'>
                      Exercises:
                    </h3>
                    {/* Finish Workout Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={finishWorkout}
                      disabled={!isFinishable}
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium 
                        transition-colors
                        ${
                          isFinishable
                            ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }
                      `}>
                      <RefreshCw size={16} />
                      Finish Workout
                    </motion.button>
                  </div>
                  <div className='space-y-4'>
                    {workouts[currentWorkout as keyof typeof workouts].map(
                      (exercise, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: index * 0.1,
                            // type: 'spring',
                          }}
                          onClick={() =>
                            toggleExerciseState(exercise.name)
                          }
                          className={`
                            cursor-pointer border-2 rounded-xl p-4 shadow-sm 
                            transition-all duration-300 ease-in-out transform 
                            hover:shadow-md hover:-translate-y-1
                            ${
                              completedExercises.includes(exercise.name)
                                ? 'bg-emerald-50 border-emerald-300 hover:bg-emerald-100'
                                : inProgressExercises.includes(exercise.name)
                                ? 'bg-amber-50 border-amber-300 hover:bg-amber-100'
                                : 'bg-white border-gray-200 hover:bg-gray-50'
                            }
                          `}>
                          <div className='flex justify-between items-center mb-2'>
                            <div className='flex items-center gap-3'>
                              <motion.div
                                whileTap={{ scale: 0.9 }}
                                className={`
                                  w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center
                                  ${
                                    completedExercises.includes(exercise.name)
                                      ? 'bg-emerald-500 border-emerald-500'
                                      : inProgressExercises.includes(exercise.name)
                                      ? 'bg-amber-500 border-amber-500'
                                      : 'border-gray-300'
                                  }
                                `}>
                                {completedExercises.includes(exercise.name) && (
                                  <Check size={16} color='white' />
                                )}
                                {inProgressExercises.includes(exercise.name) && !completedExercises.includes(exercise.name) && (
                                  <div className='w-2 h-2 bg-white rounded-full animate-pulse' />
                                )}
                              </motion.div>
                              <h4
                                className={`
                                text-lg font-bold 
                                ${
                                  completedExercises.includes(exercise.name)
                                    ? 'text-emerald-700 line-through'
                                    : inProgressExercises.includes(exercise.name)
                                    ? 'text-amber-700'
                                    : 'text-emerald-600'
                                }
                              `}>
                                {exercise.name}
                              </h4>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevents toggling exercise completion
                                  window.open(
                                    `https://www.google.com/search?q=${encodeURIComponent(
                                      exercise.name
                                    )}&udm=2`,
                                    '_blank'
                                  );
                                }}
                                className='text-sm text-blue-500 hover:underline'>
                                {/* {copiedExercise === exercise.name ? (
                                  <div className='p-0.5 rounded-full bg-emerald-500 flex items-center justify-center'>
                                    <Check size={16} color='white' />
                                  </div>
                                ) : (
                                  <Copy size={16} color='rgb(4 120 87)' />
                                )} */}
                                <Copy size={16} color='rgb(4 120 87)' />
                              </button>
                            </div>
                            <span
                              className={`
                                text-xs font-medium px-2.5 py-0.5 rounded-full
                                ${
                                  completedExercises.includes(exercise.name)
                                    ? 'bg-emerald-200 text-emerald-900'
                                    : inProgressExercises.includes(exercise.name)
                                    ? 'bg-amber-200 text-amber-900'
                                    : 'bg-emerald-100 text-emerald-800'
                                }
                              `}>
                              {exercise.sets} Sets
                            </span>
                          </div>
                          <div className='grid grid-cols-2 gap-2 text-gray-600'>
                            <div>
                              <p className='font-bold text-black text-sm'>
                                Weight
                              </p>
                              <p>{exercise.weight || 'Bodyweight'}</p>
                            </div>
                            <div>
                              <p className='font-bold text-black text-sm'>
                                Reps/Time
                              </p>
                              <p>{exercise.reps || exercise?.time || 'N/A'}</p>
                            </div>
                            <div>
                              <p className='font-bold text-black text-sm'>
                                Rest
                              </p>
                              <p>{exercise.rest} seconds</p>
                            </div>
                            <div>
                              <p className='font-bold text-black text-sm'>
                                Progression
                              </p>
                              <p>{exercise.progression}</p>
                            </div>
                          </div>
                        </motion.div>
                      )
                    )}
                  </div>
                  
                  {/* Exercise State Guide */}
                  <div className='mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200'>
                    <p className='text-sm text-gray-600 text-center mb-2'>
                      <strong>Click to cycle through states</strong>
                    </p>
                    <div className='flex justify-center gap-4 text-xs'>
                      <div className='flex items-center gap-1'>
                        <div className='w-3 h-3 rounded-full border-2 border-gray-300'></div>
                        <span className='text-gray-600'>To Do</span>
                      </div>
                      <div className='flex items-center gap-1'>
                        <div className='w-3 h-3 rounded-full bg-amber-500 border-2 border-amber-500 flex items-center justify-center'>
                          <div className='w-1 h-1 bg-white rounded-full animate-pulse'></div>
                        </div>
                        <span className='text-amber-700'>In Progress</span>
                      </div>
                      <div className='flex items-center gap-1'>
                        <div className='w-3 h-3 rounded-full bg-emerald-500 border-2 border-emerald-500 flex items-center justify-center'>
                          <Check size={8} color='white' />
                        </div>
                        <span className='text-emerald-700'>Finished</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

            {currentWorkout === 'Rest Day' && (
              <motion.div
                key='rest'
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className='text-center bg-gray-100 p-6 rounded-xl'>
                <p className='text-gray-500 text-lg italic'>
                  Take a break and let your body recover!
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      <AnimatePresence>
        {showCooldown && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50'>
            <WorkoutCooldown
              workoutType={currentWorkout}
              onFinishCooldown={handleFinishCooldown}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
