import React, { useMemo, useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Dumbbell,
  Layers,
  Play,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import {
  Exercise,
  Language,
  ProgramDay,
  ProgramExerciseTemplate,
  WorkoutProgram,
} from '../types/gym';
import { MUSCLE_LABELS, t } from '../i18n/translations';

interface ProgramsViewProps {
  lang: Language;
  programs: WorkoutProgram[];
  exercises: Exercise[];
  onStartDay: (program: WorkoutProgram, day: ProgramDay) => void;
  onAddProgram: (program: WorkoutProgram) => void;
  onDeleteProgram: (programId: string) => void;
}

export const ProgramsView: React.FC<ProgramsViewProps> = ({
  lang,
  programs,
  exercises,
  onStartDay,
  onAddProgram,
  onDeleteProgram,
}) => {
  const copy = t(lang);
  const [expandedId, setExpandedId] = useState<string>(programs[0]?.id ?? '');
  const [showBuilder, setShowBuilder] = useState(false);
  const [imgFailed, setImgFailed] = useState<Record<string, boolean>>({});

  const exerciseMap = useMemo(() => {
    const map: Record<string, Exercise> = {};
    exercises.forEach((ex) => {
      map[ex.id] = ex;
    });
    return map;
  }, [exercises]);

  // Custom Program Builder State
  const [customName, setCustomName] = useState('');
  const [customDayTitle, setCustomDayTitle] = useState('');
  const [selectedExIds, setSelectedExIds] = useState<string[]>([
    'bench-press',
    'barbell-row',
    'barbell-squat',
  ]);

  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || selectedExIds.length === 0) return;
    const dayTitle = customDayTitle.trim() || (lang === 'ar' ? 'اليوم التدريبي 1' : 'Training Day 1');

    const newProgram: WorkoutProgram = {
      id: `custom-prog-${Date.now()}`,
      name: { ar: customName.trim(), en: customName.trim() },
      level: { ar: 'مخصص', en: 'Custom' },
      daysPerWeek: 3,
      description: {
        ar: 'برنامج تدريبي مخصص من تصميمك.',
        en: 'Custom training routine created by you.',
      },
      isCustom: true,
      days: [
        {
          id: `custom-day-${Date.now()}`,
          name: { ar: dayTitle, en: dayTitle },
          focus: {
            ar: `${selectedExIds.length} تمارين`,
            en: `${selectedExIds.length} exercises`,
          },
          exercises: selectedExIds.map<ProgramExerciseTemplate>((id) => ({
            exerciseId: id,
            targetSets: 3,
            targetReps: '8–12',
            restSeconds: 90,
          })),
        },
      ],
    };

    onAddProgram(newProgram);
    setExpandedId(newProgram.id);
    setCustomName('');
    setCustomDayTitle('');
    setShowBuilder(false);
  };

  const toggleExerciseSelection = (id: string) => {
    setSelectedExIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            {copy.programs.title}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {copy.programs.subtitle}
          </p>
        </div>

        <button
          onClick={() => setShowBuilder(true)}
          className="min-h-[44px] px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{copy.programs.createCustom}</span>
        </button>
      </div>

      <div className="space-y-4">
        {programs.map((prog) => {
          const isExpanded = expandedId === prog.id;
          return (
            <div
              key={prog.id}
              className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#13161E] overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
                {/* Media Column */}
                <div className="md:col-span-4 relative min-h-[160px] bg-slate-900 overflow-hidden">
                  {prog.image && !imgFailed[prog.id] ? (
                    <img
                      src={prog.image}
                      alt={prog.name[lang]}
                      referrerPolicy="no-referrer"
                      onError={() => setImgFailed((p) => ({ ...p, [prog.id]: true }))}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-zinc-900 to-orange-950/40 flex items-center justify-center">
                      <Layers className="w-10 h-10 text-orange-500/40" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/25" />
                </div>

                {/* Details Column */}
                <div className="md:col-span-8 p-6 flex flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span>{prog.level[lang]}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono-num">
                          {prog.daysPerWeek} {copy.programs.daysPerWeek}
                        </span>
                      </div>

                      {prog.isCustom && (
                        <button
                          onClick={() => onDeleteProgram(prog.id)}
                          aria-label={copy.programs.deleteProgram}
                          className="min-h-[36px] min-w-[36px] rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 flex items-center justify-center"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                      {prog.name[lang]}
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {prog.description[lang]}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => setExpandedId(isExpanded ? '' : prog.id)}
                      className="min-h-[40px] px-4 py-2 rounded-xl border border-slate-200 dark:border-white/12 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
                    >
                      <span>{prog.days.length} {lang === 'ar' ? 'أيام في الجدول' : 'Split Days'}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>

                    {prog.days[0] && (
                      <button
                        onClick={() => onStartDay(prog, prog.days[0])}
                        className="min-h-[40px] px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>{copy.programs.startDay}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Split Days */}
              {isExpanded && (
                <div className="border-t border-slate-100 dark:border-white/8 p-6 bg-slate-50/70 dark:bg-[#0E1117] grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {prog.days.map((day) => (
                    <div
                      key={day.id}
                      className="rounded-xl border border-slate-200 dark:border-white/8 bg-white dark:bg-[#13161E] p-5 flex flex-col justify-between gap-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                              {day.name[lang]}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              {day.focus[lang]}
                            </p>
                          </div>

                          <button
                            onClick={() => onStartDay(prog, day)}
                            className="min-h-[38px] px-3.5 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>{copy.programs.startDay}</span>
                          </button>
                        </div>

                        <ul className="divide-y divide-slate-100 dark:divide-white/6">
                          {day.exercises.map((item) => {
                            const ex = exerciseMap[item.exerciseId];
                            return (
                              <li
                                key={item.exerciseId}
                                className="py-2 flex items-center justify-between gap-3 text-xs"
                              >
                                <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                                  {ex ? ex.name[lang] : item.exerciseId}
                                </span>
                                <span className="font-mono-num text-slate-500 dark:text-slate-400 shrink-0">
                                  {item.targetSets} × {item.targetReps} · {item.restSeconds}s
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Custom Routine Builder Modal */}
      {showBuilder && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <form
            onSubmit={handleSaveCustom}
            className="w-full max-w-xl max-h-[85vh] flex flex-col rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#13161E] overflow-hidden"
          >
            <div className="p-5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-orange-500" />
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                  {copy.programs.createCustom}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowBuilder(false)}
                className="min-h-[40px] min-w-[40px] rounded-xl border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                  {copy.programs.customName}
                </label>
                <input
                  type="text"
                  required
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder={lang === 'ar' ? 'مثلاً: جدولي القوي 4 أيام' : 'e.g. Custom Strength Split'}
                  className="w-full min-h-[42px] px-3.5 rounded-xl border border-slate-200 dark:border-white/12 bg-slate-50 dark:bg-[#0B0D11] text-sm text-slate-900 dark:text-white focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                  {copy.programs.customDayName}
                </label>
                <input
                  type="text"
                  value={customDayTitle}
                  onChange={(e) => setCustomDayTitle(e.target.value)}
                  placeholder={lang === 'ar' ? 'مثلاً: يوم الصدر والظهر' : 'e.g. Chest & Back Day'}
                  className="w-full min-h-[42px] px-3.5 rounded-xl border border-slate-200 dark:border-white/12 bg-slate-50 dark:bg-[#0B0D11] text-sm text-slate-900 dark:text-white focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  {copy.liveSession.addExercise} ({selectedExIds.length})
                </p>
                <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 dark:divide-white/6 border border-slate-200 dark:border-white/10 rounded-xl">
                  {exercises.map((ex) => {
                    const checked = selectedExIds.includes(ex.id);
                    return (
                      <button
                        type="button"
                        key={ex.id}
                        onClick={() => toggleExerciseSelection(ex.id)}
                        className={`w-full px-3.5 py-2.5 flex items-center justify-between text-start text-sm transition-colors ${
                          checked
                            ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 font-semibold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
                        }`}
                      >
                        <span>{ex.name[lang]}</span>
                        <span className="text-xs text-slate-400">
                          {MUSCLE_LABELS[ex.muscle][lang]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowBuilder(false)}
                className="min-h-[40px] px-4 rounded-xl border border-slate-200 dark:border-white/12 text-sm text-slate-600 dark:text-slate-300"
              >
                {copy.programs.cancel}
              </button>
              <button
                type="submit"
                disabled={!customName.trim() || selectedExIds.length === 0}
                className="min-h-[40px] px-5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white text-sm font-semibold"
              >
                {copy.programs.saveProgram}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
