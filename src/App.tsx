import { useEffect, useMemo, useState } from 'react';
import { DEFAULT_EXERCISES } from './data/exercises';
import {
  DEFAULT_PROGRAMS,
  INITIAL_BODY_METRICS,
  INITIAL_SESSIONS,
} from './data/programs';
import {
  BodyMetricEntry,
  Exercise,
  Language,
  ProgramDay,
  TabId,
  ThemeMode,
  WeightUnit,
  WorkoutExerciseLog,
  WorkoutProgram,
  WorkoutSession,
} from './types/gym';
import { extractPersonalRecords, playTimerBeep } from './utils/calculations';
import { MobileBottomNav, Sidebar, TopHeader } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { ActiveWorkoutState, LiveWorkoutView } from './components/LiveWorkoutView';
import { ProgramsView } from './components/ProgramsView';
import { ExercisesView } from './components/ExercisesView';
import { AnalyticsView } from './components/AnalyticsView';
import { ToolsView } from './components/ToolsView';

const STORAGE_KEYS = {
  lang: 'ironforge_lang',
  theme: 'ironforge_theme',
  unit: 'ironforge_unit',
  sessions: 'ironforge_sessions',
  customPrograms: 'ironforge_custom_programs',
  customExercises: 'ironforge_custom_exercises',
  bodyMetrics: 'ironforge_body_metrics',
};

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [lang, setLang] = useState<Language>(() =>
    readJson<Language>(STORAGE_KEYS.lang, 'ar')
  );
  const [theme, setTheme] = useState<ThemeMode>(() =>
    readJson<ThemeMode>(STORAGE_KEYS.theme, 'dark')
  );
  const [unit, setUnit] = useState<WeightUnit>(() =>
    readJson<WeightUnit>(STORAGE_KEYS.unit, 'kg')
  );

  const [activeTab, setActiveTab] = useState<TabId>('dashboard');

  const [sessions, setSessions] = useState<WorkoutSession[]>(() =>
    readJson<WorkoutSession[]>(STORAGE_KEYS.sessions, INITIAL_SESSIONS)
  );
  const [customPrograms, setCustomPrograms] = useState<WorkoutProgram[]>(() =>
    readJson<WorkoutProgram[]>(STORAGE_KEYS.customPrograms, [])
  );
  const [customExercises, setCustomExercises] = useState<Exercise[]>(() =>
    readJson<Exercise[]>(STORAGE_KEYS.customExercises, [])
  );
  const [bodyMetrics, setBodyMetrics] = useState<BodyMetricEntry[]>(() =>
    readJson<BodyMetricEntry[]>(STORAGE_KEYS.bodyMetrics, INITIAL_BODY_METRICS)
  );

  // Live Workout State
  const [activeWorkout, setActiveWorkout] = useState<ActiveWorkoutState | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Rest Timer State
  const [restRemainingSeconds, setRestRemainingSeconds] = useState<number>(0);
  const [restDurationSeconds, setRestDurationSeconds] = useState<number>(90);
  const [autoRest, setAutoRest] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const allExercises = useMemo(
    () => [...customExercises, ...DEFAULT_EXERCISES],
    [customExercises]
  );

  const allPrograms = useMemo(
    () => [...customPrograms, ...DEFAULT_PROGRAMS],
    [customPrograms]
  );

  const personalRecords = useMemo(
    () => extractPersonalRecords(sessions),
    [sessions]
  );

  // Sync HTML attributes for RTL/LTR & Light/Dark
  useEffect(() => {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem(STORAGE_KEYS.lang, JSON.stringify(lang));
  }, [lang]);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle('dark', theme === 'dark');
    localStorage.setItem(STORAGE_KEYS.theme, JSON.stringify(theme));
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.unit, JSON.stringify(unit));
  }, [unit]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.sessions, JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.customPrograms, JSON.stringify(customPrograms));
  }, [customPrograms]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.customExercises, JSON.stringify(customExercises));
  }, [customExercises]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.bodyMetrics, JSON.stringify(bodyMetrics));
  }, [bodyMetrics]);

  // Active workout stopwatch tick
  useEffect(() => {
    if (!activeWorkout) return;
    const interval = window.setInterval(() => {
      const started = new Date(activeWorkout.startedAt).getTime();
      setElapsedSeconds(Math.max(0, Math.floor((Date.now() - started) / 1000)));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [activeWorkout]);

  // Rest timer countdown tick
  useEffect(() => {
    if (restRemainingSeconds <= 0) return;
    const interval = window.setInterval(() => {
      setRestRemainingSeconds((prev) => {
        if (prev <= 1) {
          if (soundEnabled) playTimerBeep();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [restRemainingSeconds, soundEnabled]);

  const startEmptyWorkout = () => {
    setActiveWorkout({
      title: lang === 'ar' ? 'جلسة تمرين حرة' : 'Freestyle Workout',
      startedAt: new Date().toISOString(),
      exercises: [],
    });
    setElapsedSeconds(0);
    setActiveTab('workout');
  };

  const startProgramDay = (program: WorkoutProgram, day: ProgramDay) => {
    const logs: WorkoutExerciseLog[] = day.exercises.map((item, idx) => {
      const prevRecord = personalRecords[item.exerciseId];
      const baseWeight = prevRecord ? Math.round(prevRecord.maxWeight * 0.78) : 40;
      const repNum = parseInt(item.targetReps, 10) || 10;

      return {
        id: `log-${Date.now()}-${idx}`,
        exerciseId: item.exerciseId,
        restSeconds: item.restSeconds,
        sets: Array.from({ length: item.targetSets }).map((_, sIdx) => ({
          id: `set-${Date.now()}-${idx}-${sIdx}`,
          weight: unit === 'lbs' ? Math.round(baseWeight * 2.2) : baseWeight,
          reps: repNum,
          completed: false,
        })),
      };
    });

    setActiveWorkout({
      title: `${day.name[lang]}`,
      programId: program.id,
      startedAt: new Date().toISOString(),
      exercises: logs,
    });
    setElapsedSeconds(0);
    setRestRemainingSeconds(0);
    setActiveTab('workout');
  };

  const finishWorkout = () => {
    if (!activeWorkout) return;
    let totalVolumeKg = 0;
    let prCount = 0;

    const cleanedExercises = activeWorkout.exercises
      .map((ex) => {
        const completedSets = ex.sets.filter((s) => s.completed);
        completedSets.forEach((s) => {
          const weightKg = unit === 'lbs' ? s.weight / 2.20462 : s.weight;
          totalVolumeKg += weightKg * s.reps;
          if (s.isPR) prCount++;
        });
        return {
          ...ex,
          sets: completedSets.map((s) => ({
            ...s,
            weight: unit === 'lbs' ? Math.round((s.weight / 2.20462) * 10) / 10 : s.weight,
          })),
        };
      })
      .filter((ex) => ex.sets.length > 0);

    if (cleanedExercises.length === 0) return;

    const newSession: WorkoutSession = {
      id: `session-${Date.now()}`,
      title:
        activeWorkout.title.trim() ||
        (lang === 'ar' ? 'جلسة تمرين' : 'Workout Session'),
      programId: activeWorkout.programId,
      startedAt: activeWorkout.startedAt,
      durationSeconds: Math.max(60, elapsedSeconds),
      exercises: cleanedExercises,
      totalVolumeKg: Math.round(totalVolumeKg),
      prCount,
    };

    setSessions((prev) => [newSession, ...prev]);
    setActiveWorkout(null);
    setElapsedSeconds(0);
    setRestRemainingSeconds(0);
    setActiveTab('dashboard');
  };

  const discardWorkout = () => {
    setActiveWorkout(null);
    setElapsedSeconds(0);
    setRestRemainingSeconds(0);
  };

  const handlePrimaryHeaderAction = () => {
    if (activeWorkout) {
      setActiveTab('workout');
    } else {
      startEmptyWorkout();
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#0B0D11] text-slate-900 dark:text-slate-100">
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        lang={lang}
        onToggleLang={() => setLang((l) => (l === 'ar' ? 'en' : 'ar'))}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        unit={unit}
        onToggleUnit={() => setUnit((u) => (u === 'kg' ? 'lbs' : 'kg'))}
        hasActiveWorkout={Boolean(activeWorkout)}
        activeElapsedSeconds={elapsedSeconds}
        onPrimaryAction={handlePrimaryHeaderAction}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader
          activeTab={activeTab}
          lang={lang}
          hasActiveWorkout={Boolean(activeWorkout)}
          activeElapsedSeconds={elapsedSeconds}
          onPrimaryAction={handlePrimaryHeaderAction}
          onToggleLang={() => setLang((l) => (l === 'ar' ? 'en' : 'ar'))}
          onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
          theme={theme}
        />

        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {activeTab === 'dashboard' && (
            <DashboardView
              lang={lang}
              unit={unit}
              sessions={sessions}
              programs={allPrograms}
              exercises={allExercises}
              hasActiveWorkout={Boolean(activeWorkout)}
              onStartEmptyWorkout={startEmptyWorkout}
              onStartProgramDay={startProgramDay}
              onResumeWorkout={() => setActiveTab('workout')}
              onGoToPrograms={() => setActiveTab('programs')}
            />
          )}

          {activeTab === 'workout' && (
            <LiveWorkoutView
              lang={lang}
              unit={unit}
              activeWorkout={activeWorkout}
              elapsedSeconds={elapsedSeconds}
              restRemainingSeconds={restRemainingSeconds}
              restDurationSeconds={restDurationSeconds}
              autoRest={autoRest}
              soundEnabled={soundEnabled}
              allExercises={allExercises}
              programs={allPrograms}
              personalRecords={personalRecords}
              onStartEmpty={startEmptyWorkout}
              onLoadProgramDay={startProgramDay}
              onUpdateWorkout={setActiveWorkout}
              onTriggerRest={(sec) => {
                setRestDurationSeconds(sec);
                setRestRemainingSeconds(sec);
              }}
              onAdjustRest={(delta) =>
                setRestRemainingSeconds((prev) => Math.max(0, prev + delta))
              }
              onSkipRest={() => setRestRemainingSeconds(0)}
              onToggleAutoRest={() => setAutoRest((v) => !v)}
              onToggleSound={() => setSoundEnabled((v) => !v)}
              onFinishWorkout={finishWorkout}
              onDiscardWorkout={discardWorkout}
            />
          )}

          {activeTab === 'programs' && (
            <ProgramsView
              lang={lang}
              programs={allPrograms}
              exercises={allExercises}
              onStartDay={startProgramDay}
              onAddProgram={(prog) => setCustomPrograms((prev) => [prog, ...prev])}
              onDeleteProgram={(id) =>
                setCustomPrograms((prev) => prev.filter((p) => p.id !== id))
              }
            />
          )}

          {activeTab === 'exercises' && (
            <ExercisesView
              lang={lang}
              unit={unit}
              exercises={allExercises}
              personalRecords={personalRecords}
              onAddExercise={(ex) => setCustomExercises((prev) => [ex, ...prev])}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView
              lang={lang}
              unit={unit}
              sessions={sessions}
              exercises={allExercises}
              personalRecords={personalRecords}
              bodyMetrics={bodyMetrics}
              onAddBodyMetric={(entry) =>
                setBodyMetrics((prev) => [...prev, entry])
              }
            />
          )}

          {activeTab === 'tools' && <ToolsView lang={lang} unit={unit} />}
        </main>
      </div>

      <MobileBottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        lang={lang}
        hasActiveWorkout={Boolean(activeWorkout)}
      />
    </div>
  );
}
