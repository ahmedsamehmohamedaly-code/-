import React, { useMemo, useState } from 'react';
import { Dumbbell, Plus, Search, Trophy, X } from 'lucide-react';
import {
  EquipmentType,
  Exercise,
  Language,
  MuscleGroup,
  PersonalRecord,
  WeightUnit,
} from '../types/gym';
import { EQUIPMENT_LABELS, MUSCLE_LABELS, t } from '../i18n/translations';
import { convertWeight } from '../utils/calculations';

interface ExercisesViewProps {
  lang: Language;
  unit: WeightUnit;
  exercises: Exercise[];
  personalRecords: Record<string, PersonalRecord>;
  onAddExercise: (exercise: Exercise) => void;
}

export const ExercisesView: React.FC<ExercisesViewProps> = ({
  lang,
  unit,
  exercises,
  personalRecords,
  onAddExercise,
}) => {
  const copy = t(lang);
  const [search, setSearch] = useState('');
  const [muscleFilter, setMuscleFilter] = useState<MuscleGroup | 'all'>('all');
  const [equipmentFilter, setEquipmentFilter] = useState<EquipmentType | 'all'>('all');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Add Exercise Form State
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [newMuscle, setNewMuscle] = useState<MuscleGroup>('chest');
  const [newEquipment, setNewEquipment] = useState<EquipmentType>('dumbbell');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return exercises.filter((ex) => {
      const mMatch = muscleFilter === 'all' || ex.muscle === muscleFilter;
      const eMatch = equipmentFilter === 'all' || ex.equipment === equipmentFilter;
      const sMatch =
        !q ||
        ex.name.ar.toLowerCase().includes(q) ||
        ex.name.en.toLowerCase().includes(q);
      return mMatch && eMatch && sMatch;
    });
  }, [exercises, search, muscleFilter, equipmentFilter]);

  const handleCreateExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr.trim() && !nameEn.trim()) return;
    const ar = nameAr.trim() || nameEn.trim();
    const en = nameEn.trim() || nameAr.trim();

    const created: Exercise = {
      id: `custom-ex-${Date.now()}`,
      name: { ar, en },
      muscle: newMuscle,
      secondaryMuscles: [],
      equipment: newEquipment,
      cues: {
        ar: ['تحكم في سرعة النزول وحافظ على استقرار المفصل والتركيز على العضلة المستهدفة.'],
        en: ['Control the eccentric phase and maintain joint stability throughout every rep.'],
      },
      isCustom: true,
    };
    onAddExercise(created);
    setNameAr('');
    setNameEn('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            {copy.exercises.title}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {copy.exercises.subtitle}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="min-h-[44px] px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{copy.exercises.addCustom}</span>
        </button>
      </div>

      {/* Search and Filter Controls */}
      <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#13161E] p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={copy.exercises.searchPlaceholder}
              className="w-full min-h-[42px] ps-10 pe-4 rounded-xl border border-slate-200 dark:border-white/12 bg-slate-50 dark:bg-[#0B0D11] text-sm text-slate-900 dark:text-white focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div className="md:col-span-4">
            <select
              value={equipmentFilter}
              onChange={(e) => setEquipmentFilter(e.target.value as EquipmentType | 'all')}
              className="w-full min-h-[42px] px-3.5 rounded-xl border border-slate-200 dark:border-white/12 bg-slate-50 dark:bg-[#0B0D11] text-sm text-slate-900 dark:text-white focus:border-orange-500 focus:outline-none"
            >
              <option value="all">{copy.exercises.allEquipment}</option>
              {(Object.keys(EQUIPMENT_LABELS) as EquipmentType[]).map((eq) => (
                <option key={eq} value={eq}>
                  {EQUIPMENT_LABELS[eq][lang]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setMuscleFilter('all')}
            className={`min-h-[36px] px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              muscleFilter === 'all'
                ? 'bg-orange-500 text-white'
                : 'bg-slate-100 dark:bg-white/6 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {copy.exercises.allMuscles}
          </button>
          {(Object.keys(MUSCLE_LABELS) as MuscleGroup[]).map((m) => (
            <button
              key={m}
              onClick={() => setMuscleFilter(m)}
              className={`min-h-[36px] px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                muscleFilter === m
                  ? 'bg-orange-500 text-white'
                  : 'bg-slate-100 dark:bg-white/6 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {MUSCLE_LABELS[m][lang]}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#13161E] p-12 text-center space-y-3">
          <Dumbbell className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {lang === 'ar' ? 'لا توجد تمارين مطابقة للبحث.' : 'No exercises match your current filter.'}
          </p>
          <button
            onClick={() => {
              setSearch('');
              setMuscleFilter('all');
              setEquipmentFilter('all');
            }}
            className="min-h-[38px] px-4 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-semibold"
          >
            {copy.common.clearFilter}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((ex) => {
            const pr = personalRecords[ex.id];
            return (
              <button
                key={ex.id}
                onClick={() => setSelectedExercise(ex)}
                className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#13161E] p-5 text-start hover:border-orange-500/50 transition-colors flex flex-col justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>{MUSCLE_LABELS[ex.muscle][lang]}</span>
                    <span aria-hidden="true">·</span>
                    <span>{EQUIPMENT_LABELS[ex.equipment][lang]}</span>
                  </div>
                  <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">
                    {ex.name[lang]}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {ex.cues[lang][0]}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-white/8 flex items-center justify-between text-xs">
                  {pr ? (
                    <span className="inline-flex items-center gap-1.5 font-mono-num font-semibold text-amber-600 dark:text-amber-400">
                      <Trophy className="w-3.5 h-3.5" />
                      <span>
                        1RM: {convertWeight(pr.estimated1RM, unit)} {copy.common[unit]}
                      </span>
                    </span>
                  ) : (
                    <span className="text-slate-400 dark:text-slate-500">
                      {copy.exercises.formCues}
                    </span>
                  )}
                  <span className="text-orange-500 font-medium">{copy.common.viewDetails}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#13161E] p-6 space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span>{MUSCLE_LABELS[selectedExercise.muscle][lang]}</span>
                  <span aria-hidden="true">·</span>
                  <span>{EQUIPMENT_LABELS[selectedExercise.equipment][lang]}</span>
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                  {selectedExercise.name[lang]}
                </h3>
              </div>

              <button
                onClick={() => setSelectedExercise(null)}
                className="min-h-[40px] min-w-[40px] rounded-xl border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {selectedExercise.secondaryMuscles.length > 0 && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {copy.exercises.secondaryMuscles}:{' '}
                <span className="text-slate-800 dark:text-slate-200 font-medium">
                  {selectedExercise.secondaryMuscles
                    .map((m) => MUSCLE_LABELS[m][lang])
                    .join(' · ')}
                </span>
              </p>
            )}

            <div className="space-y-2.5">
              <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {copy.exercises.formCues}
              </h4>
              <ol className="space-y-2 list-decimal list-inside text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedExercise.cues[lang].map((cue, idx) => (
                  <li key={idx}>{cue}</li>
                ))}
              </ol>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-white/8">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                {copy.exercises.personalBest}
              </p>
              {personalRecords[selectedExercise.id] ? (
                <div className="flex items-center justify-between text-sm font-mono-num">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {convertWeight(personalRecords[selectedExercise.id].maxWeight, unit)}{' '}
                    {copy.common[unit]} × {personalRecords[selectedExercise.id].repsAtMax}
                  </span>
                  <span className="text-amber-500 font-semibold">
                    1RM: {convertWeight(personalRecords[selectedExercise.id].estimated1RM, unit)}{' '}
                    {copy.common[unit]}
                  </span>
                </div>
              ) : (
                <p className="text-xs text-slate-400">{copy.exercises.noRecordYet}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Exercise Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <form
            onSubmit={handleCreateExercise}
            className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#13161E] p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                {copy.exercises.addCustom}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="min-h-[40px] min-w-[40px] rounded-xl border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                {copy.exercises.exerciseNameAr}
              </label>
              <input
                type="text"
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                required={!nameEn}
                className="w-full min-h-[42px] px-3.5 rounded-xl border border-slate-200 dark:border-white/12 bg-slate-50 dark:bg-[#0B0D11] text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                {copy.exercises.exerciseNameEn}
              </label>
              <input
                type="text"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                className="w-full min-h-[42px] px-3.5 rounded-xl border border-slate-200 dark:border-white/12 bg-slate-50 dark:bg-[#0B0D11] text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  {copy.exercises.primaryMuscle}
                </label>
                <select
                  value={newMuscle}
                  onChange={(e) => setNewMuscle(e.target.value as MuscleGroup)}
                  className="w-full min-h-[42px] px-3 rounded-xl border border-slate-200 dark:border-white/12 bg-slate-50 dark:bg-[#0B0D11] text-sm text-slate-900 dark:text-white"
                >
                  {(Object.keys(MUSCLE_LABELS) as MuscleGroup[]).map((m) => (
                    <option key={m} value={m}>
                      {MUSCLE_LABELS[m][lang]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  {copy.exercises.allEquipment}
                </label>
                <select
                  value={newEquipment}
                  onChange={(e) => setNewEquipment(e.target.value as EquipmentType)}
                  className="w-full min-h-[42px] px-3 rounded-xl border border-slate-200 dark:border-white/12 bg-slate-50 dark:bg-[#0B0D11] text-sm text-slate-900 dark:text-white"
                >
                  {(Object.keys(EQUIPMENT_LABELS) as EquipmentType[]).map((eq) => (
                    <option key={eq} value={eq}>
                      {EQUIPMENT_LABELS[eq][lang]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="min-h-[40px] px-4 rounded-xl border border-slate-200 dark:border-white/12 text-sm text-slate-600 dark:text-slate-300"
              >
                {copy.programs.cancel}
              </button>
              <button
                type="submit"
                className="min-h-[40px] px-5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold"
              >
                {copy.exercises.saveExercise}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
