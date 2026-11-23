import { PersonalRecord, WeightUnit, WorkoutSession } from '../types/gym';

/** Epley Formula for estimated 1-Rep Max */
export function calculate1RM(weight: number, reps: number): number {
  if (weight <= 0 || reps <= 0) return 0;
  if (reps === 1) return Math.round(weight * 10) / 10;
  return Math.round(weight * (1 + reps / 30) * 10) / 10;
}

export function formatDuration(totalSeconds: number): string {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  if (hrs > 0) {
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  }
  return `${pad(mins)}:${pad(secs)}`;
}

export function formatVolume(kg: number, unit: WeightUnit = 'kg'): string {
  const value = unit === 'lbs' ? Math.round(kg * 2.20462) : Math.round(kg);
  return value.toLocaleString('en-US');
}

export function convertWeight(kg: number, unit: WeightUnit): number {
  if (unit === 'lbs') return Math.round(kg * 2.20462 * 10) / 10;
  return Math.round(kg * 10) / 10;
}

export interface PlateBreakdownItem {
  weight: number;
  countPerSide: number;
  colorClass: string;
  heightPercent: number;
  widthPx: number;
}

const KG_PLATES: Array<{ weight: number; colorClass: string; heightPercent: number; widthPx: number }> = [
  { weight: 25, colorClass: 'bg-red-600 border-red-400/50 text-white', heightPercent: 100, widthPx: 22 },
  { weight: 20, colorClass: 'bg-blue-600 border-blue-400/50 text-white', heightPercent: 95, widthPx: 20 },
  { weight: 15, colorClass: 'bg-amber-500 border-amber-300/60 text-slate-950', heightPercent: 86, widthPx: 18 },
  { weight: 10, colorClass: 'bg-emerald-600 border-emerald-400/50 text-white', heightPercent: 76, widthPx: 16 },
  { weight: 5, colorClass: 'bg-slate-200 border-slate-400 text-slate-950', heightPercent: 62, widthPx: 14 },
  { weight: 2.5, colorClass: 'bg-zinc-700 border-zinc-500 text-white', heightPercent: 50, widthPx: 12 },
  { weight: 1.25, colorClass: 'bg-zinc-500 border-zinc-300 text-white', heightPercent: 40, widthPx: 10 },
];

const LBS_PLATES: Array<{ weight: number; colorClass: string; heightPercent: number; widthPx: number }> = [
  { weight: 45, colorClass: 'bg-blue-600 border-blue-400/50 text-white', heightPercent: 100, widthPx: 22 },
  { weight: 35, colorClass: 'bg-amber-500 border-amber-300/60 text-slate-950', heightPercent: 90, widthPx: 19 },
  { weight: 25, colorClass: 'bg-emerald-600 border-emerald-400/50 text-white', heightPercent: 80, widthPx: 17 },
  { weight: 10, colorClass: 'bg-slate-200 border-slate-400 text-slate-950', heightPercent: 66, widthPx: 14 },
  { weight: 5, colorClass: 'bg-zinc-700 border-zinc-500 text-white', heightPercent: 52, widthPx: 12 },
  { weight: 2.5, colorClass: 'bg-zinc-500 border-zinc-300 text-white', heightPercent: 42, widthPx: 10 },
];

export function calculatePlatesPerSide(
  targetWeight: number,
  barWeight: number,
  unit: WeightUnit
): { plates: PlateBreakdownItem[]; exactTotal: number; remainder: number } {
  const catalog = unit === 'kg' ? KG_PLATES : LBS_PLATES;
  if (targetWeight <= barWeight) {
    return { plates: [], exactTotal: barWeight, remainder: 0 };
  }
  let perSide = (targetWeight - barWeight) / 2;
  const plates: PlateBreakdownItem[] = [];
  let loadedPerSide = 0;

  for (const plate of catalog) {
    const count = Math.floor((perSide + 0.0001) / plate.weight);
    if (count > 0) {
      plates.push({
        weight: plate.weight,
        countPerSide: count,
        colorClass: plate.colorClass,
        heightPercent: plate.heightPercent,
        widthPx: plate.widthPx,
      });
      loadedPerSide += count * plate.weight;
      perSide -= count * plate.weight;
    }
  }

  const exactTotal = Math.round((barWeight + loadedPerSide * 2) * 100) / 100;
  const remainder = Math.round(perSide * 2 * 100) / 100;

  return { plates, exactTotal, remainder };
}

export function extractPersonalRecords(sessions: WorkoutSession[]): Record<string, PersonalRecord> {
  const records: Record<string, PersonalRecord> = {};

  for (const session of sessions) {
    for (const ex of session.exercises) {
      for (const set of ex.sets) {
        if (!set.completed || set.weight <= 0 || set.reps <= 0) continue;
        const est1RM = calculate1RM(set.weight, set.reps);
        const existing = records[ex.exerciseId];
        if (!existing || est1RM > existing.estimated1RM) {
          records[ex.exerciseId] = {
            exerciseId: ex.exerciseId,
            maxWeight: Math.max(existing?.maxWeight ?? 0, set.weight),
            repsAtMax: set.reps,
            estimated1RM: est1RM,
            achievedAt: session.startedAt,
          };
        } else if (set.weight > existing.maxWeight) {
          existing.maxWeight = set.weight;
        }
      }
    }
  }

  return records;
}

export function playTimerBeep(): void {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    [0, 0.18].forEach((offset, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(idx === 0 ? 740 : 987.77, now + offset);
      gain.gain.setValueAtTime(0.001, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.18, now + offset + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.16);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.17);
    });
  } catch {
    // Ignore audio context restrictions if blocked by browser
  }
}
