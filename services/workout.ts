import { Sport, AthleteProfile, SportSelection } from './athlete';

export interface Workout {
  id: string;
  name: string;
  sport: Sport;
  duration: number; // minutes
  intensity: 'low' | 'moderate' | 'high' | 'recovery';
  description: string;
  muscleGroups: string[];
  exercises?: string[];
}

export interface DayPlan {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  date: string;
  workout: Workout | null;
  isRestDay: boolean;
  isToday: boolean;
}

export type WeeklyPlan = DayPlan[];

// Workout templates by sport and skill level
const workoutTemplates: Record<Sport, Record<string, Workout[]>> = {
  running: {
    beginner: [
      {
        id: 'run-b-1',
        name: 'Easy Jog',
        sport: 'running',
        duration: 20,
        intensity: 'low',
        description: 'Light jog to build base endurance',
        muscleGroups: ['legs', 'core', 'cardio'],
        exercises: ['Warm-up walk', 'Easy jog', 'Cool-down stretch'],
      },
      {
        id: 'run-b-2',
        name: 'Walk-Run Intervals',
        sport: 'running',
        duration: 25,
        intensity: 'low',
        description: 'Alternate walking and jogging',
        muscleGroups: ['legs', 'cardio'],
        exercises: ['5 min walk', '2 min jog x5', '5 min walk'],
      },
    ],
    moderate: [
      {
        id: 'run-m-1',
        name: 'Tempo Run',
        sport: 'running',
        duration: 35,
        intensity: 'moderate',
        description: 'Sustained effort at threshold pace',
        muscleGroups: ['legs', 'core', 'cardio'],
        exercises: ['10 min warm-up', '15 min tempo', '10 min cool-down'],
      },
      {
        id: 'run-m-2',
        name: 'Fartlek Training',
        sport: 'running',
        duration: 40,
        intensity: 'moderate',
        description: 'Speed play with varied pace',
        muscleGroups: ['legs', 'core', 'cardio'],
      },
    ],
    advanced: [
      {
        id: 'run-a-1',
        name: 'Interval Sprints',
        sport: 'running',
        duration: 45,
        intensity: 'high',
        description: 'High-intensity interval training',
        muscleGroups: ['legs', 'core', 'cardio'],
        exercises: ['Warm-up', '400m repeats x8', 'Cool-down'],
      },
      {
        id: 'run-a-2',
        name: 'Long Run',
        sport: 'running',
        duration: 90,
        intensity: 'moderate',
        description: 'Extended distance run',
        muscleGroups: ['legs', 'core', 'cardio'],
      },
    ],
  },
  biking: {
    beginner: [
      {
        id: 'bike-b-1',
        name: 'Easy Ride',
        sport: 'biking',
        duration: 30,
        intensity: 'low',
        description: 'Relaxed cycling to build comfort',
        muscleGroups: ['legs', 'core', 'cardio'],
      },
    ],
    moderate: [
      {
        id: 'bike-m-1',
        name: 'Hill Repeats',
        sport: 'biking',
        duration: 45,
        intensity: 'moderate',
        description: 'Climb and descent intervals',
        muscleGroups: ['legs', 'core', 'cardio'],
      },
    ],
    advanced: [
      {
        id: 'bike-a-1',
        name: 'Sprint Intervals',
        sport: 'biking',
        duration: 60,
        intensity: 'high',
        description: 'Maximum power sprints',
        muscleGroups: ['legs', 'core', 'cardio'],
      },
    ],
  },
  swimming: {
    beginner: [
      {
        id: 'swim-b-1',
        name: 'Technique Focus',
        sport: 'swimming',
        duration: 30,
        intensity: 'low',
        description: 'Work on stroke mechanics',
        muscleGroups: ['shoulders', 'back', 'arms', 'core'],
      },
    ],
    moderate: [
      {
        id: 'swim-m-1',
        name: 'Endurance Swim',
        sport: 'swimming',
        duration: 45,
        intensity: 'moderate',
        description: 'Sustained swimming with minimal rest',
        muscleGroups: ['shoulders', 'back', 'arms', 'core', 'cardio'],
      },
    ],
    advanced: [
      {
        id: 'swim-a-1',
        name: 'Speed Sets',
        sport: 'swimming',
        duration: 60,
        intensity: 'high',
        description: 'Fast-paced interval training',
        muscleGroups: ['shoulders', 'back', 'arms', 'core', 'cardio'],
      },
    ],
  },
  boxing: {
    beginner: [
      {
        id: 'box-b-1',
        name: 'Boxing Basics',
        sport: 'boxing',
        duration: 30,
        intensity: 'low',
        description: 'Learn fundamental punches and footwork',
        muscleGroups: ['arms', 'shoulders', 'core'],
        exercises: ['Jab-Cross combos', 'Footwork drills', 'Shadow boxing'],
      },
    ],
    moderate: [
      {
        id: 'box-m-1',
        name: 'Heavy Bag Work',
        sport: 'boxing',
        duration: 45,
        intensity: 'moderate',
        description: 'Power punching on the heavy bag',
        muscleGroups: ['arms', 'shoulders', 'core', 'cardio'],
      },
    ],
    advanced: [
      {
        id: 'box-a-1',
        name: 'Sparring Prep',
        sport: 'boxing',
        duration: 60,
        intensity: 'high',
        description: 'High-intensity combat simulation',
        muscleGroups: ['arms', 'shoulders', 'core', 'cardio'],
      },
    ],
  },
  tennis: {
    beginner: [
      {
        id: 'ten-b-1',
        name: 'Rally Practice',
        sport: 'tennis',
        duration: 45,
        intensity: 'low',
        description: 'Consistent hitting and movement',
        muscleGroups: ['arms', 'shoulders', 'legs', 'core'],
      },
    ],
    moderate: [
      {
        id: 'ten-m-1',
        name: 'Match Play',
        sport: 'tennis',
        duration: 60,
        intensity: 'moderate',
        description: 'Competitive sets with strategy focus',
        muscleGroups: ['arms', 'shoulders', 'legs', 'core'],
      },
    ],
    advanced: [
      {
        id: 'ten-a-1',
        name: 'Intense Drills',
        sport: 'tennis',
        duration: 75,
        intensity: 'high',
        description: 'High-speed footwork and power shots',
        muscleGroups: ['arms', 'shoulders', 'legs', 'core', 'cardio'],
      },
    ],
  },
  gym: {
    beginner: [
      {
        id: 'gym-b-1',
        name: 'Full Body Basics',
        sport: 'gym',
        duration: 45,
        intensity: 'low',
        description: 'Learn compound movement patterns',
        muscleGroups: ['full-body'],
        exercises: ['Squats', 'Push-ups', 'Rows', 'Planks'],
      },
    ],
    moderate: [
      {
        id: 'gym-m-1',
        name: 'Strength Circuit',
        sport: 'gym',
        duration: 55,
        intensity: 'moderate',
        description: 'Progressive resistance training',
        muscleGroups: ['full-body'],
        exercises: ['Deadlifts', 'Bench Press', 'Pull-ups', 'Lunges'],
      },
    ],
    advanced: [
      {
        id: 'gym-a-1',
        name: 'Power Training',
        sport: 'gym',
        duration: 70,
        intensity: 'high',
        description: 'Heavy compound lifts for strength',
        muscleGroups: ['full-body'],
        exercises: ['Heavy Squats', 'Deadlifts', 'Olympic Lifts'],
      },
    ],
  },
  yoga: {
    beginner: [
      {
        id: 'yoga-b-1',
        name: 'Gentle Flow',
        sport: 'yoga',
        duration: 30,
        intensity: 'recovery',
        description: 'Relaxing sequence for flexibility',
        muscleGroups: ['core', 'flexibility', 'back'],
      },
    ],
    moderate: [
      {
        id: 'yoga-m-1',
        name: 'Vinyasa Flow',
        sport: 'yoga',
        duration: 45,
        intensity: 'low',
        description: 'Dynamic movement with breath',
        muscleGroups: ['core', 'flexibility', 'back'],
      },
    ],
    advanced: [
      {
        id: 'yoga-a-1',
        name: 'Power Yoga',
        sport: 'yoga',
        duration: 60,
        intensity: 'moderate',
        description: 'Challenging strength-based yoga',
        muscleGroups: ['core', 'flexibility', 'back', 'arms'],
      },
    ],
  },
  crossfit: {
    beginner: [
      {
        id: 'cf-b-1',
        name: 'Foundations WOD',
        sport: 'crossfit',
        duration: 30,
        intensity: 'moderate',
        description: 'Learn CrossFit fundamentals',
        muscleGroups: ['full-body', 'cardio'],
        exercises: ['Air Squats', 'Push-ups', 'Sit-ups', 'Running'],
      },
    ],
    moderate: [
      {
        id: 'cf-m-1',
        name: 'AMRAP Challenge',
        sport: 'crossfit',
        duration: 40,
        intensity: 'high',
        description: 'As many rounds as possible',
        muscleGroups: ['full-body', 'cardio'],
      },
    ],
    advanced: [
      {
        id: 'cf-a-1',
        name: 'Hero WOD',
        sport: 'crossfit',
        duration: 60,
        intensity: 'high',
        description: 'Maximum intensity named workout',
        muscleGroups: ['full-body', 'cardio'],
      },
    ],
  },
  soccer: {
    beginner: [
      {
        id: 'soc-b-1',
        name: 'Ball Control',
        sport: 'soccer',
        duration: 45,
        intensity: 'low',
        description: 'Dribbling and passing fundamentals',
        muscleGroups: ['legs', 'core', 'cardio'],
      },
    ],
    moderate: [
      {
        id: 'soc-m-1',
        name: 'Small-Sided Games',
        sport: 'soccer',
        duration: 60,
        intensity: 'moderate',
        description: 'Competitive mini matches',
        muscleGroups: ['legs', 'core', 'cardio'],
      },
    ],
    advanced: [
      {
        id: 'soc-a-1',
        name: 'Match Fitness',
        sport: 'soccer',
        duration: 90,
        intensity: 'high',
        description: 'Full match simulation training',
        muscleGroups: ['legs', 'core', 'cardio'],
      },
    ],
  },
  basketball: {
    beginner: [
      {
        id: 'bball-b-1',
        name: 'Skills Training',
        sport: 'basketball',
        duration: 45,
        intensity: 'low',
        description: 'Shooting, dribbling, passing drills',
        muscleGroups: ['legs', 'arms', 'core'],
      },
    ],
    moderate: [
      {
        id: 'bball-m-1',
        name: 'Scrimmage',
        sport: 'basketball',
        duration: 60,
        intensity: 'moderate',
        description: 'Half-court and full-court play',
        muscleGroups: ['legs', 'arms', 'core', 'cardio'],
      },
    ],
    advanced: [
      {
        id: 'bball-a-1',
        name: 'Competitive Play',
        sport: 'basketball',
        duration: 75,
        intensity: 'high',
        description: 'Full-intensity game scenarios',
        muscleGroups: ['legs', 'arms', 'core', 'cardio'],
      },
    ],
  },
};

// Recovery workout
const recoveryWorkout: Workout = {
  id: 'recovery',
  name: 'Active Recovery',
  sport: 'yoga',
  duration: 20,
  intensity: 'recovery',
  description: 'Light movement and stretching',
  muscleGroups: ['flexibility', 'core'],
  exercises: ['Gentle stretching', 'Foam rolling', 'Deep breathing'],
};

// Get day name from date
function getDayName(date: Date): DayPlan['day'] {
  const days: DayPlan['day'][] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
}

// Format date string
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Get a random workout for a sport and skill level
function getRandomWorkout(sport: Sport, skillLevel: string): Workout {
  const templates = workoutTemplates[sport]?.[skillLevel] || workoutTemplates[sport]?.['beginner'] || [];
  if (templates.length === 0) {
    return {
      id: `${sport}-default`,
      name: `${sport.charAt(0).toUpperCase() + sport.slice(1)} Training`,
      sport,
      duration: 45,
      intensity: 'moderate',
      description: 'General training session',
      muscleGroups: ['full-body'],
    };
  }
  return templates[Math.floor(Math.random() * templates.length)];
}

/**
 * Generate a weekly workout plan based on athlete profile
 */
export function generateWeeklyPlan(profile: AthleteProfile): WeeklyPlan {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Start from Monday

  const plan: WeeklyPlan = [];
  const trainingDays = profile.weeklyTrainingDays;
  const sports = profile.sports;

  // Determine which days are training days (spread evenly)
  const trainingDayIndices: number[] = [];
  if (trainingDays <= 3) {
    trainingDayIndices.push(0, 2, 4); // Mon, Wed, Fri
  } else if (trainingDays <= 5) {
    trainingDayIndices.push(0, 1, 2, 3, 4); // Mon-Fri
  } else {
    trainingDayIndices.push(0, 1, 2, 3, 4, 5); // Mon-Sat
  }

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startOfWeek);
    currentDate.setDate(startOfWeek.getDate() + i);

    const isTrainingDay = trainingDayIndices.slice(0, trainingDays).includes(i);
    const isToday = currentDate.toDateString() === today.toDateString();

    let workout: Workout | null = null;
    if (isTrainingDay && sports.length > 0) {
      // Rotate through sports
      const sportIndex = i % sports.length;
      const sportSelection = sports[sportIndex];
      workout = getRandomWorkout(sportSelection.sport, sportSelection.skillLevel);
    } else if (i === 6 && trainingDays >= 4) {
      // Add recovery on Sunday if training frequently
      workout = recoveryWorkout;
    }

    plan.push({
      day: getDayName(currentDate),
      date: formatDate(currentDate),
      workout,
      isRestDay: !workout,
      isToday,
    });
  }

  return plan;
}

/**
 * Get today's workout from the weekly plan
 */
export function getTodayWorkout(plan: WeeklyPlan): Workout | null {
  const today = plan.find((day) => day.isToday);
  return today?.workout || null;
}

/**
 * Get muscle groups being trained this week
 */
export function getWeeklyMuscleGroups(plan: WeeklyPlan): string[] {
  const muscles = new Set<string>();
  plan.forEach((day) => {
    day.workout?.muscleGroups.forEach((muscle) => muscles.add(muscle));
  });
  return Array.from(muscles);
}

/**
 * Calculate weekly training stats
 */
export function getWeeklyStats(plan: WeeklyPlan): {
  totalDuration: number;
  workoutCount: number;
  sportBreakdown: Record<string, number>;
} {
  let totalDuration = 0;
  let workoutCount = 0;
  const sportBreakdown: Record<string, number> = {};

  plan.forEach((day) => {
    if (day.workout) {
      totalDuration += day.workout.duration;
      workoutCount++;
      const sport = day.workout.sport;
      sportBreakdown[sport] = (sportBreakdown[sport] || 0) + 1;
    }
  });

  return { totalDuration, workoutCount, sportBreakdown };
}
