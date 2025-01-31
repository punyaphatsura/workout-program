'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Copy, RefreshCw } from 'lucide-react';
import WorkoutTimer from '@/components/WorkoutTimer';
import WorkoutCooldown from '@/components/WorkoutCooldown';

const program = {
  Monday: 'Push Day',
  Tuesday: 'Bodyweight Day',
  Wednesday: 'Rest Day',
  Thursday: 'Pull Day',
  Friday: 'Leg Day',
  Saturday: 'Push Day',
  Sunday: 'Pull Day',
};

type Exercise = {
  name: string;
  weight?: string;
  sets: number;
  reps?: string;
  rest: string;
  time?: string;
  progression?: string;
};

const pushWorkout: Exercise[] = [
  {
    name: 'Barbell Bench Press',
    weight: 'Barbell (1.8 kg) + 2 × 2.5 kg + 2 × 1.25 kg = 9.8 kg',
    progression: 'Add up to 2 × 0.5 kg per side to reach 10.8 kg',
    sets: 4,
    reps: '8–10',
    rest: '90 seconds',
  },
  {
    name: 'Incline Dumbbell Press',
    weight: 'Dumbbell (0.7 kg each) + 2 × 1.25 kg = 3.2 kg per hand',
    progression: 'Add 0.5 kg per hand to reach 3.7 kg',
    sets: 3,
    reps: '10–12',
    rest: '90 seconds',
  },
  {
    name: 'Overhead Shoulder Press',
    weight: 'Dumbbell (0.7 kg each) + 2 × 1.25 kg = 3.2 kg per hand',
    progression: 'Add 0.5 kg per hand to reach 3.7 kg',
    sets: 3,
    reps: '10–12',
    rest: '60 seconds',
  },
  {
    name: 'Tricep Dips',
    weight: 'Bodyweight',
    sets: 3,
    reps: '12–15',
    rest: '60 seconds',
  },
  {
    name: 'Lateral Raises',
    weight: 'Dumbbell (0.7 kg each) + 2 × 0.5 kg = 1.7 kg per hand',
    progression: 'Add up to 1.25 kg per hand',
    sets: 3,
    reps: '12–15',
    rest: '60 seconds',
  },
];
const pullWorkout: Exercise[] = [
  {
    name: 'Deadlifts',
    weight: 'Barbell (1.8 kg) + 2 × 2.5 kg + 2 × 1.25 kg = 9.8 kg',
    progression: 'Add 0.5 kg per side to reach 10.8 kg',
    sets: 4,
    reps: '6–8',
    rest: '90 seconds',
  },
  {
    name: 'Pull-Ups',
    weight: 'Bodyweight',
    sets: 3,
    reps: '8–10',
    rest: '90 seconds',
  },
  {
    name: 'Bent-Over Barbell Rows',
    weight: 'Barbell (1.8 kg) + 2 × 2.5 kg + 2 × 1.25 kg = 9.8 kg',
    progression: 'Add 0.5 kg per side to reach 10.8 kg',
    sets: 3,
    reps: '8–10',
    rest: '90 seconds',
  },
  {
    name: 'Dumbbell Curls',
    weight: 'Dumbbell (0.7 kg each) + 2 × 1.25 kg = 3.2 kg per hand',
    progression: 'Add 0.5 kg per hand to reach 3.7 kg',
    sets: 3,
    reps: '10–12',
    rest: '60 seconds',
  },
  {
    name: 'Bent-Over Reverse Flyes',
    weight: 'Dumbbell (0.7 kg each) + 2 × 1.25 kg = 3.2 kg per hand',
    progression: '3–5 kg per hand',
    sets: 3,
    reps: '12–15',
    rest: '60 seconds',
  },
];
const legWorkout: Exercise[] = [
  {
    name: 'Back Squats',
    weight: 'Barbell (1.8 kg) + 2 × 2.5 kg + 2 × 1.25 kg = 9.8 kg',
    progression: 'Add 0.5 kg per side to reach 10.8 kg',
    sets: 4,
    reps: '8–10',
    rest: '90 seconds',
  },
  {
    name: 'Romanian Deadlifts',
    weight: 'Barbell (1.8 kg) + 2 × 2.5 kg + 2 × 1.25 kg = 9.8 kg',
    progression: 'Add 0.5 kg per side to reach 10.8 kg',
    sets: 3,
    reps: '10–12',
    rest: '90 seconds',
  },
  {
    name: 'Barbell Front Squats',
    weight: 'Barbell (1.8 kg) + 2 × 2.5 kg + 2 × 1.25 kg = 9.8 kg',
    progression: 'Add up to 2 × 0.5 kg per side to reach 10.8 kg',
    sets: 3,
    reps: '12–15',
    rest: '90 seconds',
  },
  {
    name: 'Lunges',
    weight: 'Dumbbell (0.7 kg each) + 2 × 1.25 kg = 3.2 kg per hand',
    progression: 'Add 0.5 kg per hand to reach 3.7 kg',
    sets: 3,
    reps: '10–12 per leg',
    rest: '60 seconds',
  },
  {
    name: 'Calf Raises',
    weight: 'Bodyweight or Machine',
    sets: 3,
    reps: '15–20',
    rest: '60 seconds',
  },
];
const bodyweightWorkout: Exercise[] = [
  {
    name: 'Push-Ups',
    sets: 3,
    reps: '10–15',
    rest: '60 seconds',
    progression: 'Increase reps or try incline/decline variations',
  },
  {
    name: 'Bodyweight Squats',
    sets: 3,
    reps: '15–20',
    rest: '60 seconds',
    progression: 'Increase reps or try jump squats',
  },
  {
    name: 'Plank',
    sets: 3,
    time: '30–60 seconds',
    rest: '60 seconds',
    progression: 'Increase hold time or add shoulder taps',
  },
  {
    name: 'Lunges',
    sets: 3,
    reps: '10–12 per leg',
    rest: '60 seconds',
    progression: 'Increase reps or add a jump between lunges',
  },
  {
    name: 'Glute Bridges',
    sets: 3,
    reps: '15–20',
    rest: '60 seconds',
    progression:
      'Hold the top position for a few seconds or try single-leg variations',
  },
  {
    name: 'Superman Hold',
    sets: 3,
    time: '30 seconds',
    rest: '60 seconds',
    progression: 'Increase hold time or add pulses',
  },
];

const workouts: { [key: string]: Exercise[] } = {
  'Push Day': pushWorkout,
  'Pull Day': pullWorkout,
  'Leg Day': legWorkout,
  'Bodyweight Day': bodyweightWorkout,
};

export default function Home() {
  const [currentWorkout, setCurrentWorkout] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [isManualMode, setIsManualMode] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [showCooldown, setShowCooldown] = useState(false);
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

  const handleFinishCooldown = () => {
    // Reset to auto-detect mode and clear completed exercises
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const defaultWorkout = program[today as keyof typeof program] || 'Rest Day';
    setCurrentWorkout(defaultWorkout);
    setSelectedDay(today);
    setIsManualMode(false);
    setCompletedExercises([]);
    setShowCooldown(false);
  };

  const handleDaySelect = (day: string) => {
    setSelectedDay(day);
    setIsManualMode(true);
    setCurrentWorkout(program[day as keyof typeof program] || 'Rest Day');
    // Reset completed exercises when changing workout
    setCompletedExercises([]);
  };

  const toggleAutoDetect = () => {
    if (isManualMode) {
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
      const defaultWorkout =
        program[today as keyof typeof program] || 'Rest Day';
      setCurrentWorkout(defaultWorkout);
      setSelectedDay(today);
      setIsManualMode(false);
      // Reset completed exercises
      setCompletedExercises([]);
    }
  };

  const toggleExerciseCompletion = (exerciseName: string) => {
    setCompletedExercises((prev) =>
      prev.includes(exerciseName)
        ? prev.filter((name) => name !== exerciseName)
        : [...prev, exerciseName]
    );
  };

  const finishWorkout = () => {
    // Reset to auto-detect mode and clear completed exercises
    setShowCooldown(true);
  };

  const isFinishable =
    currentWorkout !== 'Rest Day' &&
    workouts[currentWorkout as keyof typeof workouts]?.some((exercise) =>
      completedExercises.includes(exercise.name)
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
            Beginner Weight Training Program
          </motion.h1>
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className='text-center text-xl font-semibold text-white/90 mt-2'>
            Today: {currentWorkout}
          </motion.h2>
        </div>
        {currentWorkout !== 'Rest Day' && <WorkoutTimer />}
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
                            toggleExerciseCompletion(exercise.name)
                          }
                          className={`
                            cursor-pointer border-2 rounded-xl p-4 shadow-sm 
                            transition-all duration-300 ease-in-out transform 
                            hover:shadow-md hover:-translate-y-1
                            ${
                              completedExercises.includes(exercise.name)
                                ? 'bg-emerald-50 border-emerald-300 hover:bg-emerald-100'
                                : 'bg-white border-gray-200 hover:bg-gray-50'
                            }
                          `}>
                          <div className='flex justify-between items-center mb-2'>
                            <div className='flex items-center gap-3'>
                              <motion.div
                                whileTap={{ scale: 0.9 }}
                                className={`
                                  w-6 h-6 rounded-full border-2 flex items-center justify-center
                                  ${
                                    completedExercises.includes(exercise.name)
                                      ? 'bg-emerald-500 border-emerald-500'
                                      : 'border-gray-300'
                                  }
                                `}>
                                {completedExercises.includes(exercise.name) && (
                                  <Check size={16} color='white' />
                                )}
                              </motion.div>
                              <h4
                                className={`
                                text-lg font-bold 
                                ${
                                  completedExercises.includes(exercise.name)
                                    ? 'text-emerald-700 line-through'
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
                              <p>{exercise.rest}</p>
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
