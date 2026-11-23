import React, { useMemo, useState } from 'react';
import { Calculator, Flame, Gauge } from 'lucide-react';
import { Language, WeightUnit } from '../types/gym';
import { t } from '../i18n/translations';
import { calculate1RM, calculatePlatesPerSide } from '../utils/calculations';

interface ToolsViewProps {
  lang: Language;
  unit: WeightUnit;
}

export const ToolsView: React.FC<ToolsViewProps> = ({ lang, unit: defaultUnit }) => {
  const copy = t(lang);

  // 1. Plate Loader State
  const [plateUnit, setPlateUnit] = useState<WeightUnit>(defaultUnit);
  const [targetWeight, setTargetWeight] = useState<number>(defaultUnit === 'kg' ? 100 : 225);
  const [barWeight, setBarWeight] = useState<number>(defaultUnit === 'kg' ? 20 : 45);

  const plateResult = useMemo(
    () => calculatePlatesPerSide(targetWeight, barWeight, plateUnit),
    [targetWeight, barWeight, plateUnit]
  );

  // 2. 1RM Calculator State
  const [rmWeight, setRmWeight] = useState<number>(90);
  const [rmReps, setRmReps] = useState<number>(6);

  const estimated1RM = useMemo(
    () => calculate1RM(rmWeight, rmReps),
    [rmWeight, rmReps]
  );

  // 3. TDEE & Macro Planner State
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<number>(26);
  const [heightCm, setHeightCm] = useState<number>(178);
  const [bodyWeightKg, setBodyWeightKg] = useState<number>(80);
  const [activityMult, setActivityMult] = useState<number>(1.55);
  const [goal, setGoal] = useState<'cut' | 'maintain' | 'bulk'>('lean' as never);
  const [goalMode, setGoalMode] = useState<'cut' | 'maintain' | 'bulk'>('maintain');

  // Keep goal state clean
  void goal;
  void setGoal;

  const macroPlan = useMemo(() => {
    const baseBmr =
      10 * bodyWeightKg +
      6.25 * heightCm -
      5 * age +
      (gender === 'male' ? 5 : -161);
    const tdee = Math.round(baseBmr * activityMult);
    const offset = goalMode === 'cut' ? -450 : goalMode === 'bulk' ? 300 : 0;
    const calories = Math.max(1200, tdee + offset);
    const proteinGrams = Math.round(bodyWeightKg * 2.0);
    const fatGrams = Math.round((calories * 0.25) / 9);
    const carbGrams = Math.max(
      50,
      Math.round((calories - proteinGrams * 4 - fatGrams * 9) / 4)
    );
    return { calories, proteinGrams, fatGrams, carbGrams };
  }, [gender, age, heightCm, bodyWeightKg, activityMult, goalMode]);

  const handleSwitchPlateUnit = (next: WeightUnit) => {
    setPlateUnit(next);
    if (next === 'kg') {
      setBarWeight(20);
      setTargetWeight(100);
    } else {
      setBarWeight(45);
      setTargetWeight(225);
    }
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      <div className="space-y-1">
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
          {copy.tools.title}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {copy.tools.subtitle}
        </p>
      </div>

      {/* Tool 1: Visual Barbell Plate Loader */}
      <section className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#13161E] p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Calculator className="w-5 h-5 text-orange-500" />
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              {copy.tools.plateCalcTitle}
            </h2>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-white/6">
            {(['kg', 'lbs'] as WeightUnit[]).map((u) => (
              <button
                key={u}
                onClick={() => handleSwitchPlateUnit(u)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono-num font-semibold transition-colors ${
                  plateUnit === u
                    ? 'bg-white dark:bg-[#1E222E] text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500'
                }`}
              >
                {u.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
              {copy.tools.targetWeight} ({plateUnit.toUpperCase()})
            </label>
            <input
              type="number"
              step={plateUnit === 'kg' ? '2.5' : '5'}
              min={barWeight}
              value={targetWeight}
              onChange={(e) => setTargetWeight(parseFloat(e.target.value) || barWeight)}
              className="w-full min-h-[44px] px-3.5 rounded-xl border border-slate-200 dark:border-white/12 bg-slate-50 dark:bg-[#0B0D11] font-mono-num text-base font-bold text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
              {copy.tools.barWeight} ({plateUnit.toUpperCase()})
            </label>
            <select
              value={barWeight}
              onChange={(e) => setBarWeight(parseFloat(e.target.value))}
              className="w-full min-h-[44px] px-3.5 rounded-xl border border-slate-200 dark:border-white/12 bg-slate-50 dark:bg-[#0B0D11] font-mono-num text-sm text-slate-900 dark:text-white"
            >
              {plateUnit === 'kg' ? (
                <>
                  <option value={20}>20 kg (Olympic Men)</option>
                  <option value={15}>15 kg (Olympic Women)</option>
                  <option value={10}>10 kg (EZ / Technique)</option>
                </>
              ) : (
                <>
                  <option value={45}>45 lbs (Standard)</option>
                  <option value={35}>35 lbs (Women)</option>
                  <option value={25}>25 lbs (EZ Bar)</option>
                </>
              )}
            </select>
          </div>

          <div className="rounded-xl bg-slate-50 dark:bg-[#0B0D11] border border-slate-200 dark:border-white/8 p-3.5 flex flex-col justify-center">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {copy.tools.exactAchievable}
            </span>
            <span className="font-mono-num text-xl font-bold text-orange-500 mt-0.5">
              {plateResult.exactTotal} {plateUnit}
            </span>
          </div>
        </div>

        {/* Visual Barbell Sleeve Render */}
        <div
          dir="ltr"
          className="rounded-xl bg-slate-100 dark:bg-[#0B0D11] border border-slate-200 dark:border-white/8 p-6 overflow-x-auto"
        >
          <div className="min-w-[420px] h-40 flex items-center justify-center">
            {/* Left Sleeve */}
            <div className="flex items-center flex-row-reverse">
              <div className="w-6 h-4 bg-zinc-400 dark:bg-zinc-600 rounded-s-sm" />
              <div className="flex items-center flex-row-reverse gap-1">
                {plateResult.plates.flatMap((p) =>
                  Array.from({ length: p.countPerSide }).map((_, idx) => (
                    <div
                      key={`L-${p.weight}-${idx}`}
                      className={`rounded-sm border flex items-center justify-center font-mono-num text-[10px] font-bold shadow-sm ${p.colorClass}`}
                      style={{
                        height: `${p.heightPercent * 1.3}px`,
                        width: `${p.widthPx}px`,
                      }}
                    >
                      <span className="-rotate-90 whitespace-nowrap">{p.weight}</span>
                    </div>
                  ))
                )}
              </div>
              <div className="w-3 h-7 bg-zinc-500 dark:bg-zinc-500 rounded-sm mx-0.5" />
            </div>

            {/* Center Barbell Shaft */}
            <div className="w-28 sm:w-40 h-3 bg-gradient-to-b from-zinc-300 to-zinc-500 dark:from-zinc-500 dark:to-zinc-700" />

            {/* Right Sleeve */}
            <div className="flex items-center">
              <div className="w-3 h-7 bg-zinc-500 dark:bg-zinc-500 rounded-sm mx-0.5" />
              <div className="flex items-center gap-1">
                {plateResult.plates.flatMap((p) =>
                  Array.from({ length: p.countPerSide }).map((_, idx) => (
                    <div
                      key={`R-${p.weight}-${idx}`}
                      className={`rounded-sm border flex items-center justify-center font-mono-num text-[10px] font-bold shadow-sm ${p.colorClass}`}
                      style={{
                        height: `${p.heightPercent * 1.3}px`,
                        width: `${p.widthPx}px`,
                      }}
                    >
                      <span className="-rotate-90 whitespace-nowrap">{p.weight}</span>
                    </div>
                  ))
                )}
              </div>
              <div className="w-6 h-4 bg-zinc-400 dark:bg-zinc-600 rounded-e-sm" />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-white/8 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-slate-600 dark:text-slate-300 font-medium">
              {copy.tools.perSide}:{' '}
              <span className="font-mono-num font-bold text-slate-900 dark:text-white">
                {plateResult.plates.length === 0
                  ? '0'
                  : plateResult.plates
                      .map((p) => `${p.countPerSide} × ${p.weight}${plateUnit}`)
                      .join(' + ')}
              </span>
            </span>

            {plateResult.remainder > 0 && (
              <span className="text-amber-600 dark:text-amber-400">
                {copy.tools.remainderWarning}: {plateResult.remainder} {plateUnit}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Tool 2 & 3: 1RM Calculator & TDEE Macro Planner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 1RM & Percentage Table */}
        <section className="lg:col-span-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#13161E] p-6 space-y-5">
          <div className="flex items-center gap-2.5">
            <Gauge className="w-5 h-5 text-orange-500" />
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              {copy.tools.oneRmTitle}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                {copy.tools.liftedWeight} ({copy.common[defaultUnit]})
              </label>
              <input
                type="number"
                min="1"
                value={rmWeight}
                onChange={(e) => setRmWeight(parseFloat(e.target.value) || 0)}
                className="w-full min-h-[42px] px-3 rounded-xl border border-slate-200 dark:border-white/12 bg-slate-50 dark:bg-[#0B0D11] font-mono-num text-sm font-bold text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                {copy.tools.repsPerformed}
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={rmReps}
                onChange={(e) => setRmReps(parseInt(e.target.value, 10) || 1)}
                className="w-full min-h-[42px] px-3 rounded-xl border border-slate-200 dark:border-white/12 bg-slate-50 dark:bg-[#0B0D11] font-mono-num text-sm font-bold text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="rounded-xl bg-orange-500/10 border border-orange-500/25 p-4 flex items-center justify-between">
            <span className="text-xs font-medium text-orange-700 dark:text-orange-300">
              {copy.tools.estimatedMax}
            </span>
            <span className="font-mono-num text-2xl font-bold text-orange-500">
              {estimated1RM} {copy.common[defaultUnit]}
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {[95, 90, 85, 80, 75, 70].map((pct) => (
              <div
                key={pct}
                className="rounded-xl border border-slate-200 dark:border-white/8 p-2.5 text-center"
              >
                <p className="font-mono-num text-[11px] text-slate-500">{pct}%</p>
                <p className="font-mono-num text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  {Math.round((estimated1RM * pct) / 100)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* TDEE & Macro Planner */}
        <section className="lg:col-span-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#13161E] p-6 space-y-5">
          <div className="flex items-center gap-2.5">
            <Flame className="w-5 h-5 text-orange-500" />
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              {copy.tools.macroTitle}
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                {copy.tools.gender}
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                className="w-full min-h-[40px] px-2.5 rounded-xl border border-slate-200 dark:border-white/12 bg-slate-50 dark:bg-[#0B0D11] text-xs text-slate-900 dark:text-white"
              >
                <option value="male">{copy.tools.male}</option>
                <option value="female">{copy.tools.female}</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                {copy.tools.age}
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value, 10) || 20)}
                className="w-full min-h-[40px] px-3 rounded-xl border border-slate-200 dark:border-white/12 bg-slate-50 dark:bg-[#0B0D11] font-mono-num text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                {copy.tools.heightCm}
              </label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(parseInt(e.target.value, 10) || 170)}
                className="w-full min-h-[40px] px-3 rounded-xl border border-slate-200 dark:border-white/12 bg-slate-50 dark:bg-[#0B0D11] font-mono-num text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                {copy.tools.weightKg}
              </label>
              <input
                type="number"
                value={bodyWeightKg}
                onChange={(e) => setBodyWeightKg(parseFloat(e.target.value) || 70)}
                className="w-full min-h-[40px] px-3 rounded-xl border border-slate-200 dark:border-white/12 bg-slate-50 dark:bg-[#0B0D11] font-mono-num text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select
              value={activityMult}
              onChange={(e) => setActivityMult(parseFloat(e.target.value))}
              className="min-h-[40px] px-3 rounded-xl border border-slate-200 dark:border-white/12 bg-slate-50 dark:bg-[#0B0D11] text-xs text-slate-900 dark:text-white"
            >
              <option value={1.375}>
                {lang === 'ar' ? 'نشاط خفيف (1–3 أيام/أسبوع)' : 'Light (1–3 days/wk)'}
              </option>
              <option value={1.55}>
                {lang === 'ar' ? 'نشاط متوسط (3–5 أيام/أسبوع)' : 'Moderate (3–5 days/wk)'}
              </option>
              <option value={1.725}>
                {lang === 'ar' ? 'نشاط عالٍ (6–7 أيام/أسبوع)' : 'High (6–7 days/wk)'}
              </option>
            </select>

            <select
              value={goalMode}
              onChange={(e) => setGoalMode(e.target.value as 'cut' | 'maintain' | 'bulk')}
              className="min-h-[40px] px-3 rounded-xl border border-slate-200 dark:border-white/12 bg-slate-50 dark:bg-[#0B0D11] text-xs text-slate-900 dark:text-white"
            >
              <option value="cut">{copy.tools.cut}</option>
              <option value="maintain">{copy.tools.maintain}</option>
              <option value="bulk">{copy.tools.bulk}</option>
            </select>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="rounded-xl bg-orange-500/10 border border-orange-500/25 p-3">
              <p className="text-[11px] text-orange-600 dark:text-orange-400">
                {copy.tools.dailyCalories}
              </p>
              <p className="font-mono-num text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                {macroPlan.calories}{' '}
                <span className="text-[11px] font-normal text-slate-500">{copy.tools.kcal}</span>
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-white/8 p-3">
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {copy.tools.protein}
              </p>
              <p className="font-mono-num text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                {macroPlan.proteinGrams} {copy.tools.grams}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-white/8 p-3">
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {copy.tools.carbs}
              </p>
              <p className="font-mono-num text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                {macroPlan.carbGrams} {copy.tools.grams}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-white/8 p-3">
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {copy.tools.fats}
              </p>
              <p className="font-mono-num text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                {macroPlan.fatGrams} {copy.tools.grams}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
