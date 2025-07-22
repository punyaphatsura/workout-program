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

// Upper body cooldowns for Upper #1 and Upper #2
const upperBodyCooldown: CooldownExercise[] = [
  {
    name: 'Shoulder Stretch (แขนข้ามหน้า)',
    targetMuscleGroup: 'Shoulders',
    description:
      'Bring one arm across your chest and use the opposite hand to gently pull it closer to your body.',
    duration: '20–30 seconds per side',
  },
  {
    name: 'Triceps Stretch (เอื้อมแตะหลังศอก)',
    targetMuscleGroup: 'Triceps',
    description:
      'Raise one arm overhead, bend the elbow to reach and touch your back. Use the opposite hand to gently pull the elbow back.',
    duration: '20–30 seconds per side',
  },
  {
    name: 'Chest Opener (จับผนังแล้วบิดตัวออก)',
    targetMuscleGroup: 'Chest & Front Shoulders',
    description:
      'Place your hand against a wall, then slowly twist your body away from the wall to open up your chest.',
    duration: '20–30 seconds per side',
  },
  {
    name: 'Lat Stretch (จับโหนเหยียดตัว หรือเอาแขนพาดโต๊ะแล้วก้มตัว)',
    targetMuscleGroup: 'Lats & Side Body',
    description:
      'Hang from a bar to stretch your lats, or place your arm on a table and bend down to stretch the side body.',
    duration: '20–30 seconds per side',
  },
  {
    name: 'Neck Stretch (เอียงคอ ซ้าย/ขวา ค้างไว้)',
    targetMuscleGroup: 'Neck & Upper Traps',
    description:
      'Gently tilt your head to one side (left/right) and hold the position to stretch your neck and upper traps.',
    duration: '20–30 seconds per side',
  },
  {
    name: 'Wrist Stretch (งอข้อมือ บิดเข้าหาตัว)',
    targetMuscleGroup: 'Wrists & Forearms',
    description:
      'Bend your wrist and gently twist it toward your body to stretch your wrists and forearms.',
    duration: '20–30 seconds per side',
  },
];

// Lower body cooldowns for Lower #1 and Lower #2  
const lowerBodyCooldown: CooldownExercise[] = [
  {
    name: 'Quad Stretch (ดึงปลายเท้าไปด้านหลัง)',
    targetMuscleGroup: 'Quadriceps',
    description:
      'Stand on one leg and pull your foot toward your glutes from behind to stretch your quadriceps.',
    duration: '30 seconds per side',
  },
  {
    name: 'Hamstring Stretch (เหยียดขาแล้วโน้มตัว)',
    targetMuscleGroup: 'Hamstrings',
    description:
      'Extend your leg and lean your body forward to stretch your hamstring muscles.',
    duration: '30 seconds per side',
  },
  {
    name: 'Calf Stretch (ยันกำแพง เท้ายืนห่างกัน)',
    targetMuscleGroup: 'Calves',
    description:
      'Push against a wall with your feet positioned apart, keeping the back leg straight to stretch your calf.',
    duration: '30 seconds per side',
  },
  {
    name: 'Glute Stretch (นั่งไขว่ห้าง โน้มตัว)',
    targetMuscleGroup: 'Glutes',
    description:
      'Sit cross-legged and lean your body forward to stretch your glute muscles.',
    duration: '30 seconds per side',
  },
  {
    name: 'Hip Flexor Stretch (เข่าหนึ่งข้างยันพื้น อีกข้างยื่นไปหน้า)',
    targetMuscleGroup: 'Hip Flexors',
    description:
      'Place one knee on the ground and extend the other leg forward, then push your hips forward to stretch the hip flexors.',
    duration: '30 seconds per side',
  },
];

const cooldowns: { [key: string]: CooldownExercise[] } = {
  // Legacy workout types (keeping for compatibility)
  'Push Day': pushCooldown,
  'Pull Day': pullCooldown,
  'Leg Day': legCooldown,
  // New Upper/Lower split workout types
  'Upper #1': upperBodyCooldown,
  'Upper #2': upperBodyCooldown,
  'Lower #1': lowerBodyCooldown,
  'Lower #2': lowerBodyCooldown,
};

interface CooldownProps {
  workoutType: string;
  onFinishCooldown: () => void;
}

const WorkoutCooldown = ({ workoutType, onFinishCooldown }: CooldownProps) => {
  const [completedStretches, setCompletedStretches] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

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
      setDirection('next');
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setDirection('prev');
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className='bg-white rounded-2xl overflow-hidden shadow-xl p-4 sm:p-6 w-full max-w-2xl mx-auto'>
      <div className='text-center mb-4 sm:mb-6'>
        <h2 className='text-xl sm:text-2xl font-bold text-emerald-600 mb-2'>
          🔹 Post-Workout Stretches
        </h2>
        <p className='text-sm sm:text-base text-gray-600 mb-2'>
          Complete these stretches to help your muscles recover
        </p>
        <p className='text-xs sm:text-sm text-emerald-700 font-medium'>
          💡 If any area feels very tight, do 2 rounds of stretching
        </p>
      </div>

      <div className='relative'>
        <AnimatePresence mode='wait' custom={direction}>
          <motion.div
            key={currentExercise.name}
            custom={direction}
            variants={{
              enter: (direction) => ({
                x: direction === 'next' ? 680 : -680,
                // opacity: 0
              }),
              center: {
                x: 0,
                opacity: 1
              },
              exit: (direction) => ({
                x: direction === 'next' ? -680 : 680,
                // opacity: 0
              })
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className='bg-gray-50 rounded-xl p-4 sm:p-6 mb-4'>
            <div className='flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2'>
              <div className='flex items-center gap-2'>
                <h3 className='text-lg sm:text-xl font-semibold text-gray-800'>
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
                  className='text-sm text-blue-500 hover:underline flex-shrink-0'>
                  <Copy size={16} color='rgb(4 120 87)' />
                </button>
              </div>
              <span className='px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs sm:text-sm self-start sm:self-auto'>
                {currentExercise.targetMuscleGroup}
              </span>
            </div>

            <p className='text-gray-600 mb-4 text-sm sm:text-base'>{currentExercise.description}</p>

            <div className='flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-4'>
              <Timer size={16} />
              <span>{currentExercise.duration}</span>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleStretchCompletion(currentExercise.name)}
              className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm sm:text-base ${
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

        <div className='flex flex-col sm:flex-row justify-between mt-6 gap-3 sm:gap-0'>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`px-4 py-2 rounded-lg text-sm sm:text-base ${
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
              className='px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 flex items-center justify-center gap-2 text-sm sm:text-base'>
              Next <ChevronRight size={16} />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onFinishCooldown}
              disabled={!allStretchesCompleted}
              className={`px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm sm:text-base ${
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

      <div className='mt-4 sm:mt-6 flex justify-center gap-2'>
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
