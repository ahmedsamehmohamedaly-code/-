import React, { useMemo, useState } from 'react';
import { Plus, Scale, Trophy } from 'lucide-react';
import {
  BodyMetricEntry,
  Exercise,
  Language,
  MuscleGroup,
  PersonalRecord,
  WeightUnit,
  WorkoutSession,
} from '../types/gym';
import { MUSCLE_LABELS, t } from '../i18n/translations';
import { convertWeight, formatVolume } from '../utils/calculations';

interface AnalyticsViewProps {
  lang: Language;
  unit: WeightUnit;
  sessions: WorkoutSession[];
  exercises: Exercise[];
  personalRecords: Record<string, PersonalRecord>;
  bodyMetrics: BodyMetricEntry[];
  onAddBodyMetric: (entry: BodyMetricEntry) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  lang,
  unit,
  sessions,
  exercises,
  personalRecords,
  bodyMetrics,
  onAddBodyMetric,
}) => {
  const copy = t(lang);
  const [hoveredBarIdx, setHoveredBarIdx] = useState<number | null>(null);
  const [weightInput, setWeightInput] = useState('79.5');
  const [fatInput, setFatInput] = useState('15.2');

  const exerciseMap = useMemo(() => {
    const map: Record<string, Exercise> = {};
    exercises.forEach((e) => {
      map[e.id] = e;
    });
    return map;
  }, [exercises]);

  const chartSessions = useMemo(() => {
    return [...sessions]
      .sort((a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime())
      .slice(-8);
  }, [sessions]);

  const maxVolume = useMemo(() => {
    return Math.max(1000, ...chartSessions.map((s) => s.totalVolumeKg));
  }, [chartSessions]);

  // Weekly working sets by muscle group (last 7 days)
  const muscleSets = useMemo(() => {
    const counts: Record<MuscleGroup, number> = {
      chest: 0,
      back: 0,
      shoulders: 0,
      legs: 0,
      arms: 0,
      core: 0,
    };
    const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;

    sessions
      .filter((s) => new Date(s.startedAt).getTime() >= cutoff)
      .forEach((session) => {
        session.exercises.forEach((exLog) => {
          const ex = exerciseMap[exLog.exerciseId];
          if (!ex) return;
          const completed = exLog.sets.filter((st) => st.completed).length;
          counts[ex.muscle] += completed;
        });
      });

    return counts;
  }, [sessions, exerciseMap]);

  const sortedPRs = useMemo(() => {
    return Object.values(personalRecords).sort(
      (a, b) => b.estimated1RM - a.estimated1RM
    );
  }, [personalRecords]);

  const sortedBodyMetrics = useMemo(() => {
    return [...bodyMetrics].sort((a, b) => a.date.localeCompare(b.date));
  }, [bodyMetrics]);

  const weightDelta = useMemo(() => {
    if (sortedBodyMetrics.length < 2) return 0;
    const first = sortedBodyMetrics[0].weightKg;
    const last = sortedBodyMetrics[sortedBodyMetrics.length - 1].weightKg;
    return Math.round((last - first) * 10) / 10;
  }, [sortedBodyMetrics]);

  const handleAddMetric = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weightInput);
    const f = parseFloat(fatInput);
    if (!w || w <= 0) return;

    onAddBodyMetric({
      id: `bm-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      weightKg: w,
      bodyFatPercent: !Number.isNaN(f) && f > 0 ? f : undefined,
    });
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      <div className="space-y-1">
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
          {copy.analytics.title}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {copy.analytics.subtitle}
        </p>
      </div>

      {/* Volume Progression Chart + Muscle Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#13161E] p-6 space-y-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">
              {copy.analytics.volumeChartTitle}
            </h2>
            {hoveredBarIdx !== null && chartSessions[hoveredBarIdx] && (
              <span className="font-mono-num text-xs font-semibold text-orange-500">
                {formatVolume(chartSessions[hoveredBarIdx].totalVolumeKg, unit)}{' '}
                {copy.common[unit]}
              </span>
            )}
          </div>

          {chartSessions.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-500">{copy.noSessions}</p>
          ) : (
            <div className="h-56 flex items-end gap-3 pt-6">
              {chartSessions.map((s, idx) => {
                const heightPct = Math.max(10, Math.round((s.totalVolumeKg / maxVolume) * 100));
                const dateLabel = new Date(s.startedAt).toLocaleDateString(
                  lang === 'ar' ? 'ar-EG' : 'en-US',
                  { month: 'numeric', day: 'numeric' }
                );
                return (
                  <div
                    key={s.id}
                    onMouseEnter={() => setHoveredBarIdx(idx)}
                    onMouseLeave={() => setHoveredBarIdx(null)}
                    className="flex-1 h-full flex flex-col justify-end items-center gap-2 group cursor-pointer"
                  >
                    <span className="font-mono-num text-[11px] text-slate-400 group-hover:text-orange-500 transition-colors">
                      {formatVolume(s.totalVolumeKg, unit)}
                    </span>
                    <div className="w-full max-w-[44px] flex-1 flex items-end">
                      <div
                        className="w-full rounded-t-lg bg-orange-500/80 group-hover:bg-orange-500 transition-all"
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <span className="font-mono-num text-[11px] text-slate-500 dark:text-slate-400">
                      {dateLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Muscle Sets Distribution */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#13161E] p-6 space-y-4">
          <div>
            <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">
              {copy.analytics.muscleDistributionTitle}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {copy.analytics.muscleTargetNote}
            </p>
          </div>

          <div className="space-y-3 pt-1">
            {(Object.keys(MUSCLE_LABELS) as MuscleGroup[]).map((muscle) => {
              const sets = muscleSets[muscle];
              const pct = Math.min(100, Math.round((sets / 20) * 100));
              return (
                <div key={muscle} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {MUSCLE_LABELS[muscle][lang]}
                    </span>
                    <span className="font-mono-num font-semibold text-slate-900 dark:text-white">
                      {sets} / 20 {copy.setsCount}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-white/8 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        sets >= 10 ? 'bg-emerald-500' : 'bg-orange-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* PR Wall + Body Weight Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#13161E] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">
              {copy.analytics.prWallTitle}
            </h2>
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-white/8">
                  <th className="py-2 text-start font-medium">{copy.nav.exercises}</th>
                  <th className="py-2 text-end font-medium">{copy.liveSession.weightCol}</th>
                  <th className="py-2 text-end font-medium">{copy.liveSession.est1rmCol}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/6">
                {sortedPRs.slice(0, 8).map((pr) => {
                  const ex = exerciseMap[pr.exerciseId];
                  return (
                    <tr key={pr.exerciseId}>
                      <td className="py-3 font-medium text-slate-900 dark:text-white">
                        {ex ? ex.name[lang] : pr.exerciseId}
                      </td>
                      <td className="py-3 text-end font-mono-num text-slate-600 dark:text-slate-300">
                        {convertWeight(pr.maxWeight, unit)} {copy.common[unit]} × {pr.repsAtMax}
                      </td>
                      <td className="py-3 text-end font-mono-num font-bold text-orange-500">
                        {convertWeight(pr.estimated1RM, unit)} {copy.common[unit]}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Body Composition Log */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#13161E] p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">
                {copy.analytics.bodyTrackerTitle}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono-num">
                {copy.analytics.changeSinceStart}:{' '}
                <span className={weightDelta <= 0 ? 'text-emerald-500' : 'text-orange-500'}>
                  {weightDelta > 0 ? `+${weightDelta}` : weightDelta} {copy.common.kg}
                </span>
              </p>
            </div>
            <Scale className="w-4 h-4 text-slate-400" />
          </div>

          <form onSubmit={handleAddMetric} className="grid grid-cols-3 gap-2">
            <input
              type="number"
              step="0.1"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              placeholder={copy.analytics.bodyWeight}
              className="min-h-[40px] px-3 rounded-xl border border-slate-200 dark:border-white/12 bg-slate-50 dark:bg-[#0B0D11] font-mono-num text-xs text-slate-900 dark:text-white"
            />
            <input
              type="number"
              step="0.1"
              value={fatInput}
              onChange={(e) => setFatInput(e.target.value)}
              placeholder={copy.analytics.bodyFat}
              className="min-h-[40px] px-3 rounded-xl border border-slate-200 dark:border-white/12 bg-slate-50 dark:bg-[#0B0D11] font-mono-num text-xs text-slate-900 dark:text-white"
            />
            <button
              type="submit"
              className="min-h-[40px] px-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{copy.common.save}</span>
            </button>
          </form>

          <div className="divide-y divide-slate-100 dark:divide-white/6 max-h-56 overflow-y-auto">
            {[...sortedBodyMetrics].reverse().map((entry) => (
              <div
                key={entry.id}
                className="py-2.5 flex items-center justify-between text-xs font-mono-num"
              >
                <span className="text-slate-500 dark:text-slate-400">{entry.date}</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {entry.weightKg} {copy.common.kg}
                </span>
                <span className="text-slate-500 dark:text-slate-400">
                  {entry.bodyFatPercent ? `${entry.bodyFatPercent}%` : '—'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
