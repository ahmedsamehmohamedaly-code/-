import React, { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Calendar,
  Check,
  Clock,
  Dumbbell,
  Flame,
  Play,
  Trophy,
  X,
} from 'lucide-react';
import {
  Exercise,
  Language,
  ProgramDay,
  WeightUnit,
  WorkoutProgram,
  WorkoutSession,
} from '../types/gym';
import { t } from '../i18n/translations';
import {
  convertWeight,
  extractPersonalRecords,
  formatDuration,
  formatVolume,
} from '../utils/calculations';

interface DashboardViewProps {
  lang: Language;
  unit: WeightUnit;
  sessions: WorkoutSession[];
  programs: WorkoutProgram[];
  exercises: Exercise[];
  hasActiveWorkout: boolean;
  onStartEmptyWorkout: () => void;
  onStartProgramDay: (program: WorkoutProgram, day: ProgramDay) => void;
  onResumeWorkout: () => void;
  onGoToPrograms: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  lang,
  unit,
  sessions,
  programs,
  exercises,
  hasActiveWorkout,
  onStartEmptyWorkout,
  onStartProgramDay,
  onResumeWorkout,
  onGoToPrograms,
}) => {
  const copy = t(lang);
  const [selectedSession, setSelectedSession] = useState<WorkoutSession | null>(null);
  const [heroImgError, setHeroImgError] = useState(false);

  const exerciseMap = useMemo(() => {
    const map: Record<string, Exercise> = {};
    exercises.forEach((ex) => {
      map[ex.id] = ex;
    });
    return map;
  }, [exercises]);

  const stats = useMemo(() => {
    const now = Date.now();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

    const weeklyVolume = sessions
      .filter((s) => now - new Date(s.startedAt).getTime() <= sevenDaysMs)
      .reduce((sum, s) => sum + s.totalVolumeKg, 0);

    const monthlySessions = sessions.filter(
      (s) => now - new Date(s.startedAt).getTime() <= thirtyDaysMs
    ).length;

    const uniqueDays = new Set(sessions.map((s) => s.startedAt.slice(0, 10))).size;
    const prs = Object.keys(extractPersonalRecords(sessions)).length;

    return { weeklyVolume, monthlySessions, uniqueDays, prs };
  }, [sessions]);

  const weekDays = useMemo(() => {
    const result: Array<{ dateStr: string; label: string; dayNum: string; trained: boolean }> = [];
    const today = new Date();
    // Show last 6 days + today
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const trained = sessions.some((s) => s.startedAt.slice(0, 10) === dateStr);
      const label = d.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { weekday: 'short' });
      const dayNum = String(d.getDate());
      result.push({ dateStr, label, dayNum, trained });
    }
    return result;
  }, [sessions, lang]);

  const suggestedProgram = programs[0];
  const suggestedDay = suggestedProgram?.days[0];

  return (
    <div className="space-y-8">
      {/* Hero Split Banner + Suggested Next Session */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8 relative rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 min-h-[280px] flex flex-col justify-end bg-slate-900">
          {!heroImgError ? (
            <img
              src="/src/assets/images/gym_hero_banner_1795437317671.jpg"
              alt={lang === 'ar' ? 'صالة تدريب IronForge' : 'IronForge Strength Facility'}
              referrerPolicy="no-referrer"
              onError={() => setHeroImgError(true)}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-zinc-900 to-orange-950/50 flex items-center justify-center">
              <Dumbbell className="w-16 h-16 text-orange-500/20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/20" />

          <div className="relative z-10 p-6 lg:p-8 max-w-2xl space-y-4">
            <p className="text-xs font-medium text-orange-400 tracking-wide">
              {copy.heroKicker}
            </p>
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight text-balance">
              {copy.heroTitle}
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
              {copy.heroSubtitle}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              {hasActiveWorkout ? (
                <button
                  onClick={onResumeWorkout}
                  className="min-h-[44px] px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
                >
                  <Flame className="w-4 h-4" />
                  <span>{copy.resumeWorkoutCta}</span>
                </button>
              ) : (
                <button
                  onClick={onStartEmptyWorkout}
                  className="min-h-[44px] px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{copy.startEmptySession}</span>
                </button>
              )}

              <button
                onClick={onGoToPrograms}
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-sm font-medium flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
              >
                <span>{copy.nav.programs}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Suggested Next Workout Card */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#13161E] p-6 flex flex-col justify-between gap-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>{copy.suggestedNext}</span>
              <span aria-hidden="true">·</span>
              <span>{suggestedProgram?.name[lang]}</span>
            </div>

            {suggestedDay ? (
              <>
                <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                  {suggestedDay.name[lang]}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {suggestedDay.focus[lang]}
                </p>

                <ul className="pt-2 divide-y divide-slate-100 dark:divide-white/6">
                  {suggestedDay.exercises.slice(0, 4).map((item) => {
                    const ex = exerciseMap[item.exerciseId];
                    return (
                      <li
                        key={item.exerciseId}
                        className="py-2 flex items-center justify-between gap-3 text-sm"
                      >
                        <span className="text-slate-800 dark:text-slate-200 truncate">
                          {ex ? ex.name[lang] : item.exerciseId}
                        </span>
                        <span className="font-mono-num text-xs text-slate-500 dark:text-slate-400 shrink-0">
                          {item.targetSets} × {item.targetReps}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </>
            ) : null}
          </div>

          {suggestedProgram && suggestedDay && (
            <button
              onClick={() => onStartProgramDay(suggestedProgram, suggestedDay)}
              className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-200 text-sm font-semibold flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{copy.programs.startDay}</span>
            </button>
          )}
        </div>
      </section>

      {/* 4-Column KPI Strip */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#13161E] p-5 space-y-1.5">
          <p className="text-xs text-slate-500 dark:text-slate-400">{copy.kpi.weeklyVolume}</p>
          <p className="font-mono-num text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
            {formatVolume(stats.weeklyVolume, unit)}{' '}
            <span className="text-sm font-normal text-slate-500">{copy.common[unit]}</span>
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#13161E] p-5 space-y-1.5">
          <p className="text-xs text-slate-500 dark:text-slate-400">{copy.kpi.workoutsCompleted}</p>
          <p className="font-mono-num text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
            {stats.monthlySessions}{' '}
            <span className="text-sm font-normal text-slate-500">{copy.kpi.sessions}</span>
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#13161E] p-5 space-y-1.5">
          <p className="text-xs text-slate-500 dark:text-slate-400">{copy.kpi.currentStreak}</p>
          <p className="font-mono-num text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
            {stats.uniqueDays}{' '}
            <span className="text-sm font-normal text-slate-500">{copy.kpi.days}</span>
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#13161E] p-5 space-y-1.5">
          <p className="text-xs text-slate-500 dark:text-slate-400">{copy.kpi.totalPRs}</p>
          <p className="font-mono-num text-2xl lg:text-3xl font-bold text-orange-500">
            {stats.prs}{' '}
            <span className="text-sm font-normal text-slate-500">{copy.kpi.records}</span>
          </p>
        </div>
      </section>

      {/* Weekly Activity Strip + Recent Sessions */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 7-day Calendar */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#13161E] p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">
              {copy.weeklySchedule}
            </h2>
            <Calendar className="w-4 h-4 text-slate-400" />
          </div>

          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day) => (
              <div
                key={day.dateStr}
                className={`py-3 px-1 rounded-xl border flex flex-col items-center gap-2 transition-colors ${
                  day.trained
                    ? 'border-orange-500/40 bg-orange-500/10 text-orange-600 dark:text-orange-400'
                    : 'border-slate-200 dark:border-white/8 text-slate-500 dark:text-slate-400'
                }`}
              >
                <span className="text-[11px] font-medium truncate max-w-full">{day.label}</span>
                <span className="font-mono-num text-sm font-bold">{day.dayNum}</span>
                <span className="w-5 h-5 rounded-full flex items-center justify-center">
                  {day.trained ? (
                    <Check className="w-3.5 h-3.5 text-orange-500" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Sessions List */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#13161E] p-6 space-y-4">
          <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">
            {copy.recentSessions}
          </h2>

          {sessions.length === 0 ? (
            <div className="py-10 text-center space-y-3">
              <p className="text-sm text-slate-500 dark:text-slate-400">{copy.noSessions}</p>
              <button
                onClick={onStartEmptyWorkout}
                className="min-h-[40px] px-4 py-2 rounded-xl bg-orange-500 text-white text-sm font-semibold"
              >
                {copy.startWorkoutCta}
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-white/8">
              {sessions.slice(0, 5).map((session) => {
                const totalSets = session.exercises.reduce(
                  (acc, ex) => acc + ex.sets.filter((s) => s.completed).length,
                  0
                );
                const dateFormatted = new Date(session.startedAt).toLocaleDateString(
                  lang === 'ar' ? 'ar-EG' : 'en-US',
                  { month: 'short', day: 'numeric' }
                );

                return (
                  <button
                    key={session.id}
                    onClick={() => setSelectedSession(session)}
                    className="w-full py-3.5 px-2 -mx-2 rounded-xl hover:bg-slate-50 dark:hover:bg-white/4 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-start"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2.5">
                        <span className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                          {session.title}
                        </span>
                        {session.prCount > 0 && (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400 shrink-0">
                            <Trophy className="w-3.5 h-3.5" />
                            <span>
                              {session.prCount} {copy.prLabel}
                            </span>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span>{dateFormatted}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono-num">
                          {session.exercises.length} {copy.exercisesCount}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono-num">
                          {totalSets} {copy.setsCount}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono-num text-slate-600 dark:text-slate-300 shrink-0">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {formatDuration(session.durationSeconds)}
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {formatVolume(session.totalVolumeKg, unit)} {copy.common[unit]}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Session Details Modal */}
      {selectedSession && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#13161E] p-6 space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {copy.common.sessionSummary}
                </p>
                <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedSession.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono-num">
                  <span>{new Date(selectedSession.startedAt).toLocaleDateString()}</span>
                  <span aria-hidden="true">·</span>
                  <span>{formatDuration(selectedSession.durationSeconds)}</span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {formatVolume(selectedSession.totalVolumeKg, unit)} {copy.common[unit]}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedSession(null)}
                className="min-h-[40px] min-w-[40px] rounded-xl border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white"
                aria-label={copy.common.close}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-white/8">
              {selectedSession.exercises.map((exLog) => {
                const ex = exerciseMap[exLog.exerciseId];
                return (
                  <div key={exLog.id} className="py-3.5 space-y-2">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                      {ex ? ex.name[lang] : exLog.exerciseId}
                    </h4>
                    <div className="space-y-1">
                      {exLog.sets.map((s, idx) => (
                        <div
                          key={s.id}
                          className="flex items-center justify-between text-xs font-mono-num text-slate-600 dark:text-slate-300"
                        >
                          <span className="text-slate-400">#{idx + 1}</span>
                          <span>
                            {convertWeight(s.weight, unit)} {copy.common[unit]} × {s.reps}
                          </span>
                          <span className="w-16 text-end">
                            {s.isPR ? (
                              <span className="text-amber-500 font-semibold">{copy.prLabel}</span>
                            ) : (
                              '—'
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
