import * as SecureStore from 'expo-secure-store';

const ATHLETE_PROFILE_KEY = 'ATHLETE_PROFILE';
const ONBOARDING_COMPLETE_KEY = 'ONBOARDING_COMPLETE';

export type Gender = 'male' | 'female' | 'other';
export type SkillLevel = 'beginner' | 'moderate' | 'advanced';

export type Sport =
  | 'running'
  | 'biking'
  | 'swimming'
  | 'boxing'
  | 'tennis'
  | 'gym'
  | 'yoga'
  | 'crossfit'
  | 'soccer'
  | 'basketball';

export interface SportSelection {
  sport: Sport;
  skillLevel: SkillLevel;
}

export interface AthleteProfile {
  // Basic Info
  firstName: string;
  lastName: string;
  email?: string;
  gender: Gender;

  // Physical
  weight: number; // kg
  height: number; // cm

  // Sports & Training
  sports: SportSelection[];
  primaryGoal: string;
  weeklyTrainingDays: number;

  // Legacy fields for compatibility
  trainingPhase: 'Base' | 'Build' | 'Peak' | 'Recovery';
}

// Default profile
const DEFAULT_PROFILE: AthleteProfile = {
  firstName: '',
  lastName: '',
  gender: 'male',
  weight: 70,
  height: 175,
  sports: [],
  primaryGoal: '',
  weeklyTrainingDays: 4,
  trainingPhase: 'Base',
};

// In-memory cache
let athleteProfile: AthleteProfile = { ...DEFAULT_PROFILE };
let onboardingComplete = false;

// Body parts trained by each sport
export const sportMuscleGroups: Record<Sport, string[]> = {
  running: ['legs', 'core', 'cardio'],
  biking: ['legs', 'core', 'cardio'],
  swimming: ['shoulders', 'back', 'arms', 'core', 'cardio'],
  boxing: ['arms', 'shoulders', 'core', 'cardio'],
  tennis: ['arms', 'shoulders', 'legs', 'core'],
  gym: ['full-body'],
  yoga: ['core', 'flexibility', 'back'],
  crossfit: ['full-body', 'cardio'],
  soccer: ['legs', 'core', 'cardio'],
  basketball: ['legs', 'arms', 'core', 'cardio'],
};

// Coach messages based on training phase
export function getCoachMessage(phase: AthleteProfile['trainingPhase']): string {
  const messages: Record<AthleteProfile['trainingPhase'], string> = {
    Base: "Building your foundation. Keep efforts consistent and trust the process.",
    Build: "Time to push your limits. Progressive overload is the key.",
    Peak: "You're ready. Maintain fitness, stay sharp, and perform.",
    Recovery: "Let your body adapt. Rest is where growth happens.",
  };
  return messages[phase];
}

// Get intensity based on training phase
export function getPhaseIntensity(phase: AthleteProfile['trainingPhase']): 'low' | 'moderate' | 'high' | 'recovery' {
  const intensityMap: Record<AthleteProfile['trainingPhase'], 'low' | 'moderate' | 'high' | 'recovery'> = {
    Base: 'low',
    Build: 'moderate',
    Peak: 'high',
    Recovery: 'recovery',
  };
  return intensityMap[phase];
}

// Get display name for sport
export function getSportDisplayName(sport: Sport): string {
  const names: Record<Sport, string> = {
    running: 'Running',
    biking: 'Biking',
    swimming: 'Swimming',
    boxing: 'Boxing',
    tennis: 'Tennis',
    gym: 'Gym',
    yoga: 'Yoga',
    crossfit: 'CrossFit',
    soccer: 'Soccer',
    basketball: 'Basketball',
  };
  return names[sport];
}

// Get all available sports
export function getAvailableSports(): Sport[] {
  return ['running', 'biking', 'swimming', 'boxing', 'tennis', 'gym', 'yoga', 'crossfit', 'soccer', 'basketball'];
}

/**
 * Load athlete profile from secure storage
 */
export async function loadAthleteProfile(): Promise<AthleteProfile> {
  try {
    const stored = await SecureStore.getItemAsync(ATHLETE_PROFILE_KEY);
    if (stored) {
      athleteProfile = { ...DEFAULT_PROFILE, ...JSON.parse(stored) };
    }
    return athleteProfile;
  } catch (error) {
    console.error('Failed to load athlete profile:', error);
    return athleteProfile;
  }
}

/**
 * Save athlete profile to secure storage
 */
export async function saveAthleteProfile(profile: AthleteProfile): Promise<void> {
  try {
    await SecureStore.setItemAsync(ATHLETE_PROFILE_KEY, JSON.stringify(profile));
    athleteProfile = profile;
  } catch (error) {
    console.error('Failed to save athlete profile:', error);
    throw error;
  }
}

/**
 * Get current athlete profile from memory
 */
export function getAthleteProfile(): AthleteProfile {
  return athleteProfile;
}

/**
 * Check if onboarding is complete
 */
export async function checkOnboardingComplete(): Promise<boolean> {
  try {
    const stored = await SecureStore.getItemAsync(ONBOARDING_COMPLETE_KEY);
    onboardingComplete = stored === 'true';
    return onboardingComplete;
  } catch (error) {
    console.error('Failed to check onboarding status:', error);
    return false;
  }
}

/**
 * Mark onboarding as complete
 */
export async function setOnboardingComplete(): Promise<void> {
  try {
    await SecureStore.setItemAsync(ONBOARDING_COMPLETE_KEY, 'true');
    onboardingComplete = true;
  } catch (error) {
    console.error('Failed to save onboarding status:', error);
    throw error;
  }
}

/**
 * Get onboarding status from memory
 */
export function isOnboardingComplete(): boolean {
  return onboardingComplete;
}

/**
 * Reset onboarding (for testing)
 */
export async function resetOnboarding(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(ONBOARDING_COMPLETE_KEY);
    await SecureStore.deleteItemAsync(ATHLETE_PROFILE_KEY);
    onboardingComplete = false;
    athleteProfile = { ...DEFAULT_PROFILE };
  } catch (error) {
    console.error('Failed to reset onboarding:', error);
  }
}

/**
 * Get full name
 */
export function getFullName(profile: AthleteProfile): string {
  return `${profile.firstName} ${profile.lastName}`.trim() || 'Athlete';
}

/**
 * Get primary sport
 */
export function getPrimarySport(profile: AthleteProfile): Sport | null {
  return profile.sports.length > 0 ? profile.sports[0].sport : null;
}

/**
 * Get all trained muscle groups from user's sports
 */
export function getTrainedMuscleGroups(profile: AthleteProfile): string[] {
  const muscles = new Set<string>();
  profile.sports.forEach(({ sport }) => {
    sportMuscleGroups[sport]?.forEach((muscle) => muscles.add(muscle));
  });
  return Array.from(muscles);
}
