'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, Timer, RotateCcw, Copy } from 'lucide-react';

interface CooldownExercise {
  name: string;
  targetMuscleGroup: string;
  description: string;
  duration: string;
}

const pushCooldown: CooldownExercise[] = [
  {
    name: 'Chest Stretch',
    targetMuscleGroup: 'Chest',
    description:
      'Stand in a doorway with one arm at shoulder height and the other on the doorframe. Step forward slowly until you feel a stretch in your chest.',
    duration: '30 seconds per side',
  },
  {
    name: 'Shoulder Stretch',
    targetMuscleGroup: 'Shoulders',
    description:
      'Bring one arm across your chest and use the opposite hand to press your arm closer to your body.',
    duration: '30 seconds per side',
  },
  {
    name: 'Tricep Stretch',
    targetMuscleGroup: 'Triceps',
    description:
      'Raise one arm overhead, bend the elbow, and touch your upper back. Use the opposite hand to gently pull the elbow back.',
    duration: '30 seconds per side',
  },
];

const pullCooldown: CooldownExercise[] = [
  {
    name: 'Lat Stretch',
    targetMuscleGroup: 'Lats',
    description:
      'Grab a stable object with both hands and sit back, stretching your lats.',
    duration: '30 seconds',
  },
  {
    name: 'Upper Back Stretch',
    targetMuscleGroup: 'Upper Back',
    description:
      'Clasp your hands in front of you and push them forward, rounding your back to feel the stretch.',
    duration: '30 seconds',
  },
  {
    name: 'Bicep Stretch',
    targetMuscleGroup: 'Biceps',
    description:
      'Extend your arm to the side with your palm facing forward. Rotate the arm slightly backward until you feel a stretch.',
    duration: '30 seconds per side',
  },
];

const legCooldown: CooldownExercise[] = [
  {
    name: 'Quadriceps Stretch',
    targetMuscleGroup: 'Quadriceps',
    description:
      'Stand on one leg, pull the opposite foot toward your glutes, and hold the ankle to stretch your quads.',
    duration: '30 seconds per side',
  },
  {
    name: 'Hamstring Stretch',
    targetMuscleGroup: 'Hamstrings',
    description:
      'Sit on the ground with one leg extended and the other bent. Reach toward your toes to stretch the extended leg.',
    duration: '30 seconds per side',
  },
  {
    name: 'Calf Stretch',
    targetMuscleGroup: 'Calves',
    description:
      'Place your hands on a wall and step one foot back, keeping it straight and pressing the heel into the ground to stretch your calf.',
    duration: '30 seconds per side',
  },
];

const cooldowns: { [key: string]: CooldownExercise[] } = {
  'Push Day': pushCooldown,
  'Pull Day': pullCooldown,
  'Leg Day': legCooldown,
};

interface CooldownProps {
  workoutType: string;
  onFinishCooldown: () => void;
}

const WorkoutCooldown = ({ workoutType, onFinishCooldown }: CooldownProps) => {
  const [completedStretches, setCompletedStretches] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const exercises = cooldowns[workoutType] || [];
  const currentExercise = exercises[currentIndex];
  const isLastExercise = currentIndex === exercises.length - 1;
  const allStretchesCompleted = completedStretches.length === exercises.length;

  const toggleStretchCompletion = (name: string) => {
    setCompletedStretches((prev) =>
      prev.includes(name)
        ? prev.filter((stretch) => stretch !== name)
        : [...prev, name]
    );
  };

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className='bg-white rounded-2xl shadow-xl p-6 max-w-2xl min-w-[672px] mx-auto'>
      <div className='text-center mb-6'>
        <h2 className='text-2xl font-bold text-emerald-600 mb-2'>
          Cooldown Stretches
        </h2>
        <p className='text-gray-600'>
          Complete these stretches to help your muscles recover
        </p>
      </div>

      <div className='relative'>
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentExercise.name}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className='bg-gray-50 rounded-xl p-6 mb-4'>
            <div className='flex items-center justify-between mb-4'>
              <div className='flex items-center gap-2'>
                <h3 className='text-xl font-semibold text-gray-800'>
                  {currentExercise.name}
                </h3>

                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents toggling exercise completion
                    window.open(
                      `https://www.google.com/search?q=${encodeURIComponent(
                        currentExercise.name
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
              <span className='px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm'>
                {currentExercise.targetMuscleGroup}
              </span>
            </div>

            <p className='text-gray-600 mb-4'>{currentExercise.description}</p>

            <div className='flex items-center gap-2 text-sm text-gray-500 mb-4'>
              <Timer size={16} />
              <span>{currentExercise.duration}</span>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleStretchCompletion(currentExercise.name)}
              className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                completedStretches.includes(currentExercise.name)
                  ? 'bg-emerald-500 text-white'
                  : 'bg-emerald-100 text-emerald-700'
              }`}>
              {completedStretches.includes(currentExercise.name) ? (
                <>
                  <Check size={20} />
                  Completed
                </>
              ) : (
                'Mark as Complete'
              )}
            </motion.button>
          </motion.div>
        </AnimatePresence>

        <div className='flex justify-between mt-6'>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`px-4 py-2 rounded-lg ${
              currentIndex === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}>
            Previous
          </motion.button>

          {!isLastExercise ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className='px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 flex items-center gap-2'>
              Next <ChevronRight size={16} />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onFinishCooldown}
              disabled={!allStretchesCompleted}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                allStretchesCompleted
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}>
              <RotateCcw size={16} />
              Finish Cooldown
            </motion.button>
          )}
        </div>
      </div>

      <div className='mt-6 flex justify-center gap-2'>
        {exercises.map((_, index) => (
          <motion.div
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex
                ? 'bg-emerald-500'
                : completedStretches.includes(exercises[index].name)
                ? 'bg-emerald-200'
                : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default WorkoutCooldown;
