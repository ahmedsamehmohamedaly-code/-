export type Language = 'ar' | 'en';
export type ThemeMode = 'dark' | 'light';
export type WeightUnit = 'kg' | 'lbs';

export type TabId =
  | 'dashboard'
  | 'workout'
  | 'programs'
  | 'exercises'
  | 'analytics'
  | 'tools';

export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'legs'
  | 'arms'
  | 'core';

export type EquipmentType =
  | 'barbell'
  | 'dumbbell'
  | 'cable'
  | 'machine'
  | 'bodyweight'
  | 'kettlebell';

export interface BilingualText {
  ar: string;
  en: string;
}

export interface Exercise {
  id: string;
  name: BilingualText;
  muscle: MuscleGroup;
  secondaryMuscles: MuscleGroup[];
  equipment: EquipmentType;
  cues: {
    ar: string[];
    en: string[];
  };
  isCustom?: boolean;
}

export interface WorkoutSet {
  id: string;
  weight: number;
  reps: number;
  completed: boolean;
  isPR?: boolean;
}

export interface WorkoutExerciseLog {
  id: string;
  exerciseId: string;
  sets: WorkoutSet[];
  restSeconds: number;
  notes?: string;
}

export interface WorkoutSession {
  id: string;
  title: string;
  programId?: string;
  startedAt: string; // ISO
  durationSeconds: number;
  exercises: WorkoutExerciseLog[];
  totalVolumeKg: number;
  prCount: number;
}

export interface ProgramExerciseTemplate {
  exerciseId: string;
  targetSets: number;
  targetReps: string;
  restSeconds: number;
}

export interface ProgramDay {
  id: string;
  name: BilingualText;
  focus: BilingualText;
  exercises: ProgramExerciseTemplate[];
}

export interface WorkoutProgram {
  id: string;
  name: BilingualText;
  level: BilingualText;
  daysPerWeek: number;
  description: BilingualText;
  image?: string;
  days: ProgramDay[];
  isCustom?: boolean;
}

export interface BodyMetricEntry {
  id: string;
  date: string; // YYYY-MM-DD
  weightKg: number;
  bodyFatPercent?: number;
  note?: string;
}

export interface PersonalRecord {
  exerciseId: string;
  maxWeight: number;
  repsAtMax: number;
  estimated1RM: number;
  achievedAt: string;
}
