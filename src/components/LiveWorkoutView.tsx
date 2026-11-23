import React, { useMemo, useState } from 'react';
import {
  Check,
  Clock,
  Dumbbell,
  Layers,
  Plus,
  Search,
  Timer,
  Trash2,
  Trophy,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import {
  Exercise,
  Language,
  MuscleGroup,
  PersonalRecord,
  ProgramDay,
  WeightUnit,
  WorkoutExerciseLog,
  WorkoutProgram,
  WorkoutSet,
} from '../types/gym';
import { MUSCLE_LABELS, t } from '../i18n/translations';
import { calculate1RM, formatDuration, formatVolume } from '../utils/calculations';

export interface ActiveWorkoutState {
  title: string;
  programId?: string;
  startedAt: string;
  exercises: WorkoutExerciseLog[];
}

interface LiveWorkoutViewProps {
  lang: Language;
  unit: WeightUnit;
  activeWorkout: ActiveWorkoutState | null;
  elapsedSeconds: number;
  restRemainingSeconds: number;
  restDurationSeconds: number;
  autoRest: boolean;
  soundEnabled: boolean;
  allExercises: Exercise[];
  programs: WorkoutProgram[];
  personalRecords: Record<string, PersonalRecord>;
  onStartEmpty: () => void;
  onLoadProgramDay: (program: WorkoutProgram, day: ProgramDay) => void;
  onUpdateWorkout: (next: ActiveWorkoutState) => void;
  onTriggerRest: (seconds: number) => void;
  onAdjustRest: (deltaSeconds: number) => void;
  onSkipRest: () => void;
  onToggleAutoRest: () => void;
  onToggleSound: () => void;
  onFinishWorkout: () => void;
  onDiscardWorkout: () => void;
}

export const LiveWorkoutView: React.FC<LiveWorkoutViewProps> = ({
  lang,
  unit,
  activeWorkout,
  elapsedSeconds,
  restRemainingSeconds,
  restDurationSeconds,
  autoRest,
  soundEnabled,
  allExercises,
  programs,
  personalRecords,
  onStartEmpty,
  onLoadProgramDay,
  onUpdateWorkout,
  onTriggerRest,
  onAdjustRest,
  onSkipRest,
  onToggleAutoRest,
  onToggleSound,
  onFinishWorkout,
  onDiscardWorkout,
}) => {
  const copy = t(lang);
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [showProgramPicker, setShowProgramPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [muscleFilter, setMuscleFilter] = useState<MuscleGroup | 'all'>('all');

  const exerciseMap = useMemo(() => {
    const map: Record<string, Exercise> = {};
    allExercises.forEach((e) => {
      map[e.id] = e;
    });
    return map;
  }, [allExercises]);

  const filteredExercises = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allExercises.filter((ex) => {
      const matchesMuscle = muscleFilter === 'all' || ex.muscle === muscleFilter;
      const matchesSearch =
        !q ||
        ex.name.ar.toLowerCase().includes(q) ||
        ex.name.en.toLowerCase().includes(q);
      return matchesMuscle && matchesSearch;
    });
  }, [allExercises, searchQuery, muscleFilter]);

  const metrics = useMemo(() => {
    if (!activeWorkout) return { completedSets: 0, totalSets: 0, volumeKg: 0, prCount: 0 };
    let completedSets = 0;
    let totalSets = 0;
    let volumeKg = 0;
    let prCount = 0;

    for (const ex of activeWorkout.exercises) {
      for (const s of ex.sets) {
        totalSets++;
        if (s.completed) {
          completedSets++;
          const weightKg = unit === 'lbs' ? s.weight / 2.20462 : s.weight;
          volumeKg += weightKg * s.reps;
          if (s.isPR) prCount++;
        }
      }
    }
    return { completedSets, totalSets, volumeKg, prCount };
  }, [activeWorkout, unit]);

  if (!activeWorkout) {
    return (
      <div className="max-w-3xl mx-auto py-8 space-y-6">
        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#13161E] p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/12 text-orange-500 flex items-center justify-center mx-auto">
            <Dumbbell className="w-6 h-6" />
          </div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            {copy.liveSession.emptyTitle}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            {copy.liveSession.emptyDesc}
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onStartEmpty}
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
            >
              {copy.startEmptySession}
            </button>
            <button
              onClick={() => setShowProgramPicker(true)}
              className="min-h-[44px] px-5 py-2.5 rounded-xl border border-slate-200 dark:border-white/15 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 text-sm font-medium transition-colors whitespace-nowrap shrink-0"
            >
              {copy.liveSession.startFromTemplate}
            </button>
          </div>
        </div>

        {/* Quick Program Days */}
        <div className="space-y-3">
          <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">
            {copy.programs.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {programs.slice(0, 2).map((prog) =>
              prog.days.slice(0, 2).map((day) => (
                <button
                  key={day.id}
                  onClick={() => onLoadProgramDay(prog, day)}
                  className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#13161E] p-5 text-start hover:border-orange-500/50 transition-colors space-y-2"
                >
                  <p className="text-xs text-slate-500 dark:text-slate-400">{prog.name[lang]}</p>
                  <p className="font-display text-base font-bold text-slate-900 dark:text-white">
                    {day.name[lang]}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{day.focus[lang]}</p>
                </button>
              ))
            )}
          </div>
        </div>

        {showProgramPicker && (
          <ProgramPickerModal
            lang={lang}
            programs={programs}
            onClose={() => setShowProgramPicker(false)}
            onSelectDay={(prog, day) => {
              onLoadProgramDay(prog, day);
              setShowProgramPicker(false);
            }}
          />
        )}
      </div>
    );
  }

  const addExerciseToSession = (exercise: Exercise) => {
    const prevRecord = personalRecords[exercise.id];
    const defaultWeight = prevRecord ? Math.round(prevRecord.maxWeight * 0.8) : 20;
    const newLog: WorkoutExerciseLog = {
      id: `ex-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      exerciseId: exercise.id,
      restSeconds: 90,
      sets: [
        {
          id: `set-${Date.now()}-1`,
          weight: defaultWeight,
          reps: 10,
          completed: false,
        },
        {
          id: `set-${Date.now()}-2`,
          weight: defaultWeight,
          reps: 10,
          completed: false,
        },
        {
          id: `set-${Date.now()}-3`,
          weight: defaultWeight,
          reps: 10,
          completed: false,
        },
      ],
    };
    onUpdateWorkout({
      ...activeWorkout,
      exercises: [...activeWorkout.exercises, newLog],
    });
    setShowExercisePicker(false);
  };

  const removeExercise = (logId: string) => {
    onUpdateWorkout({
      ...activeWorkout,
      exercises: activeWorkout.exercises.filter((e) => e.id !== logId),
    });
  };

  const addSet = (logId: string) => {
    onUpdateWorkout({
      ...activeWorkout,
      exercises: activeWorkout.exercises.map((ex) => {
        if (ex.id !== logId) return ex;
        const last = ex.sets[ex.sets.length - 1];
        const nextSet: WorkoutSet = {
          id: `set-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          weight: last ? last.weight : 20,
          reps: last ? last.reps : 10,
          completed: false,
        };
        return { ...ex, sets: [...ex.sets, nextSet] };
      }),
    });
  };

  const removeSet = (logId: string, setId: string) => {
    onUpdateWorkout({
      ...activeWorkout,
      exercises: activeWorkout.exercises.map((ex) => {
        if (ex.id !== logId) return ex;
        return { ...ex, sets: ex.sets.filter((s) => s.id !== setId) };
      }),
    });
  };

  const updateSetField = (
    logId: string,
    setId: string,
    field: 'weight' | 'reps',
    value: number
  ) => {
    onUpdateWorkout({
      ...activeWorkout,
      exercises: activeWorkout.exercises.map((ex) => {
        if (ex.id !== logId) return ex;
        const prevBest = personalRecords[ex.exerciseId]?.estimated1RM ?? 0;
        return {
          ...ex,
          sets: ex.sets.map((s) => {
            if (s.id !== setId) return s;
            const updated = { ...s, [field]: Math.max(0, value) };
            if (updated.completed) {
              const weightKg = unit === 'lbs' ? updated.weight / 2.20462 : updated.weight;
              const est1RM = calculate1RM(weightKg, updated.reps);
              updated.isPR = prevBest > 0 && est1RM > prevBest;
            }
            return updated;
          }),
        };
      }),
    });
  };

  const toggleSetComplete = (logId: string, setId: string) => {
    let shouldStartRest = false;
    let restSec = 90;

    const nextExercises = activeWorkout.exercises.map((ex) => {
      if (ex.id !== logId) return ex;
      const prevBest = personalRecords[ex.exerciseId]?.estimated1RM ?? 0;
      restSec = ex.restSeconds;

      return {
        ...ex,
        sets: ex.sets.map((s) => {
          if (s.id !== setId) return s;
          const nextCompleted = !s.completed;
          if (nextCompleted && autoRest) {
            shouldStartRest = true;
          }
          const weightKg = unit === 'lbs' ? s.weight / 2.20462 : s.weight;
          const est1RM = calculate1RM(weightKg, s.reps);
          return {
            ...s,
            completed: nextCompleted,
            isPR: nextCompleted && prevBest > 0 && est1RM > prevBest,
          };
        }),
      };
    });

    onUpdateWorkout({
      ...activeWorkout,
      exercises: nextExercises,
    });

    if (shouldStartRest) {
      onTriggerRest(restSec);
    }
  };

  const restProgress =
    restDurationSeconds > 0
      ? Math.max(0, Math.min(100, (restRemainingSeconds / restDurationSeconds) * 100))
      : 0;

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Live Session Control Header */}
      <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#13161E] p-5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <input
            type="text"
            value={activeWorkout.title}
            onChange={(e) =>
              onUpdateWorkout({ ...activeWorkout, title: e.target.value })
            }
            placeholder={copy.liveSession.titlePlaceholder}
            className="font-display text-xl lg:text-2xl font-bold bg-transparent text-slate-900 dark:text-white border-b border-transparent focus:border-orange-500 focus:outline-none pb-1 w-full lg:max-w-md"
          />

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setShowExercisePicker(true)}
              className="min-h-[42px] px-4 py-2 rounded-xl border border-slate-200 dark:border-white/15 text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-white/5 text-sm font-medium flex items-center gap-2 whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{copy.liveSession.addExercise}</span>
            </button>

            <button
              onClick={onDiscardWorkout}
              className="min-h-[42px] px-3.5 py-2 rounded-xl border border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/10 text-sm font-medium whitespace-nowrap shrink-0"
            >
              {copy.liveSession.discardWorkout}
            </button>

            <button
              onClick={onFinishWorkout}
              disabled={metrics.completedSets === 0}
              className="min-h-[42px] px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
            >
              <Check className="w-4 h-4" />
              <span>{copy.liveSession.finishWorkout}</span>
            </button>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-3 gap-4 pt-3 border-t border-slate-100 dark:border-white/8">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{copy.liveSession.elapsed}</p>
            <p className="font-mono-num text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-0.5 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-orange-500" />
              {formatDuration(elapsedSeconds)}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {copy.liveSession.completedSets}
            </p>
            <p className="font-mono-num text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-0.5">
              {metrics.completedSets}{' '}
              <span className="text-sm font-normal text-slate-400">/ {metrics.totalSets}</span>
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {copy.liveSession.totalTonnage}
            </p>
            <p className="font-mono-num text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-0.5">
              {formatVolume(metrics.volumeKg, unit)}{' '}
              <span className="text-sm font-normal text-slate-400">{copy.common[unit]}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Smart Rest Timer Widget */}
      <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#13161E] p-4 sm:p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/12 text-orange-500 flex items-center justify-center shrink-0">
              <Timer className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {copy.liveSession.restTimer}
              </p>
              <p className="font-mono-num text-2xl font-bold text-slate-900 dark:text-white">
                {formatDuration(restRemainingSeconds)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[60, 90, 120, 180].map((sec) => (
              <button
                key={sec}
                onClick={() => onTriggerRest(sec)}
                className="min-h-[38px] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 text-xs font-mono-num font-medium text-slate-700 dark:text-slate-200 hover:border-orange-500/50 transition-colors"
              >
                {sec}s
              </button>
            ))}

            {restRemainingSeconds > 0 && (
              <>
                <button
                  onClick={() => onAdjustRest(-15)}
                  className="min-h-[38px] px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-white/8 text-xs font-mono-num font-medium text-slate-700 dark:text-slate-200"
                >
                  -15s
                </button>
                <button
                  onClick={() => onAdjustRest(15)}
                  className="min-h-[38px] px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-white/8 text-xs font-mono-num font-medium text-slate-700 dark:text-slate-200"
                >
                  +15s
                </button>
                <button
                  onClick={onSkipRest}
                  className="min-h-[38px] px-3 py-1.5 rounded-lg bg-orange-500/15 text-orange-600 dark:text-orange-400 text-xs font-semibold"
                >
                  {copy.liveSession.skipRest}
                </button>
              </>
            )}

            <button
              onClick={onToggleAutoRest}
              className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                autoRest
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'border-slate-200 dark:border-white/10 text-slate-500'
              }`}
            >
              {copy.liveSession.autoRest}
            </button>

            <button
              onClick={onToggleSound}
              aria-label="Toggle timer sound"
              className="min-h-[38px] min-w-[38px] rounded-lg border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {restRemainingSeconds > 0 && (
          <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-white/8 overflow-hidden">
            <div
              className="h-full bg-orange-500 transition-all duration-300"
              style={{ width: `${restProgress}%` }}
            />
          </div>
        )}
      </div>

      {/* Exercise Cards */}
      {activeWorkout.exercises.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-white/15 p-10 text-center space-y-3">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {copy.liveSession.emptyDesc}
          </p>
          <button
            onClick={() => setShowExercisePicker(true)}
            className="min-h-[42px] px-4 py-2 rounded-xl bg-orange-500 text-white text-sm font-semibold inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{copy.liveSession.addExercise}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {activeWorkout.exercises.map((exLog) => {
            const ex = exerciseMap[exLog.exerciseId];
            const prevBest = personalRecords[exLog.exerciseId];

            return (
              <div
                key={exLog.id}
                className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#13161E] p-5 space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                      {ex ? ex.name[lang] : exLog.exerciseId}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      {ex && <span>{MUSCLE_LABELS[ex.muscle][lang]}</span>}
                      {prevBest && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono-num">
                            {copy.liveSession.prevBest}: {prevBest.estimated1RM} {copy.common.kg}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => removeExercise(exLog.id)}
                    aria-label="Remove exercise"
                    className="min-h-[38px] min-w-[38px] rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Sets Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-white/8">
                        <th className="py-2 text-start font-medium w-12">{copy.liveSession.setCol}</th>
                        <th className="py-2 text-start font-medium">
                          {copy.liveSession.weightCol} ({copy.common[unit]})
                        </th>
                        <th className="py-2 text-start font-medium">{copy.liveSession.repsCol}</th>
                        <th className="py-2 text-start font-medium hidden sm:table-cell">
                          {copy.liveSession.est1rmCol}
                        </th>
                        <th className="py-2 text-end font-medium w-24">{copy.liveSession.doneCol}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/6">
                      {exLog.sets.map((s, idx) => {
                        const est1RM = calculate1RM(s.weight, s.reps);
                        return (
                          <tr
                            key={s.id}
                            className={`transition-colors ${
                              s.completed ? 'bg-emerald-500/6 dark:bg-emerald-500/8' : ''
                            }`}
                          >
                            <td className="py-2.5 font-mono-num font-semibold text-slate-500">
                              {idx + 1}
                            </td>
                            <td className="py-2 pe-2">
                              <input
                                type="number"
                                step="0.5"
                                min="0"
                                value={s.weight}
                                onChange={(e) =>
                                  updateSetField(
                                    exLog.id,
                                    s.id,
                                    'weight',
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="w-20 sm:w-24 min-h-[40px] px-2.5 rounded-lg border border-slate-200 dark:border-white/12 bg-slate-50 dark:bg-[#0B0D11] font-mono-num text-sm text-slate-900 dark:text-white focus:border-orange-500 focus:outline-none"
                              />
                            </td>
                            <td className="py-2 pe-2">
                              <input
                                type="number"
                                min="0"
                                value={s.reps}
                                onChange={(e) =>
                                  updateSetField(
                                    exLog.id,
                                    s.id,
                                    'reps',
                                    parseInt(e.target.value, 10) || 0
                                  )
                                }
                                className="w-16 sm:w-20 min-h-[40px] px-2.5 rounded-lg border border-slate-200 dark:border-white/12 bg-slate-50 dark:bg-[#0B0D11] font-mono-num text-sm text-slate-900 dark:text-white focus:border-orange-500 focus:outline-none"
                              />
                            </td>
                            <td className="py-2 hidden sm:table-cell font-mono-num text-xs text-slate-500 dark:text-slate-400">
                              <span className="inline-flex items-center gap-1.5">
                                <span>{est1RM > 0 ? est1RM : '—'}</span>
                                {s.isPR && (
                                  <span className="inline-flex items-center gap-1 text-amber-500 font-semibold">
                                    <Trophy className="w-3.5 h-3.5" />
                                    <span>{copy.prLabel}</span>
                                  </span>
                                )}
                              </span>
                            </td>
                            <td className="py-2 text-end">
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  onClick={() => toggleSetComplete(exLog.id, s.id)}
                                  aria-label="Mark set complete"
                                  className={`min-h-[40px] min-w-[40px] rounded-lg flex items-center justify-center transition-colors ${
                                    s.completed
                                      ? 'bg-emerald-600 text-white'
                                      : 'border border-slate-200 dark:border-white/15 text-slate-400 hover:border-emerald-500 hover:text-emerald-500'
                                  }`}
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => removeSet(exLog.id, s.id)}
                                  aria-label="Delete set"
                                  className="min-h-[40px] min-w-[32px] rounded-lg text-slate-400 hover:text-red-500 flex items-center justify-center"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <button
                  onClick={() => addSet(exLog.id)}
                  className="w-full min-h-[40px] rounded-xl border border-dashed border-slate-200 dark:border-white/12 text-xs font-medium text-slate-600 dark:text-slate-300 hover:border-orange-500/50 hover:text-orange-500 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{copy.liveSession.addSet}</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Exercise Picker Modal */}
      {showExercisePicker && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#13161E] overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between gap-4">
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                {copy.liveSession.addExercise}
              </h3>
              <button
                onClick={() => setShowExercisePicker(false)}
                className="min-h-[40px] min-w-[40px] rounded-xl border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 border-b border-slate-100 dark:border-white/8 space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={copy.exercises.searchPlaceholder}
                  className="w-full min-h-[42px] ps-10 pe-4 rounded-xl border border-slate-200 dark:border-white/12 bg-slate-50 dark:bg-[#0B0D11] text-sm text-slate-900 dark:text-white focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setMuscleFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    muscleFilter === 'all'
                      ? 'bg-orange-500 text-white'
                      : 'bg-slate-100 dark:bg-white/6 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {copy.exercises.allMuscles}
                </button>
                {(Object.keys(MUSCLE_LABELS) as MuscleGroup[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMuscleFilter(m)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      muscleFilter === m
                        ? 'bg-orange-500 text-white'
                        : 'bg-slate-100 dark:bg-white/6 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {MUSCLE_LABELS[m][lang]}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-white/6 p-2">
              {filteredExercises.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => addExerciseToSession(ex)}
                  className="w-full px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 flex items-center justify-between gap-3 text-start transition-colors"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {ex.name[lang]}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {MUSCLE_LABELS[ex.muscle][lang]}
                    </p>
                  </div>
                  <Plus className="w-4 h-4 text-orange-500 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ProgramPickerModal: React.FC<{
  lang: Language;
  programs: WorkoutProgram[];
  onClose: () => void;
  onSelectDay: (program: WorkoutProgram, day: ProgramDay) => void;
}> = ({ lang, programs, onClose, onSelectDay }) => {
  const copy = t(lang);
  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#13161E] overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-orange-500" />
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              {copy.liveSession.startFromTemplate}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="min-h-[40px] min-w-[40px] rounded-xl border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {programs.map((prog) => (
            <div key={prog.id} className="space-y-2.5">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {prog.name[lang]}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {prog.days.map((day) => (
                  <button
                    key={day.id}
                    onClick={() => onSelectDay(prog, day)}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-white/10 hover:border-orange-500/60 text-start transition-colors"
                  >
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {day.name[lang]}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {day.focus[lang]}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
